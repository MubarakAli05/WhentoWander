import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { GalleryImage } from '@/data';
import { SmartImage } from './SmartImage';

interface Props {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  contextLabel?: string;
}

export function ImageModal({ images, index, onClose, onNavigate, contextLabel }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const reducedMotion = useReducedMotion();
  const next = () => onNavigate((index + 1) % images.length);
  const prev = () => onNavigate((index - 1 + images.length) % images.length);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  const image = images[index];
  if (!image) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-label={`${contextLabel ?? 'Travel'} photo gallery`}
      className="gallery-dialog fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-black/95 text-white backdrop:bg-black/80"
      onCancel={event => { event.preventDefault(); onClose(); }}
      onKeyDown={event => {
        if (event.key === 'Escape') { event.preventDefault(); onClose(); }
        if (event.key === 'ArrowRight') { event.preventDefault(); next(); }
        if (event.key === 'ArrowLeft') { event.preventDefault(); prev(); }
      }}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}
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
            className="absolute left-1 md:left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next image"
            className="absolute right-1 md:right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      <div className="max-w-6xl w-full px-12 py-20" onClick={e => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
          >
            <SmartImage
              src={image.fullUrl ?? image.url}
              fallbackSources={[image.url]}
              previewSrc={image.url}
              alt={image.alt}
              loading="eager"
              fit="contain"
              className="w-full h-[55vh] md:h-[65vh] rounded-lg"
            />
            <div className="mt-4 text-center">
              {image.caption && (
                <p className="text-white text-sm font-medium">{image.caption}</p>
              )}
              {contextLabel && (
                <p className="text-amber-400/60 text-xs uppercase tracking-wide mt-1">{contextLabel}</p>
              )}
              {image.photographer && (
                <p className="text-stone-400 text-xs mt-2 line-clamp-3">Photo: {image.photographer}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-amber-300">
                {image.sourceUrl && <a href={image.sourceUrl} target="_blank" rel="noreferrer" className="underline">Source & credits</a>}
                {image.licenseUrl && <a href={image.licenseUrl} target="_blank" rel="noreferrer" className="underline">{image.license}</a>}
                {image.fullUrl && (
                  <a href={image.fullUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline">
                    Original{image.width && image.height ? ` · ${image.width} × ${image.height}` : ''}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <p aria-live="polite" className="text-stone-400 text-xs mt-3">{index + 1} of {images.length}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </dialog>,
    document.body,
  );
}
