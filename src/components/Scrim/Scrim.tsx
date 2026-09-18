// @refresh reset

/**
 * @module Scrim
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
 * For prop API + usage notes, read `Scrim.md` in this folder
 * or run `npm run ld-kit -- show Scrim`.
 */

/**
 * @source PX
 * @ported-from notes/LD-PX-Starter-Kit - V2/client/components/ui/Scrim.tsx
 *
 * Backdrop primitive used behind PX overlays (Modal, Panel, BottomSheet).
 * ld-kit's `Overlay` ships an internal scrim, but PX patterns layer their
 * own animated scrim explicitly, so it lives here as a standalone primitive.
 *
 * Changes from the source:
 * - CSS Modules → plain `.css` with `.px-scrim*` class prefixes.
 * - `cx` from `common/cx` replaces hand-built className concatenation.
 */
import * as React from 'react';

import {cx} from '../../common/cx';

import './Scrim.css';

export type ScrimVariant = 'default' | 'inverse';

export interface ScrimProps extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * Visual variant of the scrim.
   * @default 'default'
   */
  variant?: ScrimVariant;
  /**
   * Whether the scrim is visible / open.
   * @default true
   */
  isOpen?: boolean;
  /**
   * Whether the scrim is in a closing animation state.
   * @default false
   */
  isClosing?: boolean;
}

export const Scrim = React.forwardRef<HTMLDivElement, ScrimProps>(
  function Scrim(
    {variant = 'default', isOpen = true, isClosing = false, className, ...props},
    ref,
  ) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cx(
          'px-scrim',
          variant === 'inverse' && 'px-scrim--inverse',
          isOpen && 'px-scrim--open',
          isClosing && 'px-scrim--closing',
          className,
        )}
        {...props}
      />
    );
  },
);

Scrim.displayName = 'Scrim';
