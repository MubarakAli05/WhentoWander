import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { allCountries, getCountryImageFallbacks } from '@/data';
import { SmartImage } from '@/components/SmartImage';
import { SectionHeading } from '@/components/SectionHeading';

export function CountriesPage() {
  return (
    <div className="bg-stone-950 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <SectionHeading
          eyebrow="Country Explorer"
          title="Discover the World"
          subtitle="From alpine climates to desert nights, each country offers a distinct seasonal story to explore."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {allCountries.map((country, index) => {
            const signature = country.destinations[0]?.name ?? 'Special landscapes';
            return (
              <motion.div
                key={country.id}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.35) }}
              >
                <Link to={`/country/${country.slug}`} className="group flex h-full flex-col rounded-xl overflow-hidden border border-white/5 bg-stone-900 transition-colors hover:border-amber-400/30">
                  <div className="relative aspect-[16/10] shrink-0 overflow-hidden">
                    <SmartImage
                      src={country.heroImage}
                      alt={country.name}
                      fallbackSources={getCountryImageFallbacks(country)}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="text-amber-400 text-xs uppercase tracking-[0.2em] font-medium">{country.continent}</p>
                      <h3 className="text-white text-xl font-semibold mt-2">{country.flag} {country.name}</h3>
                    </div>
                  </div>
                  <div className="flex min-h-[216px] flex-1 flex-col p-5">
                    <p className="text-stone-400 text-sm leading-relaxed line-clamp-3">{country.description}</p>
                    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                      <div>
                        <p className="text-stone-500 text-[10px] uppercase tracking-[0.16em]">Best time</p>
                        <p className="text-white text-sm mt-1">{country.bestMonthsLabel}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-amber-400 text-xs font-medium">
                        Explore <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                    <p className="mt-4 min-h-[32px] text-stone-500 text-xs">
                      Signature moment: <span className="text-stone-300">{signature}</span>
                    </p>
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
