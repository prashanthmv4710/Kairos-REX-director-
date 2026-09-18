'use client';
// @refresh reset

/**
 * @module QuantityStepper
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
 * For prop API + usage notes, read `QuantityStepper.md` in this folder
 * or run `npm run ld-kit -- show QuantityStepper`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import type {CommonProps} from '../../common/helpers';
import {emit} from '../../common/helpers';
import {useA11yAnnouncement} from '../A11yAnnouncement';

import './QuantityStepper.css';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type QuantityStepperVariant = 'primary' | 'secondary' | 'tertiary';
export type QuantityStepperSize = 'small' | 'medium' | 'large';

export interface QuantityStepperProps extends CommonProps {
  /** Visual style variant. @default "secondary" */
  variant?: QuantityStepperVariant;
  /** Size of the stepper. @default "medium" */
  size?: QuantityStepperSize;
  /** Controlled quantity count. When provided, the component is controlled. */
  count?: number;
  /** Initial quantity count (uncontrolled). 0 = show Add button. @default 0 */
  defaultCount?: number;
  /** Maximum allowed quantity. When reached, increment button is disabled. */
  maxQuantity?: number;
  /**
   * Label text for the "+ Add" button mode. Becomes the button's `aria-label` in initial
   * mode. **Must be unique per product when multiple steppers appear on the same page**
   * (WCAG 2.4.6). Always include the product name:
   * `addLabel={\`Add ${product.name}\`}` — never leave it as the bare default "Add".
   * @default "Add"
   */
  addLabel?: string;
  /**
   * Accessible name for the Add button, used when the visible `addLabel` has to
   * stay short. Lets a tile show "+ Add" while screen readers still get the
   * product name required for a unique name (WCAG 2.4.6).
   */
  addA11yLabel?: string;
  /** When false, hides the text label in "+ Add" mode, showing only the + icon. @default true */
  showAddLabel?: boolean;
  /**
   * When provided, renders as an "Add to cart" text-only button instead of "+ Add".
   * Like `addLabel`, this becomes the button's `aria-label` — it **must include the
   * product name** to be unique across a page:
   * `cartLabel={\`Add ${product.name} to cart\`}`
   */
  cartLabel?: string;
  /** Label shown after count in stepper mode. @default "added" */
  countLabel?: string;
  /** Disables the entire component. @default false */
  disabled?: boolean;
  /**
   * When true, replaces the minus button with a trash icon when count === 1.
   * Use this in cart/bag contexts where removing the last item deletes it.
   * @default false
   */
  showTrashOnRemove?: boolean;
  /** Called whenever the quantity changes. */
  onChange?: (count: number) => void;
}

/* ------------------------------------------------------------------ */
/*  Inline SVG icons                                                   */
/* ------------------------------------------------------------------ */

const ICON_SIZES: Record<QuantityStepperSize, number> = {
  small: 16,
  medium: 24,
  large: 32,
};

