export interface HeartFragment {
  x: number;
  y: number;
  vx: number;
  vy: number;
  origX: number;
  origY: number;
  size: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
  color: string;
  delay: number;
  // For rendering with image clipping
  clipPoints: { x: number; y: number }[];
}
