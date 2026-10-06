#!/usr/bin/env node
/** Synchronize openly licensed, country-specific photographs from Wikimedia. */
import { readFile, writeFile, mkdir, rename, unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { stripTypeScriptTypes } from 'node:module';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'src', 'data', 'countryGalleries.json');
const imageDir = path.join(root, 'public', 'images', 'countries');
const headers = { 'User-Agent': 'WhenToWanderCountryGallerySync/1.0 (https://github.com/MubarakAli05/WhentoWander; educational country galleries)' };
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const args = process.argv.slice(2);
const refresh = args.includes('--refresh');
const upgrade = args.includes('--upgrade');
const landmarksOnly = args.includes('--landmarks-only');
const verifyOnly = args.includes('--verify');
const optimizePreviews = args.includes('--optimize-previews');
const cleanCaptionsOnly = args.includes('--clean-captions');
const selected = args.find(arg => arg.startsWith('--countries='))?.slice(12).split(',');
const target = 6;
const previewWidth = 960;
const maxPreviewBytes = 3 * 1024 * 1024;
const landmarkArticles = {
  'central-african-republic': ['Bangui', 'Boali', 'Dzanga-Sangha Special Reserve', 'Dzanga-Ndoki National Park', 'Bayanga', 'Boali Falls'],
  bahrain: ['Manama', 'Al Fateh Grand Mosque', 'Bahrain World Trade Center'],
  ecuador: ['Cotopaxi', 'Quilotoa', 'Cuenca, Ecuador'],
  comoros: ['Moroni, Comoros', 'Mount Karthala', 'Mohéli'],
  'republic-of-the-congo': ['Brazzaville', 'Basilique Sainte-Anne du Congo', 'Odzala-Kokoua National Park'],
  djibouti: ['Lake Assal (Djibouti)', 'Djibouti (city)'],
  'dominican-republic': ['Santo Domingo', 'Punta Cana', 'Los Haitises National Park'],
  'equatorial-guinea': ['Malabo', 'Bata, Equatorial Guinea', 'Pico Basile'],
  eritrea: ['Asmara', 'Massawa', 'Keren, Eritrea'],
  eswatini: ['Mbabane', 'Lobamba', 'Hlane Royal National Park', 'Malolotja Nature Reserve'],
  grenada: ["St. George's, Grenada", 'Grand Etang National Park', 'Carriacou'],
  guyana: ['Kaieteur Falls', 'Georgetown, Guyana', 'Iwokrama Forest'],
  kiribati: ['South Tarawa', 'Kiritimati', 'Butaritari', 'Abaiang'],
  'marshall-islands': ['Majuro', 'Laura, Marshall Islands', 'Arno Atoll', 'Kwajalein Atoll'],
  micronesia: ['Palikir', 'Nan Madol', 'Pohnpei', 'Chuuk Lagoon'],
  nauru: ['Yaren District', 'Buada Lagoon', 'Anibare Bay'],
  nicaragua: ['Granada, Nicaragua', 'León, Nicaragua', 'Masaya Volcano', 'Ometepe'],
  'saint-kitts-and-nevis': ['Basseterre', 'Brimstone Hill Fortress National Park', 'Nevis'],
  'saint-vincent-and-the-grenadines': ['Kingstown', 'Botanic Gardens St. Vincent', 'Fort Charlotte, Saint Vincent'],
  samoa: ['Apia', 'Upolu', 'Savaiʻi', 'To-Sua Ocean Trench'],
  'timor-leste': ['Dili', 'Cristo Rei of Dili', 'Atauro', 'Jaco Island', 'Tatamailau'],
  tuvalu: ['Funafuti', 'Funafuti Conservation Area', 'Nanumea', 'Fongafale'],
  tonga: ["Nukuʻalofa", 'Royal Palace, Tonga', 'Tongatapu', 'Haʻamonga ʻa Maui'],
  turkmenistan: ['Ashgabat', 'Independence Monument (Turkmenistan)', 'Neutrality Monument', 'Merv', 'Yangykala'],
};
const excluded = /\b(flag|coat of arms|locator|location map|map of|maps|chart|graph|diagram|logo|seal of|portraits?|textiles?|tapestry|silk|garments?|embroidery|fabrics?|locomotive|trains?|railway|railroad|bus(?:es)?|busworld|automobiles?|motorcycles?|trucks?|toyota|vehicles?|airplanes?|aeroplanes?|airliners?|boeing|airbus|aviation|NARA|selfie|yoga|schools?|preschool|classroom|students?|children|police|troops?|marines?|soldiers?|aerosol|pollution|nuclear|power plant|satellite|artis|zoo|zoological|aquarium|choppers|helicopter|helicopters|factory|industrial|mining|shopping mall|refinery|president|prime minister|minister|king |queen |emperor|sultan|battle|war |soldier|military|army|navy|protest|riot|massacre|execution|slavery|slave|refugee|aircraft|fighter|tank |weapon|missile|parade|conference|summit|meeting|delegation|united nations|treaty|election|politic|parliament session|banknote|coin |stamp|manuscript|paintings?|painted|engravings?|illustrations?|lithographs?|drawings?|historical photographs?|historic photographs?|vintage|black.and.white|collage|montage|covid|pandemic|team |football|cricket|basketball|athlete|singer|actress|actor|celebrity|ceremony|inauguration|signing|revolution|dynasty|coronation|independence day|space station|satellite image|nasa|earth from|population|gdp|religions in|ethnic groups)\b/i;
const scenic = /\b(landscapes?|panoramas?|skyline|aerial|cityscape|mountains?|mount|lakes?|rivers?|waterfalls?|forests?|beach|beaches|coasts?|islands?|bay|valleys?|hills?|deserts?|dunes?|glaciers?|volcano|national parks?|nature|gardens?|temples?|pagodas?|mosques?|cathedrals?|church(?:es)?|monaster(?:y|ies)|castles?|palaces?|fortress(?:es)?|bridges?|harbours?|harbors?|ports?|old town|squares?|architecture|buildings?|towers?|terraces?|villages?|dams?|sunset|sunrise|safari|zebra|giraffe|elephant|reef|lagoon|fjord|cliff|canyon|waterfront|city centre|city center|downtown|vineyard|countryside|watermill|windmill|pyramid|ruins|archipelago|savanna|wetland)\b/i;

