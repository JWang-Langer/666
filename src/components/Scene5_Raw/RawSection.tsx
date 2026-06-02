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
        {/* Falling text rain */}
        <FallingText />

        {/* Final message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          style={{ textAlign: 'center' }}
        >
          <h1
            className="display-xl text-yellow"
            data-glitch="NOW WHAT?"
            style={{ textAlign: 'center' }}
          >
            NOW
            <br />
            WHAT?
          </h1>
          <p
            className="body-lg"
            style={{
              marginTop: '2rem',
              opacity: 0.4,
              color: 'var(--color-cream)',
            }}
          >
            The surface is gone. You see what was always there.
            <br />
            <span className="text-yellow" style={{ opacity: 0.7 }}>
              What will you build from here?
            </span>
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
