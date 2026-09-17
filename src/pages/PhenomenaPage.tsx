import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PHENOMENA, allCountries } from '@/data';
import { SectionHeading } from '@/components/SectionHeading';

export function PhenomenaPage() {
  return (
    <div className="bg-stone-950 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <SectionHeading
          eyebrow="Natural Phenomena"
          title="The moments that make places unforgettable"
          subtitle="Explore seasonal windows defined by weather, light, wildlife, and landscape change."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {PHENOMENA.map((phenomenon, index) => {
            const countryNames = phenomenon.countries
              .map(slug => allCountries.find(c => c.slug === slug)?.name)
              .filter(Boolean)
              .slice(0, 3)
              .join(' · ');

            return (
              <motion.div
                key={phenomenon.id}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.35) }}
              >
                <Link to={`/phenomena/${phenomenon.slug}`} className="group block rounded-xl overflow-hidden border border-white/5 bg-stone-900 transition-colors hover:border-amber-400/30">
                  <div className="relative aspect-[16/11] overflow-hidden">
                    <img
                      src={phenomenon.image}
                      alt={phenomenon.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="text-amber-400 text-[10px] uppercase tracking-[0.22em]">{phenomenon.type}</p>
                      <h3 className="text-white text-2xl font-semibold mt-2">{phenomenon.name}</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-stone-300 text-sm leading-relaxed mb-4">{phenomenon.summary}</p>
                    <div className="flex items-center justify-between text-xs text-stone-500 border-t border-white/5 pt-4">
                      <span>{PhenomenaDateLabel(phenomenon.bestMonths)}</span>
                      <span className="inline-flex items-center gap-1 text-amber-400">
                        Explore <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                    <p className="text-stone-500 text-xs mt-4">{countryNames || 'Worldwide'}</p>
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

function PhenomenaDateLabel(bestMonths: number[]) {
  const monthNames = bestMonths.map(month => {
    const match = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1];
    return match;
  });
  return monthNames.join(' · ');
}
