import { allCountries, allDestinations, EXPERIENCE_CATEGORIES, MONTHS } from './index';
import type { Destination, GalleryImage, MonthNumber } from './types';

interface ExperienceEditorial {
  photo: string;
  imageLabel: string;
  summary: string;
  planningNote: string;
}

export const experienceEditorial: Record<string, ExperienceEditorial> = {
  mountains: { photo: 'new-zealand-2', imageLabel: 'Aoraki / Mount Cook, New Zealand', summary: 'Choose a mountain base for high trails, lake walks and wide-open views.', planningNote: 'Check trail access and altitude-specific conditions; a good month for the town may not suit the summit.' },
  beaches: { photo: 'greece-2', imageLabel: 'Navagio Beach, Zakynthos, Greece', summary: 'Find coastal stays for slow shore days, swimming and time by the water.', planningNote: 'Compare local rainfall, sea conditions and beach access before choosing your dates.' },
  'northern-lights': { photo: 'iceland-6', imageLabel: 'Hvalfjörður, Iceland · location preview, not an aurora photograph', summary: 'Explore northern destinations as a starting point for a sky-watching trip.', planningNote: 'Destination visiting months are not aurora forecasts. Confirm darkness, cloud cover and local viewing seasons separately.' },
  blossoms: { photo: 'netherlands-6', imageLabel: 'Flowers in the Netherlands', summary: 'Follow flower-filled gardens and destinations known for seasonal colour.', planningNote: 'Bloom dates shift with local weather. Check current flowering reports rather than relying on a destination’s general season.' },
  deserts: { photo: 'algeria-1', imageLabel: 'Rock towers in the Sahara, Tamanrasset, Algeria', summary: 'Compare desert landscapes, historic gateways and journeys into open country.', planningNote: 'Check daytime heat, overnight temperatures and whether your route needs a local guide.' },
  nature: { photo: 'thailand-3', imageLabel: 'Wild elephants in Khao Yai National Park, Thailand', summary: 'Make room for national parks, wildlife, forests and waterside walks.', planningNote: 'Park access and wildlife sightings vary locally. Use destination seasons as a starting point, not a sighting guarantee.' },
  ancient: { photo: 'egypt-5', imageLabel: 'The pyramids of Giza, Egypt', summary: 'Build a trip around archaeological sites, temples and traces of earlier worlds.', planningNote: 'Check site opening hours and book restricted visits ahead; plan exposed sites around local heat.' },
  cities: { photo: 'japan-4', imageLabel: 'Tokyo from the Skytree, Japan', summary: 'Find a city base for neighbourhood walks, architecture and everyday discoveries.', planningNote: 'Compare each city’s visiting months, then check holiday closures and major-event dates.' },
  culture: { photo: 'turkiye-2', imageLabel: 'Dolmabahçe Palace entrance, Türkiye', summary: 'Explore living traditions, heritage buildings and places shaped by their history.', planningNote: 'Festival dates and access to places of worship need local confirmation; observe visitor etiquette.' },
  snow: { photo: 'india-1', imageLabel: 'Baspa Valley after snowfall, Himachal Pradesh, India', summary: 'Look for mountain and northern bases for a cold-weather escape.', planningNote: 'General visiting months do not guarantee snow. Confirm snow cover, lift operation and winter road access.' },
  islands: { photo: 'greece-4', imageLabel: 'Ano Syros and Ermoupolis, Syros, Greece', summary: 'Compare island bases for harbour towns, coastal landscapes and unhurried stays.', planningNote: 'Check ferry schedules and local wet or windy seasons; island transport can change outside peak periods.' },
  adventure: { photo: 'turkiye-4', imageLabel: 'The Lycian Way, southwestern Türkiye', summary: 'Find destinations for active days, trails and a journey beyond the usual stops.', planningNote: 'Match route difficulty to your experience and confirm operator schedules and local conditions.' },
};

