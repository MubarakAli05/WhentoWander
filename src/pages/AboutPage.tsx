import { motion } from 'framer-motion';
import { Compass, Calendar, MapPin, Sparkles } from 'lucide-react';
import { allCountries, allDestinations } from '@/data';

export function AboutPage() {
  const stats = [
    { icon: MapPin, label: 'Countries', value: allCountries.length },
    { icon: Sparkles, label: 'Destinations', value: allDestinations.length },
    { icon: Calendar, label: 'Months Covered', value: 12 },
    { icon: Compass, label: 'Experiences', value: 12 },
  ];

  return (
    <div className="bg-stone-950 min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-amber-400 text-xs uppercase tracking-[0.2em] font-semibold mb-4">
            About When to Wander
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Every place has a moment.
            <br />
            Find yours.
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-invert max-w-none"
        >
          <p className="text-stone-300 text-base leading-relaxed mb-6">
            When to Wander is a travel discovery platform built around a simple idea: the best travel experiences
            are defined by timing. A temple in Kyoto in November is not the same experience as in July. The Swiss
            Alps in September are a different world from January. Every destination has a moment when it becomes
            extraordinary — this site helps you find that moment.
          </p>
          <p className="text-stone-300 text-base leading-relaxed mb-6">
            We don't book hotels or sell flights. We help you answer three questions: Where should I go? When should
            I go? And why does that moment matter? From there, the journey is yours.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.08, 0.3) }}
              className="bg-stone-900 rounded-lg p-6 border border-white/5 text-center"
            >
              <stat.icon className="w-5 h-5 text-amber-400/70 mx-auto mb-3" />
              <p className="text-white text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-stone-500 text-xs uppercase tracking-wide">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border-t border-white/5 pt-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Travel Philosophy</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-amber-400/90 text-sm font-semibold uppercase tracking-wide mb-2">
                Timing is everything
              </h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                The same place can be magical or miserable depending on when you visit. We help you find the right window.
              </p>
            </div>
            <div>
              <h3 className="text-amber-400/90 text-sm font-semibold uppercase tracking-wide mb-2">
                Region matters
              </h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                A country is not a single climate. The best time for Tokyo is not the best time for Hokkaido. Our data
                accounts for regional variation where possible.
              </p>
            </div>
            <div>
              <h3 className="text-amber-400/90 text-sm font-semibold uppercase tracking-wide mb-2">
                Discovery over booking
              </h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                We exist to inspire, not to transact. The moment you know where and when, the rest falls into place.
              </p>
            </div>
            <div>
              <h3 className="text-amber-400/90 text-sm font-semibold uppercase tracking-wide mb-2">
                Data is guidance, not gospel
              </h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                All seasonal information is approximate and curated for inspiration. Always check current conditions
                before you travel.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Attribution */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border-t border-white/5 pt-12 mt-12"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Image & Data Attribution</h2>
          <p className="text-stone-500 text-xs leading-relaxed">
            All photography is sourced from Pexels and used under the Pexels License. Photographer credits are
            displayed in the gallery lightbox where available. Travel timing data is compiled from publicly available
            sources and is approximate. Climate data is seasonal guidance, not live forecasts.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
