import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const server = await createServer({ root, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
let data;
let requestedCountries;
try {
  data = await server.ssrLoadModule('/src/data/index.ts');
  ({ requestedCountries } = await server.ssrLoadModule('/src/data/countryCatalog.ts'));
} finally {
  await server.close();
}

const { allCountries, allDestinations, getCountry, getCountryImageFallbacks, getCountriesByMonth, searchAll } = data;

test('every requested country has a unique, routable entry', () => {
  const ids = new Set(allCountries.map(country => country.id));
  assert.equal(ids.size, allCountries.length, 'Duplicate country IDs');
  assert.equal(new Set(allCountries.map(country => country.slug)).size, allCountries.length, 'Duplicate slugs');
  assert.equal(requestedCountries.length, 194);
  assert.equal(allCountries.length, 195, 'Requested countries plus the existing Oman guide');
  for (const requested of requestedCountries) {
    assert.ok(ids.has(requested.id), `Missing ${requested.name}`);
  }
  for (const country of allCountries) assert.equal(getCountry(country.slug)?.id, country.id);
});

test('every country includes specific best-for and seasonal guidance', () => {
  for (const country of allCountries) {
    assert.ok(country.capital && country.currency && country.language, country.name);
    assert.ok(country.famousFor.length >= 1, `${country.name}: missing highlights`);
    assert.ok(country.bestMonths.length > 0 && country.bestMonthsLabel, `${country.name}: missing travel window`);
    assert.ok(country.bestMonths.every(month => Number.isInteger(month) && month >= 1 && month <= 12), country.name);
    assert.equal(new Set(country.seasonalMonths.map(month => month.month)).size, 12, `${country.name}: incomplete calendar`);
    for (const month of country.bestMonths) {
      assert.ok(getCountriesByMonth(month).some(item => item.id === country.id), country.name);
    }
    assert.ok(searchAll(country.name).countries.some(item => item.id === country.id), `${country.name}: not searchable`);
  }
});

test('country galleries contain six distinct, licensed photographs with working local previews', async () => {
  const allowedLicenses = /CC|public domain|PD|Creative Commons/i;
  for (const country of allCountries) {
    assert.ok(country.gallery?.length >= 6, `${country.name}: fewer than six photos`);
    assert.equal(new Set(country.gallery.map(image => image.fullUrl)).size, country.gallery.length, `${country.name}: repeated original`);
    assert.equal(country.heroImage, country.gallery[0].url, `${country.name}: hero must use a reliable local photo`);
    for (const image of country.gallery) {
      assert.ok(image.alt && image.caption && image.photographer, `${country.name}: missing credits/caption`);
      assert.ok(allowedLicenses.test(image.license), `${country.name}: unsupported license ${image.license}`);
      for (const link of [image.sourceUrl, image.licenseUrl, image.fullUrl]) {
        assert.equal(new URL(link).protocol, 'https:', `${country.name}: non-HTTPS source`);
      }
      assert.ok(image.width > 0 && image.height > 0, `${country.name}: unknown source dimensions`);
      assert.ok(image.url.startsWith('/images/countries/'), `${country.name}: preview not local`);
      const file = path.join(root, 'public', ...image.url.split('/'));
      assert.ok((await stat(file)).size > 1000, `${image.url}: empty preview`);
      const bytes = await readFile(file);
      const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8;
      const isPng = bytes[0] === 0x89 && bytes.subarray(1, 4).toString() === 'PNG';
      const isWebp = bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP';
      assert.ok(isJpeg || isPng || isWebp, `${image.url}: invalid image content`);
    }
    assert.ok(getCountryImageFallbacks(country).some(url => url.startsWith('/images/countries/')), country.name);
  }
});

test('month searches include countries without destination guides', () => {
  for (const month of data.MONTHS) {
    const expected = getCountriesByMonth(month.month);
    const found = new Set(searchAll(month.fullName).countries.map(country => country.id));
    for (const country of expected) assert.ok(found.has(country.id), `${month.fullName}: ${country.name}`);
  }
});

test('common country-name aliases preserve existing links', () => {
  assert.equal(getCountry('united-states-of-america')?.id, 'usa');
  assert.equal(getCountry('united-kingdom')?.id, 'uk');
  assert.equal(getCountry('turkey')?.id, 'turkiye');
  assert.equal(getCountry('czechia')?.id, 'czech-republic');
  assert.equal(getCountry('viet-nam')?.id, 'vietnam');
  for (const [query, id] of [['Türkiye', 'turkiye'], ['Czech Republic', 'czech-republic'], ["Cote d'Ivoire", 'cote-divoire']]) {
    assert.ok(searchAll(query).countries.some(country => country.id === id), `${query}: alias not searchable`);
  }
});

test('existing destination links and parent associations remain intact', () => {
  assert.ok(allDestinations.length > 0);
  assert.equal(new Set(allDestinations.map(destination => destination.slug)).size, allDestinations.length);
  for (const destination of allDestinations) {
    assert.ok(allCountries.some(country => country.id === destination.countryId), destination.name);
    assert.ok(destination.heroImage && destination.gallery.length > 0, destination.name);
  }
});
