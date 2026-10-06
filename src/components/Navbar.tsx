import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Menu, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { searchAll, allCountries, getCountryImageFallbacks } from '@/data';
import { SmartImage } from './SmartImage';

import { navLinks, isNavigationActive } from './navigation';

export function Navbar() {
  const scrolled = useScrollPosition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef<HTMLInputElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const isHome = location.pathname === '/';
  const transparent = isHome && !scrolled;

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen && !mobileOpen) return;
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setSearchOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [searchOpen, mobileOpen]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1280px)');
    const closeMobile = () => { if (desktop.matches) setMobileOpen(false); };
    desktop.addEventListener('change', closeMobile);
    return () => desktop.removeEventListener('change', closeMobile);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setSearchOpen(false);
    }
  };

  const closePanels = () => {
    setSearchOpen(false);
    setMobileOpen(false);
  };

  const suggestions = ['Japan', 'Iceland', 'Kyoto', 'September', 'Northern Lights'];
  const results = searchOpen ? searchAll(query) : { countries: [], destinations: [], events: [], phenomena: [] };
  const resultCount = results.countries.length + results.destinations.length + results.events.length + results.phenomena.length;
  const hasResults = resultCount > 0;

  return (
    <>
      <header
        ref={headerRef}
        onKeyDown={event => {
          if (event.key === 'Escape' && (searchOpen || mobileOpen)) {
            event.preventDefault();
            (searchOpen ? searchButtonRef : menuButtonRef).current?.focus();
            closePanels();
          }
        }}
        onBlur={event => {
          if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) closePanels();
        }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          transparent
            ? 'bg-transparent'
            : 'bg-stone-950/95 backdrop-blur-md border-b border-white/5'
        }`}
      >
        <nav aria-label="Main navigation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" onClick={closePanels} className="flex items-center gap-2 group shrink-0">
              <BrandLogo />
              <span className={`text-sm font-semibold tracking-[0.2em] uppercase transition-colors ${transparent ? 'text-white' : 'text-white'}`}>
                When to Wander
              </span>
            </Link>

            <div className="hidden xl:flex items-center gap-5">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closePanels}
                  aria-current={isNavigationActive(location.pathname, link) ? 'page' : undefined}
                  className={`text-[13px] font-medium tracking-wide uppercase transition-colors hover:text-amber-400 ${
                    isNavigationActive(location.pathname, link) ? 'text-amber-400' : transparent ? 'text-white/90' : 'text-white/70'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                ref={searchButtonRef}
                onClick={() => { setSearchOpen(!searchOpen); setMobileOpen(false); }}
                aria-label={searchOpen ? 'Close search' : 'Search'}
                aria-expanded={searchOpen}
                aria-controls="navigation-search"
                className={`p-2 rounded-full transition-colors hover:bg-white/10 ${
                  transparent ? 'text-white' : 'text-white'
                }`}
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                ref={menuButtonRef}
                onClick={() => { setMobileOpen(!mobileOpen); setSearchOpen(false); }}
                aria-label={mobileOpen ? 'Close menu' : 'Menu'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-navigation"
                className={`xl:hidden p-2 rounded-full transition-colors hover:bg-white/10 ${
                  transparent ? 'text-white' : 'text-white'
                }`}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>

        <>
          {searchOpen && (
            <motion.div
              id="navigation-search"
              role="search"
              aria-label="Site search"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="max-h-[calc(100dvh-5rem)] overflow-y-auto bg-stone-950/95 backdrop-blur-md border-t border-white/5"
            >
              <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
                    <input
                      ref={searchRef}
                      type="search"
                      aria-label="Search countries, destinations, events and phenomena"
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
                        onClick={closePanels}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <SmartImage
                          src={c.heroImage}
                          alt={c.name}
                          fallbackSources={getCountryImageFallbacks(c)}
                          className="w-12 h-12 shrink-0 rounded"
                          loading="lazy"
                        />
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
                          onClick={closePanels}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <SmartImage src={d.heroImage} alt={d.name} className="w-12 h-12 shrink-0 rounded" loading="lazy" />
                          <div>
                            <p className="text-white text-sm font-medium">{d.name}</p>
                            <p className="text-stone-500 text-xs">{country?.name} · {d.bestSeasonLabel}</p>
                          </div>
                        </Link>
                      );
                    })}
                    {results.events.slice(0, 3).map(event => (
                      <Link key={event.id} to={`/events?country=${encodeURIComponent(event.countrySlug)}&month=${event.month}`} onClick={closePanels} className="block rounded-lg p-2 hover:bg-white/5">
                        <p className="text-sm font-medium text-white">{event.title}</p>
                        <p className="text-xs text-stone-400">Event · {event.countryName}</p>
                      </Link>
                    ))}
                    {results.phenomena.slice(0, 3).map(item => (
                      <Link key={item.id} to={`/phenomena/${item.slug}`} onClick={closePanels} className="block rounded-lg p-2 hover:bg-white/5">
                        <p className="text-sm font-medium text-white">{item.name}</p>
                        <p className="text-xs text-stone-400">Phenomenon · {item.location}</p>
                      </Link>
                    ))}
                    <Link to={`/search?q=${encodeURIComponent(query.trim())}`} onClick={closePanels} className="block p-3 text-sm text-amber-300 underline">
                      View all {resultCount} results
                    </Link>
                  </div>
                )}

                {query && !hasResults && (
                  <p className="mt-4 text-stone-500 text-sm text-center py-4">No results for "{query}"</p>
                )}
              </div>
            </motion.div>
          )}
        </>

        <>
          {mobileOpen && (
            <motion.div
              id="mobile-navigation"
              role="navigation"
              aria-label="Mobile navigation"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="xl:hidden max-h-[calc(100dvh-5rem)] overflow-y-auto bg-stone-950/95 backdrop-blur-md border-t border-white/5"
            >
              <div className="px-4 py-6 space-y-1">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={closePanels}
                    aria-current={isNavigationActive(location.pathname, link) ? 'page' : undefined}
                    className={`block py-3 px-4 rounded-lg text-sm font-medium tracking-wide uppercase transition-colors ${
                      isNavigationActive(location.pathname, link)
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
        </>
      </header>
    </>
  );
}
