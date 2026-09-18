// @refresh reset

/**
 * @module FAB
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
 * For prop API + usage notes, read `FAB.md` in this folder
 * or run `npm run ld-kit -- show FAB`.
 */

import * as React from 'react';
import {DotLottieReact} from '@lottiefiles/dotlottie-react';
import {cx} from '../../common/cx';
import {applyCommonProps, invariant} from '../../common/helpers';
import {Badge} from '../Badge/Badge';
import {PlaceholderMedia} from '../../common/PlaceholderMedia/PlaceholderMedia';
import {Icon} from '../Icons/Icons';
import {SidekickLogoIcon} from '../../common/icons';
import {Tooltip} from '../Tooltip/Tooltip';
import {LOTTIE_DATA_BY_AGENT_THEME} from '../../lottie/index';
import {getMedia} from '../../utils/mediaManager';
import './FAB.css';

// ── Types ─────────────────────────────────────────────────────────────────

export type FABVariant = 'icon' | 'image' | 'agent';

export type FABSize = 'desktop-large' | 'desktop-small' | 'mobile';

/**
 * Six surface options:
 * - `primary` / `primary-bordered` — primary action fill (blue). White inset border on bordered variant.
 * - `secondary` / `secondary-bordered` — secondary fill (white). Magic gradient ring on bordered variant.
 * - `magic` / `magic-bordered` — magic gradient fill. White inset border on bordered variant.
 *   Interactive states for magic surfaces use primary fill tokens (no gradient).
 */
export type FABSurface =
  | 'primary'
  | 'primary-bordered'
  | 'secondary'
  | 'secondary-bordered'
  | 'magic'
  | 'magic-bordered';

/**
 * Icon and text color applied to the button content.
 *
 * Valid combinations:
 * - `primary`, `primary-bordered`, `magic`, `magic-bordered` → `'inverse'` or `'text'`
 * - `secondary`, `secondary-bordered` → `'text'` or `'brand'`
 */
export type FABIconColor = 'inverse' | 'text' | 'brand';

export type FABLabelColor = 'inverse' | 'text' | 'brand';

export type FABAgentPersona =
  | 'Wibey'
  | 'Marty'
  | 'Sparky'
  | 'Squiggy'
  | 'MyAssistant'
  | 'Wally'
  | 'Sidekick';

/**
 * Maps personas with published AgentWelcome Lottie assets to their agent theme.
 * customer → Sparky, partner → Marty, associate → Squiggy, developer → Wibey.
 */
const PERSONA_AGENT_THEME: Partial<Record<FABAgentPersona, string>> = {
  Wibey: 'developer',
  Marty: 'partner',
  Sparky: 'customer',
  Squiggy: 'associate',
};

/** Surfaces where `'inverse'` is the only valid icon color. */
const DARK_SURFACES: ReadonlySet<FABSurface> = new Set([
  'primary',
  'primary-bordered',
  'magic',
  'magic-bordered',
]);

