import { motion } from 'framer-motion';
import { MONTHS } from '@/data';
import type { MonthNumber, SeasonalMonth } from '@/data';
import { getRatingColor, getRatingLabel } from '@/data';

interface Props {
  seasonalMonths: SeasonalMonth[];
  selectedMonth: MonthNumber | null;
  onSelectMonth: (month: MonthNumber) => void;
}

export function SeasonTimeline({ seasonalMonths, selectedMonth, onSelectMonth }: Props) {
  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {MONTHS.map((m, i) => {
          const data = seasonalMonths.find(s => s.month === m.month);
          const isSelected = selectedMonth === m.month;
          const rating = data?.rating || 'fair';

          return (
            <motion.button
              key={m.month}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.2) }}
              onClick={() => onSelectMonth(m.month)}
              className={`relative p-4 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'border-amber-400 bg-stone-800'
                  : 'border-white/5 bg-stone-900 hover:border-white/15'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold tracking-wider text-white">{m.shortName}</span>
                <span className={`w-2 h-2 rounded-full ${getRatingColor(rating)}`} />
              </div>
              <p className="text-xs text-white/60 leading-snug">{data?.label || '—'}</p>
              <p className="text-[10px] text-stone-500 mt-1">{getRatingLabel(rating)}</p>
            </motion.button>
          );
        })}
      </div>

      {selectedMonth && (() => {
        const data = seasonalMonths.find(s => s.month === selectedMonth);
        if (!data) return null;
        return (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mt-6 p-6 rounded-lg bg-stone-900 border border-white/5"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className={`w-3 h-3 rounded-full ${getRatingColor(data.rating)}`} />
              <h4 className="text-white font-semibold text-lg">
                {MONTHS.find(m => m.month === selectedMonth)?.fullName}
              </h4>
              <span className="text-xs text-stone-500 uppercase tracking-wide">{getRatingLabel(data.rating)}</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              <span className="text-amber-400 font-medium">{data.label}</span>
              {data.note && <span className="text-stone-400"> — {data.note}</span>}
            </p>
          </motion.div>
        );
      })()}
    </div>
  );
}
