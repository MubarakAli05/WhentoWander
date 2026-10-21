import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import {
  articleUrl, coordinates, extractFacts, linkedAlternatives, loadCountries, makeClient, makeRawClient, plainFact,
  researchCountry, splitFields, targetsFor, templates, validateDataset,
} from './research-travel-guides.mjs';

const page = {
  title: 'Test City', url: 'https://en.wikivoyage.org/w/index.php?title=Test_City&oldid=123',
  checkedAt: '2026-10-21T00:00:00.000Z',
  text: `{{geo|12.5|-40}}
<!-- {{sleep|name=Commented example|lat=5|long=6}} -->
{{sleep|name=[[Test Hotel|Example Hotel]]|address=1 Example Road|lat=12.52|long=-40.01|price={{INR|100}}|url=https://example.com|content=DO NOT RETAIN PROSE}}
{{eat|name=Example Café|lat=bad|long=-40|price=Free|email=private@example.com|phone=123}}
{{listing|type=see|name=Example Museum|lat=91|long=0|price=10 USD}}
{{do|name=Example Walk|lat=0|long=0}}
{{listing|name=Uncategorized listing|lat=12|long=34}}
{{marker|type=city|name=Example district|lat=12.6|long=-40.1}}
[[Test City/North|North]] [[Test City/North#See|North attractions]] [[Other City/South]]`,
};

test('balanced templates and wikilinks preserve nested pipes', () => {
  const parsed = templates('{{sleep|name=[[X|Y]]|price={{INR|100}}|address=A=B}}').map(item => splitFields(item.raw));
  assert.equal(parsed[0].name, 'sleep');
  assert.equal(parsed[0].fields.name, '[[X|Y]]');
  assert.equal(parsed[0].fields.price, '{{INR|100}}');
  assert.equal(parsed[0].fields.address, 'A=B');
  assert.equal(plainFact(parsed[0].fields.price), 'INR 100');
  assert.equal(plainFact("[[X|Y]] &amp; {{lang|fr|Café}}"), 'Y & Café');
  assert.equal(plainFact('{{unknown|do not guess}}'), undefined);
  assert.equal(plainFact('A'.repeat(121), 120), undefined);
});

test('only explicit structured fields are retained; areas never supply venue coordinates', () => {
  const { places, districts } = extractFacts(page, 'test');
  assert.equal(places.length, 6);
  const hotel = places.find(place => place.name === 'Example Hotel');
  assert.equal(hotel.price, 'INR 100');
  assert.equal(hotel.lat, 12.52);
  assert.equal(hotel.lon, -40.01);
  assert.equal(hotel.address, '1 Example Road');
  assert.equal(hotel.url, 'https://example.com/');
  assert.equal(hotel.sourceUrl, page.url);
  assert.equal(hotel.tier, undefined);
  assert.equal(places.find(place => place.name === 'Example Café').lat, undefined);
  assert.equal(places.find(place => place.name === 'Example Museum').lat, undefined);
  assert.equal(places.find(place => place.name === 'Example Walk').lat, undefined);
  const area = places.find(place => place.name === page.title);
  assert.equal(area.kind, 'area');
  assert.equal(area.lat, 12.5);
  assert.ok(!JSON.stringify(places).includes('DO NOT RETAIN'));
  assert.ok(!JSON.stringify(places).includes('private@example.com'));
  assert.deepEqual(districts, ['Test City/North']);
  assert.deepEqual(extractFacts(page, 'test').places, places, 'stable IDs');
});

test('numeric coordinates require two explicit bounded finite decimals', () => {
  for (const pair of [['', '1'], ['NaN', '1'], ['1', 'Infinity'], ['91', '10'], ['-20', '181'], ['0', '0'], ['12N', '50E'], ['1e1', '20']]) {
    assert.deepEqual(coordinates(...pair), {}, pair.join(','));
  }
  assert.deepEqual(coordinates(' -90 ', '180'), { lat: -90, lon: 180 });
  assert.deepEqual(coordinates('0', '15.2'), { lat: 0, lon: 15.2 });
});

