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
    label: '第一层',
    text: '安逸是谎言',
    gradient: 'linear-gradient(135deg, #1a1814 0%, #2a2218 50%, #1a1814 100%)',
  },
  {
    label: '第二层',
    text: '欲望被编码',
    gradient:
      'linear-gradient(135deg, #1a1420 0%, #201040 50%, #1a1420 100%)',
  },
  {
    label: '第三层',
    text: '身份即表演',
    gradient:
      'linear-gradient(135deg, #101820 0%, #082028 50%, #101820 100%)',
  },
  {
    label: '第四层',
    text: '剥开一切',
    gradient: 'linear-gradient(135deg, #141010 0%, #240808 50%, #141010 100%)',
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
          background: 'radial-gradient(ellipse at center, rgba(44,85,89,0.04) 0%, transparent 70%)',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 'min(85vw, 480px)',
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
