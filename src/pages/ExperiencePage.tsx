import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { EXPERIENCE_CATEGORIES, MONTHS } from '@/data';
import { DiscoveryHero } from '@/components/DiscoveryHero';
import { ExperienceCard } from '@/components/ExperienceCard';
import { experienceEditorial, getExperienceImage, getExperienceMatches, readExperienceFilters, resetExperienceFilters, updateExperienceFilter } from '@/data/experienceDiscovery';

export function ExperiencePage() {
  const { experienceId } = useParams();
  const [params, setParams] = useSearchParams();
  const category = EXPERIENCE_CATEGORIES.find(c => c.id === experienceId);
  const { query, month } = readExperienceFilters(params);
  const search = params.toString();
  const backLink = `/experiences${search ? `?${search}` : ''}`;
  const reset = () => setParams(resetExperienceFilters(params), { replace: true });

  if (!category) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-950 px-4 pt-20">
        <div className="text-center">
          <h1 className="mb-3 text-2xl font-semibold text-white">Experience not found</h1>
          <Link to={backLink} className="text-sm text-amber-300 hover:underline">Browse all experiences</Link>
        </div>
      </div>
    );
  }

  const editorial = experienceEditorial[category.id];
  const destinations = getExperienceMatches(category.id, query, month);

  return (
    <div className="min-h-screen bg-stone-950 pt-20">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Link to={backLink} className="inline-flex min-h-11 items-center gap-2 text-sm text-stone-300 hover:text-amber-300 focus-visible:outline focus-visible:outline-amber-300"><ArrowLeft className="h-4 w-4" aria-hidden="true" />All experiences</Link>
      </div>
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <DiscoveryHero eyebrow="Find your kind of journey" title={category.label} description={editorial.summary} image={getExperienceImage(category.id)} imageLabel={editorial.imageLabel}>
          <a href="#experience-destinations" className="inline-flex min-h-11 items-center rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-stone-950 focus-visible:outline focus-visible:outline-amber-300">Compare destinations</a>
        </DiscoveryHero>
      </div>
      <section id="experience-destinations" aria-labelledby="destinations-heading" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-12 sm:px-6 lg:px-8">
        <aside className="mb-10 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-5 sm:p-6" aria-label="Timing guidance">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-amber-200"><CalendarDays className="h-5 w-5 shrink-0" aria-hidden="true" />Plan around the place</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-stone-300">{editorial.planningNote}</p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-stone-400">The months below come from each destination’s travel guide. These are places to consider, not a guarantee that every activity is available throughout those months.</p>
        </aside>
        <h2 id="destinations-heading" className="mb-5 text-2xl font-semibold text-white">Find your base</h2>
        <form role="search" aria-label="Filter experience destinations" onSubmit={event => event.preventDefault()} className="mb-6 grid gap-4 rounded-2xl border border-white/10 bg-stone-900 p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <label className="min-w-0 text-sm text-stone-300">Experience or place
            <input type="search" value={query} onChange={event => setParams(updateExperienceFilter(params, 'q', event.target.value), { replace: true })} placeholder="Search a country or destination…" className="mt-2 min-h-11 w-full rounded-lg border border-white/20 bg-stone-950 px-3 py-3 text-white focus:border-amber-300 focus:outline-none" />
          </label>
          <label className="min-w-0 text-sm text-stone-300">Travel month
            <select value={month ?? ''} onChange={event => setParams(updateExperienceFilter(params, 'month', event.target.value), { replace: true })} className="mt-2 min-h-11 w-full rounded-lg border border-white/20 bg-stone-950 px-3 py-3 text-white focus:border-amber-300 focus:outline-none">
              <option value="">Any month</option>
              {MONTHS.map(item => <option key={item.month} value={item.month}>{item.fullName}</option>)}
            </select>
          </label>
          <button type="button" onClick={reset} disabled={!params.has('q') && !params.has('month')} className="min-h-11 rounded-lg border border-white/20 px-4 py-3 text-sm text-stone-200 hover:border-amber-300 focus-visible:outline focus-visible:outline-amber-300 disabled:opacity-40">Reset filters</button>
        </form>
        <p role="status" className="mb-6 text-sm text-stone-400">{destinations.length} {destinations.length === 1 ? 'destination' : 'destinations'}{month ? ` recommended for ${MONTHS[month - 1].fullName}` : ' to consider'}</p>
        {destinations.length ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {destinations.map(destination => <ExperienceCard key={destination.id} destination={destination} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/20 p-8 text-center">
            <h3 className="text-xl font-semibold text-white">No destinations match yet</h3>
            <p className="mt-3 text-sm text-stone-400">Try a different month or remove your search to see more places.</p>
            <button type="button" onClick={reset} className="mt-5 min-h-11 rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-stone-950">Show all {category.label.toLowerCase()} destinations</button>
          </div>
        )}
      </section>
    </div>
  );
}
