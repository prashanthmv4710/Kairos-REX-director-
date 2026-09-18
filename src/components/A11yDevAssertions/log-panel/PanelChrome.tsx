import * as React from 'react';
import {type Edge} from './constants';
import {panelStyles, resizeHandleStyles} from './styles';

/**
 * Invisible pointer-only resize hit areas on edges and corners. Hidden from the
 * a11y tree — keyboard users resize via the maximize/minimize button.
 */
export function ResizeHandles({
  onStart,
}: {
  onStart: (e: React.PointerEvent, edge: Edge) => void;
}): JSX.Element {
  const edges: Edge[] = ['n', 's', 'e', 'w', 'nw', 'ne', 'sw', 'se'];
  return (
    <>
      {edges.map((edge) => (
        <div
          key={edge}
          aria-hidden="true"
          style={{...resizeHandleStyles[edge]}}
          onPointerDown={(e) => onStart(e, edge)}
        />
      ))}
    </>
  );
}

/** Header — doubles as the drag handle. */
export function PanelHeader({
  isMaximized,
  grabbing,
  onStartMove,
  onToggleMaximize,
  onClose,
}: {
  isMaximized: boolean;
  grabbing: boolean;
  onStartMove: (e: React.PointerEvent) => void;
  onToggleMaximize: () => void;
  onClose: () => void;
}): JSX.Element {
  return (
    <div
      style={{...panelStyles.header, cursor: grabbing ? 'grabbing' : 'grab'}}
      onPointerDown={(e) => {
        // Don't start drag when clicking buttons inside the header
        if ((e.target as HTMLElement).closest('button')) return;
        onStartMove(e);
      }}
    >
      <h2 id="a11y-panel-title" style={panelStyles.headerTitle}>Accessibility Scanner</h2>
      <div style={{display: 'flex', alignItems: 'center', gap: 4}}>
        <button
          type="button"
          onClick={onToggleMaximize}
          style={panelStyles.resetButton}
          aria-label={isMaximized ? 'Minimize panel' : 'Maximize panel'}
          title={isMaximized ? 'Minimize' : 'Maximize'}
        >
          {isMaximized ? (
            /* Minimize icon — two inward arrows */
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 14h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20 10h-6V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 10l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 21l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            /* Maximize icon — two outward arrows */
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 3h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 21H3v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 3l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 21l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        <button type="button" onClick={onClose} style={panelStyles.closeButton} aria-label="Close accessibility panel">
          ✕
        </button>
      </div>
    </div>
  );
}
