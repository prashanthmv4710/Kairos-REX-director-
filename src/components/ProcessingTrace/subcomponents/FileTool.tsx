'use client';

import * as React from 'react';

import {cx} from '../../../common/cx';

import {TraceRow} from '../TraceRow';
import type {TraceState} from '../ProcessingTrace';
import './FileTool.css';

export interface ProcessingTraceFileToolProps {
  /** State of this tool call. @default "success" */
  state?: TraceState;
  /** Override the status pill label (e.g. "Done · 240ms"). */
  statusLabel?: React.ReactNode;
  /** Tool / file name shown in the row header (rendered monospace). */
  name: string;
  /**
   * Override the header label with plain (non-monospace) text. When provided,
   * `name` is still available for other uses but the header renders this
   * value without monospace styling — matching the Reasoning summary header.
   */
  label?: React.ReactNode;
  /** Optional leading icon. */
  icon?: React.ReactNode;
  /** Tool output — typically code, JSON, or terminal text. */
  children: React.ReactNode;
  /**
   * Cap the body height (CSS string, e.g. `"240px"`) and enable vertical
   * scrolling for long output. Omit for natural height.
   */
  maxHeight?: string;
  /** Render the body in monospace. @default true */
  mono?: boolean;
  /** Uncontrolled initial open state. @default false */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Callback fired when the card open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** @internal Additional CSS class. */
  UNSAFE_className?: string;
}

/**
 * Tool / file invocation card. Header shows the tool/file name in monospace;
 * the expanded body is a scrollable code block.
 */
export const ProcessingTraceFileTool: React.FunctionComponent<
  ProcessingTraceFileToolProps
> = (props) => {
  const {
    state = 'success',
    statusLabel,
    name,
    label,
    icon,
    children,
    maxHeight,
    mono = true,
    defaultOpen = false,
    open,
    onOpenChange,
    UNSAFE_className,
  } = props;

  return (
    <TraceRow
      state={state}
      statusLabel={statusLabel}
      label={label ?? name}
      mono={label == null}
      icon={icon}
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      UNSAFE_className={cx('ld-processingtrace-filetool', UNSAFE_className)}
    >
      <pre
        className={cx(
          'ld-processingtrace-filetool-body',
          mono && 'ld-processingtrace-filetool-body--mono',
        )}
        style={maxHeight ? {maxHeight, overflowY: 'auto'} : undefined}
      >
        {children}
      </pre>
    </TraceRow>
  );
};

ProcessingTraceFileTool.displayName = 'ProcessingTrace.FileTool';
