export interface ShatterFragment {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  opacity: number;
  polygon: { x: number; y: number }[];
}

export function shatterImage(
  cols: number,
  rows: number,
  jitterAmount: number = 0.3
): ShatterFragment[] {
  const fragments: ShatterFragment[] = [];
  const cellW = 1 / cols;
  const cellH = 1 / rows;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const jx = cellW * jitterAmount;
      const jy = cellH * jitterAmount;

      const topLeft = {
        x: col * cellW + (Math.random() - 0.5) * jx,
        y: row * cellH + (Math.random() - 0.5) * jy,
      };
      const topRight = {
        x: (col + 1) * cellW + (Math.random() - 0.5) * jx,
        y: row * cellH + (Math.random() - 0.5) * jy,
      };
      const bottomRight = {
        x: (col + 1) * cellW + (Math.random() - 0.5) * jx,
        y: (row + 1) * cellH + (Math.random() - 0.5) * jy,
      };
      const bottomLeft = {
        x: col * cellW + (Math.random() - 0.5) * jx,
        y: (row + 1) * cellH + (Math.random() - 0.5) * jy,
      };

      fragments.push({
        x: (col + 0.5) * cellW,
        y: (row + 0.5) * cellH,
        width: cellW,
        height: cellH,
        velocityX: (Math.random() - 0.5) * 2,
        velocityY: (Math.random() - 0.8) * 2 - 0.5,
        rotation: (Math.random() - 0.5) * 0.5,
        rotationSpeed: (Math.random() - 0.5) * 3,
        scale: 0.7 + Math.random() * 0.3,
        opacity: 1,
        polygon: [topLeft, topRight, bottomRight, bottomLeft],
      });
    }
  }

  return fragments;
}
