import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import {
  MONTHS, getMonthInfo, getDestinationsByMonth, getCountriesByMonth, allCountries, getCountryImageFallbacks,
} from '@/data';
import type { MonthNumber } from '@/data';
import { SectionHeading } from '@/components/SectionHeading';
import { MonthSelector } from '@/components/MonthSelector';
import { DestinationCard } from '@/components/DestinationCard';
import { EmptyState } from '@/components/EmptyState';
import { SmartImage } from '@/components/SmartImage';

const monthDescriptions: Record<number, string> = {
  1: 'Winter escapes — snow festivals, aurora nights, and cozy cities.',
  2: 'Carnival season, tropical warmth, and last-chance aurora.',
  3: 'First blossoms, warming days, and the world waking up.',
  4: 'Spring in full bloom — cherry blossoms, tulips, and perfect temperatures.',
  5: 'Adventure season begins — wildflowers, waterfalls, and long days.',
  6: 'Alpine season opens — mountain passes, midnight sun, and festival nights.',
  7: 'Peak summer — beaches, islands, and long warm days.',
  8: 'Nature at its fullest — wildlife, festivals, and golden evenings.',
  9: 'Shoulder-season gold — fewer crowds, perfect weather, harvest time.',
  10: 'Autumn colors, clear skies, and the world at its most photogenic.',
  11: 'Cultural journeys — museums, food, and cities without the crowds.',
  12: 'Winter celebrations — Christmas markets, aurora, and festive streets.',
};

export function MonthPage() {
  const { month: monthSlug } = useParams();
  const monthFromUrl = MONTHS.find(m => m.fullName.toLowerCase() === monthSlug?.toLowerCase());
  const [selectedMonth, setSelectedMonth] = useState<MonthNumber>(
    (monthFromUrl?.month || new Date().getMonth() + 1) as MonthNumber
  );

  const monthInfo = getMonthInfo(selectedMonth);
  const dests = getDestinationsByMonth(selectedMonth);
  const countries = getCountriesByMonth(selectedMonth);

  return (
    <div className="bg-stone-950 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <SectionHeading
          eyebrow="Travel by Month"
          title={`${monthInfo?.fullName || 'Month'}`}
          subtitle={monthDescriptions[selectedMonth]}
        />

        <div className="mb-12">
          <MonthSelector selectedMonth={selectedMonth} onSelectMonth={setSelectedMonth} />
        </div>

        {/* Recommended Countries */}
        {countries.length > 0 && (
          <div className="mb-16">
            <h3 className="text-white/80 text-sm font-semibold uppercase tracking-wide mb-5">
              Recommended Countries
            </h3>
            <div className="flex flex-wrap gap-3">
              {countries.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
                >
                  <Link
                    to={`/country/${c.slug}`}
                    className="group flex items-center gap-3 bg-stone-900 rounded-full pl-2 pr-5 py-2 border border-white/5 hover:border-amber-400/30 transition-colors"
                  >
                    <SmartImage
                      src={c.heroImage}
                      alt={c.name}
                      fallbackSources={getCountryImageFallbacks(c)}
                      className="w-8 h-8 rounded-full"
                      loading="lazy"
                    />
                    <span className="text-white/80 text-sm group-hover:text-amber-400 transition-colors">
                      {c.flag} {c.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Destinations */}
        <div>
          <h3 className="text-white/80 text-sm font-semibold uppercase tracking-wide mb-5">
            {dests.length} {dests.length === 1 ? 'Destination' : 'Destinations'} at Their Best
          </h3>
          {dests.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {dests.map((dest, i) => (
                <DestinationCard key={dest.id} destination={dest} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No destinations yet"
              message={`We're still building our database for ${monthInfo?.fullName}. Check back soon or explore other months.`}
            />
          )}
        </div>

        {/* Year overview */}
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
                  to={`/month/${m.fullName.toLowerCase()}`}
                  className={`p-4 rounded-lg border text-center transition-all ${
                    m.month === selectedMonth
                      ? 'border-amber-400 bg-stone-800'
                      : 'border-white/5 bg-stone-900 hover:border-white/15'
                  }`}
                >
                  <p className="text-white text-sm font-bold mb-1">{m.shortName}</p>
                  <p className="text-stone-500 text-xs">{count}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
