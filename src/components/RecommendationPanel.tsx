import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { MONTHS, EXPERIENCE_CATEGORIES, getDestinationsByMonth, getDestinationsByExperience, allCountries } from '@/data';
import type { MonthNumber } from '@/data';
import { MonthSelector } from './MonthSelector';
import { SmartImage } from './SmartImage';

export function RecommendationPanel() {
  const [month, setMonth] = useState<MonthNumber>((new Date().getMonth() + 1) as MonthNumber);
  const [interest, setInterest] = useState<string | null>(null);

  const monthDests = getDestinationsByMonth(month);
  const interestDests = interest ? getDestinationsByExperience(interest) : null;
  const results = interestDests
    ? monthDests.filter(d => interestDests.some(id => id.id === d.id))
    : monthDests;

  return (
    <div>
      <div className="text-center mb-8">
        <p className="text-amber-400 text-xs uppercase tracking-[0.2em] font-semibold mb-2">
          Your Month. Your Moment.
        </p>
        <p className="text-stone-400 text-sm">
          Pick a month and what you love — we'll find your perfect match.
        </p>
      </div>

      <div className="mb-8">
        <MonthSelector selectedMonth={month} onSelectMonth={setMonth} />
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <button
          onClick={() => setInterest(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            !interest
              ? 'bg-amber-400 text-stone-950'
              : 'bg-stone-900 text-white/50 border border-white/5 hover:text-white/80'
          }`}
        >
          All
        </button>
        {EXPERIENCE_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setInterest(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              interest === cat.id
                ? 'bg-amber-400 text-stone-950'
                : 'bg-stone-900 text-white/50 border border-white/5 hover:text-white/80'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${month}-${interest}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {results.slice(0, 6).map((dest, i) => {
                const country = allCountries.find(c => c.id === dest.countryId);
                return (
                  <Link
                    key={dest.id}
                    to={`/destination/${dest.slug}`}
                    className="group relative rounded-lg overflow-hidden bg-stone-900 block"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <SmartImage
                        src={dest.heroImage}
                        alt={`${dest.name}, ${country?.name}`}
                        className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="text-amber-400/80 text-xs uppercase tracking-wide mb-1">{country?.flag} {country?.name}</p>
                      <h3 className="text-white text-lg font-semibold mb-1">{dest.name}</h3>
                      <p className="text-white/60 text-xs">{dest.bestSeasonLabel}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Sparkles className="w-8 h-8 text-stone-600 mx-auto mb-3" />
              <p className="text-stone-500 text-sm">
                No matches for {MONTHS.find(m => m.month === month)?.fullName} + {interest ? EXPERIENCE_CATEGORIES.find(c => c.id === interest)?.label : 'All'}.
                Try a different combination.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
