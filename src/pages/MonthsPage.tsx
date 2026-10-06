import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, Search } from 'lucide-react';
import { getDestinationsByMonth, getCountriesByMonth } from '@/data';
import type { MonthNumber } from '@/data';
import { filterMonthFeatures, getMonthFeature } from '@/data/monthDiscovery';
import { DiscoveryHero, PhotoAttribution } from '@/components/DiscoveryHero';
import { SmartImage } from '@/components/SmartImage';

export function MonthsPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const rawWindow = params.get('window') || '';
  const window = ['1', '2', '3', '4'].includes(rawWindow) ? rawWindow : '';
  const features = filterMonthFeatures(query, window);
  const featured = getMonthFeature((new Date().getMonth() + 1) as MonthNumber);
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  };

  return (
    <div className="bg-stone-950 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <DiscoveryHero eyebrow="The travel calendar" title="A year of possibilities. Pick your moment."
          description="Start with when you can go. Find a place that fits, understand what the season offers, and know what to check before you book."
          image={featured.image} imageLabel={`${featured.country.name} · ${featured.month.fullName} inspiration`}>
          <Link to={`/month/${featured.month.fullName.toLowerCase()}`} className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-stone-950 hover:bg-amber-300">
            Explore {featured.month.fullName} <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-xs text-stone-400">12 months · Local seasonal guidance · Both hemispheres</p>
        </DiscoveryHero>

        <section aria-labelledby="month-calendar-title">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-xs uppercase tracking-[0.18em] text-amber-400 mb-2">Choose your window</p><h2 id="month-calendar-title" className="text-2xl sm:text-3xl font-semibold text-white">Where could this month take you?</h2></div>
            <span className="text-sm text-stone-400" role="status">{features.length} of 12 months</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-stone-900/60 p-4 sm:p-5 mb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <label className="flex-1 text-xs font-medium text-stone-300">Search the calendar
                <span className="relative mt-2 block"><Search className="absolute left-3 top-3 h-4 w-4 text-stone-500" aria-hidden="true" /><input type="search" value={query} onChange={event => update('q', event.target.value)} placeholder="A month, country or kind of trip" className="w-full rounded-lg border border-white/10 bg-stone-950 py-2.5 pl-10 pr-3 text-sm text-white" /></span>
              </label>
              <label className="text-xs font-medium text-stone-300">Travel window
                <select aria-label="Travel window" value={window} onChange={event => update('window', event.target.value)} className="mt-2 block w-full md:w-48 rounded-lg border border-white/10 bg-stone-950 px-3 py-2.5 text-sm text-white">
                  <option value="">All year</option><option value="1">January–March</option><option value="2">April–June</option><option value="3">July–September</option><option value="4">October–December</option>
                </select>
              </label>
              {(query || window) && <button onClick={() => setParams({})} className="self-start md:self-auto rounded-lg px-3 py-2.5 text-sm text-amber-400 hover:bg-white/5">Reset filters</button>}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-stone-400">Seasons are local, not worldwide. Photos show featured places, not guaranteed conditions during that month.</p>
          </div>

          {features.length ? <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.article key={feature.month.month} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.15) }} className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-stone-900 hover:border-amber-400/40 transition-colors">
                <Link to={`/month/${feature.month.fullName.toLowerCase()}`} className="flex-1">
                  <div className="relative overflow-hidden"><SmartImage src={feature.image.url} alt={feature.image.alt} className="aspect-[16/10] w-full motion-safe:group-hover:scale-105 transition-transform duration-700" /><span className="absolute left-4 top-4 rounded-full bg-stone-950/80 px-3 py-1.5 text-xs font-medium text-white">{feature.country.name}</span></div>
                  <div className="p-5 sm:p-6">
                    <div className="mb-3 flex items-center justify-between gap-3"><h3 className="text-2xl font-semibold text-white">{feature.month.fullName}</h3><span className="text-sm text-stone-500">{String(feature.month.month).padStart(2, '0')}</span></div>
                    <p className="text-sm font-medium text-amber-300 mb-2">{feature.theme}</p>
                    <p className="text-sm leading-relaxed text-stone-300">{feature.summary}</p>
                    <p className="mt-5 flex items-center gap-2 text-xs text-stone-400"><CalendarDays className="h-4 w-4 shrink-0" />{getCountriesByMonth(feature.month.month).length} countries · {getDestinationsByMonth(feature.month.month).length} destination guides</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-amber-400">Plan {feature.month.fullName} <ArrowRight className="h-4 w-4" /></span>
                  </div>
                </Link>
                <PhotoAttribution image={feature.image} className="border-t border-white/5 px-5 py-3 sm:px-6" />
              </motion.article>
            ))}
          </div> : <div className="rounded-2xl border border-dashed border-white/15 py-14 px-6 text-center"><h3 className="text-xl font-semibold text-white">No months match these filters</h3><p className="mt-2 text-sm text-stone-400">Try a month name, a featured country, or a wider travel window.</p><button onClick={() => setParams({})} className="mt-5 text-amber-400 text-sm underline underline-offset-4">Show all months</button></div>}
        </section>
      </div>
    </div>
  );
}
