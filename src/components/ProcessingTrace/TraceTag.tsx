'use client';

import * as React from 'react';

import {cx} from '../../common/cx';
import {Tag, type TagColor} from '../Tag/Tag';

import type {TraceState} from './ProcessingTrace';
import './TraceTag.css';

const STATE_TO_TAG_COLOR: Record<TraceState, TagColor> = {
  processing: 'info',
  success: 'positive',
  failure: 'negative',
};

const STATE_TO_LABEL: Record<TraceState, string> = {
  processing: 'In progress',
  success: 'Done',
  failure: 'Failure',
};

export interface TraceTagProps {
  /** Current state — drives pill color and default label. */
  state: TraceState;
  /** Override the default text shown inside the pill. */
  label?: React.ReactNode;
  /** @internal Additional CSS class. */
  UNSAFE_className?: string;
}

/**
 * Compact status indicator used in `ProcessingTrace` headers. Renders an LD
 * `Tag` (size="small", variant="tertiary") with state-appropriate color.
 */
export const TraceTag: React.FunctionComponent<TraceTagProps> = ({
  state,
  label,
  UNSAFE_className,
}) => {
  return (
    <span className={cx('ld-processingtrace-tag', UNSAFE_className)}>
      <Tag
        color={STATE_TO_TAG_COLOR[state]}
        size="small"
        variant="tertiary"
      >
        {label ?? STATE_TO_LABEL[state]}
      </Tag>
    </span>
  );
};

TraceTag.displayName = 'TraceTag';
