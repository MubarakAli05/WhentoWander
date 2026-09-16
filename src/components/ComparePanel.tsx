import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Globe, Check, X } from 'lucide-react';
import type { Destination } from '@/data';
import { allCountries } from '@/data';

interface Props {
  destinations: Destination[];
}

export function ComparePanel({ destinations }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (slug: string) => {
    setSelected(prev =>
      prev.includes(slug)
        ? prev.filter(s => s !== slug)
        : prev.length < 2
        ? [...prev, slug]
        : prev
    );
  };

  const compareDestinations = destinations.filter(d => selected.includes(d.slug));

  const rows = [
    { label: 'Best time', key: 'bestSeasonLabel' as const },
    { label: 'Stay', key: 'duration' as const },
    { label: 'Region', key: 'region' as const },
    { label: 'Travel styles', key: 'travelStyles' as const },
  ];

  return (
    <div>
      <div className="mb-6">
        <p className="text-stone-400 text-sm mb-3">
          Select two destinations to compare side by side.
        </p>
        <div className="flex flex-wrap gap-2">
          {destinations.slice(0, 8).map(d => {
            const isSelected = selected.includes(d.slug);
            const canSelect = selected.length < 2 || isSelected;
            return (
              <button
                key={d.slug}
                onClick={() => canSelect && toggle(d.slug)}
                disabled={!canSelect}
                className={`px-3 py-2 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-amber-400 text-stone-950'
                    : canSelect
                    ? 'bg-stone-900 text-white/60 border border-white/5 hover:border-amber-400/30'
                    : 'bg-stone-900 text-stone-600 border border-white/5 opacity-50 cursor-not-allowed'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                {d.name}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {compareDestinations.length === 2 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-4">
              {compareDestinations.map(d => {
                const country = allCountries.find(c => c.id === d.countryId);
                return (
                  <div key={d.slug} className="bg-stone-900 rounded-lg p-5 border border-white/5">
                    <img src={d.heroImage} alt={d.name} className="w-full h-32 rounded object-cover mb-3" loading="lazy" />
                    <p className="text-amber-400/70 text-xs uppercase tracking-wide mb-1">{country?.name}</p>
                    <Link to={`/destination/${d.slug}`} className="text-white font-semibold text-lg hover:text-amber-400 transition-colors">
                      {d.name}
                    </Link>
                    <div className="mt-4 space-y-3">
                      {rows.map(row => {
                        const value = d[row.key];
                        const text = Array.isArray(value) ? value.join(', ') : String(value ?? '—');
                        return (
                          <div key={row.label} className="border-t border-white/5 pt-3">
                            <p className="text-stone-500 text-[10px] uppercase tracking-wide mb-1">{row.label}</p>
                            <p className="text-white/80 text-sm">{text}</p>
                          </div>
                        );
                      })}
                      <div className="border-t border-white/5 pt-3">
                        <p className="text-stone-500 text-[10px] uppercase tracking-wide mb-1">Why visit</p>
                        <p className="text-white/70 text-xs leading-relaxed">{d.whyVisit}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
