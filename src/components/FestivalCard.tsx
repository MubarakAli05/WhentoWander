import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import type { Festival } from '@/data';

interface Props {
  festivals: Festival[];
}

export function FestivalCard({ festivals }: Props) {
  if (!festivals.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {festivals.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: Math.min(i * 0.08, 0.3) }}
          className="bg-stone-900 rounded-lg p-5 border border-white/5"
        >
          <h4 className="text-white font-semibold text-base mb-3">{f.name}</h4>
          <div className="flex flex-wrap gap-4 mb-3">
            <div className="flex items-center gap-1.5 text-amber-400/80 text-xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>{f.period}</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-400 text-xs">
              <MapPin className="w-3.5 h-3.5" />
              <span>{f.location}</span>
            </div>
          </div>
          <p className="text-stone-400 text-sm leading-relaxed">{f.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
