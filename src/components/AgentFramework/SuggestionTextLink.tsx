'use client';

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps, CommonProps, emit} from '../../common/helpers';
import './SuggestionTextLink.css';

/**
 * The color treatment:
 * - `"default"` — dark link text; suits light or white backgrounds.
 * - `"white"` — white text; suits dark or brand-filled backgrounds.
 *
 * @default "default"
 */
export type SuggestionTextLinkColor = 'default' | 'white';

/**
 * The size treatment:
 * - `"small"` — body-small (14 px / 1.25rem line-height).
 * - `"medium"` — body-medium (16 px / 1.5rem line-height).
 *
 * @default "small"
 */
export type SuggestionTextLinkSize = 'small' | 'medium';

export interface SuggestionTextLinkProps
  extends CommonProps,
    Omit<React.ComponentPropsWithoutRef<'button'>, 'className' | 'style' | 'color'> {
  /** The button label. */
  children: React.ReactNode;
  /**
   * Optional leading icon. When provided, it is rendered at 16 × 16 px to the
   * left of the label. Omit it to show a label-only link.
   */
  leading?: React.ReactNode;
  /**
   * The color treatment.
   *
   * @default "default"
   */
  color?: SuggestionTextLinkColor;
  /**
   * The size treatment.
   *
   * @default "small"
   */
  size?: SuggestionTextLinkSize;
  /**
   * Disables the button.
   *
   * @default false
   */
  disabled?: boolean;
  /** Fired when the suggestion is chosen. */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * SuggestionTextLink is a text-link chat starter: a short label with an
 * optional leading icon. It renders as a transparent `<button>` — no fill, no
 * border — and shows an underline on hover, focus, and press. Two sizes
 * (small / medium) and two color treatments (default for light backgrounds,
 * white for dark backgrounds) are supported.
 */
export const SuggestionTextLink = React.forwardRef<HTMLButtonElement, SuggestionTextLinkProps>(
  (props, ref) => {
    const {
      children,
      className,
      style,
      leading,
      color = 'default',
      size = 'small',
      disabled = false,
      onClick,
      ...rest
    } = applyCommonProps(props);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const label = typeof children === 'string' ? children : undefined;
      emit('ui:suggestiontextlink:click', {children: label});
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cx(
          'ld-suggestiontextlink',
          `ld-suggestiontextlink--size-${size}`,
          `ld-suggestiontextlink--color-${color}`,
          className,
        )}
        style={style}
        disabled={disabled}
        onClick={handleClick}
        {...rest}
      >
        {leading ? (
          <span className="ld-suggestiontextlink-icon" aria-hidden="true">
            {leading}
          </span>
        ) : null}
        <span className="ld-suggestiontextlink-label">{children}</span>
      </button>
    );
  },
);

SuggestionTextLink.displayName = 'SuggestionTextLink';
