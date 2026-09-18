// @refresh reset

/**
 * @module AxBottomNav
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
 * For prop API + usage notes, read `AxBottomNav.md` in this folder
 * or run `npm run ld-kit -- show AxBottomNav`.
 */

import * as React from 'react';
import {Icon} from '../../components/Icons/Icons';
import {cx} from '../../common/cx';
import './AxBottomNav.css';

export type BottomNavTab = 'for-you' | 'todays-plan' | 'your-team' | 'more';
export type BottomNavPlatform = 'ios' | 'android';

const IOS_BOTTOM_NAV_TABS: Array<{
  id: BottomNavTab;
  label: string;
  iconName: string;
}> = [
  {id: 'for-you', label: 'For you', iconName: 'List'},
  {id: 'todays-plan', label: "Today's Plan", iconName: 'Calendar'},
  {id: 'your-team', label: 'Your team', iconName: 'Users'},
];

const ANDROID_BOTTOM_NAV_TABS = [
  ...IOS_BOTTOM_NAV_TABS,
  {id: 'more' as const, label: 'More', iconName: 'More'},
];

export interface BottomNavProps {
  activeTab?: BottomNavTab;
  platform?: BottomNavPlatform;
  onTabChange?: (tab: BottomNavTab) => void;
  /** Renders in-flow (not fixed) for use inside a patterns/documentation page */
  contained?: boolean;
  showAgentButton?: boolean;
}

export function AxBottomNav({
  activeTab = 'for-you',
  platform = 'ios',
  onTabChange,
  contained = false,
  showAgentButton = true,
}: BottomNavProps) {
  const [visualTab, setVisualTab] = React.useState<BottomNavTab>(activeTab);
  const tabs = platform === 'android' ? ANDROID_BOTTOM_NAV_TABS : IOS_BOTTOM_NAV_TABS;

  React.useEffect(() => {
    setVisualTab(activeTab);
  }, [activeTab]);

  React.useEffect(() => {
    if (platform === 'ios' && visualTab === 'more') {
      setVisualTab('for-you');
      onTabChange?.('for-you');
    }
  }, [onTabChange, platform, visualTab]);

  const handleTabClick = (tab: BottomNavTab) => {
    if (tab === visualTab) return;
    setVisualTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div
      className={cx(
        'ld-wcp-bottom-nav-root',
        platform === 'ios' ? 'ld-wcp-bottom-nav-root--ios' : 'ld-wcp-bottom-nav-root--android',
        contained ? 'ld-wcp-bottom-nav-root--contained' : 'ld-wcp-bottom-nav-root--fixed',
      )}
    >
      {platform === 'ios' && showAgentButton && (
        <button type="button" className="ld-wcp-bottom-nav-agent-button" aria-label="Open Squiggly AI agent">
          <Icon name="Magic" decorative style={{fontSize: 24}} />
        </button>
      )}
      <div className="ld-wcp-bottom-nav-bar" style={{gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`}}>
        {tabs.map((tab) => {
          const isActive = visualTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={cx('ld-wcp-bottom-nav-tab', isActive && 'ld-wcp-bottom-nav-tab--active')}
            >
              <Icon name={tab.iconName} decorative style={{fontSize: 24}} />
              <span className="ld-wcp-bottom-nav-tab-label">{tab.label}</span>
            </button>
          );
        })}
      </div>
      {platform === 'ios' && <div className="ld-wcp-bottom-nav-home-indicator" />}
    </div>
  );
}
AxBottomNav.displayName = 'AxBottomNav';
