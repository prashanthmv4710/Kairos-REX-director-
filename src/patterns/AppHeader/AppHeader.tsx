// @refresh reset

/**
 * @module AppHeader
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
 * For prop API + usage notes, read `AppHeader.md` in this folder
 * or run `npm run ld-kit -- show AppHeader`.
 */

import * as React from 'react';
import {Icon} from '../../components/Icons/Icons';
import {SearchField} from '../../components/SearchField/SearchField';
import {cx} from '../../common/cx';

import './AppHeader.css';

export type AppHeaderVariant = 'blue' | 'white';
export type AppHeaderPlatform = 'ios' | 'android';

export interface AppHeaderProps {
  variant?: AppHeaderVariant;
  platform?: AppHeaderPlatform;
  isTablet?: boolean;
  title?: string;
  subtitle?: string;
  showSubtitle?: boolean;
  showSearch?: boolean;
  showAvatar?: boolean;
  showAction1?: boolean;
  showAction2?: boolean;
  showAction3?: boolean;
  showAction4?: boolean;
  menuIconName?: string;
  action1IconName?: string;
  action2IconName?: string;
  action3IconName?: string;
  action4IconName?: string;
  avatarInitials?: string;
  onMenuClick?: () => void;
  onAvatarClick?: () => void;
  onActionClick?: (actionIndex: 1 | 2 | 3 | 4) => void;
  className?: string;
}

function AppHeaderStatusBar({platform}: {platform: AppHeaderPlatform}) {
  const isAndroid = platform === 'android';

  return (
    <div
      className={cx(
        'ld-shared-app-header__status-bar',
        isAndroid && 'ld-shared-app-header__status-bar--android',
      )}
    >
      <span className="ld-shared-app-header__status-time">9:41</span>
      {!isAndroid && <div className="ld-shared-app-header__dynamic-island" />}
      <div className="ld-shared-app-header__status-icons" aria-hidden>
        {isAndroid ? (
          <>
            <span className="ld-shared-app-header__android-network">5G</span>
            <Icon name="Wifi" style={{fontSize: 16}} />
            <Icon name="BatteryFull" style={{fontSize: 16}} />
          </>
        ) : (
          <>
            <span className="ld-shared-app-header__cell-bars">
              <span />
              <span />
              <span />
              <span />
            </span>
            <Icon name="Wifi" style={{fontSize: 16}} />
            <span className="ld-shared-app-header__battery" />
          </>
        )}
      </div>
    </div>
  );
}

function AppHeaderIconButton({
  label,
  iconName,
  onClick,
}: {
  label: string;
  iconName: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className="ld-shared-app-header__icon-button"
      aria-label={label}
      onClick={onClick}
    >
      <Icon name={iconName} style={{fontSize: 22}} />
    </button>
  );
}

function AppHeaderAccountMenu() {
  return (
    <div
      className="ld-shared-app-header__account-menu"
      role="menu"
      aria-label="Account menu"
    >
      <div className="ld-shared-app-header__account-profile">
        <span className="ld-shared-app-header__account-avatar">WM</span>
        <span className="ld-shared-app-header__account-name">Walmart Associate</span>
        <button type="button" className="ld-shared-app-header__account-link">
          Sign out
        </button>
      </div>

      <div className="ld-shared-app-header__account-separator" role="separator" />

      <div className="ld-shared-app-header__account-row">
        <Icon name="Location" decorative style={{fontSize: 16}} />
        <div className="ld-shared-app-header__account-row-text">
          <span className="ld-shared-app-header__account-muted">Club #0001</span>
          <span className="ld-shared-app-header__account-row-label">Member Services</span>
        </div>
        <button type="button" className="ld-shared-app-header__account-link">
          Change
        </button>
      </div>

      <button type="button" className="ld-shared-app-header__account-row" role="menuitem">
        <Icon name="Note" decorative style={{fontSize: 16}} />
        <span className="ld-shared-app-header__account-row-label">Report issues or leave feedback</span>
      </button>

      <button type="button" className="ld-shared-app-header__account-row" role="menuitem">
        <Icon name="Wrench" decorative style={{fontSize: 16}} />
        <span className="ld-shared-app-header__account-row-label">See what's new</span>
        <span className="ld-shared-app-header__account-version">v 3.5.1</span>
      </button>

      <button type="button" className="ld-shared-app-header__account-row" role="menuitem">
        <Icon name="Star" decorative style={{fontSize: 16}} />
        <span className="ld-shared-app-header__account-row-label">Supervisor sign in</span>
      </button>
    </div>
  );
}

