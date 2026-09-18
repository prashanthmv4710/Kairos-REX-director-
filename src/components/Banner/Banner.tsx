'use client';
// @refresh reset

/**
 * @module Banner
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
 * For prop API + usage notes, read `Banner.md` in this folder
 * or run `npm run ld-kit -- show Banner`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps, invariant} from '../../common/helpers';
import {
  IconButton,
  type IconButtonColor,
  type IconButtonSize,
} from '../IconButton/IconButton';
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  CloseIcon,
  ExclamationCircleIcon,
  InfoCircleIcon,
} from '../Icons';
import {VisuallyHidden} from '../VisuallyHidden';
import './Banner.css';
// ---------------------------------------------------------------------------
// BannerCloseButton (inlined sub-component)
// ---------------------------------------------------------------------------

export interface BannerCloseButtonProps
  extends Omit<
      React.ComponentPropsWithRef<'button'>,
      'children' | 'className' | 'style' | 'type'
    > {
  /**
   * The IconButton color. Driven by the banner variant so the icon contrasts
   * with the fill.
   *
   * @private
   */
  color?: IconButtonColor;
  /**
   * The IconButton size. Driven by the banner size.
   *
   * @private
   */
  size?: IconButtonSize;
}

/**
 * @private
 */
export const BannerCloseButton = React.forwardRef<
  HTMLButtonElement,
  BannerCloseButtonProps
>((props, ref) => {
  const {color = 'white', size = 'small', ...buttonProps} = props;
  const {className, 'aria-label': ariaLabel, ...rest} = applyCommonProps(buttonProps);

  return (
    <IconButton
      a11yLabel={ariaLabel ?? 'Close banner'}
      UNSAFE_className={cx('ld-banner-bannerclosebutton-close', className)}
      color={color}
      ref={ref}
      size={size}
      variant="round"
      {...rest}
    >
      <CloseIcon />
    </IconButton>
  );
});

export type BannerVariant = 'error' | 'info' | 'success' | 'warning';

export type BannerSize = 'default' | 'small';

/**
 * Maps each banner variant to its leading status icon. Icons inherit the
 * banner's text color, which is driven by the semantic
 * `notice-text-onFill-*` tokens per variant.
 */
const LEADING_ICONS: Record<
  BannerVariant,
  React.ComponentType<{size?: 'small'; decorative?: boolean; className?: string}>
> = {
  error: ExclamationCircleIcon,
  info: InfoCircleIcon,
  success: CheckCircleIcon,
  warning: AlertTriangleIcon,
};

export interface BannerProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  /**
   * Visually hidden prefix read by screen readers before the banner content,
   * identifying the severity of the announcement.
   *
   * Defaults to the variant name (e.g. `"error:"`, `"success:"`).
   * Pass a custom string to override — for example `"Critical error:"` or
   * `"Important notice:"`. Must be a non-empty string if provided.
   */
  a11yLabel?: string;
  /**
   * The props spread to the banner's close button.
   */
  closeButtonProps?: BannerCloseButtonProps;
  /**
   * The content for the banner.
   */
  children: React.ReactNode;
  /**
   * The callback fired when the banner requests to close.
   */
  onClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * The size for the banner. The `small` size has rounded corners, a compact
   * layout, and a leading status icon.
   *
   * @default "default"
   */
  size?: BannerSize;
  /**
   * The variant for the banner.
   *
   * @default "info"
   */
  variant?: BannerVariant;
}

/**
 * Banners provide brief information about a significant incident affecting a large number of users.
 * *
 */
export const Banner: React.FunctionComponent<BannerProps> = (props) => {
  const {
    a11yLabel,
    children,
    className,
    closeButtonProps,
    onClose,
    size = 'default',
    variant = 'info',
    ...rest
  } = applyCommonProps(props);

  const LeadingIcon = LEADING_ICONS[variant];
  // The warning fill is light, so its close icon needs the dark `default`
  // color; every other variant has a dark fill and uses the white icon.
  const closeColor: IconButtonColor = variant === 'warning' ? 'default' : 'white';
  // Small banners use a more compact circular button.
  const closeSize: IconButtonSize = size === 'small' ? 'xsmall' : 'small';

  return (
    <div
      className={cx('ld-banner-banner', size === 'small' && 'ld-banner-small', variant === 'error' && 'ld-banner-error', variant === 'info' && 'ld-banner-info', variant === 'success' && 'ld-banner-success', variant === 'warning' && 'ld-banner-warning', className)}
      role="alert"
      {...rest}
    >
      {size === 'small' && (
        <LeadingIcon
          size="small"
          decorative
          className={'ld-banner-leadingIcon'}
        />
      )}

      <div className={'ld-banner-contentContainer'}>
        <div className={'ld-banner-content'}>
          <VisuallyHidden>{`${a11yLabel ?? variant}:`}</VisuallyHidden>
          {children}
        </div>
      </div>

      <BannerCloseButton
        aria-label="Close banner"
        color={closeColor}
        size={closeSize}
        {...closeButtonProps}
        onClick={(event) => {
          closeButtonProps?.onClick?.(event);

          onClose(event);
        }}
      />
    </div>
  );
};

Banner.displayName = 'Banner';
