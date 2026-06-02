import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SECTIONS = ['SURFACE', 'DESCENT', 'SHATTER', 'ANATOMY', 'RAW'];

export function Navigation() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY;
      const totalH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = totalH > 0 ? scrollY / totalH : 0;
      const idx = Math.min(SECTIONS.length - 1, Math.floor(pct * SECTIONS.length));
      setActiveIndex(idx);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        right: '2rem',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      {SECTIONS.map((label, i) => (
        <motion.div
          key={label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexDirection: 'row-reverse',
          }}
        >
          <motion.span
            style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              color: 'var(--color-yellow)',
              fontFamily: 'var(--font-body)',
              textTransform: 'uppercase',
            }}
            animate={{
              opacity: i === activeIndex ? 1 : 0,
              x: i === activeIndex ? 0 : 10,
            }}
            transition={{ duration: 0.3 }}
          >
            {label}
          </motion.span>
          <motion.div
            style={{
              width: i === activeIndex ? '10px' : '6px',
              height: i === activeIndex ? '10px' : '6px',
              borderRadius: '50%',
              border: '1px solid var(--color-yellow)',
            }}
            animate={{
              background: i === activeIndex ? 'var(--color-yellow)' : 'transparent',
              scale: i === activeIndex ? 1.2 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      ))}
    </nav>
  );
}
