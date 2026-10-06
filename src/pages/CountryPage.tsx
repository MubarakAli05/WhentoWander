import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Coins, Languages, Calendar, Clock,
  BookOpen, Camera, ArrowDown
} from 'lucide-react';
import {
  getCountry, allCountries, getPhenomenaByCountry,
  getCountryImageConfig, getCountryImageFallbacks,
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
import { Gallery } from '@/components/Gallery';
import { PhotoAttribution } from '@/components/DiscoveryHero';
import { getPhenomenonPhoto } from '@/data/seasonalDiscovery';

export function CountryPage() {
  const { slug } = useParams();
  const country = slug ? getCountry(slug) : undefined;
  const [selectedMonth, setSelectedMonth] = useState<MonthNumber | null>(null);

  useEffect(() => setSelectedMonth(null), [slug]);

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

  const phenomena = getPhenomenaByCountry(country.id);
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
          <motion.div
            className="w-full h-full"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: 'easeOut' }}
          >
            {(() => {
              const image = getCountryImageConfig(country);
              return (
                <SmartImage
                  src={image.primary}
                  alt={`${country.name} - ${country.description}`}
                  fallbackSources={getCountryImageFallbacks(country)}
                  className="w-full h-full"
                  loading="eager"
                />
              );
            })()}
          </motion.div>
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
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#country-gallery" className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-300">
                <Camera className="h-4 w-4" /> Explore the gallery
              </a>
              <a href="#when-to-visit" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/20 px-5 py-3 text-sm text-white transition-colors hover:bg-white/10">
                <ArrowDown className="h-4 w-4" /> Find your season
              </a>
            </div>
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

      <section id="country-gallery" className="scroll-mt-24 border-b border-white/5 px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="A Closer Look"
            title={`${country.name}, in Pictures`}
            subtitle="Country-specific photography with source credits. Open a photo for its original resolution; 4K badges appear only on qualifying sources."
            align="left"
          />
          <Gallery key={country.id} images={country.gallery ?? []} contextLabel={country.name} />
        </div>
      </section>

      {/* COUNTRY DISCOVERY NOTES */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <SectionHeading eyebrow="Known For" title="Why Wander Here?" align="left" />
            <div className="flex flex-wrap gap-2">
              {(country.famousFor ?? country.cultureHighlights).map(item => (
                <span key={item} className="px-3 py-2 bg-stone-900 border border-white/5 rounded-full text-xs text-white/70">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-amber-400 text-xs uppercase tracking-[0.2em] font-semibold mb-3">Interests</p>
            <div className="flex flex-wrap gap-2">
              {(country.interests ?? country.travelStyles).map(item => (
                <span key={item} className="px-3 py-2 bg-stone-900 border border-white/5 rounded-full text-xs text-white/70">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <div>
              <p className="text-amber-400 text-xs uppercase tracking-[0.2em] font-semibold mb-2">Best time</p>
              <p className="text-white/80 text-sm leading-relaxed">{country.bestMonthsLabel}</p>
            </div>
            <div>
              <p className="text-amber-400 text-xs uppercase tracking-[0.2em] font-semibold mb-2">Consider avoiding</p>
              <p className="text-white/60 text-sm leading-relaxed">{country.avoid}</p>
            </div>
            <div>
              <p className="text-amber-400 text-xs uppercase tracking-[0.2em] font-semibold mb-2">Special highlight</p>
              <p className="text-white/80 text-sm leading-relaxed">{country.specialHighlight}</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHEN SHOULD YOU GO */}
      <section id="when-to-visit" className="scroll-mt-24 py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="When to Visit"
            title="When Should You Go?"
            subtitle="Seasonal guidance, not a safety recommendation. Climate varies by region; check current official travel advisories, entry rules and local access before booking."
            align="left"
          />
          <SeasonTimeline
            seasonalMonths={country.seasonalMonths}
            selectedMonth={selectedMonth}
            onSelectMonth={setSelectedMonth}
          />
        </div>
      </section>

      {phenomena.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <SectionHeading
              eyebrow="Special Moments"
              title="What Makes This Season Distinct"
              subtitle="Natural windows — light, bloom, wildlife, weather — that give a reason to come now rather than later."
              align="left"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {phenomena.map(item => {
                const photo = getPhenomenonPhoto(item);
                return (
                  <article key={item.id} className="group rounded-lg overflow-hidden border border-white/5 bg-stone-900 hover:border-amber-400/30 transition-colors">
                    <Link to={`/phenomena/${item.slug}`} className="block focus-visible:outline focus-visible:outline-amber-300">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <SmartImage src={photo.image.url} alt={photo.image.alt} loading="lazy" className="w-full h-full group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <p className="absolute bottom-3 left-4 right-4 text-white font-semibold">{item.name}</p>
                      </div>
                      <div className="p-4">
                        <p className="text-stone-400 text-sm leading-relaxed">{item.summary}</p>
                      </div>
                    </Link>
                    <div className="px-4 pb-4">
                      <p className="mb-2 text-xs leading-relaxed text-stone-400">{photo.label}</p>
                      <PhotoAttribution image={photo.image} />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* WEATHER */}
      {country.weather.length > 0 && <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Climate"
            title="What Will the Weather Feel Like?"
            subtitle="Approximate seasonal conditions for planning. Not live forecasts — always check closer to your trip."
            align="left"
          />
          <WeatherCard weather={country.weather} />
        </div>
      </section>}

      {/* MUST EXPERIENCE - DESTINATIONS */}
      {country.destinations.length > 0 && <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
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
      </section>}

      {/* TRIP DURATIONS */}
      {country.tripDurations.length > 0 && <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-white/5">
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
      </section>}

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
      {country.foods.length > 0 && <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Food & Drink"
            title="Taste the Place"
            subtitle={`Iconic flavors that define ${country.name}'s culinary identity.`}
            align="left"
          />
          <FoodCard foods={country.foods} />
        </div>
      </section>}

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
            {allCountries.filter(c => c.slug !== country.slug).slice(0, 4).map(c => (
              <Link
                key={c.id}
                to={`/country/${c.slug}`}
                className="group relative block rounded-lg overflow-hidden aspect-square"
              >
                <SmartImage
                  src={c.heroImage}
                  alt={c.name}
                  fallbackSources={getCountryImageFallbacks(c)}
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
