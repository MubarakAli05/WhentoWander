import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, Utensils, Wallet, Compass, Route, Search, MapPin, Plus, Check, ExternalLink, X } from 'lucide-react';
import type { Country } from '@/data/types';
import { filterPlaces, mapSearchUrl, planDays, safeExternalUrl, type CountryResearch, type GuidePlace, type PlaceKind } from '@/data/travelGuide';
import { TravelGuideMap } from './TravelGuideMap';
import { TravelBudget } from './TravelBudget';

const sections = [
  { id: 'stay', label: 'Where to stay', shortLabel: 'Stays', icon: BedDouble },
  { id: 'eat', label: 'Where to eat', shortLabel: 'Food', icon: Utensils },
  { id: 'budget', label: 'Travel budget', shortLabel: 'Budget', icon: Wallet },
  { id: 'do', label: 'Things to do', shortLabel: 'Explore', icon: Compass },
  { id: 'plan', label: 'Trip planning', shortLabel: 'Plan', icon: Route },
] as const;
type Section = typeof sections[number]['id'];
const kindLabels: Record<PlaceKind, string> = { stay: 'Accommodation', eat: 'Food & drink', do: 'See & do', area: 'Neighbourhood / area' };
const inputClass = 'min-h-11 w-full min-w-0 rounded-xl border border-white/15 bg-stone-950 px-3 py-2.5 text-sm text-white transition-colors hover:border-white/25 focus:border-amber-400 placeholder:text-stone-500';
const guideLoaders = import.meta.glob<CountryResearch>('../data/travelResearch/*.json', { import: 'default' });

function SourceLink({ url, children }: { url?: string; children: React.ReactNode }) {
  const safe = safeExternalUrl(url);
  return safe ? <a href={safe} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-amber-300 underline underline-offset-4 hover:text-amber-200">{children}<ExternalLink aria-hidden="true" className="h-3 w-3" /></a> : null;
}

