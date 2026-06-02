import { useMemo } from 'react';

const PHRASES = ['安逸', '欲望', '身份', '面具', '伪装', '谎言', '自我', '恐惧', '表演', '表象'];

export function FallingText() {
  const letters = useMemo(() => {
    const items: { char: string; x: number; delay: number; duration: number }[] = [];
    const chars = PHRASES.join('');
    chars.split('').forEach((char) => {
      items.push({
        char,
        x: 3 + Math.random() * 94,
        delay: Math.random() * 4,
        duration: 2.5 + Math.random() * 5,
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
        opacity: 0.12,
      }}
    >
      {letters.map((item, idx) => (
        <span
          key={idx}
          style={{
            position: 'absolute',
            left: `${item.x}%`,
            top: '-5%',
            fontSize: 'clamp(1.2rem, 2.5vw, 3rem)',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            color: 'var(--color-red)',
            animation: `letter-fall ${item.duration}s ${item.delay}s ease-in infinite`,
          }}
        >
          {item.char}
        </span>
      ))}
    </div>
  );
}
