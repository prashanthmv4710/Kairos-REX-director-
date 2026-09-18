import * as React from 'react';
import type {Violation} from '../violation-messages';
import {panelStyles} from './styles';
import {COLOR_RED, COLOR_AMBER, COLOR_TEXT} from './constants';
import {issueTitle} from './labels';

export interface DemoDefectsProps {
  demoList: Violation[];
  onLocate: (v: Violation, num: number) => void;
}

/**
 * Intentional violations inside `data-ld-a11y-demo`. Shown for demonstration
 * only — excluded from the tabs, FAB badge, session log, tracker, and fix
 * requests. Click a row to highlight on page.
 */
export function DemoDefects({demoList, onLocate}: DemoDefectsProps): JSX.Element | null {
  if (demoList.length === 0) return null;
  return (
    <div style={panelStyles.demoSection}>
      <div style={panelStyles.demoHeader}>
        Demo defects · excluded from count &amp; fixes ({demoList.length})
      </div>
      <div style={panelStyles.demoList}>
        {demoList.map((v, i) => (
          <button
            key={`demo-${v.rule}-${v.selector}-${i}`}
            type="button"
            style={panelStyles.demoRow}
            onClick={() => onLocate(v, i + 1)}
            // No title attribute — the row's own text content already wins
            // the accessible name computation, so a title would only add a
            // redundant native tooltip duplicating what's already announced.
          >
            <span
              style={{
                ...panelStyles.numberBadge,
                width: 18,
                height: 18,
                fontSize: 10,
                background: v.severity === 'error' ? COLOR_RED : COLOR_AMBER,
                color: v.severity === 'error' ? '#fff' : COLOR_TEXT,
              }}
            >
              {i + 1}
            </span>
            <span style={panelStyles.demoRowTitle}>{issueTitle(v.rule, v.selector)}</span>
            <span style={panelStyles.demoPill}>DEMO</span>
          </button>
        ))}
      </div>
    </div>
  );
}