export interface FABProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'className' | 'style' | 'content'> {
  /**
   * Accessible label — required for all variants.
   * Describe the action the button will trigger, e.g. "Open Wibey assistant".
   * When a badge count is shown, fold it in: "Open Wibey, 3 new messages".
   */
  'aria-label': string;
  /**
   * Content mode.
   * - `'icon'` — icon-only, defaults to the MagicFill AI icon.
   * - `'image'` — circular image; defaults to placeholder media.
    * - `'agent'` — agent persona avatar; resolves to Lottie, generated media, or placeholder.
   * @default 'icon'
   */
  variant?: FABVariant;
  /**
   * Surface treatment. Six options across three fill families, each with an optional border variant.
   * @default 'primary'
   */
  surface?: FABSurface;
  /**
   * Icon and text color inside the button.
   * Not all combinations are valid — see `FABIconColor` type docs.
   * @default 'inverse'
   */
  iconColor?: FABIconColor;
  /**
   * Optional visible text label rendered inside the button alongside the icon.
   * When provided the button expands to a pill shape.
   */
  label?: string;
  /**
   * Optional label color when `label` is shown.
    * Defaults to `inverse` to match the annotation examples.
   */
  labelColor?: FABLabelColor;
  /**
   * Agent persona. Only relevant when `variant='agent'`.
    * Wibey, Marty, Sparky, and Squiggy resolve to published Lottie animations.
    * Wally resolves to generated media; MyAssistant and Sidekick use fallback media.
   * @default 'Wibey'
   */
  agentPersona?: FABAgentPersona;
  /**
   * Slot override for the button's main content.
   * When provided, `variant` defaults are bypassed and this node is rendered directly.
   */
  content?: React.ReactNode;
  /**
   * Optional visual-only badge content rendered using the library Badge component.
   * - `undefined` — no badge shown.
   * - `null` — dot badge (presence indicator, no count).
   * - string/number/ReactNode — count badge with that content.
   *
   * The badge is always `aria-hidden`. Fold the count into `aria-label`.
   */
  badge?: React.ReactNode | null;
  /**
   * When `true`, the avatar wrapper becomes visually invisible while the
   * contained media scales and repositions within it, and the badge shifts
   * to compensate.
   * @default false
   */
  hideAvatarWrapper?: boolean;
  /** Disables button activation. */
  disabled?: boolean;
  /**
   * Optional tooltip content shown on hover/focus in desktop size modes.
   * Tooltips are hidden on mobile size mode.
   */
  tooltip?: string;
  /**
   * Viewport/device size mode that controls FAB padding and viewport inset.
   * - `'desktop-large'` — larger touch target and content padding.
   * - `'desktop-small'` — compact desktop mode.
   * - `'mobile'` — mobile viewport inset and padding.
   * @default 'desktop-large'
   */
  size?: FABSize;
  /**
   * When `true`, renders without background fill, shadow, or border (icon only floating).
   * Icon color still applies. Teams are responsible for customizing interactive states (hover, focus, active).
   * When containerless is enabled, the `surface` prop is ignored.
   * Badges are disabled in containerless mode.
   * @default false
   */
  containerless?: boolean;
  /**
   * Alias for `onClick`. Triggered when the user activates the FAB.
   * Both `onActivate` and `onClick` fire if both are provided.
   */
  onActivate?: React.MouseEventHandler<HTMLButtonElement>;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

// ── Agent content renderer ────────────────────────────────────────────────

function FABAgentContent({persona}: {persona: FABAgentPersona}) {
  const agentTheme = PERSONA_AGENT_THEME[persona];
  const raw = agentTheme ? LOTTIE_DATA_BY_AGENT_THEME[agentTheme]?.['AgentWelcome'] : undefined;
  const media = persona === 'Wally' ? getMedia('wally', 'AgentAvatar') : null;

  if (raw) {
    return (
      <DotLottieReact
        src={raw}
        autoplay
        loop
        style={{width: '100%', height: '100%'}}
      />
    );
  }

  if (persona === 'Sidekick') {
    return (
      <SidekickLogoIcon
        size={40}
      />
    );
  }

  if (media?.kind === 'svg' && media.svg) {
    return (
      <span
        aria-hidden="true"
        dangerouslySetInnerHTML={{__html: media.svg}}
      />
    );
  }

  return (
    <PlaceholderMedia
      shape="circle"
      label={persona.charAt(0)}
      style={{width: '100%', height: '100%'}}
    />
  );
}

// ── Component ─────────────────────────────────────────────────────────────

export const FAB: React.FunctionComponent<FABProps> = (props) => {
  const {
    'aria-label': ariaLabel,
    variant = 'icon',
    surface = 'primary',
    iconColor = 'inverse',
    label,
    labelColor = 'inverse',
    agentPersona = 'Wibey',
    content,
    badge,
    hideAvatarWrapper = false,
    disabled = false,
    tooltip,
    size = 'desktop-large',
    containerless = false,
    onActivate,
    onClick,
    className,
    ...rest
  } = applyCommonProps(props);

  // If containerless, disable badges
  const effectiveBadge = containerless ? undefined : badge;
  const badgeContent = typeof effectiveBadge === 'string' || typeof effectiveBadge === 'number'
    ? effectiveBadge
    : undefined;

  invariant(
    typeof ariaLabel === 'string' && ariaLabel.trim().length > 0,
    '`FAB` accessibility violation. `aria-label` is required and must be a non-empty string.',
  );

  // Surface and iconColor validation only applies when not containerless
  if (!containerless) {
    invariant(
      !(DARK_SURFACES.has(surface) && !['inverse', 'text'].includes(iconColor)),
      `\`FAB\` prop conflict: iconColor="${iconColor}" is not valid on surface="${surface}". ` +
      `Primary and magic surfaces support iconColor="inverse" or iconColor="text".`,
    );

    invariant(
      !(!DARK_SURFACES.has(surface) && ['inverse'].includes(iconColor)),
      `\`FAB\` prop conflict: iconColor="inverse" is not valid on surface="${surface}". ` +
      `Secondary surfaces support iconColor="text" or iconColor="brand".`,
    );

    if (label && size !== 'mobile') {
      invariant(
        !(DARK_SURFACES.has(surface) && labelColor !== 'inverse'),
        `\`FAB\` prop conflict: labelColor="${labelColor}" is not valid on surface="${surface}". ` +
        `Primary and magic surfaces only support labelColor="inverse".`,
      );

      invariant(
        !(!DARK_SURFACES.has(surface) && labelColor === 'inverse'),
        `\`FAB\` prop conflict: labelColor="inverse" is not valid on surface="${surface}". ` +
        `Secondary surfaces support labelColor="text" or labelColor="brand".`,
      );
    }
  }

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onActivate?.(e);
      onClick?.(e);
    },
    [onActivate, onClick],
  );

  // Resolve button content based on variant
  let resolvedContent: React.ReactNode;
  const iconSize = size === 'desktop-small' ? 'medium' : 'large';
  const shouldShowLabel = Boolean(label) && size !== 'mobile';
  const tooltipContent = tooltip?.trim() ?? '';
  const shouldShowTooltip = tooltipContent.length > 0 && size !== 'mobile' && !disabled;
  if (content !== undefined) {
    resolvedContent = content;
  } else if (variant === 'agent') {
    resolvedContent = (
      <span className="ld-fab-avatarWrap">
        <span className="ld-fab-avatarMedia">
          <FABAgentContent persona={agentPersona} />
        </span>
      </span>
    );
  } else if (variant === 'image') {
    resolvedContent = (
      <span className="ld-fab-avatarWrap">
        <span className="ld-fab-avatarMedia">
          <PlaceholderMedia
            shape="circle"
            style={{width: '100%', height: '100%'}}
            label="Image"
          />
        </span>
      </span>
    );
  } else {
    // icon variant — defaults to MagicFill
    resolvedContent = <Icon name="MagicFill" size={iconSize} decorative />;
  }

  const button = (
    <button
      type="button"
      className={cx(
        'ld-fab-button',
        !containerless && `ld-fab-button--surface-${surface}`,
        `ld-fab-button--icon-${iconColor}`,
        `ld-fab-button--variant-${variant}`,
        variant === 'agent' && `ld-fab-button--persona-${agentPersona.toLowerCase()}`,
        `ld-fab-button--size-${size}`,
        shouldShowLabel && `ld-fab-button--label-${labelColor}`,
        shouldShowLabel && 'ld-fab-button--has-label',
        hideAvatarWrapper && 'ld-fab-button--hide-avatar-wrapper',
        containerless && 'ld-fab-button--containerless',
      )}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={handleClick}
      {...rest}
    >
      <span className="ld-fab-iconWrap">{resolvedContent}</span>
      {shouldShowLabel && <span className="ld-fab-label">{label}</span>}
    </button>
  );

  return (
    <div className={cx('ld-fab-root', `ld-fab-root--size-${size}`, className)}>
      <div
        className={cx(
          'ld-fab-buttonWrap',
          `ld-fab-buttonWrap--size-${size}`,
          shouldShowLabel && 'ld-fab-buttonWrap--has-label',
          hideAvatarWrapper && 'ld-fab-buttonWrap--hide-avatar-wrapper',
        )}
      >
        {shouldShowTooltip ? (
          <Tooltip content={tooltipContent} position="topCenterOrLeft">
            {button}
          </Tooltip>
        ) : (
          button
        )}
        {effectiveBadge !== undefined && (
          <span
            aria-hidden="true"
            className={cx('ld-fab-badge', effectiveBadge === null && 'ld-fab-badge--dot')}
          >
            <Badge color="yellow" size="medium">{badgeContent}</Badge>
          </span>
        )}
      </div>
    </div>
  );
};

FAB.displayName = 'FAB';
