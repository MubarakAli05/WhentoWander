import { useState } from 'react';

interface Props {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
}

export function SmartImage({ src, alt, className = '', loading = 'lazy' }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-stone-800 animate-pulse" />
      )}
      {error ? (
        <div className="absolute inset-0 bg-stone-800 flex items-center justify-center">
          <span className="text-stone-500 text-sm">Image unavailable</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={loading}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}
