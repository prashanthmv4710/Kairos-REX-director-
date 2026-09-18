'use client';

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps, CommonProps} from '../../common/helpers';
import {Icon} from '../Icons';
import {Heading, Body} from '../Text';
import './CardInteractive.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CardInteractiveVariant = 'elevated' | 'outlined' | 'border' | 'frameless';
export type CardInteractiveLayout = 'default' | 'inline';
export type CardInteractiveSize = 'small' | 'medium' | 'large';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface CardInteractiveContextValue {
  size: CardInteractiveSize;
  layout: CardInteractiveLayout;
}

export const CardInteractiveContext = React.createContext<CardInteractiveContextValue>({
  size: 'large',
  layout: 'default',
});

// ---------------------------------------------------------------------------
// CardInteractiveHeader
// ---------------------------------------------------------------------------

export interface CardInteractiveHeaderProps
  extends CommonProps,
    Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style' | 'title'> {
  /**
   * The title for the card header. Typography is driven by `size` context.
   * - large → Heading/small
   * - medium → Body/large (bold)
   * - small → Body/medium (bold)
   */
  title: React.ReactNode;
  /**
   * Decorative Living Design icon name displayed before the title.
   */
  leadingIcon?: string;
  /**
   * Optional subtitle rendered below the title as Body/small in a subtle color.
   * Useful for data cards that need a secondary label or description in the header.
   */
  description?: React.ReactNode;
  /**
   * Decorative Living Design icon name displayed after the title.
   * In `inline` layout this icon is pinned to the far right of the row.
   */
  trailingIcon?: string;
  /**
   * Static trailing content, such as a `Tag`, `Badge`, or text. Do not pass
   * interactive controls; use `Card` when a surface needs more than one action.
   */
  trailing?: React.ReactNode;
}

export const CardInteractiveHeader: React.FunctionComponent<CardInteractiveHeaderProps> = (
  props,
) => {
  const {title, description, leadingIcon, trailingIcon, trailing, className, ...rest} =
    applyCommonProps(props);
  const {size, layout} = React.useContext(CardInteractiveContext);

  const titleNode =
    size === 'large' ? (
      <Heading UNSAFE_className={'ld-interactivecard-header-title'} size="small">
        {title}
      </Heading>
    ) : size === 'medium' ? (
      <Body UNSAFE_className={'ld-interactivecard-header-title'} size="large" weight="alt">
        {title}
      </Body>
    ) : (
      <Body UNSAFE_className={'ld-interactivecard-header-title'} size="medium" weight="alt">
        {title}
      </Body>
    );

  return (
    <div
      className={cx(
        'ld-interactivecard-header',
        layout === 'inline' && 'ld-interactivecard-header-inline',
        className,
      )}
      {...rest}
    >
      {leadingIcon && (
        <span className={'ld-interactivecard-header-leading'}>
          <Icon name={leadingIcon} decorative size="medium" />
        </span>
      )}

      {titleNode}

      {description && (
        <Body UNSAFE_className={'ld-interactivecard-header-description'} size="small" color="subtle">
          {description}
        </Body>
      )}

      {(trailing || trailingIcon) && (
        <span className={'ld-interactivecard-header-trailing'}>
          {trailing ?? <Icon name={trailingIcon!} decorative size="medium" />}
        </span>
      )}

    </div>
  );
};

CardInteractiveHeader.displayName = 'CardInteractiveHeader';

// ---------------------------------------------------------------------------
// CardInteractiveContent
// ---------------------------------------------------------------------------

export interface CardInteractiveContentProps
  extends CommonProps,
    Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  /**
   * The content slot — accepts media, body text, images, or arbitrary markup.
   * Typography size and padding are driven by the parent card's `size` context.
   */
  children: React.ReactNode;
}

export const CardInteractiveContent: React.FunctionComponent<
  CardInteractiveContentProps
