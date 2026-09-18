import * as React from 'react';
import type {Violation} from '../violation-messages';
import type {FixStatus} from '../useA11yScan';
import {formatSource} from '../fiber-source';
import {panelStyles} from './styles';
import {COLOR_RED, COLOR_AMBER, COLOR_TEXT, COLOR_GREEN} from './constants';
import {issueTitle, issueSubtext} from './labels';

export interface ViolationCardProps {
  violation: Violation;
  /** 1-based position within the current (filtered) list. */
  number: number;
  isExpanded: boolean;
  isSelected: boolean;
  isCopied: boolean;
  fixState: FixStatus | undefined;
  showPasteChip: boolean;
  canRequestFix: boolean;
  onToggleSelect: () => void;
  onToggleExpand: () => void;
  onCopy: () => void;
  onFix: () => void;
  showTooltip: (e: React.MouseEvent | React.FocusEvent, text: string) => void;
  hideTooltip: () => void;
}

export function ViolationCard({
  violation: v,
  number,
  isExpanded,
  isSelected,
  isCopied,
  fixState,
  showPasteChip,
  canRequestFix,
  onToggleSelect,
  onToggleExpand,
  onCopy,
  onFix,
  showTooltip,
  hideTooltip,
}: ViolationCardProps): JSX.Element {
  const severityColor = v.severity === 'error' ? COLOR_RED : COLOR_AMBER;
  const badgeTextColor = v.severity === 'error' ? '#fff' : COLOR_TEXT;
  const title = issueTitle(v.rule, v.selector);
  const isPending = fixState === 'pending';

  return (
    <div
      style={{...panelStyles.card, ...(isSelected ? panelStyles.cardSelected : {})}}
      data-ld-a11y-card
      {...(isSelected ? {'data-ld-a11y-card-selected': ''} : {})}
    >
      {/*
        Stretched "select" button — makes the WHOLE card a click target. It's
        absolutely positioned to cover the card and sits BEHIND the content
        (z-index 0). The action buttons live in the content layer above it as
        siblings (never nested inside this button), so there's no
        nested-interactive. Non-interactive content uses pointerEvents:none so
        clicks fall through to this button.
      */}
      <button
        type="button"
        style={panelStyles.cardSelectOverlay}
        aria-pressed={isSelected}
        aria-label={`Issue ${number}: ${title}. ${isSelected ? 'Deselect' : 'Highlight on page'}.`}
        onClick={onToggleSelect}
      />

      {/* Content layer — above the overlay; non-interactive parts pass clicks
          through, interactive parts re-enable them. */}
      <div style={panelStyles.cardContent}>
        <div style={panelStyles.cardHeader}>
          <div style={panelStyles.cardHeaderLeft}>
            <span style={{...panelStyles.numberBadge, background: severityColor, color: badgeTextColor}}>
              {number}
            </span>
            <span style={panelStyles.elementType}>{title}</span>
            {showPasteChip && (
              <span style={panelStyles.pendingChip} aria-live="polite">
                Copied…
              </span>
            )}
          </div>
          <div style={panelStyles.violationActions}>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onCopy(); }}
              onMouseEnter={(e) => showTooltip(e, 'Copy fix prompt')}
              onMouseLeave={hideTooltip}
              onFocus={(e) => showTooltip(e, 'Copy fix prompt')}
              onBlur={hideTooltip}
              style={{...panelStyles.iconButton, ...(isCopied ? {color: COLOR_GREEN, gap: 4, width: 'auto'} : {})}}
              title="Copy fix prompt"
              aria-label="Copy fix prompt"
            >
              {isCopied ? (
                <>
                  <i className="ld ld-Check" aria-hidden="true" style={{fontSize: 14}} />
                  <span style={{fontSize: 11, fontWeight: 600}}>Copied</span>
                </>
              ) : (
                <i className="ld ld-Copy" aria-hidden="true" style={{fontSize: 16}} />
              )}
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
              onMouseEnter={(e) => showTooltip(e, isExpanded ? 'Hide details' : 'Show details')}
              onMouseLeave={hideTooltip}
              onFocus={(e) => showTooltip(e, isExpanded ? 'Hide details' : 'Show details')}
              onBlur={hideTooltip}
              style={panelStyles.iconButton}
              title={isExpanded ? 'Hide details' : 'Show details'}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Hide details' : 'Show details'}
            >
              <i className="ld ld-ChevronDown" aria-hidden="true" style={{fontSize: 16, transition: 'transform 0.15s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'}} />
            </button>
          </div>
        </div>

        {/* Simplified description — clicks pass through to select. */}
        <div style={panelStyles.cardMessage}>{issueSubtext(v.simplified)}</div>

        {/* Expanded detail */}
        {isExpanded && (
          <div style={panelStyles.technicalDetail}>
            <div style={panelStyles.detailLabel}>Fix Prompt:</div>
            <div style={panelStyles.technicalMessage}>{v.technical}</div>
            <div style={panelStyles.fixSuggestion}>{v.fix}</div>
            {v.source ? (
              <div style={panelStyles.sourceDisplay}>
                <i className="ld ld-Code" aria-hidden="true" style={{fontSize: 12, marginRight: 4}} />
                {formatSource(v.source)}
              </div>
            ) : (
              <div style={panelStyles.selectorDisplay}>{v.selector}</div>
            )}
            {canRequestFix && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onFix(); }}
                disabled={isPending}
                style={{
                  ...panelStyles.fixButton,
                  ...(isPending ? panelStyles.fixButtonPending : {}),
                  ...((fixState === 'sent' || fixState === 'clipboard') ? panelStyles.fixButtonSent : {}),
                }}
              >
                {isPending ? 'Copying…'
                  : (fixState === 'sent' || fixState === 'clipboard') ? 'Copied — paste to AI ✓'
                  : 'Copy prompt → paste to AI'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
