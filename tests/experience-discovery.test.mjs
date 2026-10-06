import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const server = await createServer({ root, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
let discovery;
let data;
try {
  discovery = await server.ssrLoadModule('/src/data/experienceDiscovery.ts');
  data = await server.ssrLoadModule('/src/data/index.ts');
} finally {
  await server.close();
}

const { experienceEditorial, experienceDestinationTopics, experienceTimingExample, getExperienceImage, getExperienceMatches, readExperienceFilters, resetExperienceFilters, updateExperienceFilter, getExperienceDestinationPhoto } = discovery;

test('every experience has a distinct licensed local photograph and actionable guidance', () => {
  const urls = new Set();
  for (const category of data.EXPERIENCE_CATEGORIES) {
    const image = getExperienceImage(category.id);
    const editorial = experienceEditorial[category.id];
    assert.match(image.url, /^\/images\/countries\/.*\.jpg$/);
    assert.ok(existsSync(fileURLToPath(new URL(`../public${image.url}`, import.meta.url))));
    assert.ok(image.photographer && image.sourceUrl && image.license && image.licenseUrl);
    assert.ok(editorial.summary && editorial.planningNote && editorial.imageLabel);
    assert.ok(!urls.has(image.url), `Repeated category photograph: ${image.url}`);
    urls.add(image.url);
  }
  assert.match(experienceEditorial['northern-lights'].imageLabel, /not an aurora photograph/);
  assert.match(getExperienceImage('mountains').caption, /Aoraki/);
  assert.match(getExperienceImage('beaches').caption, /Navagio beach/i);
  assert.match(getExperienceImage('deserts').caption, /Sahara/);
  assert.match(getExperienceImage('ancient').caption, /Giza Pyramids/);
  assert.match(getExperienceImage('adventure').caption, /Lycian Way/);
});

test('query parsing accepts only canonical months and safely handles malformed URL filters', () => {
  for (let month = 1; month <= 12; month++) {
    assert.equal(readExperienceFilters(new URLSearchParams(`month=${month}`)).month, month);
  }
  for (const month of ['', '0', '13', '-1', '1.5', '1e1', '01', 'july', 'Infinity']) {
    assert.equal(readExperienceFilters(new URLSearchParams({ month })).month, undefined);
  }
  assert.deepEqual(readExperienceFilters(new URLSearchParams('q=Mountains')), { query: 'Mountains', month: undefined });
});

test('reviewed topic membership references existing destinations without duplicates and keeps source ordering', () => {
  assert.deepEqual(Object.keys(experienceDestinationTopics).sort(), data.EXPERIENCE_CATEGORIES.map(category => category.id).sort());
  for (const category of data.EXPERIENCE_CATEGORIES) {
    const ids = experienceDestinationTopics[category.id];
    assert.equal(new Set(ids).size, ids.length);
    for (const id of ids) assert.ok(data.allDestinations.some(destination => destination.id === id), `Unknown destination: ${id}`);
    assert.deepEqual(getExperienceMatches(category.id), data.allDestinations.filter(destination => ids.includes(destination.id)));
    assert.ok(getExperienceMatches(category.id).length > 0);
  }
  assert.deepEqual(getExperienceMatches('unknown'), []);
});

test('country-wide seed text cannot turn Serengeti into a beach or mountain recommendation', () => {
  const serengeti = data.allDestinations.find(destination => destination.id === 'tanzania-highlights');
  assert.match(serengeti.description, /Zanzibar beaches/);
  assert.ok(serengeti.activities.includes('Mountains'));
  for (const id of ['beaches', 'mountains', 'islands', 'cities']) {
    assert.ok(!getExperienceMatches(id).includes(serengeti), `Serengeti leaked into ${id}`);
    assert.ok(!getExperienceMatches(id, 'mountains', 7).includes(serengeti));
  }
  assert.deepEqual(getExperienceMatches('beaches', 'mountains', 7), []);
  assert.ok(getExperienceMatches('nature', 'Serengeti', 7).includes(serengeti));
  assert.ok(getExperienceMatches('adventure', 'Tanzania', 7).includes(serengeti));
});

test('substring collisions and references to other places do not assign unrelated topics', () => {
  const excludes = {
    beaches: ['sahara', 'maasai-mara', 'finnish-lapland', 'mount-fuji'],
    snow: ['venice', 'kerala', 'bali', 'cappadocia'],
    cities: ['mount-fuji', 'petra', 'mongolia-highlights'],
    mountains: ['germany-highlights', 'austria-highlights', 'argentina-highlights'],
    islands: ['sri-lanka-highlights', 'malaysia-highlights'],
    'northern-lights': ['sweden-highlights', 'argentina-highlights'],
  };
  for (const [category, ids] of Object.entries(excludes)) {
    const results = getExperienceMatches(category).map(destination => destination.id);
    for (const id of ids) assert.ok(!results.includes(id), `${id} leaked into ${category}`);
  }
});

test('faithful topics retain relevant coastal, mountain, floral, winter and wildlife destinations', () => {
  const includes = {
    beaches: ['phuket', 'amalfi-coast', 'kerala', 'sydney'],
    mountains: ['mount-fuji', 'swiss-alps', 'banff'],
    blossoms: ['kyoto', 'provence', 'bollenstreek'],
    deserts: ['sahara', 'mongolia-highlights', 'chile-highlights'],
    cities: ['tokyo', 'venice', 'germany-highlights'],
    snow: ['swiss-alps', 'queenstown', 'finnish-lapland'],
    islands: ['bali', 'lofoten', 'ecuador-highlights'],
    nature: ['maasai-mara', 'tanzania-highlights', 'botswana-highlights'],
    'northern-lights': ['reykjavik-and-golden-circle', 'lofoten', 'finnish-lapland'],
  };
  for (const [category, ids] of Object.entries(includes)) {
    const results = getExperienceMatches(category).map(destination => destination.id);
    for (const id of ids) assert.ok(results.includes(id), `${id} missing from ${category}`);
  }
});

test('theme searches survive detail navigation and month filters intersect destination visiting months', () => {
  for (const category of data.EXPERIENCE_CATEGORIES) {
    const all = getExperienceMatches(category.id);
    assert.deepEqual(getExperienceMatches(category.id, `  ${category.label.toUpperCase()}  `), all);
    for (let month = 1; month <= 12; month++) {
      assert.deepEqual(getExperienceMatches(category.id, category.label, month), all.filter(destination => destination.bestMonths.includes(month)));
    }
  }
});

test('country and destination searches are normalized and impossible queries are empty', () => {
  const japan = getExperienceMatches('cities', '  JAPAN  ');
  assert.ok(japan.length > 0);
  assert.ok(japan.every(destination => destination.countryId === 'japan'));
  const destination = getExperienceMatches('ancient')[0];
  assert.ok(getExperienceMatches('ancient', destination.name).some(item => item.id === destination.id));
  assert.deepEqual(getExperienceMatches('cities', 'Jápán'), japan);
  for (const category of data.EXPERIENCE_CATEGORIES) {
    assert.deepEqual(getExperienceMatches(category.id, 'no-place-matches-this-97531'), []);
  }
});

test('filter updates and reset preserve unrelated URL state without mutating the original', () => {
  const original = new URLSearchParams('q=Japan&month=4&source=guide');
  const updated = updateExperienceFilter(original, 'month', '10');
  assert.equal(updated.get('q'), 'Japan');
  assert.equal(updated.get('month'), '10');
  assert.equal(updated.get('source'), 'guide');
  assert.equal(original.get('month'), '4');
  assert.equal(updateExperienceFilter(updated, 'q', '').has('q'), false);
  assert.equal(resetExperienceFilters(original).toString(), 'source=guide');
  assert.equal(original.get('q'), 'Japan');
});

test('timing examples use actual destination months and qualify activity availability', () => {
  const destination = { name: 'Example base', bestMonths: [12, 1, 2] };
  const timing = experienceTimingExample([destination]);
  assert.equal(timing, 'Example base: JAN, FEB, DEC. Destination visiting months; activity conditions may differ.');
  assert.match(experienceTimingExample([]), /local seasonal guidance/);
  assert.match(experienceTimingExample([{ name: 'Unknown season', bestMonths: [] }]), /local seasonal guidance/);
});

test('destination cards use licensed country previews and do not imply an unrelated subject is the destination', () => {
  for (const destination of data.allDestinations) {
    const { image, label } = getExperienceDestinationPhoto(destination);
    const country = data.allCountries.find(item => item.id === destination.countryId);
    assert.ok(country.gallery.some(item => item.url === image.url));
    assert.match(image.url, /^\/images\/countries\//);
    assert.ok(image.license && image.sourceUrl);
    assert.doesNotMatch(`${image.alt} ${image.caption ?? ''}`, /woodcut|woodblock|painting|lithograph|engraving|coat of arms|flag of|map of|logo|drawing|illustration/i);
    assert.match(label, /location preview/);
    if (!label.startsWith(`${destination.name} ·`)) assert.match(label, /not necessarily this destination/);
  }
});
