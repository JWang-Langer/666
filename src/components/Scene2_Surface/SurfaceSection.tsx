import { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import { PeelCard } from './PeelCard';
import { RevealText } from './RevealText';

interface CardConfig {
  label: string;
  text: string;
  gradient: string;
}

const CARDS: CardConfig[] = [
  {
    label: 'Layer 1',
    text: 'COMFORT IS A LIE',
    gradient: 'linear-gradient(135deg, #2a2520 0%, #3a3020 50%, #2a2520 100%)',
  },
  {
    label: 'Layer 2',
    text: 'DESIRE IS PROGRAMMED',
    gradient:
      'linear-gradient(135deg, #2a2030 0%, #3010a0 50%, #201030 100%)',
  },
  {
    label: 'Layer 3',
    text: 'IDENTITY IS PERFORMANCE',
    gradient:
      'linear-gradient(135deg, #1a2020 0%, #0a3040 50%, #1a2020 100%)',
  },
  {
    label: 'Layer 4',
    text: 'PEEL BACK EVERYTHING',
    gradient: 'linear-gradient(135deg, #1a1010 0%, #300808 50%, #1a1010 100%)',
  },
];

export function SurfaceSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  return (
    <motion.section
      ref={ref}
      id="scene-surface"
      style={{
        height: '300vh',
        position: 'relative',
        background: 'var(--color-black)',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'grid',
          placeItems: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 'min(90vw, 500px)',
            aspectRatio: '3/4',
          }}
        >
          {CARDS.map((card, i) => (
            <PeelCard
              key={card.label}
              index={i}
              total={CARDS.length}
              config={card}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        <RevealText scrollYProgress={scrollYProgress} />
      </div>
    </motion.section>
  );
}
