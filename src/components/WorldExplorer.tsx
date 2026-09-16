import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search } from 'lucide-react';
import { allCountries, CONTINENTS } from '@/data';
import { CountryCard } from './CountryCard';

export function WorldExplorer() {
  const [continent, setContinent] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const countries = allCountries.filter(c => {
    const matchesContinent = !continent || c.continent === continent;
    const matchesQuery = !query || c.name.toLowerCase().includes(query.toLowerCase());
    return matchesContinent && matchesQuery;
  });

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={() => setContinent(null)}
          className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
            !continent
              ? 'bg-amber-400 text-stone-950'
              : 'bg-stone-900 text-white/50 border border-white/5 hover:text-white/80'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          All
        </button>
        {CONTINENTS.map(c => {
          const count = allCountries.filter(country => country.continent === c).length;
          if (count === 0) return null;
          return (
            <button
              key={c}
              onClick={() => setContinent(c)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                continent === c
                  ? 'bg-amber-400 text-stone-950'
                  : 'bg-stone-900 text-white/50 border border-white/5 hover:text-white/80'
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div className="max-w-md mx-auto mb-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search countries..."
            className="w-full pl-11 pr-4 py-3 bg-stone-900 border border-white/5 rounded-lg text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-400/40 transition-colors text-sm"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={continent + query}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {countries.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {countries.map((c, i) => (
                <CountryCard key={c.id} country={c} index={i} />
              ))}
            </div>
          ) : (
            <p className="text-center text-stone-500 py-12 text-sm">
              No countries found. Try a different search.
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
