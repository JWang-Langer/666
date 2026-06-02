import { useEffect, useState } from 'react';
import { motion, AnimatePresence, type MotionValue } from 'framer-motion';

export function PulseRing({
  count,
  scrollYProgress,
}: {
  count: number;
  scrollYProgress: MotionValue<number>;
}) {
  const [triggers, setTriggers] = useState<number[]>([]);

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      const nextTrigger = Math.floor(v * count * 2);
      if (nextTrigger > triggers.length) {
        setTriggers((prev) => [...prev, Date.now()]);
      }
    });
    return unsub;
  }, [scrollYProgress, count, triggers.length]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence>
        {triggers.map((id) => (
          <motion.div
            key={id}
            initial={{ scale: 0.5, opacity: 0.6 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              border: '1px solid var(--color-yellow)',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
