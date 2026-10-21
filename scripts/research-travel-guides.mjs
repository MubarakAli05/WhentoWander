#!/usr/bin/env node
/**
 * Public-source, facts-only travel importer. Run from any directory:
 *   node scripts/research-travel-guides.mjs
 *   node scripts/research-travel-guides.mjs --validate
 *   node scripts/research-travel-guides.mjs --split
 *   node --test scripts/research-travel-guides.test.mjs
 *
 * Completed imports also emit src/data/travelResearch/<countryId>.json for lazy
 * loading. --split regenerates these files from the aggregate without networking
 * or changing its facts/timestamps. --validate checks aggregate/split equality.
 *
 * Reads the six country modules and catalog, never descriptions as research facts.
 * Fetches Wikivoyage country/capital/destination articles and up to six linked
 * subdistricts per city (one level). Three workers, two attempts, bounded timeouts.
 * Public action=raw pages are the default: the API returned HTTP 429 during the
 * initial run. Raw requests have a shared one-second start interval. --api selects
 * the API instead. --countries=id,id refreshes selected countries in an existing
 * dataset. Progress is checkpointed; unattempted entries are explicitly unavailable.
 * Only structured listing identity/location/price fields are retained, not prose,
 * reviews, phone numbers, emails, or inferred price/quality tiers. A checked date
 * means the source was fetched, NOT that the business or price was verified live.
 * Source links preserve attribution; API mode additionally pins source revisions.
 * Failed attempts and coverage limits are recorded in each country's note.
 */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUTPUT = path.join(ROOT, 'src', 'data', 'travelResearch.json');
const SPLIT_OUTPUT = path.join(ROOT, 'src', 'data', 'travelResearch');
const ORIGIN = 'https://en.wikivoyage.org';
const MAX_DISTRICTS = 6;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export function loadCountries() {
  const cache = new Map();
  function load(name) {
    assert.match(name, /^[a-zA-Z0-9]+$/);
    if (cache.has(name)) return cache.get(name);
    const exports = {};
    cache.set(name, exports);
    const source = readFileSync(path.join(ROOT, 'src', 'data', `${name}.ts`), 'utf8');
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    });
    new Function('exports', 'require', outputText)(exports, specifier => {
      assert.ok(specifier.startsWith('./'));
      return load(specifier.slice(2));
    });
    return exports;
  }
  const catalog = load('countryCatalog').requestedCountries;
  const names = new Map(catalog.map(country => [country.id, country]));
  const countries = ['countries', 'countries2', 'countries3', 'countries4', 'countries5', 'countriesAdditional']
    .flatMap(name => load(name).default)
    .map(country => ({ ...country, name: names.get(country.id)?.name ?? country.name,
      article: names.get(country.id)?.article ?? country.name }));
  assert.equal(countries.length, 195);
  assert.equal(new Set(countries.map(country => country.id)).size, 195);
  for (const country of catalog) assert.ok(countries.some(item => item.id === country.id));
  return countries;
}

// Article-title routing only; these aliases are not used as venue or coordinate facts.
const DESTINATIONS = {
  'reykjavik-and-golden-circle': ['Reykjavik', 'Route 1 (Iceland)', 'Þingvellir National Park', 'Gullfoss', 'Geysir'],
  'bunol-valencia': ['Buñol', 'Valencia'],
  'pyramids-of-giza': ['Giza'],
  'taj-mahal': ['Agra'],
  'fjords': ['Western Norway'],
  'lofoten': ['Lofoten'],
  'sahara': ['Merzouga', "M'Hamid"],
  'finnish-lapland': ['Finnish Lapland'],
  'singapore-highlights': ['Singapore/Marina Bay'],
  'bhutan-highlights': ['Paro'],
  'cambodia-highlights': ['Angkor Archaeological Park'],
  'rwanda-highlights': ['Volcanoes National Park'],
  'colombia-highlights': ['Cartagena (Colombia)'],
  'costa-rica-highlights': ['Arenal Volcano National Park'],
  'chile-highlights': ['San Pedro de Atacama'],
  'mongolia-highlights': ['Gobi'],
  'nepal-highlights': ['Khumbu'],
};
const CAPITALS = {
  'antigua-and-barbuda': ["St. John's (Antigua and Barbuda)"],
  'costa-rica': ['San José (Costa Rica)'],
  'nauru': ['Yaren'],
  'south-africa': ['Pretoria', 'Cape Town', 'Bloemfontein'],
  'sri-lanka': ['Sri Jayewardenepura Kotte', 'Colombo'],
  'netherlands': ['Amsterdam', 'The Hague'],
  'malaysia': ['Kuala Lumpur', 'Putrajaya'],
  'palestine': ['Ramallah', 'Jerusalem'],
  'georgia': ['Tbilisi'],
  'grenada': ["St. George's"],
  'saint-kitts-and-nevis': ['Basseterre'],
  'saint-vincent-and-the-grenadines': ['Kingstown'],
  'seychelles': ['Victoria (Seychelles)'],
  'san-marino': ['San Marino'],
};