function PlusIcon({size}: {size: number}) {
  if (size === 16) {
    return (
      <svg width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M7.5 8.5V13H8.5V8.5H13V7.5H8.5V3H7.5V7.5H3V8.5H7.5Z" fill="currentColor" />
      </svg>
    );
  }
  if (size === 24) {
    return (
      <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M11.25 12.75V19.5H12.75V12.75H19.5V11.25H12.75V4.5H11.25V11.25H4.5V12.75H11.25Z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width={32} height={32} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M15 17V26H17V17H26V15H17V6H15V15H6V17H15Z" fill="currentColor" />
    </svg>
  );
}

function MinusIcon({size}: {size: number}) {
  if (size === 16) {
    return (
      <svg width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M13 8.49976H3V7.49976H13V8.49976Z" fill="currentColor" />
      </svg>
    );
  }
  if (size === 24) {
    return (
      <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M19.5 12.7495H4.5V11.2495H19.5V12.7495Z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width={32} height={32} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M26 16.9995H6V14.9995H26V16.9995Z" fill="currentColor" />
    </svg>
  );
}

function TrashIcon({size}: {size: number}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10 5h4a2 2 0 1 0-4 0ZM8.5 5a3.5 3.5 0 1 1 7 0h5.25a.75.75 0 0 1 0 1.5h-1.31l-1.17 13.11A3 3 0 0 1 15.28 22H8.72a3 3 0 0 1-2.99-2.39L4.56 6.5H3.25a.75.75 0 0 1 0-1.5H8.5Zm2 4.75a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0v-7.5Zm3.5-.75a.75.75 0 0 0-.75.75v7.5a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  State machine type                                                 */
/* ------------------------------------------------------------------ */

type StepperMode = 'initial' | 'expanded' | 'collapsed';

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
/**
 * QuantityStepper — A 3-mode add/stepper/collapse control for cart flows.
 *
 * ## Accessibility requirements
 *
 * ### 1. Unique accessible names (WCAG 2.4.6)
 * When multiple steppers appear on the same page (e.g. a product grid), every
 * instance **must** have a unique `addLabel` or `cartLabel` that includes the
 * product name. The default `"Add"` is intentionally generic — override it:
 *
 * ```tsx
 * <QuantityStepper addLabel={`Add ${product.name}`} />
 * // or
 * <QuantityStepper cartLabel={`Add ${product.name} to cart`} />
 * ```
 *
 * ### 2. A11yAnnouncementProvider (required for live announcements)
 * Quantity changes are announced to screen readers via `useA11yAnnouncement()`.
 * Without an `<A11yAnnouncementProvider>` ancestor the hook silently no-ops and
 * AT users receive no feedback. Mount the provider at the page or app level:
 *
 * ```tsx
 * import { A11yAnnouncementProvider } from '../A11yAnnouncement';
 *
 * <A11yAnnouncementProvider>
 *   <QuantityStepper addLabel={`Add ${product.name}`} />
 * </A11yAnnouncementProvider>
 * ```
 *
 * Pages already wrapped by `<LivingDesign>` are covered automatically.
 */

const QuantityStepper = React.forwardRef<HTMLDivElement, QuantityStepperProps>(
  (
    {
      variant = 'secondary',
      size = 'medium',
      count: controlledCount,
      defaultCount = 0,
      maxQuantity,
      addLabel = 'Add',
      addA11yLabel,
      showAddLabel = true,
      cartLabel,
      countLabel = 'added',
      disabled = false,
      showTrashOnRemove = false,
      onChange,
      UNSAFE_className,
      UNSAFE_style,
    },
    ref,
  ) => {
    const isControlled = controlledCount !== undefined;
    const [internalCount, setInternalCount] = React.useState(defaultCount);
    const count = isControlled ? controlledCount : internalCount;
    const initialMode: StepperMode = count > 0 ? 'expanded' : 'initial';
    const [mode, setMode] = React.useState<StepperMode>(initialMode);

    // Refs for focus management
    const pillRef = React.useRef<HTMLDivElement>(null);
    const incrementBtnRef = React.useRef<HTMLButtonElement>(null);
    const prevModeRef = React.useRef<StepperMode>(initialMode);
    // Track whether the current mode transition was user-initiated (not mount/controlled)
    const focusOnExpandRef = React.useRef(false);

    // Sync mode when controlled count changes
    React.useEffect(() => {
      if (isControlled) {
        setMode(controlledCount > 0 ? 'expanded' : 'initial');
      }
    }, [isControlled, controlledCount]);

    // Move focus when mode transitions:
    //   initial/collapsed → expanded  →  focus the + (increment) button
    //   expanded → initial            →  focus the pill (now role="button")
    React.useEffect(() => {
      const prev = prevModeRef.current;
      prevModeRef.current = mode;

      if (!focusOnExpandRef.current) return;
      focusOnExpandRef.current = false;

      if (mode === 'expanded' && (prev === 'initial' || prev === 'collapsed')) {
        // rAF ensures the button is rendered before we try to focus it
        requestAnimationFrame(() => {
          incrementBtnRef.current?.focus();
        });
      } else if (mode === 'initial' && prev === 'expanded') {
        requestAnimationFrame(() => {
          pillRef.current?.focus();
        });
      }
    }, [mode]);

    const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
    const iconSize = ICON_SIZES[size];
    const isAtMax = maxQuantity !== undefined && count >= maxQuantity;
    const isExpanded = mode === 'expanded';
    const isInitial = mode === 'initial';
    const isCollapsed = mode === 'collapsed';
    const isClickable = isInitial || isCollapsed;

    // Clear timeout on unmount
    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    // Auto-collapse -- icon-only: 5s uncontrolled, 2s controlled
    const isIconOnly = !showAddLabel && !cartLabel;
    React.useEffect(() => {
      if (isIconOnly && mode === 'expanded' && count > 0) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setMode('collapsed');
        }, isControlled ? 2000 : 5000);
      }
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, [isIconOnly, mode, count]);

    const {announcePolite} = useA11yAnnouncement();
    const announceCount = React.useCallback(
      (next: number) => {
        const itemWord = next === 1 ? 'item' : 'items';
        announcePolite(
          next === 0 ? 'Removed from cart' : `${next} ${itemWord} ${countLabel}`,
        );
      },
      [announcePolite, countLabel],
    );

    const handleInitialClick = React.useCallback(() => {
      if (disabled) return;
      focusOnExpandRef.current = true;
      if (!isControlled) {
        setInternalCount(1);
        setMode('expanded');
      }
      emit('ui:stepper:add', {count: 1});
      onChange?.(1);
      announceCount(1);
    }, [disabled, isControlled, onChange, announceCount]);

    const handleIncrement = React.useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (disabled || isAtMax) return;
        const next = count + 1;
        if (!isControlled) {
          setInternalCount(next);
          setMode('expanded');
        }
        emit('ui:stepper:increment', {count: next});
        onChange?.(next);
        announceCount(next);
      },
      [disabled, isControlled, isAtMax, count, onChange, announceCount],
    );

    const handleDecrement = React.useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (disabled) return;
        const next = Math.max(0, count - 1);
        if (!isControlled) {
          setInternalCount(next);
          if (next === 0) {
            focusOnExpandRef.current = true;
            setMode('initial');
          } else {
            setMode('expanded');
          }
        }
        emit('ui:stepper:decrement', {count: next});
        onChange?.(next);
        announceCount(next);
      },
      [disabled, isControlled, count, onChange, announceCount],
    );

    const handleCollapsedClick = React.useCallback(() => {
      if (disabled) return;
      focusOnExpandRef.current = true;
      setMode('expanded');
    }, [disabled]);

    const handlePillClick = React.useCallback(() => {
      if (isInitial) handleInitialClick();
      else if (isCollapsed) handleCollapsedClick();
    }, [isInitial, isCollapsed, handleInitialClick, handleCollapsedClick]);

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handlePillClick();
        }
      },
      [handlePillClick],
    );

    // -- Style classes --
    const variantClass = `ld-quantity-stepper-pill--${variant}`;
    const sizeClass = `ld-quantity-stepper-pill--${size}`;
    const modeClass = isExpanded
      ? 'ld-quantity-stepper-mode-expanded'
      : isCollapsed
        ? 'ld-quantity-stepper-mode-collapsed'
        : 'ld-quantity-stepper-mode-initial';

    const iconBtnClass = cx(
      'ld-quantity-stepper-icon-btn',
      `ld-quantity-stepper-icon-btn--${size}`,
    );

    // -- Center content --
    let centerContent: React.ReactNode;
    if (isInitial) {
      if (cartLabel) {
        centerContent = <span className="ld-quantity-stepper-label-text">{cartLabel}</span>;
      } else if (!showAddLabel) {
        centerContent = <PlusIcon size={iconSize} />;
      } else {
        centerContent = (
          <span className="ld-quantity-stepper-pill-content">
            <PlusIcon size={iconSize} />
            <span className="ld-quantity-stepper-label-text">{addLabel}</span>
          </span>
        );
      }
    } else if (isCollapsed) {
      centerContent = <span className="ld-quantity-stepper-count-value">{count}</span>;
    } else if (isAtMax) {
      centerContent = (
        <>
          <span className="ld-quantity-stepper-label-text">Max</span>
          <span className="ld-quantity-stepper-count-value">{count}</span>
        </>
      );
    } else {
      centerContent = (
        <>
          <span className="ld-quantity-stepper-count-value">{count}</span>
          <span className="ld-quantity-stepper-label-text">{countLabel}</span>
        </>
      );
    }

    // -- Aria label --
    let ariaLabel: string;
    if (isInitial) {
      ariaLabel = cartLabel ?? addA11yLabel ?? addLabel;
    } else if (isCollapsed) {
      ariaLabel = `${count} ${count === 1 ? 'item' : 'items'} in cart, activate to adjust quantity`;
    } else {
      // Expanded: group label includes current count so AT user knows context on entry
      ariaLabel = `Quantity stepper, ${count} ${count === 1 ? 'item' : 'items'} in cart`;
    }

    return (
      <div ref={ref} className={cx('ld-quantity-stepper-root', UNSAFE_className)} style={UNSAFE_style}>
        <div
          ref={pillRef}
          className={cx(
            'ld-quantity-stepper-pill',
            variantClass,
            sizeClass,
            modeClass,
            isInitial && isIconOnly && 'ld-quantity-stepper-icon-only-initial',
          )}
          onClick={isClickable ? handlePillClick : undefined}
          onKeyDown={isClickable ? handleKeyDown : undefined}
          role={isClickable ? 'button' : 'group'}
          tabIndex={isClickable ? 0 : undefined}
          aria-label={ariaLabel}
          aria-disabled={disabled || undefined}
        >
          {/* Left slot: decrement button */}
          <div
            className={cx(
              'ld-quantity-stepper-slot-side',
              isExpanded ? 'ld-quantity-stepper-slot-visible' : 'ld-quantity-stepper-slot-hidden',
            )}
            aria-hidden={!isExpanded}
          >
            {/* Only render as <button> when expanded — outer pill has role="button" in
                initial/collapsed modes, and nested interactive elements inside a button
                violate WCAG 4.1.2 regardless of tabIndex={-1} (axe: nested-interactive). */}
            {isExpanded ? (
              <button
                className={iconBtnClass}
                onClick={handleDecrement}
                disabled={disabled}
                aria-label={count === 1 ? 'Remove item' : 'Decrease quantity'}
              >
                {showTrashOnRemove && count === 1 ? (
                  <TrashIcon size={iconSize} />
                ) : (
                  <MinusIcon size={iconSize} />
                )}
              </button>
            ) : (
              <span className={iconBtnClass} aria-hidden="true">
                <MinusIcon size={iconSize} />
              </span>
            )}
          </div>

          {/* Center slot — aria-hidden: count/label are announced via the group aria-label
              and the live region; reading them again here would be redundant for AT users. */}
          <div className="ld-quantity-stepper-slot-center" aria-hidden="true">{centerContent}</div>

          {/* Right slot: increment button */}
          <div
            className={cx(
              'ld-quantity-stepper-slot-side',
              isExpanded ? 'ld-quantity-stepper-slot-visible' : 'ld-quantity-stepper-slot-hidden',
            )}
            aria-hidden={!isExpanded}
          >
            {/* Same pattern as left slot — button only when expanded. */}
            {isExpanded ? (
              <button
                ref={incrementBtnRef}
                className={iconBtnClass}
                onClick={handleIncrement}
                disabled={disabled || isAtMax}
                aria-label={isAtMax ? `Increase quantity, maximum of ${maxQuantity} reached` : 'Increase quantity'}
              >
                <PlusIcon size={iconSize} />
              </button>
            ) : (
              <span className={iconBtnClass} aria-hidden="true">
                <PlusIcon size={iconSize} />
              </span>
            )}
          </div>
        </div>
      </div>
    );
  },
);

QuantityStepper.displayName = 'QuantityStepper';

export {QuantityStepper};
