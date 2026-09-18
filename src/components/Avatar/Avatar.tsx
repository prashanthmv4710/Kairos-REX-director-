'use client';
// @refresh reset

/**
 * @module Avatar
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
 * For prop API + usage notes, read `Avatar.md` in this folder
 * or run `npm run ld-kit -- show Avatar`.
 */

/**
 * ## Accessibility — indicator status in aria-label
 *
 * Always pass `a11yLabel` as the person's name (e.g. `"Sarah Carter"`).
 * When an `indicator` is active the component automatically appends the
 * status so screen readers announce the full context in one pass:
 *
 * | indicator | clockState | announced label |
 * |-----------|------------|-----------------|
 * | `'clock'` | `'active'` | `"Sarah Carter, online"` |
 * | `'clock'` | `'subtle'` | `"Sarah Carter, away"` |
 * | `'badge'` | —          | `"Sarah Carter, 1 new notification"` |
 *
 * For a custom badge announcement supply `badgeLabel`:
 * ```tsx
 * <Avatar a11yLabel="Sarah Carter" indicator="badge" badgeContent={3}
 *   badgeLabel="3 unread messages" />
 * // → SR: "Sarah Carter, 3 unread messages"
 * ```
 *
 * The badge and clock overlays are `aria-hidden` — status is expressed
 * through the root label only, avoiding double-announcement.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {ClockIn, ClockOut} from '../ClockStatus';
import {invariant, applyCommonProps} from '../../common/helpers';
import {Badge} from '../Badge';
import './Avatar.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AvatarSize = 'xs' | 'small' | 'medium' | 'large' | 'xl';
/** Long-form aliases (xsmall = xs, xlarge = xl). */
export type AvatarSizeAlias = 'xsmall' | 'xlarge';
export type AvatarSizeInput = AvatarSize | AvatarSizeAlias;
export type AvatarShape = 'circular' | 'square';
/**
 * `'agent'` fills from `--ld-semantic-color-fill-agent`, which tracks the
 * current `data-agent-theme` (customer/partner/associate/developer) — use it
 * for avatars that should visually follow the active agent theme rather than
 * the brand theme.
 *
 * `'magic'` renders the same diagonal "Magic Fill Bold" gradient as
 * {@link MagicFill} (`--ld-semantic-color-fill-magic-bold-start` →
 * `-stop`), which also tracks `data-agent-theme` — use it to mark an avatar
 * as AI-driven (e.g. an agent's identity in a sidebar footer).
 */
export type AvatarColor =
  | 'brand'
  | 'brand-subtle'
  | 'neutral'
  | 'agent'
  | 'magic';

export type AvatarIndicatorType = 'none' | 'badge' | 'clock';
export type AvatarClockState = 'active' | 'subtle';

interface AvatarBaseProps
  extends Omit<React.ComponentPropsWithoutRef<'span'>, 'className' | 'style'> {
  color?: AvatarColor;
  icon?: React.ReactNode;
  image?: {src: string; alt?: string};
  name?: string;
  shape?: AvatarShape;
  size?: AvatarSizeInput;
  /** Optional overlay indicator. @default 'none' */
  indicator?: AvatarIndicatorType;
  /** Clock state when indicator='clock'. @default 'active' */
  clockState?: AvatarClockState;
  /**
   * Custom announced clock status label. Overrides the default "online" / "away" suffix.
   * Example: `clockLabel="busy"` → SR reads "Sarah Carter, busy".
   */
  clockLabel?: string;
  /** Applies disabled fill tokens. @default false */
  disabled?: boolean;
  /** Custom badge content — must be an integer. @default 1 */
  badgeContent?: number | string;
  /**
   * Accessible label for the badge count, appended to the root aria-label.
   * Defaults to `"${badgeContent} new notification"`.
   * Example: `badgeLabel="3 unread messages"` → SR reads "Sarah Carter, 3 unread messages".
   */
  badgeLabel?: string;
  /**
   * Optional override children. When provided, takes precedence over
   * image/name/icon. Used for compound-style composition with
   * `<AvatarImage>` / `<AvatarFallback>` children.
   */
  children?: React.ReactNode;
}

export interface AvatarA11yLabelProps extends AvatarBaseProps {
  a11yLabel: string;
  a11yLabelledBy?: never;
}

export interface AvatarA11yLabelledByProps extends AvatarBaseProps {
  a11yLabel?: never;
  a11yLabelledBy: string;
}

