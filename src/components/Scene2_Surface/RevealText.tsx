import { motion, useTransform, type MotionValue } from 'framer-motion';

export function RevealText({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(scrollYProgress, [0.7, 0.92], [0, 1]);
  const y = useTransform(scrollYProgress, [0.7, 0.92], [60, 0]);
  const scale = useTransform(scrollYProgress, [0.7, 0.92], [0.85, 1]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        bottom: '12vh',
        textAlign: 'center',
        opacity,
        y,
        scale,
        zIndex: -1,
      }}
    >
      <p
        className="body-lg text-red"
        style={{
          fontStyle: 'italic',
          textShadow: '0 0 30px rgba(224,0,0,0.2)',
        }}
      >
        每一层表象之下……
      </p>
    </motion.div>
  );
}