const landmarkCategories = {
  bahrain: ['Bahrain World Trade Center', 'Bahrain Fort'],
  comoros: ['Moroni (Comoros)', 'Mount Karthala'],
  'republic-of-the-congo': ['Brazzaville', 'Basilique Sainte-Anne du Congo', 'Lesio-Louna Reserve'],
  djibouti: ['Lake Assal (Djibouti)', 'Djibouti City'],
  eritrea: ['Asmara', 'Massawa'],
  eswatini: ['Malolotja Nature Reserve', 'Hlane Royal National Park'],
  grenada: ["St. George's (Grenada)", 'Grand Anse Beach (Grenada)'],
  guyana: ['Kaieteur Falls', 'Georgetown, Guyana'],
  'marshall-islands': ['Majuro', 'Arno Atoll'],
  micronesia: ['Nan Madol', 'Pohnpei'],
  'saint-vincent-and-the-grenadines': ['Kingstown', 'Tobago Cays'],
  turkmenistan: ['Ashgabat', 'Darvaza gas crater'],
  'vatican-city': ["Saint Peter's Basilica", "Saint Peter's Square", 'Vatican Gardens'],
  'central-african-republic': ['Bangui', 'Boali', 'Dzanga-Sangha Special Reserve'],
  nauru: ['Anibare Bay', 'Buada Lagoon', 'Yaren District'],
  samoa: ['To Sua Ocean Trench', 'Apia', 'Lalomanu Beach'],
  'timor-leste': ['Landscapes of East Timor', 'Dili', 'Cristo Rei of Dili'],
  tuvalu: ['Funafuti', 'Funafuti Conservation Area'],
};
const unsuitableSubjects = /\b(maps?|charts?|banknotes?|coins?|stamps?|herbarium|specimens?|spécimens?|Kew Gardens|extreme closeup|Rimini airport|CR400BF|USS|amphibious transport dock|watering can|cultivateur de cacao|small fish drying|parqueo)\b/i;

export function is4K(image) {
  return image.width >= 3840 && image.height >= 2160;
}

export function nextPhotoIndex(gallery, upgrading = false) {
  const replacement = upgrading ? gallery.findIndex(image => !is4K(image)) : -1;
  return replacement >= 0 ? replacement : gallery.length < target ? gallery.length : -1;
}

