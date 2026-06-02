import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-black)',
            gap: '2rem',
          }}
        >
          <h1
            data-glitch="撕开表象"
            className="display-md text-yellow"
            style={{ textAlign: 'center' }}
          >
            撕开表象
          </h1>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: '2px solid var(--color-yellow)',
              animation: 'preloader-pulse 2s ease-in-out infinite',
              boxShadow: '0 0 20px rgba(255,211,0,0.3)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
