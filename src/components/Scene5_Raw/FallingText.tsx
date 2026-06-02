import { useMemo } from 'react';

const PHRASES = [
  'COMFORT',
  'DESIRE',
  'IDENTITY',
  'SURFACE',
  'MASK',
  'FACADE',
  'LIE',
  'EGO',
  'FEAR',
  'PRETEND',
];

export function FallingText() {
  const letters = useMemo(() => {
    const items: { char: string; x: number; delay: number; duration: number; yEnd: number; rotateZ: number }[] = [];
    const chars = PHRASES.join(' ');
    chars.split('').forEach((char) => {
      if (char === ' ') return;
      items.push({
        char,
        x: 5 + Math.random() * 90,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 4,
        yEnd: 200 + Math.random() * 600,
        rotateZ: (Math.random() - 0.5) * 30,
      });
    });
    return items;
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        opacity: 0.15,
      }}
    >
      {letters.map((item, idx) => (
        <span
          key={idx}
          className="letter-fall"
          style={{
            position: 'absolute',
            left: `${item.x}%`,
            top: '-5%',
            fontSize: 'clamp(1rem, 2vw, 2.5rem)',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            color: 'var(--color-red)',
            animation: `letter-fall ${item.duration}s ${item.delay}s ease-in infinite`,
            // @ts-expect-error custom property for stagger
            '--fall-delay': `${item.delay}s`,
          }}
        >
          {item.char}
        </span>
      ))}
      <style>{`
        .letter-fall {
          animation: letter-fall var(--fall-duration, 3s) var(--fall-delay, 0s) ease-in infinite;
        }
      `}</style>
    </div>
  );
}
