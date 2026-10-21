export type PlaceKind = 'stay' | 'eat' | 'do' | 'area';

export interface GuidePlace {
  id: string;
  name: string;
  kind: PlaceKind;
  locality: string;
  lat?: number;
  lon?: number;
  address?: string;
  price?: string;
  tier?: 'mid-range' | 'premium';
  url?: string;
  sourceUrl: string;
}

export interface CountryResearch {
  sources: { title: string; url: string; checkedAt: string }[];
  places: GuidePlace[];
  status: 'researched' | 'partial' | 'unavailable';
  note: string;
}

export interface TravelResearch {
  generatedAt: string;
  countries: Record<string, CountryResearch>;
}

export const budgetCategories = [
  { key: 'stay', label: 'Accommodation', unit: 'room / night' },
  { key: 'food', label: 'Food & cafés', unit: 'person / day' },
  { key: 'transport', label: 'Local transportation', unit: 'person / day' },
  { key: 'attractions', label: 'Attractions & experiences', unit: 'person / day' },
  { key: 'essentials', label: 'Other essentials', unit: 'person / day' },
] as const;

export type BudgetRates = Record<(typeof budgetCategories)[number]['key'], number>;
export const initialBudgets: Record<'mid-range' | 'premium', BudgetRates> = {
  'mid-range': { stay: 100, food: 30, transport: 15, attractions: 20, essentials: 10 },
  premium: { stay: 250, food: 75, transport: 45, attractions: 50, essentials: 20 },
};

export function calculateBudget(rates: BudgetRates, days: number, people: number, rooms: number) {
  const nights = Math.max(0, days - 1);
  const lines = budgetCategories.map(({ key }) => ({
    key,
    amount: rates[key] * (key === 'stay' ? nights * rooms : days * people),
  }));
  const subtotal = lines.reduce((total, line) => total + line.amount, 0);
  return { lines, nights, subtotal, contingency: subtotal * 0.1, total: subtotal * 1.1 };
}

export function hasCoordinates(place: GuidePlace): place is GuidePlace & { lat: number; lon: number } {
  return Number.isFinite(place.lat) && Number.isFinite(place.lon)
    && Math.abs(place.lat!) <= 90 && Math.abs(place.lon!) <= 180;
}

export function safeExternalUrl(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}

export function mapSearchUrl(name: string, locality: string, country: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([name, locality, country].filter(Boolean).join(', '))}`;
}

export function filterPlaces(places: GuidePlace[], kind: 'all' | PlaceKind, locality: string, query: string) {
  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const search = normalize(query.trim());
  return places.filter(place => (kind === 'all' || place.kind === kind)
    && (!locality || place.locality === locality)
    && (!search || normalize(`${place.name} ${place.locality} ${place.address ?? ''}`).includes(search)));
}

export function planDays(places: GuidePlace[], days: number): GuidePlace[][] {
  // Keep the same locality together; this is a draft, not a computed travel route.
  const groups = new Map<string, GuidePlace[]>();
  for (const place of places) {
    const group = groups.get(place.locality) ?? [];
    group.push(place);
    groups.set(place.locality, group);
  }
  const ordered = [...groups.values()].flat();
  const dailyLimit = Math.max(1, Math.ceil(ordered.length / days));
  return Array.from({ length: days }, (_, day) => ordered.slice(day * dailyLimit, (day + 1) * dailyLimit));
}
