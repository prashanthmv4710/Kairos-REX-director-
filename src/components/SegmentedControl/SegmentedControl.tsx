'use client';
// @refresh reset

/**
 * @module SegmentedControl
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
 * For prop API + usage notes, read `SegmentedControl.md` in this folder
 * or run `npm run ld-kit -- show SegmentedControl`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps, type CommonProps} from '../../common/helpers';
import {emit} from '../../common/helpers';
import './SegmentedControl.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SegmentedControlItem {
  /** Unique value for this segment */
  value: string;
  /** Label displayed in the segment */
  label: React.ReactNode;
  /** Optional leading icon */
  icon?: React.ReactNode;
  /** Disable this individual segment */
  disabled?: boolean;
  /**
   * ID of the associated panel element. Used only when `pattern="tablist"` to
   * wire `aria-controls` on each tab → the panel it reveals.
   * @example panelId="panel-grid-view"
   */
  panelId?: string;
}

export interface SegmentedControlProps extends CommonProps {
  /**
   * The list of segment items (2-5 items).
   */
  items: SegmentedControlItem[];

  /**
   * The currently selected value (controlled).
   */
  value: string;

  /**
   * Called when the user selects a segment.
   */
  onChange: (value: string) => void;

  /**
   * Accessible label for the control group.
   */
  'aria-label'?: string;

  /**
   * The ARIA pattern to use.
   *
   * - `"radio"` (default) — `role="radiogroup"` + `role="radio"` + `aria-checked`.
   *   Use for **filters** and value-selection where no associated panel exists.
   *   Keyboard: arrow keys move and immediately select.
   *
   * - `"tablist"` — `role="tablist"` + `role="tab"` + `aria-selected`.
   *   Use for **view switching** where each segment reveals a distinct content panel.
   *   Wire each item's `panelId` to the matching panel's `id` for full APG compliance.
   *   Keyboard: arrow keys move and select (automatic activation).
   *
   * @default "radio"
   */
  pattern?: 'radio' | 'tablist';

  /**
   * Disable all segments.
   * @default false
   */
  disabled?: boolean;

  /**
   * If true the control stretches to fill its container width.
   * @default false
   */
  isFullWidth?: boolean;

  /**
   * Icon-only variant — hides every segment's text label and renders just the
   * leading icon in a compact square. The label text is preserved as the
   * segment's accessible name (and tooltip), so screen-reader users still hear
   * it. Designed for space-constrained surfaces like a collapsed
   * {@link AgentChatSidebar} rail.
   * @default false
   */
  iconOnly?: boolean;
}

// ---------------------------------------------------------------------------
// SegmentedControl
// ---------------------------------------------------------------------------

function getPosition(index: number, count: number): 'left' | 'center' | 'right' {
  if (index === 0) return 'left';
  if (index === count - 1) return 'right';
  return 'center';
}

export const SegmentedControl: React.FunctionComponent<SegmentedControlProps> = (props) => {
  const {
    className,
    items,
    value,
    onChange,
    'aria-label': ariaLabel,
    pattern = 'radio',
    disabled = false,
    isFullWidth = false,
    iconOnly = false,
    ...rest
  } = applyCommonProps(props);

  const isTablist = pattern === 'tablist';

  const count = items.length;
  const segmentRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const enabledIndices = React.useMemo(
    () =>
      items
        .map((item, idx) => ({item, idx}))
        .filter(({item}) => !disabled && !item.disabled)
        .map(({idx}) => idx),
    [items, disabled],
  );

  // The roving tabindex target: whichever item matches `value`. If nothing
  // matches, the first enabled segment becomes the single Tab stop so the
  // group is still reachable by keyboard.
  const activeIndex = items.findIndex((item) => item.value === value);
  const focusIndex = activeIndex !== -1 ? activeIndex : enabledIndices[0] ?? -1;

  const selectByIndex = (nextIndex: number) => {
    const item = items[nextIndex];
    if (!item) return;
    emit('ui:segment:change', {value: item.value});
    onChange(item.value);
    segmentRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (enabledIndices.length === 0) return;
    const currentPos = enabledIndices.indexOf(index);
    const fromPos = currentPos === -1 ? 0 : currentPos;
    let nextPos: number;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextPos = (fromPos + 1) % enabledIndices.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextPos = (fromPos - 1 + enabledIndices.length) % enabledIndices.length;
        break;
      case 'Home':
        nextPos = 0;
        break;
      case 'End':
        nextPos = enabledIndices.length - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    selectByIndex(enabledIndices[nextPos]);
  };

  return (
    <div
      role={isTablist ? 'tablist' : 'radiogroup'}
      aria-label={ariaLabel}
      className={cx(
        'ld-segmented-control-root',
        isFullWidth && 'ld-segmented-control-root--full-width',
        iconOnly && 'ld-segmented-control-root--icon-only',
        className,
      )}
      {...rest}
    >
      {items.map((item, index) => {
        const isActive = item.value === value;
        const isDisabled = disabled || item.disabled;
        const position = getPosition(index, count);

        // In icon-only mode the visible label is suppressed, so fall back to
        // the label string (when it is one) as the accessible name + tooltip.
        const a11yLabel =
          iconOnly && typeof item.label === 'string' ? item.label : undefined;

        return (
          <button
            key={item.value}
            ref={(el) => {
              segmentRefs.current[index] = el;
            }}
            type="button"
            role={isTablist ? 'tab' : 'radio'}
            // tablist uses aria-selected; radiogroup uses aria-checked
            {...(isTablist
              ? {
                  'aria-selected': isActive,
                  ...(item.panelId ? {'aria-controls': item.panelId} : {}),
                }
              : {'aria-checked': isActive})}
            aria-label={a11yLabel}
            title={a11yLabel}
            tabIndex={index === focusIndex ? 0 : -1}
            disabled={isDisabled}
            className={cx(
              'ld-segmented-control-segment',
              `ld-segmented-control-segment--${position}`,
              isActive && 'ld-segmented-control-segment--active',
              isDisabled && 'ld-segmented-control-segment--disabled',
              iconOnly && 'ld-segmented-control-segment--icon-only',
            )}
            onClick={() => {
              if (!isDisabled) { emit('ui:segment:change', {value: item.value}); onChange(item.value); }
            }}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {item.icon && (
              <span className="ld-segmented-control-icon" aria-hidden="true">
                {item.icon}
              </span>
            )}
            {!iconOnly && (
              <span className="ld-segmented-control-label">{item.label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

SegmentedControl.displayName = 'SegmentedControl';
