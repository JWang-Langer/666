import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { GlitchParagraph } from './GlitchParagraph';
import { PulseRing } from './PulseRing';

export function AnatomySection() {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Parallax on canvas
  const rawParallax = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const parallaxY = useSpring(rawParallax, { stiffness: 30, damping: 15 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    }
    resize();
    window.addEventListener('resize', resize);

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    const vessels = Array.from({ length: 24 }, () => {
      const pts: { x: number; y: number; phase: number; amp: number }[] = [];
      const numPts = 5 + Math.floor(Math.random() * 8);
      for (let j = 0; j < numPts; j++) {
        pts.push({
          x: (j / (numPts - 1)) * w + (Math.random() - 0.5) * w * 0.25,
          y: (Math.random() * 0.5 + 0.25) * h,
          phase: Math.random() * Math.PI * 2,
          amp: 6 + Math.random() * 35,
        });
      }
      return { points: pts, width: 0.4 + Math.random() * 2.2, speed: 0.15 + Math.random() * 0.6 };
    });

    function render(time: number) {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      ctx.save();
      ctx.scale(dpr, dpr);

      // Center glow
      const glowR = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.min(w, h) * 0.4);
      glowR.addColorStop(0, 'rgba(224,0,0,0.03)');
      glowR.addColorStop(1, 'transparent');
      ctx.fillStyle = glowR;
      ctx.fillRect(0, 0, w, h);

      // Slow vessels
      vessels.forEach((v) => {
        ctx.beginPath();
        const pts = v.points;
        ctx.moveTo(pts[0].x, pts[0].y + Math.sin(time * 0.0006 * v.speed + pts[0].phase) * pts[0].amp);
        for (let k = 1; k < pts.length - 2; k += 3) {
          ctx.bezierCurveTo(
            pts[k].x, pts[k].y + Math.sin(time * 0.0006 * v.speed + pts[k].phase) * pts[k].amp,
            pts[k + 1].x, pts[k + 1].y + Math.sin(time * 0.0006 * v.speed + pts[k + 1].phase) * pts[k + 1].amp,
            pts[k + 2].x, pts[k + 2].y + Math.sin(time * 0.0006 * v.speed + pts[k + 2].phase) * pts[k + 2].amp
          );
        }
        ctx.strokeStyle = `rgba(224,0,0,${0.08 + Math.random() * 0.06})`;
        ctx.lineWidth = v.width;
        ctx.stroke();
      });

      // Cells
      for (let m = 0; m < 18; m++) {
        const cx = w * 0.08 + (m / 18) * w * 0.84;
        const cy = h * 0.28 + Math.sin(time * 0.0003 + m * 0.7) * h * 0.22;
        const r = 8 + Math.sin(time * 0.001 + m * 1.3) * 4;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(44,85,89,0.18)';
        ctx.lineWidth = 0.6;
        ctx.stroke();
        ctx.fillStyle = 'rgba(44,85,89,0.04)';
        ctx.fill();
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    }

    animFrameRef.current = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(animFrameRef.current); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <motion.section
      ref={ref}
      id="scene-anatomy"
      style={{ height: '220vh', position: 'relative', background: 'var(--color-black)', overflow: 'hidden' }}
    >
      <div
        style={{
          position: 'sticky', top: 0, height: '100vh', overflow: 'hidden',
          background: 'radial-gradient(ellipse at 30% 50%, rgba(224,0,0,0.03) 0%, transparent 50%)',
        }}
      >
        <motion.canvas
          ref={canvasRef}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            opacity: 0.75, y: parallaxY, willChange: 'transform',
          }}
        />

        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', pointerEvents: 'none' }}>
          <div style={{ maxWidth: '620px' }}>
            <h2 className="display-md text-yellow" data-glitch="皮囊之下" style={{ marginBottom: '3rem', textShadow: '0 0 30px rgba(245,200,0,0.1)', lineHeight: 1.2 }}>
              皮囊<br />之下
            </h2>
            <GlitchParagraph />
          </div>
        </div>

        <PulseRing count={5} scrollYProgress={scrollYProgress} />
      </div>
    </motion.section>
  );
}
