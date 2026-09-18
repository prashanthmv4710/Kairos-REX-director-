// @refresh reset

/**
 * @module Masthead
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
 * For prop API + usage notes, read `Masthead.md` in this folder
 * or run `npm run ld-kit -- show Masthead`.
 */

/**
 * @source PX
 * @ported-from notes/LD-PX-Starter-Kit - V2/client/components/ui/MastHead.tsx
 *
 * Top-of-app header bar. Lean port: keeps the source's chrome (app name / app
 * logo on the left, action icon buttons on the right) but drops PX V2's
 * hard-wired pieces (Marty floating panel, MediaSolutionsDropdown,
 * react-i18next) in favor of content slots and per-action callbacks.
 *
 * Built-in actions (Bell / Help / Account) render only when their click
 * handler prop is provided.
 */
import * as React from 'react';

import {cx} from '../../common/cx';
import {Icon} from '../Icons/Icons';

import './Masthead.css';

export interface MastheadProps
  extends Omit<
    React.ComponentPropsWithoutRef<'header'>,
    'className' | 'style'
  > {
  /**
   * Accessible name for the `<header>` landmark. Pages can have multiple
   * banner-like regions; an explicit label keeps screen-reader landmark
   * navigation unambiguous. Defaults to "Application header".
   */
  a11yLabel?: string;

  /** App name shown beside the logo. Ignored if `appLogo` is supplied. */
  appName?: string;
  /** Either an image URL (rendered as `<img>`) or a custom node for the logo slot. */
  appLogo?: string | React.ReactNode;
  /**
   * Alt text used when `appLogo` is a string image URL. Falls back to
   * `appName`, then empty string (treated as decorative). Pass an empty
   * string explicitly if the logo is purely decorative.
   */
  appLogoAlt?: string;
  /** Content rendered at the start of the left group, before the app name/logo. Use this for an app-switcher or hamburger. */
  leftSlot?: React.ReactNode;
  /** Content rendered between the left and right groups (e.g. a workspace switcher). */
  centerSlot?: React.ReactNode;
  /** Content rendered at the start of the right group, before the built-in actions (e.g. LanguageSelector, custom buttons). */
  rightSlot?: React.ReactNode;

  /** Fires the notification button. If omitted, the Bell button is not rendered. */
  onNotificationClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Show the small red dot on the notification button. */
  notificationDot?: boolean;
  /** Accessible name for the notification button. */
  notificationLabel?: string;
  /**
   * Visually-hidden text appended to the notification button when
   * `notificationDot` is true. Lets screen readers announce that there are
   * unread items even though the dot itself carries no count.
   */
  notificationUnreadLabel?: string;

  /** Fires the help button. If omitted, the Help button is not rendered. */
  onHelpClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Accessible name for the help button. */
  helpLabel?: string;

  /** Fires the account button. If omitted, the Account button is not rendered. */
  onAccountClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Accessible name for the account button. */
  accountLabel?: string;

  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

export const Masthead: React.FunctionComponent<MastheadProps> = ({
  a11yLabel = 'Application header',
  appName,
  appLogo,
  appLogoAlt,
  leftSlot,
  centerSlot,
  rightSlot,
  onNotificationClick,
  notificationDot = false,
  notificationLabel = 'Notifications',
  notificationUnreadLabel = 'Unread items available',
  onHelpClick,
  helpLabel = 'Help',
  onAccountClick,
  accountLabel = 'Account',
  UNSAFE_className,
  UNSAFE_style,
  ...rest
}) => {
  const renderLogo = () => {
    if (!appLogo) {
      return appName ? <span className="ld-masthead__app-name">{appName}</span> : null;
    }
    if (typeof appLogo === 'string') {
      // An empty string alt is meaningful (decorative) — only fall through
      // to `appName` when no explicit alt was provided at all.
      const alt = appLogoAlt ?? appName ?? '';
      return <img src={appLogo} alt={alt} className="ld-masthead__app-logo" />;
    }
    return <>{appLogo}</>;
  };

  const hasActions = onNotificationClick || onHelpClick || onAccountClick;

  return (
    <header
      aria-label={a11yLabel}
      className={cx('ld-masthead', UNSAFE_className)}
      style={UNSAFE_style}
      {...rest}
    >
      <div className="ld-masthead__left">
        {leftSlot}
        {renderLogo()}
      </div>

      {centerSlot ? <div className="ld-masthead__center">{centerSlot}</div> : null}

      <div className="ld-masthead__right">
        {rightSlot}
        {hasActions ? (
          <div className="ld-masthead__actions">
            {onNotificationClick ? (
              <button
                type="button"
                className="ld-masthead__icon-button"
                aria-label={
                  notificationDot
                    ? `${notificationLabel}, ${notificationUnreadLabel}`
                    : notificationLabel
                }
                onClick={onNotificationClick}
              >
                <Icon name="Bell" size="small" decorative />
                {notificationDot ? (
                  <span className="ld-masthead__notif-dot" aria-hidden="true" />
                ) : null}
              </button>
            ) : null}
            {onHelpClick ? (
              <button
                type="button"
                className="ld-masthead__icon-button"
                aria-label={helpLabel}
                onClick={onHelpClick}
              >
                <Icon name="QuestionCircle" size="small" decorative />
              </button>
            ) : null}
            {onAccountClick ? (
              <button
                type="button"
                className="ld-masthead__icon-button"
                aria-label={accountLabel}
                onClick={onAccountClick}
              >
                <Icon name="User" size="small" decorative />
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  );
};

Masthead.displayName = 'Masthead';
