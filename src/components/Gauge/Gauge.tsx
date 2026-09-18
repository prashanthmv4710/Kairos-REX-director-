'use client';
// @refresh reset

/**
 * @module Gauge
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
 * For prop API + usage notes, read `Gauge.md` in this folder
 * or run `npm run ld-kit -- show Gauge`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps, type CommonProps} from '../../common/helpers';
import {categoryColor} from '../DataViz/chartTokens';

import './Gauge.css';

// ---------------------------------------------------------------------------
// Tokens & color mapping
// ---------------------------------------------------------------------------

/**
 * Color of the gauge fill arc.
 *
 * - `data` — a single data-viz categorical color from the shared PX palette
 *   (selected with `colorIndex`). Use when the gauge is one series in a
 *   dashboard and the value itself has no "good / bad" meaning.
 * - `auto` — derives a status color from the value: low → negative,
 *   mid → warning, high → positive. Use for scores and health readouts.
 * - `negative` / `warning` / `positive` — pin the status color explicitly.
 */
export type GaugeColor = 'data' | 'auto' | 'negative' | 'warning' | 'positive';

const STATUS_VAR: Record<Exclude<GaugeColor, 'data' | 'auto'>, string> = {
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

function resolveColor(color: GaugeColor, pct: number, colorIndex: number): string {
  if (color === 'data') return categoryColor(colorIndex).fill;
  if (color === 'auto') return STATUS_VAR[autoStatus(pct)];
  return STATUS_VAR[color];
}

// ---------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------

// The gauge is a 270° arc with a 90° gap centered at the bottom. The track
// starts at the bottom-left (135°) and sweeps clockwise to the bottom-right.
const ARC_FRACTION = 0.75;
const START_ANGLE = 135;

// ---------------------------------------------------------------------------
// Gauge
// ---------------------------------------------------------------------------

export interface GaugeProps extends CommonProps {
  /** Current value. Clamped to the `[min, max]` range. */
  value: number;
  /** Lower bound of the range. @default 0 */
  min?: number;
  /** Upper bound of the range. @default 100 */
  max?: number;
  /** Diameter of the gauge in pixels. @default 160 */
  size?: number;
  /** Stroke width of the track and fill arcs in pixels. @default 12 */
  thickness?: number;
  /** Color of the fill arc. @default 'data' */
  color?: GaugeColor;
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
   * Accessible name for the gauge. Falls back to a generated description that
   * includes the value and range.
   */
  'aria-label'?: string;
}

export function Gauge({
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
}: GaugeProps) {
  const range = max - min || 1;
  const clamped = Math.min(Math.max(value, min), max);
  const ratio = (clamped - min) / range; // 0–1 within the range
  const pct = ratio * 100;

  const stroke = resolveColor(color, pct, colorIndex);

  // SVG circle geometry. The radius leaves room for the stroke on both sides.
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const trackLength = circumference * ARC_FRACTION;
  const fillLength = trackLength * ratio;

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
      className={cx('ld-gauge', className)}
      style={{width: size, height: size, ...style}}
      role="meter"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-label={ariaLabel}
    >
      <svg
        className="ld-gauge-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
        focusable="false"
      >
        <g transform={`rotate(${START_ANGLE} ${center} ${center})`}>
          <circle
            className="ld-gauge-track"
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={`${trackLength} ${circumference}`}
          />
          <circle
            className="ld-gauge-fill"
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
        <div className="ld-gauge-content">
          {showValue && (
            <span className="ld-gauge-value" style={{fontSize: size * 0.225}}>
              {resolvedValue}
            </span>
          )}
          {label && (
            <span className="ld-gauge-label" style={{fontSize: size * 0.1125}}>
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
