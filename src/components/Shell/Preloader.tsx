import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading with staggered progress
    const totalDuration = 2500;
    const interval = 50;
    const steps = totalDuration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      // Non-linear progress: fast start, slow middle, fast finish
      const raw = step / steps;
      const eased = raw < 0.5
        ? 2 * raw * raw
        : 1 - Math.pow(-2 * raw + 2, 2) / 2;
      setProgress(Math.min(100, Math.floor(eased * 100)));
      if (step >= steps) {
        clearInterval(timer);
        setTimeout(() => setLoading(false), 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#050505',
            gap: '3rem',
          }}
        >
          {/* Central glitch text with flicker */}
          <div style={{ position: 'relative' }}>
            <motion.h1
              className="display-md"
              style={{
                color: 'var(--color-yellow)',
                textAlign: 'center',
                letterSpacing: '0.15em',
              }}
              animate={{ opacity: [1, 0.3, 1, 0.6, 1] }}
              transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 2 }}
            >
              撕开表象
            </motion.h1>
            <motion.h1
              className="display-md"
              style={{
                color: 'var(--color-red)',
                textAlign: 'center',
                letterSpacing: '0.15em',
                position: 'absolute',
                top: 0,
                left: -3,
                opacity: 0.3,
              }}
              animate={{ x: [-3, 3, -2, 4, -3], opacity: [0.3, 0, 0.4, 0, 0.3] }}
              transition={{ duration: 0.15, repeat: Infinity }}
            >
              撕开表象
            </motion.h1>
          </div>

          {/* Progress bar */}
          <div
            style={{
              width: 'min(280px, 60vw)',
              height: '2px',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '1px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <motion.div
              style={{
                height: '100%',
                background: 'var(--color-yellow)',
                borderRadius: '1px',
                boxShadow: '0 0 8px rgba(245,200,0,0.5)',
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>

          {/* Progress percentage + decorative element */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <motion.span
              style={{
                fontSize: '0.7rem',
                fontFamily: 'var(--font-body)',
                color: 'var(--color-cream)',
                letterSpacing: '0.2em',
                opacity: 0.5,
              }}
            >
              LOADING
            </motion.span>
            <motion.span
              style={{
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-yellow)',
                fontWeight: 600,
              }}
            >
              {String(progress).padStart(2, '0')}
            </motion.span>
          </div>

          {/* Bottom decorative line */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: '15vh',
              fontSize: '0.6rem',
              color: 'var(--color-teal)',
              letterSpacing: '0.3em',
              opacity: 0.35,
              fontFamily: 'var(--font-body)',
            }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            所见皆虚妄 · NOTHING IS WHAT IT SEEMS
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
