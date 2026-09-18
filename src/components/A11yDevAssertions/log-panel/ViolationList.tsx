import * as React from 'react';
import type {Violation} from '../violation-messages';
import {panelStyles} from './styles';
import {ViolationCard} from './ViolationCard';
import type {TabId} from './TabBar';
import type {ViolationActions} from './useViolationActions';
import {violationRowKeys} from '../scan/violation-key';

export interface ViolationListProps {
  sorted: Violation[];
  activeTab: TabId;
  canRequestFix: boolean;
  actions: ViolationActions;
  showTooltip: (e: React.MouseEvent | React.FocusEvent, text: string) => void;
  hideTooltip: () => void;
}

export function ViolationList({
  sorted,
  activeTab,
  canRequestFix,
  actions,
  showTooltip,
  hideTooltip,
}: ViolationListProps): JSX.Element {
  const {
    copiedKey, copiedAll, expandedKey, selectedKey,
    setExpandedKey, setSelectedKey, fixFeedback, fixAllFeedback,
    copyOne, fixOne, locate,
  } = actions;

  // Identity, not position — the list is rebuilt on every scan, so a
  // violation's array index shifts as issues appear/resolve/reorder.
  // violationRowKeys keeps selection/expand/copy state (and the React key)
  // attached to the violation the user actually picked, even across a
  // rescan, and disambiguates the rare case where two distinct nodes share
  // identical rule+selector text (see its docstring in scan/violation-key.ts).
  const rowKeys = React.useMemo(() => violationRowKeys(sorted), [sorted]);

  return (
    <div id="a11y-tabpanel" role="tabpanel" aria-labelledby={`a11y-tab-${activeTab}`} style={panelStyles.list}>
      {sorted.length === 0 ? (
        <div style={panelStyles.emptyTabState}>
          No {activeTab === 'errors' ? 'errors' : activeTab === 'warnings' ? 'warnings' : 'issues'} found.
        </div>
      ) : (
        sorted.map((v, i) => {
          const key = rowKeys[i];
          const fixState = fixFeedback[key];
          // The "Copied…" chip is transient — it appears for a few seconds after
          // a copy (this card OR the footer copy-all), then clears.
          const showPasteChip =
            fixState === 'pending' || fixState === 'sent' || fixState === 'clipboard'
            || fixAllFeedback !== 'idle' || copiedAll;

          return (
            <ViolationCard
              key={key}
              violation={v}
              number={i + 1}
              isExpanded={expandedKey === key}
              isSelected={selectedKey === key}
              isCopied={copiedKey === key}
              fixState={fixState}
              showPasteChip={showPasteChip}
              canRequestFix={canRequestFix}
              onToggleSelect={() => {
                const next = selectedKey === key ? null : key;
                setSelectedKey(next);
                locate(v, next !== null ? i + 1 : null);
              }}
              onToggleExpand={() => {
                const willExpand = expandedKey !== key;
                setExpandedKey(willExpand ? key : null);
                // Expanding also selects + highlights the element so the details
                // and the on-page highlight stay in sync.
                if (willExpand) {
                  setSelectedKey(key);
                  locate(v, i + 1);
                }
              }}
              onCopy={() => copyOne(v, key)}
              onFix={() => fixOne(v, key)}
              showTooltip={showTooltip}
              hideTooltip={hideTooltip}
            />
          );
        })
      )}
    </div>
  );
}
