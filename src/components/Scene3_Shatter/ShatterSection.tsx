import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { HeartFragment } from '../../utils/shatter';

function generateHeartFragments(
  cx: number,
  cy: number,
  size: number,
  count: number
): HeartFragment[] {
  const frags: HeartFragment[] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * size * 0.8;
    const ox = cx + Math.cos(angle) * dist * (0.8 + Math.random() * 0.4);
    const oy =
      cy +
      Math.sin(angle) * dist * 0.7 +
      (Math.random() - 0.5) * size * 0.2;
    const speed = 0.3 + Math.random() * 1.5;

    // Heart tissue colors
    const colors = [
      '#CC0000',
      '#8B0000',
      '#4A0000',
      '#E02020',
      '#6B1010',
      '#A00000',
      '#FF1A1A',
      '#3D0000',
    ];

    frags.push({
      x: ox,
      y: oy,
      vx: (Math.random() - 0.5) * speed * 2,
      vy: (Math.random() - 0.8) * speed * 1.5 - 0.3,
      origX: ox,
      origY: oy,
      size: 2 + Math.random() * 8,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.08,
      opacity: 0.7 + Math.random() * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
    });
  }
  return frags;
}

function drawHeartShape(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(size / 180, size / 180);
  ctx.beginPath();
  ctx.moveTo(0, 30);
  ctx.bezierCurveTo(-50, -30, -90, 40, 0, 120);
  ctx.bezierCurveTo(90, 40, 50, -30, 0, 30);
  ctx.closePath();
  ctx.restore();
}

