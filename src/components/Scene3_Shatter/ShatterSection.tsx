import { useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { HeartFragment } from '../../utils/shatter';

/* ================================================================
 * PHOTOREALISTIC HUMAN HEART — click to shatter
 *
 * Reference image style:
 * - Deep black background with subtle red ambient glow
 * - Wet, glossy surface with strong specular highlights
 * - Dark crimson base (#1A0000 → #3D0000 → #8B0000 → #CC0000)
 * - Bright white/pink wet reflections in upper-left quadrant
 * - Sharp contrast between highlighted areas and shadow depths
 * ================================================================ */

function drawPhotoHeart(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  beat: number
) {
  const s = size / 280;
  const pulse = 1 + Math.sin(beat * 0.02) * 0.03;

  // === Deep background ambient glow ===
  const ambientGlow = ctx.createRadialGradient(cx, cy, size * 0.15 * s, cx, cy, size * 1.2 * s);
  ambientGlow.addColorStop(0, 'rgba(120,0,0,0.18)');
  ambientGlow.addColorStop(0.6, 'rgba(60,0,0,0.06)');
  ambientGlow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = ambientGlow;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s * pulse, s * pulse * 0.92);

  // === Pericardial sac (faint outer membrane) ===
  ctx.beginPath();
  ctx.moveTo(0, -170);
  ctx.bezierCurveTo(80, -160, 125, -50, 115, 55);
  ctx.bezierCurveTo(105, 125, 70, 180, 0, 190);
  ctx.bezierCurveTo(-70, 180, -105, 125, -115, 55);
  ctx.bezierCurveTo(-125, -50, -80, -160, 0, -170);
  ctx.closePath();
  ctx.fillStyle = 'rgba(8,0,0,0.5)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // === Main heart silhouette ===
  ctx.beginPath();
  ctx.moveTo(0, 170);
  // Right ventricle
  ctx.bezierCurveTo(-30, 165, -65, 135, -80, 80);
  ctx.bezierCurveTo(-95, 25, -65, -45, -38, -88);
  // Right atrium top
  ctx.bezierCurveTo(-28, -115, -65, -125, -55, -148);
  ctx.bezierCurveTo(-45, -165, -12, -172, 0, -175);
  // Top center (great vessel origin)
  ctx.lineTo(0, -175);
  ctx.bezierCurveTo(12, -172, 45, -165, 55, -148);
  ctx.bezierCurveTo(65, -125, 28, -115, 38, -88);
  // Left ventricle
  ctx.bezierCurveTo(65, -45, 95, 25, 80, 80);
  ctx.bezierCurveTo(65, 135, 30, 165, 0, 170);
  ctx.closePath();

  // === Base gradient: deep crimson to black ===
  const baseGrad = ctx.createRadialGradient(-15, -25, 30, 10, 35, 180);
  baseGrad.addColorStop(0, '#CC2020');
  baseGrad.addColorStop(0.12, '#A01010');
  baseGrad.addColorStop(0.28, '#8B0000');
  baseGrad.addColorStop(0.45, '#6B0000');
  baseGrad.addColorStop(0.62, '#4A0000');
  baseGrad.addColorStop(0.78, '#2D0000');
  baseGrad.addColorStop(0.9, '#1A0000');
  baseGrad.addColorStop(1, '#0A0000');
  ctx.fillStyle = baseGrad;
  ctx.fill();

  // === Strong specular wet reflection (upper-left) ===
  // This creates the glossy "wet organ" look from the reference
  const spec1 = ctx.createRadialGradient(-35, -60, 8, -15, -15, 140);
  spec1.addColorStop(0, 'rgba(255,255,255,0.18)');
  spec1.addColorStop(0.08, 'rgba(255,240,240,0.12)');
  spec1.addColorStop(0.2, 'rgba(255,200,200,0.06)');
  spec1.addColorStop(0.4, 'rgba(255,180,180,0.03)');
  spec1.addColorStop(0.7, 'rgba(255,150,150,0.01)');
  spec1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = spec1;
  ctx.fill();

  // === Secondary specular (small bright spot) ===
  const spec2 = ctx.createRadialGradient(-40, -50, 3, -35, -45, 50);
  spec2.addColorStop(0, 'rgba(255,255,255,0.22)');
  spec2.addColorStop(0.15, 'rgba(255,240,240,0.1)');
  spec2.addColorStop(0.5, 'rgba(255,200,200,0.03)');
  spec2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = spec2;
  ctx.fill();

  // === Right-side deep shadow ===
  const shadowR = ctx.createRadialGradient(45, 20, 20, 30, 25, 160);
  shadowR.addColorStop(0, 'rgba(0,0,0,0.25)');
  shadowR.addColorStop(0.5, 'rgba(0,0,0,0.15)');
  shadowR.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = shadowR;
  ctx.fill();

  // === Bottom shadow ===
  const shadowB = ctx.createRadialGradient(0, 100, 10, 0, 110, 80);
  shadowB.addColorStop(0, 'rgba(0,0,0,0.4)');
  shadowB.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = shadowB;
  ctx.fill();

  ctx.restore();

  // === Great vessels (aorta, pulmonary) ===
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s * pulse, s * pulse * 0.92);

  // Aorta - thick, right-curving
  ctx.beginPath();
  ctx.moveTo(-8, -168);
  ctx.bezierCurveTo(-8, -195, 35, -205, 58, -188);
  ctx.bezierCurveTo(72, -175, 60, -155, 42, -150);
  ctx.bezierCurveTo(28, -147, 5, -158, -8, -168);
  ctx.closePath();
  const aortaGrad = ctx.createLinearGradient(-8, -200, 60, -155);
  aortaGrad.addColorStop(0, '#E84848');
  aortaGrad.addColorStop(0.3, '#CC3030');
  aortaGrad.addColorStop(0.7, '#A02020');
  aortaGrad.addColorStop(1, '#6B1010');
  ctx.fillStyle = aortaGrad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,180,180,0.15)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Pulmonary artery - left side
  ctx.beginPath();
  ctx.moveTo(8, -162);
  ctx.bezierCurveTo(12, -190, -25, -198, -48, -182);
  ctx.bezierCurveTo(-58, -173, -42, -157, -20, -153);
  ctx.bezierCurveTo(-2, -150, 5, -158, 8, -162);
  ctx.closePath();
  const paGrad = ctx.createLinearGradient(8, -195, -50, -155);
  paGrad.addColorStop(0, '#E05050');
  paGrad.addColorStop(1, '#8B2020');
  ctx.fillStyle = paGrad;
  ctx.fill();

  ctx.restore();

  // === Coronary arteries (surface) ===
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s * pulse, s * pulse * 0.92);

  // LAD - left anterior descending (multi-pass for depth)
  const ladPts: [number, number][] = [
    [2, -130], [-6, -85], [-18, -50], [-28, -10],
    [-22, 35], [-12, 75], [-4, 110], [2, 140]
  ];
  for (let pass = 0; pass < 3; pass++) {
    ctx.beginPath();
    ctx.moveTo(ladPts[0][0], ladPts[0][1]);
    for (let i = 1; i < ladPts.length; i++) {
      const mx = (ladPts[i - 1][0] + ladPts[i][0]) / 2 + Math.sin(i * 2) * 4;
      const my = (ladPts[i - 1][1] + ladPts[i][1]) / 2 + Math.cos(i * 3) * 3;
      ctx.quadraticCurveTo(mx, my, ladPts[i][0], ladPts[i][1]);
    }
    ctx.strokeStyle = pass === 0
      ? 'rgba(180,30,30,0.65)'
      : pass === 1
        ? 'rgba(255,100,100,0.2)'
        : 'rgba(80,0,0,0.45)';
    ctx.lineWidth = 3.5 - pass * 1.3;
    ctx.stroke();
  }

  // RCA - right coronary
  const rcaPts: [number, number][] = [
    [15, -125], [30, -75], [42, -25], [48, 30], [35, 75], [18, 120]
  ];
  ctx.beginPath();
  rcaPts.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p[0], p[1]);
    else ctx.quadraticCurveTo(
      (rcaPts[i - 1][0] + p[0]) / 2 - 3,
      (rcaPts[i - 1][1] + p[1]) / 2 + 2,
      p[0], p[1]
    );
  });
  ctx.strokeStyle = 'rgba(160,25,25,0.6)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.restore();

  // === Surface veins (purple-blue) ===
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s * pulse, s * pulse * 0.92);

  const veinPaths: [number, number][][] = [
    [[-35, -60], [-55, -15], [-65, 25], [-60, 65], [-45, 105]],
    [[35, -50], [55, -5], [60, 35], [48, 75], [32, 110]],
    [[-18, -80], [-30, -35], [-40, 5], [-35, 45]],
    [[20, -72], [25, -30], [30, 10], [22, 50]],
  ];

  veinPaths.forEach((pts) => {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
      const mx = (pts[i - 1][0] + pts[i][0]) / 2;
      const my = (pts[i - 1][1] + pts[i][1]) / 2;
      ctx.quadraticCurveTo(mx, my, pts[i][0], pts[i][1]);
    }
    ctx.strokeStyle = 'rgba(55,35,110,0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Subtle vein highlight
    ctx.beginPath();
    ctx.moveTo(pts[0][0] + 1.5, pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
      const mx = (pts[i - 1][0] + pts[i][0]) / 2 + 1.5;
      const my = (pts[i - 1][1] + pts[i][1]) / 2;
      ctx.quadraticCurveTo(mx, my, pts[i][0] + 1.5, pts[i][1]);
    }
    ctx.strokeStyle = 'rgba(130,110,190,0.18)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  });

  ctx.restore();

  // === Fat deposits ===
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s * pulse, s * pulse * 0.92);

  const fatPatches = [
    { cx: -48, cy: 55, rx: 22, ry: 12, angle: -0.35 },
    { cx: 42, cy: -35, rx: 16, ry: 10, angle: 0.25 },
    { cx: -5, cy: -105, rx: 14, ry: 8, angle: 0.05 },
    { cx: -22, cy: 35, rx: 12, ry: 7, angle: -0.5 },
    { cx: 30, cy: 75, rx: 13, ry: 8, angle: 0.4 },
    { cx: -25, cy: 15, rx: 10, ry: 6, angle: -0.2 },
  ];

  fatPatches.forEach((p) => {
    ctx.save();
    ctx.translate(p.cx, p.cy);
    ctx.rotate(p.angle);
    ctx.beginPath();
    ctx.ellipse(0, 0, p.rx, p.ry, 0, 0, Math.PI * 2);
    const fatGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(p.rx, p.ry));
    fatGrad.addColorStop(0, 'rgba(230,215,165,0.3)');
    fatGrad.addColorStop(0.6, 'rgba(210,190,140,0.15)');
    fatGrad.addColorStop(1, 'rgba(180,160,110,0)');
    ctx.fillStyle = fatGrad;
    ctx.fill();
    ctx.restore();
  });

  ctx.restore();

  // === Final wet gloss overlay ===
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s * pulse, s * pulse * 0.92);

  ctx.beginPath();
  ctx.moveTo(0, 170);
  ctx.bezierCurveTo(-30, 165, -65, 135, -80, 80);
  ctx.bezierCurveTo(-95, 25, -65, -45, -38, -88);
  ctx.bezierCurveTo(-28, -115, -65, -125, -55, -148);
  ctx.bezierCurveTo(-45, -165, -12, -172, 0, -175);
  ctx.lineTo(0, -175);
  ctx.bezierCurveTo(12, -172, 45, -165, 55, -148);
  ctx.bezierCurveTo(65, -125, 28, -115, 38, -88);
  ctx.bezierCurveTo(65, -45, 95, 25, 80, 80);
  ctx.bezierCurveTo(65, 135, 30, 165, 0, 170);
  ctx.closePath();

  // Final glossy layer
  const finalGloss = ctx.createRadialGradient(-30, -55, 5, -10, -15, 160);
  finalGloss.addColorStop(0, 'rgba(255,255,255,0.08)');
  finalGloss.addColorStop(0.15, 'rgba(255,230,230,0.04)');
  finalGloss.addColorStop(0.4, 'rgba(255,200,200,0.02)');
  finalGloss.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = finalGloss;
  ctx.fill();

  ctx.restore();
}

