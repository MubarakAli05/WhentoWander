import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { EXPERIENCE_CATEGORIES, getDestinationsByExperience } from '@/data';
import { SectionHeading } from '@/components/SectionHeading';
import { DestinationGrid } from '@/components/DestinationGrid';
import { SmartImage } from '@/components/SmartImage';

export function ExperiencePage() {
  const { experienceId } = useParams();
  const category = EXPERIENCE_CATEGORIES.find(c => c.id === experienceId);

  if (!category) {
    return (
      <div className="bg-stone-950 min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-xl font-semibold mb-2">Experience not found</h2>
          <Link to="/experiences" className="text-amber-400 text-sm hover:underline">
            Browse all experiences
          </Link>
        </div>
      </div>
    );
  }

  const dests = getDestinationsByExperience(category.id);

  return (
    <div className="bg-stone-950 min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <motion.img
            src={category.image}
            alt={category.label}
            className="w-full h-full object-cover"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: 'easeOut' }}
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-black/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12">
          <Link to="/experiences" className="inline-flex items-center gap-2 text-white/60 text-sm hover:text-amber-400 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            All Experiences
          </Link>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-3">
            {category.label}
          </h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-2xl">{category.description}</p>
        </div>
      </section>

      {/* Destinations */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-white/80 text-sm font-semibold uppercase tracking-wide mb-6">
            {dests.length} {dests.length === 1 ? 'Destination' : 'Destinations'}
          </h2>
          <DestinationGrid destinations={dests} />
        </div>
      </section>
    </div>
  );
}
