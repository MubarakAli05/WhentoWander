import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useCallback } from 'react';
import type { GalleryImage } from '@/data';

interface Props {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  contextLabel?: string;
}

export function ImageModal({ images, index, onClose, onNavigate, contextLabel }: Props) {
  const next = useCallback(() => {
    onNavigate((index + 1) % images.length);
  }, [index, images.length, onNavigate]);

  const prev = useCallback(() => {
    onNavigate((index - 1 + images.length) % images.length);
  }, [index, images.length, onNavigate]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, next, prev]);

  const image = images[index];
  if (!image) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Close"
        className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous image"
            className="absolute left-4 md:left-8 z-10 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next image"
            className="absolute right-4 md:right-8 z-10 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      <div className="max-w-5xl w-full px-4" onClick={e => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full max-h-[75vh] object-contain rounded-lg"
            />
            <div className="mt-4 text-center">
              {image.caption && (
                <p className="text-white text-sm font-medium">{image.caption}</p>
              )}
              {contextLabel && (
                <p className="text-amber-400/60 text-xs uppercase tracking-wide mt-1">{contextLabel}</p>
              )}
              {image.photographer && (
                <p className="text-stone-500 text-xs mt-1">Photo by {image.photographer} · Pexels</p>
              )}
              <p className="text-stone-600 text-xs mt-2">{index + 1} of {images.length}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
