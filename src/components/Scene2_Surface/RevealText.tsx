import { motion, useTransform, type MotionValue } from 'framer-motion';

export function RevealText({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]);
  const y = useTransform(scrollYProgress, [0.7, 0.9], [60, 0]);
  const scale = useTransform(scrollYProgress, [0.7, 0.9], [0.9, 1]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        bottom: '15vh',
        textAlign: 'center',
        opacity,
        y,
        scale,
        zIndex: -1,
      }}
    >
      <p className="body-lg text-red" style={{ fontStyle: 'italic' }}>
        Beneath every surface...
      </p>
    </motion.div>
  );
}
