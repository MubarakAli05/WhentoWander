import { allCountries, getCountriesByMonth, getDestinationsByMonth, MONTHS } from './index';
import type { GalleryImage, MonthNumber } from './types';

interface MonthFeature {
  countryId: string;
  photoIndex: number;
  theme: string;
  summary: string;
  watchFor: string;
}

export const MONTH_FEATURES: Record<MonthNumber, MonthFeature> = {
  1: { countryId: 'thailand', photoIndex: 1, theme: 'Temples & tropical days', summary: 'Start with Bangkok and northern Thailand for temple visits and outdoor exploring in the generally cooler, drier season.', watchFor: 'Thailand’s coasts have different rainfall patterns. Check the specific island rather than assuming every beach is dry.' },
  2: { countryId: 'sri-lanka', photoIndex: 4, theme: 'Highlands & coastal escapes', summary: 'Pair Sri Lanka’s hill country with its south and west coasts. February often suits this side of the island.', watchFor: 'The east coast follows a different monsoon pattern. Hill-country evenings can be cool and showers remain possible.' },
  3: { countryId: 'japan', photoIndex: 1, theme: 'Gardens & early spring', summary: 'Explore Japan’s gardens, temples and cities as spring approaches. Blossom dates depend on the region and the year.', watchFor: 'Do not book around a guaranteed bloom date. Northern Japan stays wintry longer, while southern areas warm earlier.' },
  4: { countryId: 'netherlands', photoIndex: 5, theme: 'Follow the flowers', summary: 'The Netherlands combines spring gardens, cycling routes and compact city breaks. Flower displays vary through the month.', watchFor: 'Check garden opening dates and bloom reports. Pack for wind, showers and cooler days even during spring.' },
  5: { countryId: 'portugal', photoIndex: 1, theme: 'Cities before the summer rush', summary: 'Portugal offers city walks, Atlantic viewpoints and regional food before the busiest summer weeks.', watchFor: 'The Atlantic can still feel cold. Inland, northern and island conditions differ, so check the exact route.' },
  6: { countryId: 'norway', photoIndex: 1, theme: 'Long days, open horizons', summary: 'Norway’s fjords and coastal journeys benefit from long daylight hours. Farther north, this is a season for the midnight sun.', watchFor: 'Daylight depends on latitude. High trails and mountain roads can retain snow; confirm local access before hiking.' },
  7: { countryId: 'switzerland', photoIndex: 0, theme: 'Take the scenic route', summary: 'Look to Switzerland for lakes, scenic rail journeys and mountain walks during the main summer travel season.', watchFor: 'Book popular routes early. Mountain weather changes quickly and snow can persist on higher trails.' },
  8: { countryId: 'kenya', photoIndex: 4, theme: 'Make room for the wild', summary: 'Kenya’s drier safari season can make wildlife viewing easier in several reserves. Choose the reserve around your interests.', watchFor: 'Wildlife movements and river crossings are never guaranteed. Expect demand at popular parks and use responsible operators.' },
  9: { countryId: 'greece', photoIndex: 3, theme: 'A slower kind of summer', summary: 'Explore Greek islands and historic towns as the peak summer rush starts to ease. Early and late September can feel different.', watchFor: 'Heat and crowds can linger. Ferry schedules and seasonal businesses vary by island and change later in the season.' },
  10: { countryId: 'germany', photoIndex: 0, theme: 'Colour, culture & cooler walks', summary: 'Germany pairs autumn landscapes with museums and city breaks. Keep plans flexible for a mix of bright days and rain.', watchFor: 'Foliage timing varies by altitude and weather. Shorter days matter for rural walks and outdoor sightseeing.' },
  11: { countryId: 'nepal', photoIndex: 4, theme: 'Himalayan horizons', summary: 'Nepal’s post-monsoon period often brings clearer mountain views. Combine cultural stops with a route suited to your fitness.', watchFor: 'Higher elevations are cold and conditions can change rapidly. Allow acclimatisation time and check permits and trail access.' },
  12: { countryId: 'austria', photoIndex: 0, theme: 'City lights & winter traditions', summary: 'Austria offers historic city breaks and seasonal celebrations. Plan around the actual dates of markets and performances.', watchFor: 'Market dates differ by town. Snow in cities is not guaranteed, daylight is short and holiday transport may run differently.' },
};

export function getMonthFeature(month: MonthNumber) {
  const feature = MONTH_FEATURES[month];
  const country = allCountries.find(country => country.id === feature.countryId)!;
  const image: GalleryImage = country.gallery![feature.photoIndex];
  return { ...feature, country, image, month: MONTHS[month - 1] };
}

export function normalizeDiscoveryQuery(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
}

export function filterMonthFeatures(query: string, window: string) {
  const needle = normalizeDiscoveryQuery(query);
  return MONTHS.map(month => getMonthFeature(month.month)).filter(feature => {
    const quarter = String(Math.ceil(feature.month.month / 3));
    return (!['1', '2', '3', '4'].includes(window) || quarter === window)
      && normalizeDiscoveryQuery(`${feature.month.fullName} ${feature.theme} ${feature.summary} ${feature.country.name}`).includes(needle);
  });
}

export function getMonthDiscovery(month: MonthNumber, query = '', region = '') {
  const needle = normalizeDiscoveryQuery(query);
  const countries = getCountriesByMonth(month).filter(country => (!region || country.continent === region)
    && normalizeDiscoveryQuery(`${country.name} ${country.id.replace(/-/g, ' ')} ${country.famousFor?.join(' ') || ''}`).includes(needle));
  const destinations = getDestinationsByMonth(month).filter(destination => {
    const country = allCountries.find(country => country.id === destination.countryId);
    return (!region || country?.continent === region)
      && normalizeDiscoveryQuery(`${destination.name} ${destination.subtitle} ${country?.name || ''}`).includes(needle);
  });
  return { countries, destinations };
}
