import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useMousePosition } from '../../hooks/useMousePosition';

export function RotatingEye() {
  const eyeRef = useRef<HTMLDivElement>(null);
  const mouse = useMousePosition();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 100, damping: 30 });
  const springY = useSpring(rotateY, { stiffness: 100, damping: 30 });

  function handleMouseMove() {
    if (!eyeRef.current) return;
    const rect = eyeRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = mouse.x - cx;
    const dy = mouse.y - cy;
    rotateY.set((dx / window.innerWidth) * 40);
    rotateX.set((-dy / window.innerHeight) * 40);
  }

  return (
    <motion.div
      ref={eyeRef}
      onMouseMove={handleMouseMove}
      onPointerMove={handleMouseMove}
      style={{
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background:
          'radial-gradient(circle at 35% 35%, #f5f0eb 0%, #d4c5a0 20%, #8a7a60 50%, #3a3020 80%, #1a1008 100%)',
        boxShadow:
          '0 0 60px rgba(224,0,0,0.2), inset 0 0 30px rgba(0,0,0,0.5), 0 0 0 4px #1a1a1a, 0 0 0 8px #0a0a0a',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'none',
      }}
    >
      {/* Iris */}
      <motion.div
        style={{
          position: 'absolute',
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, #0a0a0a 0%, #1a1008 30%, #8B4513 60%, #D2691E 80%, #3a2010 100%)',
          top: '50%',
          left: '50%',
          marginLeft: '-35px',
          marginTop: '-35px',
          rotateX: springX,
          rotateY: springY,
        }}
      >
        {/* Pupil */}
        <div
          style={{
            position: 'absolute',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#000',
            top: '50%',
            left: '50%',
            marginLeft: '-14px',
            marginTop: '-14px',
            boxShadow: '0 0 10px rgba(0,0,0,0.8)',
          }}
        >
          {/* Catchlight */}
          <div
            style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.9)',
              top: '4px',
              left: '4px',
            }}
          />
        </div>
      </motion.div>

      {/* Blood vessels (SVG) */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, opacity: 0.5 }}
      >
        <path
          d="M20 60 Q40 40 50 70 Q60 100 80 80"
          stroke="rgba(180,0,0,0.4)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M150 40 Q130 30 120 60 Q110 90 140 100"
          stroke="rgba(180,0,0,0.35)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M40 130 Q60 120 70 140 Q80 160 60 170"
          stroke="rgba(180,0,0,0.3)"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M120 130 Q100 120 90 140 Q80 160 100 170"
          stroke="rgba(180,0,0,0.35)"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </motion.div>
  );
}
