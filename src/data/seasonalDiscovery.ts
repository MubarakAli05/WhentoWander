import galleries from './countryGalleries.json';
import phenomenonPhotos from './phenomenonPhotos.json';
import { EVENTS, EVENT_CATEGORIES } from './events';
import type { TravelEvent } from './events';
import { PHENOMENA } from './phenomena';
import type { Phenomenon } from './phenomena';
import { MONTHS } from './types';
import type { GalleryImage } from './types';

interface PhotoSelection {
  country: string;
  number: number;
  label: string;
}

export interface SeasonalPhoto {
  image: GalleryImage;
  label: string;
}

const eventPhotos: Record<string, PhotoSelection> = {
  'japan-cherry-blossom-festival': { country: 'japan', number: 4, label: 'Tokyo, Japan · city preview, not a blossom photograph' },
  'iceland-northern-lights': { country: 'iceland', number: 4, label: 'Snæfellsnes, Iceland · coast preview, not an aurora photograph' },
  'france-lavender-season': { country: 'france', number: 6, label: 'France · countryside preview, not Provence lavender fields' },
  'norway-midnight-sun': { country: 'norway', number: 2, label: 'Geirangerfjord, Norway · landscape preview, not the midnight sun' },
  'canada-autumn-colors': { country: 'canada', number: 3, label: 'Lake Louise, Canada · landscape preview, not peak autumn colour' },
  'switzerland-snow-season': { country: 'switzerland', number: 3, label: 'Near Elm, Switzerland · alpine preview, not current snow conditions' },
  'jordan-desert-bloom': { country: 'jordan', number: 4, label: 'Petra hills, Jordan · landscape preview, not a desert bloom' },
  'india-monsoon-landscapes': { country: 'india', number: 5, label: 'Kollam, Kerala, India · fishing-net preview at sunrise, not monsoon conditions' },
  'greece-summer-fiesta': { country: 'greece', number: 3, label: 'Odeon of Herodes Atticus, Athens · venue preview, not a festival photograph' },
  'egypt-desert-sky': { country: 'egypt', number: 1, label: 'Nile Valley near Luxor, Egypt · landscape preview, not a night-sky photograph' },
  'spain-la-tomatina': { country: 'spain', number: 3, label: 'Benidorm, Spain · country preview, not Buñol or La Tomatina' },
  'netherlands-keukenhof': { country: 'netherlands', number: 6, label: 'Netherlands · flower preview, not a verified Keukenhof photograph' },
  'finland-aurora-season': { country: 'finland', number: 2, label: 'Finland · frosty forest preview, not Lapland or an aurora photograph' },
};

const phenomenonPreviews: Record<string, PhotoSelection> = {
  'cherry-blossoms': { country: 'japan', number: 2, label: 'Ritsurin Garden, Japan · garden preview, not a cherry-blossom photograph' },
  'autumn-foliage': { country: 'canada', number: 5, label: 'Maligne Lake, Canada · landscape preview, not peak autumn colour' },
  'whale-migration': { country: 'australia', number: 1, label: 'Fitzroy Island, Australia · coastal preview, not a whale sighting' },
  'desert-bloom': { country: 'jordan', number: 5, label: 'Petra Valley, Jordan · desert preview, not a bloom photograph' },
  'monsoon-landscapes': { country: 'india', number: 4, label: 'Valley of Flowers, India · landscape preview, not current monsoon conditions' },
  'snow-season': eventPhotos['switzerland-snow-season'],
  'tulip-season': eventPhotos['netherlands-keukenhof'],
};

function resolvePhoto(selection: PhotoSelection): SeasonalPhoto {
  const image = (galleries as Record<string, GalleryImage[]>)[selection.country]
    .find(item => item.url === `/images/countries/${selection.country}-${selection.number}.jpg`);
  if (!image) throw new Error(`Missing seasonal discovery photo: ${selection.country}-${selection.number}`);
  return { image, label: selection.label };
}

export function getEventPhoto(event: TravelEvent): SeasonalPhoto {
  return resolvePhoto(eventPhotos[event.id]);
}

export function getPhenomenonPhoto(phenomenon: Phenomenon): SeasonalPhoto {
  const photo = (phenomenonPhotos as Record<string, SeasonalPhoto>)[phenomenon.id];
  return photo ?? resolvePhoto(phenomenonPreviews[phenomenon.id]);
}

const eventTiming: Record<string, string> = {
  'japan-cherry-blossom-festival': 'April is a planning marker, not a bloom date. Check the forecast for each city; flowering is brief and weather-dependent.',
  'iceland-northern-lights': 'The guide marks September; the described season continues into March. Darkness, clear skies and solar activity must coincide.',
  'france-lavender-season': 'July is a midsummer guide. Bloom and harvest vary by field and elevation; confirm locally before setting out.',
  'norway-midnight-sun': 'June is a guide to Arctic summer light. Exact dates depend on latitude; check your northern destination, not Norway as a whole.',
  'canada-autumn-colors': 'October is a guide, not a country-wide peak. Check regional foliage reports; mountain colour can arrive earlier.',
  'switzerland-snow-season': 'December is the guide’s winter starting point; the description covers December–February. Check altitude, snowfall and lift or trail openings.',
  'jordan-desert-bloom': 'March is only a possible window. Bloom depends on sufficient rain and may not happen; check recent local reports.',
  'india-monsoon-landscapes': 'July is a broad monsoon marker, not a forecast for every region. Check local rainfall, road access and park advisories.',
  'greece-summer-fiesta': 'August describes a season of celebrations, not one bookable festival. Find the specific island, venue and organiser’s programme.',
  'egypt-desert-sky': 'November is a cooler-season guide. Clear skies are not guaranteed; check cloud, moon phase and local access before arranging a night trip.',
  'spain-la-tomatina': 'Usually the last Wednesday of August when the festival runs. Confirm this year’s edition, date and ticket requirements with the organiser.',
  'netherlands-keukenhof': 'April is a guide to field bloom. Keukenhof announces opening dates annually; weather and farming schedules can change the display.',
  'finland-aurora-season': 'February is one dark-season option, not the whole season. The guide describes September–March; clear skies and aurora activity are still needed.',
};

