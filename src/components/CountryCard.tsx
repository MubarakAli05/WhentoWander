import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { getCountryImageFallbacks } from '@/data';
import type { Country } from '@/data';
import { SmartImage } from './SmartImage';

interface Props {
  country: Country;
  index?: number;
}

export function CountryCard({ country, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.4) }}
      className="group relative h-full bg-stone-900 rounded-lg overflow-hidden"
    >
      <Link to={`/country/${country.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] shrink-0 overflow-hidden">
          <SmartImage
            src={country.heroImage}
            alt={country.name}
            fallbackSources={getCountryImageFallbacks(country)}
            className="w-full h-full group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
          <h3 className="absolute bottom-4 inset-x-4 text-white text-lg font-semibold leading-snug">
            {country.flag} {country.name}
          </h3>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <p className="text-white/60 text-sm leading-relaxed line-clamp-2">{country.description}</p>
          <div className="mt-auto flex items-start gap-1.5 text-amber-400/80 text-xs">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{country.bestMonthsLabel}</span>
          </div>
          <p className="text-xs leading-relaxed text-stone-400">Best for: {(country.famousFor ?? country.cultureHighlights).slice(0, 2).join(' · ')}</p>
        </div>
      </Link>
    </motion.div>
  );
}
