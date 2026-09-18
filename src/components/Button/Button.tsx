// @refresh reset

/**
 * @module Button
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
 * For prop API + usage notes, read `Button.md` in this folder
 * or run `npm run ld-kit -- show Button`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {getTarget, onAnchorKeyDown, applyCommonProps, CommonProps} from '../../common/helpers';
import {emit} from '../../common/helpers';
import './Button.css';
// ---------------------------------------------------------------------------
// ButtonGroup (inlined sub-component)
// ---------------------------------------------------------------------------

export interface ButtonGroupProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  /**
   * The content for the button group.
   */
  children: React.ReactNode;
}

/**
 * Button Groups display multiple related actions in a horizontal row to help with arrangement and spacing.
 * *
 */
export const ButtonGroup: React.FunctionComponent<ButtonGroupProps> = (
  props
) => {
  const {children, className, ...rest} = applyCommonProps(props);

  return (
    <div
      className={cx('ld-button-buttongroup-buttonGroup', className)}
      role="list"
      {...rest}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) {
          return null;
        }
        return (
          <div key={index} role="listitem">
            {child}
          </div>
        );
      })}
    </div>
  );
};

ButtonGroup.displayName = 'ButtonGroup';

export type ButtonShape = 'pill' | 'square';

export type ButtonSize = 'large' | 'medium' | 'small';

export type ButtonType = 'button' | 'reset' | 'submit';

export type ButtonVariant =
  | 'destructive'
  | 'ghost'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'topnav-action-alt';

interface ButtonBaseProps extends CommonProps {
  /**
   * The content for the button.
   */
  children: React.ReactNode;
  /**
   * If the button is displayed at full width.
   *
   * @default false
   */
  isFullWidth?: boolean;
  /**
   * If the button is in a loading/progress state.
   * Displays an animated spinner and disables interaction.
   *
   * @default false
   */
  isLoading?: boolean;
  /**
   * Visually-hidden label announced by screen readers during the loading state.
   * Override for non-English UIs or custom phrasing (e.g. "Saving…").
   *
   * @default "Loading..."
   */
  loadingLabel?: string;
  /**
   * The leading content for the button.
   */
  leading?: React.ReactNode;
  /**
   * The shape for the button. `pill` is fully rounded (default); `square`
   * uses 4px corners. Pair `shape="square"` with `variant="ghost"` for the
   * square, no-fill "Button Ghost" treatment.
   *
   * @default "pill"
   */
  shape?: ButtonShape;
  /**
   * The size for the button.
   *
   * @default "small"
   */
  size?: ButtonSize;
  /**
   * The trailing content for the button.
   */
  trailing?: React.ReactNode;
  /**
   * The variant for the button.
   *
   * @default "secondary"
   */
  variant?: ButtonVariant;
}

export type ButtonAnchorProps = ButtonBaseProps &
  Omit<JSX.IntrinsicElements['a'], 'className' | 'style'> & {
    /**
     * The href for the button (Anchor only).
     */
    href: string;
  };

export type ButtonButtonProps = ButtonBaseProps &
  Omit<JSX.IntrinsicElements['button'], 'className' | 'style'> & {
    /**
     * If the button is disabled (Button only).
     *
     * @default false
     */
    disabled?: boolean;
    /**
     * The type for the button (Button only).
     *
     * @default "button"
     */
    type?: ButtonType;
  };

export type ButtonPolymorphicType = {
  (props: ButtonAnchorProps): JSX.Element;
  (props: ButtonButtonProps): JSX.Element;
  displayName?: string;
};

export type ButtonProps = ButtonAnchorProps | ButtonButtonProps;

const isAnchor = (props: ButtonProps): props is ButtonAnchorProps =>
  'href' in props;

const SPINNER_SIZES: Record<ButtonSize, number> = { small: 16, medium: 20, large: 24 };

