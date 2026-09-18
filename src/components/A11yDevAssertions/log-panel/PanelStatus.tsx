import * as React from 'react';
import {panelStyles} from './styles';

type ViewMode = 'page' | 'session';

/** Toggle between "this page" violations and the accumulated session log. */
export function ScopeToggle({
  pageCount,
  sessionCount,
  viewMode,
  onChange,
  onClearSessionLog,
}: {
  pageCount: number;
  sessionCount: number;
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
  onClearSessionLog?: () => void;
}): JSX.Element | null {
  if (sessionCount === 0) return null;
  return (
    <div style={panelStyles.viewToggle}>
      <div role="group" aria-label="Violation scope" style={{display: 'flex', gap: 6}}>
        <button
          type="button"
          aria-pressed={viewMode === 'page'}
          onClick={() => onChange('page')}
          style={{...panelStyles.viewToggleBtn, ...(viewMode === 'page' ? panelStyles.viewToggleBtnActive : {})}}
        >
          This page {pageCount > 0 ? `(${pageCount})` : ''}
        </button>
        <button
          type="button"
          aria-pressed={viewMode === 'session'}
          onClick={() => onChange('session')}
          style={{...panelStyles.viewToggleBtn, ...(viewMode === 'session' ? panelStyles.viewToggleBtnActive : {})}}
        >
          Session ({sessionCount})
        </button>
      </div>
      {viewMode === 'session' && onClearSessionLog && (
        <button type="button" onClick={onClearSessionLog} style={panelStyles.clearLogBtn}>Clear</button>
      )}
    </div>
  );
}

/** Green banner shown after violations are resolved. */
export function ResolvedBanner({count}: {count: number}): JSX.Element | null {
  if (count <= 0) return null;
  return (
    <div style={panelStyles.resolvedBanner}>
      <span style={panelStyles.resolvedIcon}>✓</span>
      {count} violation{count !== 1 ? 's' : ''} resolved
    </div>
  );
}

/** Clean state — no violations in the current scope. */
export function EmptyState({viewMode}: {viewMode: ViewMode}): JSX.Element {
  return (
    <div style={panelStyles.emptyState}>
      <div style={panelStyles.emptyCheckCircle}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={panelStyles.emptyTitle}>Looking good!</div>
      <div style={panelStyles.emptySubtitle}>
        {viewMode === 'session' ? 'Nothing logged this session.' : 'No issues detected.'}
      </div>
    </div>
  );
}
