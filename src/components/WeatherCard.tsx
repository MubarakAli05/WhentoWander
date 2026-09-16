import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, Snowflake } from 'lucide-react';
import type { WeatherInfo } from '@/data';

interface Props {
  weather: WeatherInfo[];
}

function getWeatherIcon(season: string) {
  const s = season.toLowerCase();
  if (s.includes('summer') || s.includes('dry')) return <Sun className="w-5 h-5 text-amber-400" />;
  if (s.includes('winter') || s.includes('snow')) return <Snowflake className="w-5 h-5 text-blue-300" />;
  if (s.includes('monsoon') || s.includes('wet') || s.includes('rain')) return <CloudRain className="w-5 h-5 text-blue-400" />;
  return <Cloud className="w-5 h-5 text-stone-400" />;
}

export function WeatherCard({ weather }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {weather.map((w, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: Math.min(i * 0.08, 0.3) }}
          className="bg-stone-900 rounded-lg p-5 border border-white/5"
        >
          <div className="flex items-center gap-3 mb-4">
            {getWeatherIcon(w.season)}
            <div>
              <h4 className="text-white font-semibold text-sm">{w.season}</h4>
              <p className="text-stone-500 text-xs">{w.months}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <p className="text-stone-500 text-[10px] uppercase tracking-wide mb-1">Temp</p>
              <p className="text-white text-sm font-medium">{w.tempRange}</p>
            </div>
            <div>
              <p className="text-stone-500 text-[10px] uppercase tracking-wide mb-1">Rain</p>
              <p className="text-white text-sm font-medium">{w.rainfall}</p>
            </div>
            <div>
              <p className="text-stone-500 text-[10px] uppercase tracking-wide mb-1">Sun</p>
              <p className="text-white text-sm font-medium">{w.sunlight}</p>
            </div>
          </div>
          <p className="text-stone-400 text-xs leading-relaxed">{w.notes}</p>
        </motion.div>
      ))}
    </div>
  );
}
