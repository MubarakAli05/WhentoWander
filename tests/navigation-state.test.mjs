import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const server = await createServer({ root, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
let navigation;
let favorites;
try {
  navigation = await server.ssrLoadModule('/src/components/navigation.ts');
  favorites = await server.ssrLoadModule('/src/hooks/favoritesStore.ts');
} finally {
  await server.close();
}

const { navLinks, isNavigationActive } = navigation;

test('all navigation sections have unique links and correct detail-route states', () => {
  assert.equal(new Set(navLinks.map(link => link.path)).size, navLinks.length);
  assert.ok(navLinks.some(link => link.path === '/events'));
  assert.ok(navLinks.some(link => link.path === '/phenomena'));
  for (const link of navLinks) {
    assert.deepEqual(navLinks.filter(item => isNavigationActive(link.path, item)), [link]);
    assert.ok(isNavigationActive(`${link.path}/`, link));
    for (const prefix of link.detailPaths) {
      assert.deepEqual(navLinks.filter(item => isNavigationActive(`${prefix}example`, item)), [link]);
    }
  }
  for (const unknown of ['/countryish/japan', '/month-old/january', '/unknown']) {
    assert.equal(navLinks.filter(link => isNavigationActive(unknown, link)).length, 0);
  }
});

test('favorites validate storage, synchronize subscribers and survive unavailable storage', () => {
  const previousWindow = globalThis.window;
  const target = new EventTarget();
  let raw = 'null';
  let blockRead = false;
  let blockWrite = false;
  target.localStorage = {
    getItem: () => { if (blockRead) throw new Error('Storage unavailable'); return raw; },
    setItem: (_key, value) => { if (blockWrite) throw new Error('Storage full'); raw = value; },
  };
  globalThis.window = target;
  let notifications = 0;
  const unsubscribe = favorites.subscribeFavorites(() => notifications++);
  try {
    for (const invalid of ['null', '{}', '5', '"kyoto"', '{broken']) {
      raw = invalid;
      assert.deepEqual(favorites.getFavoritesSnapshot(), []);
    }
    raw = '["kyoto",3,"",null,"kyoto"]';
    assert.deepEqual(favorites.getFavoritesSnapshot(), ['kyoto']);
    assert.equal(favorites.getFavoritesSnapshot(), favorites.getFavoritesSnapshot(), 'Snapshot must be stable');
    favorites.toggleFavorite('paris');
    assert.deepEqual(JSON.parse(raw), ['kyoto', 'paris']);
    assert.equal(notifications, 1);
    favorites.toggleFavorite('kyoto');
    assert.deepEqual(favorites.getFavoritesSnapshot(), ['paris']);
    assert.equal(notifications, 2);

    raw = '["rome"]';
    const external = new Event('storage');
    Object.defineProperty(external, 'key', { value: 'wanderlist-favorites' });
    target.dispatchEvent(external);
    assert.equal(notifications, 3);
    assert.deepEqual(favorites.getFavoritesSnapshot(), ['rome']);

    blockWrite = true;
    favorites.toggleFavorite('kyoto');
    assert.deepEqual(favorites.getFavoritesSnapshot(), ['rome', 'kyoto']);
    blockRead = true;
    favorites.toggleFavorite('rome');
    assert.deepEqual(favorites.getFavoritesSnapshot(), ['kyoto']);
    blockRead = false;
    blockWrite = false;
    raw = null;
    assert.deepEqual(favorites.getFavoritesSnapshot(), []);
    assert.deepEqual(favorites.getServerFavoritesSnapshot(), []);
    unsubscribe();
    const count = notifications;
    favorites.toggleFavorite('paris');
    assert.equal(notifications, count, 'Unsubscribed listener must not be notified');
  } finally {
    unsubscribe();
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});
