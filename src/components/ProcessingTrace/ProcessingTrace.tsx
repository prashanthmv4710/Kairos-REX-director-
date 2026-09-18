'use client';
// @refresh reset

/**
 * @module ProcessingTrace
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
 * For prop API + usage notes, read `ProcessingTrace.md` in this folder
 * or run `npm run ld-kit -- show ProcessingTrace`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {ChevronRightIcon} from '../Icons/Icons';
import {Body} from '../Text/Text';
import {VisuallyHidden} from '../VisuallyHidden';

import {TraceTag} from './TraceTag';
import {TraceRow} from './TraceRow';
import {ProcessingTraceReasoning} from './subcomponents/Reasoning';
import {
  ProcessingTraceTaskPlan,
  ProcessingTraceTask,
} from './subcomponents/TaskPlan';
import {
  ProcessingTraceSources,
  ProcessingTraceSource,
} from './subcomponents/Sources';
import {ProcessingTraceFileTool} from './subcomponents/FileTool';
import {
  ProcessingTraceTimeline,
  ProcessingTraceStep,
} from './subcomponents/Timeline';
import {
  ProcessingTraceActivityList,
  ProcessingTraceActivityItem,
} from './subcomponents/ActivityList';
import {ProcessingTraceApproval} from './subcomponents/Approval';
import {
  ProcessingTraceLanes,
  ProcessingTraceLane,
} from './subcomponents/Lanes';

import './ProcessingTrace.css';

/* ============================================================
   State vocabulary
   ============================================================ */

export type TraceState = 'processing' | 'success' | 'failure';

export const DEFAULT_STATE_LABELS: Record<TraceState, string> = {
  processing: 'Processing',
  success: 'Success',
  failure: 'Failure',
};

/**
 * Default headline shown above the dynamic step text while processing, when no
 * `statusLabel` is supplied.
 */
export const PROCESSING_HEADLINE = 'Working on it';

/* ============================================================
   ProcessingTrace — root container

   A processing trace is a system-generated, read-only status element that
   explains what the agent is doing while producing a response. It is scoped to
   the agent chat timeline and must be visually + programmatically paired with a
   specific agent response — compose it via `AgentResponse`'s `trace` slot. It is
   NOT a standalone content/prompt/recommendation card and must not be rendered in
   inboxes, feeds, side panels, or history views.

   Acceptance-criteria conformance:
   | # | Acceptance criterion                                   | How it is met                                                         |
   |---|--------------------------------------------------------|-----------------------------------------------------------------------|
   | 1 | Only inside the agent chat timeline                    | Compose via `AgentResponse.trace`; demos render it there only.        |
   | 2 | Always tied to a specific agent response               | `AgentResponse` renders the trace in its content grid + aria link.    |
   | 3 | No standalone card elsewhere                           | Flat, border-only (not a card); docs steer to `AgentResponse.trace`.  |
   | 4 | Absent from inboxes/feeds/side panels/history          | Enforced by API + docs (a library cannot block misuse at runtime).    |
   | 5 | Read-only, not user-editable                           | Body content is display-only.                                         |
   | 6 | Not interactive except approved controls               | Only expand/collapse, show-more, and `Approval` (a sanctioned control).|
   | 7 | Interaction limited to status actions                  | Header toggle + Sources disclosure; keyboard accessible.             |
   | 8 | Collapse/resolve when the reply completes              | Uncontrolled traces auto-collapse on `processing → success/failure`.  |
   | 9 | Must not replace/duplicate the response content        | Rendered above the response body in its own region.                   |
   |10 | Not mistaken for a content card                        | No elevation/shadow; hairline border + timeline spacing.             |
   |11 | System styling + tokenized spacing, not card tokens    | Uses `--ld-*` separator/space tokens, not card layout tokens.        |
   |12 | Programmatic association + keyboard access             | `aria-expanded`/`aria-controls`; `AgentResponse` adds `aria-details`. |
   ============================================================ */

