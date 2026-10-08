import countries1 from './countries';
import countries2 from './countries2';
import countries3 from './countries3';
import countries4 from './countries4';
import countries5 from './countries5';
import countriesAdditional from './countriesAdditional';
import { requestedCountries } from './countryCatalog';
import countryGalleries from './countryGalleries.json';
import fallbackPhoto from './fallbackPhoto.json';
import type { Country, Destination, GalleryImage, MonthNumber, MonthInfo, MonthRating } from './types';
import { MONTHS, EXPERIENCE_CATEGORIES } from './types';
import { PHENOMENA } from './phenomena';
import { EVENTS } from './events';
import type { Phenomenon } from './phenomena';
import type { TravelEvent } from './events';

export type {
  Country,
  Destination,
  MonthNumber,
  MonthInfo,
  MonthRating,
  ExperienceCategory,
  GalleryImage,
  Experience,
  Festival,
  FoodItem,
  WeatherInfo,
  TripDuration,
  SeasonalMonth,
} from './types';

export { MONTHS, EXPERIENCE_CATEGORIES, TRAVEL_STYLES, CONTINENTS } from './types';
export { PHENOMENA, getPhenomenon, getPhenomenaByCountry, getPhenomenaByMonth, getPhenomenonCountryLabels } from './phenomena';
export type { Phenomenon } from './phenomena';
export { EVENTS, EVENT_CATEGORIES, getEventById, getEventsByMonth, getEventsByCategory, getEventsByCountry } from './events';
export type { TravelEvent } from './events';

export interface CountryImageConfig {
  primary: string;
  secondary: string;
  fallback: string;
  // Kept for compatibility; this now uses another photo of the same country.
  regionFallback: string;
  globalFallback: string;
}

const regionAliases: Record<string, string> = {
  usa: 'The Americas',
  canada: 'The Americas',
  peru: 'The Americas',
  turkiye: 'Middle East',
  jordan: 'Middle East',
  uae: 'Middle East',
  australia: 'Oceania & Pacific',
  'new-zealand': 'Oceania & Pacific',
};

const rawCountries: Country[] = [...countries1, ...countries2, ...countries3, ...countries4, ...countries5, ...countriesAdditional];
const galleries: Record<string, GalleryImage[]> = countryGalleries;
const countryNames = new Map(requestedCountries.map(country => [country.id, country.name]));

export const allCountries: Country[] = rawCountries.map(country => {
  const gallery = galleries[country.id] ?? country.gallery ?? [];
  return {
    ...country,
    name: countryNames.get(country.id) ?? country.name,
    gallery,
    heroImage: gallery[0]?.url ?? country.heroImage,
    continent: regionAliases[country.id] ?? country.continent,
    season: country.season ?? country.bestMonthsLabel,
    famousFor: country.famousFor ?? country.cultureHighlights,
    interests: country.interests ?? country.travelStyles,
    avoid: country.avoid ?? 'Check regional conditions and current local guidance before travelling.',
    specialHighlight: country.specialHighlight ?? country.festivals[0]?.description ?? country.description,
  };
});

export function getCountryImageConfig(country: Country): CountryImageConfig {
  const secondary = country.gallery?.[1]?.url || country.heroImage;
  const fallback = country.gallery?.[2]?.url || secondary;
  return {
    primary: country.heroImage,
    secondary,
    fallback,
    regionFallback: country.gallery?.[3]?.url || fallback,
    globalFallback: fallbackPhoto.url,
  };
}

export function getCountryImageFallbacks(country: Country): string[] {
  const image = getCountryImageConfig(country);
  return [image.secondary, image.fallback, image.regionFallback, image.globalFallback];
}

export const allDestinations: Destination[] = allCountries.flatMap(c => c.destinations);

export const countrySlugAliases: Record<string, string> = {
  'united-states': 'usa',
  'united-states-of-america': 'usa',
  'united-kingdom': 'uk',
  'united-arab-emirates': 'uae',
  turkey: 'turkiye',
  czechia: 'czech-republic',
  'viet-nam': 'vietnam',
  'russian-federation': 'russia',
};

