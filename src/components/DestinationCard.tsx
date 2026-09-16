import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Heart } from 'lucide-react';
import type { Destination } from '@/data';
import { allCountries } from '@/data';
import { SmartImage } from './SmartImage';
import { FavoriteButton } from './FavoriteButton';

interface Props {
  destination: Destination;
  index?: number;
}

export function DestinationCard({ destination, index = 0 }: Props) {
  const country = allCountries.find(c => c.id === destination.countryId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.4) }}
      className="group relative bg-stone-900 rounded-lg overflow-hidden"
    >
      <Link to={`/destination/${destination.slug}`} className="block">
        <div className="aspect-[4/5] overflow-hidden">
          <SmartImage
            src={destination.heroImage}
            alt={`${destination.name}, ${country?.name}`}
            className="w-full h-full"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute top-4 right-4 z-10">
          <FavoriteButton slug={destination.slug} variant="overlay" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-amber-400/80 text-xs uppercase tracking-[0.15em] mb-1.5">
            {country?.flag} {country?.name}
          </p>
          <h3 className="text-white text-xl font-semibold mb-2">{destination.name}</h3>
          <div className="flex items-center gap-1.5 text-white/60 text-xs mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Best: {destination.bestSeasonLabel}</span>
          </div>
          <p className="text-white/70 text-sm leading-relaxed line-clamp-2">{destination.description}</p>
        </div>
      </Link>
    </motion.div>
  );
}
