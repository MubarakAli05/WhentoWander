import countries1 from './countries';
import countries2 from './countries2';
import type { Country, Destination, MonthNumber, MonthInfo, MonthRating } from './types';
import { MONTHS, EXPERIENCE_CATEGORIES } from './types';

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

export const allCountries: Country[] = [...countries1, ...countries2];

export const allDestinations: Destination[] = allCountries.flatMap(c => c.destinations);

export function getCountry(slug: string): Country | undefined {
  return allCountries.find(c => c.slug === slug);
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
    'blossoms': ['blossom', 'cherry', 'sakura', 'spring', 'tulip', 'flower', 'lavender', 'bloom'],
    'deserts': ['desert', 'sahara', 'dune', 'petra', 'cappadocia', 'wadi', 'jordan', 'morocco', 'marrakech'],
    'nature': ['nature', 'park', 'waterfall', 'lake', 'forest', 'fjord', 'alpine', 'rice terrace', 'wildlife'],
    'ancient': ['ancient', 'temple', 'ruin', 'pyramid', 'petra', 'luxor', 'rome', 'athens', 'parthenon', 'colosseum', 'archaeological'],
    'cities': ['city', 'tokyo', 'paris', 'london', 'new york', 'dubai', 'istanbul', 'sydney', 'bangkok', 'zurich'],
    'culture': ['culture', 'temple', 'heritage', 'festival', 'traditional', 'history', 'mosque', 'palace', 'architecture'],
    'snow': ['snow', 'ski', 'winter', 'ice', 'glacier', 'aurora', 'lofoten', 'banff', 'iceland'],
    'islands': ['island', 'santorini', 'bali', 'phuket', 'lofoten', 'great barrier reef', 'tropical'],
    'adventure': ['adventure', 'hiking', 'climbing', 'balloon', 'safari', 'diving', 'surfing', 'rafting', 'camel'],
  };

  const keywords = keywordMap[experienceId] ?? [experienceId];
  return allDestinations.filter(d => {
    const text = `${d.name} ${d.description} ${d.whyVisit} ${d.activities.join(' ')} ${d.travelStyles.join(' ')}`.toLowerCase();
    return keywords.some(kw => text.includes(kw));
  });
}

export function searchAll(query: string): { countries: Country[]; destinations: Destination[] } {
  const q = query.toLowerCase().trim();
  if (!q) return { countries: [], destinations: [] };

  const matchedCountries = allCountries.filter(c => {
    const text = `${c.name} ${c.description} ${c.poetLine} ${c.continent} ${c.capital}`.toLowerCase();
    return text.includes(q);
  });

  const matchedDestinations = allDestinations.filter(d => {
    const text = `${d.name} ${d.description} ${d.whyVisit} ${d.region} ${d.activities.join(' ')}`.toLowerCase();
    return text.includes(q);
  });

  const monthMatch = MONTHS.find(m =>
    m.fullName.toLowerCase().includes(q) || m.shortName.toLowerCase() === q
  );
  if (monthMatch) {
    const monthDests = getDestinationsByMonth(monthMatch.month);
    const existing = new Set(matchedDestinations.map(d => d.id));
    monthDests.forEach(d => {
      if (!existing.has(d.id)) matchedDestinations.push(d);
    });
  }

  return { countries: matchedCountries, destinations: matchedDestinations };
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
