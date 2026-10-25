import { MONTHS } from '@/data';
import { getMonthColor } from '@/data/theme';
import type { MonthNumber } from '@/data';
import { motion } from 'framer-motion';

interface Props {
  selectedMonth: MonthNumber;
  onSelectMonth: (month: MonthNumber) => void;
}

export function MonthSelector({ selectedMonth, onSelectMonth }: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
      {MONTHS.map((m, i) => {
        const isSelected = selectedMonth === m.month;
        return (
          <motion.button
            key={m.month}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: Math.min(i * 0.025, 0.2) }}
            onClick={() => onSelectMonth(m.month)}
            className={`px-3 sm:px-4 py-2.5 rounded-full border text-xs sm:text-sm font-semibold tracking-wide transition-all ${getMonthColor(m.month)} ${
              isSelected ? 'ring-2 ring-cocoa ring-offset-2' : 'hover:shadow-md'
            }`}
            aria-pressed={isSelected}
          >
            {m.shortName}
          </motion.button>
        );
      })}
    </div>
  );
}