export function targetsFor(country) {
  const entries = [{ title: country.article, role: 'country' }];
  const capitals = CAPITALS[country.id] ?? country.capital.replace(/\([^)]*\)/g, '')
    .split(/;|\s+and\s+|\s*&\s*/).map(value => value.trim()).filter(Boolean);
  entries.push(...capitals.map(title => ({ title, role: 'capital' })));
  for (const destination of country.destinations) {
    const titles = DESTINATIONS[destination.id] ?? [destination.name];
    entries.push(...titles.map(title => ({ title, role: 'destination', destination: destination.name })));
  }
  return entries;
}

export function articleUrl(title) {
  return `${ORIGIN}/wiki/${encodeURIComponent(title.replaceAll(' ', '_'))}`;
}

// Balanced templates and wikilinks prevent nested pipes from becoming listing fields.
export function templates(text) {
  const found = [];
  const stack = [];
  for (let index = 0; index < text.length - 1; index++) {
    const pair = text.slice(index, index + 2);
    if (pair === '{{') { stack.push(index); index++; }
    else if (pair === '}}' && stack.length) {
      const start = stack.pop();
      found.push({ raw: text.slice(start + 2, index), start });
      index++;
    }
  }
  return found.sort((a, b) => a.start - b.start);
}

export function splitFields(raw) {
  const parts = [];
  let start = 0, braces = 0, links = 0;
  for (let index = 0; index < raw.length; index++) {
    const pair = raw.slice(index, index + 2);
    if (pair === '{{') { braces++; index++; }
    else if (pair === '}}') { braces--; index++; }
    else if (pair === '[[') { links++; index++; }
    else if (pair === ']]') { links--; index++; }
    else if (raw[index] === '|' && braces === 0 && links === 0) {
      parts.push(raw.slice(start, index).trim()); start = index + 1;
    }
  }
  parts.push(raw.slice(start).trim());
  const name = parts.shift().toLowerCase().replace(/^template:/, '');
  const fields = {};
  let position = 1;
  for (const part of parts) {
    const separator = part.indexOf('=');
    if (separator < 0) fields[position++] = part;
    else fields[part.slice(0, separator).trim().toLowerCase()] = part.slice(separator + 1).trim();
  }
  return { name, fields };
}

