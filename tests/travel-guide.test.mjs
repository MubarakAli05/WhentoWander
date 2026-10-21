import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const server = await createServer({ root, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
let guide;
let data;
try {
  guide = await server.ssrLoadModule('/src/data/travelGuide.ts');
  data = await server.ssrLoadModule('/src/data/index.ts');
} finally {
  await server.close();
}

const sample = [
  { id: 'a', name: 'Café Central', locality: 'Vienna', kind: 'eat', lat: 48.21, lon: 16.36 },
  { id: 'b', name: 'Hotel Example', locality: 'Salzburg', kind: 'stay', lat: 47.8, lon: 13.04 },
  { id: 'c', name: 'Museum', locality: 'Vienna', kind: 'do' },
];

test('place searches combine locality, kind and accent-insensitive text', () => {
  assert.deepEqual(guide.filterPlaces(sample, 'eat', 'Vienna', '  CAFE '), [sample[0]]);
  assert.deepEqual(guide.filterPlaces(sample, 'eat', 'Salzburg', ''), []);
  assert.equal(guide.filterPlaces(sample, 'all', '', '').length, 3);
});

test('only real valid coordinates can produce map pins', () => {
  assert.ok(guide.hasCoordinates(sample[0]));
  assert.ok(!guide.hasCoordinates(sample[2]));
  for (const [lat, lon] of [[91, 0], [0, -181], [NaN, 2], [Infinity, 0], ['48', 16]]) {
    assert.ok(!guide.hasCoordinates({ ...sample[0], lat, lon }));
  }
  assert.ok(guide.hasCoordinates({ ...sample[0], lat: 0, lon: 0 }));
});

test('trip budgets correctly distinguish room nights from person days', () => {
  const result = guide.calculateBudget(guide.initialBudgets['mid-range'], 7, 2, 1);
  assert.equal(result.nights, 6);
  assert.equal(result.lines.find(line => line.key === 'stay').amount, 600);
  assert.equal(result.lines.find(line => line.key === 'food').amount, 420);
  assert.equal(result.subtotal, 1650);
  assert.equal(result.contingency, 165);
  assert.ok(Math.abs(result.total - 1815) < 0.001);
  assert.equal(guide.calculateBudget(guide.initialBudgets['mid-range'], 7, 2, 2).lines[0].amount, 1200);
  const zero = Object.fromEntries(Object.keys(guide.initialBudgets.premium).map(key => [key, 0]));
  assert.equal(guide.calculateBudget(zero, 3, 1, 1).total, 0);
});

test('itinerary includes each saved place once and groups localities', () => {
  const itinerary = guide.planDays(sample, 3);
  assert.equal(itinerary.length, 3);
  assert.deepEqual(itinerary.flat().map(place => place.id), ['a', 'c', 'b']);
  assert.equal(guide.planDays([], 7).length, 7);
  assert.deepEqual(guide.planDays(sample, 14).flat().map(place => place.id), ['a', 'c', 'b']);
});

test('external URLs reject unsafe protocols and encode public map searches', () => {
  for (const value of ['javascript:alert(1)', 'data:text/html,test', '/relative', 'not a URL']) assert.equal(guide.safeExternalUrl(value), undefined);
  assert.equal(guide.safeExternalUrl('https://example.com'), 'https://example.com/');
  const url = new URL(guide.mapSearchUrl('A & B', 'Café', 'France'));
  assert.equal(url.searchParams.get('query'), 'A & B, Café, France');
});

test('all countries have explicit research coverage and every place has provenance', async () => {
  const research = JSON.parse(await readFile(new URL('../src/data/travelResearch.json', import.meta.url), 'utf8'));
  for (const country of data.allCountries) {
    const entry = research.countries[country.id];
    assert.ok(entry, country.id);
    assert.ok(['researched', 'partial', 'unavailable'].includes(entry.status), country.id);
    assert.equal(new Set(entry.places.map(place => place.id)).size, entry.places.length, country.id);
    for (const place of entry.places) {
      assert.ok(place.name && place.locality && place.sourceUrl, `${country.id}: required place facts`);
      assert.ok(['stay', 'eat', 'do', 'area'].includes(place.kind));
      assert.ok(guide.safeExternalUrl(place.sourceUrl));
      assert.ok(entry.sources.some(source => source.url === place.sourceUrl), `${country.id}: source missing`);
      if (place.lat !== undefined || place.lon !== undefined) assert.ok(guide.hasCoordinates(place), `${country.id}: invalid coordinates`);
      if (place.tier !== undefined) assert.ok(['mid-range', 'premium'].includes(place.tier));
    }
  }
});
