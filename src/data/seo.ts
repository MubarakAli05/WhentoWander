import { allCountries, allDestinations, getCountry, getDestination, MONTHS, EXPERIENCE_CATEGORIES, PHENOMENA } from './index';
import site from './site.json';

export function normalizeSiteUrl(value: string): string {
  const url = new URL(value);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('The site URL must be a public HTTP(S) origin without a path, credentials, query or fragment.');
  }
  return url.origin;
}

export const SITE_URL = normalizeSiteUrl(import.meta.env.VITE_SITE_URL || site.url);
export const SITE_DESCRIPTION = site.description;
const IMAGE_PATH = '/social-preview.png';

interface PageDescription {
  title: string;
  description: string;
  path: string;
  collection?: boolean;
  noindex?: boolean;
  country?: string;
}

const pages: Record<string, Omit<PageDescription, 'path'>> = {
  '/': { title: 'When to Wander | Best Time to Visit 195 Countries', description: site.description },
  '/countries': { title: '195 Country Travel Guides & Best Times to Visit', description: 'Compare 195 country guides with recommended travel months, regional seasons, cultural highlights and credited photo galleries. Find your next destination.', collection: true },
  '/months': { title: 'Where to Travel by Month | January to December', description: 'Choose when to travel with our month-by-month calendar. Explore seasonal destinations, regional weather guidance and practical tips for all twelve months.', collection: true },
  '/experiences': { title: 'Travel Experiences | Nature, Culture, Beaches & Adventure', description: 'Find a trip that fits your interests: mountains, beaches, culture, wildlife and more. Compare destinations and recommended visiting months by experience.', collection: true },
  '/events': { title: 'Seasonal Events & Festivals Around the World', description: 'Explore festivals, flower seasons and cultural events by country and month. Find planning guidance and official sources to check dates before you travel.', collection: true },
  '/phenomena': { title: 'Natural Wonders & Seasonal Phenomena | When to Go', description: 'Discover northern lights, midnight sun, blossoms and wildlife migrations. Compare seasonal windows and locations, with practical advice for planning a visit.', collection: true },
  '/world': { title: 'World Travel Explorer | Find Your Next Destination', description: 'Explore countries around the world and discover their seasonal highlights. Compare destinations, recommended travel months and ideas for your next journey.', collection: true },
  '/about': { title: 'About When to Wander | Travel with the Seasons', description: 'When to Wander helps you choose where to go and when. Discover our approach to seasonal travel guidance, inspiring photography and thoughtful trip planning.' },
  '/search': { title: 'Search Travel Guides', description: 'Search countries, destinations, seasonal events and natural wonders on When to Wander.', noindex: true },
  '/wanderlist': { title: 'Your Wanderlist | Saved Travel Ideas', description: 'Keep your favourite destinations together in your private, device-saved travel inspiration list.', noindex: true },
};

function excerpt(text: string, limit = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= limit) return clean;
  return `${clean.slice(0, limit - 1).replace(/\s+\S*$/, '').replace(/[.,;:]$/, '')}…`;
}