export function getCountry(slug: string): Country | undefined {
  const canonical = countrySlugAliases[slug] ?? slug;
  return allCountries.find(c => c.slug === slug || c.slug === canonical || c.id === canonical);
}

export function getDestination(slug: string): Destination | undefined {
  return allDestinations.find(d => d.slug === slug);
}

export function getDestinationsByCountry(countrySlug: string): Destination[] {
  const country = getCountry(countrySlug);
  return country?.destinations ?? [];
}

export function getDestinationsByMonth(month: MonthNumber): Destination[] {
  return allDestinations.filter(d => d.bestMonths.includes(month));
}

export function getCountriesByMonth(month: MonthNumber): Country[] {
  return allCountries.filter(c => c.bestMonths.includes(month));
}

export function getMonthInfo(month: MonthNumber): MonthInfo | undefined {
  return MONTHS.find(m => m.month === month);
}

export function getCurrentMonth(): MonthNumber {
  return new Date().getMonth() + 1 as MonthNumber;
}

export function getDestinationsByExperience(experienceId: string): Destination[] {
  const keywordMap: Record<string, string[]> = {
    'mountains': ['mountain', 'alpine', 'peak', 'hiking', 'mount fuji', 'alps', 'highland', 'banff', 'fjord', 'norwegian'],
    'beaches': ['beach', 'island', 'coast', 'sea', 'tropical', 'phuket', 'santorini', 'amalfi', 'reef'],
    'northern-lights': ['aurora', 'northern lights', 'iceland', 'lofoten', 'norway', 'arctic', 'polar'],
    'blossoms': ['blossom', 'cherry', 'sakura', 'spring', 'tulip', 'flower', 'lavender', 'bloom', 'keukenhof', 'bollenstreek'],
    'deserts': ['desert', 'sahara', 'dune', 'petra', 'cappadocia', 'wadi', 'jordan', 'morocco', 'marrakech'],
    'nature': ['nature', 'park', 'waterfall', 'lake', 'forest', 'fjord', 'alpine', 'rice terrace', 'wildlife', 'safari', 'mara'],
    'ancient': ['ancient', 'temple', 'ruin', 'pyramid', 'petra', 'luxor', 'rome', 'athens', 'parthenon', 'colosseum', 'archaeological', 'inca', 'machu', 'alhambra'],
    'cities': ['city', 'tokyo', 'paris', 'london', 'new york', 'dubai', 'istanbul', 'sydney', 'bangkok', 'zurich'],
    'culture': ['culture', 'temple', 'heritage', 'festival', 'traditional', 'history', 'mosque', 'palace', 'architecture'],
    'snow': ['snow', 'ski', 'winter', 'ice', 'glacier', 'aurora', 'lofoten', 'banff', 'iceland', 'lapland', 'kaamos'],
    'islands': ['island', 'santorini', 'bali', 'phuket', 'lofoten', 'great barrier reef', 'tropical'],
    'adventure': ['adventure', 'hiking', 'climbing', 'balloon', 'safari', 'diving', 'surfing', 'rafting', 'camel', 'migration'],
  };

  const keywords = keywordMap[experienceId] ?? [experienceId];
  return allDestinations.filter(d => {
    const text = `${d.name} ${d.description} ${d.whyVisit} ${d.activities.join(' ')} ${d.travelStyles.join(' ')}`.toLowerCase();
    return keywords.some(kw => text.includes(kw));
  });
}

