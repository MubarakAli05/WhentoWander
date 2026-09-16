import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  message: string;
}

export function LoadingSkeleton({ message = 'Loading...' }: Props) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-stone-700" />
        <p className="text-stone-500 text-sm">{message}</p>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-stone-900 rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-[4/5] bg-stone-800" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-1/3 bg-stone-800 rounded" />
        <div className="h-5 w-2/3 bg-stone-800 rounded" />
        <div className="h-3 w-1/2 bg-stone-800 rounded" />
        <div className="h-3 w-full bg-stone-800 rounded" />
      </div>
    </div>
  );
}
