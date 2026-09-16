import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, MapPin, ArrowLeft, ArrowRight,
  Camera, Check, Sparkles
} from 'lucide-react';
import {
  getDestination, allCountries, getRelatedDestinations,
} from '@/data';
import type { MonthNumber } from '@/data';
import { SectionHeading } from '@/components/SectionHeading';
import { Gallery } from '@/components/Gallery';
import { WeatherCard } from '@/components/WeatherCard';
import { FestivalCard } from '@/components/FestivalCard';
import { SeasonTimeline } from '@/components/SeasonTimeline';
import { FavoriteButton } from '@/components/FavoriteButton';
import { DestinationCard } from '@/components/DestinationCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { EmptyState } from '@/components/EmptyState';
import { MONTHS } from '@/data';

export function DestinationPage() {
  const { slug } = useParams();
  const destination = slug ? getDestination(slug) : undefined;
  const [selectedMonth, setSelectedMonth] = useState<MonthNumber | null>(null);

  if (!destination) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <EmptyState
          title="Destination not found"
          message="This destination doesn't exist in our database yet. Explore other places."
        />
      </div>
    );
  }

  const country = allCountries.find(c => c.id === destination.countryId);
  const related = getRelatedDestinations(destination, 4);
  const bestMonthNames = destination.bestMonths
    .map(m => MONTHS.find(mon => mon.month === m)?.fullName)
    .filter(Boolean);

  return (
    <div className="bg-stone-950">
      {/* HERO */}
      <section className="relative h-[75vh] min-h-[500px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <motion.img
            src={destination.heroImage}
            alt={`${destination.name} - ${destination.description}`}
            className="w-full h-full object-cover"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: 'easeOut' }}
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
          <div className="mb-6">
            <Breadcrumbs items={[
              { label: 'Home', path: '/' },
              { label: country?.name || '', path: `/country/${country?.slug}` },
              { label: destination.name },
            ]} />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-start justify-between gap-4"
          >
            <div>
              <p className="text-amber-400 text-xs uppercase tracking-[0.2em] font-semibold mb-3">
                {country?.flag} {country?.name} · {destination.region}
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-4">
                {destination.name}
              </h1>
              <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-2xl">
                {destination.subtitle}
              </p>
            </div>
            <div className="hidden sm:block">
              <FavoriteButton slug={destination.slug} variant="solid" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* QUICK INFO BAR */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-6 sm:gap-10">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400/70" />
            <div>
              <p className="text-stone-500 text-[10px] uppercase tracking-wide">Best Time</p>
              <p className="text-white text-sm font-medium">{destination.bestSeasonLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400/70" />
            <div>
              <p className="text-stone-500 text-[10px] uppercase tracking-wide">Stay</p>
              <p className="text-white text-sm font-medium">{destination.duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400/70" />
            <div>
              <p className="text-stone-500 text-[10px] uppercase tracking-wide">Region</p>
              <p className="text-white text-sm font-medium">{destination.region}</p>
            </div>
          </div>
          <div className="sm:hidden">
            <FavoriteButton slug={destination.slug} variant="solid" />
          </div>
        </div>
      </section>

      {/* WHY THIS MOMENT */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-amber-400 text-xs uppercase tracking-[0.2em] font-semibold mb-4">
              Why This Moment?
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-6">
              The Moment That Makes It Special
            </h2>
            <p className="text-stone-300 text-base md:text-lg leading-relaxed">
              {destination.whyMoment}
            </p>
          </motion.div>
        </div>
      </section>

      {/* TOP EXPERIENCES */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <SectionHeading title="Top Experiences" align="left" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {destination.topExperiences.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.3) }}
                className="flex items-center gap-4 bg-stone-900 rounded-lg p-5 border border-white/5"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-400/10 text-amber-400 text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-white/80 text-sm">{exp}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SIGNATURE EXPERIENCES */}
      {destination.experiences.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <SectionHeading
              eyebrow="Signature Moments"
              title="Experiences Worth the Journey"
              align="left"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {destination.experiences.map((exp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.08, 0.3) }}
                  className="group relative rounded-lg overflow-hidden aspect-[16/11]"
                >
                  <img
                    src={exp.image}
                    alt={exp.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white font-semibold text-lg mb-2 leading-tight">{exp.title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed line-clamp-3">{exp.description}</p>
                    <div className="mt-3 flex items-center gap-1.5 text-amber-400/70 text-xs">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {exp.bestMonths.map(m => MONTHS.find(mon => mon.month === m)?.shortName).join(', ')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GALLERY */}
      {destination.gallery.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <SectionHeading
              eyebrow="See the Place"
              title="Gallery"
              subtitle="High-resolution photography of {destination.name}. Click any image to view full screen."
              align="left"
            />
            <Gallery images={destination.gallery} contextLabel={`${destination.name}, ${country?.name}`} />
          </div>
        </section>
      )}

      {/* WHEN TO GO - SEASONAL TIMELINE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="When to Visit"
            title="When Should You Go?"
            subtitle="Month-by-month guidance. Different months suit different experiences — there's no single perfect time."
            align="left"
          />
          <SeasonTimeline
            seasonalMonths={destination.seasonalMonths}
            selectedMonth={selectedMonth}
            onSelectMonth={setSelectedMonth}
          />
        </div>
      </section>

      {/* WEATHER */}
      {destination.weather.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <SectionHeading
              eyebrow="Climate"
              title="What Will the Weather Feel Like?"
              subtitle="Approximate seasonal conditions. Not a live forecast."
              align="left"
            />
            <WeatherCard weather={destination.weather} />
          </div>
        </section>
      )}

      {/* FESTIVALS */}
      {destination.festivals.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <SectionHeading
              eyebrow="Events"
              title="Festivals & Events"
              subtitle="Dates may vary annually. Confirm before planning around a specific event."
              align="left"
            />
            <FestivalCard festivals={destination.festivals} />
          </div>
        </section>
      )}

      {/* ACTIVITIES & TRAVEL STYLES */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Things to Do</h3>
            <div className="space-y-2">
              {destination.activities.map((act, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-white/70">
                  <Check className="w-4 h-4 text-amber-400/60 flex-shrink-0" />
                  {act}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Ideal For</h3>
            <div className="flex flex-wrap gap-2">
              {destination.travelStyles.map(style => (
                <span
                  key={style}
                  className="px-4 py-2 bg-stone-900 border border-white/5 rounded-full text-xs text-white/60"
                >
                  {style}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <SectionHeading
              title={`More in ${country?.name}`}
              align="left"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((dest, i) => (
                <DestinationCard key={dest.id} destination={dest} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BACK LINK */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            to={`/country/${country?.slug}`}
            className="inline-flex items-center gap-2 text-white/60 text-sm hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {country?.name}
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 text-sm hover:text-amber-400 transition-colors"
          >
            Home <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
