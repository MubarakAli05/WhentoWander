import type { ReactNode } from 'react';
import type { GalleryImage } from '@/data';
import { SmartImage } from './SmartImage';

export function PhotoAttribution({ image, className = '' }: { image: GalleryImage; className?: string }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-relaxed text-stone-400 ${className}`}>
      {image.sourceUrl ? (
        <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer" className="break-words hover:text-amber-300 underline decoration-white/20 underline-offset-2">
          Photo: {image.photographer || 'View source'}
        </a>
      ) : <span>Photo: {image.photographer || 'Location preview'}</span>}
      {image.license && (image.licenseUrl ? (
        <a href={image.licenseUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300">{image.license}</a>
      ) : <span>{image.license}</span>)}
    </p>
  );
}

interface Props {
  eyebrow: string;
  title: string;
  description: string;
  image: GalleryImage;
  imageLabel: string;
  children?: ReactNode;
}

export function DiscoveryHero({ eyebrow, title, description, image, imageLabel, children }: Props) {
  return (
    <section className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12 mb-12 md:mb-16">
      <div className="min-w-0">
        <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
          <span className="h-px w-8 bg-amber-400/60" aria-hidden="true" />{eyebrow}
        </p>
        <h1 className="max-w-2xl text-4xl sm:text-5xl xl:text-6xl font-semibold leading-[1.08] tracking-tight text-white">{title}</h1>
        <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-stone-300">{description}</p>
        {children && <div className="mt-7">{children}</div>}
      </div>
      <figure className="min-w-0">
        <div className="relative overflow-hidden rounded-2xl border border-white/10">
          <SmartImage src={image.url} alt={image.alt} loading="eager" className="aspect-[4/3] w-full" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
          <figcaption className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-sm font-medium text-white">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/70">In the frame</span>
            {imageLabel}
          </figcaption>
        </div>
        <PhotoAttribution image={image} className="mt-3" />
      </figure>
    </section>
  );
}
