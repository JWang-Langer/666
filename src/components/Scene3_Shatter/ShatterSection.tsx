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

  const overlayOpacity = useTransform(scrollYProgress, [0.55, 0.85], [0, 1]);
  const canvasScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.85]);

  useEffect(() => {
    fragmentsRef.current = shatterImage(10, 8, 0.3);
  }, []);

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

    function render() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const t = Date.now() * 0.0005;

      // Glow behind face
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.35);
      glow.addColorStop(0, 'rgba(224,0,0,0.06)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Face outline
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(w, h) * 0.28, 0, Math.PI * 2);
      ctx.fillStyle = '#14100c';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,211,0,0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Crack lines on face (animated)
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + t * 0.3;
        const startR = Math.min(w, h) * 0.05;
        const endR = Math.min(w, h) * 0.28;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * startR, cy + Math.sin(angle) * startR);
        ctx.lineTo(cx + Math.cos(angle + 0.3) * endR, cy + Math.sin(angle + 0.3) * endR);
        ctx.strokeStyle = 'rgba(224,0,0,0.3)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Eye sockets
      [-1, 1].forEach((side) => {
        ctx.beginPath();
        ctx.ellipse(
          cx + side * (w * 0.09),
          cy - h * 0.03,
          w * 0.055,
          h * 0.09,
          0,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = '#000';
        ctx.fill();
        ctx.strokeStyle = 'rgba(224,0,0,0.6)';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(224,0,0,0.3)';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Mouth — subtle curve
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.06, cy + h * 0.06);
      ctx.quadraticCurveTo(cx, cy + h * 0.13, cx + w * 0.06, cy + h * 0.06);
      ctx.strokeStyle = 'rgba(255,211,0,0.35)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Anatomical web lines
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2 + t * 0.15;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.quadraticCurveTo(
          cx + Math.cos(angle) * w * 0.12,
          cy + Math.sin(angle) * h * 0.18,
          cx + Math.cos(angle + 0.6) * w * 0.38,
          cy + Math.sin(angle + 0.6) * h * 0.38
        );
        ctx.strokeStyle = 'rgba(44,85,89,0.25)';
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      // Pulsing center point
      const pulse = Math.sin(t * 3) * 0.3 + 0.7;
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,211,0,${pulse})`;
      ctx.fill();

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
          background: 'radial-gradient(ellipse at center, rgba(224,0,0,0.04) 0%, transparent 60%)',
        }}
      >
        <motion.canvas
          ref={canvasRef}
          style={{
            width: 'min(75vw, 480px)',
            height: 'min(75vw, 480px)',
            scale: canvasScale,
          }}
        />

        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: overlayOpacity,
            background:
              'radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.95) 100%)',
            pointerEvents: 'none',
          }}
        >
          <h2
            className="display-lg text-yellow"
            data-glitch="还剩什么"
            style={{
              textAlign: 'center',
              textShadow: '0 0 40px rgba(255,211,0,0.15)',
            }}
          >
            还剩什么
            <br />
            <span
              className="display-md text-red"
              style={{
                fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)',
                fontWeight: 400,
                letterSpacing: '0.15em',
              }}
            >
              当一切被剥离之后
            </span>
          </h2>
        </motion.div>
      </div>
    </motion.section>
  );
}
