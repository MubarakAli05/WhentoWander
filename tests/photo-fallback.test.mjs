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
let Gallery;
let data;
let getHeroImageDelivery;
try {
  ({ SmartImage } = await server.ssrLoadModule('/src/components/SmartImage.tsx'));
  ({ Gallery } = await server.ssrLoadModule('/src/components/Gallery.tsx'));
  data = await server.ssrLoadModule('/src/data/index.ts');
  ({ getHeroImageDelivery } = await server.ssrLoadModule('/src/data/heroImage.ts'));
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

test('country covers use bounded responsive originals without changing local previews', () => {
  for (const country of data.allCountries) {
    const image = country.gallery[0];
    const hero = getHeroImageDelivery(image);
    assert.equal(hero.previewSrc, image.url);
    assert.ok(hero.fallbackSources.includes(image.url));
    if (hero.srcSet) {
      const widths = [...hero.srcSet.matchAll(/ (\d+)w/g)].map(match => Number(match[1]));
      assert.ok(widths.length > 0);
      assert.ok(widths.every(width => width <= 3840 && width <= image.width));
    }
  }
  const switzerland = data.allCountries.find(country => country.id === 'switzerland');
  const hero = getHeroImageDelivery(switzerland.gallery[0]);
  assert.match(hero.src, /\/1920px-View_from_Pilatus%2C_retouched.jpg$/);
  assert.match(hero.srcSet, /3840px-View_from_Pilatus%2C_retouched.jpg 3840w/);
  assert.match(hero.sizes, /^max\(100vw, \d+vh, \d+px\)$/);
  assert.equal(hero.fallbackSources[0], switzerland.gallery[0].fullUrl);
});

test('hero delivery avoids unsupported transforms and upscaling small originals', () => {
  const image = data.allCountries.find(country => country.id === 'switzerland').gallery[0];
  for (const fullUrl of ['https://example.com/photo.jpg', 'not-a-url', 'https://upload.wikimedia.org/wikipedia/commons/4/47/photo.png']) {
    const hero = getHeroImageDelivery({ ...image, fullUrl });
    assert.equal(hero.src, fullUrl);
    assert.equal(hero.srcSet, undefined);
  }
  assert.equal(getHeroImageDelivery({ ...image, width: undefined }).srcSet, undefined);
  const small = getHeroImageDelivery({ ...image, width: 800, height: 600 });
  assert.equal(small.src, image.fullUrl);
  assert.match(small.srcSet, / 800w$/);
  assert.doesNotMatch(small.srcSet, /\/thumb\//);
});

test('SmartImage renders responsive covers with an immediate local preview', () => {
  const image = data.allCountries.find(country => country.id === 'switzerland').gallery[0];
  const html = renderToStaticMarkup(createElement(SmartImage, {
    ...getHeroImageDelivery(image), alt: image.alt, loading: 'eager', fetchPriority: 'high',
  }));
  assert.match(html, /srcSet="[^"]*3840w"/);
  assert.match(html, /sizes="max\(100vw/);
  assert.match(html, /fetchpriority="high"/);
  assert.match(html, /src="\/images\/countries\/switzerland-1.jpg"/);
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

test('gallery tries the same photograph original when its preview is missing', () => {
  const image = { url: '', fullUrl: 'https://example.com/original.jpg', alt: 'Lake photograph', caption: 'Lake photograph' };
  const html = renderToStaticMarkup(createElement(Gallery, { images: [image] }));
  assert.ok(html.includes(`src="${image.fullUrl}"`));
  assert.match(html, /alt="Lake photograph"/);
  assert.ok(!html.includes(`src="${photo.url}"`));

  const previewHtml = renderToStaticMarkup(createElement(Gallery, { images: [{ ...image, url: '/preview.jpg' }] }));
  assert.match(previewHtml, /src="\/preview.jpg"/);

  const fallbackHtml = renderToStaticMarkup(createElement(Gallery, { images: [{ ...image, fullUrl: undefined }] }));
  assert.ok(fallbackHtml.includes(`src="${photo.url}"`));
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
