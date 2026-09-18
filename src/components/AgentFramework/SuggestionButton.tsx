'use client';

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps, CommonProps, emit} from '../../common/helpers';
import './SuggestionButton.css';

/**
 * The layout treatment.
 * - `"icon"` — a bare leading icon (no container) beside a regular-weight label.
 * - `"image"` — a leading image framed in a round asset holder beside a bolder label.
 *
 * @default "icon"
 */
export type SuggestionButtonVariant = 'icon' | 'image';

/**
 * The color treatment, shared by both variants:
 * - `"default"` — subtle white fill, dark label.
 * - `"brandSubtle"` — light-blue fill, dark label (icon picks up a brand-blue tint).
 *
 * Override the raw fill / text with `fill` / `textColor` for anything else.
 *
 * @default "default"
 */
export type SuggestionButtonColor = 'default' | 'brandSubtle';

export interface SuggestionButtonProps
  extends CommonProps,
    Omit<React.ComponentPropsWithoutRef<'button'>, 'className' | 'style' | 'color'> {
  /** The button label. */
  children: React.ReactNode;
  /**
   * The leading asset. For the `"icon"` variant pass an `<Icon />` (rendered
   * bare); for the `"image"` variant pass an `<img />` / `<Avatar />` (framed
   * in a round holder). Omit it for a label-only suggestion.
   */
  leading?: React.ReactNode;
  /**
   * The layout treatment.
   *
   * @default "icon"
   */
  variant?: SuggestionButtonVariant;
  /**
   * The color treatment.
   *
   * @default "default"
   */
  color?: SuggestionButtonColor;
  /**
   * Shows a non-interactive loading placeholder (a spinner for the icon
   * variant, a skeleton asset + label for the image variant) and marks the
   * control `aria-busy`.
   *
   * @default false
   */
  loading?: boolean;
  /**
   * Disables the button.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * Override the fill. Any CSS color (or design token `var(...)`). Hover and
   * pressed feedback is derived from it automatically, so custom fills still
   * react to interaction. When omitted, the `color` default is used.
   */
  fill?: string;
  /**
   * Override the label (and icon) color. Any CSS color or token. When omitted,
   * the `color` default is used.
   */
  textColor?: string;
  /**
   * Override the corner radius. A number is treated as pixels; strings pass
   * through (e.g. `"0.5rem"`, `"9999px"`). When omitted, the fully-rounded
   * pill default is used.
   */
  radius?: string | number;
  /** Fired when the suggestion is chosen. */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * SuggestionButton is a pill-shaped chat starter: a short label with a leading
 * asset. The `"icon"` variant shows a bare icon with a regular-weight label;
 * the `"image"` variant frames an image in a round holder with a bolder label.
 * Both share the subtle `default` and light-blue `brandSubtle` colors, and a
 * designer can recolor the fill and text or change the corner radius.
 */
export const SuggestionButton = React.forwardRef<HTMLButtonElement, SuggestionButtonProps>(
  (props, ref) => {
    const {
      children,
      className,
      style,
      leading,
      variant = 'icon',
      color,
      loading = false,
      disabled = false,
      fill,
      textColor,
      radius,
      onClick,
      ...rest
    } = applyCommonProps(props);

    const resolvedColor: SuggestionButtonColor = color ?? 'default';

    // Per-instance overrides flow through CSS custom properties so the color
    // defaults (and the derived hover/pressed feedback) live in the stylesheet.
    // Any consumer `UNSAFE_style` is merged in (it can't clobber the vars).
    const styleVars: Record<string, string | number> = {
      ...(style as Record<string, string | number>),
    };
    if (fill) styleVars['--ld-suggestionbutton-fill'] = fill;
    if (textColor) {
      styleVars['--ld-suggestionbutton-text'] = textColor;
      styleVars['--ld-suggestionbutton-icon'] = textColor;
    }
    if (radius != null) {
      styleVars['--ld-suggestionbutton-radius'] =
        typeof radius === 'number' ? `${radius}px` : radius;
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) return;
      const label = typeof children === 'string' ? children : undefined;
      emit('ui:suggestionbutton:click', {children: label});
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cx(
          'ld-suggestionbutton',
          `ld-suggestionbutton--${variant}`,
          `ld-suggestionbutton--color-${resolvedColor}`,
          loading && 'ld-suggestionbutton--loading',
          className
        )}
        style={Object.keys(styleVars).length ? (styleVars as React.CSSProperties) : undefined}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        onClick={handleClick}
        {...rest}
      >
        {loading ? (
          variant === 'image' ? (
            <span
              className="ld-suggestionbutton-asset ld-suggestionbutton-asset--skeleton"
              aria-hidden="true"
            />
          ) : (
            <span className="ld-suggestionbutton-spinner" aria-hidden="true" />
          )
        ) : leading ? (
          <span className="ld-suggestionbutton-asset" aria-hidden="true">
            {leading}
          </span>
        ) : null}
        {loading ? (
          variant === 'image' ? (
            <span className="ld-suggestionbutton-labelSkeleton" aria-hidden="true" />
          ) : null
        ) : (
          <span className="ld-suggestionbutton-label">{children}</span>
        )}
      </button>
    );
  }
);

SuggestionButton.displayName = 'SuggestionButton';
