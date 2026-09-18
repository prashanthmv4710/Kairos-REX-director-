// @refresh reset

/**
 * @module MetricGroup
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
 * For prop API + usage notes, read `MetricGroup.md` in this folder
 * or run `npm run ld-kit -- show MetricGroup`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/walmart/MetricGroup.tsx
 *
 * AX Metric Group — renders 2-3 `core/Metric` side-by-side, separated by
 * vertical dividers.
 *
 * The source uses `<Divider orientation="vertical" />`; ld-kit's
 * `core/Divider` is `<hr>`-based and has no orientation prop, so the
 * vertical separator is a styled `<span>` with the same token-driven color.
 */
import * as React from 'react';

import {cx} from '../../common/cx';
import {Metric, type MetricProps} from '../Metric/Metric';

import './MetricGroup.css';

export interface MetricGroupProps {
  /** 2-3 metric prop objects rendered side-by-side. */
  metrics: MetricProps[];
  /**
   * Accessible label for the metric group. When omitted, a label is
   * auto-generated from each metric's title, value, unit, and trend —
   * e.g. "Total Sales: $1,234, Positive, trending up; Units Sold: 567".
   * Override this when the auto-generated string isn't descriptive enough.
   */
  a11yLabel?: string;
  className?: string;
}

const TREND_LABELS: Record<string, string> = {
  positiveUp:   'Positive, trending up',
  positiveDown: 'Positive, trending down',
  negativeUp:   'Negative, trending up',
  negativeDown: 'Negative, trending down',
};

function buildGroupLabel(metrics: MetricProps[]): string {
  return metrics
    .map((m) => {
      const parts: string[] = ['Metric'];
      if (m.title && typeof m.title === 'string') parts.push(m.title);
      if (m.value != null) {
        const val = typeof m.value === 'string' || typeof m.value === 'number'
          ? String(m.value)
          : '';
        const unit = m.unit && typeof m.unit === 'string' ? m.unit : '';
        parts.push(unit ? `${unit}${val}` : val);
      }
      if (m.variant && m.variant !== 'neutral') {
        const trend = m.a11yTrendIndicatorLabel ?? TREND_LABELS[m.variant];
        if (trend) parts.push(trend);
      }
      if (m.textLabel && typeof m.textLabel === 'string') parts.push(m.textLabel);
      return parts.join(': ');
    })
    .join('; ');
}

export const MetricGroup: React.FC<MetricGroupProps> = ({metrics, a11yLabel, className}) => {
  if (process.env.NODE_ENV !== 'production') {
    if (metrics.length < 2 || metrics.length > 3) {
      // eslint-disable-next-line no-console
      console.warn(
        `[MetricGroup] Expected 2-3 metrics, received ${metrics.length}.`,
      );
    }
  }

  const items = metrics.slice(0, 3);
  const groupLabel = a11yLabel ?? buildGroupLabel(items);

  return (
    <div
      role="group"
      aria-label={groupLabel || undefined}
      className={cx('ax-metric-group', className)}
    >
      {items.map((metricProps, index) => (
        <React.Fragment key={index}>
          {index > 0 ? (
            <span className="ax-metric-group__divider" aria-hidden />
          ) : null}
          <Metric {...metricProps} />
        </React.Fragment>
      ))}
    </div>
  );
};


MetricGroup.displayName = 'MetricGroup';