export type AvatarProps = AvatarA11yLabelProps | AvatarA11yLabelledByProps;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Shared label-composition logic used by both Avatar and AvatarButton. */
function composeLabel(
  base: string | undefined,
  indicator: AvatarIndicatorType | undefined,
  clockState: AvatarClockState | undefined,
  badgeContent: number | string | undefined,
  badgeLabel: string | undefined,
  clockLabel?: string,
): string | undefined {
  if (!base) return base;
  if (indicator === 'clock') {
    if (clockLabel !== undefined) return `${base}, ${clockLabel}`;
    return clockState === 'active' ? `${base}, online` : `${base}, away`;
  }
  if (indicator === 'badge') {
    return `${base}, ${badgeLabel ?? `${String(badgeContent ?? '1')} new notification`}`;
  }
  return base;
}

function normalizeSize(size: AvatarSizeInput): AvatarSize {
  if (size === 'xsmall') return 'xs';
  if (size === 'xlarge') return 'xl';
  return size;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function DefaultIcon() {
  return (
    <svg
      aria-hidden="true"
      className="ld-avatar-defaultIcon"
      fill="currentColor"
      height="1em"
      viewBox="0 0 20 20"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-5 9a2 2 0 0 0-2 2c0 1.7.83 2.97 2.13 3.78C6.42 17.58 8.15 18 10 18c1.85 0 3.58-.42 4.87-1.22C16.17 15.97 17 14.7 17 13a2 2 0 0 0-2-2H5Z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Compound subcomponents (for back-compat composition style)
// ---------------------------------------------------------------------------

export type AvatarImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface AvatarImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * Fires whenever the underlying <img> moves between load states. Parent
   * components can use this to swap in an `AvatarFallback` while `loading` or
   * after `error`.
   */
  onLoadingStatusChange?: (status: AvatarImageLoadingStatus) => void;
}

/** Renders the image inside an Avatar when used as a child. */
export const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({className, alt = '', src, onLoad, onError, onLoadingStatusChange, ...rest}, ref) => {
    React.useEffect(() => {
      if (!onLoadingStatusChange) return;
      onLoadingStatusChange(src ? 'loading' : 'idle');
    }, [src, onLoadingStatusChange]);

    const handleLoad = React.useCallback(
      (event: React.SyntheticEvent<HTMLImageElement>) => {
        onLoadingStatusChange?.('loaded');
        onLoad?.(event);
      },
      [onLoad, onLoadingStatusChange],
    );

    const handleError = React.useCallback(
      (event: React.SyntheticEvent<HTMLImageElement>) => {
        onLoadingStatusChange?.('error');
        onError?.(event);
      },
      [onError, onLoadingStatusChange],
    );

    return (
      <img
        ref={ref}
        className={cx('ld-avatar-image', className)}
        alt={alt}
        src={src}
        onLoad={handleLoad}
        onError={handleError}
        {...rest}
      />
    );
  },
);
AvatarImage.displayName = 'AvatarImage';

export interface AvatarFallbackProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

/** Renders fallback content (e.g. initials) when no image is available. */
export const AvatarFallback = React.forwardRef<
  HTMLSpanElement,
  AvatarFallbackProps
>(({className, ...rest}, ref) => (
  <span ref={ref} className={cx('ld-avatar-initials', className)} {...rest} />
));
AvatarFallback.displayName = 'AvatarFallback';

// ---------------------------------------------------------------------------
// Indicator overlays
// ---------------------------------------------------------------------------

function BadgeIndicator({
  size,
  content,
}: {
  size: AvatarSize;
  content: number | string;
}) {
  return (
    // aria-hidden: the badge count is already expressed in the root aria-label
    // (e.g. "Sarah Carter, 1 new notification") to avoid double-announcement.
    <Badge
      color="blue"
      aria-hidden="true"
      UNSAFE_className={cx('ld-avatar-badge', `ld-avatar-badge-${size}`)}
    >
      {content}
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

type AvatarComponent = React.FunctionComponent<AvatarProps> & {
  Image: typeof AvatarImage;
  Fallback: typeof AvatarFallback;
};

const AvatarFn: React.FunctionComponent<AvatarProps> = (props) => {
  const {
    a11yLabel,
    a11yLabelledBy,
    className,
    color = 'brand',
    icon,
    image,
    name,
    shape = 'circular',
    size: rawSize = 'medium',
    indicator = 'none',
    clockState = 'active',
    clockLabel,
    disabled = false,
    badgeContent = 1,
    badgeLabel,
    children,
    ...rest
  } = applyCommonProps(props);
  const size = normalizeSize(rawSize);

  const hasA11y = (a11yLabel ? 1 : 0) + (a11yLabelledBy ? 1 : 0) === 1;
  invariant(
    hasA11y,
    '`Avatar` accessibility violation. `Avatar` requires an `a11yLabel` OR an `a11yLabelledBy`.',
  );

  const [imgError, setImgError] = React.useState(false);

  const showImage = image?.src && !imgError;
  const initials = name ? getInitials(name) : '';

  // Auto-compose indicator status into the root aria-label so screen readers
  // announce the full context in one pass, e.g. "Sarah Carter, online" or
  // "Sarah Carter, 1 new notification". Badge/clock overlays are aria-hidden.
  const computedA11yLabel = composeLabel(a11yLabel, indicator, clockState, badgeContent, badgeLabel, clockLabel);

  const a11yProps = computedA11yLabel
    ? {'aria-label': computedA11yLabel, role: 'img' as const}
    : {'aria-labelledby': a11yLabelledBy, role: 'img' as const};

  const classes = cx(
    'ld-avatar-root',
    `ld-avatar-${size}`,
    `ld-avatar-${shape}`,
    `ld-avatar-${color}`,
    disabled && 'ld-avatar-disabled',
    className,
  );

  // Compound mode: when children are passed, render them directly inside the
  // avatar surface and let consumers compose with AvatarImage / AvatarFallback.
  const inner = children ? (
    children
  ) : showImage ? (
    <img
      alt={image.alt || ''}
      className="ld-avatar-image"
      onError={() => setImgError(true)}
      src={image.src}
    />
  ) : initials ? (
    <span className="ld-avatar-initials">{initials}</span>
  ) : icon ? (
    <span className="ld-avatar-icon">{icon}</span>
  ) : (
    <span className="ld-avatar-icon">
      <DefaultIcon />
    </span>
  );

  return (
    <span
      className={classes}
      aria-disabled={disabled || undefined}
      {...a11yProps}
      {...rest}
    >
      <span className="ld-avatar-surface">{inner}</span>
      {indicator === 'badge' && (
        <BadgeIndicator size={size} content={badgeContent} />
      )}
      {indicator === 'clock' && (
        <span
          aria-hidden="true"
          className={cx('ld-avatar-clock', `ld-avatar-clock-${size}`)}
        >
          {clockState === 'active' ? <ClockIn /> : <ClockOut />}
        </span>
      )}
    </span>
  );
};

AvatarFn.displayName = 'Avatar';

export const Avatar = AvatarFn as AvatarComponent;
Avatar.Image = AvatarImage;
Avatar.Fallback = AvatarFallback;

// ---------------------------------------------------------------------------
// AvatarButton — interactive wrapper
// ---------------------------------------------------------------------------

export interface AvatarButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'className' | 'color'
  > {
  size?: AvatarSizeInput;
  shape?: AvatarShape;
  color?: AvatarColor;
  indicator?: AvatarIndicatorType;
  clockState?: AvatarClockState;
  /** @see AvatarBaseProps.clockLabel */
  clockLabel?: string;
  badgeContent?: number | string;
  /** @see AvatarBaseProps.badgeLabel */
  badgeLabel?: string;
  name?: string;
  icon?: React.ReactNode;
  image?: {src: string; alt?: string};
  disabled?: boolean;
  /** Accessible label for the button (person's name). Status suffix is appended automatically. */
  'aria-label'?: string;
  className?: string;
  children?: React.ReactNode;
}

type AvatarButtonComponent = React.FunctionComponent<AvatarButtonProps> & {
  Image: typeof AvatarImage;
  Fallback: typeof AvatarFallback;
};

const AvatarButtonFn: React.FunctionComponent<AvatarButtonProps> = (props) => {
  const {
    onClick,
    disabled = false,
    'aria-label': ariaLabel,
    className,
    size = 'medium',
    shape,
    color,
    indicator,
    clockState = 'active',
    clockLabel,
    badgeContent = 1,
    badgeLabel,
    name,
    icon,
    image,
    children,
    ...rest
  } = props;
  const normalized = normalizeSize(size);
  const needsHitSlot =
    normalized === 'xs' || normalized === 'small' || normalized === 'medium';

  // Apply the same status-suffix logic to the button's aria-label so it
  // wins over the inner Avatar's label in the accessibility tree.
  const computedAriaLabel = composeLabel(ariaLabel, indicator, clockState, badgeContent, badgeLabel, clockLabel);

  return (
    <button
      type="button"
      aria-label={computedAriaLabel}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={onClick}
      className={cx(
        'ld-avatar-button',
        needsHitSlot && 'ld-avatar-button--hit-slot',
        disabled && 'ld-avatar-button--disabled',
        className,
      )}
      {...rest}
    >
      <Avatar
        a11yLabel={ariaLabel ?? 'Avatar'}
        size={size}
        shape={shape}
        color={color}
        indicator={indicator}
        clockState={clockState}
        badgeContent={badgeContent}
        name={name}
        icon={icon}
        image={image}
        disabled={disabled}
      >
        {children}
      </Avatar>
    </button>
  );
};

AvatarButtonFn.displayName = 'AvatarButton';

export const AvatarButton = AvatarButtonFn as AvatarButtonComponent;
AvatarButton.Image = AvatarImage;
AvatarButton.Fallback = AvatarFallback;
