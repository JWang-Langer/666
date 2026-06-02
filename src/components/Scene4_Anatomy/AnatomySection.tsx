import { useRef, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    }
    resize();
    window.addEventListener('resize', resize);

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    const vessels = Array.from({ length: 20 }, () => {
      const points: { x: number; y: number; phase: number; amp: number }[] = [];
      const numPts = 5 + Math.floor(Math.random() * 8);
      for (let j = 0; j < numPts; j++) {
        points.push({
          x: (j / (numPts - 1)) * w + (Math.random() - 0.5) * w * 0.3,
          y: (Math.random() * 0.6 + 0.2) * h,
          phase: Math.random() * Math.PI * 2,
          amp: 5 + Math.random() * 30,
        });
      }
      return { points, width: 0.3 + Math.random() * 2, speed: 0.3 + Math.random() * 0.7 };
    });

    function render(time: number) {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      ctx.save();
      ctx.scale(dpr, dpr);

      vessels.forEach((v) => {
        ctx.beginPath();
        const pts = v.points;
        ctx.moveTo(pts[0].x, pts[0].y + Math.sin(time * 0.001 * v.speed + pts[0].phase) * pts[0].amp);

        for (let k = 1; k < pts.length - 2; k += 3) {
          const p1 = pts[k];
          const p2 = pts[k + 1];
          const p3 = pts[k + 2];
          ctx.bezierCurveTo(
            p1.x, p1.y + Math.sin(time * 0.001 * v.speed + p1.phase) * p1.amp,
            p2.x, p2.y + Math.sin(time * 0.001 * v.speed + p2.phase) * p2.amp,
            p3.x, p3.y + Math.sin(time * 0.001 * v.speed + p3.phase) * p3.amp
          );
        }

        ctx.strokeStyle = `rgba(224,0,0,${0.15 + Math.random() * 0.1})`;
        ctx.lineWidth = v.width;
        ctx.stroke();
      });

      for (let m = 0; m < 15; m++) {
        const cx = w * 0.1 + (m / 15) * w * 0.8;
        const cy = h * 0.3 + Math.sin(time * 0.0005 + m) * h * 0.2;
        const r = 10 + Math.sin(time * 0.002 + m * 1.5) * 5;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(44,85,89,0.2)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.fillStyle = 'rgba(44,85,89,0.05)';
        ctx.fill();
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    }

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <motion.section
      ref={ref}
      id="scene-anatomy"
      style={{
        height: '250vh',
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
          overflow: 'hidden',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.7,
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            pointerEvents: 'none',
          }}
        >
          <div style={{ maxWidth: '650px' }}>
            <h2
              className="display-md text-yellow"
              data-glitch="BENEATH THE SKIN"
              style={{ marginBottom: '3rem' }}
            >
              BENEATH
              <br />
              THE SKIN
            </h2>

            <GlitchParagraph />
          </div>
        </div>

        <PulseRing count={5} scrollYProgress={scrollYProgress} />
      </div>
    </motion.section>
  );
}