export function plainFact(raw, limit = 180) {
  if (!raw) return undefined;
  let text = raw.replace(/<!--[\s\S]*?-->/g, '').replace(/<ref\b[^>]*\/>|<ref\b[^>]*>[\s\S]*?<\/ref>/gi, '');
  text = text.replace(/\{\{([^{}]+)\}\}/g, (match, body) => {
    const { name, fields } = splitFields(body);
    if (name === 'lang' && fields[2]) return fields[2];
    // Explicit currencies only: never guess a currency from the country or '$'.
    if (/^(inr|eur|usd|gbp|jpy|cny|krw|vnd|thb|idr|myr|sgd|php|chf|nok|sek|dkk|isk|rub|try|aud|nzd|cad|zar|mad|egp|gel|amd|kes|tzs|bwp|brl|mxn|cop|clp|pen|ars|pkr|bdt|npr|lkr|rs)$/i.test(name)
      && fields[1] && !fields[2]) return `${name.toUpperCase()} ${fields[1]}`;
    return match;
  });
  if (/\{\{|\}\}/.test(text)) return undefined;
  text = text.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, label) => label ?? target)
    .replace(/\[https?:\/\/\S+\s+([^\]]+)\]/g, '$1')
    .replace(/<[^>]+>/g, ' ').replace(/'{2,5}/g, '')
    .replace(/&#(x[\da-f]+|\d+);/gi, (match, code) => {
      const number = code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : Number(code);
      return number > 0 && number <= 0x10ffff ? String.fromCodePoint(number) : match;
    })
    .replace(/&(amp|quot|apos|nbsp|ndash|mdash|euro|pound|yen|lt|gt);/g,
      (_, entity) => ({ amp: '&', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', euro: '€', pound: '£', yen: '¥', lt: '<', gt: '>' })[entity])
    .replace(/\s+/g, ' ').trim();
  return text && text.length <= limit && !/[{}<>]|\[\[|\]\]/.test(text) ? text : undefined;
}

export function coordinates(lat, lon) {
  const numeric = value => typeof value === 'string' && /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value.trim()) ? Number(value) : NaN;
  const latitude = numeric(lat), longitude = numeric(lon);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180
    || (latitude === 0 && longitude === 0)) return {};
  return { lat: latitude, lon: longitude };
}

function publicUrl(raw) {
  if (!raw) return undefined;
  try {
    const url = new URL(raw.trim());
    return /^https?:$/.test(url.protocol) && !url.username && !url.password && !/[{}\s]/.test(raw.trim()) ? url.href : undefined;
  } catch { return undefined; }
}

function placeId(countryId, place) {
  return `${countryId}-${createHash('sha256').update(JSON.stringify([place.kind, place.name, place.locality, place.lat, place.lon])).digest('hex').slice(0, 20)}`;
}

export function extractFacts(page, countryId, includeArea = true) {
  const text = page.text.replace(/<!--[\s\S]*?-->/g, '');
  const parsed = templates(text).map(template => splitFields(template.raw));
  const places = [];
  const kinds = { sleep: 'stay', eat: 'eat', drink: 'eat', see: 'do', do: 'do', city: 'area' };
  const add = place => { place.id = placeId(countryId, place); places.push(place); };
  for (const { name: template, fields } of parsed) {
    let kind = kinds[template];
    if (template === 'listing' || template === 'vcard' || template === 'marker') kind = kinds[fields.type?.toLowerCase()];
    if (!kind) continue;
    const name = plainFact(fields.name);
    if (!name || /^(?:\(?name\)?|example)$/i.test(name)) continue;
    const place = { name, kind, locality: plainFact(fields.city) ?? page.title, ...coordinates(fields.lat, fields.long ?? fields.lon), sourceUrl: page.url };
    const address = plainFact(fields.address, 220);
    const price = plainFact(fields.price, 120);
    const url = publicUrl(fields.url);
    if (address) place.address = address;
    // Long narrative prices and descriptions are deliberately omitted, not truncated.
    if (price && (/\d/.test(price) || /^(free|donation|pay what you wish|pay what you want)(?:\s+entry|\s+admission)?[.!]?$/i.test(price))) place.price = price;
    if (url) place.url = url;
    add(place);
  }
  if (includeArea) {
    const geo = parsed.find(template => template.name === 'geo');
    const location = coordinates(geo?.fields[1], geo?.fields[2]);
    if (location.lat !== undefined) add({ name: page.title, kind: 'area', locality: page.title, ...location, sourceUrl: page.url });
  }
  const districts = new Set();
  // Only linked subpages of this exact article, not arbitrary neighboring cities.
  for (const match of text.matchAll(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]/g)) {
    const title = match[1].replaceAll('_', ' ').trim();
    if (title.startsWith(`${page.title}/`) && title.split('/').length === page.title.split('/').length + 1) districts.add(title);
  }
  return { places, districts: [...districts] };
}

