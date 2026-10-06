import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { searchAll, getCountryImageFallbacks } from '@/data';
import { SectionHeading } from '@/components/SectionHeading';
import { DestinationCard } from '@/components/DestinationCard';
import { EmptyState } from '@/components/EmptyState';
import { SmartImage } from '@/components/SmartImage';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').trim();
  const [input, setInput] = useState(query);

  useEffect(() => {
    setInput(query);
  }, [query]);

  const results = searchAll(query);
  const resultCount = results.countries.length + results.destinations.length + results.events.length + results.phenomena.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(input.trim() ? { q: input.trim() } : {});
  };

  return (
    <div className="bg-stone-950 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <SectionHeading
          eyebrow="Search"
          title="Find Your Next Journey"
          subtitle="Search by country, city, landmark, experience, event, phenomenon, or month."
        />

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="search"
              aria-label="Search destinations, countries, events, and phenomena"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Search a country, city, landmark or experience..."
              className="w-full pl-12 pr-24 py-4 bg-stone-900 border border-white/10 rounded-lg text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-400/40 transition-colors text-sm"
              autoFocus
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 rounded px-3 py-2 text-sm font-medium text-amber-400 hover:bg-white/5">
              Search
            </button>
          </div>
        </form>

        {query && (
          <div>
            <p role="status" className="text-stone-400 text-sm mb-8">
              {resultCount} results for "{query}"
            </p>

            {results.countries.length > 0 && (
              <div className="mb-12">
                <h3 className="text-white/80 text-sm font-semibold uppercase tracking-wide mb-5">
                  Countries
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.countries.map((c, i) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.3) }}
                    >
                      <Link
                        to={`/country/${c.slug}`}
                        className="group flex items-center gap-4 bg-stone-900 rounded-lg p-4 border border-white/5 hover:border-amber-400/30 transition-colors"
                      >
                        <SmartImage
                          src={c.heroImage}
                          alt={c.name}
                          fallbackSources={getCountryImageFallbacks(c)}
                          className="w-16 h-16 rounded flex-shrink-0"
                          loading="lazy"
                        />
                        <div>
                          <p className="text-white font-medium text-sm mb-1">{c.flag} {c.name}</p>
                          <p className="text-stone-500 text-xs line-clamp-1">{c.description}</p>
                          <p className="text-amber-400/70 text-xs mt-1">{c.bestMonthsLabel}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {results.destinations.length > 0 && (
              <div>
                <h3 className="text-white/80 text-sm font-semibold uppercase tracking-wide mb-5">
                  Destinations
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {results.destinations.map((dest, i) => (
                    <DestinationCard key={dest.id} destination={dest} index={i} />
                  ))}
                </div>
              </div>
            )}

            {results.events.length > 0 && (
              <section className="mt-12">
                <h2 className="text-white/80 text-sm font-semibold uppercase tracking-wide mb-5">Events</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.events.map(event => (
                    <Link key={event.id} to={`/events?country=${encodeURIComponent(event.countrySlug)}&month=${event.month}`} className="group block rounded-lg overflow-hidden bg-stone-900 border border-white/5 hover:border-amber-400/30">
                      <SmartImage src={event.image} alt={event.title} className="w-full aspect-[16/10]" />
                      <div className="p-5">
                        <h3 className="text-white font-semibold mb-2">{event.title}</h3>
                        <p className="text-stone-400 text-sm mb-3">{event.summary}</p>
                        <span className="inline-flex items-center gap-1 text-amber-400 text-xs">View events in {event.countryName} <ArrowRight className="w-3 h-3" /></span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {results.phenomena.length > 0 && (
              <section className="mt-12">
                <h2 className="text-white/80 text-sm font-semibold uppercase tracking-wide mb-5">Natural phenomena</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.phenomena.map(phenomenon => (
                    <Link key={phenomenon.id} to={`/phenomena/${phenomenon.slug}`} className="group block rounded-lg overflow-hidden bg-stone-900 border border-white/5 hover:border-amber-400/30">
                      <SmartImage src={phenomenon.image} alt={phenomenon.name} className="w-full aspect-[16/10]" />
                      <div className="p-5">
                        <h3 className="text-white font-semibold mb-2">{phenomenon.name}</h3>
                        <p className="text-stone-400 text-sm mb-3">{phenomenon.summary}</p>
                        <span className="inline-flex items-center gap-1 text-amber-400 text-xs">Explore phenomenon <ArrowRight className="w-3 h-3" /></span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {resultCount === 0 && (
              <EmptyState
                title="No results found"
                message={`We couldn't find anything for "${query}". Try a different search term — a country name, a city, a month, or an experience like "beaches" or "autumn".`}
              />
            )}
          </div>
        )}

        {!query && (
          <div className="text-center py-20">
            <p className="text-stone-500 text-sm mb-6">Start typing to search...</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Japan', 'Iceland', 'September', 'Northern Lights', 'beaches', 'autumn'].map(s => (
                <button
                  key={s}
                  onClick={() => setSearchParams({ q: s })}
                  className="px-4 py-2 bg-stone-900 border border-white/5 rounded-full text-xs text-white/60 hover:text-amber-400 hover:border-amber-400/30 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