export interface ProcessingTraceProps {
  /** Overall state of the run. Drives the leading status pill. */
  state: TraceState;
  /**
   * Main header label — the human-readable summary of what happened
   * (e.g. "Worked for 14s · 3 tools · 9 sources").
   */
  label: React.ReactNode;
  /**
   * Override the auto-generated status text inside the pill
   * (e.g. "Worked 14s", "Researched 2m"). Falls back to the state name.
   */
  statusLabel?: React.ReactNode;
  /**
   * Body content — compose with `<ProcessingTrace.Row>` or any of the
   * registered subcomponents (Reasoning, TaskPlan, Sources, FileTool,
   * Timeline, ActivityList, Approval, Lanes).
   */
  children?: React.ReactNode;
  /**
   * Uncontrolled initial open state. @default false
   *
   * Use `false` for a trace that collapses to a one-line summary (a compact,
   * step-by-step run) and `true` for a trace that starts expanded (a longer,
   * multi-step run the user watches progress on). In uncontrolled mode the trace
   * auto-collapses when `state` resolves from `processing` to `success`/`failure`.
   */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Callback fired when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Optional determinate progress, 0–1. When provided, a thin progress bar is
   * rendered at the top of the body. Omit to hide the bar entirely.
   */
  progress?: number;
  /**
   * Visual size of the trace.
   * - `large` (default): full trace — header + collapsible body + children.
   * - `small`: a single-line status readout showing only the header's dynamic
   *   text. No expandable body, progress bar, children, or toggle affordance.
   * @default 'large'
   */
  size?: 'small' | 'large';
  /**
   * Optional decorative avatar rendered before the status pill in the header
   * (e.g. the agent's brand mark). Rendered `aria-hidden`.
   */
  avatar?: React.ReactNode;
  /** Hide the container's hairline border for a fully inline appearance. @default false */
  hideBorder?: boolean;
  /** Optional accessible label for the toggle button. */
  a11yLabel?: string;
  /** @internal Additional CSS class. */
  UNSAFE_className?: string;
}

const ProcessingTraceRoot = React.forwardRef<HTMLDivElement, ProcessingTraceProps>(
  (props, ref) => {
    const {
      state,
      label,
      statusLabel,
      children,
      defaultOpen = false,
      open: controlledOpen,
      onOpenChange,
      progress,
      size = 'large',
      avatar,
      hideBorder = false,
      a11yLabel,
      UNSAFE_className,
    } = props;

    const isControlled = controlledOpen !== undefined;
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const isOpen = isControlled ? (controlledOpen as boolean) : uncontrolledOpen;
    const bodyId = React.useId();
    const progressId = React.useId();

    // Lifecycle (AC 8): collapse an uncontrolled, expanded trace to its summary
    // header once the run resolves from `processing` to a terminal state.
    const prevState = React.useRef(state);
    React.useEffect(() => {
      const wasProcessing = prevState.current === 'processing';
      prevState.current = state;
      if (isControlled) return;
      if (wasProcessing && state !== 'processing') {
        setUncontrolledOpen(false);
        onOpenChange?.(false);
      }
    }, [state, isControlled, onOpenChange]);

    const hasProgress = progress != null;
    const clampedProgress = hasProgress
      ? Math.max(0, Math.min(1, progress as number))
      : undefined;

    // Processing renders a two-line, pill-less header: a fixed headline over the
    // dynamic step text (`label`). The button keeps a stable accessible name so a
    // churning `label` doesn't re-announce the toggle on every update.
    const isProcessing = state === 'processing';
    const isSmall = size === 'small';
    const headline = statusLabel ?? PROCESSING_HEADLINE;
    const buttonA11yLabel = isProcessing
      ? a11yLabel ?? (typeof headline === 'string' ? headline : PROCESSING_HEADLINE)
      : a11yLabel;

    function handleToggle() {
      if (isControlled) {
        onOpenChange?.(!isOpen);
      } else {
        setUncontrolledOpen((prev) => {
          const next = !prev;
          onOpenChange?.(next);
          return next;
        });
      }
    }

    // Small: a single-line status readout. Only the dynamic text is shown — no
    // toggle, chevron, pill, progress bar, or body.
    if (isSmall) {
      return (
        <div
          ref={ref}
          className={cx(
            'ld-processingtrace',
            'ld-processingtrace--small',
            hideBorder && 'ld-processingtrace--noborder',
            UNSAFE_className,
          )}
        >
          <div className="ld-processingtrace-header ld-processingtrace-header--small">
            {avatar != null ? (
              <span className="ld-processingtrace-avatar" aria-hidden="true">
                {avatar}
              </span>
            ) : null}
            <Body
              as="span"
              size="small"
              UNSAFE_className="ld-processingtrace-status-step"
            >
              {label}
            </Body>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cx(
          'ld-processingtrace',
          isOpen && 'ld-processingtrace--open',
          hideBorder && 'ld-processingtrace--noborder',
          UNSAFE_className,
        )}
      >
        <button
          type="button"
          className="ld-processingtrace-header"
          aria-expanded={isOpen}
          aria-controls={bodyId}
          aria-label={buttonA11yLabel}
          onClick={handleToggle}
        >
          {avatar != null ? (
            <span className="ld-processingtrace-avatar" aria-hidden="true">
              {avatar}
            </span>
          ) : null}
          {isProcessing ? (
            /* Processing: two plain text lines (headline + dynamic step), no pill.
               Hidden from SRs — the stable button aria-label names the control and
               the live region below announces step changes. */
            <span
              className="ld-processingtrace-header-stack ld-processingtrace-header-stack--processing"
              aria-hidden="true"
            >
              <Body
                as="span"
                size="medium"
                weight="default"
                color="subtle"
                UNSAFE_className="ld-processingtrace-status-headline"
              >
                {headline}
              </Body>
              <Body
                as="span"
                size="small"
                weight="default"
                UNSAFE_className="ld-processingtrace-status-step"
              >
                {label}
              </Body>
            </span>
          ) : (
            <span className="ld-processingtrace-header-stack">
              <TraceTag state={state} label={statusLabel} />
              <Body
                as="span"
                size="medium"
                weight="default"
                UNSAFE_className="ld-processingtrace-header-title"
              >
                {label}
              </Body>
            </span>
          )}
          <ChevronRightIcon
            className="ld-processingtrace-chevron"
            aria-hidden="true"
          />
        </button>
        {isProcessing ? (
          <VisuallyHidden aria-live="polite">{label}</VisuallyHidden>
        ) : null}
        {isOpen ? (
          <div id={bodyId} className="ld-processingtrace-body">
            {hasProgress ? (
              <div
                className="ld-processingtrace-progress"
                role="progressbar"
                aria-label={
                  typeof label === 'string' ? label : 'Processing progress'
                }
                aria-valuemin={0}
                aria-valuemax={1}
                aria-valuenow={clampedProgress}
                id={progressId}
              >
                <span
                  className="ld-processingtrace-progress-fill"
                  style={{width: `${Math.round((clampedProgress as number) * 100)}%`}}
                />
              </div>
            ) : null}
            {children}
          </div>
        ) : null}
      </div>
    );
  },
);

