import { useState, useEffect, useCallback } from 'react';
import { MousePositionContext, type MousePosition } from './hooks/useMousePosition';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { NoiseOverlay } from './components/Shell/NoiseOverlay';
import { Preloader } from './components/Shell/Preloader';
import { Navigation } from './components/Shell/Navigation';
import { HeroSection } from './components/Scene1_Hero/HeroSection';
import { SurfaceSection } from './components/Scene2_Surface/SurfaceSection';
import { ShatterSection } from './components/Scene3_Shatter/ShatterSection';
import { AnatomySection } from './components/Scene4_Anatomy/AnatomySection';
import { RawSection } from './components/Scene5_Raw/RawSection';

export default function App() {
  useSmoothScroll();
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <MousePositionContext.Provider value={mousePos}>
      <Preloader />
      <NoiseOverlay />
      <Navigation />
      <main>
        <HeroSection />
        <SurfaceSection />
        <ShatterSection />
        <AnatomySection />
        <RawSection />
      </main>
    </MousePositionContext.Provider>
  );
}
