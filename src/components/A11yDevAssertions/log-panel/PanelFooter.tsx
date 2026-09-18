import * as React from 'react';
import type {FixStatus} from '../useA11yScan';
import {panelStyles} from './styles';

export interface ScanHistory {
  pagesScanned: number;
  totalIssues: number;
}

export interface PanelFooterProps {
  history?: ScanHistory;
  fixAllState: FixStatus;
  copiedAll: boolean;
  onCopyForAI: () => void;
}

export function PanelFooter({history, fixAllState, copiedAll, onCopyForAI}: PanelFooterProps): JSX.Element {
  const done = fixAllState === 'sent' || fixAllState === 'clipboard' || copiedAll;
  return (
    <div style={panelStyles.footerColumn}>
      {history && history.pagesScanned > 0 && (
        <div style={panelStyles.historyLine}>
          {history.pagesScanned} page{history.pagesScanned !== 1 ? 's' : ''} scanned
          {' · '}
          {history.totalIssues} total issue{history.totalIssues !== 1 ? 's' : ''}
        </div>
      )}
      <div style={panelStyles.footerActions}>
        {/* One generalized action: copy the prompt to the clipboard (for any AI
            agent) AND drop the agent-agnostic fix-request file that
            hooks/obligations can pick up. */}
        <button
          type="button"
          onClick={onCopyForAI}
          disabled={fixAllState === 'pending'}
          style={{
            ...panelStyles.copyAllButton,
            ...(fixAllState === 'pending' ? panelStyles.fixButtonPending : {}),
            ...(done ? panelStyles.fixButtonSent : {}),
          }}
        >
          {fixAllState === 'pending' ? 'Copying all…'
            : done ? 'Copied all — paste to AI ✓'
            : 'Copy prompt → paste to AI'}
        </button>
      </div>
    </div>
  );
}
