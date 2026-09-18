import * as React from 'react';
import {panelStyles} from './styles';
import {COLOR_RED, COLOR_AMBER, COLOR_TEXT, COLOR_INK} from './constants';

export const TAB_ORDER = ['all', 'errors', 'warnings'] as const;
export type TabId = (typeof TAB_ORDER)[number];

export interface TabBarProps {
  total: number;
  errorCount: number;
  warningCount: number;
  activeTab: TabId;
  onChange: (tab: TabId) => void;
}

export function TabBar({total, errorCount, warningCount, activeTab, onChange}: TabBarProps): JSX.Element {
  const tabRefs = React.useRef<Record<TabId, HTMLButtonElement | null>>({
    all: null,
    errors: null,
    warnings: null,
  });

  // Deliberately no "auto-switch tabs when the active tab empties out" effect
  // here. That used to move a user filtered to Errors over to Warnings the
  // moment they fixed the last error — an unrequested change of context at
  // exactly the moment they're verifying their own fix. ViolationList already
  // renders a clear "No errors found." empty state for a zero-count tab, so
  // staying put is both correct and less surprising.

  // WAI-ARIA Tabs pattern — arrow/Home/End keyboard navigation with roving focus.
  const onTabKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      const idx = TAB_ORDER.indexOf(activeTab);
      let nextIdx = idx;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextIdx = (idx + 1) % TAB_ORDER.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') nextIdx = (idx - 1 + TAB_ORDER.length) % TAB_ORDER.length;
      else if (e.key === 'Home') nextIdx = 0;
      else if (e.key === 'End') nextIdx = TAB_ORDER.length - 1;
      else return;
      e.preventDefault();
      const next = TAB_ORDER[nextIdx];
      onChange(next);
      tabRefs.current[next]?.focus();
    },
    [activeTab, onChange],
  );

  return (
    <div style={panelStyles.tabBar} role="tablist" aria-label="Filter by severity" onKeyDown={onTabKeyDown}>
      <button
        type="button"
        role="tab"
        id="a11y-tab-all"
        ref={(el) => { tabRefs.current.all = el; }}
        aria-selected={activeTab === 'all'}
        aria-controls="a11y-tabpanel"
        tabIndex={activeTab === 'all' ? 0 : -1}
        onClick={() => onChange('all')}
        style={{...panelStyles.tab, ...(activeTab === 'all' ? panelStyles.tabActive : {})}}
      >
        All
        <span style={{...panelStyles.tabCount, background: activeTab === 'all' ? COLOR_INK : '#d1d5db', color: activeTab === 'all' ? '#fff' : COLOR_INK}}>
          {total}
        </span>
      </button>
      <button
        type="button"
        role="tab"
        id="a11y-tab-errors"
        ref={(el) => { tabRefs.current.errors = el; }}
        aria-selected={activeTab === 'errors'}
        aria-controls="a11y-tabpanel"
        tabIndex={activeTab === 'errors' ? 0 : -1}
        onClick={() => onChange('errors')}
        style={{...panelStyles.tab, ...(activeTab === 'errors' ? panelStyles.tabActive : {})}}
      >
        Errors
        {errorCount > 0 && (
          <span style={{...panelStyles.tabCount, background: activeTab === 'errors' ? COLOR_RED : '#d1d5db', color: activeTab === 'errors' ? '#fff' : COLOR_INK}}>
            {errorCount}
          </span>
        )}
      </button>
      <button
        type="button"
        role="tab"
        id="a11y-tab-warnings"
        ref={(el) => { tabRefs.current.warnings = el; }}
        aria-selected={activeTab === 'warnings'}
        aria-controls="a11y-tabpanel"
        tabIndex={activeTab === 'warnings' ? 0 : -1}
        onClick={() => onChange('warnings')}
        style={{...panelStyles.tab, ...(activeTab === 'warnings' ? panelStyles.tabActive : {})}}
      >
        Warnings
        {warningCount > 0 && (
          <span style={{...panelStyles.tabCount, background: activeTab === 'warnings' ? COLOR_AMBER : '#d1d5db', color: activeTab === 'warnings' ? COLOR_TEXT : COLOR_INK}}>
            {warningCount}
          </span>
        )}
      </button>
    </div>
  );
}
