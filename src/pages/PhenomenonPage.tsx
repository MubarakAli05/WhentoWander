import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Camera, Sparkles } from 'lucide-react';
import { PHENOMENA, allCountries } from '@/data';
import { DiscoveryHero } from '@/components/DiscoveryHero';
import { getPhenomenonCategory, getPhenomenonGuidance, getPhenomenonPhoto, guideMonths } from '@/data/seasonalDiscovery';

export function PhenomenonPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const listingUrl = `/phenomena${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
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

  const countries = allCountries.filter(country => phenomenon.countries.includes(country.slug));
  const photo = getPhenomenonPhoto(phenomenon);

  return (
    <div className="bg-stone-950 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Link to={listingUrl} className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm text-stone-300 hover:text-amber-400 focus-visible:outline focus-visible:outline-amber-400">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Back to phenomena
        </Link>
        <DiscoveryHero eyebrow={getPhenomenonCategory(phenomenon)} title={phenomenon.name} description={phenomenon.summary} image={photo.image} imageLabel={photo.label}>
          <p className="text-sm leading-relaxed text-stone-400">Seasonal possibility, not a guaranteed sighting. Start with a place, then check its local calendar.</p>
        </DiscoveryHero>
        <section aria-labelledby="timing-guidance" className="my-8 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 sm:p-6">
          <h2 id="timing-guidance" className="text-lg font-semibold text-white">Before choosing your dates</h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-300">{getPhenomenonGuidance(phenomenon)}</p>
        </section>
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
                <p className="text-stone-400 text-xs uppercase tracking-wide mb-2">Guide months</p>
                <p className="text-white text-sm leading-relaxed">{guideMonths(phenomenon.bestMonths)}</p>
                <p className="mt-3 text-xs leading-relaxed text-stone-400">Reference window only; not the local season for every listed country.</p>
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
              <h2 className="text-white text-lg font-semibold mb-3">Choose a destination</h2>
              <p className="mb-3 text-sm leading-relaxed text-stone-400">Explore each country’s regions and seasonal notes before narrowing your route.</p>
              <div className="space-y-2">
                {countries.length > 0 ? countries.map(country => (
                  <Link key={country.id} to={`/country/${country.slug}`} className="flex min-h-11 items-center rounded-lg px-2 text-stone-300 hover:bg-white/5 hover:text-amber-400 text-sm focus-visible:outline focus-visible:outline-amber-400">
                    {country.flag} {country.name}
                  </Link>
                )) : (
                  <p className="text-stone-400 text-sm">Worldwide</p>
                )}
              </div>
            </div>
            <div className="bg-stone-900 border border-white/5 rounded-lg p-5">
              <h2 className="text-white text-lg font-semibold mb-3">Check the source</h2>
              <p className="text-stone-300 text-sm leading-relaxed">{phenomenon.source}</p>
              <a href={phenomenon.sourceUrl} target="_blank" rel="noreferrer" className="text-amber-400 text-sm mt-3 inline-flex min-h-11 items-center underline underline-offset-4">
                Open seasonal source ↗
              </a>
              <p className="mt-3 text-xs leading-relaxed text-stone-400">Guide record last checked: {phenomenon.lastVerified}. Sources are general planning references, not live bloom, weather or wildlife reports.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
