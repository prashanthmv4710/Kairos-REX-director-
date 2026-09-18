'use client';

import * as React from 'react';

import {cx} from '../../../common/cx';
import {Body, Caption} from '../../Text/Text';

import {TraceTag} from '../TraceTag';
import type {TraceState} from '../ProcessingTrace';
import './Lanes.css';

/* ============================================================
   ProcessingTraceLane — single lane card
   ============================================================ */

export interface ProcessingTraceLaneProps {
  /** Lane state — controls progress fill color and the optional pill. */
  state: TraceState;
  /** Lane title. */
  title: React.ReactNode;
  /** Optional secondary text. */
  description?: React.ReactNode;
  /**
   * Progress fill, 0–1. When omitted, processing lanes render a full-width
   * indeterminate fill while success/failure render at 100%.
   */
  progress?: number;
  /**
   * When `true` and `state === 'processing'`, render the bar in an indeterminate
   * animation. @default true (for processing without an explicit progress value)
   */
  showPill?: boolean;
  /** Override the status pill label. */
  statusLabel?: React.ReactNode;
  /** Optional body content under the progress bar. */
  children?: React.ReactNode;
  /** @internal Additional CSS class. */
  UNSAFE_className?: string;
}

export const ProcessingTraceLane: React.FunctionComponent<
  ProcessingTraceLaneProps
> = (props) => {
  const {
    state,
    title,
    description,
    progress,
    showPill = true,
    statusLabel,
    children,
    UNSAFE_className,
  } = props;

  // Stable id so the progress bar can borrow the lane title as its accessible
  // name (title is a ReactNode, so aria-labelledby is more robust than aria-label).
  const titleId = React.useId();

  const resolvedProgress =
    progress != null
      ? Math.max(0, Math.min(1, progress))
      : state === 'processing'
      ? undefined
      : 1;

  const isIndeterminate = state === 'processing' && resolvedProgress == null;

  return (
    <div
      className={cx(
        'ld-processingtrace-lane',
        `ld-processingtrace-lane--${state}`,
        UNSAFE_className,
      )}
    >
      <div className="ld-processingtrace-lane-header">
        <div className="ld-processingtrace-lane-titles">
          <span id={titleId} style={{display: 'contents'}}>
            <Body size="medium" weight="alt">
              {title}
            </Body>
          </span>
          {description != null ? (
            <Caption color="subtle">{description}</Caption>
          ) : null}
        </div>
        {showPill ? <TraceTag state={state} label={statusLabel} /> : null}
      </div>
      <div
        className={cx(
          'ld-processingtrace-lane-bar',
          isIndeterminate && 'ld-processingtrace-lane-bar--indeterminate',
        )}
        role="progressbar"
        aria-labelledby={titleId}
        aria-valuemin={0}
        aria-valuemax={1}
        aria-valuenow={
          isIndeterminate || resolvedProgress == null ? undefined : resolvedProgress
        }
      >
        <span
          className="ld-processingtrace-lane-bar-fill"
          style={
            !isIndeterminate && resolvedProgress != null
              ? {width: `${Math.round(resolvedProgress * 100)}%`}
              : undefined
          }
        />
      </div>
      {children != null ? (
        <div className="ld-processingtrace-lane-body">{children}</div>
      ) : null}
    </div>
  );
};

ProcessingTraceLane.displayName = 'ProcessingTrace.Lane';

/* ============================================================
   ProcessingTraceLanes — multi-lane grid container
   ============================================================ */

export interface ProcessingTraceLanesProps {
  /** One or more `<ProcessingTrace.Lane>` children. */
  children: React.ReactNode;
  /**
   * Number of lane columns to render. @default 2 — collapses to a single column
   * at narrow widths.
   */
  columns?: 1 | 2 | 3;
  /** @internal Additional CSS class. */
  UNSAFE_className?: string;
}

/**
 * Lanes container — a responsive grid wrapper for parallel `<ProcessingTrace.Lane>`
 * cards. Defaults to 2 columns, collapsing to 1 column on narrow viewports.
 */
export const ProcessingTraceLanes: React.FunctionComponent<
  ProcessingTraceLanesProps
> = (props) => {
  const {children, columns = 2, UNSAFE_className} = props;

  return (
    <div
      className={cx(
        'ld-processingtrace-lanes',
        `ld-processingtrace-lanes--cols-${columns}`,
        UNSAFE_className,
      )}
    >
      {children}
    </div>
  );
};

ProcessingTraceLanes.displayName = 'ProcessingTrace.Lanes';
