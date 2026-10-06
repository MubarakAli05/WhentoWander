import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import test from 'node:test';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const server = await createServer({ root, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
let seo;
let renderPage;
try {
  seo = await server.ssrLoadModule('/src/data/seo.ts');
  ({ renderPage } = await server.ssrLoadModule('/src/entry-server.tsx'));
} finally {
  await server.close();
}

test('every public guide has a unique canonical URL and descriptive metadata', () => {
  assert.ok(seo.PUBLIC_PATHS.length > 300);
  const canonicals = new Set();
  for (const route of seo.PUBLIC_PATHS) {
    const metadata = seo.getPageSeo(route);
    assert.ok(metadata.title.includes('When to Wander'), route);
    assert.ok(metadata.description.length >= 60 && metadata.description.length <= 180, route);
    assert.equal(metadata.noindex, false, route);
    assert.equal(new URL(metadata.canonical).pathname, route);
    canonicals.add(metadata.canonical);
  }
  assert.equal(canonicals.size, seo.PUBLIC_PATHS.length);
  assert.match(seo.getPageSeo('/country/japan').description, /Japan/);
  assert.match(seo.getPageSeo('/month/january').title, /January/);
});

test('canonical URLs normalize aliases, trailing slashes and tracking parameters', () => {
  assert.equal(seo.getPageSeo('/country/united-states/').canonical, seo.getPageSeo('/country/usa').canonical);
  assert.equal(seo.getPageSeo('/countries', '?utm_source=email').canonical, `${seo.SITE_URL}/countries`);
  assert.equal(seo.getPageSeo('/countries', '?utm_source=email').noindex, false);
  assert.equal(seo.getPageSeo('/month/JANUARY').canonical, `${seo.SITE_URL}/month/january`);
});

test('private lists, searches, filtered views and invalid routes are not indexable', () => {
  for (const route of ['/search', '/wanderlist', '/missing', '/country/unknown', '/month/nonsense', '/phenomena/unknown', '/experience/unknown', '/country/japan/extra']) {
    assert.equal(seo.getPageSeo(route).noindex, true, route);
    assert.ok(!seo.PUBLIC_PATHS.includes(route));
  }
  for (const query of ['?q=japan', '?month=7', '?country=japan&category=Flower', '?region=Asia', '?window=2']) {
    assert.equal(seo.getPageSeo('/countries', query).noindex, true);
  }
});

test('social tags and structured data use the configured origin without template placeholders', () => {
  const metadata = seo.getPageSeo('/');
  const head = seo.renderSeoHead(metadata);
  assert.match(head, /property="og:image"/);
  assert.match(head, /name="twitter:description"/);
  assert.ok(head.includes(`${seo.SITE_URL}/social-preview.png`));
  assert.doesNotMatch(head, /bolt\.new|vite\.svg|localhost/);
  const structured = JSON.parse(head.match(/application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.equal(structured['@context'], 'https://schema.org');
  assert.ok(structured['@graph'].some(item => item['@type'] === 'WebSite'));
  assert.ok(structured['@graph'].some(item => item['@type'] === 'Organization'));
  const hostile = seo.renderSeoHead({ ...metadata, title: '"<&', description: '</script><script>bad</script>', structuredData: { value: '</script>' } });
  assert.ok(hostile.includes('&lt;/script&gt;'));
  assert.ok(hostile.includes('\\u003c/script>'));
  assert.doesNotMatch(hostile, /<script>bad/);
});

test('site URL validation rejects unsupported schemes, credentials and path-based origins', () => {
  assert.equal(seo.normalizeSiteUrl('https://example.com/'), 'https://example.com');
  for (const value of ['javascript:alert(1)', 'https://user:password@example.com', 'https://example.com/path', 'https://example.com?x=1', 'https://example.com#fragment']) {
    assert.throws(() => seo.normalizeSiteUrl(value));
  }
});

test('public pages render real headings, content and links without browser JavaScript', () => {
  for (const route of ['/', '/countries', '/world', '/country/japan', '/month/january', '/experience/mountains', '/phenomena/northern-lights', '/404']) {
    const html = renderPage(route);
    assert.match(html, /<h1[\s>]/, route);
    assert.ok(html.includes('href="/countries"'), route);
    assert.ok(html.includes('When to Wander'), route);
    assert.ok(html.length > 1000, route);
  }
});

test('browser, touch and social branding assets exist at their declared dimensions', () => {
  for (const [filename, width, height] of [
    ['favicon-32.png', 32, 32], ['apple-touch-icon.png', 180, 180],
    ['icon-192.png', 192, 192], ['icon-512.png', 512, 512], ['social-preview.png', 1200, 630],
  ]) {
    const bytes = readFileSync(path.join(root, 'public', filename));
    assert.equal(bytes.subarray(1, 4).toString(), 'PNG', filename);
    assert.equal(bytes.readUInt32BE(16), width, filename);
    assert.equal(bytes.readUInt32BE(20), height, filename);
  }
  for (const filename of ['favicon.svg', 'brand-mark.svg', 'site.webmanifest']) assert.ok(existsSync(path.join(root, 'public', filename)));
  const manifest = JSON.parse(readFileSync(path.join(root, 'public', 'site.webmanifest'), 'utf8'));
  assert.equal(manifest.name, 'When to Wander');
  assert.equal(manifest.start_url, '/');
});
