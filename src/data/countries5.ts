import type { Country, MonthNumber, SeasonalMonth } from './types';

interface CountrySeed {
  id: string;
  name: string;
  flag: string;
  region: string;
  capital: string;
  currency: string;
  language: string;
  image: string;
  description: string;
  season: string;
  famousFor: string[];
  interests: string[];
  bestTime: string;
  bestMonths: MonthNumber[];
  avoid: string;
  highlight: string;
}

const images = {
  city: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=1920',
  mountain: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1920',
  coast: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1920',
  nature: 'https://images.pexels.com/photos/145939/pexels-photo-145939.jpeg?auto=compress&cs=tinysrgb&w=1920',
  desert: 'https://images.pexels.com/photos/1001435/pexels-photo-1001435.jpeg?auto=compress&cs=tinysrgb&w=1920',
  tropical: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=1920',
  ancient: 'https://images.pexels.com/photos/161853/greece-landscape-santorini-island-oia-161853.jpeg?auto=compress&cs=tinysrgb&w=1920',
};

const wiki = (filename: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=1920`;

const countryImages: Record<string, string> = {
  germany: wiki('Brandenburg Gate Berlin.jpg'),
  austria: wiki('Vienna Austria skyline.jpg'),
  croatia: wiki('Dubrovnik Croatia old town.jpg'),
  sweden: wiki('Stockholm Sweden waterfront.jpg'),
  ireland: wiki('Cliffs of Moher Ireland.jpg'),
  'czech-republic': wiki('Prague Czech Republic Charles Bridge.jpg'),
  hungary: wiki('Budapest Hungary Parliament.jpg'),
  poland: wiki('Krakow Poland Main Square.jpg'),
  denmark: wiki('Nyhavn Copenhagen Denmark.jpg'),
  china: wiki('Great Wall of China.jpg'),
  'south-korea': wiki('Seoul South Korea skyline.jpg'),
  nepal: wiki('Mount Everest Nepal.jpg'),
  'sri-lanka': wiki('Sigiriya Sri Lanka.jpg'),
  cambodia: wiki('Angkor Wat Cambodia.jpg'),
  malaysia: wiki('Petronas Towers Kuala Lumpur.jpg'),
  singapore: wiki('Gardens by the Bay Singapore.jpg'),
  philippines: wiki('El Nido Palawan Philippines.jpg'),
  myanmar: wiki('Bagan Myanmar temples.jpg'),
  bhutan: wiki('Tiger Nest Bhutan.jpg'),
  mongolia: wiki('Gobi Desert Mongolia.jpg'),
  vietnam: wiki('Ha Long Bay Vietnam.jpg'),
  tanzania: wiki('Serengeti Tanzania.jpg'),
  ethiopia: wiki('Lalibela Ethiopia.jpg'),
  botswana: wiki('Okavango Delta Botswana.jpg'),
  rwanda: wiki('Mountain gorilla Rwanda.jpg'),
  namibia: wiki('Sossusvlei Namibia.jpg'),
  senegal: wiki('Goree Island Senegal.jpg'),
  mexico: wiki('Chichen Itza Mexico.jpg'),
  brazil: wiki('Rio de Janeiro Brazil.jpg'),
  argentina: wiki('Perito Moreno Glacier Argentina.jpg'),
  colombia: wiki('Cartagena Colombia.jpg'),
  chile: wiki('Torres del Paine Chile.jpg'),
  cuba: wiki('Havana Cuba street.jpg'),
  'costa-rica': wiki('Arenal Volcano Costa Rica.jpg'),
  ecuador: wiki('Galapagos Islands Ecuador.jpg'),
  oman: wiki('Wahiba Sands Oman.jpg'),
  israel: wiki('Jerusalem Old City Israel.jpg'),
  'saudi-arabia': wiki('AlUla Saudi Arabia.jpg'),
  fiji: wiki('Fiji islands.jpg'),
  'papua-new-guinea': wiki('Mount Hagen Papua New Guinea.jpg'),
};

const standardMonths = (best: MonthNumber[]): SeasonalMonth[] =>
  Array.from({ length: 12 }, (_, index) => {
    const month = (index + 1) as MonthNumber;
    return {
      month,
      rating: best.includes(month) ? 'best' : 'good',
      label: best.includes(month) ? 'Recommended season' : 'Shoulder season',
      note: best.includes(month) ? 'A strong window for the country’s signature experiences' : 'Conditions vary by region',
    };
  });

const country = (seed: CountrySeed): Country => {
  const destinationId = `${seed.id}-highlights`;
  const destination = {
    id: destinationId,
    name: seed.famousFor[0] ?? seed.name,
    slug: destinationId,
    countryId: seed.id,
    region: seed.region,
    heroImage: countryImages[seed.id] ?? seed.image,
    gallery: [{ url: countryImages[seed.id] ?? seed.image, alt: `${seed.name} travel landscape`, caption: seed.name }],
    description: seed.description,
    subtitle: seed.season,
    bestMonths: seed.bestMonths,
    bestSeasonLabel: seed.bestTime,
    whyVisit: `Explore ${seed.name} through ${seed.famousFor.slice(0, 3).join(', ')}.`,
    whyMoment: seed.highlight,
    topExperiences: seed.famousFor.slice(0, 5),
    activities: seed.interests,
    duration: '7–12 days',
    travelStyles: seed.interests,
    experiences: [{
      title: seed.famousFor[0] ?? seed.name,
      description: seed.highlight,
      bestMonths: seed.bestMonths,
      image: countryImages[seed.id] ?? seed.image,
    }],
    weather: [
      { season: 'Spring', months: 'March–May', tempRange: 'Mild', rainfall: 'Variable', sunlight: 'Lengthening', notes: seed.bestTime },
      { season: 'Summer', months: 'June–August', tempRange: 'Warm to hot', rainfall: 'Variable', sunlight: 'Long days', notes: seed.avoid },
      { season: 'Autumn', months: 'September–November', tempRange: 'Mild', rainfall: 'Variable', sunlight: 'Golden', notes: seed.bestTime },
      { season: 'Winter', months: 'December–February', tempRange: 'Regional', rainfall: 'Variable', sunlight: 'Shorter days', notes: 'Check the specific region before travelling' },
    ],
    seasonalMonths: standardMonths(seed.bestMonths),
    festivals: [{ name: `${seed.name} seasonal highlights`, period: seed.bestTime, location: seed.name, description: seed.highlight }],
  };

  return {
    id: seed.id,
    name: seed.name,
    slug: seed.id,
    flag: seed.flag,
    continent: seed.region,
    capital: seed.capital,
    currency: seed.currency,
    language: seed.language,
    heroImage: countryImages[seed.id] ?? seed.image,
    description: seed.description,
    poetLine: seed.highlight,
    bestMonths: seed.bestMonths,
    bestMonthsLabel: seed.bestTime,
    recommendedDuration: '7–12 days',
    travelStyles: seed.interests,
    cultureHighlights: seed.famousFor,
    foods: [{ name: `${seed.name} local cuisine`, description: `Regional dishes and food traditions are part of the journey through ${seed.name}.` }],
    festivals: [{ name: `${seed.name} seasonal highlights`, period: seed.bestTime, location: seed.name, description: seed.highlight }],
    weather: destination.weather,
    tripDurations: [{ type: 'Classic trip', days: '7–12 days', description: `A balanced first journey through ${seed.name}.` }],
    seasonalMonths: destination.seasonalMonths,
    destinations: [destination],
    season: seed.season,
    famousFor: seed.famousFor,
    interests: seed.interests,
    avoid: seed.avoid,
    specialHighlight: seed.highlight,
  };
};

const seeds: CountrySeed[] = [
  { id: 'germany', name: 'Germany', flag: '🇩🇪', region: 'Europe', capital: 'Berlin', currency: 'Euro (€)', language: 'German', image: images.city, description: 'Layered history, lively cities, forested landscapes, and celebrated Christmas markets.', season: 'Spring / Autumn', famousFor: ['Berlin', 'Bavarian Alps', 'Rhine Valley', 'Neuschwanstein Castle', 'Christmas markets'], interests: ['History', 'Architecture', 'Nature', 'Food', 'Markets'], bestTime: 'May–June & September–October for mild weather and cultural travel.', bestMonths: [5, 6, 9, 10], avoid: 'July–August in the busiest cities and Alpine resorts.', highlight: 'Christmas markets brighten towns from late November through December.' },
  { id: 'austria', name: 'Austria', flag: '🇦🇹', region: 'Europe', capital: 'Vienna', currency: 'Euro (€)', language: 'German', image: images.mountain, description: 'Imperial cities, lakes, and Alpine villages shaped by music and mountain life.', season: 'Summer / Winter', famousFor: ['Vienna', 'Salzburg', 'Austrian Alps', 'Hallstatt', 'Classical music'], interests: ['Music', 'Mountains', 'Architecture', 'Skiing', 'Culture'], bestTime: 'April–June & September–October; December–March for snow.', bestMonths: [4, 5, 6, 9, 10, 12, 1, 2], avoid: 'Peak August crowds and school-holiday ski weeks.', highlight: 'Vienna’s concert season and Alpine snow create two distinct travel moments.' },
  { id: 'croatia', name: 'Croatia', flag: '🇭🇷', region: 'Europe', capital: 'Zagreb', currency: 'Euro (€)', language: 'Croatian', image: images.coast, description: 'A limestone Adriatic coast of islands, walled towns, and clear water.', season: 'Late Spring / Early Autumn', famousFor: ['Dubrovnik', 'Split', 'Plitvice Lakes', 'Hvar', 'Adriatic islands'], interests: ['Beaches', 'History', 'Sailing', 'Nature', 'Photography'], bestTime: 'May–June & September for warm seas and fewer crowds.', bestMonths: [5, 6, 9], avoid: 'July–August on the busiest islands and old towns.', highlight: 'Plitvice’s waterfalls and the Adriatic coast feel especially vivid in shoulder season.' },
  { id: 'sweden', name: 'Sweden', flag: '🇸🇪', region: 'Europe', capital: 'Stockholm', currency: 'Swedish Krona (SEK)', language: 'Swedish', image: images.nature, description: 'Archipelagos, design-led cities, forests, and long northern summer light.', season: 'Summer / Winter', famousFor: ['Stockholm archipelago', 'Gothenburg', 'Lapland', 'Abisko', 'Midsummer'], interests: ['Design', 'Nature', 'Aurora', 'Hiking', 'Culture'], bestTime: 'June–August for long days; September–March for aurora in the north.', bestMonths: [6, 7, 8, 9, 10, 2, 3], avoid: 'Late autumn if you want long daylight and outdoor access.', highlight: 'Midsummer celebrations gather around the longest days of the year.' },
  { id: 'ireland', name: 'Ireland', flag: '🇮🇪', region: 'Europe', capital: 'Dublin', currency: 'Euro (€)', language: 'English, Irish', image: images.coast, description: 'Atlantic cliffs, green lanes, literary cities, and music-filled villages.', season: 'Late Spring / Summer', famousFor: ['Dublin', 'Cliffs of Moher', 'Ring of Kerry', 'Wild Atlantic Way', 'Celtic heritage'], interests: ['Coast', 'Music', 'Literature', 'Hiking', 'Pubs'], bestTime: 'May–September for the longest days and coastal drives.', bestMonths: [5, 6, 7, 8, 9], avoid: 'Winter for remote coastal routes if daylight and weather stability matter.', highlight: 'St Patrick’s Day brings parades and green celebrations each March.' },
  { id: 'czech-republic', name: 'Czech Republic', flag: '🇨🇿', region: 'Europe', capital: 'Prague', currency: 'Czech Koruna (CZK)', language: 'Czech', image: images.city, description: 'Gothic streets, castle towns, beer culture, and wooded Bohemian landscapes.', season: 'Spring / Autumn', famousFor: ['Prague', 'Charles Bridge', 'Český Krumlov', 'Bohemian Switzerland', 'Castles'], interests: ['Architecture', 'History', 'Beer', 'Music', 'Photography'], bestTime: 'April–June & September–October for comfortable city walks.', bestMonths: [4, 5, 6, 9, 10], avoid: 'July–August in Prague’s most visited lanes.', highlight: 'Prague’s Christmas markets add a distinctive winter atmosphere in December.' },
  { id: 'hungary', name: 'Hungary', flag: '🇭🇺', region: 'Europe', capital: 'Budapest', currency: 'Hungarian Forint (HUF)', language: 'Hungarian', image: images.city, description: 'Thermal baths, grand boulevards, Danube views, and a strong food-and-wine culture.', season: 'Spring / Autumn', famousFor: ['Budapest', 'Danube Bend', 'Lake Balaton', 'Thermal baths', 'Tokaj wine'], interests: ['Architecture', 'Spas', 'Food', 'Wine', 'History'], bestTime: 'April–June & September–October for mild weather and festivals.', bestMonths: [4, 5, 6, 9, 10], avoid: 'Peak July–August heat if city sightseeing is the priority.', highlight: 'The Sziget Festival brings music and international energy to Budapest each summer.' },
  { id: 'poland', name: 'Poland', flag: '🇵🇱', region: 'Europe', capital: 'Warsaw', currency: 'Polish Złoty (PLN)', language: 'Polish', image: images.city, description: 'Historic old towns, Baltic shores, forests, and the high Tatras.', season: 'Spring / Early Autumn', famousFor: ['Kraków', 'Warsaw', 'Gdańsk', 'Tatra Mountains', 'Wieliczka Salt Mine'], interests: ['History', 'Architecture', 'Mountains', 'Food', 'Museums'], bestTime: 'May–June & September for city and mountain travel.', bestMonths: [5, 6, 9], avoid: 'Winter mountain conditions unless snow travel is the goal.', highlight: 'Kraków’s old town and summer cultural calendar make a strong first visit.' },
  { id: 'denmark', name: 'Denmark', flag: '🇩🇰', region: 'Europe', capital: 'Copenhagen', currency: 'Danish Krone (DKK)', language: 'Danish', image: images.coast, description: 'Cycling cities, design, sandy coasts, and a relaxed Nordic food culture.', season: 'Summer / Early Autumn', famousFor: ['Copenhagen', 'Nyhavn', 'Aarhus', 'Roskilde', 'Danish design'], interests: ['Design', 'Cycling', 'Food', 'Architecture', 'Coast'], bestTime: 'May–August for long days, outdoor dining, and cycling.', bestMonths: [5, 6, 7, 8], avoid: 'Late autumn if outdoor daylight is essential.', highlight: 'Roskilde Festival is one of northern Europe’s major summer music gatherings.' },
  { id: 'china', name: 'China', flag: '🇨🇳', region: 'Asia', capital: 'Beijing', currency: 'Renminbi (CNY)', language: 'Mandarin Chinese', image: images.mountain, description: 'A vast country of imperial cities, karst landscapes, high plateaus, and regional cuisines.', season: 'Spring / Autumn', famousFor: ['Great Wall', 'Beijing', 'Xi’an Terracotta Army', 'Zhangjiajie', 'Yangtze River'], interests: ['History', 'Food', 'Mountains', 'Architecture', 'Photography'], bestTime: 'April–May & September–October, depending on region.', bestMonths: [4, 5, 9, 10], avoid: 'Major national holiday weeks when famous sights are exceptionally busy.', highlight: 'The Harbin Ice and Snow Festival turns winter into a monumental illuminated sculpture park.' },
  { id: 'south-korea', name: 'South Korea', flag: '🇰🇷', region: 'Asia', capital: 'Seoul', currency: 'South Korean Won (KRW)', language: 'Korean', image: images.city, description: 'Fast-moving cities, mountain parks, temple stays, and a globally influential food and arts scene.', season: 'Spring / Autumn', famousFor: ['Seoul', 'Jeju Island', 'Gyeongbokgung Palace', 'Busan', 'DMZ landscapes'], interests: ['Food', 'Pop culture', 'Temples', 'Design', 'Hiking'], bestTime: 'April–May & September–October for blossoms, foliage, and clear days.', bestMonths: [4, 5, 9, 10], avoid: 'Monsoon humidity in July–August if hiking is central to the trip.', highlight: 'Cherry blossoms and autumn maples give Seoul and the mountain parks two vivid seasonal identities.' },
  { id: 'nepal', name: 'Nepal', flag: '🇳🇵', region: 'Asia', capital: 'Kathmandu', currency: 'Nepalese Rupee (NPR)', language: 'Nepali', image: images.mountain, description: 'Himalayan trails, sacred valleys, and mountain cultures at the roof of the world.', season: 'Spring / Autumn', famousFor: ['Everest region', 'Kathmandu Valley', 'Pokhara', 'Annapurna', 'Chitwan'], interests: ['Trekking', 'Mountains', 'Spirituality', 'Wildlife', 'Photography'], bestTime: 'March–May & October–November for clearer trekking conditions.', bestMonths: [3, 4, 5, 10, 11], avoid: 'Peak monsoon months for high mountain trails.', highlight: 'Rhododendron blooms color Himalayan foothills during the spring trekking season.' },
  { id: 'sri-lanka', name: 'Sri Lanka', flag: '🇱🇰', region: 'Asia', capital: 'Sri Jayawardenepura Kotte', currency: 'Sri Lankan Rupee (LKR)', language: 'Sinhala, Tamil', image: images.tropical, description: 'Tea country, ancient cities, tropical beaches, and wildlife in a compact island journey.', season: 'Dry Season by Coast', famousFor: ['Sigiriya', 'Kandy', 'Ella', 'Yala National Park', 'Galle Fort'], interests: ['Wildlife', 'Beaches', 'Tea', 'History', 'Food'], bestTime: 'December–March for the west and south; May–September for the east and north.', bestMonths: [1, 2, 3, 6, 7, 8, 9], avoid: 'Treat monsoon timing regionally rather than avoiding the whole island.', highlight: 'The Esala Perahera in Kandy is a major cultural procession, usually held in July or August.' },
  { id: 'cambodia', name: 'Cambodia', flag: '🇰🇭', region: 'Asia', capital: 'Phnom Penh', currency: 'Cambodian Riel (KHR)', language: 'Khmer', image: images.ancient, description: 'Temple cities, Mekong landscapes, and warm river culture shaped by a deep history.', season: 'Dry Season', famousFor: ['Angkor Wat', 'Siem Reap', 'Phnom Penh', 'Tonlé Sap', 'Koh Rong'], interests: ['Ancient history', 'Temples', 'Beaches', 'Food', 'Photography'], bestTime: 'November–February for cooler, drier temple exploration.', bestMonths: [11, 12, 1, 2], avoid: 'April heat if long temple walks are your priority.', highlight: 'Angkor Wat’s sunrise silhouettes are most comfortable to explore during the cooler dry season.' },
  { id: 'malaysia', name: 'Malaysia', flag: '🇲🇾', region: 'Asia', capital: 'Kuala Lumpur', currency: 'Malaysian Ringgit (MYR)', language: 'Malay', image: images.tropical, description: 'Rainforest, islands, multicultural cities, and one of Southeast Asia’s great food cultures.', season: 'Regional Dry Seasons', famousFor: ['Kuala Lumpur', 'Borneo rainforest', 'Langkawi', 'Penang', 'Cameron Highlands'], interests: ['Food', 'Rainforest', 'Islands', 'Architecture', 'Wildlife'], bestTime: 'December–February for the west coast; June–August for many east-coast and Borneo routes.', bestMonths: [1, 2, 6, 7, 8], avoid: 'Choose coast carefully during the northeast monsoon.', highlight: 'Thaipusam processions at Batu Caves create a vivid cultural moment near Kuala Lumpur.' },
  { id: 'singapore', name: 'Singapore', flag: '🇸🇬', region: 'Asia', capital: 'Singapore', currency: 'Singapore Dollar (SGD)', language: 'English, Malay, Mandarin, Tamil', image: images.city, description: 'A compact city-state of hawker food, tropical gardens, and striking modern architecture.', season: 'Tropical Year-Round', famousFor: ['Marina Bay', 'Gardens by the Bay', 'Sentosa', 'Chinatown', 'Hawker centres'], interests: ['Food', 'Architecture', 'Gardens', 'Shopping', 'Culture'], bestTime: 'February–April for generally comfortable city exploration.', bestMonths: [2, 3, 4, 6, 7, 8], avoid: 'Expect heat and rain year-round rather than a single completely dry season.', highlight: 'Chinese New Year and the Mid-Autumn Festival transform neighborhoods with light and food.' },
  { id: 'philippines', name: 'Philippines', flag: '🇵🇭', region: 'Asia', capital: 'Manila', currency: 'Philippine Peso (PHP)', language: 'Filipino, English', image: images.tropical, description: 'An archipelago of limestone lagoons, reefs, rice terraces, and lively island cultures.', season: 'Dry Season', famousFor: ['Palawan', 'Boracay', 'Banaue Rice Terraces', 'Cebu', 'Chocolate Hills'], interests: ['Islands', 'Diving', 'Beaches', 'Adventure', 'Food'], bestTime: 'December–May for many islands and clearer marine conditions.', bestMonths: [1, 2, 3, 4, 5], avoid: 'Typhoon exposure is highest in parts of the country during the wet season.', highlight: 'The Ati-Atihan Festival in Kalibo is a major January celebration of dance, music, and devotion.' },
  { id: 'myanmar', name: 'Myanmar', flag: '🇲🇲', region: 'Asia', capital: 'Naypyidaw', currency: 'Myanmar Kyat (MMK)', language: 'Burmese', image: images.ancient, description: 'Historic Buddhist sites, river plains, and diverse landscapes with complex living traditions.', season: 'Dry Season', famousFor: ['Bagan', 'Yangon', 'Inle Lake', 'Mandalay', 'Golden rock'], interests: ['Temples', 'History', 'Crafts', 'Rivers', 'Photography'], bestTime: 'November–February for cooler, drier conditions.', bestMonths: [11, 12, 1, 2], avoid: 'Check current travel advisories and local access conditions before planning.', highlight: 'Bagan’s temple plain is especially atmospheric in the low golden light of the dry season.' },
  { id: 'bhutan', name: 'Bhutan', flag: '🇧🇹', region: 'Asia', capital: 'Thimphu', currency: 'Bhutanese Ngultrum (BTN)', language: 'Dzongkha', image: images.mountain, description: 'High valleys, fortress-monasteries, and Himalayan traditions woven into daily life.', season: 'Spring / Autumn', famousFor: ['Tiger’s Nest', 'Punakha Dzong', 'Thimphu', 'Himalayan valleys', 'Buddhist festivals'], interests: ['Mountains', 'Spirituality', 'Architecture', 'Trekking', 'Culture'], bestTime: 'March–May & September–November for clear mountain views and mild trekking.', bestMonths: [3, 4, 5, 9, 10, 11], avoid: 'Winter high passes can be cold and summer monsoon clouds reduce views.', highlight: 'Tshechu festivals bring masked dances and community gatherings to dzong courtyards.' },
  { id: 'mongolia', name: 'Mongolia', flag: '🇲🇳', region: 'Asia', capital: 'Ulaanbaatar', currency: 'Mongolian Tögrög (MNT)', language: 'Mongolian', image: images.desert, description: 'Open steppe, desert horizons, nomadic hospitality, and vast skies far from city noise.', season: 'Summer', famousFor: ['Gobi Desert', 'Ulaanbaatar', 'Orkhon Valley', 'Naadam Festival', 'Ger camps'], interests: ['Adventure', 'Desert', 'Nomadic culture', 'Photography', 'Horse riding'], bestTime: 'June–August for accessible roads, warmer nights, and the Naadam Festival.', bestMonths: [6, 7, 8], avoid: 'Winter travel requires preparation for severe cold and limited transport.', highlight: 'Naadam’s wrestling, horse racing, and archery are held each July.' },
  { id: 'vietnam', name: 'Vietnam', flag: '🇻🇳', region: 'Asia', capital: 'Hanoi', currency: 'Vietnamese Đồng (VND)', language: 'Vietnamese', image: images.tropical, description: 'Rice terraces, limestone bays, historic cities, and a food culture built around freshness.', season: 'Regional Dry Seasons', famousFor: ['Hanoi', 'Ha Long Bay', 'Hoi An', 'Mekong Delta', 'Sapa'], interests: ['Food', 'History', 'Beaches', 'Mountains', 'Photography'], bestTime: 'February–April & October–December, depending on region.', bestMonths: [2, 3, 4, 10, 11, 12], avoid: 'Central and southern weather differs sharply during monsoon months.', highlight: 'Hội An’s lantern evenings are especially evocative around the monthly full moon.' },
  { id: 'tanzania', name: 'Tanzania', flag: '🇹🇿', region: 'Africa', capital: 'Dodoma', currency: 'Tanzanian Shilling (TZS)', language: 'Swahili, English', image: images.nature, description: 'Serengeti plains, Kilimanjaro, Zanzibar beaches, and some of Africa’s richest wildlife journeys.', season: 'Dry Season', famousFor: ['Serengeti', 'Mount Kilimanjaro', 'Ngorongoro Crater', 'Zanzibar', 'Tarangire'], interests: ['Safari', 'Wildlife', 'Mountains', 'Beaches', 'Photography'], bestTime: 'June–October for generally dry safari conditions; January–February for calving in the south.', bestMonths: [1, 2, 6, 7, 8, 9, 10], avoid: 'Long rains can make some safari roads difficult in March–May.', highlight: 'The wildebeest migration moves through the Serengeti across changing seasonal windows.' },
  { id: 'ethiopia', name: 'Ethiopia', flag: '🇪🇹', region: 'Africa', capital: 'Addis Ababa', currency: 'Ethiopian Birr (ETB)', language: 'Amharic', image: images.mountain, description: 'Highland churches, ancient kingdoms, dramatic escarpments, and distinctive food traditions.', season: 'Dry Season', famousFor: ['Lalibela', 'Simien Mountains', 'Danakil Depression', 'Aksum', 'Addis Ababa'], interests: ['History', 'Mountains', 'Culture', 'Photography', 'Food'], bestTime: 'October–February for drier highland conditions; check regional access.', bestMonths: [10, 11, 12, 1, 2], avoid: 'Travel conditions vary considerably by region; check current advisories.', highlight: 'Timkat, usually in January, fills cities with colorful processions and Orthodox celebration.' },
  { id: 'botswana', name: 'Botswana', flag: '🇧🇼', region: 'Africa', capital: 'Gaborone', currency: 'Botswana Pula (BWP)', language: 'English, Setswana', image: images.nature, description: 'Water-rich Okavango channels, elephant country, and remote desert wilderness.', season: 'Dry Season', famousFor: ['Okavango Delta', 'Chobe National Park', 'Makgadikgadi Pans', 'Moremi', 'Kalahari'], interests: ['Safari', 'Wildlife', 'Photography', 'Wetlands', 'Adventure'], bestTime: 'May–October for wildlife viewing and the Okavango flood season.', bestMonths: [5, 6, 7, 8, 9, 10], avoid: 'Peak summer heat and storms can make some routes less predictable.', highlight: 'Okavango floodwaters arrive during the dry season, concentrating wildlife around channels.' },
  { id: 'rwanda', name: 'Rwanda', flag: '🇷🇼', region: 'Africa', capital: 'Kigali', currency: 'Rwandan Franc (RWF)', language: 'Kinyarwanda, English, French', image: images.nature, description: 'Volcanic highlands, misty forests, and a carefully protected mountain-gorilla habitat.', season: 'Dry Season', famousFor: ['Volcanoes National Park', 'Kigali', 'Lake Kivu', 'Nyungwe Forest', 'Gorilla trekking'], interests: ['Wildlife', 'Trekking', 'Nature', 'Culture', 'Photography'], bestTime: 'June–September & December–February for easier trekking conditions.', bestMonths: [1, 2, 6, 7, 8, 9, 12], avoid: 'Heavy rain can make forest trails muddy in March–May and October–November.', highlight: 'Gorilla trekking permits and group sizes are controlled to protect the habitat.' },
  { id: 'namibia', name: 'Namibia', flag: '🇳🇦', region: 'Africa', capital: 'Windhoek', currency: 'Namibian Dollar (NAD)', language: 'English', image: images.desert, description: 'High red dunes, stark Atlantic coast, and wildlife adapted to one of the world’s oldest deserts.', season: 'Dry Season', famousFor: ['Sossusvlei', 'Etosha National Park', 'Skeleton Coast', 'Fish River Canyon', 'Swakopmund'], interests: ['Desert', 'Wildlife', 'Road trips', 'Photography', 'Adventure'], bestTime: 'May–October for cooler, dry weather and strong wildlife viewing.', bestMonths: [5, 6, 7, 8, 9, 10], avoid: 'December–February heat can be intense in desert regions.', highlight: 'Sossusvlei’s dunes glow at sunrise and sunset, with access conditions changing after rain.' },
  { id: 'senegal', name: 'Senegal', flag: '🇸🇳', region: 'Africa', capital: 'Dakar', currency: 'West African CFA franc (XOF)', language: 'French, Wolof', image: images.coast, description: 'Atlantic surf, music-rich cities, Sahel landscapes, and historic island communities.', season: 'Dry Season', famousFor: ['Dakar', 'Gorée Island', 'Sine-Saloum Delta', 'Saint-Louis', 'Lac Rose'], interests: ['Culture', 'Music', 'Coast', 'History', 'Food'], bestTime: 'November–February for dry, cooler conditions.', bestMonths: [11, 12, 1, 2], avoid: 'The hottest months can be demanding for inland excursions.', highlight: 'The Saint-Louis Jazz Festival is a major cultural gathering, generally held in the spring.' },
  { id: 'mexico', name: 'Mexico', flag: '🇲🇽', region: 'The Americas', capital: 'Mexico City', currency: 'Mexican Peso (MXN)', language: 'Spanish', image: images.city, description: 'Ancient civilizations, highland cities, Pacific and Caribbean coasts, and regional food traditions.', season: 'Dry Season', famousFor: ['Mexico City', 'Yucatán cenotes', 'Oaxaca', 'Chichén Itzá', 'Baja California'], interests: ['Food', 'History', 'Beaches', 'Art', 'Architecture'], bestTime: 'November–April for generally drier weather across many regions.', bestMonths: [11, 12, 1, 2, 3, 4], avoid: 'Hurricane exposure and humid heat vary by coast in late summer and autumn.', highlight: 'Día de Muertos fills communities with altars, marigolds, food, and remembrance in early November.' },
  { id: 'brazil', name: 'Brazil', flag: '🇧🇷', region: 'The Americas', capital: 'Brasília', currency: 'Brazilian Real (BRL)', language: 'Portuguese', image: images.tropical, description: 'Rainforest, immense rivers, rhythmic cities, and a coastline stretching across climates.', season: 'Regional', famousFor: ['Rio de Janeiro', 'Amazon', 'Iguazú Falls', 'Salvador', 'Pantanal'], interests: ['Nature', 'Music', 'Beaches', 'Wildlife', 'Food'], bestTime: 'May–September for many central and southern routes; Amazon timing is regional.', bestMonths: [5, 6, 7, 8, 9], avoid: 'Carnival and New Year bring peak prices and crowds unless that is the reason to go.', highlight: 'Carnival dates follow the Easter calendar and transform cities with parades and street music.' },
  { id: 'argentina', name: 'Argentina', flag: '🇦🇷', region: 'The Americas', capital: 'Buenos Aires', currency: 'Argentine Peso (ARS)', language: 'Spanish', image: images.mountain, description: 'Tango, glaciers, wine country, high Andes, and landscapes running from subtropical to subpolar.', season: 'Spring / Autumn', famousFor: ['Buenos Aires', 'Patagonia', 'Iguazú Falls', 'Mendoza', 'Perito Moreno Glacier'], interests: ['Wine', 'Tango', 'Mountains', 'Wildlife', 'Food'], bestTime: 'October–November & March–April; Patagonia is strongest in its summer.', bestMonths: [3, 4, 10, 11], avoid: 'Patagonia’s winter closes or limits some trails and roads.', highlight: 'Mendoza’s Vendimia harvest festival celebrates wine culture, usually in late February or March.' },
  { id: 'colombia', name: 'Colombia', flag: '🇨🇴', region: 'The Americas', capital: 'Bogotá', currency: 'Colombian Peso (COP)', language: 'Spanish', image: images.tropical, description: 'Caribbean coast, coffee hills, colonial streets, and extraordinary biodiversity.', season: 'Regional Dry Seasons', famousFor: ['Cartagena', 'Coffee region', 'Medellín', 'Tayrona', 'Bogotá'], interests: ['Coffee', 'Beaches', 'Nature', 'Music', 'History'], bestTime: 'December–March & July–August for many routes, with regional exceptions.', bestMonths: [1, 2, 3, 7, 8, 12], avoid: 'Rainfall differs by coast and mountain; plan specific regions rather than the whole country.', highlight: 'The Medellín Flower Festival brings elaborate silletero displays each August.' },
  { id: 'chile', name: 'Chile', flag: '🇨🇱', region: 'The Americas', capital: 'Santiago', currency: 'Chilean Peso (CLP)', language: 'Spanish', image: images.mountain, description: 'A long Pacific country of Atacama skies, vineyards, volcanoes, and Patagonian ice.', season: 'Spring / Autumn', famousFor: ['Atacama Desert', 'Santiago', 'Torres del Paine', 'Easter Island', 'Chilean fjords'], interests: ['Adventure', 'Desert', 'Wine', 'Mountains', 'Stargazing'], bestTime: 'October–April for Patagonia; March–May for wine country and central Chile.', bestMonths: [3, 4, 10, 11, 12, 1, 2], avoid: 'Winter limits access in high mountain and southern regions.', highlight: 'The Atacama’s exceptionally dry skies make it one of the world’s great astronomical landscapes.' },
  { id: 'cuba', name: 'Cuba', flag: '🇨🇺', region: 'The Americas', capital: 'Havana', currency: 'Cuban Peso (CUP)', language: 'Spanish', image: images.coast, description: 'Colorful colonial streets, classic cars, music, tobacco country, and Caribbean shores.', season: 'Dry Season', famousFor: ['Havana', 'Viñales Valley', 'Trinidad', 'Varadero', 'Cuban music'], interests: ['Music', 'History', 'Beaches', 'Cars', 'Architecture'], bestTime: 'November–April for cooler, drier Caribbean weather.', bestMonths: [11, 12, 1, 2, 3, 4], avoid: 'Hurricane risk is higher from June to November.', highlight: 'Havana’s jazz, salsa, and son traditions animate clubs and neighborhood streets year-round.' },
  { id: 'costa-rica', name: 'Costa Rica', flag: '🇨🇷', region: 'The Americas', capital: 'San José', currency: 'Costa Rican Colón (CRC)', language: 'Spanish', image: images.tropical, description: 'Volcanoes, cloud forests, Pacific beaches, and a conservation culture built around biodiversity.', season: 'Dry Season', famousFor: ['Arenal', 'Monteverde', 'Manuel Antonio', 'Corcovado', 'Nicoya Peninsula'], interests: ['Wildlife', 'Rainforest', 'Beaches', 'Adventure', 'Wellness'], bestTime: 'December–April for the Pacific dry season; the Caribbean has a different rhythm.', bestMonths: [1, 2, 3, 4, 12], avoid: 'Green season brings heavier rain but lush landscapes and fewer visitors.', highlight: 'Sea turtles nest on both coasts in seasonal windows that vary by species and beach.' },
  { id: 'ecuador', name: 'Ecuador & Galápagos', flag: '🇪🇨', region: 'The Americas', capital: 'Quito', currency: 'US Dollar (USD)', language: 'Spanish', image: images.nature, description: 'Andean volcanoes, Amazon rainforest, Pacific coast, and the evolution-rich Galápagos Islands.', season: 'Regional', famousFor: ['Galápagos Islands', 'Quito', 'Cotopaxi', 'Cuenca', 'Amazon basin'], interests: ['Wildlife', 'Volcanoes', 'Adventure', 'History', 'Photography'], bestTime: 'June–September for many highland routes; Galápagos is rewarding year-round with seasonal shifts.', bestMonths: [6, 7, 8, 9, 12, 1], avoid: 'Mountain weather changes quickly; build flexibility into high-altitude plans.', highlight: 'Galápagos wildlife encounters are regulated to protect the islands’ unique ecosystems.' },
  { id: 'oman', name: 'Oman', flag: '🇴🇲', region: 'Middle East', capital: 'Muscat', currency: 'Omani Rial (OMR)', language: 'Arabic', image: images.desert, description: 'Canyons, wadis, frankincense routes, and quiet coastlines between desert and mountain.', season: 'Winter / Spring', famousFor: ['Muscat', 'Wahiba Sands', 'Wadi Shab', 'Jebel Akhdar', 'Dhofar'], interests: ['Desert', 'Road trips', 'Architecture', 'Hiking', 'Coast'], bestTime: 'October–April for cooler desert and mountain conditions.', bestMonths: [10, 11, 12, 1, 2, 3, 4], avoid: 'Summer heat is severe outside coastal air-conditioned settings.', highlight: 'The khareef monsoon turns Salalah green between roughly June and September.' },
  { id: 'israel', name: 'Israel', flag: '🇮🇱', region: 'Middle East', capital: 'Jerusalem', currency: 'Israeli New Shekel (ILS)', language: 'Hebrew, Arabic', image: images.ancient, description: 'Ancient cities, Mediterranean coast, desert landscapes, and layered sacred histories.', season: 'Spring / Autumn', famousFor: ['Jerusalem', 'Tel Aviv', 'Dead Sea', 'Galilee', 'Masada'], interests: ['History', 'Food', 'Architecture', 'Beaches', 'Desert'], bestTime: 'March–May & September–November for mild sightseeing weather.', bestMonths: [3, 4, 5, 9, 10, 11], avoid: 'Summer midday heat in desert and archaeological sites.', highlight: 'The Jerusalem Light Festival projects art across the Old City, with dates announced annually.' },
  { id: 'saudi-arabia', name: 'Saudi Arabia', flag: '🇸🇦', region: 'Middle East', capital: 'Riyadh', currency: 'Saudi Riyal (SAR)', language: 'Arabic', image: images.desert, description: 'Desert escarpments, Red Sea coast, ancient oases, and rapidly opening cultural landscapes.', season: 'Winter / Spring', famousFor: ['AlUla', 'Riyadh', 'Jeddah', 'Edge of the World', 'Red Sea'], interests: ['Desert', 'History', 'Architecture', 'Diving', 'Culture'], bestTime: 'October–March for cooler conditions across most outdoor destinations.', bestMonths: [10, 11, 12, 1, 2, 3], avoid: 'Summer heat can make desert excursions unsafe or uncomfortable.', highlight: 'Winter cultural seasons in AlUla combine archaeology, music, art, and desert landscapes.' },
  { id: 'fiji', name: 'Fiji', flag: '🇫🇯', region: 'Oceania & Pacific', capital: 'Suva', currency: 'Fijian Dollar (FJD)', language: 'English, Fijian, Hindi', image: images.tropical, description: 'Coral reefs, volcanic islands, village traditions, and a warm Pacific culture.', season: 'Dry Season', famousFor: ['Viti Levu', 'Yasawa Islands', 'Mamanuca Islands', 'Coral reefs', 'Suva'], interests: ['Beaches', 'Diving', 'Islands', 'Culture', 'Adventure'], bestTime: 'May–October for drier, cooler weather and clearer water.', bestMonths: [5, 6, 7, 8, 9, 10], avoid: 'Cyclone risk and humidity are higher in the wet season.', highlight: 'Fiji’s coral reefs and manta encounters are seasonal wildlife experiences, not guaranteed sightings.' },
  { id: 'papua-new-guinea', name: 'Papua New Guinea', flag: '🇵🇬', region: 'Oceania & Pacific', capital: 'Port Moresby', currency: 'Papua New Guinean Kina (PGK)', language: 'English, Tok Pisin, Hiri Motu', image: images.nature, description: 'Remote mountains, coral seas, rainforest biodiversity, and hundreds of living cultures.', season: 'Dry Season by Region', famousFor: ['Kokoda Track', 'New Ireland', 'Sepik River', 'Tufi', 'Mount Wilhelm'], interests: ['Adventure', 'Diving', 'Culture', 'Wildlife', 'Trekking'], bestTime: 'May–October for many trekking and diving itineraries.', bestMonths: [5, 6, 7, 8, 9, 10], avoid: 'Heavy rain can affect remote roads, trails, and boat transfers.', highlight: 'The Goroka Show, usually held in September, brings highland communities together in song and dance.' },
];

export default seeds.map(country);