export function getPageSeo(pathname: string, search = '') {
  const path = pathname.replace(/\/+$/, '') || '/';
  let page: PageDescription | undefined = pages[path] ? { ...pages[path], path } : undefined;
  const [section, slug, extra] = path.slice(1).split('/');
  if (slug && !extra) {
    if (section === 'country') {
      const country = getCountry(slug);
      if (country) page = { path: `/country/${country.slug}`, title: `${country.name} Travel Guide | Best Time to Visit`, description: excerpt(`Visit ${country.name}: ${country.bestMonthsLabel}. ${country.description}`), country: country.name };
    } else if (section === 'destination') {
      const destination = getDestination(slug);
      if (destination) page = { path: `/destination/${destination.slug}`, title: `${destination.name} | Best Time to Visit & Travel Guide`, description: excerpt(`${destination.name}: ${destination.bestSeasonLabel}. ${destination.description}`) };
    } else if (section === 'month') {
      const month = MONTHS.find(item => item.fullName.toLowerCase() === slug.toLowerCase());
      if (month) page = { path: `/month/${month.fullName.toLowerCase()}`, title: `Best Places to Visit in ${month.fullName} | Seasonal Travel`, description: `Find where to travel in ${month.fullName}. Compare countries and destinations by region, explore seasonal highlights and check practical advice before planning.`, collection: true };
    } else if (section === 'experience') {
      const experience = EXPERIENCE_CATEGORIES.find(item => item.id === slug);
      if (experience) page = { path: `/experience/${slug}`, title: `${experience.label} Travel | Destinations & Best Visiting Months`, description: excerpt(`${experience.description}. Explore ${experience.label.toLowerCase()} destinations, recommended visiting months and practical seasonal guidance for your next trip.`), collection: true };
    } else if (section === 'phenomena') {
      const phenomenon = PHENOMENA.find(item => item.slug === slug);
      if (phenomenon) page = { path: `/phenomena/${slug}`, title: `${phenomenon.name} | Where & When to Go`, description: excerpt(`${phenomenon.summary} ${phenomenon.description}`) };
    }
  }
  page ??= { path, title: 'Page Not Found', description: 'This travel guide could not be found. Explore countries, experiences and the travel calendar to find your next destination.', noindex: true };
  const filtered = [...new URLSearchParams(search).keys()].some(key => ['q', 'month', 'country', 'region', 'category', 'window'].includes(key));
  const title = path === '/' ? page.title : `${page.title} | ${site.name}`;
  const canonical = new URL(page.path, SITE_URL).href;
  const image = new URL(IMAGE_PATH, SITE_URL).href;
  const noindex = Boolean(page.noindex || filtered);
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': page.collection ? 'CollectionPage' : 'WebPage', '@id': `${canonical}#webpage`, url: canonical, name: title, description: page.description, inLanguage: 'en', isPartOf: { '@id': `${SITE_URL}/#website` }, ...(page.country ? { about: { '@type': 'TouristDestination', name: page.country } } : {}) },
      ...(path === '/' ? [
        { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: site.name, alternateName: site.alternateName, description: site.description, inLanguage: 'en', publisher: { '@id': `${SITE_URL}/#organization` } },
        { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: site.name, url: `${SITE_URL}/`, logo: `${SITE_URL}/icon-512.png` },
      ] : [{ '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: page.title, item: canonical },
      ] }]),
    ],
  };
  return { title, description: page.description, canonical, image, noindex, structuredData };
}

export const PUBLIC_PATHS = [...new Set([
  ...Object.keys(pages).filter(path => !pages[path].noindex),
  ...allCountries.map(country => `/country/${country.slug}`),
  ...allDestinations.map(destination => `/destination/${destination.slug}`),
  ...MONTHS.map(month => `/month/${month.fullName.toLowerCase()}`),
  ...EXPERIENCE_CATEGORIES.map(experience => `/experience/${experience.id}`),
  ...PHENOMENA.map(phenomenon => `/phenomena/${phenomenon.slug}`),
])];

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
}

export function renderSeoHead(seo: ReturnType<typeof getPageSeo>): string {
  const meta = (key: string, value: string, property = false) => `<meta data-seo ${property ? 'property' : 'name'}="${key}" content="${escapeHtml(value)}" />`;
  return [
    `<title data-seo>${escapeHtml(seo.title)}</title>`,
    meta('description', seo.description),
    meta('robots', seo.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'),
    `<link data-seo rel="canonical" href="${escapeHtml(seo.canonical)}" />`,
    meta('og:type', 'website', true), meta('og:site_name', site.name, true), meta('og:locale', 'en_US', true),
    meta('og:title', seo.title, true), meta('og:description', seo.description, true), meta('og:url', seo.canonical, true),
    meta('og:image', seo.image, true), meta('og:image:width', '1200', true), meta('og:image:height', '630', true), meta('og:image:alt', 'When to Wander — Find the best time to go', true),
    meta('twitter:card', 'summary_large_image'), meta('twitter:title', seo.title), meta('twitter:description', seo.description), meta('twitter:image', seo.image), meta('twitter:image:alt', 'When to Wander — Find the best time to go'),
    `<script data-seo type="application/ld+json">${JSON.stringify(seo.structuredData).replace(/</g, '\\u003c')}</script>`,
  ].join('\n    ');
}