> = (props) => {
  const {children, className, ...rest} = applyCommonProps(props);
  const {size, layout} = React.useContext(CardInteractiveContext);

  return (
    <div
      className={cx(
        'ld-interactivecard-content',
        layout === 'inline' && 'ld-interactivecard-content-inline',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

CardInteractiveContent.displayName = 'CardInteractiveContent';

// ---------------------------------------------------------------------------
// CardInteractive (root)
// ---------------------------------------------------------------------------

interface CardInteractiveBaseProps
  extends CommonProps,
    Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style' | 'onClick'> {
  /**
  * The compound children — typically `CardInteractiveHeader` and/or
  * `CardInteractiveContent`. In `single` mode, children must not include
  * interactive controls; use `multi` mode when independent controls are needed.
   */
  children: React.ReactNode;
  /**
   * Selects whether the card surface is one action or contains independent
   * actions.
   *
   * @default "single"
   */
  actionMode?: 'single' | 'multi';
  /**
   * The container style for the card.
   * - `elevated` — white surface with box-shadow (default)
   * - `outlined` — white surface with 1px border, no shadow
   * - `border` — transparent fill with 1px border
   * - `frameless` — transparent fill, no visible border
   *
   * @default "elevated"
   */
  variant?: CardInteractiveVariant;
  /**
   * Controls whether header and content stack (`default`) or appear side-by-side
    * on one truncated line (`inline`). Inline layout is intended for concise text.
   *
   * @default "default"
   */
  layout?: CardInteractiveLayout;
  /**
   * The size for the card — drives padding and title typography.
   * - `small` — 4 px padding, Body/medium title
   * - `medium` — 8 px padding, Body/large title
   * - `large` — 16 px padding, Heading/small title (default)
   *
   * @default "large"
   */
  size?: CardInteractiveSize;
  /**
   * If true, the card is non-interactive and visually dimmed.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * If true, the card renders with a blue border and tinted background to
   * indicate a selected/activated state. Sets `aria-pressed` on the button.
   *
   * @default false
   */
  activated?: boolean;
  /**
   * If true, the card is display-only: no button role, no tab stop, no pointer
   * events, no interactive state fills.
   *
   * @default false
   */
  readOnly?: boolean;
  /**
   * Accessible label for the card button. Recommended when the visible heading
   * text is not descriptive enough in isolation (e.g. "View details" without
   * context). When omitted, assistive technology reads the heading text.
   */
  a11yLabel?: string;
}

type CardInteractiveActionHandler = (
  e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
) => void;

export type CardInteractiveProps =
  | (CardInteractiveBaseProps & {
      /** The single action handler for the card. */
      actionMode?: 'single';
      onClick: CardInteractiveActionHandler;
    })
  | (CardInteractiveBaseProps & {
      /** Multi-action cards delegate interaction to their child controls. */
      actionMode: 'multi';
      onClick?: CardInteractiveActionHandler;
    });

/* eslint-disable-next-line @typescript-eslint/naming-convention */
const _CardInteractive = React.forwardRef<HTMLDivElement, CardInteractiveProps>(
  (props, ref) => {
    const {
      children,
      className,
      onClick,
      onKeyDown,
      actionMode = 'single',
      variant = 'elevated',
      layout = 'default',
      size = 'large',
      disabled = false,
      activated = false,
      readOnly = false,
      a11yLabel,
      ...rest
    } = applyCommonProps(props);

    const isMultiAction = actionMode === 'multi';

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (isMultiAction || disabled || readOnly) return;
      onClick?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      if (isMultiAction || disabled || readOnly) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        onClick?.(e);
      } else if (e.key === ' ') {
        // Prevent page scroll on Space
        e.preventDefault();
        onClick?.(e);
      }
    };

    const contextValue = React.useMemo<CardInteractiveContextValue>(
      () => ({size, layout}),
      [size, layout],
    );

    return (
      <CardInteractiveContext.Provider value={contextValue}>
        <div
          aria-disabled={disabled || undefined}
          aria-label={a11yLabel}
          aria-pressed={!readOnly && activated ? true : undefined}
          className={cx(
            'ld-interactivecard-root',
            isMultiAction && 'ld-interactivecard-multi-action',
            variant === 'elevated' && 'ld-interactivecard-elevated',
            variant === 'outlined' && 'ld-interactivecard-outlined',
            variant === 'border' && 'ld-interactivecard-border',
            variant === 'frameless' && 'ld-interactivecard-frameless',
            layout === 'default' && 'ld-interactivecard-layout-default',
            layout === 'inline' && 'ld-interactivecard-layout-inline',
            size === 'small' && 'ld-interactivecard-size-small',
            size === 'medium' && 'ld-interactivecard-size-medium',
            size === 'large' && 'ld-interactivecard-size-large',
            disabled && 'ld-interactivecard-disabled',
            activated && !readOnly && 'ld-interactivecard-activated',
            readOnly && 'ld-interactivecard-readonly',
            className,
          )}
          onClick={isMultiAction ? undefined : handleClick}
          onKeyDown={handleKeyDown}
          ref={ref}
          role={isMultiAction || readOnly ? undefined : 'button'}
          tabIndex={isMultiAction || readOnly ? undefined : disabled ? -1 : 0}
          {...rest}
        >
          {children}
        </div>
      </CardInteractiveContext.Provider>
    );
  },
);

_CardInteractive.displayName = 'CardInteractive';

/**
 * CardInteractive supports two action models. In `single` mode, the entire
 * surface navigates or triggers one handler. In `multi` mode, the surface is
 * static and nested controls provide independent actions. Its header supports
 * optional decorative Living Design icons and a free-form content area.
 *
 * Use `CardInteractiveHeader` and `CardInteractiveContent` as children.
 * Choose a `layout` (`default` = stacked, `inline` = single-row) and a
 * container `variant` (`elevated` | `outlined` | `border` | `frameless`).
 */
export const CardInteractive = _CardInteractive;
