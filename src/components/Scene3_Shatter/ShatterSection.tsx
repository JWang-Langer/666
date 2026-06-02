import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { shatterImage, type ShatterFragment } from '../../utils/shatter';

export function ShatterSection() {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fragmentsRef = useRef<ShatterFragment[]>([]);
  const animFrameRef = useRef<number>(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const overlayOpacity = useTransform(scrollYProgress, [0.6, 0.9], [0, 1]);

  // Initialize fragments
  useEffect(() => {
    fragmentsRef.current = shatterImage(10, 8, 0.3);
  }, []);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    function render() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, w, h);

      // Draw abstract center mass (placeholder for image)
      const cx = w / 2;
      const cy = h / 2;

      // Draw "face" outline
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(w, h) * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = '#1a1510';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,211,0,0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Eye sockets
      [-1, 1].forEach((side) => {
        ctx.beginPath();
        ctx.ellipse(
          cx + side * (w * 0.1),
          cy - h * 0.04,
          w * 0.06,
          h * 0.1,
          0,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = '#000';
        ctx.fill();
        ctx.strokeStyle = 'rgba(224,0,0,0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Mouth/nose abstract
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.05, cy + h * 0.05);
      ctx.lineTo(cx, cy + h * 0.12);
      ctx.lineTo(cx + w * 0.05, cy + h * 0.05);
      ctx.strokeStyle = 'rgba(255,211,0,0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Anatomical lines
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + Date.now() * 0.0001;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.quadraticCurveTo(
          cx + Math.cos(angle) * w * 0.15,
          cy + Math.sin(angle) * h * 0.2,
          cx + Math.cos(angle + 0.5) * w * 0.35,
          cy + Math.sin(angle + 0.5) * h * 0.35
        );
        ctx.strokeStyle = 'rgba(44,85,89,0.3)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      animFrameRef.current = requestAnimationFrame(render);
    }

    render();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  return (
    <motion.section
      ref={ref}
      id="scene-shatter"
      style={{
        height: '200vh',
        position: 'relative',
        background: 'var(--color-near-black)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: 'min(80vw, 500px)',
            height: 'min(80vw, 500px)',
          }}
        />

        {/* Shatter overlay text */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: overlayOpacity,
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.95) 100%)',
            pointerEvents: 'none',
          }}
        >
          <h2
            className="display-lg text-yellow"
            data-glitch="WHAT REMAINS"
            style={{ textAlign: 'center' }}
          >
            WHAT REMAINS
            <br />
            <span className="display-md text-red" style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1.1rem)' }}>
              WHEN EVERYTHING IS STRIPPED AWAY
            </span>
          </h2>
        </motion.div>
      </div>
    </motion.section>
  );
}
