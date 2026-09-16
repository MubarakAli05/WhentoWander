import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { EXPERIENCE_CATEGORIES, getDestinationsByExperience } from '@/data';
import { SectionHeading } from '@/components/SectionHeading';
import { SmartImage } from '@/components/SmartImage';

export function ExperiencesPage() {
  return (
    <div className="bg-stone-950 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <SectionHeading
          eyebrow="Explore by Experience"
          title="What Kind of Moment Are You Looking For?"
          subtitle="Mountains, beaches, northern lights, ancient cities — find the experience that calls to you."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {EXPERIENCE_CATEGORIES.map((cat, i) => {
            const dests = getDestinationsByExperience(cat.id);
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
              >
                <Link
                  to={`/experience/${cat.id}`}
                  className="group relative block rounded-lg overflow-hidden aspect-[16/11]"
                >
                  <SmartImage
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white text-xl font-semibold mb-1">{cat.label}</h3>
                    <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-3">{cat.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400/70 text-xs">{dests.length} destinations</span>
                      <span className="flex items-center gap-1 text-amber-400 text-xs group-hover:gap-2 transition-all">
                        Explore <ArrowRight className="w-3 h-3" />
                      </span>
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
