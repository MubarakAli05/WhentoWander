import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PHENOMENA, MONTHS, allCountries } from '@/data';
import { DiscoveryHero, PhotoAttribution } from '@/components/DiscoveryHero';
import { SmartImage } from '@/components/SmartImage';
import { PHENOMENON_CATEGORIES, filterPhenomena, getPhenomenonCategory, getPhenomenonGuidance, getPhenomenonPhoto, guideMonths, readSeasonalFilters, resetSeasonalFilters, updateSeasonalFilter } from '@/data/seasonalDiscovery';

const heroPhoto = getPhenomenonPhoto(PHENOMENA.find(item => item.id === 'monsoon-landscapes')!);
const fieldClass = 'w-full min-w-0 rounded-xl border border-white/15 bg-stone-900 px-3 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400';

export function PhenomenaPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = readSeasonalFilters(searchParams, 'phenomena');
  const phenomena = filterPhenomena(filters);
  const setFilter = (key: string, value: string) => setSearchParams(previous => updateSeasonalFilter(previous, key, value), { replace: key === 'q' });
  const reset = () => setSearchParams(previous => resetSeasonalFilters(previous));
  const detailSearch = searchParams.toString() ? `?${searchParams.toString()}` : '';

  return (
    <div className="min-h-screen bg-stone-950 pt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
        <DiscoveryHero
          eyebrow="Natural phenomena"
          title="Nature sets the calendar."
          description="Follow the changing light, the first flowers and the movement of wildlife. Find a seasonal possibility, then get to know the conditions that make it happen."
          image={heroPhoto.image}
          imageLabel={heroPhoto.label}
        >
          <p className="text-sm text-stone-400">{PHENOMENA.length} seasonal guides · regional timing matters · sightings are never guaranteed</p>
        </DiscoveryHero>

        <section aria-labelledby="phenomena-filters" className="my-10 rounded-2xl border border-white/10 bg-stone-900/50 p-5 sm:p-6">
          <h2 id="phenomena-filters" className="text-xl font-semibold text-white">What would you like to witness?</h2>
          <p id="phenomena-timing-note" className="mt-2 text-sm leading-relaxed text-stone-400">Month filters use each guide’s reference window, not a forecast for every country. Seasons can differ by region and hemisphere; read the local-timing caveat before choosing dates.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="min-w-0">
              <span className="mb-2 block text-sm text-stone-300">Search phenomena</span>
              <input type="search" value={filters.query} onChange={e => setFilter('q', e.target.value)} placeholder="Aurora, flowers, place…" className={fieldClass} />
            </label>
            <label className="min-w-0">
              <span className="mb-2 block text-sm text-stone-300">Guide month</span>
              <select value={filters.month} onChange={e => setFilter('month', e.target.value)} aria-describedby="phenomena-timing-note" className={fieldClass}>
                <option value="all">All months</option>
                {MONTHS.map(month => <option key={month.month} value={month.month}>{month.fullName}</option>)}
              </select>
            </label>
            <label className="min-w-0">
              <span className="mb-2 block text-sm text-stone-300">Country</span>
              <select value={filters.country} onChange={e => setFilter('country', e.target.value)} className={fieldClass}>
                <option value="all">All countries</option>
                {allCountries.map(country => <option key={country.id} value={country.slug}>{country.name}</option>)}
              </select>
            </label>
            <label className="min-w-0">
              <span className="mb-2 block text-sm text-stone-300">Theme</span>
              <select value={filters.category} onChange={e => setFilter('category', e.target.value)} className={fieldClass}>
                {PHENOMENON_CATEGORIES.map(category => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p role="status" className="text-sm text-stone-300">{phenomena.length} {phenomena.length === 1 ? 'guide' : 'guides'} found</p>
            <button onClick={reset} className="min-h-11 rounded-lg px-3 text-sm text-amber-400 underline underline-offset-4 focus-visible:outline focus-visible:outline-amber-400">Reset filters</button>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {phenomena.map(phenomenon => {
            const photo = getPhenomenonPhoto(phenomenon);
            const countryNames = phenomenon.countries.map(slug => allCountries.find(country => country.slug === slug)?.name).filter(Boolean).join(' · ');
            return (
              <article key={phenomenon.id} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-stone-900">
                <figure>
                  <SmartImage src={photo.image.url} alt={photo.label} loading="lazy" className="aspect-[4/3] w-full" />
                  <figcaption className="px-5 pt-3 text-xs leading-relaxed text-stone-400">{photo.label}</figcaption>
                </figure>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-medium text-amber-400">{getPhenomenonCategory(phenomenon)}</p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                    <Link to={`/phenomena/${phenomenon.slug}${detailSearch}`} className="hover:text-amber-400 focus-visible:outline focus-visible:outline-amber-400">{phenomenon.name}</Link>
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone-300">{phenomenon.summary}</p>
                  <dl className="mt-5 space-y-4 text-sm">
                    <div><dt className="font-medium text-white">Where to explore</dt><dd className="mt-1 leading-relaxed text-stone-400">{countryNames || phenomenon.location}</dd></div>
                    <div><dt className="font-medium text-white">Guide months</dt><dd className="mt-1 leading-relaxed text-stone-300">{guideMonths(phenomenon.bestMonths)}</dd></div>
                  </dl>
                  <p className="my-5 border-l-2 border-amber-400/50 pl-3 text-sm leading-relaxed text-stone-400">{getPhenomenonGuidance(phenomenon)}</p>
                  <div className="mt-auto border-t border-white/10 pt-3">
                    <PhotoAttribution image={photo.image} />
                    <Link to={`/phenomena/${phenomenon.slug}${detailSearch}`} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-amber-400 hover:underline focus-visible:outline focus-visible:outline-amber-400">Read the seasonal guide <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        {phenomena.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 bg-stone-900 p-6 text-center sm:p-10">
            <h2 className="text-xl font-semibold text-white">No seasonal guides match yet.</h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-400">Try another search, theme or month. This collection does not cover every natural phenomenon or destination.</p>
            <button onClick={reset} className="mt-5 min-h-11 rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-stone-950">Show all phenomena</button>
          </div>
        )}
      </div>
    </div>
  );
}
