import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { HeartFragment } from '../../utils/shatter';

/* ================================================================
 * PHOTOREALISTIC HUMAN HEART - procedural Canvas 2D rendering
 *
 * This renders an anatomically plausible human heart using:
 * - Bezier curves for the 4 chambers, great vessels, and pericardium
 * - Radial gradients simulating wet tissue, fat, and blood
 * - Vein/artery surface details rendered as stroke overlays
 * ================================================================ */

// Heart tissue palette - realistic deep reds, purples, blues from real anatomy
const TISSUE = {
  myocardium: ['#8B0000', '#A01010', '#6B0000', '#C02020', '#4A0000', '#901818'],
  fat: ['#E8D5A0', '#D4C090', '#C8B878', '#E0CF95', '#DDC888'],
  artery: ['#C04040', '#D06060', '#B03030', '#E08080'],
  vein: ['#4040A0', '#5050B0', '#303080', '#6060C0'],
  blood: ['#1A0000', '#2D0000', '#0A0000', '#3A0000', '#200000'],
  pericardium: ['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.02)'],
  tearEdge: ['#FF3030', '#E02020', '#FF4848', '#CC1010', '#FF2020'],
};

function drawRealisticHeart(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  beat: number
) {
  const s = size / 260; // scale factor (base unit 260px)
  const pulse = 1 + Math.sin(beat * 0.025) * 0.035;

  ctx.save();

  /* --- Pericardium (outer sac) --- */
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s * pulse, s * pulse * 0.95);
  ctx.beginPath();
  ctx.moveTo(0, -150);
  ctx.bezierCurveTo(70, -140, 110, -40, 100, 50);
  ctx.bezierCurveTo(95, 110, 60, 160, 0, 170);
  ctx.bezierCurveTo(-60, 160, -95, 110, -100, 50);
  ctx.bezierCurveTo(-110, -40, -70, -140, 0, -150);
  ctx.closePath();
  ctx.fillStyle = 'rgba(5,0,0,0.3)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  /* === MAIN HEART BODY === */
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s * pulse, s * pulse * 0.95);

  // Heart silhouette - human heart shape
  ctx.beginPath();
  // Apex (bottom point)
  ctx.moveTo(0, 155);
  // Right ventricle
  ctx.bezierCurveTo(-25, 150, -55, 120, -70, 70);
  ctx.bezierCurveTo(-85, 20, -60, -40, -35, -80);
  // Right atrium top
  ctx.bezierCurveTo(-25, -105, -60, -115, -50, -135);
  ctx.bezierCurveTo(-40, -150, -10, -155, 0, -160);
  // Top - great vessels emerge
  ctx.lineTo(0, -160);
  ctx.bezierCurveTo(10, -155, 40, -150, 50, -135);
  ctx.bezierCurveTo(60, -115, 25, -105, 35, -80);
  // Left ventricle
  ctx.bezierCurveTo(60, -40, 85, 20, 70, 70);
  ctx.bezierCurveTo(55, 120, 25, 150, 0, 155);
  ctx.closePath();

  // Base myocardium gradient
  const bodyGrad = ctx.createRadialGradient(-10, -20, 20, 5, 30, 160);
  bodyGrad.addColorStop(0, '#C02828');
  bodyGrad.addColorStop(0.15, '#A01818');
  bodyGrad.addColorStop(0.35, '#8B0000');
  bodyGrad.addColorStop(0.55, '#6B0000');
  bodyGrad.addColorStop(0.75, '#4A0000');
  bodyGrad.addColorStop(0.9, '#2D0000');
  bodyGrad.addColorStop(1, '#150000');
  ctx.fillStyle = bodyGrad;
  ctx.fill();

  // Surface specular highlight (wet tissue shine)
  const spec = ctx.createRadialGradient(-25, -45, 5, -5, 10, 120);
  spec.addColorStop(0, 'rgba(255,255,255,0.12)');
  spec.addColorStop(0.2, 'rgba(255,220,220,0.06)');
  spec.addColorStop(0.5, 'rgba(255,180,180,0.03)');
  spec.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = spec;
  ctx.fill();

  ctx.restore();

  /* --- Great Vessels (aorta, pulmonary artery, SVC) --- */
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s * pulse, s * pulse * 0.95);

  // Aorta - thick, emerging from top center, curving right
  ctx.beginPath();
  ctx.moveTo(-5, -155);
  ctx.bezierCurveTo(-5, -180, 30, -190, 50, -175);
  ctx.bezierCurveTo(65, -162, 55, -145, 40, -140);
  ctx.bezierCurveTo(25, -138, 5, -145, 0, -155);
  ctx.closePath();
  const aortaGrad = ctx.createLinearGradient(-5, -190, 50, -140);
  aortaGrad.addColorStop(0, '#D04040');
  aortaGrad.addColorStop(0.4, '#C03030');
  aortaGrad.addColorStop(1, '#901818');
  ctx.fillStyle = aortaGrad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,200,200,0.12)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Pulmonary artery - left side, thinner
  ctx.beginPath();
  ctx.moveTo(5, -150);
  ctx.bezierCurveTo(10, -175, -20, -185, -40, -170);
  ctx.bezierCurveTo(-50, -162, -35, -148, -15, -145);
  ctx.bezierCurveTo(0, -143, 3, -148, 5, -150);
  ctx.closePath();
  const paGrad = ctx.createLinearGradient(5, -185, -40, -148);
  paGrad.addColorStop(0, '#C84848');
  paGrad.addColorStop(1, '#8B2020');
  ctx.fillStyle = paGrad;
  ctx.fill();

  ctx.restore();

  /* --- Coronary arteries (surface) --- */
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s * pulse, s * pulse * 0.95);

  const drawCoronary = (points: [number, number][], color: string, width: number) => {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length - 2; i += 3) {
      ctx.bezierCurveTo(
        points[i][0], points[i][1],
        points[i + 1][0], points[i + 1][1],
        points[i + 2][0], points[i + 2][1]
      );
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  };

  // LAD (left anterior descending)
  const lad: [number, number][] = [
    [0, -125], [-8, -80], [-15, -50], [-25, -10],
    [-20, 30], [-10, 70], [-2, 100], [1, 130]
  ];
  for (let pass = 0; pass < 3; pass++) {
    drawCoronary(
      lad.map(([x, y]) => [x + (Math.random() - 0.5) * 3, y + (Math.random() - 0.5) * 3] as [number, number]),
      pass === 0 ? 'rgba(200,40,40,0.6)' : pass === 1 ? 'rgba(255,100,100,0.25)' : 'rgba(100,0,0,0.4)',
      3 - pass * 1.2
    );
  }

  // RCA (right coronary artery)
  const rca: [number, number][] = [
    [10, -120], [25, -70], [35, -20], [40, 30], [30, 70], [15, 110]
  ];
  drawCoronary(rca, 'rgba(180,30,30,0.55)', 2.2);
  drawCoronary(rca.map(([x, y]) => [x - 1, y - 1] as [number, number]), 'rgba(255,120,120,0.2)', 1);

  ctx.restore();

  /* --- Surface veins (dark blue-purple) --- */
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s * pulse, s * pulse * 0.95);

  const veinPaths: [number, number][][] = [
    [[-30, -60], [-50, -20], [-60, 20], [-55, 60], [-40, 100]],
    [[30, -50], [50, -10], [55, 30], [45, 70], [30, 105]],
    [[-15, -80], [-25, -40], [-35, 0], [-30, 40]],
    [[15, -70], [20, -35], [25, 5], [20, 45]],
  ];

  veinPaths.forEach((pts) => {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length - 2; i += 3) {
      const cp1 = pts[i] || pts[i - 1];
      const cp2 = pts[i + 1] || pts[i];
      const end = pts[i + 2] || pts[pts.length - 1];
      ctx.bezierCurveTo(cp1[0], cp1[1], cp2[0], cp2[1], end[0], end[1]);
    }
    ctx.strokeStyle = 'rgba(60,40,120,0.45)';
    ctx.lineWidth = 1.8;
    ctx.stroke();
    // Highlight
    ctx.beginPath();
    ctx.moveTo(pts[0][0] + 1, pts[0][1]);
    for (let i = 1; i < pts.length - 2; i += 3) {
      const cp1 = pts[i] || pts[i - 1];
      const cp2 = pts[i + 1] || pts[i];
      const end = pts[i + 2] || pts[pts.length - 1];
      ctx.bezierCurveTo(cp1[0] + 1, cp1[1], cp2[0] + 1, cp2[1], end[0] + 1, end[1]);
    }
    ctx.strokeStyle = 'rgba(120,100,180,0.2)';
    ctx.lineWidth = 0.6;
    ctx.stroke();
  });

  ctx.restore();

  /* --- Fat deposits (yellowish patches on surface) --- */
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s * pulse, s * pulse * 0.95);

  const fatPatches: { cx: number; cy: number; rx: number; ry: number; angle: number }[] = [
    { cx: -40, cy: 60, rx: 18, ry: 10, angle: -0.3 },
    { cx: 35, cy: -30, rx: 14, ry: 8, angle: 0.2 },
    { cx: 0, cy: -100, rx: 12, ry: 7, angle: 0 },
    { cx: -20, cy: 40, rx: 10, ry: 6, angle: -0.5 },
    { cx: 25, cy: 80, rx: 11, ry: 7, angle: 0.4 },
  ];

  fatPatches.forEach((p) => {
    ctx.save();
    ctx.translate(p.cx, p.cy);
    ctx.rotate(p.angle);
    ctx.beginPath();
    ctx.ellipse(0, 0, p.rx, p.ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(210,190,140,0.25)';
    ctx.fill();
    ctx.restore();
  });

  ctx.restore();

  /* --- Overall wet-tissue specular sheen --- */
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s * pulse, s * pulse * 0.95);

  ctx.beginPath();
  ctx.moveTo(0, 155);
  ctx.bezierCurveTo(-25, 150, -55, 120, -70, 70);
  ctx.bezierCurveTo(-85, 20, -60, -40, -35, -80);
  ctx.bezierCurveTo(-25, -105, -60, -115, -50, -135);
  ctx.bezierCurveTo(-40, -150, -10, -155, 0, -160);
  ctx.lineTo(0, -160);
  ctx.bezierCurveTo(10, -155, 40, -150, 50, -135);
  ctx.bezierCurveTo(60, -115, 25, -105, 35, -80);
  ctx.bezierCurveTo(60, -40, 85, 20, 70, 70);
  ctx.bezierCurveTo(55, 120, 25, 150, 0, 155);
  ctx.closePath();

  // Second specular pass for wetness
  const wetSpec = ctx.createRadialGradient(-20, -35, 10, 0, 20, 150);
  wetSpec.addColorStop(0, 'rgba(255,255,255,0.08)');
  wetSpec.addColorStop(0.3, 'rgba(255,230,230,0.04)');
  wetSpec.addColorStop(0.7, 'rgba(255,200,200,0.01)');
  wetSpec.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = wetSpec;
  ctx.fill();

  ctx.restore();

  ctx.restore(); // end main ctx.save()
}