export function ShatterSection() {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fragmentsRef = useRef<HeartFragment[]>([]);
  const animFrameRef = useRef<number>(0);
  const stateRef = useRef<{ phase: 'intact' | 'cracking' | 'exploding' | 'gone'; progress: number }>(
    { phase: 'intact', progress: 0 }
  );

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const overlayOpacity = useTransform(scrollYProgress, [0.55, 0.9], [0, 1]);
  const canvasScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.82]);

  // Track scroll progress for shattered state
  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      const s = stateRef.current;
      if (v < 0.2) s.phase = 'intact';
      else if (v < 0.45) s.phase = 'cracking';
      else if (v < 0.85) s.phase = 'exploding';
      else s.phase = 'gone';
      s.progress = v;
    });
    return unsub;
  }, [scrollYProgress]);

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
    const cx = w / 2;
    const cy = h / 2;
    const heartSize = Math.min(w, h) * 0.38;
    const fragCount = 120;

    // Generate fragments once
    if (fragmentsRef.current.length === 0) {
      fragmentsRef.current = generateHeartFragments(
        cx,
        cy,
        heartSize,
        fragCount
      );
    }

    function drawIntactHeart(ctx: CanvasRenderingContext2D, beat: number) {
      const pulse = 1 + Math.sin(beat * 0.03) * 0.04;
      const size = heartSize * pulse;

      // Outer glow
      const glow = ctx.createRadialGradient(cx, cy, size * 0.3, cx, cy, size * 0.8);
      glow.addColorStop(0, 'rgba(200,0,0,0.15)');
      glow.addColorStop(0.5, 'rgba(180,0,0,0.06)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Heart shadow behind
      drawHeartShape(ctx, cx + 2, cy + 2, size);
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fill();

      // Main heart - rich gradient
      drawHeartShape(ctx, cx, cy, size);
      const hGrad = ctx.createRadialGradient(
        cx - size * 0.15,
        cy - size * 0.1,
        size * 0.05,
        cx,
        cy,
        size * 0.6
      );
      hGrad.addColorStop(0, '#E02020');
      hGrad.addColorStop(0.3, '#CC0000');
      hGrad.addColorStop(0.6, '#8B0000');
      hGrad.addColorStop(0.85, '#3D0000');
      hGrad.addColorStop(1, '#1A0000');
      ctx.fillStyle = hGrad;
      ctx.fill();

      // Highlight / specular
      drawHeartShape(ctx, cx, cy, size);
      const hlGrad = ctx.createRadialGradient(
        cx - size * 0.25,
        cy - size * 0.2,
        0,
        cx,
        cy,
        size * 0.5
      );
      hlGrad.addColorStop(0, 'rgba(255,255,255,0.15)');
      hlGrad.addColorStop(0.3, 'rgba(255,200,200,0.06)');
      hlGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = hlGrad;
      ctx.fill();
    }

    function drawCracks(
      ctx: CanvasRenderingContext2D,
      progress: number,
      beat: number
    ) {
      const numCracks = Math.floor(progress * 25);
      const pulse = 1 + Math.sin(beat * 0.03) * 0.02;

      for (let i = 0; i < numCracks; i++) {
        // Seed pseudo-random based on index
        const seed = i * 7.391;
        const a1 = (seed * 13.7) % (Math.PI * 2);
        const a2 = a1 + ((seed * 3.1) % 0.8 - 0.4);
        const r1 = heartSize * (0.08 + (seed % 0.3)) * pulse;
        const r2 = heartSize * (0.3 + (seed % 0.5)) * pulse;
        const x1 = cx + Math.cos(a1) * r1;
        const y1 = cy + Math.sin(a1) * r1 * 0.7;
        const x2 = cx + Math.cos(a2) * r2;
        const y2 = cy + Math.sin(a2) * r2 * 0.7;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        // Jagged crack
        const mx = (x1 + x2) / 2 + (Math.sin(seed * 5 + beat * 0.01) * heartSize * 0.05);
        const my = (y1 + y2) / 2 + (Math.cos(seed * 7 + beat * 0.01) * heartSize * 0.05);
        ctx.lineTo(mx, my);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(0,0,0,${0.5 + Math.random() * 0.3})`;
        ctx.lineWidth = 1 + Math.random() * 2;
        ctx.stroke();

        // Glow crack highlight
        ctx.beginPath();
        ctx.moveTo(x1 + 1, y1 + 1);
        ctx.lineTo(mx + 1, my + 1);
        ctx.lineTo(x2 + 1, y2 + 1);
        ctx.strokeStyle = `rgba(255,80,80,${0.2 + Math.random() * 0.3})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }

    function render(time: number) {
      if (!ctx || !canvas) return;
      const s = stateRef.current;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      // Background vignette
      const bgGlow = ctx.createRadialGradient(cx, cy, heartSize * 0.2, cx, cy, Math.max(w, h));
      bgGlow.addColorStop(0, 'rgba(50,0,0,0.15)');
      bgGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, w, h);

      const expProgress = Math.max(
        0,
        Math.min(1, (s.progress - 0.4) / 0.45)
      );

      if (s.phase === 'intact' || s.phase === 'cracking') {
        // Draw intact or cracking heart
        drawIntactHeart(ctx, time);

        if (s.phase === 'cracking') {
          const crackProgress = Math.min(1, (s.progress - 0.2) / 0.25);
          drawCracks(ctx, crackProgress, time);
        }
      }

      // Draw fragments (exploding phase)
      if (s.phase === 'exploding' || s.phase === 'gone') {
        const frags = fragmentsRef.current;

        // Fading intact heart in early explosion
        if (expProgress < 0.4) {
          ctx.globalAlpha = 1 - expProgress / 0.4;
          drawIntactHeart(ctx, time);
          ctx.globalAlpha = 1;
        }

        // Draw each fragment
        frags.forEach((f) => {
          const fragProgress = Math.max(
            0,
            Math.min(1, (expProgress - f.delay) / 0.6)
          );
          if (fragProgress <= 0) return;

          const fx = f.origX + f.vx * fragProgress * heartSize;
          const fy = f.origY + f.vy * fragProgress * heartSize;
          const fRot = f.rotation + f.rotSpeed * fragProgress * 10;
          const fAlpha = f.opacity * (1 - fragProgress);

          ctx.save();
          ctx.translate(fx, fy);
          ctx.rotate(fRot);
          ctx.globalAlpha = fAlpha;

          // Fragment as irregular polygon
          ctx.beginPath();
          const s = f.size;
          ctx.moveTo(-s * 0.6, -s * 0.8);
          ctx.lineTo(s * 0.7, -s * 0.3);
          ctx.lineTo(s * 0.5, s * 0.6);
          ctx.lineTo(-s * 0.4, s * 0.7);
          ctx.lineTo(-s * 0.8, s * 0.1);
          ctx.closePath();
          ctx.fillStyle = f.color;
          ctx.fill();
          ctx.restore();
        });
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
          background:
            'radial-gradient(ellipse at center, rgba(224,0,0,0.05) 0%, rgba(0,0,0,0) 60%)',
        }}
      >
        <motion.canvas
          ref={canvasRef}
          style={{
            width: 'min(80vw, 520px)',
            height: 'min(80vw, 520px)',
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
              'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.95) 100%)',
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
