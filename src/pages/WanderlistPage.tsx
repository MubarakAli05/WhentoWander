import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Compass } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { getDestination, allCountries } from '@/data';
import { SectionHeading } from '@/components/SectionHeading';
import { DestinationCard } from '@/components/DestinationCard';
import { EmptyState } from '@/components/EmptyState';

export function WanderlistPage() {
  const { favorites } = useFavorites();

  const savedDestinations = favorites
    .map(slug => getDestination(slug))
    .filter(Boolean) as NonNullable<ReturnType<typeof getDestination>>[];

  return (
    <div className="bg-stone-950 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <SectionHeading
          eyebrow="My Wanderlist"
          title="Your Saved Destinations"
          subtitle="Places you've saved to explore later. No account needed — these are stored on your device."
        />

        {savedDestinations.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {savedDestinations.map((dest, i) => (
              <DestinationCard key={dest.id} destination={dest} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Your Wanderlist is empty"
            message="Browse destinations and tap the heart icon to save places you want to visit. They'll appear here."
          />
        )}
      </div>
    </div>
  );
}