/* ---- Fragment generation ---- */
function generateHeartFragments(
  cx: number,
  cy: number,
  size: number,
  count: number
): HeartFragment[] {
  const frags: HeartFragment[] = [];
  const s = size / 260;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * size * 0.75 * s;
    const ox = cx + Math.cos(angle) * dist * 0.9;
    const oy = cy + Math.sin(angle) * dist * 0.85;

    const speed = 0.2 + Math.random() * 1.8;
    const fragSize = 3 + Math.random() * 14;

    // Generate clip polygon (irregular)
    const numVertices = 4 + Math.floor(Math.random() * 4);
    const clipPoints: { x: number; y: number }[] = [];
    for (let v = 0; v < numVertices; v++) {
      const va = (v / numVertices) * Math.PI * 2;
      const r = fragSize * (0.5 + Math.random() * 0.5);
      clipPoints.push({
        x: Math.cos(va) * r,
        y: Math.sin(va) * r,
      });
    }

    // Colors: mix of tissue, artery wall, fat, blood
    const allColors = [
      ...TISSUE.myocardium,
      ...TISSUE.tearEdge,
      ...TISSUE.blood,
      '#901010', '#701010', '#B02020', '#5A0000',
    ];

    frags.push({
      x: ox,
      y: oy,
      vx: (Math.random() - 0.5) * speed * 2.5,
      vy: (Math.random() - 0.7) * speed * 2 - 0.5,
      origX: ox,
      origY: oy,
      size: fragSize,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.1,
      opacity: 0.6 + Math.random() * 0.4,
      color: allColors[Math.floor(Math.random() * allColors.length)],
      delay: Math.random() * 0.6,
      clipPoints,
    });
  }
  return frags;
}