export function searchAll(query: string): {
  countries: Country[];
  destinations: Destination[];
  events: TravelEvent[];
  phenomena: Phenomenon[];
} {
  const q = query.toLowerCase().trim();
  if (!q) return { countries: [], destinations: [], events: [], phenomena: [] };

  const matchedCountries = allCountries.filter(c => {
    const festivals = c.festivals.map(f => `${f.name} ${f.period} ${f.location} ${f.description}`).join(' ');
    const foods = c.foods.map(f => `${f.name} ${f.description}`).join(' ');
    const text = `${c.name} ${c.id} ${c.id.replace(/-/g, ' ')} ${c.description} ${c.poetLine} ${c.continent} ${c.capital} ${(c.famousFor ?? []).join(' ')} ${(c.interests ?? []).join(' ')} ${c.avoid ?? ''} ${c.specialHighlight ?? ''} ${c.cultureHighlights.join(' ')} ${festivals} ${foods}`.toLowerCase();
    const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return normalize(text).includes(normalize(q));
  });

  const matchedDestinations = allDestinations.filter(d => {
    const festivals = d.festivals.map(f => `${f.name} ${f.period} ${f.description}`).join(' ');
    const experiences = d.experiences.map(e => `${e.title} ${e.description}`).join(' ');
    const text = `${d.name} ${d.description} ${d.whyVisit} ${d.whyMoment} ${d.region} ${d.activities.join(' ')} ${d.topExperiences.join(' ')} ${festivals} ${experiences}`.toLowerCase();
    return text.includes(q);
  });

  const matchedEvents = EVENTS.filter(event => {
    const text = `${event.title} ${event.summary} ${event.description} ${event.location} ${event.countryName} ${event.category}`.toLowerCase();
    return text.includes(q);
  });

  const matchedPhenomena = PHENOMENA.filter(item => {
    const text = `${item.name} ${item.summary} ${item.description} ${item.location} ${item.type} ${item.whyItIsSpecial}`.toLowerCase();
    return text.includes(q);
  });

  const monthMatch = MONTHS.find(m =>
    m.fullName.toLowerCase().includes(q) || m.shortName.toLowerCase() === q
  );
  if (monthMatch) {
    const existingCountries = new Set(matchedCountries.map(country => country.id));
    getCountriesByMonth(monthMatch.month).forEach(country => {
      if (!existingCountries.has(country.id)) matchedCountries.push(country);
    });
    const monthDests = getDestinationsByMonth(monthMatch.month);
    const existing = new Set(matchedDestinations.map(d => d.id));
    monthDests.forEach(d => {
      if (!existing.has(d.id)) matchedDestinations.push(d);
    });

    const monthEvents = EVENTS.filter(event => event.month === monthMatch.month);
    const existingEvents = new Set(matchedEvents.map(e => e.id));
    monthEvents.forEach(event => {
      if (!existingEvents.has(event.id)) matchedEvents.push(event);
    });

    const monthPhenomena = PHENOMENA.filter(item => item.bestMonths.includes(monthMatch.month));
    const existingPhenomena = new Set(matchedPhenomena.map(p => p.id));
    monthPhenomena.forEach(item => {
      if (!existingPhenomena.has(item.id)) matchedPhenomena.push(item);
    });
  }

  return {
    countries: matchedCountries,
    destinations: matchedDestinations,
    events: matchedEvents,
    phenomena: matchedPhenomena,
  };
}

export function getRelatedDestinations(destination: Destination, limit: number = 3): Destination[] {
  return allDestinations
    .filter(d => d.id !== destination.id && d.countryId === destination.countryId)
    .slice(0, limit);
}

export function getExperienceCategories() {
  return EXPERIENCE_CATEGORIES;
}

export function getRatingColor(rating: MonthRating): string {
  switch (rating) {
    case 'best': return 'bg-emerald-500';
    case 'good': return 'bg-amber-400';
    case 'fair': return 'bg-stone-400';
    case 'off': return 'bg-stone-600';
    default: return 'bg-stone-300';
  }
}

export function getRatingLabel(rating: MonthRating): string {
  switch (rating) {
    case 'best': return 'Best';
    case 'good': return 'Good';
    case 'fair': return 'Fair';
    case 'off': return 'Off season';
    default: return '';
  }
}
