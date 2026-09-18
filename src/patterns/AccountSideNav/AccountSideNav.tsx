// @refresh reset

/**
 * @module AccountSideNav
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
 * For prop API + usage notes, read `AccountSideNav.md` in this folder
 * or run `npm run ld-kit -- show AccountSideNav`.
 */

import * as React from 'react';
const { useState } = React;
import { SideNavigation, SideNavigationItem } from '../../components/SideNavigation';
import { Divider } from '../../components/Divider';
import { Tag } from '../../components/Tag/Tag';
import { WPlusIcon } from '../../common/icons';
import { ChevronDownIcon as CoreChevronDownIcon, Icon } from '../../components/Icons';
import { cx } from '../../common/cx';
import { VisuallyHidden } from '../../components/VisuallyHidden';
import './AccountSideNav.css';

/* ------------------------------------------------------------------ */
/*  Nav icons — theme font icons via the shared Icon component         */
/* ------------------------------------------------------------------ */

const ICON_STYLE: React.CSSProperties = {color: 'var(--ld-semantic-color-fill-accent-blue)', fontSize: 20};

const UserIcon = () => <Icon name="User" style={ICON_STYLE} decorative />;
const GearIcon = () => <Icon name="Gear" style={ICON_STYLE} decorative />;
const SignOutIcon = () => <Icon name="SignOut" style={ICON_STYLE} decorative />;

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */

interface NavItem {
  label: string;
  path: string;
  tag?: string;
}

const accountItems: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Purchase history', path: '/purchase-history' },
  { label: 'Walmart+', path: '/walmart-plus' },
  { label: 'My savings', path: '/savings' },
  { label: 'Walmart Cash', path: '/walmart-cash' },
  { label: 'Messages', path: '/messages' },
];

const myItemsItems: NavItem[] = [
  { label: 'Reorder', path: '/reorder' },
  { label: 'Shop With Friends', path: '/shop-with-friends', tag: 'New' },
  { label: 'Lists', path: '/lists' },
  { label: 'Subscriptions', path: '/subscriptions' },
  { label: 'Registry', path: '/registry' },
  { label: 'Protection plans', path: '/protection-plans' },
];

const myProfileItems: NavItem[] = [
  { label: 'Reviews', path: '/reviews', tag: '6 items to review' },
  { label: 'Pets', path: '/pets' },
  { label: 'Vehicles', path: '/vehicles' },
  { label: 'Recipes', path: '/recipes' },
];

const otherAccountsItems: NavItem[] = [
  { label: 'Pharmacy', path: '/pharmacy' },
  { label: 'Photos', path: '/photos' },
  { label: 'eBooks', path: '/ebooks' },
];

const settingsPersonalInfo: NavItem[] = [
  { label: 'Contact info and password', path: '/settings/contact' },
  { label: 'Passkeys', path: '/settings/passkeys' },
  { label: 'Addresses', path: '/settings/addresses' },
  { label: 'Wallet', path: '/settings/wallet' },
];

const settingsComms: NavItem[] = [
  { label: 'Communication preferences', path: '/settings/communication' },
  { label: 'Privacy', path: '/settings/privacy' },
];

const settingsShopping: NavItem[] = [
  { label: 'Language settings', path: '/settings/language' },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                    */
/* ------------------------------------------------------------------ */

function NavItemContent({ item }: { item: NavItem }) {
  return (
    <span className="ld-wcp-account-side-nav-nav-item-content">
      <span className="ld-wcp-account-side-nav-nav-item-label">{item.label}</span>
      {item.tag && (
        <Tag color="spark" variant="primary">{item.tag}</Tag>
      )}
    </span>
  );
}

interface NavGroupProps {
  title: string;
  items: NavItem[];
  currentPath: string;
}

function NavGroup({ title, items, currentPath }: NavGroupProps) {
  return (
    <>
      <h3 className="ld-wcp-account-side-nav-group-title">
        {title}
      </h3>
      <SideNavigation aria-label={title}>
        {items.map((item) => (
          <SideNavigationItem
            key={item.path}
            href="#"
            isCurrent={currentPath === item.path}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault()}
          >
            <NavItemContent item={item} />
          </SideNavigationItem>
        ))}
      </SideNavigation>
    </>
  );
}