export function makeClient({ fetcher = fetch, delay = sleep, timeout = 18000, interval = 1000 } = {}) {
  const cache = new Map();
  const stats = { requests: 0, successes: 0, failures: 0 };
  let nextStart = 0, rateLimited = false;
  async function request(title) {
    const url = new URL(`${ORIGIN}/w/api.php`);
    url.search = new URLSearchParams({ action: 'parse', page: title, prop: 'wikitext|revid', format: 'json', redirects: '1', maxlag: '5' });
    let error = 'unknown failure';
    for (let attempt = 0; attempt < 2; attempt++) {
      let retryAfter = 0;
      const start = Math.max(Date.now(), nextStart);
      nextStart = start + interval;
      if (rateLimited) return { title, error: 'API rate-limited; remaining requests suspended for this run' };
      await delay(Math.max(0, start - Date.now()));
      if (rateLimited) return { title, error: 'API rate-limited; remaining requests suspended for this run' };
      stats.requests++;
      try {
        const response = await fetcher(url, { signal: AbortSignal.timeout(timeout), headers: { 'User-Agent': 'IllahiTravelResearch/1.0 (public travel facts; bounded concurrency 3)', Accept: 'application/json' } });
        if (!response.ok) {
          error = `HTTP ${response.status}`;
          if (response.status === 429) { rateLimited = true; break; }
          if (![408, 500, 502, 503, 504].includes(response.status)) break;
          const retryHeader = response.headers.get('retry-after');
          retryAfter = Math.max(0, Number(retryHeader) * 1000 || Date.parse(retryHeader) - Date.now() || 0);
          if (retryAfter > 10000) { error += '; Retry-After exceeds bounded retry window'; break; }
        } else {
          const data = await response.json();
          if (data.error) {
            error = `API ${data.error.code}`;
            if (data.error.code === 'ratelimited') { rateLimited = true; break; }
            if (!['maxlag', 'readonly'].includes(data.error.code)) break;
          } else if (data.parse?.wikitext?.['*'] && Number.isInteger(data.parse.revid)) {
            const page = data.parse;
            if (/\{\{(?:disamb|disambiguation)(?:\||\}\})/i.test(page.wikitext['*'])) { error = 'ambiguous article'; break; }
            stats.successes++;
            return { title: page.title, text: page.wikitext['*'], url: `${ORIGIN}/w/index.php?title=${encodeURIComponent(page.title.replaceAll(' ', '_'))}&oldid=${page.revid}`, checkedAt: new Date().toISOString() };
          } else { error = 'unrecognized API response'; }
        }
      } catch (cause) { error = `${cause.name}: ${cause.cause?.code ?? cause.message}`.slice(0, 160); }
      if (attempt === 0) await delay(Math.max(retryAfter, 1200));
    }
    stats.failures++;
    return { title, error };
  }
  return { stats, get(title) {
    const normalized = title.normalize('NFC').replaceAll('’', "'").trim();
    if (!cache.has(normalized)) cache.set(normalized, request(normalized));
    return cache.get(normalized);
  } };
}