// === Fragment generation with clipping ===
function generateHeartFragments(
  cx: number,
  cy: number,
  size: number,
  count: number
): HeartFragment[] {
  const frags: HeartFragment[] = [];
  const s = size / 280;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * size * 0.7 * s;
    const ox = cx + Math.cos(angle) * dist * 0.85;
    const oy = cy + Math.sin(angle) * dist * 0.8;

    const speed = 0.25 + Math.random() * 1.6;
    const fragSize = 3 + Math.random() * 15;

    const numVertices = 5 + Math.floor(Math.random() * 5);
    const clipPoints: { x: number; y: number }[] = [];
    for (let v = 0; v < numVertices; v++) {
      const va = (v / numVertices) * Math.PI * 2;
      const r = fragSize * (0.4 + Math.random() * 0.6);
      clipPoints.push({ x: Math.cos(va) * r, y: Math.sin(va) * r });
    }

    const tissueColors = [
      '#CC2020', '#8B0000', '#4A0000', '#A01010',
      '#6B0000', '#E04040', '#2D0000', '#FF4848',
      '#901010', '#701010', '#B02020', '#5A0000',
      '#3D0000', '#C03030', '#1A0000',
    ];

    frags.push({
      x: ox, y: oy,
      vx: (Math.random() - 0.5) * speed * 2.8,
      vy: (Math.random() - 0.65) * speed * 2.2 - 0.4,
      origX: ox, origY: oy,
      size: fragSize,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.12,
      opacity: 0.6 + Math.random() * 0.4,
      color: tissueColors[Math.floor(Math.random() * tissueColors.length)],
      delay: Math.random() * 0.5,
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
  const clickTimeRef = useRef<number>(0);
  const isIntactRef = useRef<boolean>(true);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const overlayOpacity = useTransform(scrollYProgress, [0.15, 0.4], [0, 1]);
  const canvasScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.88]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  const handleClick = useCallback(() => {
    if (isIntactRef.current) {
      isIntactRef.current = false;
      clickTimeRef.current = performance.now();
    }
  }, []);

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
    const heartSize = Math.min(w, h) * 0.44;
    const fragCount = 200;

    // Pre-render intact heart to offscreen
    const offCanvas = document.createElement('canvas');
    offCanvas.width = w * dpr;
    offCanvas.height = h * dpr;
    const offCtx = offCanvas.getContext('2d');
    if (offCtx) {
      offCtx.scale(dpr, dpr);
      drawPhotoHeart(offCtx, cx, cy, heartSize, 0);
      heartImgRef.current = offCtx.getImageData(0, 0, w * dpr, h * dpr);
    }

    if (fragmentsRef.current.length === 0) {
      fragmentsRef.current = generateHeartFragments(cx, cy, heartSize, fragCount);
    }

    function drawCracks(
      ctx: CanvasRenderingContext2D,
      elapsed: number, // ms since click
      beat: number
    ) {
      const progress = Math.min(1, elapsed / 800); // cracks form over 800ms
      const numCracks = Math.floor(progress * 28);
      const scale = heartSize / 280;

      for (let i = 0; i < numCracks; i++) {
        const seed = i * 17.391;
        const a1 = (seed * 19.3) % (Math.PI * 2);
        const len = heartSize * (0.12 + (seed % 0.5)) * scale;
        const a2 = a1 + ((seed * 7.1) % 1.0 - 0.5);
        const rStart = heartSize * (0.02 + (seed % 0.18)) * scale;
        const x1 = cx + Math.cos(a1) * rStart;
        const y1 = cy + Math.sin(a1) * rStart * 0.85;
        const x2 = x1 + Math.cos(a2) * len;
        const y2 = y1 + Math.sin(a2) * len * 0.85;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        const mx = (x1 + x2) / 2 + Math.sin(seed * 13 + beat * 0.02) * heartSize * 0.03 * scale;
        const my = (y1 + y2) / 2 + Math.cos(seed * 15 + beat * 0.02) * heartSize * 0.03 * scale;
        ctx.quadraticCurveTo(mx, my, x2, y2);
        ctx.strokeStyle = `rgba(0,0,0,${0.5 + progress * 0.35})`;
        ctx.lineWidth = 1 + progress * 3;
        ctx.shadowColor = 'rgba(0,0,0,0.7)';
        ctx.shadowBlur = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Red glow along crack
        ctx.beginPath();
        ctx.moveTo(x1 + 1, y1 + 1);
        ctx.quadraticCurveTo(mx + 1, my + 1, x2 + 1, y2 + 1);
        ctx.strokeStyle = `rgba(255,30,30,${0.2 + progress * 0.4})`;
        ctx.lineWidth = 0.5 + progress * 1.2;
        ctx.stroke();

        // Branch cracks (every 4th)
        if (i % 4 === 0) {
          const bx = x1 + (x2 - x1) * 0.35;
          const by = y1 + (y2 - y1) * 0.35;
          const blen = len * 0.28;
          const ba = a2 + (seed % 0.9 - 0.45);
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.quadraticCurveTo(
            bx + Math.cos(ba) * blen * 0.5, by + Math.sin(ba) * blen * 0.5,
            bx + Math.cos(ba) * blen, by + Math.sin(ba) * blen
          );
          ctx.strokeStyle = `rgba(0,0,0,${0.35 + progress * 0.3})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    function render(time: number) {
      if (!ctx || !canvas) return;
      const clicked = !isIntactRef.current;
      const elapsed = clicked ? time - clickTimeRef.current : 0;
      // Phase: 0-800ms cracks, 800-2500ms explode, 2500+ gone
      const phase = !clicked ? 'intact'
        : elapsed < 800 ? 'cracking'
        : elapsed < 2500 ? 'exploding'
        : 'gone';
      const expProgress = phase === 'exploding'
        ? Math.max(0, Math.min(1, (elapsed - 800) / 1700))
        : phase === 'gone' ? 1 : 0;
      const crackProgress = phase === 'cracking' ? Math.min(1, elapsed / 800) : 0;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      void crackProgress;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      // Background glow
      const bgGrad = ctx.createRadialGradient(cx, cy, heartSize * 0.08, cx, cy, Math.max(w, h) * 0.7);
      bgGrad.addColorStop(0, 'rgba(80,0,0,0.2)');
      bgGrad.addColorStop(0.5, 'rgba(40,0,0,0.08)');
      bgGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      if (phase === 'intact' || phase === 'cracking') {
        if (heartImgRef.current) {
          ctx.putImageData(heartImgRef.current, 0, 0);
        } else {
          drawPhotoHeart(ctx, cx, cy, heartSize, time);
        }

        if (phase === 'cracking') {
          drawCracks(ctx, elapsed, time);
        }
      }

      if (phase === 'exploding' || phase === 'gone') {
        const frags = fragmentsRef.current;

        // Fading intact heart early
        if (expProgress < 0.3) {
          ctx.globalAlpha = 1 - expProgress / 0.3;
          if (heartImgRef.current) {
            ctx.putImageData(heartImgRef.current, 0, 0);
          } else {
            drawPhotoHeart(ctx, cx, cy, heartSize, time);
          }
          ctx.globalAlpha = 1;
        }

        frags.forEach((f) => {
          const fp = Math.max(0, Math.min(1, (expProgress - f.delay) / 0.5));
          if (fp <= 0) return;

          // Gravity + parabolic arc
          const fx = f.origX + f.vx * fp * heartSize;
          const fy = f.origY + f.vy * fp * heartSize + fp * fp * 50;
          const fRot = f.rotation + f.rotSpeed * fp * 18;
          const fAlpha = f.opacity * (1 - fp * 0.9);

          ctx.save();
          ctx.translate(fx, fy);
          ctx.rotate(fRot);
          ctx.globalAlpha = fAlpha;

          ctx.beginPath();
          const pts = f.clipPoints;
          if (pts.length > 0) {
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let p = 1; p < pts.length; p++) {
              ctx.lineTo(pts[p].x, pts[p].y);
            }
          }
          ctx.closePath();
          ctx.fillStyle = f.color;
          ctx.fill();
          ctx.strokeStyle = `rgba(255,255,255,${0.05 * fAlpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.restore();
        });

        // Blood spray
        if (expProgress > 0.15) {
          for (let d = 0; d < 60; d++) {
            const dp = Math.max(0, (expProgress - 0.15 - d * 0.01) / 0.55);
            if (dp <= 0 || dp > 1) continue;
            const da = (d * 2.713) % (Math.PI * 2);
            const dd = heartSize * (0.08 + dp * 1.5);
            const dx = cx + Math.cos(da) * dd;
            const dy = cy + Math.sin(da) * dd * 0.75;
            ctx.beginPath();
            ctx.arc(dx, dy, 0.6 + (1 - dp) * 2.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200,0,0,${(1 - dp) * 0.55})`;
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
        height: '130vh',
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
            'radial-gradient(ellipse at center, rgba(140,0,0,0.05) 0%, rgba(0,0,0,0) 55%)',
          cursor: 'pointer',
        }}
        onClick={handleClick}
      >
        <motion.canvas
          ref={canvasRef}
          style={{
            width: 'min(82vw, 540px)',
            height: 'min(82vw, 540px)',
            scale: canvasScale,
          }}
        />

        {/* Click hint */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: 'clamp(10%, 15vh, 20%)',
            opacity: hintOpacity,
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <p
            style={{
              fontSize: 'clamp(0.7rem, 1vw, 0.8rem)',
              color: 'var(--color-cream)',
              letterSpacing: '0.2em',
              opacity: 0.4,
            }}
          >
            点击心脏 · 击碎它
          </p>
        </motion.div>

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
              'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.95) 100%)',
            pointerEvents: 'none',
          }}
        >
          <h2
            className="display-lg text-yellow"
            data-glitch="还剩什么"
            style={{
              textAlign: 'center',
              textShadow: '0 0 40px rgba(245,200,0,0.15)',
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