function ButtonSpinner({ size }: { size: ButtonSize }) {
  const dim = SPINNER_SIZES[size];
  return (
    <svg width={dim} height={dim} viewBox="0 0 32 32" fill="none" aria-hidden="true" className="ld-button-spinner">
      <path d="M30.6666 15.9999C30.6666 18.9007 29.8065 21.7364 28.1949 24.1483C26.5833 26.5602 24.2927 28.4401 21.6127 29.5502C18.9327 30.6602 15.9837 30.9507 13.1387 30.3848C10.2936 29.8189 7.68025 28.422 5.62908 26.3708C3.57791 24.3196 2.18105 21.7063 1.61513 18.8612C1.04921 16.0162 1.33966 13.0672 2.44975 10.3872C3.55983 7.70725 5.4397 5.41663 7.85162 3.80503C10.2635 2.19344 13.0992 1.33325 16 1.33325L16 4.85325C13.7954 4.85325 11.6403 5.50699 9.80722 6.7318C7.97416 7.95662 6.54547 9.69749 5.7018 11.7343C4.85814 13.7711 4.6374 16.0123 5.06749 18.1745C5.49759 20.3368 6.55921 22.3229 8.1181 23.8818C9.67699 25.4407 11.6631 26.5023 13.8254 26.9324C15.9876 27.3625 18.2288 27.1418 20.2656 26.2981C22.3024 25.4544 24.0433 24.0257 25.2681 22.1927C26.4929 20.3596 27.1466 18.2045 27.1466 15.9999H30.6666Z" fill="currentColor" />
    </svg>
  );
}

/* eslint-disable-next-line @typescript-eslint/naming-convention */
const _Button = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  ButtonProps
>((props, ref) => {
  const {
    className,
    children,
    isFullWidth = false,
    isLoading = false,
    loadingLabel = 'Loading...',
    leading,
    shape = 'pill',
    size = 'small',
    trailing,
    variant = 'secondary',
    ...rest
  } = applyCommonProps(props);

  const classes = cx('ld-button-button', variant === 'destructive' && 'ld-button-destructive', variant === 'ghost' && 'ld-button-ghost', variant === 'primary' && 'ld-button-primary', variant === 'secondary' && 'ld-button-secondary', variant === 'tertiary' && 'ld-button-tertiary', variant === 'topnav-action-alt' && 'ld-button-topnav-action-alt', shape === 'square' && 'ld-button-square', isFullWidth && 'ld-button-isFullWidth', isLoading && 'ld-button-loading', size === 'large' && 'ld-button-large', size === 'medium' && 'ld-button-medium', size === 'small' && 'ld-button-small', className);

  const content = isLoading ? (
    <>
      <ButtonSpinner size={size} />
      <span className="ld-button-loading-label">{loadingLabel}</span>
    </>
  ) : (
    <>
      {leading && <span className={'ld-button-leading'}>{leading}</span>}
      {children}
      {trailing && <span className={'ld-button-trailing'}>{trailing}</span>}
    </>
  );

  if (isAnchor(props)) {
    const {
      href,
      onClick,
      onKeyDown: anchorOnKeyDown,
      target,
      ...anchorProps
    } = rest as Partial<ButtonAnchorProps>;

    // Looks like a button should act like a button.
    //
    // @see {@link https://jira.walmart.com/browse/LD-374?focusedCommentId=12802856&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-12802856}
    const onKeyDown = onAnchorKeyDown({
      href,
      onClick,
      onKeyDown: anchorOnKeyDown,
    });

    const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      emit('ui:button:click', {variant, href});
      onClick?.(e);
    };

    return (
      <a
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

  const {type = 'button', disabled, onClick: onButtonClick, ...buttonRest} = rest as Partial<ButtonButtonProps>;

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    emit('ui:button:click', {variant, children: typeof children === 'string' ? children : undefined});
    onButtonClick?.(e);
  };

  return (
    <button
      className={classes}
      disabled={disabled}
      ref={ref as React.ForwardedRef<HTMLButtonElement>}
      /* eslint-disable-next-line react/button-has-type */
      type={type}
      aria-busy={isLoading || undefined}
      aria-disabled={isLoading || undefined}
      onClick={isLoading ? (e) => e.preventDefault() : handleButtonClick}
      {...buttonRest}
    >
      {content}
    </button>
  );
});

_Button.displayName = 'Button';

/**
 * Buttons allow users to take actions and make choices, with a single press or a tap. Buttons are used as calls-to-action (CTA) across the experience. They are organized in the order or their importance: primary, secondary, and tertiary.
 * *
 */
export const Button = _Button as ButtonPolymorphicType;
