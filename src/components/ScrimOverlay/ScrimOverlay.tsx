'use client';
// @refresh reset

/**
 * @module ScrimOverlay
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
 * For prop API + usage notes, read `ScrimOverlay.md` in this folder
 * or run `npm run ld-kit -- show ScrimOverlay`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {useOnKeyDown} from '../../hooks/hooks';
import {Overlay, OverlayScrim} from '../Overlay';
import {SsrBoundary} from '../SsrBoundary';

export interface ScrimOverlayProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onClick'> {
  /** Whether the scrim is mounted and visible. */
  isOpen: boolean;
  /**
   * Callback fired when the scrim requests to close — clicking the scrim
   * or pressing Escape (when `dismissOnEscape` is true).
   */
  onClose?: (
    event:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | KeyboardEvent
      | undefined,
  ) => void;
  /** If true, clicking the scrim calls `onClose`. @default true */
  dismissOnClick?: boolean;
  /** If true, pressing Escape calls `onClose`. @default true */
  dismissOnEscape?: boolean;
  /**
   * Optional content rendered above the scrim, centered in the overlay.
   * Useful for composing custom dialogs or loaders that need a scrim.
   */
  children?: React.ReactNode;
  /** Extra class on the scrim element. */
  scrimClassName?: string;
}

/**
 * Scrim Overlay is the dimming layer rendered behind modal surfaces
 * (Modal, Panel, BottomSheet, custom dialogs). It mounts via the shared
 * `Overlay` portal and uses the standard `OverlayScrim` styling.
 *
 * Most consumers don't need this directly — use `Modal`, `Panel`, or
 * `BottomSheet` which already include their own scrim. Reach for
 * `ScrimOverlay` when you're composing a fully custom overlay surface.
 */
export const ScrimOverlay: React.FunctionComponent<ScrimOverlayProps> = ({
  isOpen,
  onClose,
  dismissOnClick = true,
  dismissOnEscape = true,
  children,
  scrimClassName,
  className,
  ...rest
}) => {
  const handleEscape = React.useCallback(
    (event: KeyboardEvent) => {
      if (dismissOnEscape) onClose?.(event);
    },
    [dismissOnEscape, onClose],
  );

  useOnKeyDown(['Esc', 'Escape'], handleEscape);

  if (!isOpen) return null;

  return (
    <SsrBoundary>
      <Overlay {...rest}>
        <OverlayScrim
          className={cx(scrimClassName)}
          onClick={(event) => {
            if (dismissOnClick) onClose?.(event);
          }}
        />
        {children ? (
          <div
            className={cx('ld-scrim-overlay-content', className)}
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <div style={{pointerEvents: 'auto'}}>{children}</div>
          </div>
        ) : null}
      </Overlay>
    </SsrBoundary>
  );
};

ScrimOverlay.displayName = 'ScrimOverlay';
