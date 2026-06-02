import { createContext, useContext } from 'react';

export interface MousePosition {
  x: number;
  y: number;
}

export const MousePositionContext = createContext<MousePosition>({ x: 0, y: 0 });

export function useMousePosition() {
  return useContext(MousePositionContext);
}
