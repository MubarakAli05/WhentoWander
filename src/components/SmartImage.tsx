import { useState } from 'react';

interface Props {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  fallbackSources?: string[];
  fit?: 'cover' | 'contain';
  previewSrc?: string;
}

const FINAL_FALLBACK = '/images/fallback/travel-fallback.svg';

export function SmartImage({ src, fallbackSources = [], ...props }: Props) {
  const sources = [...new Set([src, ...fallbackSources, FINAL_FALLBACK].filter(Boolean))];
  return <ImageWithFallback key={sources.join('|')} {...props} sources={sources} />;
}

function ImageWithFallback({
  sources, alt, className = '', loading = 'lazy', sizes, fit = 'cover', previewSrc,
}: Omit<Props, 'src' | 'fallbackSources'> & { sources: string[] }) {
  const [loaded, setLoaded] = useState(false);
  const [sourceIndex, setSourceIndex] = useState(0);
  const exhausted = sourceIndex >= sources.length;

  return (
    <div className={`relative overflow-hidden bg-stone-900 ${className}`}>
      {!loaded && !exhausted && (
        <div className="absolute inset-0 bg-stone-800 motion-safe:animate-pulse" aria-hidden="true" />
      )}
      {previewSrc && !loaded && !exhausted && (
        <img src={previewSrc} alt="" aria-hidden="true" className={`absolute inset-0 h-full w-full ${fit === 'contain' ? 'object-contain' : 'object-cover'}`} />
      )}
      {exhausted ? (
        <div role="img" aria-label={alt} className="flex h-full min-h-32 items-center justify-center p-6 text-center text-sm text-stone-400">
          {alt} — photo unavailable
        </div>
      ) : (
        <img
          src={sources[sourceIndex]}
          alt={sourceIndex === sources.length - 1 ? `Travel illustration — ${alt}` : alt}
          loading={loading}
          decoding="async"
          sizes={sizes}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false);
            setSourceIndex(index => index + 1);
          }}
          className={`w-full h-full ${fit === 'contain' ? 'object-contain' : 'object-cover'} transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
}