export function CountryTravelGuide({ country }: { country: Country }) {
  const [guide, setGuide] = useState<CountryResearch | null>(null);
  const [loadError, setLoadError] = useState(false);
  const places = useMemo(() => guide?.places ?? [], [guide]);
  const [section, setSection] = useState<Section>('stay');
  const [locality, setLocality] = useState('');
  const [query, setQuery] = useState('');
  const [tier, setTier] = useState('all');
  const [limit, setLimit] = useState(12);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [days, setDays] = useState(7);
  const storageKey = `wander-guide-plan:${country.id}`;

  useEffect(() => {
    let disposed = false;
    setLoadError(false);
    const load = guideLoaders[`../data/travelResearch/${country.id}.json`];
    if (!load) {
      setLoadError(true);
      return;
    }
    load().then(result => { if (!disposed) setGuide(result); })
      .catch(() => { if (!disposed) setLoadError(true); });
    return () => { disposed = true; };
  }, [country.id]);

  useEffect(() => {
    if (!guide) return;
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
      if (Array.isArray(saved)) setSavedIds(saved.filter((id): id is string => typeof id === 'string' && places.some(place => place.id === id)));
    } catch { setStorageError(true); }
    setStorageReady(true);
  }, [storageKey, places, guide]);

  useEffect(() => {
    if (!storageReady) return;
    try { localStorage.setItem(storageKey, JSON.stringify(savedIds)); }
    catch { setStorageError(true); }
  }, [savedIds, storageKey, storageReady]);

  const localities = useMemo(() => [...new Set(places.map(place => place.locality).filter(Boolean))].sort(), [places]);
  const kind = section === 'stay' || section === 'eat' || section === 'do' ? section : 'all';
  const filtered = useMemo(() => {
    const base = filterPlaces(places, 'all', locality, query);
    return base.filter(place => (kind === 'all' || place.kind === kind || (kind === 'stay' && place.kind === 'area'))
      && (section !== 'stay' || tier === 'all' || place.tier === tier));
  }, [places, locality, query, kind, section, tier]);
  const visible = useMemo(() => filtered.slice(0, limit), [filtered, limit]);
  const active = visible.find(place => place.id === activeId);
  const saved = savedIds.map(id => places.find(place => place.id === id)).filter((place): place is GuidePlace => Boolean(place));
  const itinerary = planDays(saved, days);
  const suggestions = places.filter(place => (!locality || place.locality === locality) && place.kind === 'do').slice(0, days * 2);
  const onSelect = useCallback((id: string) => setActiveId(id), []);
  const toggleSaved = (id: string) => setSavedIds(previous => previous.includes(id) ? previous.filter(value => value !== id) : [...previous, id]);
  const resetResults = () => { setLimit(12); setActiveId(null); };
  const openSection = (next: Section) => { setSection(next); resetResults(); };
  const fallbackGuide = `https://en.wikivoyage.org/wiki/${encodeURIComponent(country.name.replace(/ /g, '_'))}`;

  const renderPlace = (place: GuidePlace, index: number) => (
    <article key={place.id} className={`flex min-w-0 flex-col rounded-xl border p-4 [overflow-wrap:anywhere] transition-colors ${activeId === place.id ? 'border-red-400 bg-red-400/5' : 'border-white/10 bg-stone-900/50 hover:border-white/25 hover:bg-stone-900'}`}>
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-red-500/15 text-[11px] font-semibold tabular-nums text-red-300">{index + 1}</span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-wider text-stone-400">{kindLabels[place.kind]}{place.tier && ` · ${place.tier}`}</p>
          <h4 className="mt-1 text-sm font-semibold leading-snug text-white">{place.name}</h4>
          <p className="mt-1 text-xs text-stone-400">{place.locality}</p>
        </div>
        <button type="button" onClick={() => toggleSaved(place.id)} aria-label={`${savedIds.includes(place.id) ? 'Remove' : 'Add'} ${place.name} ${savedIds.includes(place.id) ? 'from' : 'to'} trip`} aria-pressed={savedIds.includes(place.id)} className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors ${savedIds.includes(place.id) ? 'border-amber-400/40 bg-amber-400/15 text-amber-300' : 'border-white/15 text-stone-400 hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-300'}`}>
          {savedIds.includes(place.id) ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </button>
      </div>
      {place.address && <p className="mt-3 text-xs leading-relaxed text-stone-400">{place.address}</p>}
      <p className={`mb-4 mt-4 rounded-lg px-3 py-2.5 text-xs leading-relaxed ${place.price ? 'bg-amber-400/5 text-amber-100/90' : 'bg-white/[0.03] text-stone-400'}`}>{place.price ? `Source-listed price: ${place.price}` : 'Price not verified — check directly.'}</p>
      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-3 border-t border-white/10 pt-4">
        <SourceLink url={mapSearchUrl(place.name, place.locality, country.name)}>Find on map</SourceLink>
        <SourceLink url={place.url}>Website</SourceLink>
        <SourceLink url={place.sourceUrl}>Source</SourceLink>
      </div>
    </article>
  );

  return (
    <section id="country-travel-guide" aria-labelledby="country-travel-guide-title" className="scroll-mt-24 border-b border-white/10 bg-stone-950 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-stone-900 via-stone-900/60 to-stone-950 p-4 sm:p-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:gap-6">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-400">Explore & plan</p>
              <h2 id="country-travel-guide-title" className="mt-2 text-xl font-semibold leading-tight tracking-tight text-white [overflow-wrap:anywhere] sm:text-3xl">{country.name} travel guide</h2>
            </div>
            <button type="button" onClick={() => openSection('plan')} className="inline-flex min-h-11 items-center justify-center gap-2 self-center rounded-xl border border-amber-400/25 bg-amber-400/10 px-3 py-2 text-xs font-medium text-amber-200 transition-colors hover:bg-amber-400/20 sm:px-4 sm:text-sm"><Route aria-hidden="true" className="hidden h-4 w-4 sm:block" />My trip <span className="text-amber-400 tabular-nums">{saved.length}</span></button>
          </div>
          <p className="mt-3 max-w-xl text-xs leading-relaxed text-stone-400 sm:text-sm">Find your stay, discover local favourites and build your own itinerary.</p>
          <nav aria-label="Travel guide sections" className="mt-5 grid grid-cols-5 gap-1 border-t border-white/10 pt-4 sm:gap-2">
            {sections.map(item => <button key={item.id} type="button" aria-label={item.label} aria-pressed={section === item.id} onClick={() => openSection(item.id)} className={`flex min-h-14 min-w-0 flex-col items-center justify-center gap-1.5 rounded-xl px-1 py-2 text-[11px] font-medium transition-colors lg:min-h-11 lg:flex-row lg:gap-2 lg:px-3 lg:text-sm ${section === item.id ? 'bg-amber-400 text-stone-950 shadow-sm' : 'text-stone-400 hover:bg-white/5 hover:text-white'}`}><item.icon aria-hidden="true" className="h-4 w-4 shrink-0" /><span className="lg:hidden">{item.shortLabel}</span><span className="hidden lg:inline">{item.label}</span></button>)}
          </nav>
        </div>

        {!guide && <div role="status" className="my-5 rounded-xl border border-white/10 px-4 py-3 text-xs text-stone-400">
          {loadError ? 'Listings could not load. Budgets and existing destination ideas are still available.' : 'Loading destination listings…'}
          {loadError && <button type="button" onClick={() => window.location.reload()} className="ml-2 text-amber-300 underline">Reload page</button>}
        </div>}
        {guide && <details className="my-5 border-b border-white/10 px-1 pb-4 pt-1 text-xs leading-relaxed text-stone-400">
          <summary className="cursor-pointer text-stone-300">
            {guide?.status === 'researched' ? 'Source-backed listings' : 'Partial guide coverage'}
            <span className="ml-2 text-amber-300">Details</span>
          </summary>
          <p className="mt-3">{guide?.note || 'Detailed listings are not yet verified for this country. Existing destination ideas and external planning resources remain available.'}</p>
          <p className="mt-3">Confirm prices and opening hours with the venue. Check official travel advice and entry requirements before booking.</p>
        </details>}

        <div hidden={section !== 'budget'}><TravelBudget days={days} onDaysChange={setDays} /></div>
        {section === 'budget' ? null : section === 'plan' ? (
          <div className="space-y-6">
            <div><h3 className="text-lg font-semibold tracking-tight text-white">A little structure. Room to wander.</h3><p className="mt-2 text-sm text-stone-400">Add places with the + button. Your shortlist is saved on this device.</p></div>
            {storageError && <p role="status" className="text-sm text-amber-300">Browser storage is unavailable. This shortlist will only last for this visit.</p>}
            <div className="grid items-end gap-3 rounded-xl border border-white/10 bg-stone-900/30 p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto]">
              <label className="min-w-0 text-xs text-stone-400">Travel duration<select aria-label="Itinerary duration" className={`${inputClass} mt-2`} value={days} onChange={event => setDays(Number(event.target.value))}>{[3, 5, 7, 10, 14].map(day => <option key={day} value={day}>{day} days</option>)}</select></label>
              <label className="min-w-0 text-xs text-stone-400">Starting destination<select aria-label="Starting destination" className={`${inputClass} mt-2`} value={locality} onChange={event => setLocality(event.target.value)}><option value="">All researched locations</option>{localities.map(name => <option key={name} value={name}>{name}</option>)}</select></label>
              <button type="button" disabled={!suggestions.length} onClick={() => setSavedIds(previous => [...new Set([...previous, ...suggestions.map(place => place.id)])])} className="min-h-11 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-xs font-medium text-amber-300 hover:bg-amber-400/20 disabled:cursor-not-allowed disabled:opacity-40 sm:col-span-2 lg:col-span-1">Add suggested attractions for {days} days</button>
            </div>
            <p className="text-xs text-stone-400">Suggestions use up to two source-listed attractions per day in your chosen destination, without replacing saved places. They are starting points, not a checked or optimized route.</p>
            <div className="grid gap-4 md:grid-cols-3">
              {country.tripDurations.map(duration => <article key={duration.type} className="rounded-xl border border-white/10 bg-stone-900 p-5"><p className="text-xs text-amber-300">{duration.days}</p><h4 className="mt-2 font-semibold text-white">{duration.type}</h4><p className="mt-2 text-sm leading-relaxed text-stone-400">{duration.description}</p></article>)}
            </div>
            {!saved.length ? <div className="rounded-xl border border-dashed border-white/20 p-8 text-center"><h4 className="font-semibold text-white">Your trip starts with one place</h4><p className="mt-2 text-sm text-stone-400">Browse stays, food and experiences, then add the places you want to visit.</p><button type="button" onClick={() => openSection('do')} className="mt-4 rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-stone-950">Explore things to do</button></div> : <>
              <p className="text-xs leading-relaxed text-stone-400">This draft groups your shortlist by locality, not travel time. A saved hotel is a base, not an activity. Check distances, transfers, opening days, reservations and accessibility before committing to a route.</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{itinerary.map((dayPlaces, day) => <article key={day} className="rounded-xl border border-white/10 bg-stone-900 p-5"><h4 className="text-sm font-semibold text-amber-300">Day {day + 1}</h4>{dayPlaces.length ? <ul className="mt-3 space-y-3">{dayPlaces.map(place => <li key={place.id} className="flex items-start justify-between gap-2"><div><p className="text-sm text-white">{place.name}</p><p className="mt-1 text-xs text-stone-400">{place.locality} · {kindLabels[place.kind]}</p><SourceLink url={mapSearchUrl(place.name, place.locality, country.name)}>View location</SourceLink></div><button type="button" aria-label={`Remove ${place.name} from trip`} onClick={() => toggleSaved(place.id)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-stone-400 hover:bg-white/5 hover:text-white"><X className="h-4 w-4" /></button></li>)}</ul> : <p className="mt-3 text-sm text-stone-400">Leave room for arrival, a transfer, rest or a local discovery. Add more places to fill this day.</p>}</article>)}</div>
              <TravelGuideMap places={saved} activeId={activeId} onSelect={onSelect} />
            </>}
            <button type="button" onClick={() => openSection('budget')} className="text-sm text-amber-300 underline underline-offset-4">Compare budgets for this {days}-day trip</button>
          </div>
        ) : (
          <div className="space-y-6">
            {section === 'stay' && <div className="max-w-3xl"><h3 className="text-lg font-semibold tracking-tight text-white">A base for your adventures</h3><p className="mt-2 text-sm leading-relaxed text-stone-400">Compare areas and stays near your plans. Check transport, noise, accessibility and cancellation terms. Tiers come from sources; confirm whether prices are per room or person.</p></div>}
            {section === 'eat' && <div><h3 className="text-lg font-semibold tracking-tight text-white">Get to know a place through its food</h3><p className="mt-2 text-sm text-stone-400">Explore restaurants, cafés and local food stops. Confirm menus, dietary needs and opening hours directly; source-listed meal prices may exclude drinks and service.</p><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{country.foods.map(food => <article key={food.name} className="rounded-xl border border-amber-400/15 bg-amber-400/5 p-4"><h4 className="text-sm font-semibold text-amber-200">{food.name}</h4><p className="mt-2 text-xs leading-relaxed text-stone-400">{food.description}</p></article>)}</div></div>}
            {section === 'do' && <div><h3 className="text-lg font-semibold tracking-tight text-white">Make the journey yours</h3><p className="mt-2 text-sm leading-relaxed text-stone-400">Explore attractions and experiences by location. Reserve time-sensitive tickets directly, check seasonal access and allow time between stops.</p><div className="mt-4 flex flex-wrap gap-2">{(country.famousFor ?? country.cultureHighlights).map(item => <span key={item} className="rounded-full border border-white/10 px-3 py-2 text-xs text-stone-300">{item}</span>)}</div></div>}

            <div className={`grid items-end gap-3 rounded-xl border border-white/10 bg-stone-900/30 p-3 sm:p-4 ${section === 'stay' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'}`}>
              <label className="min-w-0 text-xs font-medium text-stone-400">Destination<select aria-label="Destination" className={`${inputClass} mt-2`} value={locality} onChange={event => { setLocality(event.target.value); resetResults(); }}><option value="">All researched locations</option>{localities.map(name => <option key={name} value={name}>{name}</option>)}</select></label>
              <label className="text-xs text-stone-400">Search places<div className="relative mt-2"><Search className="absolute left-3 top-3.5 h-4 w-4" /><input type="search" value={query} onChange={event => { setQuery(event.target.value); resetResults(); }} className={`${inputClass} pl-10`} placeholder="Name, neighbourhood or address" /></div></label>
              {section === 'stay' && <label className="text-xs text-stone-400">Accommodation style<select aria-label="Accommodation style" className={`${inputClass} mt-2`} value={tier} onChange={event => { setTier(event.target.value); resetResults(); }}><option value="all">All stays & areas</option><option value="mid-range">Mid-range (source-labelled)</option><option value="premium">Premium (source-labelled)</option></select></label>}
            </div>
            {guide && <div className="flex min-h-11 flex-wrap items-center justify-between gap-2">
              <p role="status" className="text-xs text-stone-400"><span className="font-semibold tabular-nums text-stone-200">{visible.length}</span> of {filtered.length} matching places</p>
              {visible.length > 0 && (query || locality || (section === 'stay' && tier !== 'all')) && <button type="button" onClick={() => { setQuery(''); setLocality(''); setTier('all'); resetResults(); }} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-xs text-amber-300 hover:bg-white/5"><X aria-hidden="true" className="h-3.5 w-3.5" />Clear filters</button>}
            </div>}
            {guide && <div className={`grid gap-3 ${visible.length < 3 ? 'items-start' : ''} ${visible.length > 1 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
              <aside aria-label="Map and selected place" className={`min-w-0 self-start space-y-3 lg:row-start-1 ${visible.length > 1 ? 'sm:col-span-2 lg:col-span-1 lg:col-start-3' : 'lg:col-start-2'} ${visible.length > 2 ? 'lg:row-span-2' : ''}`}>
                <TravelGuideMap places={visible} activeId={activeId} onSelect={onSelect} />
                {active && <div role="status" className="rounded-xl border border-red-400/30 bg-red-400/5 p-4 [overflow-wrap:anywhere]"><p className="text-sm font-semibold text-white"><MapPin className="mr-2 inline h-4 w-4 text-red-400" />{active.name} · {active.locality}</p><div className="mt-2 flex flex-wrap items-center gap-4"><SourceLink url={mapSearchUrl(active.name, active.locality, country.name)}>Find on map</SourceLink><button type="button" onClick={() => toggleSaved(active.id)} className="min-h-11 text-xs text-amber-300 underline">{savedIds.includes(active.id) ? 'Remove from trip' : 'Add to trip'}</button></div></div>}
              </aside>
              {visible.length ? visible.map(renderPlace) : <div className="min-w-0 rounded-2xl border border-dashed border-white/15 bg-stone-900/30 p-6"><h4 className="text-sm font-semibold text-white">No sourced listings for this selection yet</h4><p className="mt-2 text-sm leading-relaxed text-stone-400">Try another destination or clear your filters. Missing prices, categories and coordinates are not invented. External guides can help you continue researching.</p><button type="button" onClick={() => { setQuery(''); setLocality(''); setTier('all'); resetResults(); }} className="mt-3 min-h-11 text-sm text-amber-300 underline">Clear filters</button><div className="mt-4"><SourceLink url={fallbackGuide}>Continue with a country guide</SourceLink></div></div>}
            </div>}
            {guide && filtered.length > limit && <button type="button" onClick={() => setLimit(value => value + 12)} className="min-h-11 w-full rounded-xl border border-white/15 px-5 py-3 text-sm font-medium text-stone-300 transition-colors hover:border-amber-400/30 hover:bg-white/5">Show more places</button>}
            {country.destinations.length > 0 && <details className="rounded-xl border border-white/10 p-5"><summary className="cursor-pointer text-sm font-semibold text-white">More destination ideas in {country.name}</summary><div className="mt-4 grid gap-4 sm:grid-cols-2">{country.destinations.map(destination => <article key={destination.id}><Link to={`/destination/${destination.slug}`} className="text-sm font-semibold text-amber-300 underline underline-offset-4">{destination.name}</Link><p className="mt-2 text-xs leading-relaxed text-stone-400">{destination.topExperiences.slice(0, 3).join(' · ') || destination.description}</p><p className="mt-2 text-xs text-stone-500">{destination.duration} · {destination.bestSeasonLabel}</p></article>)}</div></details>}
          </div>
        )}

        <details className="mt-8 rounded-xl border border-white/10 p-5">
          <summary className="cursor-pointer text-sm font-medium text-stone-300">Sources & planning essentials</summary>
          <p className="mt-3 text-xs leading-relaxed text-stone-400">Local currency: {country.currency}. Recommended trip length: {country.recommendedDuration}. Seasonal window: {country.bestMonthsLabel}. Pack for regional conditions, arrange insurance and check local transport, emergency contacts and entry rules. Listing facts are from the linked public guides; a retrieval date is not a guarantee that a venue or price is current.</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">{guide?.sources.map(source => <li key={source.url}><SourceLink url={source.url}>{source.title}</SourceLink><span className="mt-1 block text-[11px] text-stone-500">Retrieved {source.checkedAt.slice(0, 10)}</span></li>)}</ul>
          <div className="mt-4 flex flex-wrap gap-4"><SourceLink url="https://www.gov.uk/foreign-travel-advice">Official travel advice</SourceLink><SourceLink url="https://www.openstreetmap.org/copyright">Map attribution</SourceLink><SourceLink url="https://en.wikivoyage.org/wiki/Wikivoyage:Copyleft">Wikivoyage contributors & licensing</SourceLink></div>
        </details>
      </div>
    </section>
  );
}