interface SectionHeaderProps {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  onClick: () => void;
}

function SectionHeader({ icon, label, isOpen, onClick }: SectionHeaderProps) {
  return (
    <button
      onClick={onClick}
      className="ld-wcp-account-side-nav-section-btn"
      aria-expanded={isOpen}
    >
      <span className="ld-wcp-account-side-nav-section-left">
        <span className="ld-wcp-account-side-nav-icon-circle">
          {icon}
        </span>
        <span>{label}</span>
      </span>
      <CoreChevronDownIcon
        className={cx('ld-wcp-account-side-nav-chevron', isOpen && 'ld-wcp-account-side-nav-chevron-open')}
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  AccountSideNav                                                    */
/* ------------------------------------------------------------------ */

const hardcodedCurrentPath: string = '/purchase-history';

export function AccountSideNav() {
  const [accountOpen, setAccountOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <aside
      aria-label="Account navigation"
      className="ld-wcp-account-side-nav-root"
    >
      <VisuallyHidden as="h2">Account navigation with accordions</VisuallyHidden>
      {/* User Header */}
      <div className="ld-wcp-account-side-nav-user-header">
        <div className="ld-wcp-account-side-nav-user-row">
          <WPlusIcon size="large" />
          <span className="ld-wcp-account-side-nav-user-name">Hi, Emilia</span>
        </div>
        <p className="ld-wcp-account-side-nav-member-since">Member since 2023</p>
      </div>

      {/* Account Section (collapsible) */}
      <SectionHeader
        icon={<UserIcon />}
        label="Account"
        isOpen={accountOpen}
        onClick={() => setAccountOpen((v) => !v)}
      />
      {accountOpen && (
        <div>
          <SideNavigation aria-label="Account">
            {accountItems.map((item) => (
              <SideNavigationItem
                key={item.path}
                href="#"
                isCurrent={hardcodedCurrentPath === item.path}
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault()}
              >
                <NavItemContent item={item} />
              </SideNavigationItem>
            ))}
          </SideNavigation>
          <NavGroup title="My items" items={myItemsItems} currentPath={hardcodedCurrentPath} />
          <NavGroup title="My profile" items={myProfileItems} currentPath={hardcodedCurrentPath} />
          <NavGroup title="Other accounts" items={otherAccountsItems} currentPath={hardcodedCurrentPath} />
        </div>
      )}

      <Divider />

      {/* Settings Section (collapsible) */}
      <SectionHeader
        icon={<GearIcon />}
        label="Settings"
        isOpen={settingsOpen}
        onClick={() => setSettingsOpen((v) => !v)}
      />
      {settingsOpen && (
        <div>
          <SideNavigation aria-label="Settings">
            <SideNavigationItem
              href="#"
              isCurrent={hardcodedCurrentPath === '/'}
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault()}
            >
              Home
            </SideNavigationItem>
          </SideNavigation>
          <NavGroup title="Personal information" items={settingsPersonalInfo} currentPath={hardcodedCurrentPath} />
          <NavGroup title="Communications and privacy" items={settingsComms} currentPath={hardcodedCurrentPath} />
          <NavGroup title="Shopping settings" items={settingsShopping} currentPath={hardcodedCurrentPath} />
        </div>
      )}

      <Divider />

      {/* Sign Out */}
      <button
        onClick={() => { /* no-op */ }}
        className="ld-wcp-account-side-nav-sign-out-btn"
      >
        <span className="ld-wcp-account-side-nav-icon-circle">
          <SignOutIcon />
        </span>
        <span>Sign Out</span>
      </button>
    </aside>
  );
}
AccountSideNav.displayName = 'AccountSideNav';
