export type MonthNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type MonthRating = 'best' | 'good' | 'fair' | 'off';

export interface MonthInfo {
  month: MonthNumber;
  shortName: string;
  fullName: string;
}

export interface SeasonalMonth {
  month: MonthNumber;
  rating: MonthRating;
  label: string;
  note?: string;
}

export interface GalleryImage {
  url: string;
  alt: string;
  caption?: string;
  photographer?: string;
  fullUrl?: string;
  sourceUrl?: string;
  license?: string;
  licenseUrl?: string;
  width?: number;
  height?: number;
}

export interface Experience {
  title: string;
  description: string;
  bestMonths: MonthNumber[];
  image: string;
}

export interface Festival {
  name: string;
  period: string;
  location: string;
  description: string;
}

export interface FoodItem {
  name: string;
  description: string;
}

export interface WeatherInfo {
  season: string;
  months: string;
  tempRange: string;
  rainfall: string;
  sunlight: string;
  notes: string;
}

export interface TripDuration {
  type: string;
  days: string;
  description: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  countryId: string;
  region: string;
  heroImage: string;
  gallery: GalleryImage[];
  description: string;
  subtitle: string;
  bestMonths: MonthNumber[];
  bestSeasonLabel: string;
  whyVisit: string;
  whyMoment: string;
  topExperiences: string[];
  activities: string[];
  duration: string;
  travelStyles: string[];
  experiences: Experience[];
  weather: WeatherInfo[];
  seasonalMonths: SeasonalMonth[];
  festivals: Festival[];
}

export interface Country {
  id: string;
  name: string;
  slug: string;
  flag: string;
  continent: string;
  capital: string;
  currency: string;
  language: string;
  heroImage: string;
  gallery?: GalleryImage[];
  description: string;
  poetLine: string;
  bestMonths: MonthNumber[];
  bestMonthsLabel: string;
  recommendedDuration: string;
  destinations: Destination[];
  seasonalMonths: SeasonalMonth[];
  festivals: Festival[];
  foods: FoodItem[];
  cultureHighlights: string[];
  travelStyles: string[];
  weather: WeatherInfo[];
  tripDurations: TripDuration[];
  season?: string;
  famousFor?: string[];
  interests?: string[];
  avoid?: string;
  specialHighlight?: string;
}

export interface ExperienceCategory {
  id: string;
  label: string;
  icon: string;
  image: string;
  description: string;
}

export const MONTHS: MonthInfo[] = [
  { month: 1, shortName: 'JAN', fullName: 'January' },
  { month: 2, shortName: 'FEB', fullName: 'February' },
  { month: 3, shortName: 'MAR', fullName: 'March' },
  { month: 4, shortName: 'APR', fullName: 'April' },
  { month: 5, shortName: 'MAY', fullName: 'May' },
  { month: 6, shortName: 'JUN', fullName: 'June' },
  { month: 7, shortName: 'JUL', fullName: 'July' },
  { month: 8, shortName: 'AUG', fullName: 'August' },
  { month: 9, shortName: 'SEP', fullName: 'September' },
  { month: 10, shortName: 'OCT', fullName: 'October' },
  { month: 11, shortName: 'NOV', fullName: 'November' },
  { month: 12, shortName: 'DEC', fullName: 'December' },
];

export const EXPERIENCE_CATEGORIES: ExperienceCategory[] = [
  { id: 'mountains', label: 'Mountains', icon: 'Mountain', image: 'https://images.pexels.com/photos/37425373/pexels-photo-37425373.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', description: 'Alpine peaks, high trails, and breathtaking elevations' },
  { id: 'beaches', label: 'Beaches', icon: 'Palmtree', image: 'https://images.pexels.com/photos/22699844/pexels-photo-22699844.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', description: 'Sun-drenched shores and turquoise waters' },
  { id: 'northern-lights', label: 'Northern Lights', icon: 'Sparkles', image: 'https://images.pexels.com/photos/31291321/pexels-photo-31291321.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', description: 'Aurora-lit skies in the polar night' },
  { id: 'blossoms', label: 'Blossoms', icon: 'Flower2', image: 'https://images.pexels.com/photos/16226231/pexels-photo-16226231.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', description: 'Cherry blossoms, tulips, and spring blooms' },
  { id: 'deserts', label: 'Deserts', icon: 'Sun', image: 'https://images.pexels.com/photos/12378901/pexels-photo-12378901.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', description: 'Vast dunes, ancient caravans, starlit nights' },
  { id: 'nature', label: 'Nature', icon: 'Trees', image: 'https://images.pexels.com/photos/38486095/pexels-photo-38486095.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', description: 'Untouched landscapes and wild beauty' },
  { id: 'ancient', label: 'Ancient Places', icon: 'Landmark', image: 'https://images.pexels.com/photos/15997882/pexels-photo-15997882.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', description: 'Ruins, temples, and civilizations past' },
  { id: 'cities', label: 'Iconic Cities', icon: 'Building2', image: 'https://images.pexels.com/photos/31258209/pexels-photo-31258209.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', description: 'World-famous skylines and urban energy' },
  { id: 'culture', label: 'Culture & Heritage', icon: 'Monument', image: 'https://images.pexels.com/photos/21391677/pexels-photo-21391677.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', description: 'Traditions, architecture, and living history' },
  { id: 'snow', label: 'Snow & Winter', icon: 'Snowflake', image: 'https://images.pexels.com/photos/30694329/pexels-photo-30694329.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', description: 'Snowscapes, skiing, and winter wonderlands' },
  { id: 'islands', label: 'Islands', icon: 'Sailboat', image: 'https://images.pexels.com/photos/3727255/pexels-photo-3727255.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', description: 'Remote shores and island escapes' },
  { id: 'adventure', label: 'Adventure', icon: 'Compass', image: 'https://images.pexels.com/photos/22944463/pexels-photo-22944463.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', description: 'Thrills, expeditions, and the road less traveled' },
];

export const TRAVEL_STYLES = [
  'Solo', 'Couples', 'Family', 'Adventure', 'Relaxation',
  'Nature', 'Culture', 'Photography', 'Luxury', 'Budget-conscious',
];

export const CONTINENTS = [
  'Europe', 'Asia', 'Africa', 'The Americas',
  'Middle East', 'Oceania & Pacific',
];
