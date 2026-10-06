import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Camera } from 'lucide-react';
import type { GalleryImage } from '@/data';
import { SmartImage } from './SmartImage';
import { ImageModal } from './ImageModal';

interface Props {
  images: GalleryImage[];
  contextLabel?: string;
}

export function Gallery({ images, contextLabel }: Props) {
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  if (!images.length) return null;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {images.map((img, i) => (
          <motion.figure
            key={img.url}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: reducedMotion ? 0 : 0.45, delay: reducedMotion ? 0 : Math.min(i * 0.06, 0.3) }}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-stone-900"
          >
            <button
              onClick={() => setModalIndex(i)}
              className="relative block aspect-[4/3] w-full overflow-hidden text-left"
              aria-label={`Open image: ${img.caption || img.alt}`}
              aria-haspopup="dialog"
            >
              <SmartImage src={img.url} alt={img.alt} className="w-full h-full group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 flex items-center gap-2 text-xs text-white"><Camera className="h-4 w-4" /> Explore photograph</span>
              {(img.width ?? 0) >= 3840 && (img.height ?? 0) >= 2160 && (
                <span className="absolute top-3 right-3 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[10px] font-semibold tracking-widest text-amber-200">4K SOURCE</span>
              )}
            </button>
            <figcaption className="p-4">
              <p className="line-clamp-2 text-sm text-stone-200" title={img.caption || img.alt}>{img.caption || img.alt}</p>
              {img.photographer && <p className="mt-2 line-clamp-2 text-xs text-stone-400">Photo: {img.photographer}</p>}
              {img.sourceUrl && (
                <a href={img.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-amber-300 underline underline-offset-4">{img.license ?? 'Photo source'} · credits</a>
              )}
            </figcaption>
          </motion.figure>
        ))}
      </div>

      {modalIndex !== null && (
        <ImageModal
          images={images}
          index={modalIndex}
          onClose={() => setModalIndex(null)}
          onNavigate={setModalIndex}
          contextLabel={contextLabel}
        />
      )}
    </>
  );
}
