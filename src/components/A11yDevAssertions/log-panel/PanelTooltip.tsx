import * as React from 'react';
import {FONT_SANS, COLOR_INK, COLOR_SURFACE} from './constants';

export interface TooltipState {
  text: string;
  x: number;
  y: number;
}

/** Fixed-position tooltip state + show/hide handlers. */
export function useTooltip() {
  const [tooltip, setTooltip] = React.useState<TooltipState | null>(null);
  const showTooltip = React.useCallback(
    (e: React.MouseEvent | React.FocusEvent, text: string) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setTooltip({text, x: rect.left + rect.width / 2, y: rect.top});
    },
    [],
  );
  const hideTooltip = React.useCallback(() => setTooltip(null), []);
  return {tooltip, showTooltip, hideTooltip};
}

/** Fixed-position tooltip — escapes overflow clipping. */
export function PanelTooltip({tooltip}: {tooltip: TooltipState | null}): JSX.Element | null {
  if (!tooltip) return null;
  return (
    <div style={{
      position: 'fixed',
      top: tooltip.y - 6,
      left: tooltip.x,
      transform: 'translate(-50%, -100%)',
      background: COLOR_INK,
      color: COLOR_SURFACE,
      padding: '4px 8px',
      borderRadius: 4,
      fontSize: 11,
      fontFamily: FONT_SANS,
      fontWeight: 500,
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      zIndex: 2147483645,
      boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
    }}>
      {tooltip.text}
    </div>
  );
}