function photoIdentity(image) {
  return decodeURIComponent(image.sourceUrl).replace(/_/g, ' ').replace(/\.jpe?g$/i, '')
    .replace(/(?:[ -]*\((?:cropped|crop|edited|retouched)(?: \d+)?\)|[ -]+(?:cropped|crop|edited|retouched))$/i, '').toLowerCase();
}

function plain(value = '') {
  return String(value).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, ' ').replace(/&#(x[0-9a-f]+|\d+);/gi, (_, code) => String.fromCodePoint(code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : Number(code)))
    .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (_, entity) => ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' })[entity])
    .replace(/\s+/g, ' ').trim();
}

function cleanFileTitle(title) {
  return plain(plain(title)).replace(/^File:/i, '').replace(/\.jpe?g$/i, '').replace(/_/g, ' ')
    .replace(/^\d{5,}\s*[-–]\s*/, '').replace(/\s*\(\d{8,}\)$/, '').replace(/\s*\((?:cropped|edited|retouched)\)$/i, '').trim();
}

export function cleanCaption(value, title) {
  let raw = String(value ?? '');
  const languages = [...raw.matchAll(/<(?:div|span)\b[^>]*\blang=["']([^"']+)["'][^>]*>/gi)];
  if (languages.length > 1) {
    const index = Math.max(0, languages.findIndex(match => /^en(?:-|$)/i.test(match[1])));
    raw = raw.slice(languages[index].index + languages[index][0].length, languages[index + 1]?.index);
  }
  let text = plain(plain(raw));
  const labels = [...text.matchAll(/(?:^|\s)(English|Deutsch|Français|Español|Italiano|Português|Русский|Polski|Nederlands|中文|日本語|العربية|en|de|fr|es|it|pt|ru|pl|nl|zh|ja|ar)\s*:\s*/giu)];
  if (labels.length > 1 || labels[0]?.index === 0) {
    const index = Math.max(0, labels.findIndex(match => /^(?:English|en)$/i.test(match[1])));
    text = text.slice(labels[index].index + labels[index][0].length, labels[index + 1]?.index).trim();
  }
  const notice = text.search(/\bThis is (?:a |an )?(?:photo(?:graph|graphy)?|image) of\b/i);
  if (notice >= 0 && /\b(?:heritage|monument|protected|identified|Natura 2000|natural site|Cultural Site)\b/i.test(text.slice(notice))) text = text.slice(0, notice).trim();
  text = text.replace(/\b(?:World Heritage Site\s+)?[\p{L}\s-]*cultural heritage:\s*ID\b.*$/iu, '').trim();
  if (/creative commons|all rights reserved|attribution-sharealike|Atribusi-BerbagiSerupa|^Notera\s+Av dokumentationsskäl|^For documentation purposes|^focus is just perfect|^This is an image with the theme\b|^Esta fotografía fue tomada en (?:el municipio colombiano|un área protegida de Colombia)\b/i.test(text)) text = '';
  const sentences = [...new Intl.Segmenter('en', { granularity: 'sentence' }).segment(text)].map(part => part.segment.trim());
  const seen = new Set();
  text = sentences.filter(sentence => {
    const key = sentence.toLocaleLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).join(' ');
  const repeated = text.match(/^(.{12,}?)\s+\1(?:\s+\1)*[.!]?$/iu);
  if (repeated) text = repeated[1];
  text = (text || cleanFileTitle(title)).replace(/([.!?。！？])\s*…$/u, '$1');
  if (text.length > 320) {
    const shortened = text.slice(0, 317).replace(/\s+\S*$/, '');
    text = /[.!?。！？]$/u.test(shortened) ? shortened : `${shortened}…`;
  }
  return text;
}

function sanitizeGalleryCaptions(gallery) {
  const titles = gallery.map(image => cleanFileTitle(decodeURIComponent(new URL(image.sourceUrl).pathname.replace(/^\/wiki\/File:/, ''))));
  const captions = gallery.map((image, index) => cleanCaption(image.caption, titles[index]));
  const counts = new Map();
  for (const caption of captions) counts.set(caption, (counts.get(caption) ?? 0) + 1);
  const seen = new Set();
  let changed = 0;
  gallery.forEach((image, index) => {
    const base = counts.get(captions[index]) > 1 ? titles[index] : captions[index];
    let caption = base;
    let view = index + 1;
    while (seen.has(caption)) caption = `${base} — view ${view++}`;
    seen.add(caption);
    if (image.caption !== caption) { image.caption = caption; changed++; }
  });
  return changed;
}

const originCooldowns = new Map();

function retryAfterMs(value) {
  if (!value) return 0;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1000;
  const deadline = Date.parse(value);
  return Number.isFinite(deadline) ? Math.max(0, deadline - Date.now()) : 0;
}

function deferOrigin(origin, milliseconds) {
  originCooldowns.set(origin, Math.max(originCooldowns.get(origin) ?? 0, Date.now() + milliseconds));
}

async function waitForOrigin(origin) {
  let remaining;
  while ((remaining = (originCooldowns.get(origin) ?? 0) - Date.now()) > 0) {
    if (remaining > 60000) throw Object.assign(new Error(`Requests deferred for ${origin}: server retry delay exceeds 60 seconds; resume later`), { permanent: true });
    await delay(Math.ceil(remaining));
  }
}

async function request(url, attempts = 4, method = 'GET') {
  const origin = new URL(url).origin;
  let failure;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      await waitForOrigin(origin);
      const response = await fetch(url, { headers, method, signal: AbortSignal.timeout(15000) });
      if (response.ok) return response;
      const retryable = [429, 500, 502, 503, 504].includes(response.status);
      const serverDelay = retryAfterMs(response.headers.get('retry-after'));
      if (retryable || serverDelay) deferOrigin(origin, Math.max(serverDelay, 1000 * 2 ** attempt));
      await response.body?.cancel();
      throw Object.assign(new Error(`HTTP ${response.status}: ${url}`), { permanent: !retryable || attempt + 1 === attempts });
    } catch (error) {
      failure = error;
      if (error.permanent || attempt + 1 === attempts) break;
      await delay(1000 * 2 ** attempt);
    }
  }
  throw failure;
}

