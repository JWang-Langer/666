import { useGlitch } from 'react-powerglitch';

export function GlitchTitle() {
  const glitch = useGlitch({
    playMode: 'always',
    createContainers: true,
    hideOverflow: true,
    timing: { duration: 300, easing: 'ease-in-out' },
    glitchTimeSpan: { start: 0.4, end: 0.65 },
    shake: { amplitudeX: 2, amplitudeY: 2 },
    slice: { count: 8, minHeight: 0.02, maxHeight: 0.12, velocity: 12 },
  });

  return (
    <h1
      ref={glitch.ref}
      className="display-xl"
      style={{
        color: 'var(--color-yellow)',
        textAlign: 'center',
        textShadow: '0 0 40px rgba(255,211,0,0.15)',
      }}
    >
      所见
      <br />
      皆
      <br />
      虚妄
    </h1>
  );
}
