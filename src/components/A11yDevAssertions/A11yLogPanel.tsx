import * as React from 'react';
import {COLOR_INK} from './log-panel/constants';
import {panelStyles} from './log-panel/styles';
import {usePanelDrag} from './log-panel/usePanelDrag';
import {useTooltip, PanelTooltip} from './log-panel/PanelTooltip';
import {useViolationActions} from './log-panel/useViolationActions';
import {ResizeHandles, PanelHeader} from './log-panel/PanelChrome';
import {ScopeToggle, ResolvedBanner, EmptyState} from './log-panel/PanelStatus';
import {TabBar, type TabId} from './log-panel/TabBar';
import {ViolationList} from './log-panel/ViolationList';
import {DemoDefects} from './log-panel/DemoDefects';
import {PanelFooter, type ScanHistory} from './log-panel/PanelFooter';
import type {A11yLogPanelProps} from './log-panel/types';

export type {ScanHistory};
export type {A11yLogPanelProps};

/**
 * A11yLogPanel — Stark-inspired violation log panel.
 *
 * Composed from focused modules under `./log-panel/`:
 *   - constants / geometry / styles — presentation primitives
 *   - usePanelDrag — drag-to-move / resize / maximize behavior
 *   - useViolationActions — copy / fix / locate state + handlers
 *   - PanelChrome, PanelStatus, TabBar, ViolationList, DemoDefects, PanelFooter,
 *     PanelTooltip — presentational pieces
 * This file owns scope/tab state and wires the pieces together.
 */
export function A11yLogPanel({
  violations,
  demoViolations,
  sessionViolations,
  onClearSessionLog,
  resolvedCount,
  history,
  onClose,
  onHoverViolation,
  onRequestFix,
  onRequestFixAll,
  onDragStateChange,
  bounds,
}: A11yLogPanelProps): JSX.Element {
  const embedded = bounds != null;
  // "This page" shows live, locatable violations; "Session" shows everything
  // accumulated across navigation/modals (some may no longer be on the page).
  const [viewMode, setViewMode] = React.useState<'page' | 'session'>('page');
  const [activeTab, setActiveTab] = React.useState<TabId>('all');
  const sessionList = sessionViolations ?? [];
  const source = viewMode === 'session' ? sessionList : violations;
  // Demo defects are tied to the current page, so only show them in page view.
  const demoList = viewMode === 'page' ? (demoViolations ?? []) : [];

  const {tooltip, showTooltip, hideTooltip} = useTooltip();
  const {pos, size, isAnimating, isMaximized, dragRef, startDrag, toggleMaximize} =
    usePanelDrag(bounds, onDragStateChange);
  const actions = useViolationActions({onHoverViolation, onRequestFix, onRequestFixAll});

  // ── Focus management ─────────────────────────────────────────
  // On open: remember what was focused (the FAB), then move focus into the
  // dialog so keyboard/screen-reader users land inside it. On close/unmount:
  // restore focus to the trigger so the tab order isn't lost.
  //
  // This is the WAI-ARIA APG "Non-Modal Dialog" pattern, not a contradiction
  // between role="dialog"/aria-modal="false" and moving focus on open: the
  // APG's non-modal dialog example sets initial focus into the dialog and
  // restores it on close exactly like the modal pattern does — the ONLY
  // difference for non-modal is that background content stays operable (no
  // focus trap, no inert backdrop), which this panel also satisfies (no
  // backdrop, Tab can leave the panel, click-outside/Escape both close it).
  // See https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ (non-modal
  // section) for the reference implementation this follows.
  const panelRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const prevFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    return () => {
      if (prevFocused && typeof prevFocused.focus === 'function') prevFocused.focus();
    };
  }, []);

  const errorCount = source.filter((v) => v.severity === 'error').length;
  const warningCount = source.filter((v) => v.severity === 'warning').length;

  // Sort: errors first, then warnings. Filter by active tab.
  const sortedViolations = React.useMemo(() => {
    const sorted = [...source].sort((a, b) => {
      if (a.severity === 'error' && b.severity !== 'error') return -1;
      if (a.severity !== 'error' && b.severity === 'error') return 1;
      return 0;
    });
    if (activeTab === 'all') return sorted;
    return sorted.filter((v) => (activeTab === 'errors' ? v.severity === 'error' : v.severity === 'warning'));
  }, [source, activeTab]);

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      style={{
        ...panelStyles.container,
        // Embedded mode anchors to the framed container; the global scanner
        // keeps the original fixed positioning.
        position: embedded ? 'absolute' : 'fixed',
        top: pos.y,
        left: pos.x,
        width: size.width,
        height: size.height,
        outline: 'none',
        ...(isAnimating ? {transition: 'top 0.25s ease, left 0.25s ease, width 0.25s ease, height 0.25s ease'} : {}),
      }}
      role="dialog"
      aria-labelledby="a11y-panel-title"
      aria-modal="false"
      data-ld-a11y-ignore="true"
      data-ld-a11y-devtool="true"
    >
      {/* Injected styles for pseudo-class interactions */}
      <style>{`
        [data-ld-a11y-card]:hover { border-color: #9ca3af !important; }
        [data-ld-a11y-card][data-ld-a11y-card-selected]:hover { border-color: ${COLOR_INK} !important; background: rgba(255,255,255,0.6) !important; }
        [data-ld-a11y-card]:focus-visible { outline: 2px solid #3b82f6; outline-offset: 2px; }
      `}</style>

      {/* Live region — announces violation count changes to screen readers */}
      <div aria-live="polite" role="status" style={panelStyles.srOnly}>
        {source.length === 0
          ? 'No accessibility issues detected.'
          : `${source.length} accessibility issue${source.length !== 1 ? 's' : ''}: ${errorCount} error${errorCount !== 1 ? 's' : ''}, ${warningCount} warning${warningCount !== 1 ? 's' : ''}.`}
      </div>

      <PanelTooltip tooltip={tooltip} />
      <ResizeHandles onStart={startDrag} />

      <PanelHeader
        isMaximized={isMaximized}
        grabbing={dragRef.current?.edge === 'move'}
        onStartMove={(e) => startDrag(e, 'move')}
        onToggleMaximize={toggleMaximize}
        onClose={onClose}
      />

      <div style={panelStyles.helperText}>Select an issue to locate it on the page and copy a fix prompt.</div>

      <ScopeToggle
        pageCount={violations.length}
        sessionCount={sessionList.length}
        viewMode={viewMode}
        onChange={setViewMode}
        onClearSessionLog={onClearSessionLog}
      />

      <ResolvedBanner count={resolvedCount} />

      {source.length === 0 ? (
        <EmptyState viewMode={viewMode} />
      ) : (
        <>
          <TabBar
            total={source.length}
            errorCount={errorCount}
            warningCount={warningCount}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
          <ViolationList
            sorted={sortedViolations}
            activeTab={activeTab}
            canRequestFix={!!onRequestFix}
            actions={actions}
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />
          <PanelFooter
            history={history}
            fixAllState={actions.fixAllFeedback}
            copiedAll={actions.copiedAll}
            onCopyForAI={() => actions.copyForAI(sortedViolations)}
          />
        </>
      )}

      <DemoDefects demoList={demoList} onLocate={actions.locate} />
    </div>
  );
}
