import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MONTHS, getDestinationsByMonth } from '@/data';
import { SectionHeading } from '@/components/SectionHeading';

const monthDescriptions: Record<number, string> = {
  1: 'Winter escapes',
  2: 'Tropical escapes',
  3: 'Blossoms',
  4: 'Spring',
  5: 'Adventure',
  6: 'Alpine season',
  7: 'Beaches',
  8: 'Nature',
  9: 'Shoulder-season discoveries',
  10: 'Autumn',
  11: 'Cultural journeys',
  12: 'Winter celebrations',
};

export function MonthsPage() {
  return (
    <div className="bg-stone-950 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <SectionHeading
          eyebrow="Travel by Month"
          title="A Year of Travel"
          subtitle="Every month opens a different door. Explore where the world is at its best, any month of the year."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {MONTHS.map((m, i) => {
            const dests = getDestinationsByMonth(m.month);
            const topDest = dests[0];
            return (
              <motion.div
                key={m.month}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
              >
                <Link
                  to={`/month/${m.fullName.toLowerCase()}`}
                  className="group relative block rounded-lg overflow-hidden aspect-[16/10]"
                >
                  {topDest ? (
                    <img
                      src={topDest.heroImage}
                      alt={`${m.fullName} - ${topDest.name}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-800" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-amber-400/80 text-xs uppercase tracking-wide mb-1">
                      {monthDescriptions[m.month]}
                    </p>
                    <h3 className="text-white text-2xl font-bold mb-1">{m.fullName}</h3>
                    <p className="text-white/60 text-xs">
                      {dests.length} {dests.length === 1 ? 'destination' : 'destinations'}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-amber-400 text-xs group-hover:gap-2 transition-all">
                      Explore <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
