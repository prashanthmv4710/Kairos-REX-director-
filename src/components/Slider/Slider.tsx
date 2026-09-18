'use client';
// @refresh reset

/**
 * @module Slider
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
 * For prop API + usage notes, read `Slider.md` in this folder
 * or run `npm run ld-kit -- show Slider`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import type {CommonProps} from '../../common/helpers';
import {InfoCircleIcon} from '../Icons/Icons';
import {Tooltip} from '../Tooltip/Tooltip';
import {VisuallyHidden} from '../VisuallyHidden/VisuallyHidden';

import './Slider.css';

// Ticks are always at fixed 10% intervals per Figma spec — hoisted to module
// scope so the array is not re-created on every render.
const TICK_PCTS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type SliderSize = 'large' | 'small';

export interface SliderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>,
    CommonProps {
  /** Minimum value. @default 0 */
  min?: number;
  /** Maximum value. @default 100 */
  max?: number;
  /** Step increment. @default 1 */
  step?: number;
  /**
   * Controlled value. Provide `[number]` for a single-value slider or
   * `[number, number]` for a range slider — the number of thumbs is
   * inferred from the array length.
   */
  value?: number[];
  /** Uncontrolled default value. @default [0] */
  defaultValue?: number[];
  /** Callback fired on value change. */
  onValueChange?: (value: number[]) => void;
  /** Disable the slider. @default false */
  disabled?: boolean;
  /**
   * Visual size variant.
   * - `large` — 8px track / 20px thumb, 14px bold label (default)
   * - `small` — 8px track / 20px thumb, 12px bold label
   * @default "large"
   */
  size?: SliderSize;
  /** Orientation. Currently only horizontal is implemented. @default "horizontal" */
  orientation?: 'horizontal' | 'vertical';
  /** Label rendered at the top-left of the slider. */
  label?: React.ReactNode;
  /**
   * Value rendered at the top-right of the slider. Pass a node to show a
   * formatted value (e.g. `"$50"`), or `true` to render the raw current
   * value(s) joined with an en dash for ranges.
   */
  valueLabel?: React.ReactNode | boolean;
  /** Caption rendered at the bottom-left (e.g. the minimum). */
  minLabel?: React.ReactNode;
  /** Caption rendered at the bottom-right (e.g. the maximum). */
  maxLabel?: React.ReactNode;
  /** Hidden input name for form submission. */
  name?: string;
  /**
   * Accessible label for the slider thumb (single-value variant).
   * Falls back to the `label` prop if it is a string, then to `'Slider value'`.
   * Range sliders use 'Minimum' / 'Maximum' automatically.
   * Pass this whenever no visible label string is provided.
   */
  ariaLabel?: string;
  /** Mark the field as required. Renders a `*` indicator next to the label. @default false */
  isRequired?: boolean;
  /**
   * Text content for an info tooltip shown as an icon button next to the label.
   * Only visible when `label` is also provided.
   */
  tooltip?: string;
  /**
   * Show tick marks at fixed 10% intervals along the track (11 dots: 0–100%).
   * For best alignment, set `step={(max - min) / 10}` so the thumb snaps to tick positions.
   * @default false
   */
  ticks?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/** Extract a plain string from a ReactNode for use in ARIA attributes. */
const toText = (node: React.ReactNode): string => {
  if (node == null || node === false || node === true) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  return '';
};

