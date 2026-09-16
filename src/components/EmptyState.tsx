import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SearchX } from 'lucide-react';

interface Props {
  title?: string;
  message?: string;
}

export function EmptyState({
  title = 'Nothing here yet',
  message = 'Try a different search or explore the world.',
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <SearchX className="w-12 h-12 text-stone-600 mb-4" />
      <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
      <p className="text-stone-500 text-sm mb-6 max-w-md">{message}</p>
      <Link
        to="/"
        className="px-6 py-3 bg-amber-400 text-stone-950 text-sm font-semibold rounded-full hover:bg-amber-300 transition-colors"
      >
        Explore the World
      </Link>
    </motion.div>
  );
}
