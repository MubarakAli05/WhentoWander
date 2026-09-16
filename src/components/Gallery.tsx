import { useState } from 'react';
import { motion } from 'framer-motion';
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

  if (!images.length) return null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {images.map((img, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.3) }}
            onClick={() => setModalIndex(i)}
            className={`relative overflow-hidden rounded-lg group ${
              i === 0 ? 'col-span-2 md:row-span-2 aspect-square md:aspect-auto' : 'aspect-square'
            }`}
            aria-label={`Open image: ${img.caption || img.alt}`}
          >
            <SmartImage
              src={img.url}
              alt={img.alt}
              className="w-full h-full group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end p-3">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-4 h-4 text-white" />
              </div>
            </div>
          </motion.button>
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