let nextApiRequest = 0;
async function api(host, params) {
  const wait = Math.max(0, nextApiRequest - Date.now());
  nextApiRequest = Date.now() + wait + 400;
  await delay(wait);
  const url = new URL(`https://${host}/w/api.php`);
  url.search = new URLSearchParams({ action: 'query', format: 'json', formatversion: '2', maxlag: '5', ...params });
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await request(url);
    const json = await response.json();
    if (!json.error) return json;
    if (json.error.code !== 'maxlag' && json.error.code !== 'ratelimited') throw new Error(JSON.stringify(json.error));
    deferOrigin(url.origin, Math.max(retryAfterMs(response.headers.get('retry-after')), 2000 * 2 ** attempt));
    if (attempt < 3) await waitForOrigin(url.origin);
  }
  throw new Error(`Wikimedia API remained busy: ${host}`);
}

function jpegSize(buffer) {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8 || buffer.at(-2) !== 0xff || buffer.at(-1) !== 0xd9) throw new Error('Invalid or truncated JPEG');
  let offset = 2;
  let ffmpegEncoded = false;
  while (offset + 8 < buffer.length) {
    if (buffer[offset++] !== 0xff) continue;
    let marker = buffer[offset++];
    while (marker === 0xff) marker = buffer[offset++];
    if ([0xd8, 0xd9, 0x01].includes(marker) || (marker >= 0xd0 && marker <= 0xd7)) continue;
    const length = buffer.readUInt16BE(offset);
    if (length < 2 || offset + length > buffer.length) throw new Error('Malformed JPEG segment');
    if (marker === 0xfe && /^Lavc\d+\./.test(buffer.toString('ascii', offset + 2, offset + length))) ffmpegEncoded = true;
    if ([0xc0, 0xc1, 0xc2].includes(marker)) return { width: buffer.readUInt16BE(offset + 5), height: buffer.readUInt16BE(offset + 3), ffmpegEncoded };
    offset += length;
  }
  throw new Error('JPEG dimensions unavailable');
}

