'use client';
// @refresh reset

/**
 * @module ProgressIndicator
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
 * For prop API + usage notes, read `ProgressIndicator.md` in this folder
 * or run `npm run ld-kit -- show ProgressIndicator`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {useStableId, invariant, applyCommonProps} from '../../common/helpers';
import './ProgressIndicator.css';
export type ProgressIndicatorVariant = 'error' | 'info' | 'success' | 'warning';

export type ProgressIndicatorLayout = 'default' | 'category';

interface ProgressIndicatorBaseProps
  extends Omit<React.ComponentPropsWithoutRef<'span'>, 'className' | 'style'> {
  /**
   * Color of the category dot and track fill (`category` layout only). Accepts
   * any CSS color value. Defaults to the `--ld-semantic-color-fill-accent-orange`
   * design token.
   */
  accentColor?: string;
  /**
   * The layout for the progress indicator. The `category` layout renders a
   * leading colored dot, an inline label, an optional secondary value, and an
   * emphasized value label above the track.
   *
   * @default "default"
   */
  layout?: ProgressIndicatorLayout;
  /**
   * The maximum value for the progress indicator.
   *
   * @default 100
   */
  max?: number;
  /**
   * The minimum value for the progress indicator.
   *
   * @default 0
   */
  min?: number;
  /**
   * The value for the progress indicator.
   *
   * @default 0
   */
  value?: number;
  /**
   * The value label for the progress indicator. Rendered as the emphasized
   * value (e.g. a percentage) in the `category` layout.
   */
  valueLabel: string;
  /**
   * A secondary value shown before the value label in the `category` layout
   * (e.g. `"$100,000 GMV"`).
   */
  valueText?: React.ReactNode;
  /**
   * The variant for the progress indicator. Ignored when `layout` is
   * `category`, which uses `accentColor` instead.
   *
   * @default "info"
   */
  variant?: ProgressIndicatorVariant;
}

export interface ProgressIndicatorA11yProps extends ProgressIndicatorBaseProps {
  /**
   * The accessible label reference IDs for the progress indicator (Required if omitting `label`).
   */
  a11yLabelledBy: string;
  label?: never;
}

export interface ProgressIndicatorLabelProps
  extends ProgressIndicatorBaseProps {
  /**
   * The label for the progress indicator (Required if omitting `a11yLabelledBy`).
   */
  label: React.ReactNode;
  a11yLabelledBy?: never;
}

export type ProgressIndicatorProps =
  | ProgressIndicatorA11yProps
  | ProgressIndicatorLabelProps;

/**
 * Progress Indicators display a visual representation of the completion of a task or process.
 * *
 */
export const ProgressIndicator: React.FunctionComponent<
  ProgressIndicatorProps
> = (props) => {
  const {
    a11yLabelledBy,
    accentColor = 'var(--ld-semantic-color-fill-accent-orange, #ee8f03)',
    className,
    label,
    layout = 'default',
    max = 100,
    min = 0,
    value = 0,
    valueLabel,
    valueText,
    variant = 'info',
    ...rest
  } = applyCommonProps(props);

  const labelCount = (label ? 1 : 0) + (a11yLabelledBy ? 1 : 0) === 1;

  invariant(
    labelCount,
    '`ProgressIndicator` accessibility violation. `ProgressIndicator` requires a `label` OR an `a11yLabelledBy`.'
  );

  const labelId = useStableId();

  const fillWidth = `${((value - min) / (max - min)) * 100}%`;

  // aria-valuetext should only carry supplementary info (not the percentage),
  // so AT doesn't double-announce the value (aria-valuenow + aria-valuetext).
  // Let the browser compute the percentage from aria-valuenow/aria-valuemax.
  // Exception: when valueLabel is non-numeric (e.g. "--%"), include it so AT
  // announces something meaningful instead of "0%".
  const isNonNumericLabel = value === 0 && valueLabel.includes('-');
  const categoryValueText =
    valueText != null && typeof valueText === 'string'
      ? isNonNumericLabel
        ? `${valueText}, ${valueLabel}`
        : valueText
      : isNonNumericLabel
        ? valueLabel
        : undefined;

  if (layout === 'category') {
    return (
      <span
        aria-valuemax={max}
        aria-valuemin={min}
        aria-valuenow={value}
        className={cx(
          'ld-progressindicator-progressIndicator',
          'ld-progressindicator-category',
          className
        )}
        role="progressbar"
        {...(a11yLabelledBy && {'aria-labelledby': a11yLabelledBy})}
        {...(label && {'aria-labelledby': labelId})}
        {...(categoryValueText != null && {'aria-valuetext': categoryValueText})}
        {...rest}
      >
        <span className={'ld-progressindicator-categoryHeader'}>
          <span
            className={'ld-progressindicator-dot'}
            style={{background: accentColor}}
          />

          <span
            className={'ld-progressindicator-categoryLabel'}
            {...(label && {id: labelId})}
          >
            {label}
          </span>

          {valueText != null && (
            <span className={'ld-progressindicator-valueText'}>{valueText}</span>
          )}

          <span className={'ld-progressindicator-percent'}>{valueLabel}</span>
        </span>

        <span className={'ld-progressindicator-track ld-progressindicator-categoryTrack'}>
          <span
            className={'ld-progressindicator-trackFill ld-progressindicator-categoryFill'}
            style={{background: accentColor, width: fillWidth}}
          />
        </span>
      </span>
    );
  }

  // For default layout, include the variant in aria-valuetext so it conveys
  // the semantic meaning of the color (Success/Warning/Error) and avoids the
  // duplicate-percentage issue (aria-valuenow + aria-valuetext both announced).
  // For default layout, only put supplementary context in aria-valuetext —
  // not the percentage (aria-valuenow handles that). Variant name conveys the
  // color meaning (Success/Warning/Error) without duplicating the percentage.
  const VARIANT_LABELS: Record<ProgressIndicatorVariant, string> = {
    info: 'Info',
    success: 'Success',
    warning: 'Warning',
    error: 'Error',
  };
  const defaultValueText = `${valueLabel}, ${VARIANT_LABELS[variant]}`;

  return (
    <span
      aria-valuemax={max}
      aria-valuemin={min}
      aria-valuenow={value}
      className={cx('ld-progressindicator-progressIndicator', className)}
      role="progressbar"
      {...(a11yLabelledBy && {'aria-labelledby': a11yLabelledBy})}
      {...(label && {'aria-labelledby': labelId})}
      aria-valuetext={defaultValueText}
      {...rest}
    >
      <span className={'ld-progressindicator-track'}>
        <span
          className={cx('ld-progressindicator-trackFill', variant === 'error' && 'ld-progressindicator-error', variant === 'info' && 'ld-progressindicator-info', variant === 'success' && 'ld-progressindicator-success', variant === 'warning' && 'ld-progressindicator-warning')}
          style={{
            width: fillWidth,
          }}
        />
      </span>

      <span className={'ld-progressindicator-labelContainer'}>
        <span className={'ld-progressindicator-label'} {...(label && {id: labelId})}>
          {label}
        </span>

        <span className={'ld-progressindicator-valueLabel'}>{valueLabel}</span>
      </span>
    </span>
  );
};

ProgressIndicator.displayName = 'ProgressIndicator';
