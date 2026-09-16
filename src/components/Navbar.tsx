import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Compass } from 'lucide-react';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { searchAll, allCountries } from '@/data';

const navLinks = [
  { label: 'Explore', path: '/' },
  { label: 'By Month', path: '/months' },
  { label: 'Experiences', path: '/experiences' },
  { label: 'World', path: '/world' },
  { label: 'Wanderlist', path: '/wanderlist' },
];

export function Navbar() {
  const scrolled = useScrollPosition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef<HTMLInputElement>(null);

  const isHome = location.pathname === '/';
  const transparent = isHome && !scrolled;

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setSearchOpen(false);
    }
  };

  const suggestions = ['Japan', 'Iceland', 'Kyoto', 'September', 'Northern Lights'];
  const results = query.trim() ? searchAll(query) : { countries: [], destinations: [] };
  const hasResults = results.countries.length > 0 || results.destinations.length > 0;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          transparent
            ? 'bg-transparent'
            : 'bg-stone-950/95 backdrop-blur-md border-b border-white/5'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-2 group">
              <Compass className={`w-5 h-5 transition-colors ${transparent ? 'text-white' : 'text-amber-400'}`} />
              <span className={`text-sm font-semibold tracking-[0.2em] uppercase transition-colors ${transparent ? 'text-white' : 'text-white'}`}>
                When to Wander
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-[13px] font-medium tracking-wide uppercase transition-colors hover:text-amber-400 ${
                    transparent ? 'text-white/90' : 'text-white/70'
                  } ${location.pathname === link.path ? 'text-amber-400' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
                className={`p-2 rounded-full transition-colors hover:bg-white/10 ${
                  transparent ? 'text-white' : 'text-white'
                }`}
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
                className={`lg:hidden p-2 rounded-full transition-colors hover:bg-white/10 ${
                  transparent ? 'text-white' : 'text-white'
                }`}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden bg-stone-950/98 backdrop-blur-md border-t border-white/5"
            >
              <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
                    <input
                      ref={searchRef}
                      type="text"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder="Search a country, city, landmark or experience..."
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-400/50 transition-colors text-sm"
                    />
                  </div>
                </form>

                {!query && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-stone-500 text-xs uppercase tracking-wide mr-1">Try:</span>
                    {suggestions.map(s => (
                      <button
                        key={s}
                        onClick={() => {
                          setQuery(s);
                          searchRef.current?.focus();
                        }}
                        className="px-3 py-1.5 text-xs text-white/60 border border-white/10 rounded-full hover:border-amber-400/50 hover:text-amber-400 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {query && hasResults && (
                  <div className="mt-4 space-y-1 max-h-80 overflow-y-auto">
                    {results.countries.slice(0, 3).map(c => (
                      <Link
                        key={c.id}
                        to={`/country/${c.slug}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <img src={c.heroImage} alt={c.name} className="w-12 h-12 rounded object-cover" loading="lazy" />
                        <div>
                          <p className="text-white text-sm font-medium">{c.flag} {c.name}</p>
                          <p className="text-stone-500 text-xs">Country · {c.continent}</p>
                        </div>
                      </Link>
                    ))}
                    {results.destinations.slice(0, 5).map(d => {
                      const country = allCountries.find(c => c.id === d.countryId);
                      return (
                        <Link
                          key={d.id}
                          to={`/destination/${d.slug}`}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <img src={d.heroImage} alt={d.name} className="w-12 h-12 rounded object-cover" loading="lazy" />
                          <div>
                            <p className="text-white text-sm font-medium">{d.name}</p>
                            <p className="text-stone-500 text-xs">{country?.name} · {d.bestSeasonLabel}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {query && !hasResults && (
                  <p className="mt-4 text-stone-500 text-sm text-center py-4">No results for "{query}"</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden bg-stone-950/98 backdrop-blur-md border-t border-white/5"
            >
              <div className="px-4 py-6 space-y-1">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-3 px-4 rounded-lg text-sm font-medium tracking-wide uppercase transition-colors ${
                      location.pathname === link.path
                        ? 'text-amber-400 bg-white/5'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
