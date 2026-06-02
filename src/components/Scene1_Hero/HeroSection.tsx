import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GlitchTitle } from './GlitchTitle';
import { RotatingEye } from './RotatingEye';

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const bgOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const eyeScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.3]);
  const eyeOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <motion.section
      ref={ref}
      id="scene-hero"
      style={{
        height: '150vh',
        position: 'relative',
        background: 'var(--color-black)',
        overflow: 'hidden',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 70% 50%, rgba(224,0,0,0.08) 0%, transparent 60%), radial-gradient(ellipse at 30% 40%, rgba(255,211,0,0.04) 0%, transparent 50%)',
          opacity: bgOpacity,
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 200px 80px rgba(0,0,0,0.7)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <motion.div style={{ y: titleY, opacity: titleOpacity, zIndex: 10 }}>
          <GlitchTitle />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1.5, duration: 1 }}
            style={{
              textAlign: 'center',
              color: 'var(--color-red)',
              fontSize: '0.85rem',
              fontWeight: 400,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginTop: '1.5rem',
            }}
          >
            scroll to descend
          </motion.p>
        </motion.div>

        <motion.div
          style={{
            scale: eyeScale,
            opacity: eyeOpacity,
            position: 'absolute',
            right: '15%',
            bottom: '20%',
          }}
        >
          <RotatingEye />
        </motion.div>
      </div>
    </motion.section>
  );
}