export function makeRawClient({ fetcher = fetch, delay = sleep, timeout = 15000, interval = 1000 } = {}) {
  const cache = new Map();
  const stats = { requests: 0, successes: 0, failures: 0, redirects: 0, rateLimited: 0 };
  let nextStart = 0;
  let blockedUntil = 0;
  async function request(title, trail = []) {
    if (trail.length >= 4 || trail.includes(title)) return { title, error: 'redirect cycle or four-hop limit' };
    const url = new URL(`${ORIGIN}/w/index.php`);
    url.search = new URLSearchParams({ title, action: 'raw' });
    let error = 'unknown failure';
    for (let attempt = 0; attempt < 2; attempt++) {
      if (blockedUntil > Date.now()) return { title, error: 'source rate-limited; remaining requests suspended for this run' };
      const start = Math.max(Date.now(), nextStart);
      nextStart = start + interval;
      await delay(Math.max(0, start - Date.now()));
      if (blockedUntil > Date.now()) return { title, error: 'source rate-limited; remaining requests suspended for this run' };
      let retryAfter = 2000;
      stats.requests++;
      try {
        const response = await fetcher(url, { signal: AbortSignal.timeout(timeout), headers: { 'User-Agent': 'IllahiTravelResearch/1.0 (public facts; 3 workers; 1 request/second)', Accept: 'text/plain' } });
        if (response.status === 429) {
          stats.rateLimited++;
          // Stop rather than switch endpoints or repeatedly hit a throttled source.
          blockedUntil = Infinity;
          error = 'HTTP 429; remaining requests suspended for this run';
          break;
        }
        if (!response.ok) {
          error = `HTTP ${response.status}`;
          if (![408, 500, 502, 503, 504].includes(response.status)) break;
          const retryHeader = response.headers.get('retry-after');
          retryAfter = Math.max(2000, Number(retryHeader) * 1000 || Date.parse(retryHeader) - Date.now() || 0);
          if (retryAfter > 10000) { error += '; Retry-After exceeds bounded retry window'; break; }
        } else {
          const text = await response.text();
          const redirect = text.match(/^\s*#redirect\s*\[\[([^\]#|]+)(?:[^\]]*)\]\]/i);
          if (redirect) {
            stats.redirects++;
            return request(redirect[1].trim(), [...trail, title]);
          }
          if (/\{\{(?:disamb|disambiguation)(?:\||\}\})/i.test(text)) { error = 'ambiguous article'; break; }
          if (/^\s*<!doctype|^\s*<html|^You are making too many requests/i.test(text) || !text.includes('{{')) { error = 'not a wikitext travel article'; break; }
          stats.successes++;
          return { title, text, url: articleUrl(title), checkedAt: new Date().toISOString() };
        }
      } catch (cause) { error = `${cause.name}: ${cause.cause?.code ?? cause.message}`.slice(0, 160); }
      if (attempt === 0) await delay(retryAfter);
    }
    stats.failures++;
    return { title, error };
  }
  return { stats, get(title) {
    const normalized = title.normalize('NFC').replaceAll('’', "'").trim();
    if (!cache.has(normalized)) cache.set(normalized, request(normalized));
    return cache.get(normalized);
  } };
}

export function linkedAlternatives(text, requested) {
  const normalize = value => value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
    .replace(/\([^)]*\)/g, '').replace(/\bst\.?\s+/g, 'saint ').replace(/[^a-z0-9]/g, '');
  const key = normalize(requested);
  const titles = new Set();
  for (const match of text.matchAll(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]*))?\]\]/g)) {
    const title = match[1].replaceAll('_', ' ').trim();
    if (!title.includes(':') && title !== requested && (normalize(title) === key || normalize(match[2] ?? '') === key)) titles.add(title);
  }
  return [...titles].slice(0, 2);
}

