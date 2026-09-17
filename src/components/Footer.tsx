import { Link } from 'react-router-dom';
import { Compass, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-stone-950 text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-16">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Compass className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-semibold tracking-[0.2em] uppercase">When to Wander</span>
            </Link>
            <p className="text-stone-400 text-sm leading-relaxed">
              Every place has a moment. Find yours.
            </p>
            <p className="text-stone-500 text-xs leading-relaxed mt-3">
              Discover where to go, when to go, and why that moment matters.
            </p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.15em] text-stone-500 font-semibold mb-4">Explore</h3>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-sm text-stone-400 hover:text-amber-400 transition-colors">Destinations</Link></li>
              <li><Link to="/countries" className="text-sm text-stone-400 hover:text-amber-400 transition-colors">Countries</Link></li>
              <li><Link to="/months" className="text-sm text-stone-400 hover:text-amber-400 transition-colors">Months</Link></li>
              <li><Link to="/experiences" className="text-sm text-stone-400 hover:text-amber-400 transition-colors">Experiences</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.15em] text-stone-500 font-semibold mb-4">About</h3>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="text-sm text-stone-400 hover:text-amber-400 transition-colors">About the project</Link></li>
              <li><Link to="/wanderlist" className="text-sm text-stone-400 hover:text-amber-400 transition-colors">My Wanderlist</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.15em] text-stone-500 font-semibold mb-4">Connect</h3>
            <div className="flex gap-3">
              <a href="#" aria-label="Instagram" className="p-2.5 rounded-full border border-white/10 text-stone-400 hover:text-amber-400 hover:border-amber-400/30 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Twitter" className="p-2.5 rounded-full border border-white/10 text-stone-400 hover:text-amber-400 hover:border-amber-400/30 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" aria-label="YouTube" className="p-2.5 rounded-full border border-white/10 text-stone-400 hover:text-amber-400 hover:border-amber-400/30 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-stone-500 text-xs">
            © {new Date().getFullYear()} When to Wander. All travel data is approximate and for inspiration only.
          </p>
          <p className="text-stone-600 text-xs">
            Photography via Pexels · Travel timing data is seasonal guidance, not live forecasts
          </p>
        </div>
      </div>
    </footer>
  );
}
