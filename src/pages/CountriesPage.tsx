import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Search, Compass, Camera, CalendarDays } from 'lucide-react';
import { allCountries, CONTINENTS, MONTHS, TRAVEL_STYLES, getCountryImageFallbacks } from '@/data';
import { SmartImage } from '@/components/SmartImage';
import { SectionHeading } from '@/components/SectionHeading';

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function CountriesPage() {
  const [params, setParams] = useSearchParams();
  const [visibleCount, setVisibleCount] = useState(24);
  const reducedMotion = useReducedMotion();
  const query = params.get('q') ?? '';
  const region = params.get('region') ?? '';
  const month = params.get('month') ?? '';
  const style = params.get('style') ?? '';
  const letter = params.get('letter') ?? '';
  const filtered = allCountries.filter(country => {
    const text = normalize([country.name, country.id, country.id.replace(/-/g, ' '), country.capital, country.description, ...(country.famousFor ?? []), ...country.travelStyles].join(' '));
    return text.includes(normalize(query.trim()))
      && (!region || country.continent === region)
      && (!month || country.bestMonths.some(value => value === Number(month)))
      && (!style || country.travelStyles.includes(style))
      && (!letter || normalize(country.name).startsWith(letter.toLowerCase()));
  }).sort((a, b) => a.name.localeCompare(b.name));
  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
    setVisibleCount(24);
  };
  const clearFilters = () => { setParams({}); setVisibleCount(24); };
  const photoCount = allCountries.reduce((total, country) => total + (country.gallery?.length ?? 0), 0);

  return (
    <div className="bg-stone-950 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <SectionHeading
          as="h1"
          eyebrow="Country Explorer"
          title="Discover the World"
          subtitle="Find your place, then find your moment. Explore country-specific galleries, signature experiences and the seasons that suit them best."
        />

        <div className="mb-10 flex flex-wrap justify-center gap-3 text-xs text-stone-300">
          <span className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2"><Compass className="h-4 w-4 text-amber-300" />{allCountries.length} countries</span>
          <span className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2"><Camera className="h-4 w-4 text-amber-300" />{photoCount.toLocaleString()} gallery photographs</span>
          <span className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2"><CalendarDays className="h-4 w-4 text-amber-300" />A season for every journey</span>
        </div>

        <div className="mb-8 rounded-2xl border border-white/10 bg-stone-900/80 p-4 md:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs text-stone-400">Search countries or highlights
              <div className="relative mt-2">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4" />
                <input value={query} onChange={event => updateFilter('q', event.target.value)} placeholder="Japan, reefs, architecture…" className="w-full rounded-lg border border-white/10 bg-stone-950 py-3 pl-9 pr-3 text-sm text-white" />
              </div>
            </label>
            <label className="text-xs text-stone-400">Region
              <select value={region} onChange={event => updateFilter('region', event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-stone-950 p-3 text-sm text-white">
                <option value="">All regions</option>{CONTINENTS.map(value => <option key={value}>{value}</option>)}
              </select>
            </label>
            <label className="text-xs text-stone-400">Best month to visit
              <select value={month} onChange={event => updateFilter('month', event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-stone-950 p-3 text-sm text-white">
                <option value="">Any month</option>{MONTHS.map(value => <option key={value.month} value={value.month}>{value.fullName}</option>)}
              </select>
            </label>
            <label className="text-xs text-stone-400">Travel style
              <select value={style} onChange={event => updateFilter('style', event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-stone-950 p-3 text-sm text-white">
                <option value="">Every kind of journey</option>{TRAVEL_STYLES.map(value => <option key={value}>{value}</option>)}
              </select>
            </label>
          </div>
          <div aria-label="Country initials" className="mt-5 flex flex-wrap gap-1.5">
            {['', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map(value => (
              <button key={value} onClick={() => updateFilter('letter', value)} aria-pressed={letter === value} className={`min-h-9 min-w-9 rounded-lg px-2 text-xs transition-colors ${letter === value ? 'bg-amber-400 font-semibold text-stone-950' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'}`}>{value || 'All'}</button>
            ))}
          </div>
        </div>
        <div className="mb-5 flex items-center justify-between gap-4">
          <p role="status" className="text-sm text-stone-400">{filtered.length} {filtered.length === 1 ? 'country' : 'countries'} found</p>
          {(query || region || month || style || letter) && <button onClick={clearFilters} className="text-sm text-amber-300 underline underline-offset-4">Clear filters</button>}
        </div>
        {!filtered.length && <div className="rounded-2xl border border-white/10 p-12 text-center text-stone-300">No countries match these filters. Try another month or clear the filters.</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filtered.slice(0, visibleCount).map((country, index) => {
            const signature = (country.famousFor ?? country.cultureHighlights).slice(0, 3).join(' · ');
            return (
              <motion.div
                key={country.id}
                initial={{ opacity: 0, y: reducedMotion ? 0 : 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={reducedMotion ? undefined : { y: -5 }}
                viewport={{ once: true }}
                transition={{ duration: reducedMotion ? 0 : 0.35, delay: reducedMotion ? 0 : Math.min((index % 3) * 0.04, 0.12) }}
              >
                <Link to={`/country/${country.slug}`} className="group flex h-full flex-col rounded-xl overflow-hidden border border-white/5 bg-stone-900 transition-colors hover:border-amber-400/30">
                  <div className="relative aspect-[16/10] shrink-0 overflow-hidden">
                    <SmartImage
                      src={country.heroImage}
                      alt={country.name}
                      fallbackSources={getCountryImageFallbacks(country)}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="text-amber-400 text-xs uppercase tracking-[0.2em] font-medium">{country.continent}</p>
                      <h3 className="text-white text-xl font-semibold mt-2">{country.flag} {country.name}</h3>
                    </div>
                  </div>
                  <div className="flex min-h-[216px] flex-1 flex-col p-5">
                    <p className="text-stone-400 text-sm leading-relaxed line-clamp-3">{country.description}</p>
                    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                      <div>
                        <p className="text-stone-500 text-[10px] uppercase tracking-[0.16em]">Best time</p>
                        <p className="text-white text-sm mt-1">{country.bestMonthsLabel}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-amber-400 text-xs font-medium">
                        Explore <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                    <p className="mt-4 min-h-[32px] text-stone-500 text-xs">
                      Best for: <span className="text-stone-300">{signature}</span>
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
        {filtered.length > visibleCount && (
          <div className="mt-10 text-center">
            <button onClick={() => setVisibleCount(count => count + 24)} className="rounded-full border border-amber-400/40 px-8 py-3 text-sm font-semibold text-amber-300 transition-colors hover:bg-amber-400/10">Show more countries ({filtered.length - visibleCount} remaining)</button>
          </div>
        )}
      </div>
    </div>
  );
}
