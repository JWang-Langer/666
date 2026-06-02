import { useGlitch } from 'react-powerglitch';

export function GlitchParagraph() {
  const glitch = useGlitch({
    playMode: 'hover',
    createContainers: true,
    hideOverflow: false,
    timing: { duration: 150, easing: 'ease-in-out' },
    glitchTimeSpan: { start: 0.3, end: 0.6 },
    shake: { amplitudeX: 1, amplitudeY: 1 },
    slice: { count: 3, minHeight: 0.02, maxHeight: 0.1, velocity: 5 },
  });

  return (
    <div ref={glitch.ref} className="body-lg" style={{ color: 'var(--color-cream)' }}>
      <p style={{ marginBottom: '1.5rem' }}>
        We are taught to build walls. To present the polished surface, the curated self, the
        acceptable answer. Every layer a defense. Every mask a survival strategy worn so long it
        feels like skin.
      </p>
      <p style={{ marginBottom: '1.5rem' }}>
        But peel back the performance. Strip the conditioning. Cut through the comfortable lies we
        tell ourselves in the dark.
      </p>
      <p style={{ color: 'var(--color-red)', fontStyle: 'italic' }}>
        What pulses beneath is raw. Unfiltered. Alive.
      </p>
    </div>
  );
}
