import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowRight, Info, MapPin } from 'lucide-react';
import { MONTHS, CONTINENTS, getMonthInfo, getDestinationsByMonth } from '@/data';
import { getMonthDiscovery, getMonthFeature } from '@/data/monthDiscovery';
import { DiscoveryHero } from '@/components/DiscoveryHero';
import { CountryCard } from '@/components/CountryCard';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { MonthSelector } from '@/components/MonthSelector';
import { DestinationCard } from '@/components/DestinationCard';
import { EmptyState } from '@/components/EmptyState';

export function MonthPage() {
  const { month: monthSlug } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const rawRegion = params.get('region') || '';
  const region = CONTINENTS.includes(rawRegion) ? rawRegion : '';
  const monthFromUrl = MONTHS.find(m => m.fullName.toLowerCase() === monthSlug?.toLowerCase());
  if (!monthFromUrl) return <NotFoundPage />;
  const selectedMonth = monthFromUrl.month;

  const monthInfo = monthFromUrl;
  const feature = getMonthFeature(selectedMonth);
  const { destinations: dests, countries } = getMonthDiscovery(selectedMonth, query, region);
  const countryParams = new URLSearchParams({ month: String(selectedMonth) });
  if (query) countryParams.set('q', query);
  if (region) countryParams.set('region', region);
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  };

  return (
    <div className="bg-stone-950 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <Link to="/months" className="inline-block mb-8 text-sm text-stone-400 hover:text-amber-400">← Back to the travel calendar</Link>
        <DiscoveryHero eyebrow={`${monthInfo.fullName} travel guide`} title={`${monthInfo.fullName}: ${feature.theme.toLowerCase()}.`}
          description={feature.summary} image={feature.image} imageLabel={`${feature.country.name} · featured location`}>
          <Link to={`/country/${feature.country.slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-amber-400"><MapPin className="h-4 w-4" />Explore {feature.country.name}<ArrowRight className="h-4 w-4" /></Link>
          <p className="mt-4 text-xs leading-relaxed text-stone-400">One starting point, not the whole world. Explore more regions below; seasons differ by location.</p>
        </DiscoveryHero>

        <div className="mb-8 rounded-2xl border border-amber-400/15 bg-amber-400/5 p-5 sm:p-6 flex items-start gap-3">
          <Info className="mt-1 h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
          <div><h2 className="font-semibold text-white mb-2">Before you plan {feature.country.name}</h2><p className="text-sm leading-relaxed text-stone-300">{feature.watchFor}</p></div>
        </div>
        <div className="mb-8">
          <MonthSelector selectedMonth={selectedMonth} onSelectMonth={month => navigate({ pathname: `/month/${getMonthInfo(month)?.fullName.toLowerCase()}`, search: params.toString() })} />
        </div>
        <section aria-label="Filter monthly recommendations" className="mb-10 rounded-2xl border border-white/10 bg-stone-900/60 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <label className="flex-1 text-xs font-medium text-stone-300">Find a country or destination<input type="search" value={query} onChange={event => update('q', event.target.value)} placeholder="Try Japan, Kyoto or Greece" className="mt-2 block w-full rounded-lg border border-white/10 bg-stone-950 px-3 py-2.5 text-sm text-white" /></label>
            <label className="text-xs font-medium text-stone-300">Region<select aria-label="Region" value={region} onChange={event => update('region', event.target.value)} className="mt-2 block w-full md:w-52 rounded-lg border border-white/10 bg-stone-950 px-3 py-2.5 text-sm text-white"><option value="">All regions</option>{CONTINENTS.map(continent => <option key={continent}>{continent}</option>)}</select></label>
            {(query || region) && <button onClick={() => setParams({})} className="self-start md:self-auto rounded-lg px-3 py-2.5 text-sm text-amber-400 hover:bg-white/5">Reset filters</button>}
          </div>
          <p role="status" className="mt-4 text-xs text-stone-400">{countries.length} countries · {dests.length} destination guides for {monthInfo.fullName}</p>
        </section>

        {countries.length > 0 && (
          <section className="mb-14" aria-labelledby="month-countries-heading">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div><h2 id="month-countries-heading" className="text-2xl font-semibold text-white">Countries to consider</h2><p className="mt-2 text-sm text-stone-400">A broad seasonal shortlist. Check the country guide for regional differences.</p></div>
              <Link to={`/countries?${countryParams}`} className="inline-flex items-center gap-2 text-sm text-amber-400">View all {countries.length} countries <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{countries.slice(0, 6).map((country, index) => <CountryCard key={country.id} country={country} index={index} />)}</div>
          </section>
        )}

        <section aria-labelledby="month-destinations-heading">
          <h2 id="month-destinations-heading" className="text-2xl font-semibold text-white mb-3">Destination guides for {monthInfo.fullName}</h2>
          <p className="text-sm text-stone-400 mb-6">Compare things to do, local season notes and suggested trip lengths.</p>
          {dests.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {dests.map((dest, i) => (
                <DestinationCard key={dest.id} destination={dest} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No destination guides match"
              message={query || region ? 'Try another region, clear your search, or explore the country guides above.' : `Detailed destination coverage is still growing for ${monthInfo.fullName}. Explore the country guides for more options.`}
            />
          )}
        </section>

        <div className="mt-20 pt-12 border-t border-white/5">
          <h3 className="text-white/80 text-sm font-semibold uppercase tracking-wide mb-5">
            A Year of Travel
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {MONTHS.map(m => {
              const count = getDestinationsByMonth(m.month).length;
              return (
                <Link
                  key={m.month}
                  to={{ pathname: `/month/${m.fullName.toLowerCase()}`, search: params.toString() }}
                  aria-current={m.month === selectedMonth ? 'page' : undefined}
                  className={`p-4 rounded-lg border text-center transition-all ${
                    m.month === selectedMonth
                      ? 'border-amber-400 bg-stone-800'
                      : 'border-white/5 bg-stone-900 hover:border-white/15'
                  }`}
                >
                  <p className="text-white text-sm font-bold mb-1">{m.shortName}</p>
                  <p className="text-stone-400 text-xs">{count} guides</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
