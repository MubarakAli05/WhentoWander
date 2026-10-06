import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { EXPERIENCE_CATEGORIES, MONTHS } from '@/data';
import { DiscoveryHero, PhotoAttribution } from '@/components/DiscoveryHero';
import { SmartImage } from '@/components/SmartImage';
import { experienceEditorial, experienceTimingExample, getExperienceImage, getExperienceMatches, readExperienceFilters, resetExperienceFilters, updateExperienceFilter } from '@/data/experienceDiscovery';

export function ExperiencesPage() {
  const [params, setParams] = useSearchParams();
  const { query, month } = readExperienceFilters(params);
  const categories = EXPERIENCE_CATEGORIES.map(category => ({ category, destinations: getExperienceMatches(category.id, query, month) })).filter(item => item.destinations.length > 0);
  const hasFilters = params.has('q') || params.has('month');
  const search = params.toString();
  const reset = () => setParams(resetExperienceFilters(params), { replace: true });

  return (
    <div className="min-h-screen bg-stone-950 pt-20">
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 md:pt-20 lg:px-8">
        <DiscoveryHero
          eyebrow="Explore by experience"
          title="Start with a feeling. Find your place."
          description="A trail above the clouds, a city seen slowly, a shore with room to breathe. Choose the kind of trip you want, then compare where and when to go."
          image={getExperienceImage('mountains')}
          imageLabel={experienceEditorial.mountains.imageLabel}
        >
          <a href="#experience-filters" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300">
            Find your experience <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <p className="mt-4 text-sm text-stone-400">{EXPERIENCE_CATEGORIES.length} ways to explore · local timing, not one worldwide season</p>
        </DiscoveryHero>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" aria-labelledby="experience-heading">
        <div className="mb-7 max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">The experience edit</p>
          <h2 id="experience-heading" className="text-2xl font-semibold text-white sm:text-3xl">What would make this trip yours?</h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-300">Search a theme, country or destination. Month filters use each destination’s recommended visiting months, not guaranteed bloom, snow or wildlife dates.</p>
        </div>
        <form id="experience-filters" role="search" aria-label="Filter experiences" onSubmit={event => event.preventDefault()} className="mb-8 grid scroll-mt-28 gap-4 rounded-2xl border border-white/10 bg-stone-900 p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <label className="min-w-0 text-sm text-stone-300">Experience or place
            <input type="search" value={query} onChange={event => setParams(updateExperienceFilter(params, 'q', event.target.value), { replace: true })} placeholder="Mountains, Japan, Kyoto…" className="mt-2 min-h-11 w-full rounded-lg border border-white/20 bg-stone-950 px-3 py-3 text-white focus:border-amber-300 focus:outline-none" />
          </label>
          <label className="min-w-0 text-sm text-stone-300">Travel month
            <select value={month ?? ''} onChange={event => setParams(updateExperienceFilter(params, 'month', event.target.value), { replace: true })} className="mt-2 min-h-11 w-full rounded-lg border border-white/20 bg-stone-950 px-3 py-3 text-white focus:border-amber-300 focus:outline-none">
              <option value="">Any month</option>
              {MONTHS.map(item => <option key={item.month} value={item.month}>{item.fullName}</option>)}
            </select>
          </label>
          <button type="button" onClick={reset} disabled={!hasFilters} className="min-h-11 rounded-lg border border-white/20 px-4 py-3 text-sm text-stone-200 hover:border-amber-300 focus-visible:outline focus-visible:outline-amber-300 disabled:opacity-40">Reset filters</button>
        </form>
        <p role="status" className="mb-5 text-sm text-stone-400">{categories.length} {categories.length === 1 ? 'experience' : 'experiences'}{month ? ` with places to visit in ${MONTHS[month - 1].fullName}` : ' to explore'}</p>
        {categories.length ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {categories.map(({ category, destinations }) => {
              const editorial = experienceEditorial[category.id];
              const image = getExperienceImage(category.id);
              const href = `/experience/${category.id}${search ? `?${search}` : ''}`;
              return (
                <article key={category.id} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-stone-900">
                  <figure>
                    <Link to={href} aria-label={`Explore ${category.label}`} className="group block overflow-hidden focus-visible:outline focus-visible:outline-amber-300">
                      <SmartImage src={image.url} alt={image.alt} className="aspect-[16/10] w-full motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.02]" />
                    </Link>
                    <figcaption className="border-b border-white/10 px-5 py-3">
                      <p className="mb-1 text-xs leading-relaxed text-stone-300">{editorial.imageLabel}</p>
                      <PhotoAttribution image={image} />
                    </figcaption>
                  </figure>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="mb-2 text-xs uppercase tracking-wider text-amber-300">{destinations.length} {destinations.length === 1 ? 'destination' : 'destinations'} to consider</p>
                    <h3 className="text-2xl font-semibold text-white"><Link to={href} className="hover:text-amber-300 focus-visible:outline focus-visible:outline-amber-300">{category.label}</Link></h3>
                    <p className="mt-3 text-sm leading-relaxed text-stone-300">{editorial.summary}</p>
                    <div className="my-5 rounded-xl bg-stone-950/70 p-4">
                      <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-200"><CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />Timing starting point</p>
                      <p className="text-sm leading-relaxed text-stone-300">{experienceTimingExample(destinations)}</p>
                    </div>
                    <Link to={href} className="mt-auto flex min-h-11 items-center justify-between gap-2 border-t border-white/10 pt-4 text-sm font-semibold text-amber-300 focus-visible:outline focus-visible:outline-amber-300">Explore {category.label.toLowerCase()} <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/20 px-5 py-14 text-center">
            <h3 className="text-xl font-semibold text-white">No experiences match these filters</h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-stone-400">Try another place, a broader theme or a different month. There may still be options outside the recommended visiting months.</p>
            <button type="button" onClick={reset} className="mt-5 min-h-11 rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-stone-950">Show all experiences</button>
          </div>
        )}
      </section>
    </div>
  );
}
