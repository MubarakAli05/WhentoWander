import { motion } from 'framer-motion';

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ eyebrow, title, subtitle, align = 'center' }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className={`mb-10 md:mb-14 ${align === 'center' ? 'text-center mx-auto max-w-2xl' : 'text-left max-w-2xl'}`}
    >
      {eyebrow && (
        <p className="text-amber-400/80 text-xs uppercase tracking-[0.2em] font-semibold mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-stone-400 text-base md:text-lg leading-relaxed mt-4">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
