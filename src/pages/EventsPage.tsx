import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarRange, Filter } from 'lucide-react';
import { EVENTS, EVENT_CATEGORIES, MONTHS, allCountries } from '@/data';
import { SectionHeading } from '@/components/SectionHeading';

export function EventsPage() {
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredEvents = useMemo(() => {
    return EVENTS.filter(event => {
      const monthMatch = selectedMonth === 'all' || event.month === selectedMonth;
      const countryMatch = selectedCountry === 'all' || event.countrySlug === selectedCountry;
      const categoryMatch = selectedCategory === 'All' || event.category === selectedCategory;
      return monthMatch && countryMatch && categoryMatch;
    });
  }, [selectedMonth, selectedCountry, selectedCategory]);

  return (
    <div className="bg-stone-950 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <SectionHeading
          eyebrow="Festival & Event Explorer"
          title="When the world turns celebratory"
          subtitle="Filter by month, country, or category to find the right seasonal moment for your next trip."
        />

        <div className="mb-10 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-stone-400 text-xs uppercase tracking-[0.18em] mb-3">
              <Filter className="w-3.5 h-3.5" /> Filter by month
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedMonth('all')}
                className={`px-3 py-2 rounded-full text-xs font-medium ${selectedMonth === 'all' ? 'bg-amber-400 text-stone-950' : 'bg-stone-900 text-white/60 border border-white/5'}`}
              >
                All
              </button>
              {MONTHS.map(month => (
                <button
                  key={month.month}
                  onClick={() => setSelectedMonth(month.month)}
                  className={`px-3 py-2 rounded-full text-xs font-medium ${selectedMonth === month.month ? 'bg-amber-400 text-stone-950' : 'bg-stone-900 text-white/60 border border-white/5'}`}
                >
                  {month.shortName}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:items-end">
            <label className="flex-1">
              <span className="block text-stone-400 text-[10px] uppercase tracking-[0.18em] mb-2">Country</span>
              <select
                value={selectedCountry}
                onChange={e => setSelectedCountry(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-stone-900 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-400/40"
              >
                <option value="all">All countries</option>
                {allCountries.map(country => (
                  <option key={country.id} value={country.slug}>{country.name}</option>
                ))}
              </select>
            </label>

            <label className="flex-1">
              <span className="block text-stone-400 text-[10px] uppercase tracking-[0.18em] mb-2">Category</span>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-stone-900 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-400/40"
              >
                {EVENT_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.35) }}
              className="rounded-xl overflow-hidden border border-white/5 bg-stone-900"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={event.image} alt={event.title} loading="lazy" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-amber-400 text-[10px] uppercase tracking-[0.2em]">{event.category}</p>
                  <h3 className="text-white text-xl font-semibold mt-2">{event.title}</h3>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-2 text-xs text-stone-400 mb-3">
                  <span>{event.countryName}</span>
                  <span className="inline-flex items-center gap-1"><CalendarRange className="w-3.5 h-3.5" /> {MONTHS.find(m => m.month === event.month)?.shortName}</span>
                </div>
                <p className="text-stone-300 text-sm leading-relaxed mb-4">{event.summary}</p>
                <p className="text-stone-500 text-xs">{event.location}</p>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <Link to={`/country/${event.countrySlug}`} className="text-amber-400 text-xs hover:underline inline-flex items-center gap-1">
                    View country <ArrowRight className="w-3 h-3" />
                  </Link>
                  <span className="text-stone-500 text-[10px] uppercase tracking-[0.18em]">{event.dateType}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="mt-12 rounded-lg border border-dashed border-white/10 bg-stone-900 p-10 text-center">
            <p className="text-white text-lg font-medium mb-2">No events match these filters.</p>
            <p className="text-stone-500 text-sm">Try another month, category, or country.</p>
          </div>
        )}
      </div>
    </div>
  );
}
