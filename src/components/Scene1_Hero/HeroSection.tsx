import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { GlitchTitle } from './GlitchTitle';
import { RotatingEye } from './RotatingEye';

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Spring-smooth all transforms for buttery feel
  const rawBgOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const rawTitleY = useTransform(scrollYProgress, [0, 0.5], [0, -120]);
  const rawTitleOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const rawEyeScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.2]);
  const rawEyeOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const bgOpacity = useSpring(rawBgOpacity, { stiffness: 60, damping: 20 });
  const titleY = useSpring(rawTitleY, { stiffness: 70, damping: 22 });
  const titleOpacity = useSpring(rawTitleOpacity, { stiffness: 80, damping: 25 });
  const eyeScale = useSpring(rawEyeScale, { stiffness: 60, damping: 20 });
  const eyeOpacity = useSpring(rawEyeOpacity, { stiffness: 70, damping: 22 });

  return (
    <motion.section
      ref={ref}
      id="scene-hero"
      style={{
        height: '150vh',
        position: 'relative',
        background: 'var(--color-black)',
        overflow: 'hidden',
        willChange: 'transform',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 70% 40%, rgba(224,0,0,0.12) 0%, transparent 50%), radial-gradient(ellipse at 30% 60%, rgba(255,211,0,0.06) 0%, transparent 45%), radial-gradient(ellipse at 50% 50%, rgba(44,85,89,0.05) 0%, transparent 60%)',
          opacity: bgOpacity,
          willChange: 'opacity',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 250px 100px rgba(0,0,0,0.85)',
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.5, y: 0 }}
            transition={{ delay: 1.8, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              textAlign: 'center',
              color: 'var(--color-red)',
              fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)',
              fontWeight: 400,
              letterSpacing: '0.35em',
              marginTop: '2rem',
            }}
          >
            向下滚动 · 坠入深渊
          </motion.p>
        </motion.div>

        <motion.div
          style={{
            scale: eyeScale,
            opacity: eyeOpacity,
            position: 'absolute',
            right: 'clamp(5%, 15vw, 15%)',
            bottom: 'clamp(10%, 20vh, 20%)',
            willChange: 'transform, opacity',
          }}
        >
          <RotatingEye />
        </motion.div>
      </div>
    </motion.section>
  );
}