export function AppHeader({
  variant = 'blue',
  platform = 'ios',
  isTablet = false,
  title = 'Title',
  subtitle = 'Subtitle',
  showSubtitle = false,
  showSearch = false,
  showAvatar = true,
  showAction1 = true,
  showAction2 = false,
  showAction3 = false,
  showAction4 = false,
  menuIconName = 'Menu',
  action1IconName = 'Chat',
  action2IconName = 'Box',
  action3IconName = 'Image',
  action4IconName = 'More',
  avatarInitials = 'SC',
  onMenuClick,
  onAvatarClick,
  onActionClick,
  className,
}: AppHeaderProps) {
  const [searchValue, setSearchValue] = React.useState('');
  const [accountMenuOpen, setAccountMenuOpen] = React.useState(false);
  const accountMenuRef = React.useRef<HTMLDivElement | null>(null);
  const isBlue = variant === 'blue';

  React.useEffect(() => {
    if (!accountMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [accountMenuOpen]);

  return (
    <header
      className={cx(
        'ld-shared-app-header',
        isBlue
          ? 'ld-shared-app-header--blue'
          : 'ld-shared-app-header--white',
        isTablet && 'ld-shared-app-header--tablet',
        platform === 'android' && 'ld-shared-app-header--android',
        className,
      )}
    >
      <AppHeaderStatusBar platform={platform} />

      <div className="ld-shared-app-header__bar">
        <AppHeaderIconButton
          label={menuIconName === 'ChevronLeft' ? 'Go back' : 'Menu'}
          iconName={menuIconName}
          onClick={onMenuClick}
        />

        <div className="ld-shared-app-header__title-area">
          <span className="ld-shared-app-header__title">{title}</span>
          {showSubtitle && (
            <span className="ld-shared-app-header__subtitle">{subtitle}</span>
          )}
        </div>

        <div className="ld-shared-app-header__actions">
          {showAction1 && (
            <AppHeaderIconButton
              label="Action 1"
              iconName={action1IconName}
              onClick={() => onActionClick?.(1)}
            />
          )}
          {showAction2 && (
            <AppHeaderIconButton
              label="Action 2"
              iconName={action2IconName}
              onClick={() => onActionClick?.(2)}
            />
          )}
          {showAction3 && (
            <AppHeaderIconButton
              label="Action 3"
              iconName={action3IconName}
              onClick={() => onActionClick?.(3)}
            />
          )}
          {isTablet && showAction4 && (
            <AppHeaderIconButton
              label="Action 4"
              iconName={action4IconName}
              onClick={() => onActionClick?.(4)}
            />
          )}
          {showAvatar && (
            <div className="ld-shared-app-header__account-root" ref={accountMenuRef}>
              <button
                type="button"
                className="ld-shared-app-header__avatar-button"
                aria-label="Account"
                aria-haspopup="menu"
                aria-expanded={accountMenuOpen}
                onClick={() => {
                  setAccountMenuOpen((open) => !open);
                  onAvatarClick?.();
                }}
              >
                <span className="ld-shared-app-header__avatar">{avatarInitials}</span>
                <span className="ld-shared-app-header__avatar-indicator" />
              </button>
              {accountMenuOpen && <AppHeaderAccountMenu />}
            </div>
          )}
        </div>
      </div>

      {showSearch && (
        <div className="ld-shared-app-header__search-row">
          <SearchField
            value={searchValue}
            onChange={setSearchValue}
            size="small"
            cornerStyle="rounded"
            showMic={false}
            showBarcode
          />
        </div>
      )}
    </header>
  );
}

AppHeader.displayName = 'AppHeader';
