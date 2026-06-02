import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SECTIONS = ['表象', '逐层', '碎裂', '解剖', '真相'];

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
      className="section-nav"
      style={{
        position: 'fixed',
        right: 'clamp(0.75rem, 2vw, 2rem)',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(1rem, 2vw, 1.5rem)',
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
              fontSize: 'clamp(0.6rem, 1vw, 0.75rem)',
              fontWeight: 500,
              letterSpacing: '0.12em',
              color: 'var(--color-yellow)',
              fontFamily: 'var(--font-body)',
            }}
            animate={{
              opacity: i === activeIndex ? 0.9 : 0,
              x: i === activeIndex ? 0 : 10,
            }}
            transition={{ duration: 0.3 }}
          >
            {label}
          </motion.span>
          <motion.div
            style={{
              width: i === activeIndex ? '10px' : '5px',
              height: i === activeIndex ? '10px' : '5px',
              borderRadius: '50%',
              background: i === activeIndex ? 'var(--color-yellow)' : 'transparent',
              border: '1px solid var(--color-yellow)',
              boxShadow: i === activeIndex ? '0 0 8px rgba(255,211,0,0.4)' : 'none',
            }}
            animate={{
              scale: i === activeIndex ? 1.3 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      ))}
    </nav>
  );
}
