'use client';

import * as React from 'react';

import {cx} from '../../../common/cx';
import {
  CheckCircleFillIcon,
  ExclamationCircleFillIcon,
} from '../../Icons/Icons';
import {Spinner} from '../../Spinner/Spinner';
import {Body, Caption} from '../../Text/Text';

import type {TraceState} from '../ProcessingTrace';
import './Timeline.css';

/* ============================================================
   ProcessingTraceStep — single timeline step
   ============================================================ */

export interface ProcessingTraceStepProps {
  /** Step state — drives the spine glyph. */
  state: TraceState;
  /** Step label. */
  label: React.ReactNode;
  /** Optional secondary text (timestamp, duration, hint). */
  meta?: React.ReactNode;
  /** Optional body content (e.g. a snippet of what the step produced). */
  children?: React.ReactNode;
  /** Optional trailing slot aligned right of the label (e.g. a status pill). */
  trailing?: React.ReactNode;
  /** @internal Additional CSS class. */
  UNSAFE_className?: string;
}

const STATE_GLYPH: Record<TraceState, React.ReactNode> = {
  // 16px via the "small" size token on each (Spinner is resized to match in CSS
  // — its smallest built-in size is 24px and it doesn't accept a style/className
  // override).
  processing: <Spinner size="small" color="brand" variant="generic" />,
  success: <CheckCircleFillIcon size="small" />,
  failure: <ExclamationCircleFillIcon />,
};

export const ProcessingTraceStep: React.FunctionComponent<
  ProcessingTraceStepProps
> = (props) => {
  const {state, label, meta, children, trailing, UNSAFE_className} = props;

  return (
    <li
      className={cx(
        'ld-processingtrace-step',
        `ld-processingtrace-step--${state}`,
        UNSAFE_className,
      )}
    >
      <span className="ld-processingtrace-step-glyph" aria-hidden="true">
        {STATE_GLYPH[state]}
      </span>
      <span className="ld-processingtrace-step-content">
        <span className="ld-processingtrace-step-header">
          <Body size="small" weight="default">
            {label}
          </Body>
          {trailing != null ? (
            <span className="ld-processingtrace-step-trailing">{trailing}</span>
          ) : null}
        </span>
        {meta != null ? (
          <Caption color="subtle">{meta}</Caption>
        ) : null}
        {children != null ? (
          <div className="ld-processingtrace-step-children">{children}</div>
        ) : null}
      </span>
    </li>
  );
};

ProcessingTraceStep.displayName = 'ProcessingTrace.Step';

/* ============================================================
   ProcessingTraceTimeline — vertical timeline card
   ============================================================ */

export interface ProcessingTraceTimelineProps {
  /** One or more `<ProcessingTrace.Step>` children. */
  children: React.ReactNode;
  /** @internal Additional CSS class. */
  UNSAFE_className?: string;
}

/**
 * Vertical timeline. Each child `<ProcessingTrace.Step>` renders its own state
 * glyph (Spinner / CheckCircle / ExclamationCircleFill) along a shared vertical
 * spine. Rendered flat — no surrounding card, border, or title — so it reads as
 * part of the trace body rather than a nested content card.
 */
export const ProcessingTraceTimeline: React.FunctionComponent<
  ProcessingTraceTimelineProps
> = (props) => {
  const {children, UNSAFE_className} = props;

  return (
    <div className={cx('ld-processingtrace-timeline', UNSAFE_className)}>
      <ol className="ld-processingtrace-timeline-list">{children}</ol>
    </div>
  );
};

ProcessingTraceTimeline.displayName = 'ProcessingTrace.Timeline';