/* ================================================================
 * MAIN COMPONENT
 * ================================================================ */
export function ShatterSection() {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heartImgRef = useRef<ImageData | null>(null);
  const fragmentsRef = useRef<HeartFragment[]>([]);
  const animFrameRef = useRef<number>(0);
  const stateRef = useRef<{
    phase: 'intact' | 'cracking' | 'exploding' | 'gone';
    progress: number;
  }>({ phase: 'intact', progress: 0 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const overlayOpacity = useTransform(scrollYProgress, [0.5, 0.88], [0, 1]);
  const canvasScale = useTransform(scrollYProgress, [0, 0.45], [1, 0.8]);

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      const s = stateRef.current;
      if (v < 0.18) s.phase = 'intact';
      else if (v < 0.42) s.phase = 'cracking';
      else if (v < 0.82) s.phase = 'exploding';
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
    const heartSize = Math.min(w, h) * 0.42;
    const fragCount = 180;

    // Render heart to offscreen canvas once for capture
    const offCanvas = document.createElement('canvas');
    offCanvas.width = w * dpr;
    offCanvas.height = h * dpr;
    const offCtx = offCanvas.getContext('2d');
    if (offCtx) {
      offCtx.scale(dpr, dpr);
      drawRealisticHeart(offCtx, cx, cy, heartSize, 0);
      heartImgRef.current = offCtx.getImageData(0, 0, w * dpr, h * dpr);
    }

    if (fragmentsRef.current.length === 0) {
      fragmentsRef.current = generateHeartFragments(cx, cy, heartSize, fragCount);
    }

    /* === Crack generation (deterministic per-frame) === */
    function drawRealisticCracks(
      ctx: CanvasRenderingContext2D,
      progress: number,
      beat: number
    ) {
      const numCracks = Math.floor(progress * 30);
      const s = heartSize / 260;

      for (let i = 0; i < numCracks; i++) {
        const seed = i * 13.391;
        const a1 = (seed * 17.3) % (Math.PI * 2);
        const len = heartSize * (0.15 + (seed % 0.45)) * s;
        const a2 = a1 + ((seed * 5.7) % 0.9 - 0.45);
        const rStart = heartSize * (0.03 + (seed % 0.15)) * s;
        const x1 = cx + Math.cos(a1) * rStart;
        const y1 = cy + Math.sin(a1) * rStart * 0.9;
        const x2 = x1 + Math.cos(a2) * len;
        const y2 = y1 + Math.sin(a2) * len * 0.9;

        // Main crack (dark)
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        const mx = (x1 + x2) / 2 + Math.sin(seed * 11 + beat * 0.015) * heartSize * 0.04 * s;
        const my = (y1 + y2) / 2 + Math.cos(seed * 13 + beat * 0.015) * heartSize * 0.04 * s;
        ctx.quadraticCurveTo(mx, my, x2, y2);
        ctx.strokeStyle = `rgba(0,0,0,${0.55 + progress * 0.3})`;
        ctx.lineWidth = 1.2 + progress * 2.5;
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Red glow along crack (fresh tear)
        ctx.beginPath();
        ctx.moveTo(x1 + 1, y1 + 1);
        ctx.quadraticCurveTo(mx + 1, my + 1, x2 + 1, y2 + 1);
        ctx.strokeStyle = `rgba(255,40,40,${0.25 + progress * 0.35})`;
        ctx.lineWidth = 0.6 + progress * 1;
        ctx.stroke();

        // Small branch cracks
        if (i % 3 === 0) {
          const bx = x1 + (x2 - x1) * 0.4;
          const by = y1 + (y2 - y1) * 0.4;
          const blen = len * 0.3;
          const ba = a2 + (seed % 0.8 - 0.4);
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.quadraticCurveTo(
            bx + Math.cos(ba) * blen * 0.5,
            by + Math.sin(ba) * blen * 0.5,
            bx + Math.cos(ba) * blen,
            by + Math.sin(ba) * blen
          );
          ctx.strokeStyle = `rgba(0,0,0,${0.4 + progress * 0.3})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    function render(time: number) {
      if (!ctx || !canvas) return;
      const s = stateRef.current;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      // Deep background with red ambient
      const bgGrad = ctx.createRadialGradient(cx, cy, heartSize * 0.1, cx, cy, Math.max(w, h) * 0.7);
      bgGrad.addColorStop(0, 'rgba(80,0,0,0.25)');
      bgGrad.addColorStop(0.5, 'rgba(40,0,0,0.1)');
      bgGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      const expProgress = Math.max(0, Math.min(1, (s.progress - 0.38) / 0.44));

      /* ---- INTACT / CRACKING phase ---- */
      if (s.phase === 'intact' || s.phase === 'cracking') {
        // Redraw heart from captured image for crispness
        if (heartImgRef.current) {
          ctx.putImageData(heartImgRef.current, 0, 0);
        } else {
          drawRealisticHeart(ctx, cx, cy, heartSize, time);
        }

        if (s.phase === 'cracking') {
          const crackPct = Math.min(1, (s.progress - 0.18) / 0.24);
          drawRealisticCracks(ctx, crackPct, time);
        }
      }

      /* ---- EXPLODING phase ---- */
      if (s.phase === 'exploding' || s.phase === 'gone') {
        const frags = fragmentsRef.current;

        // Show fading heart in early explosion
        if (expProgress < 0.35) {
          ctx.globalAlpha = 1 - expProgress / 0.35;
          if (heartImgRef.current) {
            ctx.putImageData(heartImgRef.current, 0, 0);
          } else {
            drawRealisticHeart(ctx, cx, cy, heartSize, time);
          }
          ctx.globalAlpha = 1;
        }

        // Draw fragments with clipping from heart image
        frags.forEach((f) => {
          const fragPct = Math.max(0, Math.min(1, (expProgress - f.delay) / 0.55));
          if (fragPct <= 0) return;

          const fx = f.origX + f.vx * fragPct * heartSize;
          const fy = f.origY + f.vy * fragPct * heartSize + fragPct * fragPct * 40; // gravity
          const fRot = f.rotation + f.rotSpeed * fragPct * 15;
          const fAlpha = f.opacity * (1 - fragPct * 0.85);

          ctx.save();
          ctx.translate(fx, fy);
          ctx.rotate(fRot);
          ctx.globalAlpha = fAlpha;

          // Draw fragment as irregular polygon with tissue color
          ctx.beginPath();
          const pts = f.clipPoints;
          if (pts.length > 0) {
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let p = 1; p < pts.length; p++) {
              ctx.lineTo(pts[p].x, pts[p].y);
            }
          } else {
            // Fallback irregular
            const sz = f.size;
            ctx.moveTo(-sz * 0.6, -sz * 0.8);
            ctx.lineTo(sz * 0.8, -sz * 0.3);
            ctx.lineTo(sz * 0.6, sz * 0.7);
            ctx.lineTo(-sz * 0.5, sz * 0.7);
            ctx.lineTo(-sz * 0.8, sz * 0.1);
          }
          ctx.closePath();
          ctx.fillStyle = f.color;
          ctx.fill();

          // Fragment edge highlight
          ctx.strokeStyle = `rgba(255,255,255,${0.06 * fAlpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();

          ctx.restore();
        });

        // Blood spray particles
        if (expProgress > 0.2) {
          for (let d = 0; d < 50; d++) {
            const dp = Math.max(0, (expProgress - 0.2 - d * 0.012) / 0.5);
            if (dp <= 0 || dp > 1) continue;
            const da = (d * 2.713) % (Math.PI * 2);
            const dd = heartSize * (0.1 + dp * 1.2);
            const dx = cx + Math.cos(da) * dd;
            const dy = cy + Math.sin(da) * dd * 0.8;
            ctx.beginPath();
            ctx.arc(dx, dy, 0.8 + (1 - dp) * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200,0,0,${(1 - dp) * 0.5})`;
            ctx.fill();
          }
        }
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
            'radial-gradient(ellipse at center, rgba(180,0,0,0.06) 0%, rgba(0,0,0,0) 55%)',
        }}
      >
        <motion.canvas
          ref={canvasRef}
          style={{
            width: 'min(82vw, 540px)',
            height: 'min(82vw, 540px)',
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
              'radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.95) 100%)',
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
