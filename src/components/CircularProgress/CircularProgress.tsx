'use client';
// @refresh reset

/**
 * @module CircularProgress
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
 * For prop API + usage notes, read `CircularProgress.md` in this folder
 * or run `npm run ld-kit -- show CircularProgress`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps, type CommonProps} from '../../common/helpers';
import {categoryColor} from '../DataViz/chartTokens';

import './CircularProgress.css';

// ---------------------------------------------------------------------------
// Tokens & color mapping
// ---------------------------------------------------------------------------

/**
 * Color of the progress ring.
 *
 * - `data` — a single data-viz categorical color from the shared PX palette
 *   (selected with `colorIndex`). Use when the ring is one series in a
 *   dashboard.
 * - `auto` — derives a status color from the value: low → negative,
 *   mid → warning, high → positive. Use for scores and completion health.
 * - `negative` / `warning` / `positive` — pin the status color explicitly.
 */
export type CircularProgressColor =
  | 'data'
  | 'auto'
  | 'negative'
  | 'warning'
  | 'positive';

const STATUS_VAR: Record<
  Exclude<CircularProgressColor, 'data' | 'auto'>,
  string
> = {
  negative: 'var(--ld-semantic-color-fill-negative, #ea1100)',
  warning: 'var(--ld-semantic-color-fill-warning, #ffc220)',
  positive: 'var(--ld-semantic-color-fill-positive, #2a8703)',
};

/** Maps a 0–100 percentage to a status color when `color="auto"`. */
function autoStatus(pct: number): keyof typeof STATUS_VAR {
  if (pct < 34) return 'negative';
  if (pct < 67) return 'warning';
  return 'positive';
}

function resolveColor(
  color: CircularProgressColor,
  pct: number,
  colorIndex: number,
): string {
  if (color === 'data') return categoryColor(colorIndex).fill;
  if (color === 'auto') return STATUS_VAR[autoStatus(pct)];
  return STATUS_VAR[color];
}

// ---------------------------------------------------------------------------
// CircularProgress
// ---------------------------------------------------------------------------

export interface CircularProgressProps extends CommonProps {
  /** Current value. Clamped to the `[min, max]` range. */
  value: number;
  /** Lower bound of the range. @default 0 */
  min?: number;
  /** Upper bound of the range. @default 100 */
  max?: number;
  /** Diameter of the ring in pixels. @default 160 */
  size?: number;
  /** Stroke width of the track and fill in pixels. @default 12 */
  thickness?: number;
  /** Color of the fill. @default 'data' */
  color?: CircularProgressColor;
  /**
   * 0-based index into the shared PX categorical palette, used when
   * `color="data"`. Index 2 is the PX blue. @default 2
   */
  colorIndex?: number;
  /**
   * Content rendered large in the center. Defaults to the value formatted as
   * a percentage of the range (e.g. `75%`). Pass `false` to hide it.
   */
  valueLabel?: React.ReactNode;
  /** Secondary label rendered under the value (e.g. `Score`). */
  label?: React.ReactNode;
  /**
   * Accessible name. Falls back to a generated description that includes the
   * value and range.
   */
  'aria-label'?: string;
}

export function CircularProgress({
  value,
  min = 0,
  max = 100,
  size = 160,
  thickness = 12,
  color = 'data',
  colorIndex = 2,
  valueLabel,
  label,
  ...rest
}: CircularProgressProps) {
  const range = max - min || 1;
  const clamped = Math.min(Math.max(value, min), max);
  const ratio = (clamped - min) / range; // 0–1 within the range
  const pct = ratio * 100;

  const stroke = resolveColor(color, pct, colorIndex);

  // Full 360° ring. The fill is a dash sized to the value, with the gap drawn
  // as the remaining circumference. The SVG is rotated -90° so the fill grows
  // clockwise from the top (12 o'clock).
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const fillLength = circumference * ratio;

  const showValue = valueLabel !== false;
  const resolvedValue =
    valueLabel === undefined ? `${Math.round(pct)}%` : valueLabel;

  const ariaLabel =
    rest['aria-label'] ??
    `${typeof label === 'string' ? `${label}: ` : ''}${Math.round(clamped)} of ${max}`;

  const center = size / 2;
  const {className, style, ...domProps} = applyCommonProps(rest);

  return (
    <div
      {...domProps}
      className={cx('ld-circular-progress', className)}
      style={{width: size, height: size, ...style}}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-label={ariaLabel}
    >
      <svg
        className="ld-circular-progress-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
        focusable="false"
      >
        <g transform={`rotate(-90 ${center} ${center})`}>
          <circle
            className="ld-circular-progress-track"
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={thickness}
          />
          <circle
            className="ld-circular-progress-fill"
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={`${fillLength} ${circumference}`}
          />
        </g>
      </svg>

      {(showValue || label) && (
        <div className="ld-circular-progress-content">
          {showValue && (
            <span
              className="ld-circular-progress-value"
              style={{fontSize: size * 0.225}}
            >
              {resolvedValue}
            </span>
          )}
          {label && (
            <span
              className="ld-circular-progress-label"
              style={{fontSize: size * 0.1125}}
            >
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
