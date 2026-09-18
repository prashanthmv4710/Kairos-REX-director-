'use client';
// @refresh reset

/**
 * @module Spinner
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
 * For prop API + usage notes, read `Spinner.md` in this folder
 * or run `npm run ld-kit -- show Spinner`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps, useStableId} from '../../common/helpers';
import './Spinner.css';
export type SpinnerColor = 'neutral' | 'white' | 'brand' | 'dark';

export type SpinnerSize = 'large' | 'small';

export type SpinnerVariant = 'default' | 'generic';

export interface SpinnerProps
  extends Omit<React.ComponentPropsWithoutRef<'span'>, 'className' | 'style'> {
  /**
   * The accessible label for the spinner.
   *
   * @default "Loading…"
   */
  a11yLabel?: string;
  /**
   * The color for the spinner.
   *
   * For the `"default"` variant, use `"neutral"` or `"white"`. For the
   * `"generic"` variant, use `"brand"`, `"white"`, or `"dark"`.
   *
   * @default "neutral" (or "brand" when `variant` is `"generic"`)
   */
  color?: SpinnerColor;
  /**
   * The size for the spinner.
   *
   * @default "large"
   */
  size?: SpinnerSize;
  /**
   * The props spread to the spinner's svg element.
   *
   * Only applies to the `"default"` variant.
   *
   * @default {}
   */
  spinnerProps?: React.ComponentPropsWithoutRef<'svg'>;
  /**
   * The visual variant for the spinner. The `"generic"` variant renders a
   * gradient ring with a rounded leading cap.
   *
   * @default "default"
   */
  variant?: SpinnerVariant;
}

/**
 * Spinners visually indicate that a process is taking place for an indeterminate amount of time.
 *
 * {@link https://digitaltoolkit.livingdesign.walmart.com/components/spinner/ Guidelines}
 * {@link https://digitaltoolkit.livingdesign.walmart.com/develop/react/components/spinner/ React documentation}
 *
 */
export const Spinner: React.FunctionComponent<SpinnerProps> = (props) => {
  const {
    a11yLabel = 'Loading, please wait...',
    className,
    color,
    size = 'large',
    spinnerProps = {},
    variant = 'default',
    ...rest
  } = applyCommonProps(props);

  if (variant === 'generic') {
    const genericColor = color ?? 'brand';

    return (
      <span
        aria-label={a11yLabel}
        className={cx(
          'ld-spinner-container',
          size === 'large' && 'ld-spinner-large',
          size === 'small' && 'ld-spinner-small',
          className,
        )}
        role="img"
        {...rest}
      >
        <span
          aria-hidden="true"
          className={cx(
            'ld-spinner-generic',
            genericColor === 'white' && 'ld-spinner-generic-white',
            genericColor === 'brand' && 'ld-spinner-generic-brand',
            genericColor === 'dark' && 'ld-spinner-generic-dark',
          )}
        />
      </span>
    );
  }

  const resolvedColor = color ?? 'neutral';
  const pillId = useStableId();

  return (
    <span
      aria-label={a11yLabel}
      className={cx('ld-spinner-container', size === 'large' && 'ld-spinner-large', size === 'small' && 'ld-spinner-small', className)}
      role="img"
      {...rest}
    >
      <svg
        aria-hidden="true"
        className={cx(resolvedColor === 'neutral' && 'ld-spinner-neutral', resolvedColor === 'white' && 'ld-spinner-white')}
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        {...spinnerProps}
      >
        <defs>
          <path
            d="M23.7833 1.55122C21.9046 1.55122 20.3818 3.07279 20.3818 4.94971C20.3818 5.77181 21.2057 14.5072 21.496 15.3808C21.8287 16.382 22.7456 17.0508 23.7833 17.0508C24.8209 17.0508 25.7378 16.382 26.0705 15.3808C26.3608 14.5072 27.1847 5.77181 27.1847 4.94971C27.1847 3.07279 25.6618 1.55122 23.7833 1.55122Z"
            id={pillId}
          />
        </defs>
        <use className={'ld-spinner-pill'} href={`#${pillId}`} />
        <use
          className={cx('ld-spinner-pill', 'ld-spinner-pill2')}
          href={`#${pillId}`}
        />
        <use
          className={cx('ld-spinner-pill', 'ld-spinner-pill3')}
          href={`#${pillId}`}
        />
        <use
          className={cx('ld-spinner-pill', 'ld-spinner-pill4')}
          href={`#${pillId}`}
        />
        <use
          className={cx('ld-spinner-pill', 'ld-spinner-pill5')}
          href={`#${pillId}`}
        />
        <use
          className={cx('ld-spinner-pill', 'ld-spinner-pill6')}
          href={`#${pillId}`}
        />
      </svg>
    </span>
  );
};

Spinner.displayName = 'Spinner';
