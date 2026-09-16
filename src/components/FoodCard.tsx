import { motion } from 'framer-motion';
import { Utensils } from 'lucide-react';
import type { FoodItem } from '@/data';

interface Props {
  foods: FoodItem[];
}

export function FoodCard({ foods }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {foods.map((food, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.3) }}
          className="bg-stone-900 rounded-lg p-5 border border-white/5"
        >
          <div className="flex items-start gap-3">
            <Utensils className="w-4 h-4 text-amber-400/70 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-white font-medium text-sm mb-1.5">{food.name}</h4>
              <p className="text-stone-400 text-xs leading-relaxed">{food.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
