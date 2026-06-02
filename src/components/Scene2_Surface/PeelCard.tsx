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
  const start = (index / total) * 0.65;
  const end = Math.min(1, ((index + 1) / total) * 0.65 + 0.12);

  const scale = useTransform(scrollYProgress, [start, end], [1, 0.82]);
  const y = useTransform(scrollYProgress, [start, end], ['0vh', '-18vh']);
  const rotateZ = useTransform(scrollYProgress, [start, end], [0, index % 2 === 0 ? -5 : 5]);
  const opacity = useTransform(scrollYProgress, [start, end], [1, 0.25]);
  const brightness = useTransform(scrollYProgress, [start, end], [1, 0.15]);
  const boxShadow = useTransform(
    scrollYProgress,
    [start, end],
    [
      '0 20px 60px rgba(0,0,0,0.6), inset 0 0 40px rgba(255,211,0,0.03)',
      '0 80px 160px rgba(0,0,0,0.95)',
    ]
  );

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        background: config.gradient,
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        scale,
        y,
        rotateZ,
        opacity,
        filter: `brightness(${brightness.get()})`,
        boxShadow,
        transformOrigin: 'center bottom',
        border: '1px solid rgba(255,255,255,0.04)',
      }}
      initial={{ scale: 1, opacity: 1 }}
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
      </div>
    </motion.div>
  );
}
