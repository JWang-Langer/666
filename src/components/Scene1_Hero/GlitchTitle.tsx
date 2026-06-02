import { useGlitch } from 'react-powerglitch';

export function GlitchTitle() {
  const glitch = useGlitch({
    playMode: 'always',
    createContainers: true,
    hideOverflow: true,
    timing: { duration: 250, easing: 'ease-in-out' },
    glitchTimeSpan: { start: 0.5, end: 0.7 },
    shake: { amplitudeX: 2, amplitudeY: 2 },
    slice: { count: 6, minHeight: 0.02, maxHeight: 0.15, velocity: 10 },
  });

  return (
    <h1
      ref={glitch.ref}
      className="display-xl"
      style={{
        color: 'var(--color-yellow)',
        textAlign: 'center',
      }}
    >
      NOTHING IS
      <br />
      WHAT IT
      <br />
      SEEMS
    </h1>
  );
}
