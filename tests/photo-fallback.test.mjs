import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const photo = JSON.parse(await readFile(path.join(root, 'src/data/fallbackPhoto.json'), 'utf8'));
const server = await createServer({ root, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
let SmartImage;
let data;
try {
  ({ SmartImage } = await server.ssrLoadModule('/src/components/SmartImage.tsx'));
  data = await server.ssrLoadModule('/src/data/index.ts');
} finally {
  await server.close();
}

function jpegDimensions(bytes) {
  assert.equal(bytes.readUInt16BE(0), 0xffd8);
  let offset = 2;
  while (offset < bytes.length) {
    assert.equal(bytes[offset], 0xff);
    const marker = bytes[offset + 1];
    if ([0xc0, 0xc1, 0xc2].includes(marker)) {
      return { width: bytes.readUInt16BE(offset + 7), height: bytes.readUInt16BE(offset + 5) };
    }
    offset += 2 + bytes.readUInt16BE(offset + 2);
  }
  throw new Error('Missing JPEG dimensions');
}

test('bundled fallback has genuine 4K pixels and complete attribution', async () => {
  const bytes = await readFile(path.join(root, 'public', photo.url));
  const dimensions = jpegDimensions(bytes);
  assert.deepEqual(dimensions, { width: photo.width, height: photo.height });
  assert.ok(dimensions.width >= 3840 && dimensions.height >= 2160);
  assert.ok(photo.originalWidth >= photo.width && photo.originalHeight >= photo.height);
  assert.equal(photo.originalWidth / photo.originalHeight, photo.width / photo.height);
  for (const key of ['photographer', 'license', 'licenseUrl', 'sourceUrl', 'originalUrl', 'modifications']) assert.ok(photo[key], key);
  assert.ok(bytes.length < 3 * 1024 * 1024, 'Keep the fallback below 3 MiB');
});

test('all country chains preserve subject photos before the shared photographic fallback', () => {
  for (const country of data.allCountries) {
    const sources = data.getCountryImageFallbacks(country);
    assert.equal(sources.at(-1), photo.url, country.name);
    assert.equal(sources[0], country.gallery[1].url, country.name);
    assert.equal(country.heroImage, country.gallery[0].url, country.name);
  }
});

test('SmartImage keeps primary photos and identifies a generic fallback honestly', () => {
  const primary = renderToStaticMarkup(createElement(SmartImage, { src: '/subject.jpg', alt: 'Requested subject' }));
  assert.match(primary, /src="\/subject.jpg"/);
  assert.match(primary, /alt="Requested subject"/);
  for (const src of ['', photo.url]) {
    const html = renderToStaticMarkup(createElement(SmartImage, { src, alt: 'Requested subject', loading: 'eager' }));
    assert.ok(html.includes(`src="${photo.url}"`));
    assert.match(html, /Travel photo fallback: Lake Pukaki/);
    assert.match(html, /Requested photo: Requested subject/);
    assert.doesNotMatch(html, /Travel illustration/);
  }
});

test('no illustrated fallback remains in application source or public fallback assets', async () => {
  const files = await readdir(path.join(root, 'src'), { recursive: true });
  for (const file of files.filter(file => /\.(tsx?|json|css)$/.test(file))) {
    const content = await readFile(path.join(root, 'src', file), 'utf8');
    assert.doesNotMatch(content, /travel-fallback\.svg|data:image\/svg/, file);
  }
  const assets = await readdir(path.join(root, 'public/images/fallback'));
  assert.deepEqual(assets, ['travel-landscape-4k.jpg']);
});