test('all 195 catalog/data countries and all 91 destinations are research targets', () => {
  const countries = loadCountries();
  assert.equal(countries.length, 195);
  assert.equal(countries.reduce((sum, country) => sum + country.destinations.length, 0), 91);
  for (const country of countries) {
    const targets = targetsFor(country);
    assert.ok(targets.some(target => target.role === 'country' && target.title === country.article));
    assert.ok(targets.some(target => target.role === 'capital'));
    for (const destination of country.destinations) assert.ok(targets.some(target => target.destination === destination.name));
  }
});

test('API uses immutable revisions, caching, two-attempt retry and bounded backoff', async () => {
  let calls = 0;
  const waits = [];
  const client = makeClient({
    interval: 0, delay: async ms => { waits.push(ms); },
    fetcher: async url => {
      assert.equal(url.origin, 'https://en.wikivoyage.org');
      calls++;
      if (calls === 1) return new Response('busy', { status: 503, headers: { 'retry-after': '2' } });
      return Response.json({ parse: { title: 'Test City', revid: 123, wikitext: { '*': page.text } } });
    },
  });
  const result = await client.get('Test City');
  assert.equal(result.url, page.url);
  assert.equal(result.text, page.text);
  assert.equal(await client.get('Test City'), result);
  assert.equal(calls, 2);
  assert.deepEqual(waits, [0, 2000, 0]);
  assert.equal(client.stats.successes, 1);
});

test('missing and ambiguous articles are not claimed as accessed sources', async () => {
  for (const data of [ { error: { code: 'missingtitle' } }, { parse: { title: 'Test', revid: 3, wikitext: { '*': '{{disamb}}' } } } ]) {
    let calls = 0;
    const client = makeClient({ fetcher: async () => { calls++; return Response.json(data); } });
    assert.ok((await client.get('Test')).error);
    assert.equal(calls, 1);
  }
  let calls = 0;
  const client = makeClient({ delay: async () => {}, fetcher: async () => { calls++; throw new Error('offline'); } });
  const country = { id: 'test', name: 'Test', article: 'Test', capital: 'Example', destinations: [{ name: 'Other', id: 'other' }] };
  const result = await researchCountry(country, client);
  assert.equal(result.status, 'unavailable');
  assert.deepEqual(result.sources, []);
  assert.deepEqual(result.places, []);
  assert.match(result.note, /offline/);
  assert.match(result.note, /Other/);
  assert.equal(calls, 6);
});

test('subdistrict collection is bounded and reports skipped coverage', async () => {
  const calls = [];
  const client = { get: async title => {
    calls.push(title);
    return { ...page, title, url: articleUrl(title), text: title === 'Test City'
      ? `${page.text}\n${Array.from({ length: 10 }, (_, index) => `[[Test City/District ${index}]]`).join(' ')}`
      : '{{geo|12|20}}' };
  } };
  const country = { id: 'test', article: 'Test Country', capital: 'Test City', destinations: [] };
  const result = await researchCountry(country, client);
  assert.equal(calls.length, 8, 'country, capital, and six subdistricts');
  assert.equal(result.status, 'partial');
  assert.match(result.note, /5 additional linked subpages not fetched/);
});

test('raw source follows bounded redirects and attributes the resolved public article', async () => {
  const calls = [];
  const client = makeRawClient({ interval: 0, delay: async () => {}, fetcher: async url => {
    calls.push(url.href);
    assert.equal(url.searchParams.get('action'), 'raw');
    return new Response(url.searchParams.get('title') === 'Alias' ? '#REDIRECT [[Test City]]' : page.text);
  } });
  const result = await client.get('Alias');
  assert.equal(result.title, 'Test City');
  assert.equal(result.url, articleUrl('Test City'));
  assert.equal(result.text, page.text);
  assert.equal(await client.get('Alias'), result);
  assert.equal(calls.length, 2);
  assert.equal(client.stats.redirects, 1);
});

