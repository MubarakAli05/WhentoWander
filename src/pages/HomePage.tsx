import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Search, ArrowRight, ChevronDown, Calendar, Sparkles, Globe } from 'lucide-react';
import {
  allCountries,
  allDestinations,
  getCurrentMonth,
  getDestinationsByMonth,
  getMonthInfo,
  MONTHS,
  EXPERIENCE_CATEGORIES,
  getCountriesByMonth,
  getCountryImageFallbacks,
} from '@/data';
import { SectionHeading } from '@/components/SectionHeading';
import { DestinationCard } from '@/components/DestinationCard';
import { RecommendationPanel } from '@/components/RecommendationPanel';
import { SmartImage } from '@/components/SmartImage';
import { PhotoAttribution } from '@/components/DiscoveryHero';
import { TravelPlanningGuide, TravelPlanningFaq } from '@/components/TravelPlanningGuide';
import { getMonthColor, getRegionColor, getSeasonColor } from '@/data/theme';

const heroSuggestions = ['Japan', 'Switzerland', 'Iceland', 'Türkiye', 'New Zealand'];

export function HomePage() {
  const currentMonth = getCurrentMonth();
  const monthInfo = getMonthInfo(currentMonth);
  const monthDests = getDestinationsByMonth(currentMonth).slice(0, 4);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const reduceMotion = useReducedMotion();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const scrollToMonths = () => {
    document.getElementById('travel-by-month')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative max-w-7xl mx-auto grid lg:grid-cols-2 items-center gap-12 px-4 sm:px-6 lg:px-8 pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="relative z-10 text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-amber-400 text-xs sm:text-sm uppercase tracking-[0.3em] font-semibold mb-6"
          >
            When to Wander
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight mb-6"
          >
            Find the best time
            <br />
            <span className="text-amber-400 italic font-normal">to visit.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-white/70 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
          >
            Compare seasonal travel guides for {allCountries.length} countries. Choose where to go by month,
            regional weather patterns, festivals and the experiences you love.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            onSubmit={handleSearch}
            className="max-w-xl mx-auto lg:mx-0 mb-6"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search a country, city, landmark or experience..."
                className="w-full pl-12 pr-32 py-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-full text-white placeholder:text-white/50 focus:outline-none focus:border-amber-400/50 transition-colors text-sm"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-amber-400 text-stone-950 text-xs font-semibold rounded-full hover:bg-amber-300 transition-colors"
              >
                Search
              </button>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8"
          >
            <span className="text-white/40 text-xs self-center mr-1">Try:</span>
            {heroSuggestions.map(s => (
              <button
                key={s}
                onClick={() => navigate(`/search?q=${encodeURIComponent(s)}`)}
                className="px-3 py-1.5 text-xs text-white/70 border border-white/15 rounded-full hover:bg-white/10 hover:text-white transition-colors"
              >
                {s}
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 justify-center lg:justify-start"
          >
            <Link
              to="/world"
              className="px-6 py-3.5 bg-cocoa text-cream text-sm font-semibold rounded-full hover:bg-cocoa/90 transition-colors flex items-center justify-center gap-2"
            >
              Explore the World <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={scrollToMonths}
              className="px-8 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold rounded-full hover:bg-white/15 transition-colors flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Where should I go this month?
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 gap-4 w-full max-w-xl mx-auto"
          aria-label="Travel inspiration in seasonal colours"
        >
          <Link to="/country/japan" className={`group col-span-2 block rounded-[2rem] border p-3 pb-4 ${getSeasonColor('spring')}`}>
            <SmartImage
              src="https://images.pexels.com/photos/16226231/pexels-photo-16226231.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt="Cherry blossoms at a Japanese temple in spring"
              className="h-64 sm:h-80 rounded-[1.4rem]"
              loading="eager"
              fetchPriority="high"
            />
            <div className="flex items-center justify-between px-3 pt-4 text-cocoa">
              <div>
                <span className="font-serif text-xl italic">Japan in bloom</span>
                <p className="mt-1 text-xs text-cocoa">Spring · Asia</p>
              </div>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
          {[
            { slug: 'india', imageIndex: 2, label: 'Architectural discoveries' },
            { slug: 'iceland', imageIndex: 0, label: 'Northern landscapes' },
          ].map(({ slug, imageIndex, label }) => {
            const country = allCountries.find(item => item.slug === slug);
            const photo = country?.gallery?.[imageIndex];
            if (!country || !photo) return null;
            return (
              <div key={slug} className={`group rounded-3xl border p-2.5 pb-4 ${getRegionColor(country.continent)}`}>
                <Link to={`/country/${slug}`} className="block">
                  <SmartImage src={photo.url} fallbackSources={getCountryImageFallbacks(country)} alt={photo.alt} className="h-32 sm:h-40 rounded-2xl" loading="eager" />
                  <p className="px-2 pt-3 font-serif text-lg text-cocoa">{country.name}</p>
                  <p className="px-2 pt-1 text-[11px] text-cocoa">{label} · {country.continent}</p>
                </Link>
                <PhotoAttribution image={photo} className="px-2 pt-2" />
              </div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-white/40 animate-bounce" />
        </motion.div>
      </section>

      <TravelPlanningGuide />

      {/* WHERE TO GO THIS MONTH */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-stone-950">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow={`This month: ${monthInfo?.fullName}`}
            title="Where to Go This Month"
            subtitle="Destinations at their best right now, with ideal weather and unforgettable experiences."
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {monthDests.map((dest, i) => (
              <DestinationCard key={dest.id} destination={dest} index={i} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to={`/month/${monthInfo?.fullName.toLowerCase()}`}
              className="inline-flex items-center gap-2 text-amber-400 text-sm font-medium hover:gap-3 transition-all"
            >
              See all {monthInfo?.fullName} destinations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* RECOMMENDATION ENGINE */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-stone-900">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Your Month. Your Moment."
            title="Where Should I Go Now?"
            subtitle="Tell us when you can travel and what you love — we'll match you with the perfect destination."
          />
          <RecommendationPanel />
        </div>
      </section>

      {/* TRAVEL BY MONTH */}
      <section id="travel-by-month" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-stone-950">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Travel by Month"
            title="A Year of Travel"
            subtitle="Every month opens a different door. Discover where the world is at its best, month by month."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {MONTHS.map((m, i) => {
              const dests = getDestinationsByMonth(m.month);
              const countries = getCountriesByMonth(m.month);
              return (
                <motion.div
                  key={m.month}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
                >
                  <Link
                    to={`/month/${m.fullName.toLowerCase()}`}
                    className={`group block rounded-2xl p-5 border hover:ring-1 hover:ring-cocoa/40 transition-all ${getMonthColor(m.month)}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-bold text-lg">{m.shortName}</span>
                      <span className="text-stone-500 text-xs">{countries.length} countries</span>
                    </div>
                    <p className="text-stone-400 text-xs leading-relaxed line-clamp-2">
                      {dests[0] ? `${dests[0].name}, ${allCountries.find(c => c.id === dests[0].countryId)?.name}` : 'Coming soon'}
                      {dests[1] ? ` & more` : ''}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-cocoa text-xs transition-colors">
                      Explore <ArrowRight className="w-3 h-3" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EXPERIENCES */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-stone-900">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Explore by Experience"
            title="What Kind of Moment Are You Looking For?"
            subtitle="Mountains, beaches, northern lights, ancient cities — find the experience that calls to you."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {EXPERIENCE_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
              >
                <Link
                  to={`/experience/${cat.id}`}
                  className="photo-surface group relative block rounded-3xl overflow-hidden aspect-square"
                >
                  <SmartImage
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-base">{cat.label}</h3>
                    <p className="text-white/60 text-xs mt-1 line-clamp-1">{cat.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WORLD EXPLORER PREVIEW */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-stone-950">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Explore the World"
            title="Discover by Continent"
            subtitle="From the Alps to the Andamane, every continent holds destinations worth timing right."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {allCountries.slice(0, 6).map((country, i) => (
              <motion.div
                key={country.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.3) }}
              >
                <Link
                  to={`/country/${country.slug}`}
                  className="photo-surface group relative block rounded-3xl overflow-hidden aspect-[16/10]"
                >
                  <SmartImage
                    src={country.heroImage}
                    alt={country.name}
                    fallbackSources={getCountryImageFallbacks(country)}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white text-xl font-semibold mb-1">{country.flag} {country.name}</h3>
                    <p className="text-white/60 text-sm line-clamp-1">{country.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/world"
              className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 border border-white/10 text-white text-sm font-semibold rounded-full hover:border-amber-400/40 transition-colors"
            >
              <Globe className="w-4 h-4" />
              See All Countries
            </Link>
          </div>
        </div>
      </section>

      {/* SIGNATURE EXPERIENCES PREVIEW */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-stone-900">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Signature Experiences"
            title="Moments Worth Traveling For"
            subtitle="Hot air balloons at dawn, aurora at midnight, cherry blossoms at a temple gate — these are the moments that define a journey."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {allDestinations
              .filter(d => d.experiences.length > 0)
              .slice(0, 3)
              .map((dest, i) => {
                const exp = dest.experiences[0];
                const country = allCountries.find(c => c.id === dest.countryId);
                return (
                  <motion.div
                    key={dest.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: Math.min(i * 0.1, 0.3) }}
                  >
                    <Link
                      to={`/destination/${dest.slug}`}
                      className="photo-surface group relative block rounded-3xl overflow-hidden aspect-[16/11]"
                    >
                      <SmartImage
                        src={exp.image}
                        alt={exp.title}
                        className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p className="text-amber-400/80 text-xs uppercase tracking-wide mb-1.5">
                          {country?.name} · {dest.name}
                        </p>
                        <h3 className="text-white text-lg font-semibold leading-tight mb-2">{exp.title}</h3>
                        <p className="text-white/70 text-sm line-clamp-2">{exp.description}</p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/experiences"
              className="inline-flex items-center gap-2 text-amber-400 text-sm font-medium hover:gap-3 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Explore All Experiences <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <TravelPlanningFaq />
    </div>
  );
}
