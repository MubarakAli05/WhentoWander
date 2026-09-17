import { useEffect, useMemo, useState } from 'react';

interface Props {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  fallbackSources?: string[];
}

const FINAL_FALLBACK = '/images/fallback/travel-fallback.svg';

export function SmartImage({ src, alt, className = '', loading = 'lazy', fallbackSources = [] }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [sourceIndex, setSourceIndex] = useState(0);
  const sources = useMemo(
    () => [...new Set([src, ...fallbackSources, FINAL_FALLBACK].filter(Boolean))],
    [src, fallbackSources],
  );
  const currentSource = sources[sourceIndex] ?? FINAL_FALLBACK;

  useEffect(() => {
    setLoaded(false);
    setSourceIndex(0);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-stone-800 animate-pulse" />
      )}
      <img
        src={currentSource}
        alt={alt}
        loading={loading}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setLoaded(false);
          setSourceIndex(index => Math.min(index + 1, sources.length - 1));
        }}
        className={`w-full h-full object-cover transition-opacity duration-700 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
