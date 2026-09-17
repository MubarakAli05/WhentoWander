import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Camera, Sparkles } from 'lucide-react';
import { PHENOMENA, allCountries } from '@/data';

export function PhenomenonPage() {
  const { slug } = useParams();
  const phenomenon = PHENOMENA.find(item => item.slug === slug);

  if (!phenomenon) {
    return (
      <div className="bg-stone-950 min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-white text-2xl font-semibold mb-3">Phenomenon not found</h1>
          <Link to="/phenomena" className="text-amber-400 hover:underline">
            Explore all phenomena
          </Link>
        </div>
      </div>
    );
  }

  const countries = phenomenon.countries
    .map(countrySlug => allCountries.find(country => country.slug === countrySlug))
    .filter(Boolean) as typeof allCountries;

  return (
    <div className="bg-stone-950 min-h-screen pt-20">
      <section className="relative h-[60vh] min-h-[450px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={phenomenon.image} alt={phenomenon.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10">
          <Link to="/phenomena" className="inline-flex items-center gap-2 text-white/70 hover:text-amber-400 transition-colors mb-6 text-sm">
            <ArrowLeft className="w-4 h-4" /> All phenomena
          </Link>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-amber-400 text-xs uppercase tracking-[0.22em] font-semibold mb-3">{phenomenon.type}</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">{phenomenon.name}</h1>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-8">
          <div className="space-y-8">
            <div>
              <h2 className="text-white text-2xl font-semibold mb-4">Why it matters</h2>
              <p className="text-stone-300 leading-relaxed text-base">{phenomenon.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-stone-900 border border-white/5 rounded-lg p-5">
                <MapPin className="w-4 h-4 text-amber-400 mb-3" />
                <p className="text-stone-500 text-[10px] uppercase tracking-wide mb-2">Where</p>
                <p className="text-white text-sm">{phenomenon.location}</p>
              </div>
              <div className="bg-stone-900 border border-white/5 rounded-lg p-5">
                <Sparkles className="w-4 h-4 text-amber-400 mb-3" />
                <p className="text-stone-500 text-[10px] uppercase tracking-wide mb-2">Best months</p>
                <p className="text-white text-sm">{monthRange(phenomenon.bestMonths)}</p>
              </div>
              <div className="bg-stone-900 border border-white/5 rounded-lg p-5">
                <Camera className="w-4 h-4 text-amber-400 mb-3" />
                <p className="text-stone-500 text-[10px] uppercase tracking-wide mb-2">Photography</p>
                <p className="text-white text-sm">{phenomenon.photographyValue}</p>
              </div>
            </div>

            <div className="bg-stone-900 border border-white/5 rounded-lg p-6">
              <p className="text-amber-400 text-[10px] uppercase tracking-[0.2em] font-semibold mb-3">Why it is special</p>
              <p className="text-stone-300 leading-relaxed">{phenomenon.whyItIsSpecial}</p>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="bg-stone-900 border border-white/5 rounded-lg p-5">
              <p className="text-stone-500 text-[10px] uppercase tracking-[0.2em] mb-3">Countries</p>
              <div className="space-y-2">
                {countries.length > 0 ? countries.map(country => (
                  <Link key={country.id} to={`/country/${country.slug}`} className="block text-white/80 hover:text-amber-400 text-sm transition-colors">
                    {country.flag} {country.name}
                  </Link>
                )) : (
                  <p className="text-stone-400 text-sm">Worldwide</p>
                )}
              </div>
            </div>
            <div className="bg-stone-900 border border-white/5 rounded-lg p-5">
              <p className="text-stone-500 text-[10px] uppercase tracking-[0.2em] mb-3">Source</p>
              <p className="text-stone-300 text-sm">{phenomenon.source}</p>
              <a href={phenomenon.sourceUrl} target="_blank" rel="noreferrer" className="text-amber-400 text-xs mt-3 inline-block hover:underline">
                View source
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function monthRange(bestMonths: number[]) {
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return bestMonths.map(month => names[month - 1]).join(' · ');
}
