import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays } from 'lucide-react';
import type { Destination } from '@/data';
import { allCountries, MONTHS } from '@/data';
import { getExperienceDestinationPhoto } from '@/data/experienceDiscovery';
import { SmartImage } from './SmartImage';
import { PhotoAttribution } from './DiscoveryHero';
import { FavoriteButton } from './FavoriteButton';

interface Props {
  destination: Destination;
  index?: number;
}

export function ExperienceCard({ destination }: Props) {
  const country = allCountries.find(c => c.id === destination.countryId);
  const { image, label } = getExperienceDestinationPhoto(destination);
  const months = MONTHS.filter(month => destination.bestMonths.includes(month.month)).map(month => month.shortName).join(' · ');
  const href = `/destination/${destination.slug}`;

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-stone-900">
      <figure>
        <div className="relative">
          <Link to={href} aria-label={`Explore ${destination.name}`} className="group block overflow-hidden focus-visible:outline focus-visible:outline-amber-300">
            <SmartImage src={image.url} alt={image.alt} className="aspect-[16/10] w-full motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.02]" />
          </Link>
          <div className="absolute right-3 top-3"><FavoriteButton slug={destination.slug} variant="overlay" /></div>
        </div>
        <figcaption className="border-b border-white/10 px-5 py-3">
          <p className="mb-1 text-xs leading-relaxed text-stone-300">{label}</p>
          <PhotoAttribution image={image} />
        </figcaption>
      </figure>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="mb-2 text-xs uppercase tracking-[0.15em] text-amber-300">{country?.name} · {destination.region}</p>
        <h3 className="text-2xl font-semibold text-white"><Link to={href} className="hover:text-amber-300 focus-visible:outline focus-visible:outline-amber-300">{destination.name}</Link></h3>
        <p className="mt-3 text-sm leading-relaxed text-stone-300">{destination.whyVisit || destination.description}</p>
        <div className="my-5 rounded-xl bg-stone-950/70 p-4">
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-200"><CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />Recommended visiting months</p>
          <p className="text-sm leading-relaxed text-stone-200">{months || 'Check local seasonal guidance'}</p>
          <p className="mt-2 text-xs leading-relaxed text-stone-400">{destination.bestSeasonLabel} · {destination.duration}</p>
        </div>
        <Link to={href} className="mt-auto flex min-h-11 items-center justify-between gap-2 border-t border-white/10 pt-4 text-sm font-semibold text-amber-300 focus-visible:outline focus-visible:outline-amber-300">Plan a visit <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></Link>
      </div>
    </article>
  );
}
