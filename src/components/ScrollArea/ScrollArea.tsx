'use client';
// @refresh reset

/**
 * @module ScrollArea
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
 * For prop API + usage notes, read `ScrollArea.md` in this folder
 * or run `npm run ld-kit -- show ScrollArea`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps, type CommonProps} from '../../common/helpers';
import './ScrollArea.css';

// ---------------------------------------------------------------------------
// ScrollArea
// ---------------------------------------------------------------------------

export interface ScrollAreaProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'>,
    CommonProps {
  children: React.ReactNode;
  /**
   * Accessible label for the scrollable region. Announced by screen readers
   * when keyboard focus enters the viewport.
   *
   * @default "Scrollable content"
   */
  a11yLabel?: string;
}

export const ScrollArea: React.FunctionComponent<ScrollAreaProps> = (props) => {
  const {className, children, a11yLabel = 'Scrollable content', ...rest} = applyCommonProps(props);

  return (
    <div className={cx('ld-scroll-area-root', className)} {...rest}>
      {/* tabIndex={0} makes the scrollable region keyboard-accessible (WCAG 2.1.1).
          role="group" + aria-label announce the region's purpose to AT when focused. */}
      <div
        className="ld-scroll-area-viewport"
        tabIndex={0}
        role="group"
        aria-label={a11yLabel}
      >
        {children}
      </div>
    </div>
  );
};

ScrollArea.displayName = 'ScrollArea';

// ---------------------------------------------------------------------------
// ScrollBar
// ---------------------------------------------------------------------------

export interface ScrollBarProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'>,
    CommonProps {
  /** Orientation of the scrollbar. @default "vertical" */
  orientation?: 'vertical' | 'horizontal';
}

export const ScrollBar: React.FunctionComponent<ScrollBarProps> = (props) => {
  const {className, orientation = 'vertical', ...rest} = applyCommonProps(props);

  return (
    <div
      className={cx(
        'ld-scroll-area-scrollbar',
        `ld-scroll-area-scrollbar--${orientation}`,
        className,
      )}
      {...rest}
    />
  );
};

ScrollBar.displayName = 'ScrollBar';
