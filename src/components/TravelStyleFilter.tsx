import { motion } from 'framer-motion';
import { TRAVEL_STYLES } from '@/data';

interface Props {
  selected: string[];
  onToggle: (style: string) => void;
}

export function TravelStyleFilter({ selected, onToggle }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {TRAVEL_STYLES.map((style, i) => {
        const isSelected = selected.includes(style);
        return (
          <motion.button
            key={style}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.2) }}
            onClick={() => onToggle(style)}
            className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all ${
              isSelected
                ? 'pastel-panel bg-periwinkle text-cocoa border border-periwinkle-accent ring-2 ring-cocoa ring-offset-2'
                : 'bg-stone-900 text-white/50 border border-white/5 hover:border-periwinkle-accent hover:text-cocoa'
            }`}
            aria-pressed={isSelected}
          >
            {style}
          </motion.button>
        );
      })}
    </div>
  );
}
