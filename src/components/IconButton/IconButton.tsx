// @refresh reset

/**
 * @module IconButton
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
 * For prop API + usage notes, read `IconButton.md` in this folder
 * or run `npm run ld-kit -- show IconButton`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {invariant, getTarget, onAnchorKeyDown, applyCommonProps} from '../../common/helpers';
import {WithIconProps} from '../../common/types';
import {emit} from '../../common/helpers';
import './IconButton.css';
export type IconButtonSize = 'large' | 'medium' | 'small' | 'xsmall';
export type IconButtonColor =
  | 'default'
  | 'white'
  | 'primary'
  | 'secondary'
  | 'tertiary';
// 'ghost' opts out of the round/full shape classes (base, flat styling). It is
// a valid runtime value — the class list below simply adds no shape class for
// it — so it's part of the public type. (Used e.g. by Popover's close button.)
export type IconButtonVariant = 'round' | 'full' | 'ghost';

interface IconButtonBaseProps {
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
  /**
   * The accessible label for the icon button.
   */
  a11yLabel: string;
  /**
   * The content for the icon button.
   */
  children: React.ReactNode;
  /**
   * The color of the icon button. `primary`, `secondary`, and `tertiary`
   * mirror the Button emphasis levels.
   *
   * @default "default"
   */
  color?: IconButtonColor;
  /**
   * The size for the icon button.
   *
   * @default "small"
   */
  size?: IconButtonSize;
  /**
   * The variant for the icon button.
   *
   * @default "round"
   */
  variant?: IconButtonVariant;
}

export type IconButtonAnchorProps = IconButtonBaseProps &
  Omit<JSX.IntrinsicElements['a'], 'className' | 'style'> & {
    /**
     * The href for the icon button (Anchor only).
     */
    href: string;
  };

export type IconButtonButtonProps = IconButtonBaseProps &
  Omit<JSX.IntrinsicElements['button'], 'className' | 'style'> & {
    /**
     * If the icon button is disabled (Button only).
     *
     * @default false
     */
    disabled?: boolean;
  };

export type IconButtonProps = IconButtonAnchorProps | IconButtonButtonProps;

export type IconButtonPolymorphicType = {
  (props: IconButtonAnchorProps): JSX.Element;
  (props: IconButtonButtonProps): JSX.Element;
  displayName?: string;
};

const isAnchor = (props: IconButtonProps): props is IconButtonAnchorProps =>
  'href' in props;

/* eslint-disable-next-line @typescript-eslint/naming-convention */
const _IconButton = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  IconButtonProps
>((props, ref) => {
  const {
    a11yLabel,
    children,
    className,
    size = 'small',
    color = 'default',
    variant = 'round',
    ...rest
  } = applyCommonProps(props);

  invariant(
    !!a11yLabel,
    '`IconButton` accessibility violation. `IconButton` requires an `a11yLabel`.'
  );

  const classes = cx(
    'ld-iconbutton-iconButton',
    color === 'white' && 'ld-iconbutton-white',
    color === 'default' && 'ld-iconbutton-defaultColor',
    color === 'primary' && 'ld-iconbutton-primary',
    color === 'secondary' && 'ld-iconbutton-secondary',
    color === 'tertiary' && 'ld-iconbutton-tertiary',
    size === 'xsmall' && 'ld-iconbutton-xsmall',
    size === 'small' && 'ld-iconbutton-small',
    size === 'medium' && 'ld-iconbutton-medium',
    size === 'large' && 'ld-iconbutton-large',
    variant == 'round' && 'ld-iconbutton-round',
    variant === 'full' && 'ld-iconbutton-full',
    className
  );

  const content = React.isValidElement<WithIconProps>(children)
    ? React.cloneElement(children, {size: size === 'xsmall' ? 'small' : size})
    : children;

  if (isAnchor(props)) {
    const {
      href,
      onClick,
      onKeyDown: anchorOnKeyDown,
      target,
      ...anchorProps
    } = rest as Partial<IconButtonAnchorProps>;

    const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      emit('ui:icon-button:click', {a11yLabel, href});
      onClick?.(e);
    };

    const onKeyDown = onAnchorKeyDown({
      href,
      onClick,
      onKeyDown: anchorOnKeyDown,
    });

    return (
      <a
        aria-label={a11yLabel}
        className={classes}
        href={href}
        onClick={handleAnchorClick}
        onKeyDown={onKeyDown}
        ref={ref as React.ForwardedRef<HTMLAnchorElement>}
        {...getTarget(target)}
        {...anchorProps}
      >
        {content}
      </a>
    );
  }

  const {onClick: onButtonClick, ...buttonRest} = rest as Partial<IconButtonButtonProps>;

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    emit('ui:icon-button:click', {a11yLabel});
    onButtonClick?.(e);
  };

  return (
    <button
      aria-label={a11yLabel}
      className={classes}
      ref={ref as React.ForwardedRef<HTMLButtonElement>}
      type="button"
      onClick={handleButtonClick}
      {...buttonRest}
    >
      {content}
    </button>
  );
});

_IconButton.displayName = 'IconButton';

/**
 * Icon Buttons trigger actions and rely solely on icons to convey their purpose.
 * *
 */
export const IconButton = _IconButton as IconButtonPolymorphicType;