test('raw redirects cannot loop and HTTP 429 suspends further source requests', async () => {
  let calls = 0;
  const looping = makeRawClient({ interval: 0, delay: async () => {}, fetcher: async () => {
    calls++; return new Response('#REDIRECT [[Loop]]');
  } });
  assert.match((await looping.get('Loop')).error, /redirect cycle/);
  assert.equal(calls, 1);
  const limited = makeRawClient({ interval: 0, delay: async () => {}, fetcher: async () => {
    calls++; return new Response('rate limited', { status: 429 });
  } });
  assert.match((await limited.get('First')).error, /429/);
  assert.match((await limited.get('Second')).error, /suspended/);
  assert.equal(calls, 2);
});

test('API rate limits suspend requests and long Retry-After values are not shortened', async () => {
  let calls = 0;
  const limited = makeClient({ interval: 0, delay: async () => {}, fetcher: async () => {
    calls++; return new Response('limited', { status: 429 });
  } });
  assert.match((await limited.get('First')).error, /429/);
  assert.match((await limited.get('Second')).error, /suspended/);
  assert.equal(calls, 1);
  for (const make of [makeClient, makeRawClient]) {
    const unavailable = make({ interval: 0, delay: async () => {}, fetcher: async () => {
      calls++; return new Response('busy', { status: 503, headers: { 'retry-after': '99999' } });
    } });
    assert.match((await unavailable.get('Test')).error, /Retry-After exceeds/);
  }
  assert.equal(calls, 3);
});

test('title recovery uses only matching public country-article links', () => {
  assert.deepEqual(linkedAlternatives('[[Queenstown (New Zealand)|Queenstown]] [[Other Town]]', 'Queenstown'), ['Queenstown (New Zealand)']);
  assert.deepEqual(linkedAlternatives('[[Everest Region]] [[Al-Ula]]', 'Everest region'), ['Everest Region']);
  assert.deepEqual(linkedAlternatives('[[Everest Region]] [[Al-Ula]]', 'AlUla'), ['Al-Ula']);
  assert.deepEqual(linkedAlternatives("[[Saint John's]]", "St. John's (Antigua and Barbuda)"), ["Saint John's"]);
  assert.deepEqual(linkedAlternatives('[[Other Town]] [[w:Missing]]', 'Missing'), []);
});

test('persisted dataset covers every country with unique IDs and attributed facts', () => {
  const dataset = JSON.parse(readFileSync(new URL('../src/data/travelResearch.json', import.meta.url), 'utf8'));
  const summary = validateDataset(dataset);
  assert.equal(summary.countries, 195);
  assert.equal(summary.destinations, 91);
  for (const country of Object.values(dataset.countries)) {
    assert.doesNotMatch(country.note, /^Not yet attempted/, 'research run has not finished');
    for (const place of country.places) {
      assert.ok(Object.keys(place).every(key => ['id', 'name', 'kind', 'locality', 'lat', 'lon', 'address', 'price', 'tier', 'url', 'sourceUrl'].includes(key)));
    }
  }
});

test('offline split CLI preserves aggregate bytes and emits all 195 exact country objects', () => {
  const aggregateUrl = new URL('../src/data/travelResearch.json', import.meta.url);
  const original = readFileSync(aggregateUrl);
  const dataset = JSON.parse(original);
  const scriptUrl = new URL('./research-travel-guides.mjs', import.meta.url).href;
  const output = execFileSync(process.execPath, ['--input-type=module', '--eval', `
    import { fileURLToPath } from 'node:url';
    globalThis.fetch = () => { throw new Error('Offline splitting must not fetch'); };
    process.argv = [process.execPath, fileURLToPath(${JSON.stringify(scriptUrl)}), '--split'];
    await import(${JSON.stringify(scriptUrl)});
  `], { encoding: 'utf8', timeout: 30000 });
  assert.equal(JSON.parse(output).splitFiles, 195);
  assert.deepEqual(readFileSync(aggregateUrl), original, 'aggregate facts and timestamps must be unchanged');
  const directory = new URL('../src/data/travelResearch/', import.meta.url);
  assert.deepEqual(readdirSync(directory).sort(), Object.keys(dataset.countries).map(id => `${id}.json`).sort());
  for (const [id, country] of Object.entries(dataset.countries)) {
    assert.deepEqual(JSON.parse(readFileSync(new URL(`${id}.json`, directory), 'utf8')), country, id);
  }
});
