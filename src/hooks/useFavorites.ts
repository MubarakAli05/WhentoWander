import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'wanderlist-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {
      // ignore parse errors
    }
  }, []);

  const save = useCallback((items: string[]) => {
    setFavorites(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }, []);

  const toggleFavorite = useCallback((destinationSlug: string) => {
    setFavorites(prev => {
      const next = prev.includes(destinationSlug)
        ? prev.filter(s => s !== destinationSlug)
        : [...prev, destinationSlug];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback((destinationSlug: string) => {
    return favorites.includes(destinationSlug);
  }, [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
