import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import type { Destination } from '@/data';
import { allCountries } from '@/data';
import { SmartImage } from './SmartImage';

interface Props {
  destination: Destination;
  index?: number;
}

export function ExperienceCard({ destination, index = 0 }: Props) {
  const country = allCountries.find(c => c.id === destination.countryId);
  const primaryExperience = destination.experiences[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.4) }}
      className="group relative rounded-lg overflow-hidden bg-stone-900"
    >
      <Link to={`/destination/${destination.slug}`} className="block">
        <div className="aspect-[16/9] overflow-hidden">
          <SmartImage
            src={primaryExperience?.image || destination.heroImage}
            alt={primaryExperience?.title || destination.name}
            className="w-full h-full group-hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-amber-400/80 text-xs uppercase tracking-[0.15em] mb-1.5">
            {country?.name} · {destination.name}
          </p>
          <h3 className="text-white text-lg font-semibold mb-2 leading-tight">
            {primaryExperience?.title || destination.name}
          </h3>
          <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-3">
            {primaryExperience?.description || destination.whyVisit}
          </p>
          <div className="flex items-center gap-1.5 text-white/50 text-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>{destination.bestSeasonLabel}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
