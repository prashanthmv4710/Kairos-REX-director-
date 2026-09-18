import * as React from 'react';
import {
  MIN_WIDTH,
  MIN_HEIGHT,
  MAX_WIDTH,
  VIEWPORT_PAD,
  SIDE_GUTTER,
  type Edge,
} from './constants';
import {
  type Bounds,
  boundsW,
  boundsH,
  defaultSize,
  defaultPosition,
} from './geometry';

type DragState = {
  startX: number; startY: number;
  startPosX: number; startPosY: number;
  startW: number; startH: number;
  edge: Edge | 'move';
} | null;

export interface PanelDrag {
  pos: {x: number; y: number};
  size: {width: number; height: number};
  isAnimating: boolean;
  isMaximized: boolean;
  dragRef: React.MutableRefObject<DragState>;
  startDrag: (e: React.PointerEvent, edge: Edge | 'move') => void;
  toggleMaximize: () => void;
}

/**
 * Encapsulates the panel's drag-to-move / drag-to-resize / maximize behavior.
 * Clamps against the embed frame when `bounds` is passed, else the window —
 * byte-for-byte identical to the pre-refactor inline implementation.
 */
export function usePanelDrag(
  bounds: Bounds | undefined,
  onDragStateChange?: (isDragging: boolean) => void,
): PanelDrag {
  const embedded = bounds != null;
  const [pos, setPos] = React.useState(() => defaultPosition(bounds));
  const [size, setSize] = React.useState(() => defaultSize(bounds));
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [isMaximized, setIsMaximized] = React.useState(false);
  const preMaxRef = React.useRef<{pos: {x: number; y: number}; size: {width: number; height: number}} | null>(null);
  const dragRef = React.useRef<DragState>(null);

  // Keep panel sized & positioned within the viewport on window resize.
  // Embedded mode resolves against fixed frame bounds, not the window, so the
  // window-resize clamp doesn't apply.
  React.useEffect(() => {
    if (embedded) return;
    const onResize = () => {
      const maxW = Math.max(MIN_WIDTH - 40, window.innerWidth - SIDE_GUTTER * 2);
      const maxH = Math.max(MIN_HEIGHT, window.innerHeight - VIEWPORT_PAD * 2);
      // Shrink the panel if the viewport got smaller than it.
      setSize((s) => {
        const width = Math.min(s.width, maxW);
        const height = Math.min(s.height, maxH);
        return width === s.width && height === s.height ? s : {width, height};
      });
      setPos((p) => ({
        x: Math.max(0, Math.min(p.x, window.innerWidth - Math.min(size.width, maxW))),
        y: Math.max(0, Math.min(p.y, window.innerHeight - Math.min(size.height, maxH))),
      }));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [size.width, size.height, embedded]);

  // Shared pointer-move / pointer-up handler for both move and resize.
  // Clamp against the embed frame when embedded, else the window — keeps the
  // panel inside its containing block in both cases.
  React.useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      e.preventDefault();
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      const vw = boundsW(bounds);
      const vh = boundsH(bounds);

      if (d.edge === 'move') {
        const newX = Math.max(0, Math.min(d.startPosX + dx, vw - size.width));
        const newY = Math.max(0, Math.min(d.startPosY + dy, vh - size.height));
        setPos({x: newX, y: newY});
        return;
      }

      // Resize
      let newW = d.startW;
      let newH = d.startH;
      let newX = d.startPosX;
      let newY = d.startPosY;

      if (d.edge.includes('e')) newW = Math.max(MIN_WIDTH, Math.min(d.startW + dx, MAX_WIDTH, vw - d.startPosX));
      if (d.edge.includes('w')) {
        const candidateW = Math.min(Math.max(MIN_WIDTH, d.startW - dx), MAX_WIDTH);
        const actualDx = d.startW - candidateW;
        newW = candidateW;
        newX = d.startPosX + actualDx;
      }
      if (d.edge.includes('s')) newH = Math.max(MIN_HEIGHT, Math.min(d.startH + dy, vh - d.startPosY));
      if (d.edge.includes('n')) {
        const candidateH = Math.max(MIN_HEIGHT, Math.min(d.startH - dy, d.startPosY + d.startH - VIEWPORT_PAD));
        const actualDy = d.startH - candidateH;
        newH = candidateH;
        newY = d.startPosY + actualDy;
      }

      setSize({width: newW, height: newH});
      setPos({x: newX, y: newY});
    };

    const onPointerUp = () => {
      if (dragRef.current) {
        dragRef.current = null;
        onDragStateChange?.(false);
      }
    };

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };
  }, [size.width, size.height, onDragStateChange, bounds]);

  const startDrag = React.useCallback(
    (e: React.PointerEvent, edge: Edge | 'move') => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      dragRef.current = {
        startX: e.clientX, startY: e.clientY,
        startPosX: pos.x, startPosY: pos.y,
        startW: size.width, startH: size.height,
        edge,
      };
      setIsMaximized(false);
      onDragStateChange?.(true);
    },
    [pos.x, pos.y, size.width, size.height, onDragStateChange],
  );

  const toggleMaximize = React.useCallback(() => {
    setIsAnimating(true);
    if (isMaximized) {
      // Minimize → re-anchor to default bottom-right at default size
      setPos(defaultPosition(bounds));
      setSize(defaultSize(bounds));
      preMaxRef.current = null;
      setIsMaximized(false);
    } else {
      // Save current state before maximizing
      preMaxRef.current = {pos: {x: pos.x, y: pos.y}, size: {width: size.width, height: size.height}};
      // Maximize — anchor bottom-right corner, grow left and up
      const currentRight = pos.x + size.width;
      const currentBottom = pos.y + size.height;
      const maxH = currentBottom - VIEWPORT_PAD;
      const newLeft = currentRight - MAX_WIDTH;
      setPos({x: Math.max(0, newLeft), y: VIEWPORT_PAD});
      setSize({width: MAX_WIDTH, height: maxH});
      setIsMaximized(true);
    }
    setTimeout(() => setIsAnimating(false), 250);
  }, [isMaximized, pos, size, bounds]);

  return {pos, size, isAnimating, isMaximized, dragRef, startDrag, toggleMaximize};
}
