// @refresh reset

/**
 * @module Metric
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
 * For prop API + usage notes, read `Metric.md` in this folder
 * or run `npm run ld-kit -- show Metric`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {
  ArrowUpIcon,
  ArrowDownIcon,
} from '../Icons';
import {Body, Display, Heading} from '../Text';
import './Metric.css';
export type MetricVariant =
  | 'negativeDown'
  | 'negativeUp'
  | 'neutral'
  | 'positiveDown'
  | 'positiveUp';

export interface MetricProps
  extends Omit<
      React.ComponentPropsWithoutRef<'div'>,
      'className' | 'style' | 'title'
    > {
  /**
   * Override for the trend indicator icon's accessible label.
   *
   * The component already derives a correct direction + sentiment label from
   * `variant` (e.g. `variant="positiveDown"` → "Positive, trending down",
   * `variant="negativeUp"` → "Negative, trending up"). Leave this prop unset
   * in almost all cases — the variant-derived default is correct.
   *
   * Only set this for custom wording of the SAME direction + sentiment that
   * `variant` already encodes (e.g. localisation). NEVER pass the metric's
   * own name or `textLabel` here — the icon label must convey direction and
   * sentiment only; `textLabel` already announces the metric context.
   *
   * @example
   * // WRONG — repeats metric name instead of direction + sentiment
   * <Metric variant="positiveUp" textLabel="Revenue" a11yTrendIndicatorLabel="Revenue" />
   *
   * // CORRECT — omit the prop; variant produces "Positive, trending up"
   * <Metric variant="positiveUp" textLabel="Revenue" />
   */
  a11yTrendIndicatorLabel?: string;
  /**
   * The text label providing a description of the metric.
   */
  textLabel?: React.ReactNode;
  /**
   * The timescope for the metric.
   */
  timescope?: React.ReactNode;
  /**
   * The title for the metric.
   */
  title: React.ReactNode;
  /**
   * The unit for the metric.
   */
  unit?: React.ReactNode;
  /**
   * The value for the metric.
   */
  value: React.ReactNode;
  /**
   * The variant for the metric.
   *
   * @default "neutral"
   */
  variant?: MetricVariant;
}

/**
 * Metrics display the value of a significant data point.
 * *
 */
export const Metric: React.FunctionComponent<MetricProps> = (props) => {
  const {
    a11yTrendIndicatorLabel,
    className,
    textLabel,
    timescope,
    title,
    unit,
    value,
    variant = 'neutral',
    ...rest
  } = applyCommonProps(props);

  return (
    <div
      className={cx(variant === 'negativeDown' && 'ld-metric-negativeDown', variant === 'negativeUp' && 'ld-metric-negativeUp', variant === 'neutral' && 'ld-metric-neutral', variant === 'positiveDown' && 'ld-metric-positiveDown', variant === 'positiveUp' && 'ld-metric-positiveUp', className)}
      {...rest}
    >
      <Body
        as="div"
        size={"medium"}
        weight={"alt"}
      >
        {title}
      </Body>
      {timescope && (
        <Body
          as="div"
          size={"small"}
          UNSAFE_className={'ld-metric-timescope'}
        >
          {timescope}
        </Body>
      )}
      <div className={'ld-metric-valueContainer'}>
        <Display
          as="span"
          size={"small"}
          weight={"alt"}
          UNSAFE_className={'ld-metric-value'}
        >
          {value}
        </Display>
        {unit && (
          <Heading
            as="span"
            size={"small"}
            weight={"alt"}
            UNSAFE_className={'ld-metric-unit'}
          >
            {unit}
          </Heading>
        )}
      </div>
      {textLabel && (
        <div className={'ld-metric-labelContainer'}>
          {variant !== 'neutral' && (
            <span className={'ld-metric-trendIndicator'}>
              {variant === 'negativeDown' || variant === 'positiveDown' ? (
                <ArrowDownIcon
                  a11yLabel={
                    a11yTrendIndicatorLabel ??
                    (variant === 'positiveDown'
                      ? 'Positive, trending down'
                      : 'Negative, trending down')
                  }
                />
              ) : (
                <ArrowUpIcon
                  a11yLabel={
                    a11yTrendIndicatorLabel ??
                    (variant === 'positiveUp'
                      ? 'Positive, trending up'
                      : 'Negative, trending up')
                  }
                />
              )}
            </span>
          )}

          <Body
            UNSAFE_className={'ld-metric-textLabel'}
            size={"small"}
          >
            {textLabel}
          </Body>
        </div>
      )}
    </div>
  );
};

Metric.displayName = 'Metric';
