import { useGlitch } from 'react-powerglitch';

export function GlitchParagraph() {
  const glitch = useGlitch({
    playMode: 'hover',
    createContainers: true,
    hideOverflow: false,
    timing: { duration: 200, easing: 'ease-in-out' },
    glitchTimeSpan: { start: 0.25, end: 0.55 },
    shake: { amplitudeX: 1, amplitudeY: 1 },
    slice: { count: 4, minHeight: 0.02, maxHeight: 0.08, velocity: 6 },
  });

  return (
    <div ref={glitch.ref} className="body-lg" style={{ color: 'var(--color-cream)' }}>
      <p style={{ marginBottom: '1.5rem' }}>
        我们被教导要筑起高墙。展示光鲜的表层、精心策划的自我、合乎期待的答案。每一层都是防卫，每一副面具都是求生策略——戴得太久，便成了皮肤。
      </p>
      <p style={{ marginBottom: '1.5rem' }}>
        但剥开表演。撕掉规训。割破那些我们在黑暗中对自己说了一遍又一遍的、舒适的谎言。
      </p>
      <p style={{ color: 'var(--color-red)', fontStyle: 'italic', textShadow: '0 0 20px rgba(224,0,0,0.15)' }}>
        在底下跳动的，是赤裸的。未经过滤的。活着的。
      </p>
    </div>
  );
}
