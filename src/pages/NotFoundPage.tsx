import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-stone-950">
      <div className="absolute inset-0">
        <motion.img
          src="https://images.pexels.com/photos/28356796/pexels-photo-28356796.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Desert landscape at sunset"
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-2xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-amber-400 text-xs uppercase tracking-[0.3em] font-semibold mb-6"
        >
          404
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-6"
        >
          Lost Somewhere?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-white/70 text-lg leading-relaxed mb-10"
        >
          The world is big. Let's find you a better destination.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            to="/world"
            className="px-8 py-3.5 bg-amber-400 text-stone-950 text-sm font-semibold rounded-full hover:bg-amber-300 transition-colors flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4" />
            Explore the World
          </Link>
          <Link
            to="/"
            className="px-8 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold rounded-full hover:bg-white/15 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
