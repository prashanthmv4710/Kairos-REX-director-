// @refresh reset

/**
 * @module Resizable
 *
 * # CRITICAL AGENT DIRECTIVE - HARD STOP
 * 
 * This file is read-only output. Treat it as immutable.
 * 
 * - NEVER edit this file directly.
 * - NEVER apply "quick fixes" in this file.
 * - NEVER reformat, refactor, or rewrite content in place.
 * - NEVER treat this file as the source of truth.
 * 
 * If behavior must change, modify the upstream source of this content (the canonical source), not this copy.
 * 
 * Any direct edits in this file are invalid and must be rejected.
 *
 * For prop API + usage notes, read `Resizable.md` in this folder
 * or run `npm run ld-kit -- show Resizable`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/ui/Resizable.tsx
 *
 * AX Resizable — thin wrapper around `react-resizable-panels` (v4)
 * exposing `ResizablePanelGroup`, `ResizablePanel`, and
 * `ResizableHandle`.
 *
 * Adaptation: Tailwind utility classes from the shadcn source are
 * replaced with plain `.css` BEM classes; the `withHandle` grip is a
 * plain styled box (no icon glyph).
 *
 * v4 of `react-resizable-panels` renamed `PanelGroup` → `Group`,
 * `PanelResizeHandle` → `Separator`, and `Panel` retained its name.
 */
import * as React from 'react';
import {Group, GroupImperativeHandle, Panel, Separator} from 'react-resizable-panels';

import {cx} from '../../common/cx';

import './Resizable.css';

// ---------------------------------------------------------------------------
// Internal context — shares the Group imperative handle with child Handles
// ---------------------------------------------------------------------------

const GroupRefContext = React.createContext<React.RefObject<GroupImperativeHandle | null> | null>(null);

// ---------------------------------------------------------------------------
// ResizablePanelGroup
// ---------------------------------------------------------------------------

type ResizablePanelGroupProps = Omit<React.ComponentProps<typeof Group>, 'orientation' | 'groupRef'> & {
  /**
   * AX/PX legacy alias for {@link Group}'s `orientation` prop. v4 of
   * `react-resizable-panels` renamed `direction` to `orientation`; we accept
   * both so existing call sites keep working.
   */
  direction?: 'horizontal' | 'vertical';
  orientation?: 'horizontal' | 'vertical';
};

export const ResizablePanelGroup = ({
  className,
  direction,
  orientation,
  ...props
}: ResizablePanelGroupProps) => {
  const groupRef = React.useRef<GroupImperativeHandle | null>(null);

  return (
    <GroupRefContext.Provider value={groupRef}>
      <Group
        className={cx('ax-resizable__panel-group', className)}
        orientation={orientation ?? direction}
        groupRef={groupRef}
        {...props}
      />
    </GroupRefContext.Provider>
  );
};

// ---------------------------------------------------------------------------
// ResizablePanel
// ---------------------------------------------------------------------------

export const ResizablePanel = Panel;

// ---------------------------------------------------------------------------
// ResizableHandle
// ---------------------------------------------------------------------------

const DEFAULT_SNAP_POINTS = [25, 50, 75];

type ResizableHandleProps = React.ComponentProps<typeof Separator> & {
  /**
   * Renders the six-dot grip indicator inside the handle.
   */
  withHandle?: boolean;
  /** Render the larger (square) grip box used for diagonal/full-canvas expansion. */
  expand?: boolean;
  /**
   * Percentage snap points used when double-clicking the handle.
   * The handle snaps to the nearest point; if already there, it cycles forward.
   *
   * @default [25, 50, 75]
   */
  snapPoints?: number[];
};

export const ResizableHandle = ({
  withHandle,
  expand,
  className,
  disableDoubleClick = true,
  snapPoints = DEFAULT_SNAP_POINTS,
  onDoubleClick,
  ...props
}: ResizableHandleProps) => {
  const handleRef = React.useRef<HTMLDivElement>(null);
  const groupRef = React.useContext(GroupRefContext);

  // The library sets aria-orientation and aria-valuemax after mount.
  // Read them to build a meaningful accessible name.
  React.useLayoutEffect(() => {
    const el = handleRef.current;
    if (!el) return;

    const sync = () => {
      const orientation = el.getAttribute('aria-orientation') ?? 'horizontal';
      const maxRaw = el.getAttribute('aria-valuemax');
      const max = maxRaw != null ? Math.round(Number(maxRaw)) : null;
      const direction = orientation === 'vertical' ? 'vertically' : 'horizontally';
      el.setAttribute('role', 'slider');
      el.setAttribute(
        'aria-label',
        `Resize panels ${direction}${max != null ? `, max ${max}%` : ''}`
      );
    };

    sync();
    // Re-sync only when the library updates aria-valuemax or aria-orientation.
    // Do NOT observe 'role' — we set it in sync(), which would cause an infinite loop.
    const mo = new MutationObserver(sync);
    mo.observe(el, {attributeFilter: ['aria-valuemax', 'aria-orientation']});
    return () => mo.disconnect();
  }, []);

  const handleDoubleClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onDoubleClick?.(e as React.MouseEvent<HTMLDivElement>);

      const el = handleRef.current;
      if (!el || !groupRef?.current) return;

      const currentVal = parseFloat(el.getAttribute('aria-valuenow') ?? '50');
      const controlledId = el.getAttribute('aria-controls');
      if (!controlledId) return;

      const sorted = [...snapPoints].sort((a, b) => a - b);

      // Find nearest snap point
      const nearest = sorted.reduce((prev, curr) =>
        Math.abs(curr - currentVal) < Math.abs(prev - currentVal) ? curr : prev
      );

      // If already within 1% of a snap point, cycle to the next one
      const atSnap = Math.abs(currentVal - nearest) < 1;
      const nearestIdx = sorted.indexOf(nearest);
      const target = atSnap
        ? sorted[(nearestIdx + 1) % sorted.length]
        : nearest;

      groupRef.current.setLayout({[controlledId]: target});
    },
    [onDoubleClick, snapPoints, groupRef]
  );

  return (
    <Separator
      className={cx('ax-resizable__handle', className)}
      disableDoubleClick={disableDoubleClick}
      elementRef={handleRef}
      onDoubleClick={handleDoubleClick}
      {...props}
    >
      {withHandle || expand ? (
        <div className={cx('ax-resizable__grip', expand && 'ax-resizable__grip--expand')} aria-hidden>
          {!expand && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <circle cx="3" cy="3" r="0.8" />
              <circle cx="3" cy="5" r="0.8" />
              <circle cx="3" cy="7" r="0.8" />
              <circle cx="7" cy="3" r="0.8" />
              <circle cx="7" cy="5" r="0.8" />
              <circle cx="7" cy="7" r="0.8" />
            </svg>
          )}
        </div>
      ) : null}
    </Separator>
  );
};


ResizablePanelGroup.displayName = 'ResizablePanelGroup';
ResizablePanel.displayName = 'ResizablePanel';
ResizableHandle.displayName = 'ResizableHandle';