const THUMB_SIZE: Record<SliderSize, number> = {large: 20, small: 20};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (rawProps, ref) => {
    const {
      className,
      min = 0,
      max = 100,
      step = 1,
      value: controlledValue,
      defaultValue = [0],
      onValueChange,
      disabled = false,
      size = 'large',
      label,
      valueLabel,
      minLabel,
      maxLabel,
      name,
      ariaLabel,
      isRequired = false,
      tooltip,
      ticks = false,
      UNSAFE_className,
      UNSAFE_style,
      ...props
    } = rawProps;

    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const currentValue = isControlled ? controlledValue : internalValue;

    const isRange = currentValue.length >= 2;
    const thumbHalf = THUMB_SIZE[size] / 2;

    const trackRef = React.useRef<HTMLDivElement>(null);
    const isDragging = React.useRef(false);
    const [draggingActive, setDraggingActive] = React.useState(false);
    const activeThumb = React.useRef(0);

    const pct = React.useCallback(
      (v: number) => (max === min ? 0 : ((v - min) / (max - min)) * 100),
      [min, max],
    );

    const valueFromClientX = React.useCallback(
      (clientX: number) => {
        const track = trackRef.current;
        if (!track) return min;
        const rect = track.getBoundingClientRect();
        const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
        const raw = min + ratio * (max - min);
        const stepped = Math.round(raw / step) * step;
        return clamp(stepped, min, max);
      },
      [min, max, step],
    );

    const commit = React.useCallback(
      (next: number[]) => {
        if (!isControlled) setInternalValue(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange],
    );

    const setThumbValue = React.useCallback(
      (index: number, v: number) => {
        const next = [...currentValue];
        next[index] = v;
        if (isRange) {
          // Prevent thumbs from crossing one another.
          if (index === 0) next[0] = Math.min(next[0], next[1]);
          else next[1] = Math.max(next[1], next[0]);
        }
        commit(next);
      },
      [currentValue, isRange, commit],
    );

    const handlePointerDown = React.useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (disabled) return;
        e.preventDefault();
        // Capture on the control element so move/up always fire here,
        // even when the pointer leaves the component.
        e.currentTarget.setPointerCapture(e.pointerId);
        isDragging.current = true;
        setDraggingActive(true);
        const v = valueFromClientX(e.clientX);
        // Activate the thumb nearest to the pointer.
        if (isRange) {
          const d0 = Math.abs(v - currentValue[0]);
          const d1 = Math.abs(v - currentValue[1]);
          activeThumb.current = d0 <= d1 ? 0 : 1;
        } else {
          activeThumb.current = 0;
        }
        setThumbValue(activeThumb.current, v);
      },
      [disabled, valueFromClientX, isRange, currentValue, setThumbValue],
    );

    const handlePointerMove = React.useCallback(
      (e: React.PointerEvent) => {
        if (!isDragging.current || disabled) return;
        setThumbValue(activeThumb.current, valueFromClientX(e.clientX));
      },
      [disabled, valueFromClientX, setThumbValue],
    );

    const handlePointerUp = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
      isDragging.current = false;
      setDraggingActive(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
    }, []);

    const handleKeyDown = (index: number) => (e: React.KeyboardEvent) => {
      if (disabled) return;
      const v = currentValue[index];
      let next = v;
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          next = Math.min(max, v + step);
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          next = Math.max(min, v - step);
          break;
        case 'Home':
          next = min;
          break;
        case 'End':
          next = max;
          break;
        default:
          return;
      }
      e.preventDefault();
      setThumbValue(index, next);
    };

    /* ----- Derived geometry ----- */
    const lo = isRange ? Math.min(currentValue[0], currentValue[1]) : min;
    const hi = isRange ? Math.max(currentValue[0], currentValue[1]) : currentValue[0] ?? min;
    const fillLeft = isRange ? pct(lo) : 0;
    const fillWidth = isRange ? pct(hi) - pct(lo) : pct(currentValue[0] ?? min);

    /* ----- Header value ----- */
    const renderedValue =
      valueLabel === true
        ? currentValue.map((v) => v).join(' – ')
        : valueLabel === false
          ? null
          : valueLabel;

    const hasHeader = label != null || tooltip != null || (renderedValue != null && renderedValue !== '');
    const hasFooter = minLabel != null || maxLabel != null;

    /* ----- Screen-reader description ----- */
    const labelText = toText(label) || ariaLabel || 'Slider';
    // For valueLabel as a formatted string use it; otherwise fall back to raw numbers.
    const valueLabelText = typeof valueLabel === 'string' ? valueLabel : null;
    const srValueText = isRange
      ? (valueLabelText ?? `${currentValue[0]} to ${currentValue[1]}`)
      : (valueLabelText ?? String(currentValue[0] ?? min));
    // Always use raw min/max numbers — minLabel/maxLabel can be generic ("Min value")
    // and are meaningless in a spoken description.
    const srDescription = `${labelText}: ${srValueText} selected. Lowest possible is ${min}, highest is ${max}.`;

    // aria-valuetext gives screen readers the formatted value instead of the raw number.
    const thumbValueText = (index: number): string => {
      if (valueLabelText) {
        return isRange
          ? (index === 0 ? `Minimum: ${valueLabelText.split(/\s*[–-]\s*/)[0]?.trim() ?? currentValue[0]}` : `Maximum: ${valueLabelText.split(/\s*[–-]\s*/)[1]?.trim() ?? currentValue[1]}`)
          : valueLabelText;
      }
      return isRange
        ? (index === 0 ? `Minimum: ${currentValue[0]}` : `Maximum: ${currentValue[1]}`)
        : String(currentValue[index] ?? min);
    };

    const wrapperClasses = cx(
      'ld-slider',
      size === 'small' && 'ld-slider--small',
      isRange && 'ld-slider--range',
      disabled && 'ld-slider--disabled',
      draggingActive && 'ld-slider--dragging',
      className,
      UNSAFE_className,
    );

    return (
      <div ref={ref} className={wrapperClasses} style={UNSAFE_style} {...props}>
        {hasHeader && (
          <div className="ld-slider-header">
            <div className="ld-slider-label-group">
              {label != null && (
                <span className="ld-slider-label">
                  {label}
                  {isRequired && (
                    <span className="ld-slider-required" aria-hidden="true"> *</span>
                  )}
                </span>
              )}
              {tooltip && (
                <Tooltip content={tooltip} position="above" relationship="description">
                  <button
                    type="button"
                    className="ld-slider-info-btn"
                    aria-label={disabled ? 'More information (slider disabled)' : 'More information'}
                    aria-disabled={disabled || undefined}
                    tabIndex={disabled ? -1 : undefined}
                  >
                    <InfoCircleIcon size="small" decorative />
                  </button>
                </Tooltip>
              )}
            </div>
            <span className="ld-slider-value">{renderedValue}</span>
          </div>
        )}

        <div
          className="ld-slider-control"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div ref={trackRef} className="ld-slider-track">
            <div className="ld-slider-fill" style={{left: `${fillLeft}%`, width: `${fillWidth}%`}} />
          </div>
          {ticks && (
            <div className="ld-slider-ticks" aria-hidden="true">
              {TICK_PCTS.map((pos) => (
                <div key={pos} className="ld-slider-tick" style={{left: `${pos}%`}} />
              ))}
            </div>
          )}
          {currentValue.map((v, index) => (
            <span
              key={index}
              role="slider"
              tabIndex={disabled ? -1 : 0}
              aria-valuemin={isRange && index === 1 ? currentValue[0] : min}
              aria-valuemax={isRange && index === 0 ? currentValue[1] : max}
              aria-valuenow={v}
              aria-valuetext={thumbValueText(index)}
              aria-disabled={disabled || undefined}
              aria-required={isRequired || undefined}
              aria-label={isRange
                ? (index === 0 ? `${ariaLabel ? ariaLabel + ' ' : ''}Minimum` : `${ariaLabel ? ariaLabel + ' ' : ''}Maximum`)
                : (ariaLabel ?? (typeof label === 'string' ? label : 'Slider value'))
              }
              className="ld-slider-thumb"
              style={{left: `calc(${pct(v)}% - ${thumbHalf}px)`}}
              onKeyDown={handleKeyDown(index)}
            />
          ))}
        </div>

        {hasFooter && (
          <div className="ld-slider-footer" aria-hidden="true">
            <span className="ld-slider-min">{minLabel}</span>
            <span className="ld-slider-max">{maxLabel}</span>
          </div>
        )}

        {name &&
          currentValue.map((v, index) => (
            <input key={index} type="hidden" name={isRange ? `${name}[${index}]` : name} value={v} />
          ))}

        <VisuallyHidden as="p">
          {srDescription}
        </VisuallyHidden>
      </div>
    );
  },
);

Slider.displayName = 'Slider';

export {Slider};