export async function researchCountry(country, client) {
  const sources = new Map(), places = new Map(), attempted = new Set();
  const failures = [], omissions = [], mappings = [], empty = [], resolutions = [];
  let countryPage;
  const targets = targetsFor(country);
  async function collect(target, followDistricts) {
    attempted.add(target.title);
    let page = await client.get(target.title);
    if (page.error && countryPage && target.role !== 'district') {
      for (const alternative of linkedAlternatives(countryPage.text, target.title)) {
        attempted.add(alternative);
        const candidate = await client.get(alternative);
        if (!candidate.error) { page = candidate; resolutions.push(`${target.title} → ${page.title} (linked by ${countryPage.title})`); break; }
      }
    }
    if (page.error) { failures.push(`${target.title}: ${page.error} (${articleUrl(target.title)})`); return; }
    if (target.role === 'country') countryPage = page;
    sources.set(page.url, { title: page.title, url: page.url, checkedAt: page.checkedAt });
    if (target.destination && target.destination !== page.title) mappings.push(`${target.destination} → ${page.title}`);
    const facts = extractFacts(page, country.id, target.role !== 'country');
    if (facts.places.length === 0) empty.push(page.title);
    for (const place of facts.places) places.set(place.id, place);
    if (followDistricts) {
      if (facts.districts.length > MAX_DISTRICTS) omissions.push(`${page.title}: ${facts.districts.length - MAX_DISTRICTS} additional linked subpages not fetched`);
      for (const title of facts.districts.slice(0, MAX_DISTRICTS)) {
        if (!attempted.has(title)) await collect({ title, role: 'district' }, false);
      }
    }
  }
  for (const target of targets) await collect(target, target.role !== 'country');
  const found = [...places.values()];
  const missingKinds = ['stay', 'eat', 'do', 'area'].filter(kind => !found.some(place => place.kind === kind));
  const complete = failures.length === 0 && omissions.length === 0 && missingKinds.length === 0 && empty.length === 0;
  return {
    sources: [...sources.values()], places: found,
    status: sources.size === 0 ? 'unavailable' : complete ? 'researched' : 'partial',
    note: [
      `Fetched ${sources.size} distinct public Wikivoyage source pages; attempted ${attempted.size} article titles covering the country, capital(s), and ${country.destinations.length} existing destination(s).`,
      'Only explicit structured facts are retained. Locality defaults to the source article area, not a verified street location. Article-center coordinates identify areas only; venue coordinates are never inferred. Missing fields and quality tiers are intentionally omitted. Source checked dates are retrieval dates, not venue, safety, availability, or price verification; community-edited facts may be outdated. Descriptive prose and unstructured listings were not imported.',
      'Subdistrict follow-up is limited to six direct linked subpages per capital/destination, one level; no exhaustive venue census or independent business-site checks.',
      failures.length ? `Unavailable or unresolved articles: ${failures.join('; ')}.` : '',
      omissions.length ? `Coverage cap: ${[...new Set(omissions)].join('; ')}.` : '',
      empty.length ? `No extractable structured facts: ${[...new Set(empty)].join('; ')}.` : '',
      missingKinds.length ? `Missing categories: ${missingKinds.join(', ')}.` : '',
      mappings.length ? `Destination article routing (regional/landmark guides may use a nearby gateway): ${[...new Set(mappings)].join('; ')}.` : '',
      resolutions.length ? `Title resolution: ${[...new Set(resolutions)].join('; ')}.` : '',
    ].filter(Boolean).join(' '),
  };
}

export function validateDataset(dataset, countries = loadCountries()) {
  assert.ok(Number.isFinite(Date.parse(dataset.generatedAt)), 'generatedAt');
  assert.deepEqual(Object.keys(dataset.countries).sort(), countries.map(country => country.id).sort());
  const ids = new Set();
  for (const [countryId, country] of Object.entries(dataset.countries)) {
    assert.ok(['researched', 'partial', 'unavailable'].includes(country.status), countryId);
    assert.ok(typeof country.note === 'string' && country.note.length > 0);
    assert.ok(Array.isArray(country.sources) && Array.isArray(country.places));
    const sources = new Set();
    for (const source of country.sources) {
      assert.ok(source.title && publicUrl(source.url) && Number.isFinite(Date.parse(source.checkedAt)));
      assert.ok(!sources.has(source.url), `duplicate source ${source.url}`);
      sources.add(source.url);
    }
    if (country.status === 'unavailable') assert.equal(country.sources.length + country.places.length, 0);
    if (country.status === 'researched') {
      assert.ok(country.sources.length);
      for (const kind of ['stay', 'eat', 'do', 'area']) assert.ok(country.places.some(place => place.kind === kind));
    }
    for (const place of country.places) {
      assert.ok(place.id && !ids.has(place.id), `duplicate ID ${place.id}`); ids.add(place.id);
      assert.ok(place.name && place.locality && ['stay', 'eat', 'do', 'area'].includes(place.kind));
      assert.ok(sources.has(place.sourceUrl), `unattributed ${place.id}`);
      assert.equal(place.lat === undefined, place.lon === undefined, `incomplete coordinates ${place.id}`);
      if (place.lat !== undefined) {
        assert.ok(typeof place.lat === 'number' && Number.isFinite(place.lat) && Math.abs(place.lat) <= 90);
        assert.ok(typeof place.lon === 'number' && Number.isFinite(place.lon) && Math.abs(place.lon) <= 180);
      }
      if (place.url !== undefined) assert.ok(publicUrl(place.url));
      if (place.tier !== undefined) assert.ok(['mid-range', 'premium'].includes(place.tier));
    }
  }
  return { countries: countries.length, destinations: countries.reduce((sum, country) => sum + country.destinations.length, 0),
    sources: Object.values(dataset.countries).reduce((sum, country) => sum + country.sources.length, 0), places: ids.size,
    coordinates: Object.values(dataset.countries).flatMap(country => country.places).filter(place => place.lat !== undefined).length,
    prices: Object.values(dataset.countries).flatMap(country => country.places).filter(place => place.price).length,
    statuses: Object.fromEntries(['researched', 'partial', 'unavailable'].map(status => [status, Object.values(dataset.countries).filter(country => country.status === status).length])) };
}

