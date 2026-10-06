const STORAGE_KEY = 'wanderlist-favorites';
const CHANGE_EVENT = 'wanderlist-favorites-change';
const EMPTY: string[] = [];
let cachedRaw: string | null | undefined;
let cachedFavorites: string[] = EMPTY;

export function getFavoritesSnapshot(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      try {
        const value: unknown = raw ? JSON.parse(raw) : [];
        cachedFavorites = Array.isArray(value)
          ? [...new Set(value.filter((item): item is string => typeof item === 'string' && item.length > 0))]
          : EMPTY;
      } catch {
        cachedFavorites = EMPTY;
      }
    }
  } catch {
    // Keep this session's favorites when browser storage is unavailable.
  }
  return cachedFavorites;
}

export function getServerFavoritesSnapshot() {
  return EMPTY;
}

export function subscribeFavorites(notify: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) notify();
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener(CHANGE_EVENT, notify);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(CHANGE_EVENT, notify);
  };
}

export function toggleFavorite(destinationSlug: string) {
  const previous = getFavoritesSnapshot();
  const next = previous.includes(destinationSlug)
    ? previous.filter(slug => slug !== destinationSlug)
    : [...previous, destinationSlug];
  const raw = JSON.stringify(next);
  try {
    window.localStorage.setItem(STORAGE_KEY, raw);
    cachedRaw = raw;
  } catch {
    // Leave the last readable storage value cached so the in-memory edit survives.
  }
  cachedFavorites = next;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
