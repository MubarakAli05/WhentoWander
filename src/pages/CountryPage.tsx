import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Building2, Coins, Languages, Calendar, Clock,
  ArrowRight, Utensils, BookOpen, Sparkles
} from 'lucide-react';
import {
  getCountry, allCountries, MONTHS, getMonthInfo,
} from '@/data';
import type { MonthNumber } from '@/data';
import { SectionHeading } from '@/components/SectionHeading';
import { SeasonTimeline } from '@/components/SeasonTimeline';
import { WeatherCard } from '@/components/WeatherCard';
import { FestivalCard } from '@/components/FestivalCard';
import { FoodCard } from '@/components/FoodCard';
import { DestinationCard } from '@/components/DestinationCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SmartImage } from '@/components/SmartImage';
import { EmptyState } from '@/components/EmptyState';

export function CountryPage() {
  const { slug } = useParams();
  const country = slug ? getCountry(slug) : undefined;
  const [selectedMonth, setSelectedMonth] = useState<MonthNumber | null>(null);

  if (!country) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <EmptyState
          title="Country not found"
          message="This country doesn't exist in our database yet. Explore other destinations."
        />
      </div>
    );
  }

  const facts = [
    { icon: MapPin, label: 'Capital', value: country.capital },
    { icon: Coins, label: 'Currency', value: country.currency },
    { icon: Languages, label: 'Language', value: country.language },
    { icon: Calendar, label: 'Best Time', value: country.bestMonthsLabel },
    { icon: Clock, label: 'Recommended', value: country.recommendedDuration },
  ];

  return (
    <div className="bg-stone-950">
      {/* HERO */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <motion.img
            src={country.heroImage}
            alt={`${country.name} - ${country.description}`}
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
              { label: 'World', path: '/world' },
              { label: country.name },
            ]} />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-amber-400 text-xs uppercase tracking-[0.2em] font-semibold mb-3">
              {country.continent}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-4">
              {country.flag} {country.name}
            </h1>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-2xl">
              {country.poetLine}
            </p>
          </motion.div>
        </div>
      </section>

      {/* QUICK FACTS */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {facts.map((fact, i) => (
              <motion.div
                key={fact.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.3) }}
                className="bg-stone-900 rounded-lg p-4 border border-white/5"
              >
                <fact.icon className="w-4 h-4 text-amber-400/70 mb-2" />
                <p className="text-stone-500 text-[10px] uppercase tracking-wide mb-1">{fact.label}</p>
                <p className="text-white text-sm font-medium leading-snug">{fact.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHEN SHOULD YOU GO */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="When to Visit"
            title="When Should You Go?"
            subtitle="Climate varies by region. These ratings are general guidance for most travelers — specific experiences may have different optimal windows."
            align="left"
          />
          <SeasonTimeline
            seasonalMonths={country.seasonalMonths}
            selectedMonth={selectedMonth}
            onSelectMonth={setSelectedMonth}
          />
        </div>
      </section>

      {/* WEATHER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Climate"
            title="What Will the Weather Feel Like?"
            subtitle="Approximate seasonal conditions for planning. Not live forecasts — always check closer to your trip."
            align="left"
          />
          <WeatherCard weather={country.weather} />
        </div>
      </section>

      {/* MUST EXPERIENCE - DESTINATIONS */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Must Experience"
            title="Signature Destinations"
            subtitle={`The places in ${country.name} that define a journey — and the moments that make them unforgettable.`}
            align="left"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {country.destinations.map((dest, i) => (
              <DestinationCard key={dest.id} destination={dest} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* TRIP DURATIONS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Trip Planning"
            title="How Long Should I Stay?"
            align="left"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {country.tripDurations.map((trip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.08, 0.3) }}
                className="bg-stone-900 rounded-lg p-6 border border-white/5"
              >
                <h4 className="text-white font-semibold text-base mb-1">{trip.type}</h4>
                <p className="text-amber-400/80 text-sm mb-3">{trip.days}</p>
                <p className="text-stone-400 text-sm leading-relaxed">{trip.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FESTIVALS */}
      {country.festivals.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <SectionHeading
              eyebrow="Events"
              title="Festivals & Events"
              subtitle="Dates may vary annually — confirm before planning around a specific festival."
              align="left"
            />
            <FestivalCard festivals={country.festivals} />
          </div>
        </section>
      )}

      {/* TASTE THE PLACE */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Food & Drink"
            title="Taste the Place"
            subtitle={`Iconic flavors that define ${country.name}'s culinary identity.`}
            align="left"
          />
          <FoodCard foods={country.foods} />
        </div>
      </section>

      {/* UNDERSTAND THE PLACE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Culture & Heritage"
            title="Understand the Place"
            align="left"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {country.cultureHighlights.map((highlight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.3) }}
                className="flex items-start gap-3 bg-stone-900 rounded-lg p-5 border border-white/5"
              >
                <BookOpen className="w-4 h-4 text-amber-400/60 mt-0.5 flex-shrink-0" />
                <p className="text-white/80 text-sm leading-relaxed">{highlight}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TRAVEL STYLES */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-white/80 text-sm font-semibold mb-4">Ideal for</h3>
          <div className="flex flex-wrap gap-2">
            {country.travelStyles.map(style => (
              <span
                key={style}
                className="px-4 py-2 bg-stone-900 border border-white/5 rounded-full text-xs text-white/60"
              >
                {style}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* MORE COUNTRIES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <SectionHeading title="Keep Exploring" align="center" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {allCountries.filter(c => c.slug !== country.slug).slice(0, 4).map((c, i) => (
              <Link
                key={c.id}
                to={`/country/${c.slug}`}
                className="group relative block rounded-lg overflow-hidden aspect-square"
              >
                <SmartImage
                  src={c.heroImage}
                  alt={c.name}
                  className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-semibold text-sm">{c.flag} {c.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
