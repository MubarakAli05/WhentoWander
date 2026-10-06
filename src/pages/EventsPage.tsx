import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, CalendarRange } from 'lucide-react';
import { EVENTS, EVENT_CATEGORIES, MONTHS, allCountries } from '@/data';
import { DiscoveryHero, PhotoAttribution } from '@/components/DiscoveryHero';
import { SmartImage } from '@/components/SmartImage';
import { filterEvents, getEventPhoto, getEventTiming, guideMonths, readSeasonalFilters, resetSeasonalFilters, updateSeasonalFilter } from '@/data/seasonalDiscovery';

const heroPhoto = getEventPhoto(EVENTS.find(event => event.id === 'greece-summer-fiesta')!);
const fieldClass = 'w-full min-w-0 rounded-xl border border-white/15 bg-stone-900 px-3 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400';

export function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = readSeasonalFilters(searchParams, 'events');
  const filteredEvents = filterEvents(filters);
  const setFilter = (key: string, value: string) => setSearchParams(previous => updateSeasonalFilter(previous, key, value), { replace: key === 'q' });
  const reset = () => setSearchParams(previous => resetSeasonalFilters(previous));

  return (
    <div className="bg-stone-950 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <DiscoveryHero
          eyebrow="Events & seasonal moments"
          title="Make the moment part of the journey."
          description="From a festival day to a season in bloom: discover what draws people here, where to go and what to check before you book."
          image={heroPhoto.image}
          imageLabel={heroPhoto.label}
        >
          <p className="text-sm text-stone-400">{EVENTS.length} ideas · annual celebrations & natural seasons · local photo previews</p>
        </DiscoveryHero>

        <section aria-labelledby="event-filters" className="my-10 rounded-2xl border border-white/10 bg-stone-900/50 p-5 sm:p-6">
          <h2 id="event-filters" className="text-xl font-semibold text-white">Find your reason to go</h2>
          <p id="event-timing-note" className="mt-2 text-sm leading-relaxed text-stone-400">Months are guide markers, not a complete events calendar. Some seasons span several months; check each timing note and the linked source for current dates.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="min-w-0">
              <span className="mb-2 block text-sm text-stone-300">Search events</span>
              <input type="search" value={filters.query} onChange={e => setFilter('q', e.target.value)} placeholder="Name, place or interest" className={fieldClass} />
            </label>
            <label className="min-w-0">
              <span className="mb-2 block text-sm text-stone-300">Guide month</span>
              <select value={filters.month} onChange={e => setFilter('month', e.target.value)} aria-describedby="event-timing-note" className={fieldClass}>
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
              <span className="mb-2 block text-sm text-stone-300">Category</span>
              <select value={filters.category} onChange={e => setFilter('category', e.target.value)} className={fieldClass}>
                {EVENT_CATEGORIES.map(category => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p role="status" className="text-sm text-stone-300">{filteredEvents.length} {filteredEvents.length === 1 ? 'idea' : 'ideas'} found</p>
            <button onClick={reset} className="min-h-11 rounded-lg px-3 text-sm text-amber-400 underline underline-offset-4 focus-visible:outline focus-visible:outline-amber-400">Reset filters</button>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {filteredEvents.map(event => {
            const photo = getEventPhoto(event);
            return (
              <article key={event.id} id={event.id} className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-stone-900">
                <figure>
                  <SmartImage src={photo.image.url} alt={photo.label} loading="lazy" className="aspect-[4/3] w-full" />
                  <figcaption className="px-5 pt-3 text-xs leading-relaxed text-stone-400">{photo.label}</figcaption>
                </figure>
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-amber-400">
                    <span>{event.category}</span>
                    <span className="inline-flex items-center gap-1"><CalendarRange aria-hidden="true" className="h-3.5 w-3.5" /> {guideMonths([event.month])} guide</span>
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">{event.title}</h3>
                  <p className="mt-2 text-sm font-medium text-stone-300">{event.location} · {event.countryName}</p>
                  <p className="mt-4 text-sm leading-relaxed text-stone-300">{event.summary}</p>
                  <div className="mt-5 border-l-2 border-amber-400/50 pl-3">
                    <h4 className="text-sm font-medium text-white">When to plan</h4>
                    <p className="mt-1 text-sm leading-relaxed text-stone-400">{getEventTiming(event)}</p>
                  </div>
                  <details className="mt-5 text-sm text-stone-300">
                    <summary className="min-h-11 cursor-pointer py-3 text-amber-400 focus-visible:outline focus-visible:outline-amber-400">Background & sources</summary>
                    <p className="mt-2 leading-relaxed">{event.description}</p>
                    <a href={event.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-amber-400 underline underline-offset-4">{event.source} ↗</a>
                    <p className="mt-2 text-xs leading-relaxed text-stone-400">Guide record last checked: {event.lastVerified}. This is not confirmation of this year’s programme.</p>
                  </details>
                  <PhotoAttribution image={photo.image} className="mt-3" />
                  <Link to={`/country/${event.countrySlug}`} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-amber-400 hover:underline focus-visible:outline focus-visible:outline-amber-400">
                    Explore {event.countryName} <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="mt-12 rounded-lg border border-dashed border-white/10 bg-stone-900 p-10 text-center">
            <h2 className="text-white text-lg font-medium mb-2">No events match these filters.</h2>
            <p className="text-stone-400 text-sm">Try another search, month, category or country. This guide is a selection, not a complete calendar.</p>
            <button onClick={reset} className="mt-5 min-h-11 rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-stone-950">Show all events</button>
          </div>
        )}
      </div>
    </div>
  );
}
