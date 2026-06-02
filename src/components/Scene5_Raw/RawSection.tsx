import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { FallingText } from './FallingText';

export function RawSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const rawTextOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const rawTextScale = useTransform(scrollYProgress, [0.2, 0.6], [0.85, 1]);
  const rawTextY = useTransform(scrollYProgress, [0.2, 0.55], [40, 0]);

  const textOpacity = useSpring(rawTextOpacity, { stiffness: 50, damping: 20 });
  const textScale = useSpring(rawTextScale, { stiffness: 45, damping: 18 });
  const textY = useSpring(rawTextY, { stiffness: 40, damping: 16 });

  return (
    <motion.section
      ref={ref}
      id="scene-raw"
      style={{ height: '140vh', position: 'relative', background: 'var(--color-black)', overflow: 'hidden' }}
    >
      <div
        style={{
          position: 'sticky', top: 0, height: '100vh',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <FallingText />

        <motion.div style={{ opacity: textOpacity, scale: textScale, y: textY, textAlign: 'center', willChange: 'transform, opacity' }}>
          <h1
            className="display-xl text-yellow"
            data-glitch="然后呢？"
            style={{ textAlign: 'center', textShadow: '0 0 60px rgba(245,200,0,0.12)', lineHeight: 1.1 }}
          >
            然后<br />呢？
          </h1>
          <p className="body-lg" style={{ marginTop: '2.5rem', opacity: 0.35, color: 'var(--color-cream)', maxWidth: '500px', lineHeight: 1.8 }}>
            表象已去。你看见了始终存在的真相。<br />
            <span className="text-yellow" style={{ opacity: 0.6, letterSpacing: '0.05em' }}>
              从这里开始，你将建造什么？
            </span>
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
