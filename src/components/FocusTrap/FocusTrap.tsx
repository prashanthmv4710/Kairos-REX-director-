'use client';
// @refresh reset

/**
 * @module FocusTrap
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
 * For prop API + usage notes, read `FocusTrap.md` in this folder
 * or run `npm run ld-kit -- show FocusTrap`.
 */

import * as React from 'react';

import {applyCommonProps} from '../../common/helpers';
interface _FocusLockProps {
  children: React.ReactNode;
  disabled?: boolean;
  returnFocus?: boolean;
  onDeactivation?: () => void;
  [key: string]: unknown;
}

const FocusLock: React.FC<_FocusLockProps> = ({
  children,
  disabled = false,
  returnFocus = false,
  onDeactivation,
  ...rest
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const previouslyFocused = React.useRef<Element | null>(null);
  const onDeactivationRef = React.useRef(onDeactivation);
  React.useEffect(() => { onDeactivationRef.current = onDeactivation; });

  React.useEffect(() => {
    if (disabled) return;
    previouslyFocused.current = document.activeElement;
    const el = containerRef.current;
    if (!el) return;

    const getFocusables = () => Array.from(el.querySelectorAll<HTMLElement>(
      // Exclude tabindex="-1" from every branch — calendar days use aria-disabled (not the
      // native disabled attribute) and set tabindex="-1" on non-focused days, so without
      // this exclusion all ~30 day buttons would be in the list and Tab would escape.
      'a[href]:not([tabindex="-1"]),button:not([disabled]):not([tabindex="-1"]),textarea:not([disabled]):not([tabindex="-1"]),input:not([disabled]):not([tabindex="-1"]),select:not([disabled]):not([tabindex="-1"]),[tabindex]:not([tabindex="-1"])'
    ));

    const initial = getFocusables();
    if (initial.length > 0) initial[0].focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      // Only act when focus is inside this trap (handles nested traps correctly).
      if (!el.contains(document.activeElement)) return;
      // Query fresh each time — handles dynamically added/removed focusables (e.g. scrollable
      // content regions that gain tabindex="0" after mount via ResizeObserver).
      const focusables = getFocusables();
      // No focusable elements (e.g. a loading dialog) — keep focus inside the trap.
      if (focusables.length === 0) { e.preventDefault(); return; }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const focusedIndex = focusables.indexOf(document.activeElement as HTMLElement);
      // focusedIndex === -1 when focus is on a programmatically focused tabIndex={-1} element
      // inside the trap (e.g. a dialog heading). Prevent default in both directions so focus
      // cannot escape the trap from a non-tabbable element: forward Tab wraps to first, and
      // Shift+Tab wraps to last.
      if (e.shiftKey) {
        if (focusedIndex === 0 || focusedIndex === -1) { e.preventDefault(); last.focus(); e.stopImmediatePropagation(); }
      } else {
        if (focusedIndex === focusables.length - 1 || focusedIndex === -1) { e.preventDefault(); first.focus(); e.stopImmediatePropagation(); }
      }
    };
    // Use document-level listener so Tab is always intercepted even if bubbling
    // is stopped by a child element or the event originates on the container itself.
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      onDeactivationRef.current?.();
      if (returnFocus && previouslyFocused.current instanceof HTMLElement) {
        previouslyFocused.current.focus();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, returnFocus]);

  return <div ref={containerRef} {...rest}>{children}</div>;
};
export interface FocusTrapProps
  extends Omit<React.ComponentProps<typeof FocusLock>, 'className' | 'style'> {
  /**
   * The content for the focus lock.
   */
  children: React.ReactNode;
  /**
   * If focus should be returned to the triggering element.
   *
   * @default true
   */
  hasFocusReturn?: boolean;
}

/**
 * Focus Trap is a utility component that isolates browser focus for accessibility purposes.
 * *
 */
export const FocusTrap: React.FunctionComponent<FocusTrapProps> = (props) => {
  const {hasFocusReturn = true, ...rest} = applyCommonProps(props);

  // Focus return conflicts with all UI announcements.
  //
  // @see {@link https://jira.walmart.com/browse/LD-607}
  //
  // 1. Focus return will stomp over aria-live. Screen reader can only read one thing at a time.
  // 2. Focus return is required for all modal-like components.
  // 3. Recommend manage all UI announcement within children or outside experience entirely.
  return <FocusLock returnFocus={hasFocusReturn} {...rest} />;
};

FocusTrap.displayName = 'FocusTrap';
