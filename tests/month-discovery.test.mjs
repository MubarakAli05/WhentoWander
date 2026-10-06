import assert from 'node:assert/strict';
import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import test from 'node:test';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const server = await createServer({ root, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
let discovery;
let data;
try {
  discovery = await server.ssrLoadModule('/src/data/monthDiscovery.ts');
  data = await server.ssrLoadModule('/src/data/index.ts');
} finally {
  await server.close();
}

const { getMonthFeature, filterMonthFeatures, getMonthDiscovery } = discovery;

test('all twelve month features have distinct local photographs and credible seasonal matches', async () => {
  const photos = new Set();
  for (const month of data.MONTHS) {
    const feature = getMonthFeature(month.month);
    assert.equal(feature.month.fullName, month.fullName);
    assert.ok(feature.country.bestMonths.includes(month.month), `${month.fullName}: country season mismatch`);
    assert.ok(feature.country.gallery.includes(feature.image));
    assert.ok(feature.image.url.startsWith('/images/countries/'));
    assert.ok(feature.image.sourceUrl && feature.image.license && feature.image.licenseUrl);
    assert.ok(feature.summary.length > 80 && feature.watchFor.length > 60);
    assert.ok((await stat(path.join(root, 'public', feature.image.url))).size > 1000);
    photos.add(feature.image.url);
  }
  assert.equal(photos.size, 12);
});

test('calendar search and quarter filters combine without hemisphere assumptions', () => {
  assert.equal(filterMonthFeatures('', '').length, 12);
  assert.deepEqual(filterMonthFeatures('', '2').map(feature => feature.month.month), [4, 5, 6]);
  assert.deepEqual(filterMonthFeatures('  Pórtugal ', '2').map(feature => feature.month.month), [5]);
  assert.equal(filterMonthFeatures('Portugal', '4').length, 0);
  assert.equal(filterMonthFeatures('nonexistent place xyz', '').length, 0);
  assert.equal(filterMonthFeatures('', 'bad-value').length, 12);
});

test('monthly country and destination filters preserve the selected month and region', () => {
  const result = getMonthDiscovery(4, 'Japan', 'Asia');
  assert.ok(result.countries.some(country => country.id === 'japan'));
  assert.ok(result.destinations.length > 0);
  assert.ok(result.destinations.every(destination => destination.countryId === 'japan'));
  const europe = getMonthDiscovery(7, '', 'Europe');
  assert.ok(europe.countries.length > 0);
  assert.ok(europe.countries.every(country => country.continent === 'Europe'));
  assert.ok(europe.destinations.every(destination => data.allCountries.find(country => country.id === destination.countryId)?.continent === 'Europe'));
  assert.deepEqual(getMonthDiscovery(4, 'no such destination xyz'), { countries: [], destinations: [] });
});
