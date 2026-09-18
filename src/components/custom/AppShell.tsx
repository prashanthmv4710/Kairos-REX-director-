import * as React from 'react';
import { AppSidebar, type AppSidebarMenuItem } from './AppSidebar';
import { Masthead } from '../Masthead';

const MENU_ITEMS: AppSidebarMenuItem[] = [
  { id: 'order-reviews', label: 'Order reviews', iconName: 'List', route: '/' },
];

// This page is published standalone on puppy.walmart.com/sharing, embedded
// in a sandboxed iframe. We can't be 100% sure the sandbox grants
// `allow-popups` for the new-tab open, so the raw URL also rides along in
// the `title` attribute -- a native tooltip on hover/long-press that works
// as a copy/paste fallback without cluttering the UI with visible text.
const PROTOTYPE_HUB_URL = 'https://puppy.walmart.com/sharing/p0b05bu/prototype-hub';

export interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const activeMenuItem = 'order-reviews';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Masthead
        a11yLabel="Kairos REX Director"
        appName="Kairos"
        leftSlot={
          <a
            href={PROTOTYPE_HUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            title={`Open ${PROTOTYPE_HUB_URL} in a new tab`}
            style={{
              fontSize: '12px',
              color: 'var(--ld-semantic-color-text-subtle, #74767c)',
              textDecoration: 'none',
              marginRight: '12px',
              paddingRight: '12px',
              borderRight: '1px solid var(--ld-semantic-color-separator, #d5d5d5)',
            }}
          >
            &larr; Hub
          </a>
        }
        onNotificationClick={() => {}}
        notificationLabel="Notifications"
        onHelpClick={() => {}}
        helpLabel="Help"
        onAccountClick={() => {}}
        accountLabel="Account"
        UNSAFE_style={{
          ['--ld-semantic-color-topNav-fill' as string]: 'var(--ld-semantic-color-surface)',
          ['--ld-semantic-color-topNav-text-onFill' as string]: 'var(--ld-semantic-color-text-subtle)',
          ['--ld-semantic-color-topNav-separator' as string]: 'var(--ld-semantic-color-separator)',
        }}
      />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <AppSidebar
          activeMenuItem={activeMenuItem}
          menuItems={MENU_ITEMS}
          // Only one menu item exists and it's already the active screen,
          // so there's nothing to navigate to.
          onMenuItemClick={() => {}}
          defaultLocked
        />
        <div
          style={{
            flex: 1,
            minWidth: 0,
            height: '100%',
            overflowY: 'auto',
            // Without this, once this pane's own scroll is exhausted (top or
            // bottom), the wheel/trackpad gesture chains up to <body> — which
            // has nothing else to scroll, so it just rubber-bands, visibly
            // yanking the whole page (masthead + sidebar included) up with
            // it. `contain` stops the scroll from ever leaving this pane.
            overscrollBehavior: 'contain',
            background: 'var(--ld-semantic-color-surface-subtle, #f8f8f8)',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
