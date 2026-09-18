'use client';
// @refresh reset

/**
 * @module Tooltip
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
 * For prop API + usage notes, read `Tooltip.md` in this folder
 * or run `npm run ld-kit -- show Tooltip`.
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {cx} from '../../common/cx';
import {useStableId, applyCommonProps} from '../../common/helpers';
import {useCSSTransition} from '../../common/useCSSTransition';
import {VisuallyHidden} from '../VisuallyHidden';
import './Tooltip.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TooltipPosition = 'above' | 'below' | 'before' | 'after' | 'topCenterOrLeft';
export type TooltipRelationship = 'label' | 'description';

export interface TooltipProps {
  children: React.ReactElement;
  content: string;
  position?: TooltipPosition;
  relationship?: TooltipRelationship;
  showDelay?: number;
  hideDelay?: number;
}

// ---------------------------------------------------------------------------
// Portal helper
// ---------------------------------------------------------------------------

function useTooltipPortal() {
  const [container] = React.useState(() => {
    if (typeof document === 'undefined') return null;
    const el = document.createElement('div');
    el.setAttribute('data-ld-tooltip-portal', '');
    return el;
  });

  React.useEffect(() => {
    if (!container) return;
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, [container]);

  return container;
}

// ---------------------------------------------------------------------------
// Position calculation
// ---------------------------------------------------------------------------

const GAP = 4;

function calculatePosition(
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  position: TooltipPosition
): {top: number; left: number} {
  const centeredLeft = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;

  switch (position) {
    case 'above':
      return {
        top: triggerRect.top - tooltipRect.height - GAP,
        left: centeredLeft,
      };
    case 'topCenterOrLeft': {
      const viewportWidth = typeof window === 'undefined' ? Number.POSITIVE_INFINITY : window.innerWidth;
      return {
        top: triggerRect.top - tooltipRect.height - GAP,
        left: Math.max(GAP, Math.min(centeredLeft, viewportWidth - tooltipRect.width - GAP)),
      };
    }
    case 'below':
      return {
        top: triggerRect.bottom + GAP,
        left: centeredLeft,
      };
    case 'before':
      return {
        top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
        left: triggerRect.left - tooltipRect.width - GAP,
      };
    case 'after':
      return {
        top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
        left: triggerRect.right + GAP,
      };
  }
}

// ---------------------------------------------------------------------------
// Tooltip
// ---------------------------------------------------------------------------

export const Tooltip: React.FunctionComponent<TooltipProps> = (props) => {
  const {
    children,
    content,
    position = 'above',
    relationship = 'description',
    showDelay = 250,
    hideDelay = 250,
  } = props;

  const tooltipId = useStableId();
  // Separate ID for the always-mounted VisuallyHidden span that satisfies
  // aria-labelledby / aria-describedby even when the visual tooltip is unmounted.
  const ariaTargetId = useStableId();
  const triggerRef = React.useRef<HTMLElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const showTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [visible, setVisible] = React.useState(false);
  const [posStyle, setPosStyle] = React.useState<React.CSSProperties>({});
  const portalContainer = useTooltipPortal();

  const clearTimers = () => {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const show = React.useCallback(() => {
    clearTimers();
    showTimerRef.current = setTimeout(() => setVisible(true), showDelay);
  }, [showDelay]);

  const hide = React.useCallback(() => {
    clearTimers();
    hideTimerRef.current = setTimeout(() => setVisible(false), hideDelay);
  }, [hideDelay]);

  // Position update when visible — useLayoutEffect to calculate before paint
  React.useLayoutEffect(() => {
    if (!visible || !triggerRef.current || !tooltipRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const pos = calculatePosition(triggerRect, tooltipRect, position);
    setPosStyle({top: pos.top, left: pos.left});
  }, [visible, position]);

  // Cleanup timers on unmount
  React.useEffect(() => {
    return clearTimers;
  }, []);

  // WCAG 1.4.13 — tooltip must be dismissable via Escape without moving focus.
  React.useEffect(() => {
    if (!visible) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearTimers();
        setVisible(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [visible]);

  const {shouldMount} = useCSSTransition({
    classNames: {
      enter: 'ld-tooltip-enter',
      enterActive: 'ld-tooltip-enterActive',
      exit: 'ld-tooltip-exit',
      exitActive: 'ld-tooltip-exitActive',
    },
    in: visible,
    mountOnEnter: true,
    nodeRef: tooltipRef as React.RefObject<Element>,
    timeout: 80,
    unmountOnExit: true,
  });

  // Augment trigger child with event handlers + ARIA
  const triggerChild = React.Children.only(children);
  const triggerProps: Record<string, unknown> = {
    ref: triggerRef,
    onMouseEnter: (e: React.MouseEvent) => {
      ((triggerChild.props as Record<string, unknown>).onMouseEnter as ((e: React.MouseEvent) => void) | undefined)?.(e);
      show();
    },
    onMouseLeave: (e: React.MouseEvent) => {
      ((triggerChild.props as Record<string, unknown>).onMouseLeave as ((e: React.MouseEvent) => void) | undefined)?.(e);
      hide();
    },
    onFocus: (e: React.FocusEvent) => {
      ((triggerChild.props as Record<string, unknown>).onFocus as ((e: React.FocusEvent) => void) | undefined)?.(e);
      show();
    },
    onBlur: (e: React.FocusEvent) => {
      ((triggerChild.props as Record<string, unknown>).onBlur as ((e: React.FocusEvent) => void) | undefined)?.(e);
      hide();
    },
  };

  // `relationship="label"` is meant for triggers that have no name of their
  // own — Tooltip supplies one via `aria-labelledby` pointing at the
  // always-mounted hidden span below. But a lot of call sites wrap a control
  // that *already* names itself (an `IconButton` with its own `a11yLabel`, or
  // a plain element with its own `aria-label`) with the exact same text
  // passed as `content`. `aria-labelledby` still gets added on top in that
  // case, and rather than "the labelledby wins" the way the spec suggests,
  // several screen readers end up announcing the name twice. So: only add
  // `aria-labelledby` when the trigger doesn't already carry its own label —
  // otherwise leave it alone and let that existing label do the naming.
  const childProps = triggerChild.props as Record<string, unknown>;
  const hasOwnLabel =
    (typeof childProps['aria-label'] === 'string' && childProps['aria-label'].length > 0) ||
    (typeof childProps.a11yLabel === 'string' && (childProps.a11yLabel as string).length > 0) ||
    // A child that already points at its own aria-labelledby target (rather
    // than a plain aria-label/a11yLabel) also already names itself — without
    // this check the `cloneElement` below would silently overwrite that
    // reference with ours instead of just skipping the (now redundant) write.
    (typeof childProps['aria-labelledby'] === 'string' && childProps['aria-labelledby'].length > 0);

  if (relationship === 'label') {
    if (hasOwnLabel) {
      // Trigger already names itself — don't overwrite its name with ours.
      // Only surface the tooltip text as a description if it actually says
      // something the trigger's own name doesn't; when the two match (the
      // common case — the same string passed to both `content` and
      // `aria-label`/`a11yLabel`) adding it would make the screen reader
      // read the name twice ('New chat, button, New chat').
      //
      // NOTE: this equality check only covers the `aria-label`/`a11yLabel`
      // arm of `hasOwnLabel` above. A child that names itself via a
      // pre-existing `aria-labelledby` instead still unconditionally picks
      // up a description here — there's no string to compare it against.
      // That's the rarer path and probably fine, but it's a deliberate gap,
      // not an oversight; flag before relying on it.
      const ownLabel = (childProps['aria-label'] ?? childProps.a11yLabel) as string | undefined;
      if (typeof content !== 'string' || content !== ownLabel) {
        triggerProps['aria-describedby'] = ariaTargetId;
      }
    } else {
      triggerProps['aria-labelledby'] = ariaTargetId;
    }
  } else {
    triggerProps['aria-describedby'] = ariaTargetId;
  }

  const augmentedTrigger = React.cloneElement(triggerChild, triggerProps as Record<string, unknown>);

  // Always-mounted hidden span — satisfies aria-labelledby / aria-describedby
  // even when the visual tooltip is unmounted between interactions. It's
  // pure name/description *source* text, not content of its own, so
  // `aria-hidden` keeps it out of browse-mode/reading-mode traversal (where
  // it was landing as its own stop, then "vanishing" off-screen) — the
  // id-reference still resolves it for naming regardless of aria-hidden.
  // `ld-a11y-nameSource` marks the pattern so it isn't mistaken for a bug.
  const ariaTarget = (
    <VisuallyHidden id={ariaTargetId} aria-hidden="true" className="ld-a11y-nameSource">{content}</VisuallyHidden>
  );

  const tooltipEl = shouldMount ? (
    <div
      aria-hidden="true"
      className={cx('ld-tooltip-tooltip', `ld-tooltip-${position}`)}
      id={tooltipId}
      ref={tooltipRef}
      role="tooltip"
      style={posStyle}
    >
      {content}
    </div>
  ) : null;

  return (
    <>
      {augmentedTrigger}
      {ariaTarget}
      {portalContainer && tooltipEl
        ? ReactDOM.createPortal(tooltipEl, portalContainer)
        : tooltipEl}
    </>
  );
};

Tooltip.displayName = 'Tooltip';
