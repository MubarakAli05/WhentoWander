import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

interface Props {
  slug: string;
  variant?: 'default' | 'overlay' | 'solid';
}

export function FavoriteButton({ slug, variant = 'default' }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [animating, setAnimating] = useState(false);
  const active = isFavorite(slug);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(slug);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 400);
  };

  const baseClass = variant === 'overlay'
    ? 'p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60'
    : variant === 'solid'
    ? 'px-4 py-2 rounded-full bg-stone-900 border border-white/10 hover:border-amber-400/40 flex items-center gap-2 text-sm'
    : 'p-2 rounded-full hover:bg-white/5';

  return (
    <button
      onClick={handleClick}
      aria-label={active ? 'Remove from Wanderlist' : 'Save to Wanderlist'}
      aria-pressed={active}
      className={`${baseClass} transition-all ${animating ? 'scale-125' : 'scale-100'} ${variant === 'solid' ? (active ? 'text-amber-400' : 'text-white/70') : active ? 'text-amber-400' : 'text-white/80'}`}
    >
      <Heart className={`w-5 h-5 ${active ? 'fill-current' : ''}`} />
      {variant === 'solid' && (
        <span className={active ? 'text-amber-400' : 'text-white/70'}>
          {active ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
}
