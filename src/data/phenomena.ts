import type { Country } from './types';

export interface Phenomenon {
  id: string;
  slug: string;
  name: string;
  type: 'NORTHERN_LIGHTS' | 'MIDNIGHT_SUN' | 'CHERRY_BLOSSOM' | 'AUTUMN_FOLIAGE' | 'WHALE_MIGRATION' | 'DESERT_BLOOM' | 'MONSOON' | 'SNOW_SEASON' | 'WILDFLOWER_SEASON' | 'TULIP_SEASON';
  summary: string;
  description: string;
  bestMonths: number[];
  location: string;
  whyItIsSpecial: string;
  photographyValue: string;
  image: string;
  countries: string[];
  source: string;
  sourceUrl: string;
  lastVerified: string;
}

export const PHENOMENA: Phenomenon[] = [
  {
    id: 'northern-lights',
    slug: 'northern-lights',
    name: 'Northern Lights',
    type: 'NORTHERN_LIGHTS',
    summary: 'Aurora-filled skies over dark winter landscapes.',
    description: 'A luminous sky display caused by charged particles colliding with the atmosphere, most visible in high-latitude regions under dark, clear conditions.',
    bestMonths: [9, 10, 11, 12, 1, 2],
    location: 'Northern latitudes across Iceland, Norway, Finland, and Canada',
    whyItIsSpecial: 'The dark winter sky transforms into moving curtains of green and violet, creating some of the most cinematic night-time travel moments on earth.',
    photographyValue: 'High contrast, long-exposure landscapes, and vibrant color make it a dream for photography.',
    image: 'https://images.pexels.com/photos/14635706/pexels-photo-14635706.jpeg?auto=compress&cs=tinysrgb&w=1600',
    countries: ['iceland', 'norway', 'canada', 'sweden', 'finland'],
    source: 'Official tourism and aurora research references',
    sourceUrl: 'https://www.visiticeland.com/',
    lastVerified: '2026-09-16',
  },
  {
    id: 'midnight-sun',
    slug: 'midnight-sun',
    name: 'Midnight Sun',
    type: 'MIDNIGHT_SUN',
    summary: 'The sun barely sets in the Arctic summer.',
    description: 'In high-latitude destinations, the sun circles the horizon for weeks during summer, creating an almost never-ending daylight experience.',
    bestMonths: [5, 6, 7],
    location: 'Norway, Iceland, Finland, and Arctic northern regions',
    whyItIsSpecial: 'Travelers can hike, photograph, and linger outdoors well into the evening without fully losing daylight, making summer production feel surreal.',
    photographyValue: 'Golden hour lasts for hours, creating soft panoramic scenes and endless scenic light.',
    image: 'https://images.pexels.com/photos/1690478/pexels-photo-1690478.jpeg?auto=compress&cs=tinysrgb&w=1600',
    countries: ['norway', 'iceland', 'sweden', 'canada', 'finland'],
    source: 'Nordic tourism and official park sources',
    sourceUrl: 'https://www.visitnorway.com/',
    lastVerified: '2026-09-16',
  },
  {
    id: 'cherry-blossoms',
    slug: 'cherry-blossoms',
    name: 'Cherry Blossoms',
    type: 'CHERRY_BLOSSOM',
    summary: 'Pink petals and temple gardens in spring.',
    description: 'A brief seasonal window when sakura trees bloom in radiant shades of pink and white, transforming cities and temple grounds into soft, ephemeral scenes.',
    bestMonths: [3, 4],
    location: 'Japan and other spring-bloom landscapes',
    whyItIsSpecial: 'The bloom is short, atmospheric, and deeply tied to seasonal rituals, making it one of the most photogenic times to explore a city or landscape.',
    photographyValue: 'Dense flower canopies, soft color, and temple backdrops create elegant compositions.',
    image: 'https://images.pexels.com/photos/16226231/pexels-photo-16226231.jpeg?auto=compress&cs=tinysrgb&w=1600',
    countries: ['japan', 'france'],
    source: 'Japan national tourism and seasonal travel resources',
    sourceUrl: 'https://www.japan.travel/en/',
    lastVerified: '2026-09-16',
  },
  {
    id: 'autumn-foliage',
    slug: 'autumn-foliage',
    name: 'Autumn Foliage',
    type: 'AUTUMN_FOLIAGE',
    summary: 'Maple reds, golden forests, and crisp air.',
    description: 'As cooler nights arrive, trees shift through amber, red, and gold, turning forested landscapes into a layered seasonal tapestry.',
    bestMonths: [10, 11],
    location: 'Japan, Canada, and mountain regions',
    whyItIsSpecial: 'This is the season when landscapes feel cinematic — calm lakes, temple paths, and alpine roads glow with warm color.',
    photographyValue: 'The red-to-gold palette gives a dramatic visual contrast against stone, water, and clear skies.',
    image: 'https://images.pexels.com/photos/3876417/pexels-photo-3876417.jpeg?auto=compress&cs=tinysrgb&w=1600',
    countries: ['japan', 'canada', 'new-zealand'],
    source: 'Seasonal tourism and park advisory resources',
    sourceUrl: 'https://www.canada.ca/en/parks-canada.html',
    lastVerified: '2026-09-16',
  },
  {
    id: 'whale-migration',
    slug: 'whale-migration',
    name: 'Whale Migration',
    type: 'WHALE_MIGRATION',
    summary: 'Coastal routes light up with humpbacks and orcas.',
    description: 'Many species move along coastlines to feed or breed in seasonal corridors, creating exceptional sea-life viewing opportunities.',
    bestMonths: [7, 8, 9, 10],
    location: 'Iceland, Norway, Canada, and Australia',
    whyItIsSpecial: 'Seeing a whale surface in open water is a rare, awe-filled travel moment tied to season and migration patterns.',
    photographyValue: 'Open ocean views, dramatic spray, and wildlife movement make this a powerful visual subject.',
    image: 'https://images.pexels.com/photos/16511713/pexels-photo-16511713.jpeg?auto=compress&cs=tinysrgb&w=1600',
    countries: ['iceland', 'norway', 'canada', 'australia'],
    source: 'Marine conservation and tourism sources',
    sourceUrl: 'https://www.australia.com/en',
    lastVerified: '2026-09-16',
  },
  {
    id: 'desert-bloom',
    slug: 'desert-bloom',
    name: 'Desert Bloom',
    type: 'DESERT_BLOOM',
    summary: 'Short-lived wildflowers after rare rain.',
    description: 'Dry desert regions can briefly erupt into color when rainfall triggers a burst of wildflowers and fresh green growth.',
    bestMonths: [2, 3, 4],
    location: 'Jordan, Morocco, and Egypt',
    whyItIsSpecial: 'The contrast between arid terrain and sudden blooms creates dramatic landscapes that feel almost impossible in a desert environment.',
    photographyValue: 'Color contrast, texture, and strong horizon lines make desert bloom scenes striking.',
    image: 'https://images.pexels.com/photos/12378901/pexels-photo-12378901.jpeg?auto=compress&cs=tinysrgb&w=1600',
    countries: ['jordan', 'morocco', 'egypt'],
    source: 'Desert ecology and regional tourism references',
    sourceUrl: 'https://visitjordan.com/',
    lastVerified: '2026-09-16',
  },
  {
    id: 'monsoon-landscapes',
    slug: 'monsoon-landscapes',
    name: 'Monsoon Landscapes',
    type: 'MONSOON',
    summary: 'Moist air, green hills, and dramatic cloud systems.',
    description: 'Monsoon periods bring heavy but seasonal rain that transforms dry landscapes into lush green valleys, waterfalls, and fertile plains.',
    bestMonths: [6, 7, 8],
    location: 'India, Thailand, and Indonesia',
    whyItIsSpecial: 'The air becomes rich with moisture, the mountains turn emerald, and the landscape changes dramatically in a matter of weeks.',
    photographyValue: 'Cloudbanks, waterfalls, textures, and fresh green vegetation reward patient photographers.',
    image: 'https://images.pexels.com/photos/38486095/pexels-photo-38486095.jpeg?auto=compress&cs=tinysrgb&w=1600',
    countries: ['india', 'thailand', 'indonesia'],
    source: 'Weather and tourism authority information',
    sourceUrl: 'https://www.incredibleindia.org/',
    lastVerified: '2026-09-16',
  },
  {
    id: 'snow-season',
    slug: 'snow-season',
    name: 'Snow Season',
    type: 'SNOW_SEASON',
    summary: 'Alpine scenery, winter towns, and crisp mountain air.',
    description: 'Snowfall turns valleys, villages, and mountain passes into quiet, luminous winter landscapes ideal for skiing, winter walks, and photography.',
    bestMonths: [11, 12, 1, 2],
    location: 'Switzerland, Norway, Canada, and Japan',
    whyItIsSpecial: 'Winter landscapes are dramatically quieter and more atmospheric, with snow-dusted villages and mountain vistas that feel postcard-perfect.',
    photographyValue: 'Soft winter light, snow textures, and deep contrast create elegant images.',
    image: 'https://images.pexels.com/photos/30694329/pexels-photo-30694329.jpeg?auto=compress&cs=tinysrgb&w=1600',
    countries: ['switzerland', 'norway', 'canada', 'japan'],
    source: 'Mountain tourism and ski authority sources',
    sourceUrl: 'https://www.myswitzerland.com/',
    lastVerified: '2026-09-16',
  },
  {
    id: 'tulip-season',
    slug: 'tulip-season',
    name: 'Tulip Season',
    type: 'TULIP_SEASON',
    summary: 'Bulb fields stripe the Dutch in short-lived spring colour.',
    description: 'Tulips and other spring bulbs bloom across South Holland’s Bollenstreek and in planted gardens such as Keukenhof. The window is brief, weather-dependent, and usually concentrated in April, with the park’s opening dates announced each year.',
    bestMonths: [4, 5],
    location: 'Bollenstreek and Keukenhof, the Netherlands',
    whyItIsSpecial: 'For a few weeks the working landscape itself becomes the spectacle — colour as a crop, not a decoration.',
    photographyValue: 'Graphic stripes, low horizons, and dense flower colour reward both wide and close compositions.',
    image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=1600',
    countries: ['netherlands'],
    source: 'Keukenhof and Netherlands tourism seasonal information',
    sourceUrl: 'https://keukenhof.nl/en/',
    lastVerified: '2026-09-17',
  },
];

export function getPhenomenon(slug: string) {
  return PHENOMENA.find(item => item.slug === slug);
}

export function getPhenomenaByCountry(countrySlug: string) {
  return PHENOMENA.filter(item => item.countries.includes(countrySlug));
}

export function getPhenomenaByMonth(month: number) {
  return PHENOMENA.filter(item => item.bestMonths.includes(month));
}

export function getPhenomenonCountryNames(countrySlugs: string[]) {
  return countrySlugs;
}

export function getPhenomenonCountryLabels(countrySlugs: string[], countries: Country[] = []) {
  return countrySlugs
    .map(slug => countries.find(c => c.slug === slug)?.name ?? slug)
    .filter(Boolean);
}
