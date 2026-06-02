import { useEffect, useState } from 'react';

export function useScrollProgress(elementId?: string) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = elementId ? document.getElementById(elementId) : null;

    function handleScroll() {
      if (el) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const totalHeight = rect.height;
        const scrolled = -rect.top + windowHeight;
        const p = Math.max(0, Math.min(1, scrolled / totalHeight));
        setProgress(p);
      } else {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const p = docHeight > 0 ? Math.max(0, Math.min(1, scrollY / docHeight)) : 0;
        setProgress(p);
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [elementId]);

  return progress;
}
