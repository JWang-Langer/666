import { motion, useTransform, useSpring, type MotionValue } from 'framer-motion';

interface PeelCardProps {
  index: number;
  total: number;
  config: { label: string; text: string; gradient: string };
  scrollYProgress: MotionValue<number>;
}

export function PeelCard({ index, total, config, scrollYProgress }: PeelCardProps) {
  const sectionSize = 1 / total;
  const sectionStart = index * sectionSize;
  const peelStart = sectionStart + sectionSize * 0.45;
  const peelEnd = sectionStart + sectionSize * 0.88;

  // Raw transforms
  const rawOpacity = useTransform(
    scrollYProgress,
    [Math.max(0, sectionStart - 0.01), sectionStart, peelStart, peelEnd],
    [0, 1, 1, 0]
  );
  const rawScale = useTransform(scrollYProgress, [peelStart, peelEnd], [1, 0.72]);
  const rawRotateZ = useTransform(
    scrollYProgress, [peelStart, peelEnd],
    [0, index % 2 === 0 ? -6 : 6]
  );
  const rawY = useTransform(scrollYProgress, [peelStart, peelEnd], ['0vh', '-20vh']);
  const rawBrightness = useTransform(scrollYProgress, [peelStart, peelEnd], [1, 0.08]);

  // Spring-wrap everything for buttery motion
  const opacity = useSpring(rawOpacity, { stiffness: 80, damping: 28 });
  const scale = useSpring(rawScale, { stiffness: 70, damping: 24 });
  const rotateZ = useSpring(rawRotateZ, { stiffness: 65, damping: 22 });
  const y = useSpring(rawY, { stiffness: 60, damping: 20 });
  const filterBrightness = useSpring(rawBrightness, { stiffness: 70, damping: 24 });

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
        willChange: 'transform, opacity',
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
