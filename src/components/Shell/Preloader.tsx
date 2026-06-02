import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-black)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h1
              data-glitch="PEEL BACK"
              className="display-md text-yellow"
              style={{ marginBottom: '1rem' }}
            >
              PEEL BACK
            </h1>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: '2px solid var(--color-yellow)',
                margin: '0 auto',
                animation: 'preloader-pulse 2s ease-in-out infinite',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
