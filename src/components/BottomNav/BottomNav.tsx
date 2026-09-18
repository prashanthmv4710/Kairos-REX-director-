// @refresh reset

/**
 * @module BottomNav
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
 * For prop API + usage notes, read `BottomNav.md` in this folder
 * or run `npm run ld-kit -- show BottomNav`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {Icon} from '../Icons';
import './BottomNav.css';
const { useState, useEffect, useRef } = React;

/* ------------------------------------------------------------------ */
/*  Tab icons — theme font icons via the shared Icon component         */
/* ------------------------------------------------------------------ */

const StoreIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <Icon name="Facility" size="medium" style={{color}} decorative />
);

const HeartIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <Icon name="Heart" size="medium" style={{color}} decorative />
);

const UserIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <Icon name="User" size="medium" style={{color}} decorative />
);

/* ------------------------------------------------------------------ */
/*  Tab indicator x-offset mapping                                    */
/* ------------------------------------------------------------------ */

const TAB_X: Record<string, string> = {
  shop: '-72px',
  heart: '0px',
  user: '72px',
};

/* ------------------------------------------------------------------ */
/*  BottomNav                                                         */
/* ------------------------------------------------------------------ */

interface BottomNavProps {
  activeTab?: 'shop' | 'heart' | 'user';
  onTabChange?: (tab: 'shop' | 'heart' | 'user') => void;
  /** Renders in-flow (not fixed) for use inside a patterns/documentation page */
  contained?: boolean;
}

export function BottomNav({ activeTab = 'shop', onTabChange, contained = false }: BottomNavProps) {
  const [visualTab, setVisualTab] = useState<'shop' | 'heart' | 'user'>(activeTab);
  const [isMoving, setIsMoving] = useState(false);
  const moveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setVisualTab(activeTab);
  }, [activeTab]);

  const handleTabClick = (tab: 'shop' | 'heart' | 'user') => {
    if (tab === visualTab) return;

    if (moveTimerRef.current) clearTimeout(moveTimerRef.current);

    setVisualTab(tab);
    setIsMoving(true);
    onTabChange?.(tab);

    moveTimerRef.current = setTimeout(() => setIsMoving(false), 400);
  };

  const indicatorX = TAB_X[visualTab];

  const activeColor = '#0071dc';
  const inactiveColor = '#74767c';

  return (
    <div
      className={cx(
        'ld-wcp-bottom-nav-root',
        contained ? 'ld-wcp-bottom-nav-root--contained' : 'ld-wcp-bottom-nav-root--fixed',
      )}
    >
      <div className="ld-wcp-bottom-nav-bar">
        {/* Tab bar: 3 tabs centered */}
        <div className="ld-wcp-bottom-nav-tabs">
          {/* Sliding indicator */}
          <div
            className="ld-wcp-bottom-nav-indicator"
            style={{ transform: `translateX(calc(-50% + ${indicatorX}))` }}
          />

          {/* Shop tab */}
          <button
            onClick={() => handleTabClick('shop')}
            aria-label="Shop"
            className="ld-wcp-bottom-nav-tab"
          >
            <StoreIcon color={visualTab === 'shop' ? activeColor : inactiveColor} />
          </button>

          {/* Heart tab */}
          <button
            onClick={() => handleTabClick('heart')}
            aria-label="My Items"
            className="ld-wcp-bottom-nav-tab"
          >
            <HeartIcon color={visualTab === 'heart' ? activeColor : inactiveColor} />
          </button>

          {/* User tab */}
          <button
            onClick={() => handleTabClick('user')}
            aria-label="Account"
            className="ld-wcp-bottom-nav-tab"
          >
            <UserIcon color={visualTab === 'user' ? activeColor : inactiveColor} />
          </button>
        </div>
      </div>
    </div>
  );
}
BottomNav.displayName = 'BottomNav';