export function getEventTiming(event: TravelEvent): string {
  return eventTiming[event.id] ?? 'Use the month as a planning guide; confirm current dates and local conditions with the source before booking.';
}

const phenomenonGuidance: Record<string, string> = {
  'northern-lights': 'Darkness, clear skies and solar activity must coincide. These are guide months, not a nightly forecast or a sighting guarantee.',
  'midnight-sun': 'Exact dates depend on latitude. Long summer evenings are not the same as 24-hour sun; check the specific Arctic location.',
  'cherry-blossoms': 'Bloom shifts by city, elevation and spring weather. Check local forecasts near departure; a country-wide peak cannot be promised.',
  'autumn-foliage': 'The listed months are a Northern Hemisphere reference. New Zealand follows a different seasonal calendar; use local foliage reports for your route.',
  'whale-migration': 'Timing varies by coast and species, not just country. Ask a responsible local operator about the relevant season; sightings are never guaranteed.',
  'desert-bloom': 'Rain triggers flowering, and some years bring little or none. Treat these months as a possibility, then confirm recent regional reports.',
  'monsoon-landscapes': 'Rainy seasons differ between regions, especially across Indonesia. These guide months are not a shared calendar; check local weather and access advisories.',
  'snow-season': 'Snow depends on altitude, recent weather and the specific mountain area. Check snow reports, trail access and operating dates before booking.',
  'tulip-season': 'April is the usual focus for field bloom; May does not guarantee flowers. Check this year’s park dates, bloom reports and field access rules.',
};

export function getPhenomenonGuidance(phenomenon: Phenomenon): string {
  return phenomenonGuidance[phenomenon.id] ?? 'Check local seasonal reports before travelling; this is a planning window, not a guarantee.';
}

export const PHENOMENON_CATEGORIES = ['All', 'Sky & light', 'Flowers & colour', 'Wildlife', 'Weather & landscapes'] as const;
export type PhenomenonCategory = typeof PHENOMENON_CATEGORIES[number];

export function getPhenomenonCategory(phenomenon: Phenomenon): PhenomenonCategory {
  if (['NORTHERN_LIGHTS', 'MIDNIGHT_SUN'].includes(phenomenon.type)) return 'Sky & light';
  if (phenomenon.type === 'WHALE_MIGRATION') return 'Wildlife';
  if (['CHERRY_BLOSSOM', 'AUTUMN_FOLIAGE', 'DESERT_BLOOM', 'WILDFLOWER_SEASON', 'TULIP_SEASON'].includes(phenomenon.type)) return 'Flowers & colour';
  return 'Weather & landscapes';
}

export interface SeasonalFilters {
  month: number | 'all';
  country: string;
  category: string;
  query: string;
}

export function readSeasonalFilters(params: URLSearchParams, kind: 'events' | 'phenomena'): SeasonalFilters {
  const month = Number(params.get('month'));
  const country = params.get('country') ?? 'all';
  const category = params.get('category') ?? 'All';
  const categories: readonly string[] = kind === 'events' ? EVENT_CATEGORIES : PHENOMENON_CATEGORIES;
  // Preserve valid country deep links even when that country has no entries.
  const knownCountries = Object.keys(galleries);
  return {
    month: MONTHS.some(item => item.month === month) ? month : 'all',
    country: knownCountries.includes(country) ? country : 'all',
    category: categories.includes(category) ? category : 'All',
    query: params.get('q') ?? '',
  };
}

export function updateSeasonalFilter(params: URLSearchParams, key: string, value: string): URLSearchParams {
  const next = new URLSearchParams(params);
  if (!value || (key !== 'q' && value.toLowerCase() === 'all')) next.delete(key);
  else next.set(key, value);
  return next;
}

export function resetSeasonalFilters(params: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams(params);
  for (const key of ['month', 'country', 'category', 'q']) next.delete(key);
  return next;
}

export function filterEvents(filters: SeasonalFilters): TravelEvent[] {
  const query = filters.query.trim().toLocaleLowerCase();
  return EVENTS.filter(event =>
    (filters.month === 'all' || event.month === filters.month) &&
    (filters.country === 'all' || event.countrySlug === filters.country) &&
    (filters.category === 'All' || event.category === filters.category) &&
    `${event.title} ${event.countryName} ${event.location} ${event.summary} ${event.category}`.toLocaleLowerCase().includes(query));
}

export function filterPhenomena(filters: SeasonalFilters): Phenomenon[] {
  const query = filters.query.trim().toLocaleLowerCase();
  return PHENOMENA.filter(phenomenon =>
    (filters.month === 'all' || phenomenon.bestMonths.includes(filters.month)) &&
    (filters.country === 'all' || phenomenon.countries.includes(filters.country)) &&
    (filters.category === 'All' || getPhenomenonCategory(phenomenon) === filters.category) &&
    `${phenomenon.name} ${phenomenon.location} ${phenomenon.summary} ${phenomenon.countries.join(' ').replace(/-/g, ' ')} ${getPhenomenonCategory(phenomenon)}`.toLocaleLowerCase().includes(query));
}

export function guideMonths(months: number[]): string {
  return months.map(month => MONTHS.find(item => item.month === month)?.fullName).filter(Boolean).join(' · ');
}
