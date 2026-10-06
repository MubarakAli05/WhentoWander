import { useSyncExternalStore } from 'react';
import { getFavoritesSnapshot, getServerFavoritesSnapshot, subscribeFavorites, toggleFavorite } from './favoritesStore';

export function useFavorites() {
  const favorites = useSyncExternalStore(subscribeFavorites, getFavoritesSnapshot, getServerFavoritesSnapshot);
  const isFavorite = (destinationSlug: string) => favorites.includes(destinationSlug);
  return { favorites, toggleFavorite, isFavorite };
}