// Membership describes the named destination, not every place mentioned in its guide.
// Generated *-highlights entries inherit country-wide copy (e.g. Serengeti mentions
// Zanzibar's beaches), so substring or even whole-word matching is not reliable.
export const experienceDestinationTopics: Record<string, readonly string[]> = {
  mountains: ['mount-fuji', 'swiss-alps', 'fjords', 'lofoten', 'milford-sound', 'queenstown', 'chiang-mai', 'scottish-highlands', 'banff', 'machu-picchu', 'cusco', 'cape-town', 'nepal-highlights', 'bhutan-highlights'],
  beaches: ['amalfi-coast', 'sydney', 'great-barrier-reef', 'kerala', 'santorini', 'bali', 'phuket', 'dubai', 'abu-dhabi', 'barcelona', 'philippines-highlights', 'brazil-highlights', 'fiji-highlights'],
  'northern-lights': ['reykjavik-and-golden-circle', 'lofoten', 'finnish-lapland'],
  blossoms: ['kyoto', 'tokyo', 'mount-fuji', 'provence', 'bollenstreek'],
  deserts: ['sahara', 'dubai', 'petra', 'pyramids-of-giza', 'mongolia-highlights', 'namibia-highlights', 'chile-highlights', 'saudi-arabia-highlights'],
  nature: ['mount-fuji', 'swiss-alps', 'reykjavik-and-golden-circle', 'cappadocia', 'provence', 'fjords', 'lofoten', 'milford-sound', 'queenstown', 'great-barrier-reef', 'kerala', 'bali', 'chiang-mai', 'sahara', 'scottish-highlands', 'banff', 'grand-canyon', 'bollenstreek', 'finnish-lapland', 'maasai-mara', 'cape-town', 'sweden-highlights', 'nepal-highlights', 'philippines-highlights', 'mongolia-highlights', 'tanzania-highlights', 'botswana-highlights', 'rwanda-highlights', 'namibia-highlights', 'chile-highlights', 'costa-rica-highlights', 'ecuador-highlights', 'fiji-highlights', 'papua-new-guinea-highlights'],
  ancient: ['kyoto', 'cappadocia', 'istanbul', 'rome', 'provence', 'pyramids-of-giza', 'luxor', 'athens', 'petra', 'machu-picchu', 'cusco', 'china-highlights', 'sri-lanka-highlights', 'cambodia-highlights', 'myanmar-highlights', 'ethiopia-highlights', 'israel-highlights', 'saudi-arabia-highlights'],
  cities: ['kyoto', 'tokyo', 'zurich', 'reykjavik-and-golden-circle', 'istanbul', 'rome', 'venice', 'paris', 'sydney', 'jaipur', 'athens', 'bangkok', 'chiang-mai', 'dubai', 'abu-dhabi', 'marrakech', 'london', 'new-york', 'barcelona', 'bunol-valencia', 'amsterdam', 'cusco', 'lisbon', 'cape-town', 'germany-highlights', 'austria-highlights', 'croatia-highlights', 'ireland-highlights', 'czech-republic-highlights', 'hungary-highlights', 'poland-highlights', 'denmark-highlights', 'south-korea-highlights', 'malaysia-highlights', 'singapore-highlights', 'vietnam-highlights', 'senegal-highlights', 'mexico-highlights', 'brazil-highlights', 'argentina-highlights', 'colombia-highlights', 'cuba-highlights', 'oman-highlights', 'israel-highlights'],
  culture: ['kyoto', 'tokyo', 'zurich', 'cappadocia', 'istanbul', 'rome', 'venice', 'paris', 'provence', 'pyramids-of-giza', 'luxor', 'taj-mahal', 'kerala', 'jaipur', 'athens', 'bali', 'bangkok', 'chiang-mai', 'abu-dhabi', 'petra', 'marrakech', 'london', 'new-york', 'barcelona', 'andalusia', 'bunol-valencia', 'amsterdam', 'machu-picchu', 'cusco', 'lisbon', 'cape-town', 'germany-highlights', 'austria-highlights', 'croatia-highlights', 'ireland-highlights', 'czech-republic-highlights', 'hungary-highlights', 'poland-highlights', 'denmark-highlights', 'china-highlights', 'south-korea-highlights', 'sri-lanka-highlights', 'cambodia-highlights', 'malaysia-highlights', 'singapore-highlights', 'myanmar-highlights', 'bhutan-highlights', 'vietnam-highlights', 'ethiopia-highlights', 'senegal-highlights', 'mexico-highlights', 'brazil-highlights', 'argentina-highlights', 'colombia-highlights', 'cuba-highlights', 'oman-highlights', 'israel-highlights', 'saudi-arabia-highlights'],
  snow: ['swiss-alps', 'reykjavik-and-golden-circle', 'lofoten', 'queenstown', 'banff', 'finnish-lapland'],
  islands: ['venice', 'lofoten', 'great-barrier-reef', 'santorini', 'bali', 'phuket', 'sweden-highlights', 'philippines-highlights', 'ecuador-highlights', 'fiji-highlights'],
  adventure: ['mount-fuji', 'swiss-alps', 'cappadocia', 'amalfi-coast', 'fjords', 'lofoten', 'milford-sound', 'queenstown', 'great-barrier-reef', 'bali', 'chiang-mai', 'phuket', 'dubai', 'petra', 'sahara', 'scottish-highlands', 'banff', 'grand-canyon', 'finnish-lapland', 'machu-picchu', 'maasai-mara', 'cape-town', 'nepal-highlights', 'bhutan-highlights', 'mongolia-highlights', 'tanzania-highlights', 'botswana-highlights', 'rwanda-highlights', 'namibia-highlights', 'chile-highlights', 'costa-rica-highlights', 'ecuador-highlights', 'papua-new-guinea-highlights'],
};

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

