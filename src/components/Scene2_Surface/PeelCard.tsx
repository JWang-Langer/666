import { motion, useTransform, type MotionValue } from 'framer-motion';

interface PeelCardProps {
  index: number;
  total: number;
  config: {
    label: string;
    text: string;
    gradient: string;
  };
  scrollYProgress: MotionValue<number>;
}

export function PeelCard({ index, total, config, scrollYProgress }: PeelCardProps) {
  // 300vh total. 4 cards. Each card gets 25% of the progress range.
  // Card i is the "top visible card" from i*25% to (i+1)*25%.
  // It peels away by the end of its section, revealing card i+1 beneath.
  const sectionSize = 1 / total;
  const sectionStart = index * sectionSize;           // card becomes top
  const peelStart = sectionStart + sectionSize * 0.5;  // start peeling halfway through
  const peelEnd = sectionStart + sectionSize * 0.9;    // fully peeled by 90%

  // Before this card's section: hidden beneath (fully opaque but z-index below)
  // During this card's section: visible, then peels
  // After: gone

  // Opacity: 0 before its section, 1 during, then animates to 0 as it peels
  const opacity = useTransform(
    scrollYProgress,
    [Math.max(0, sectionStart - 0.02), sectionStart, peelStart, peelEnd],
    [0, 1, 1, 0]
  );

  // Scale: on display at 1, shrinks as it peels
  const scale = useTransform(scrollYProgress, [peelStart, peelEnd], [1, 0.78]);

  // Rotate as it peels
  const rotateZ = useTransform(
    scrollYProgress,
    [peelStart, peelEnd],
    [0, index % 2 === 0 ? -7 : 7]
  );

  // Move upward as it peels
  const y = useTransform(scrollYProgress, [peelStart, peelEnd], ['0vh', '-24vh']);

  // Darken as it peels (simulates falling into shadow)
  const filterBrightness = useTransform(scrollYProgress, [peelStart, peelEnd], [1, 0.1]);

  // z-index: higher index = on top. Card 0 on bottom, card 3 on top initially.
  // But we want the CURRENT card to be on top. Reversed: higher = newer layer.
  // When card i is active, it should be ABOVE cards < i (already peeled).
  // Card 0 (first) = lowest z-index. Card 3 (last) = highest.
  const zIndex = index + 1;

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        background: config.gradient,
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        scale,
        y,
        rotateZ,
        opacity,
        filter: `brightness(${filterBrightness.get()})`,
        zIndex,
        transformOrigin: 'center bottom',
        border: '1px solid rgba(255,255,255,0.04)',
        boxShadow: '0 20px 80px rgba(0,0,0,0.7)',
        pointerEvents: 'none',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontSize: 'clamp(0.6rem, 1vw, 0.7rem)',
            letterSpacing: '0.2em',
            color: 'var(--color-red)',
            marginBottom: '1.2rem',
            opacity: 0.45,
            fontWeight: 500,
          }}
        >
          {config.label}
        </div>
        <h2
          className="display-md"
          style={{
            color: 'var(--color-cream)',
            fontSize: 'clamp(1.3rem, 3.5vw, 2.8rem)',
            lineHeight: 1.2,
          }}
        >
          {config.text}
        </h2>
        {index < total - 1 && (
          <p
            style={{
              marginTop: '2rem',
              fontSize: '0.7rem',
              color: 'var(--color-teal)',
              letterSpacing: '0.15em',
              opacity: 0.4,
            }}
          >
            继续向下 · 揭开下一层
          </p>
        )}
      </div>
    </motion.div>
  );
}
