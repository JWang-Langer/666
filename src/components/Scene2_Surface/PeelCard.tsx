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
  const start = (index / total) * 0.7;
  const end = Math.min(1, ((index + 1) / total) * 0.7 + 0.1);

  const scale = useTransform(scrollYProgress, [start, end], [1, 0.85]);
  const y = useTransform(scrollYProgress, [start, end], ['0vh', '-15vh']);
  const rotateZ = useTransform(scrollYProgress, [start, end], [0, index % 2 === 0 ? -4 : 4]);
  const opacity = useTransform(scrollYProgress, [start, end], [1, 0.3]);
  const brightness = useTransform(scrollYProgress, [start, end], [1, 0.2]);
  const boxShadow = useTransform(
    scrollYProgress,
    [start, end],
    [
      '0 20px 60px rgba(0,0,0,0.5)',
      '0 60px 120px rgba(0,0,0,0.9)',
    ]
  );

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        background: config.gradient,
        borderRadius: '12px',
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
        border: '1px solid rgba(255,255,255,0.05)',
      }}
      initial={{ scale: 1, opacity: 1 }}
    >
      {/* Card content */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.25em',
            color: 'var(--color-yellow)',
            marginBottom: '1rem',
            opacity: 0.5,
          }}
        >
          {config.label.toUpperCase()}
        </div>
        <h2
          className="display-md"
          style={{ color: 'var(--color-cream)', fontSize: 'clamp(1.2rem, 3vw, 2.5rem)' }}
        >
          {config.text}
        </h2>
      </div>
    </motion.div>
  );
}
