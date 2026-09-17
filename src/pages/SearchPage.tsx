import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { searchAll, allCountries, getCountryImageFallbacks } from '@/data';
import { SectionHeading } from '@/components/SectionHeading';
import { DestinationCard } from '@/components/DestinationCard';
import { EmptyState } from '@/components/EmptyState';
import { SmartImage } from '@/components/SmartImage';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [input, setInput] = useState(query);

  useEffect(() => {
    setInput(query);
  }, [query]);

  const results = query ? searchAll(query) : { countries: [], destinations: [] };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setSearchParams({ q: input.trim() });
    }
  };

  return (
    <div className="bg-stone-950 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <SectionHeading
          eyebrow="Search"
          title="Find Your Next Journey"
          subtitle="Search by country, city, landmark, experience, or month."
        />

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Search a country, city, landmark or experience..."
              className="w-full pl-12 pr-4 py-4 bg-stone-900 border border-white/10 rounded-lg text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-400/40 transition-colors text-sm"
              autoFocus
            />
          </div>
        </form>

        {query && (
          <div>
            <p className="text-stone-400 text-sm mb-8">
              {results.countries.length + results.destinations.length} results for "{query}"
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {results.destinations.map((dest, i) => (
                    <DestinationCard key={dest.id} destination={dest} index={i} />
                  ))}
                </div>
              </div>
            )}

            {results.countries.length === 0 && results.destinations.length === 0 && (
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
