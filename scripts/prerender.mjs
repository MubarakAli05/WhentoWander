import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = path.join(root, 'dist');
const template = await readFile(path.join(dist, 'index.html'), 'utf8');
const server = await createServer({ root, mode: 'production', server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
try {
  const { renderPage } = await server.ssrLoadModule('/src/entry-server.tsx');
  const { PUBLIC_PATHS, SITE_URL, getPageSeo, renderSeoHead, escapeHtml } = await server.ssrLoadModule('/src/data/seo.ts');
  const { allCountries, countrySlugAliases } = await server.ssrLoadModule('/src/data/index.ts');
  const aliases = [...Object.keys(countrySlugAliases), ...allCountries.filter(country => country.id !== country.slug).map(country => country.id)].map(slug => `/country/${slug}`);
  const routes = [...new Set([...PUBLIC_PATHS, ...aliases, '/search', '/wanderlist', '/404'])];
  if (!template.includes('<!-- SEO:START -->') || !template.includes('<div id="root"></div>')) throw new Error('Prerender template markers are missing');
  for (const route of routes) {
    const html = template
      .replace(/<!-- SEO:START -->[\s\S]*?<!-- SEO:END -->/, () => `<!-- SEO:START -->\n    ${renderSeoHead(getPageSeo(route))}\n    <!-- SEO:END -->`)
      .replace('<div id="root"></div>', () => `<div id="root">${renderPage(route)}</div>`)
      .replace('</head>', '<noscript><style>#root [style*="opacity:0"]{opacity:1!important;transform:none!important}</style></noscript>\n  </head>');
    const filename = route === '/404' ? path.join(dist, '404.html') : path.join(dist, route.slice(1), 'index.html');
    await mkdir(path.dirname(filename), { recursive: true });
    await writeFile(filename, html);
  }
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PUBLIC_PATHS.map(route => `  <url><loc>${escapeHtml(new URL(route, SITE_URL).href)}</loc></url>`).join('\n')}\n</urlset>\n`;
  await writeFile(path.join(dist, 'sitemap.xml'), sitemap);
  await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
  console.log(`Prerendered ${routes.length} routes; sitemap includes ${PUBLIC_PATHS.length} canonical pages at ${SITE_URL}.`);
} finally {
  await server.close();
}
