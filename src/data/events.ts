export interface TravelEvent {
  id: string;
  title: string;
  countrySlug: string;
  countryName: string;
  location: string;
  month: number;
  category: 'Flower' | 'Food' | 'Culture' | 'Music' | 'Snow' | 'Light' | 'Fireworks' | 'Nature' | 'Wildlife' | 'Traditional' | 'Unique';
  summary: string;
  description: string;
  dateType: 'variable' | 'approximate';
  image: string;
  source: string;
  sourceUrl: string;
  lastVerified: string;
}

export const EVENT_CATEGORIES = ['All', 'Flower', 'Food', 'Culture', 'Music', 'Snow', 'Light', 'Fireworks', 'Nature', 'Wildlife', 'Traditional', 'Unique'] as const;

export const EVENTS: TravelEvent[] = [
  {
    id: 'japan-cherry-blossom-festival',
    title: 'Cherry Blossom Season',
    countrySlug: 'japan',
    countryName: 'Japan',
    location: 'Kyoto, Tokyo, Osaka',
    month: 4,
    category: 'Flower',
    summary: 'Sakura season fills parks and temple paths with soft pink bloom.',
    description: 'Hanami season is one of Japan’s most beloved spring experiences, when blossoms create a short-lived wave of color across the country.',
    dateType: 'variable',
    image: 'https://images.pexels.com/photos/16226231/pexels-photo-16226231.jpeg?auto=compress&cs=tinysrgb&w=1600',
    source: 'Japan tourism seasonal calendars',
    sourceUrl: 'https://www.japan.travel/en/',
    lastVerified: '2026-09-16',
  },
  {
    id: 'iceland-northern-lights',
    title: 'Northern Lights Season',
    countrySlug: 'iceland',
    countryName: 'Iceland',
    location: 'South coast, Highlands, Snæfellsnes',
    month: 9,
    category: 'Light',
    summary: 'Dark skies reveal sweeping aurora displays.',
    description: 'The aurora season usually runs from late September to March, when long nights and clear skies favor some of the strongest night-sky viewing windows.',
    dateType: 'variable',
    image: 'https://images.pexels.com/photos/14635706/pexels-photo-14635706.jpeg?auto=compress&cs=tinysrgb&w=1600',
    source: 'Visit Iceland seasonal weather and skies information',
    sourceUrl: 'https://www.visiticeland.com/',
    lastVerified: '2026-09-16',
  },
  {
    id: 'france-lavender-season',
    title: 'Lavender Season',
    countrySlug: 'france',
    countryName: 'France',
    location: 'Provence',
    month: 7,
    category: 'Flower',
    summary: 'Purple fields sweep across the Provençal countryside.',
    description: 'Lavender blooms open in midsummer, filling the air with scent and appearance that define the region’s seasonal identity.',
    dateType: 'variable',
    image: 'https://images.pexels.com/photos/21391677/pexels-photo-21391677.jpeg?auto=compress&cs=tinysrgb&w=1600',
    source: 'Provence tourism resources',
    sourceUrl: 'https://www.visitprovence.com/',
    lastVerified: '2026-09-16',
  },
  {
    id: 'norway-midnight-sun',
    title: 'Midnight Sun',
    countrySlug: 'norway',
    countryName: 'Norway',
    location: 'Lofoten, Tromsø, Nordland',
    month: 6,
    category: 'Nature',
    summary: 'The summer sun lingers above the horizon.',
    description: 'In northern Norway, daylight persists almost around the clock, making hiking, harbor scenes, and coastal roads feel surreal under endless evening light.',
    dateType: 'variable',
    image: 'https://images.pexels.com/photos/1690478/pexels-photo-1690478.jpeg?auto=compress&cs=tinysrgb&w=1600',
    source: 'Visit Norway seasonal travel information',
    sourceUrl: 'https://www.visitnorway.com/',
    lastVerified: '2026-09-16',
  },
  {
    id: 'canada-autumn-colors',
    title: 'Autumn Colour Season',
    countrySlug: 'canada',
    countryName: 'Canada',
    location: 'Quebec, Banff, Ontario',
    month: 10,
    category: 'Nature',
    summary: 'Forest ridges turn red, gold, and amber.',
    description: 'The country’s northern forests glow with autumn hues, creating ideal conditions for fresh-air drives, scenic rail routes, and mountain viewpoints.',
    dateType: 'variable',
    image: 'https://images.pexels.com/photos/3876417/pexels-photo-3876417.jpeg?auto=compress&cs=tinysrgb&w=1600',
    source: 'Parks Canada seasonal guidance',
    sourceUrl: 'https://parks.canada.ca/',
    lastVerified: '2026-09-16',
  },
  {
    id: 'switzerland-snow-season',
    title: 'Snow Season',
    countrySlug: 'switzerland',
    countryName: 'Switzerland',
    location: 'Alps',
    month: 12,
    category: 'Snow',
    summary: 'The mountains turn into a crisp winter landscape.',
    description: 'December through February is the classic alpine snow period, bringing winter trails, snowy valleys, and postcard-perfect villages.',
    dateType: 'approximate',
    image: 'https://images.pexels.com/photos/30694329/pexels-photo-30694329.jpeg?auto=compress&cs=tinysrgb&w=1600',
    source: 'Swiss tourism and mountain travel resources',
    sourceUrl: 'https://www.myswitzerland.com/',
    lastVerified: '2026-09-16',
  },
  {
    id: 'jordan-desert-bloom',
    title: 'Desert Bloom',
    countrySlug: 'jordan',
    countryName: 'Jordan',
    location: 'Wadi Rum, Dana, Arabian desert',
    month: 3,
    category: 'Unique',
    summary: 'Rare rain can turn the desert into a temporary bloom of life.',
    description: 'In the right conditions, Jordan’s desert landscapes can shift from barren to vividly green at certain seasonal moments, creating a dramatic contrast.',
    dateType: 'variable',
    image: 'https://images.pexels.com/photos/12378901/pexels-photo-12378901.jpeg?auto=compress&cs=tinysrgb&w=1600',
    source: 'Jordan tourism and arid ecosystem climate resources',
    sourceUrl: 'https://visitjordan.com/',
    lastVerified: '2026-09-16',
  },
  {
    id: 'india-monsoon-landscapes',
    title: 'Monsoon Landscape Season',
    countrySlug: 'india',
    countryName: 'India',
    location: 'Western Ghats, Kerala, the Himalayas',
    month: 7,
    category: 'Nature',
    summary: 'The landscape brightens and rivers surge with monsoon energy.',
    description: 'Monsoon conditions create intense green scenery, waterfall activity, and a distinctly atmospheric visual experience across many regions.',
    dateType: 'approximate',
    image: 'https://images.pexels.com/photos/38486095/pexels-photo-38486095.jpeg?auto=compress&cs=tinysrgb&w=1600',
    source: 'Indian tourism seasonal guidance',
    sourceUrl: 'https://www.incredibleindia.org/',
    lastVerified: '2026-09-16',
  },
  {
    id: 'greece-summer-fiesta',
    title: 'Island Summer Festivals',
    countrySlug: 'greece',
    countryName: 'Greece',
    location: 'Santorini, Mykonos, Athens',
    month: 8,
    category: 'Culture',
    summary: 'Music, open-air dinners, and summer evenings in the islands.',
    description: 'The Greek summer brings lively open-air celebrations, swimming-season rhythms, and nights that extend well into warm coastal evenings.',
    dateType: 'variable',
    image: 'https://images.pexels.com/photos/2170387/pexels-photo-2170387.jpeg?auto=compress&cs=tinysrgb&w=1600',
    source: 'Greek tourism and cultural seasonal references',
    sourceUrl: 'https://www.visitgreece.gr/en',
    lastVerified: '2026-09-16',
  },
  {
    id: 'egypt-desert-sky',
    title: 'Desert Nights',
    countrySlug: 'egypt',
    countryName: 'Egypt',
    location: 'Western Desert, Sinai, Luxor',
    month: 11,
    category: 'Unique',
    summary: 'Clear skies and desert silence make for remarkable night travel.',
    description: 'Cooler desert evenings and exceptionally clear nights create some of the most striking stargazing opportunities in North Africa.',
    dateType: 'approximate',
    image: 'https://images.pexels.com/photos/2727927/pexels-photo-2727927.jpeg?auto=compress&cs=tinysrgb&w=1600',
    source: 'Egyptian tourism and desert travel resources',
    sourceUrl: 'https://www.egypt.travel/',
    lastVerified: '2026-09-16',
  },
  {
    id: 'spain-la-tomatina',
    title: 'La Tomatina',
    countrySlug: 'spain',
    countryName: 'Spain',
    location: 'Buñol, Valencia province',
    month: 8,
    category: 'Food',
    summary: 'A ticketed hour of tomatoes in a small inland town.',
    description: 'La Tomatina is held on the last Wednesday of August when the festival runs. It is a short, messy street battle — not a city sightseeing weekend. Editions were cancelled in 2020 and 2021; confirm tickets and the current year’s date before travelling.',
    dateType: 'variable',
    image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=1600',
    source: 'La Tomatina / Buñol festival information',
    sourceUrl: 'https://latomatina.info/',
    lastVerified: '2026-09-17',
  },
  {
    id: 'netherlands-keukenhof',
    title: 'Keukenhof & Tulip Season',
    countrySlug: 'netherlands',
    countryName: 'Netherlands',
    location: 'Lisse and the Bollenstreek',
    month: 4,
    category: 'Flower',
    summary: 'Spring bulbs take over the garden and the surrounding farm fields.',
    description: 'Keukenhof’s opening dates are announced annually (for example mid-March to mid-May). Field bloom outside the park depends on weather and often peaks in April. King’s Day on 27 April (or 26 April when the 27th is a Sunday) falls in the same season.',
    dateType: 'variable',
    image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=1600',
    source: 'Keukenhof official seasonal dates',
    sourceUrl: 'https://keukenhof.nl/en/',
    lastVerified: '2026-09-17',
  },
  {
    id: 'finland-aurora-season',
    title: 'Aurora Season in Lapland',
    countrySlug: 'finland',
    countryName: 'Finland',
    location: 'Finnish Lapland',
    month: 2,
    category: 'Light',
    summary: 'Dark, snow-covered nights favour northern lights.',
    description: 'Aurora viewing in Finnish Lapland is a dark-season experience, typically from September to March. February combines reliable snow with long nights. This is not a summer trip — midnight sun replaces the night sky.',
    dateType: 'approximate',
    image: 'https://images.pexels.com/photos/3250613/pexels-photo-3250613.jpeg?auto=compress&cs=tinysrgb&w=1600',
    source: 'Visit Finland seasonal guidance',
    sourceUrl: 'https://www.visitfinland.com/',
    lastVerified: '2026-09-17',
  },
];

export function getEventById(id: string) {
  return EVENTS.find(event => event.id === id);
}

export function getEventsByMonth(month: number) {
  return EVENTS.filter(event => event.month === month);
}

export function getEventsByCountry(countrySlug: string) {
  return EVENTS.filter(event => event.countrySlug === countrySlug);
}

export function getEventsByCategory(category: string) {
  return category === 'All' ? EVENTS : EVENTS.filter(event => event.category === category);
}