function licenseFor(meta) {
  const name = plain(meta.LicenseShortName?.value);
  let url = plain(meta.LicenseUrl?.value);
  if (url.startsWith('//')) url = `https:${url}`;
  url = url.replace(/^http:/i, 'https:');
  if (/^CC0(?:\s|$)/i.test(name)) return { license: name, licenseUrl: url || 'https://creativecommons.org/publicdomain/zero/1.0/' };
  if (/^Public domain$/i.test(name)) return { license: name, licenseUrl: url || 'https://creativecommons.org/publicdomain/mark/1.0/' };
  if (/^CC BY(?:-SA)? \d\.\d(?: [A-Z-]+)?$/i.test(name) && /^https?:\/\/creativecommons\.org\/licenses\/by(?:-sa)?\//i.test(url)) return { license: name, licenseUrl: url.replace(/^http:/, 'https:') };
  return null;
}

async function articleFiles(article) {
  const titles = [];
  let continuation = {};
  do {
    const result = await api('en.wikipedia.org', { titles: article, redirects: '1', prop: 'images', imlimit: '500', ...continuation });
    for (const page of result.query?.pages ?? []) for (const image of page.images ?? []) titles.push(image.title);
    continuation = result.continue;
  } while (continuation);
  return titles;
}

async function candidatesFor(titles, country) {
  const eligible = [...new Set(titles)].filter(title => /\.jpe?g$/i.test(title) && !excluded.test(title) && !/\b(?:1[0-8]\d{2}|19[0-4]\d)\b/.test(title));
  const candidates = [];
  for (let index = 0; index < eligible.length;) {
    const batch = [];
    let encodedLength = 0;
    while (index < eligible.length && batch.length < 50) {
      const length = encodeURIComponent(eligible[index]).length + 3;
      if (batch.length && encodedLength + length > 6000) break;
      batch.push(eligible[index++]);
      encodedLength += length;
    }
    const result = await api('commons.wikimedia.org', { titles: batch.join('|'), prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata', iiextmetadatalanguage: 'en' });
    for (const page of result.query?.pages ?? []) {
      const info = page.imageinfo?.[0];
      if (!info || info.mime !== 'image/jpeg' || info.width < 1600 || info.height < 700 || info.width / info.height > 3.3 || info.height / info.width > 1.8) continue;
      const meta = info.extmetadata ?? {};
      const license = licenseFor(meta);
      if (!license || meta.Restrictions?.value) continue;
      const title = plain(page.title.replace(/^File:/, '').replace(/\.jpe?g$/i, '').replace(/_/g, ' '));
      const description = plain(meta.ImageDescription?.value);
      // Country articles can contain illustrative photographs taken abroad.
      if (country.id === 'ecuador' && /\bPeru\b/i.test(description) && !/\bEcuador\b/i.test(description)) continue;
      if (country.id === 'iraq' && /\bIndia\b/i.test(description)) continue;
      const context = `${title} ${description} ${plain(meta.Categories?.value).replace(/_/g, ' ')}`;
      if (excluded.test(context) || unsuitableSubjects.test(context) || !scenic.test(context)) continue;
      const photographer = plain(meta.Artist?.value || meta.Attribution?.value);
      if (!photographer || photographer.length > 1500) continue;
      const subject = cleanCaption(meta.ImageDescription?.value, title);
      candidates.push({
        fileTitle: page.title,
        fullUrl: info.url,
        alt: `${country.name}: ${title}`,
        caption: subject,
        photographer,
        sourceUrl: info.descriptionurl,
        ...license,
        width: info.width,
        height: info.height,
        score: (is4K(info) ? 100 : 0) + (scenic.test(title) ? 20 : 0) + Math.min(info.width / 1000, 12),
      });
    }
  }
  return candidates.sort((a, b) => b.score - a.score);
}

async function categoryFiles(country, kind, categoryName) {
  const categoryNames = {
    bahamas: 'the Bahamas', gambia: 'the Gambia', georgia: 'Georgia', ireland: 'Ireland',
    uk: 'the United Kingdom', usa: 'the United States', netherlands: 'the Netherlands',
    philippines: 'the Philippines', 'czech-republic': 'the Czech Republic',
    'democratic-republic-of-the-congo': 'the Democratic Republic of the Congo',
    'republic-of-the-congo': 'the Republic of the Congo', uae: 'the United Arab Emirates',
    micronesia: 'the Federated States of Micronesia', 'marshall-islands': 'the Marshall Islands',
    maldives: 'the Maldives', 'solomon-islands': 'the Solomon Islands',
    'central-african-republic': 'the Central African Republic', 'dominican-republic': 'the Dominican Republic',
    comoros: 'the Comoros',
  };
  const category = categoryName ?? `${kind} ${categoryNames[country.id] ?? country.article.replace(/_/g, ' ')}`;
  const files = [];
  const queue = [`Category:${category}`];
  const seen = new Set();
  while (queue.length && seen.size < 8 && files.length < 140) {
    const title = queue.shift();
    if (seen.has(title) || excluded.test(title)) continue;
    seen.add(title);
    const result = await api('commons.wikimedia.org', { list: 'categorymembers', cmtitle: title, cmlimit: '100', cmtype: 'file|subcat' });
    for (const member of result.query?.categorymembers ?? []) {
      if (member.ns === 6) files.push(member.title);
      else if (!excluded.test(member.title)) queue.push(member.title);
    }
  }
  return files;
}

async function download(candidate, id, index, fingerprints = []) {
  const result = await api('commons.wikimedia.org', { titles: candidate.fileTitle, prop: 'imageinfo', iiprop: 'url', iiurlwidth: String(previewWidth) });
  const thumbUrl = result.query?.pages?.[0]?.imageinfo?.[0]?.thumburl;
  if (!thumbUrl) throw new Error('Verified thumbnail URL unavailable');
  const response = await request(thumbUrl, 2);
  if (!/^image\/jpeg(?:;|$)/i.test(response.headers.get('content-type') ?? '')) throw new Error('Thumbnail MIME is not JPEG');
  if (Number(response.headers.get('content-length')) > maxPreviewBytes) throw new Error('Thumbnail too large');
  const chunks = [];
  let bytes = 0;
  for await (const chunk of response.body) {
    bytes += chunk.length;
    if (bytes > maxPreviewBytes) throw new Error('Thumbnail exceeded bounded size');
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  const dimensions = jpegSize(buffer);
  if (dimensions.width > previewWidth || dimensions.width < 320 || dimensions.width > candidate.width || dimensions.height > candidate.height) throw new Error('Invalid thumbnail dimensions');
  if (fingerprints.includes(createHash('sha256').update(buffer).digest('hex'))) throw new Error('Duplicate photograph bytes');
  const filename = `${id}-${index + 1}.jpg`;
  const pending = path.join(imageDir, `.${filename}.pending`);
  try {
    await writeFile(pending, buffer);
    await replaceFile(pending, path.join(imageDir, filename));
  } finally {
    await unlink(pending).catch(error => { if (error.code !== 'ENOENT') throw error; });
  }
  const { fileTitle: _fileTitle, score: _score, ...image } = candidate;
  return { url: `/images/countries/${filename}`, ...image };
}

async function replaceFile(pending, destination) {
  for (let attempt = 0; ; attempt++) {
    try { await rename(pending, destination); return; }
    catch (error) {
      if (!['EPERM', 'EBUSY', 'EACCES'].includes(error.code) || attempt >= 6) throw error;
      await delay(100 * 2 ** attempt);
    }
  }
}

async function optimizePreview(image) {
  const filename = path.join(imageDir, path.basename(image.url));
  const original = await readFile(filename);
  if (original.length <= 100 * 1024 || jpegSize(original).ffmpegEncoded) return;
  const pending = path.join(imageDir, `.${path.basename(image.url)}.optimized.jpg`);
  try {
    await new Promise((resolve, reject) => {
      const process = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-threads', '1', '-i', filename, '-frames:v', '1', '-threads', '1', '-q:v', '7', '-pix_fmt', 'yuvj420p', '-map_metadata', '-1', pending], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
      let errorText = '';
      process.stderr.on('data', chunk => { errorText = (errorText + chunk).slice(-2000); });
      process.once('error', reject);
      process.once('close', code => code === 0 ? resolve() : reject(new Error(`FFmpeg exited ${code}: ${errorText}`)));
    });
    const optimized = await readFile(pending);
    const before = jpegSize(original);
    const after = jpegSize(optimized);
    if (optimized.length < original.length && before.width === after.width && before.height === after.height) await replaceFile(pending, filename);
  } finally {
    await unlink(pending).catch(error => { if (error.code !== 'ENOENT') throw error; });
  }
}

async function existingFingerprint(image, id) {
  if (!image.licenseUrl?.startsWith('https://')) return false;
  if (unsuitableSubjects.test(`${image.alt} ${image.caption}`)) return false;
  if (id === 'iraq' && /\bIndia\b/i.test(image.caption)) return false;
  if (id === 'ecuador' && /\bPeru\b/i.test(image.caption) && !/\bEcuador\b/i.test(image.caption)) return false;
  if (!image.url?.startsWith(`/images/countries/${id}-`) || !image.url.endsWith('.jpg') || image.url.includes('..')) return false;
  if (!image.fullUrl?.startsWith('https://upload.wikimedia.org/') || !image.sourceUrl?.startsWith('https://commons.wikimedia.org/wiki/File:') || !image.photographer || !image.alt || !image.caption || !Number.isInteger(image.width) || !Number.isInteger(image.height) || image.width < 1600 || image.height < 700 || excluded.test(`${image.alt} ${image.caption}`)) return false;
  if (!licenseFor({ LicenseShortName: { value: image.license }, LicenseUrl: { value: image.licenseUrl } }) || !image.licenseUrl || /<[^>]*>/.test(image.photographer)) return false;
  try {
    const buffer = await readFile(path.join(imageDir, path.basename(image.url)));
    if (buffer.length > maxPreviewBytes) return false;
    const dimensions = jpegSize(buffer);
    if (dimensions.width < 320 || dimensions.width > previewWidth || dimensions.width > image.width) return false;
    return createHash('sha256').update(buffer).digest('hex');
  } catch { return false; }
}

async function loadCatalog() {
  const catalogPath = path.join(root, 'src', 'data', 'countryCatalog.ts');
  const source = await readFile(catalogPath, 'utf8');
  // The catalog export is data-only; transpilation avoids requiring a TS runner.
  const javascript = stripTypeScriptTypes(source, { mode: 'transform' });
  const catalog = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString('base64')}`);
  const countries = catalog.requestedCountries;
  if (!Array.isArray(countries) || countries.some(country => !/^[a-z0-9-]+$/.test(country.id) || !country.name || !country.article)) throw new Error('Invalid requestedCountries catalog');
  // Oman is retained from the existing 67-country collection.
  return countries.some(country => country.id === 'oman') ? countries : [...countries, { id: 'oman', name: 'Oman', article: 'Oman' }];
}

async function main() {
  if (landmarksOnly && !upgrade) throw new Error('--landmarks-only requires --upgrade');
  const countries = (await loadCatalog()).filter(country => !selected || selected.includes(country.id));
  if (!countries.length) throw new Error('No matching countries');
  await mkdir(imageDir, { recursive: true });
  let galleries;
  try { galleries = JSON.parse(await readFile(output, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; galleries = {}; }
  const failures = [];
  const shortfalls = [];
  let next = 0;
  let writes = Promise.resolve();
  const save = () => {
    writes = writes.catch(() => {}).then(async () => {
      const pending = path.join(imageDir, '.manifest-pending.json');
      await writeFile(pending, `${JSON.stringify(galleries, null, 2)}\n`);
      await replaceFile(pending, output);
    });
    return writes;
  };
  if (!verifyOnly) {
    let captionsUpdated = 0;
    for (const country of countries) captionsUpdated += sanitizeGalleryCaptions(galleries[country.id] ?? []);
    if (captionsUpdated) await save();
    if (cleanCaptionsOnly) {
      console.log(JSON.stringify({ countries: countries.length, captionsUpdated, networkRequests: 0 }, null, 2));
      return;
    }
  }
  async function sync(country) {
    const current = galleries[country.id] ?? [];
    const fingerprints = await Promise.all(current.map(image => existingFingerprint(image, country.id)));
    const valid = current.length <= target && fingerprints.every(Boolean) && new Set(fingerprints).size === current.length && ['url', 'fullUrl', 'sourceUrl'].every(key => new Set(current.map(image => image[key])).size === current.length) && new Set(current.map(photoIdentity)).size === current.length;
    if (verifyOnly) {
      if (!valid || current.length !== target) shortfalls.push(`${country.id}: ${current.length}/${target}${valid ? '' : ' invalid local files/metadata'}`);
      return;
    }
    if (!refresh && valid && nextPhotoIndex(current, upgrade) < 0) { console.log(`${country.id}: resumed ${target}/${target}`); return; }
    if (upgrade && !valid) throw new Error('Upgrade requires valid existing photographs; repair separately before upgrading');
    // Keep working previews and metadata until a genuine 4K replacement is downloaded.
    const gallery = (upgrade || !refresh) && valid ? [...current] : [];
    galleries[country.id] = gallery;
    const seen = new Set(gallery.map(photoIdentity));
    const complete = () => nextPhotoIndex(gallery, upgrade) < 0;
    async function accept(candidates) {
      for (const candidate of candidates) {
        if (complete()) break;
        if (upgrade && !is4K(candidate)) continue;
        const identity = photoIdentity(candidate);
        if (seen.has(identity)) continue;
        seen.add(identity);
        try {
          console.log(`${country.id}: downloading ${candidate.alt}`);
          const index = nextPhotoIndex(gallery, upgrade);
          let slot = gallery[index] ? Number(gallery[index].url.match(/-(\d+)\.jpg$/)[1]) - 1 : 0;
          if (!gallery[index]) while (gallery.some(image => image.url === `/images/countries/${country.id}-${slot + 1}.jpg`)) slot++;
          const hashes = await Promise.all(gallery.map(image => existingFingerprint(image, country.id)));
          gallery[index] = await download(candidate, country.id, slot, hashes);
          sanitizeGalleryCaptions(gallery);
          await save();
        }
        catch (error) { failures.push(`${country.id}: ${error.message}`); console.warn(`${country.id}: skipped ${candidate.alt}: ${error.message}`); }
      }
    }
    const titles = [];
    for (const article of landmarksOnly ? [] : [country.article, ...(landmarkArticles[country.id] ?? [])]) titles.push(...await articleFiles(article));
    const articleCandidates = await candidatesFor(titles, country);
    console.log(`${country.id}: ${articleCandidates.length} eligible article photographs`);
    const lowerResolution = articleCandidates.filter(image => !is4K(image));
    await accept(articleCandidates.filter(is4K));
    for (const kind of landmarksOnly ? [] : ['Landscapes of', 'Cityscapes of', 'Nature of', 'Tourist attractions in']) {
      if (complete()) break;
      const categoryCandidates = await candidatesFor(await categoryFiles(country, kind), country);
      console.log(`${country.id}: ${categoryCandidates.length} eligible ${kind.toLowerCase()} photographs`);
      lowerResolution.push(...categoryCandidates.filter(image => !is4K(image)));
      await accept(categoryCandidates.filter(is4K));
    }
    for (const name of landmarkCategories[country.id] ?? []) {
      if (complete()) break;
      const categoryCandidates = await candidatesFor(await categoryFiles(country, '', name), country);
      lowerResolution.push(...categoryCandidates.filter(image => !is4K(image)));
      await accept(categoryCandidates.filter(is4K));
    }
    if (!upgrade) await accept(lowerResolution.sort((a, b) => b.score - a.score));
    galleries[country.id] = gallery;
    await save();
    console.log(`${country.id}: ${gallery.length}/${target}; ${gallery.filter(is4K).length} genuine 4K originals`);
    if (gallery.length < target) shortfalls.push(`${country.id}: ${gallery.length}/${target}`);
  }
  await Promise.all(Array.from({ length: 2 }, async () => {
    while (next < countries.length) {
      const country = countries[next++];
      try { await sync(country); } catch (error) { failures.push(`${country.id}: ${error.message}`); shortfalls.push(`${country.id}: sync failed`); console.error(`${country.id}: ${error.message}`); }
    }
  }));
  await writes;
  const images = countries.flatMap(country => galleries[country.id] ?? []);
  if (optimizePreviews && !verifyOnly) {
    let nextImage = 0;
    await Promise.all(Array.from({ length: 2 }, async () => {
      while (nextImage < images.length) await optimizePreview(images[nextImage++]);
    }));
  }
  const remaining4KGaps = Object.fromEntries(countries.map(country => [country.id, (galleries[country.id] ?? []).filter(image => !is4K(image)).length]).filter(([, count]) => count));
  console.log(JSON.stringify({ countries: countries.length, photos: images.length, genuine4K: images.filter(is4K).length, widthAtLeast3840: images.filter(image => image.width >= 3840).length, below4KBadge: images.filter(image => !is4K(image)).length, remaining4KGaps, shortfalls, failures }, null, 2));
  if (shortfalls.length) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main().catch(error => { console.error(error); process.exitCode = 1; });
