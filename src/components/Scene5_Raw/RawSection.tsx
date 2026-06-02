import { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import { FallingText } from './FallingText';

export function RawSection() {
  const ref = useRef<HTMLElement>(null);
  useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  return (
    <motion.section
      ref={ref}
      id="scene-raw"
      style={{
        height: '120vh',
        position: 'relative',
        background: 'var(--color-black)',
        overflow: 'hidden',
      }}
    >
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
        <FallingText />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          style={{ textAlign: 'center' }}
        >
          <h1
            className="display-xl text-yellow"
            data-glitch="然后呢？"
            style={{
              textAlign: 'center',
              textShadow: '0 0 50px rgba(255,211,0,0.15)',
              lineHeight: 1.1,
            }}
          >
            然后
            <br />
            呢？
          </h1>
          <p
            className="body-lg"
            style={{
              marginTop: '2.5rem',
              opacity: 0.35,
              color: 'var(--color-cream)',
              maxWidth: '500px',
              lineHeight: 1.8,
            }}
          >
            表象已去。你看见了始终存在的真相。
            <br />
            <span className="text-yellow" style={{ opacity: 0.6, letterSpacing: '0.05em' }}>
              从这里开始，你将建造什么？
            </span>
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