ProcessingTraceRoot.displayName = 'ProcessingTrace';

/* ============================================================
   Composed export
   ============================================================ */

export const ProcessingTrace = Object.assign(ProcessingTraceRoot, {
  /** Generic outlined-card step used by every subcomponent. */
  Row: TraceRow,
  /** Reasoning card — collapsible thought block with optional "Show more". */
  Reasoning: ProcessingTraceReasoning,
  /** Task plan card — auto-numbers steps and renders LD `Checkbox` children. */
  TaskPlan: ProcessingTraceTaskPlan,
  /** Individual task inside a `TaskPlan`. */
  Task: ProcessingTraceTask,
  /** Sources card — search results list with optional query header. */
  Sources: ProcessingTraceSources,
  /** Individual source row inside a `Sources` card. */
  Source: ProcessingTraceSource,
  /** Tool call card — monospace tool name with code/text body. */
  FileTool: ProcessingTraceFileTool,
  /** Timeline card — vertical spine + state-icon steps. */
  Timeline: ProcessingTraceTimeline,
  /** Individual step inside a `Timeline`. */
  Step: ProcessingTraceStep,
  /** Activity list card — basic ordered task list. */
  ActivityList: ProcessingTraceActivityList,
  /** Individual activity inside an `ActivityList`. */
  ActivityItem: ProcessingTraceActivityItem,
  /** Approval card — Allow / Skip with a split-button menu. */
  Approval: ProcessingTraceApproval,
  /** Research lanes card — 2-col grid with per-lane progress. */
  Lanes: ProcessingTraceLanes,
  /** Individual lane inside a `Lanes` card. */
  Lane: ProcessingTraceLane,
});

/* Re-export sibling primitives for direct consumer use. */
export {TraceTag, type TraceTagProps} from './TraceTag';
export {TraceRow, type TraceRowProps} from './TraceRow';