export function getExperienceImage(id: string): GalleryImage {
  const photo = experienceEditorial[id]?.photo;
  const image = allCountries.flatMap(country => country.gallery ?? []).find(item => item.url === `/images/countries/${photo}.jpg`);
  if (!image) throw new Error(`Missing curated experience image: ${id}`);
  return image;
}

export function readExperienceFilters(params: URLSearchParams): { query: string; month: MonthNumber | undefined } {
  const rawMonth = params.get('month') ?? '';
  const month = MONTHS.find(item => String(item.month) === rawMonth)?.month;
  return { query: params.get('q') ?? '', month };
}

export function updateExperienceFilter(params: URLSearchParams, key: 'q' | 'month', value: string): URLSearchParams {
  const next = new URLSearchParams(params);
  if (value) next.set(key, value); else next.delete(key);
  return next;
}

export function resetExperienceFilters(params: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams(params);
  next.delete('q');
  next.delete('month');
  return next;
}

export function getExperienceMatches(id: string, query = '', month?: MonthNumber): Destination[] {
  const category = EXPERIENCE_CATEGORIES.find(item => item.id === id);
  if (!category) return [];
  const q = normalize(query);
  const categoryMatches = normalize(`${category.label} ${category.description} ${experienceEditorial[id]?.summary ?? ''}`).includes(q);
  const topicDestinations = experienceDestinationTopics[id] ?? [];
  return allDestinations.filter(destination => {
    if (!topicDestinations.includes(destination.id)) return false;
    const country = allCountries.find(item => item.id === destination.countryId);
    const text = `${destination.name} ${country?.name ?? ''} ${destination.region} ${destination.description} ${destination.activities.join(' ')}`;
    return (categoryMatches || normalize(text).includes(q)) && (!month || destination.bestMonths.includes(month));
  });
}

export function experienceTimingExample(destinations: Destination[]): string {
  const example = destinations.find(destination => destination.bestMonths.length > 0);
  if (!example) return 'Check local seasonal guidance before choosing dates.';
  const months = MONTHS.filter(month => example.bestMonths.includes(month.month)).map(month => month.shortName).join(', ');
  return `${example.name}: ${months}. Destination visiting months; activity conditions may differ.`;
}

export function getExperienceDestinationPhoto(destination: Destination): { image: GalleryImage; label: string } {
  const country = allCountries.find(item => item.id === destination.countryId);
  const gallery = (country?.gallery ?? []).filter(image => !/woodcut|woodblock|painting|lithograph|engraving|coat of arms|flag of|map of|logo|drawing|illustration/i.test(`${image.alt} ${image.caption ?? ''}`));
  const exact = gallery.find(image => normalize(`${image.alt} ${image.caption ?? ''}`).includes(normalize(destination.name)));
  const index = [...destination.id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const image = exact ?? gallery[index % gallery.length] ?? destination.gallery[0] ?? { url: destination.heroImage, alt: destination.name };
  return { image, label: exact ? `${destination.name} · location preview` : `${country?.name ?? destination.name} · location preview, not necessarily this destination` };
}
