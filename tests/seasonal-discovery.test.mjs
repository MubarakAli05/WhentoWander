import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import test from 'node:test';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const server = await createServer({ root, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
let discovery;
let events;
let phenomena;
try {
  discovery = await server.ssrLoadModule('/src/data/seasonalDiscovery.ts');
  ({ EVENTS: events } = await server.ssrLoadModule('/src/data/events.ts'));
  ({ PHENOMENA: phenomena } = await server.ssrLoadModule('/src/data/phenomena.ts'));
} finally {
  await server.close();
}

const defaults = { month: 'all', country: 'all', category: 'All', query: '' };

test('event deep links retain month, country and category with composable search', () => {
  const filters = discovery.readSeasonalFilters(new URLSearchParams('month=8&country=spain&category=Food&q=tomatina'), 'events');
  assert.deepEqual(discovery.filterEvents(filters).map(event => event.id), ['spain-la-tomatina']);
  assert.deepEqual(discovery.filterEvents({ ...filters, month: 7 }), []);
  assert.equal(discovery.filterEvents(defaults).length, events.length);
  assert.deepEqual(discovery.filterEvents({ ...defaults, query: '  KYOTO ' }).map(event => event.id), ['japan-cherry-blossom-festival']);
});

test('invalid filters fall back safely without hiding valid empty-country results', () => {
  assert.deepEqual(discovery.readSeasonalFilters(new URLSearchParams('month=13&country=unknown&category=unknown'), 'events'), defaults);
  for (const month of ['0', '-1', '4.5', 'NaN', '']) {
    assert.equal(discovery.readSeasonalFilters(new URLSearchParams({ month }), 'phenomena').month, 'all');
  }
  const filters = discovery.readSeasonalFilters(new URLSearchParams('country=afghanistan'), 'events');
  assert.equal(filters.country, 'afghanistan');
  assert.deepEqual(discovery.filterEvents(filters), []);
});

test('phenomena filtering intersects themes, guide windows, countries and search', () => {
  const filters = discovery.readSeasonalFilters(new URLSearchParams('month=1&country=iceland&category=Sky+%26+light&q=aurora'), 'phenomena');
  assert.deepEqual(discovery.filterPhenomena(filters).map(item => item.id), ['northern-lights']);
  assert.deepEqual(discovery.filterPhenomena({ ...filters, month: 6 }), []);
  assert.equal(discovery.filterPhenomena(defaults).length, phenomena.length);
  assert.ok(discovery.filterPhenomena({ ...defaults, query: ' NEW ZEALAND ' }).some(item => item.id === 'autumn-foliage'));
  assert.deepEqual(discovery.filterPhenomena({ ...defaults, category: 'Wildlife' }).map(item => item.id), ['whale-migration']);
});

test('URL updates are immutable and reset only discovery filters', () => {
  const params = new URLSearchParams('country=japan&month=4&category=Flower&q=cherry&ref=home');
  const updated = discovery.updateSeasonalFilter(params, 'country', 'all');
  assert.equal(updated.has('country'), false);
  assert.equal(updated.get('month'), '4');
  assert.equal(params.get('country'), 'japan');
  assert.equal(discovery.updateSeasonalFilter(params, 'q', '').has('q'), false);
  assert.equal(discovery.updateSeasonalFilter(params, 'q', 'all').get('q'), 'all');
  assert.equal(discovery.resetSeasonalFilters(params).toString(), 'ref=home');
});

test('every seasonal entry has distinct local, credited photography with honest labels', () => {
  for (const [entries, select] of [[events, discovery.getEventPhoto], [phenomena, discovery.getPhenomenonPhoto]]) {
    const photos = entries.map(select);
    assert.equal(new Set(photos.map(photo => photo.image.url)).size, entries.length, 'Avoid repeated thumbnails within a listing');
    for (const { image, label } of photos) {
      assert.match(image.url, /^\/images\/(countries|phenomena)\//);
      assert.ok(existsSync(path.join(root, 'public', image.url)), image.url);
      assert.ok(image.alt && image.photographer && image.sourceUrl && image.license);
      assert.match(image.sourceUrl, /^https:\/\//);
      if (image.url.startsWith('/images/countries/')) {
        assert.match(label, /preview|not current/i);
        assert.match(label, /not /i, 'Do not represent country previews as event photography');
      } else {
        assert.ok(label.length > 10);
      }
    }
  }
});

test('aurora and midnight sun use matching licensed photos across country and discovery data', () => {
  for (const id of ['northern-lights', 'midnight-sun']) {
    const phenomenon = phenomena.find(item => item.id === id);
    const { image, label } = discovery.getPhenomenonPhoto(phenomenon);
    assert.equal(image.url, `/images/phenomena/${id}.jpg`);
    assert.equal(phenomenon.image, image.url, 'Legacy consumers must not use unrelated remote images');
    assert.ok(existsSync(path.join(root, 'public', image.url)));
    assert.match(image.sourceUrl, /commons\.wikimedia\.org\/wiki\/File:/);
    assert.equal(image.license, 'CC BY-SA 4.0');
    assert.ok(image.width >= 3840 && image.height >= 2160);
    assert.doesNotMatch(label, /preview|not an aurora|not the midnight sun/i);
    assert.match(image.alt, id === 'northern-lights' ? /aurora borealis/i : /midnight sun/i);
  }
});

test('timing notes explain uncertainty and preserve hemisphere limitations', () => {
  for (const event of events) assert.ok(discovery.getEventTiming(event).length > 80);
  for (const phenomenon of phenomena) assert.ok(discovery.getPhenomenonGuidance(phenomenon).length > 80);
  const autumn = phenomena.find(item => item.id === 'autumn-foliage');
  assert.match(discovery.getPhenomenonGuidance(autumn), /Northern Hemisphere/);
  assert.match(discovery.getPhenomenonGuidance(autumn), /New Zealand/);
  assert.equal(discovery.guideMonths([12, 1, 2]), 'December · January · February');
  assert.equal(discovery.guideMonths([0, 13]), '');
});
