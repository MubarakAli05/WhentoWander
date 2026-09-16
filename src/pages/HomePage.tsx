import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
} from '@/data';
import type { MonthNumber } from '@/data';
import { SectionHeading } from '@/components/SectionHeading';
import { DestinationCard } from '@/components/DestinationCard';
import { RecommendationPanel } from '@/components/RecommendationPanel';
import { SmartImage } from '@/components/SmartImage';

const heroSuggestions = ['Japan', 'Switzerland', 'Iceland', 'Türkiye', 'New Zealand'];

export function HomePage() {
  const currentMonth = getCurrentMonth();
  const monthInfo = getMonthInfo(currentMonth);
  const monthDests = getDestinationsByMonth(currentMonth).slice(0, 4);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const scrollToMonths = () => {
    document.getElementById('travel-by-month')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.img
            src="https://images.pexels.com/photos/16226231/pexels-photo-16226231.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Cherry blossoms at a Japanese temple in spring"
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: 'easeOut' }}
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-3xl">
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
            Every place has a moment.
            <br />
            <span className="text-amber-400">Find yours.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-white/70 text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto"
          >
            Discover extraordinary destinations and the best moments to experience them.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            onSubmit={handleSearch}
            className="max-w-xl mx-auto mb-6"
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
            className="flex flex-wrap justify-center gap-2 mb-10"
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
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              to="/world"
              className="px-8 py-3.5 bg-amber-400 text-stone-950 text-sm font-semibold rounded-full hover:bg-amber-300 transition-colors flex items-center justify-center gap-2"
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-white/40 animate-bounce" />
        </motion.div>
      </section>

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
                    className="group block bg-stone-900 rounded-lg p-5 border border-white/5 hover:border-amber-400/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-bold text-lg">{m.shortName}</span>
                      <span className="text-stone-600 text-xs">{dests.length} places</span>
                    </div>
                    <p className="text-stone-400 text-xs leading-relaxed line-clamp-2">
                      {dests[0] ? `${dests[0].name}, ${allCountries.find(c => c.id === dests[0].countryId)?.name}` : 'Coming soon'}
                      {dests[1] ? ` & more` : ''}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-amber-400/60 text-xs group-hover:text-amber-400 transition-colors">
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
                  className="group relative block rounded-lg overflow-hidden aspect-square"
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
                  className="group relative block rounded-lg overflow-hidden aspect-[16/10]"
                >
                  <SmartImage
                    src={country.heroImage}
                    alt={country.name}
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
                      className="group relative block rounded-lg overflow-hidden aspect-[16/11]"
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
    </div>
  );
}