export function validateSplitFiles(dataset) {
  const expected = Object.keys(dataset.countries).map(id => `${id}.json`).sort();
  const actual = readdirSync(SPLIT_OUTPUT).filter(name => name.endsWith('.json')).sort();
  assert.deepEqual(actual, expected, 'split country file coverage');
  for (const [id, country] of Object.entries(dataset.countries)) {
    assert.match(id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    const split = JSON.parse(readFileSync(path.join(SPLIT_OUTPUT, `${id}.json`), 'utf8'));
    assert.deepEqual(split, country, `split differs from aggregate: ${id}`);
  }
  return actual.length;
}

export function writeSplitFiles(dataset, countries = loadCountries()) {
  validateDataset(dataset, countries);
  for (const [id, country] of Object.entries(dataset.countries)) {
    assert.match(id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.doesNotMatch(country.note, /^Not yet attempted/, `unfinished research: ${id}`);
  }
  mkdirSync(SPLIT_OUTPUT, { recursive: true });
  for (const [id, country] of Object.entries(dataset.countries)) {
    writeFileSync(path.join(SPLIT_OUTPUT, `${id}.json`), `${JSON.stringify(country, null, 2)}\n`, 'utf8');
  }
  return validateSplitFiles(dataset);
}

async function main() {
  const countries = loadCountries();
  if (process.argv.includes('--split') || process.argv.includes('--validate')) {
    const dataset = JSON.parse(readFileSync(OUTPUT, 'utf8'));
    const summary = validateDataset(dataset, countries);
    const splitFiles = process.argv.includes('--split') ? writeSplitFiles(dataset, countries) : validateSplitFiles(dataset);
    console.log(JSON.stringify({ ...summary, splitFiles }, null, 2)); return;
  }
  const client = process.argv.includes('--api') ? makeClient() : makeRawClient();
  const selected = process.argv.find(argument => argument.startsWith('--countries='))?.slice(12).split(',');
  const previous = selected ? JSON.parse(readFileSync(OUTPUT, 'utf8')) : undefined;
  if (previous) validateDataset(previous, countries);
  if (selected) for (const id of selected) assert.ok(countries.some(country => country.id === id), `Unknown country: ${id}`);
  const pending = selected ? countries.filter(country => selected.includes(country.id)) : countries;
  const results = new Map(countries.map(country => [country.id, previous?.countries[country.id] ?? {
    sources: [], places: [], status: 'unavailable',
    note: `Not yet attempted in this run. Planned public source titles: ${targetsFor(country).map(target => target.title).join('; ')}. No facts are asserted.`,
  }]));
  function checkpoint() {
    const dataset = { generatedAt: new Date().toISOString(), countries: Object.fromEntries(countries.map(country => [country.id, results.get(country.id)])) };
    validateDataset(dataset, countries);
    writeFileSync(OUTPUT, `${JSON.stringify(dataset, null, 2)}\n`, 'utf8');
    return dataset;
  }
  checkpoint();
  let next = 0, completed = 0;
  await Promise.all(Array.from({ length: 3 }, async () => {
    while (next < pending.length) {
      const country = pending[next++];
      results.set(country.id, await researchCountry(country, client));
      completed++;
      console.log(`${completed}/${pending.length} ${country.id}: ${results.get(country.id).places.length} places (${results.get(country.id).status})`);
      if (completed % 5 === 0) checkpoint();
    }
  }));
  const dataset = checkpoint();
  const summary = validateDataset(dataset, countries);
  const splitFiles = writeSplitFiles(dataset, countries);
  console.log(JSON.stringify({ ...summary, splitFiles, access: client.stats, transport: process.argv.includes('--api') ? 'api' : 'public raw articles', output: OUTPUT }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error); process.exitCode = 1; });
}
