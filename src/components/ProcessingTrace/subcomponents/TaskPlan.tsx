'use client';

import * as React from 'react';

import {cx} from '../../../common/cx';
import {Checkbox} from '../../Checkbox/Checkbox';

import {TraceRow} from '../TraceRow';
import type {TraceState} from '../ProcessingTrace';
import './TaskPlan.css';

/* ============================================================
   ProcessingTraceTask — single task row
   ============================================================ */

export interface ProcessingTraceTaskProps {
  /** Visible label for the task. */
  label: React.ReactNode;
  /** Whether the task is checked off. @default false */
  checked?: boolean;
  /** Fires when the user toggles the checkbox. */
  onChange?: (checked: boolean) => void;
  /** Disable the checkbox. @default false */
  disabled?: boolean;
  /** @internal Additional CSS class. */
  UNSAFE_className?: string;
}

/** Single task inside a `TaskPlan`. */
export const ProcessingTraceTask: React.FunctionComponent<
  ProcessingTraceTaskProps
> = (props) => {
  const {label, checked = false, onChange, disabled, UNSAFE_className} = props;

  return (
    <li className={cx('ld-processingtrace-task', UNSAFE_className)}>
      <Checkbox
        size="small"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        label={label}
      />
    </li>
  );
};

ProcessingTraceTask.displayName = 'ProcessingTrace.Task';

/* ============================================================
   ProcessingTraceTaskPlan — task list card
   ============================================================ */

export interface ProcessingTraceTaskPlanProps {
  /** State of the plan. @default "processing" */
  state?: TraceState;
  /** Override the status pill label. */
  statusLabel?: React.ReactNode;
  /**
   * Override the auto-generated label. When omitted, the label is computed as
   * `Task plan · ${childCount} steps`.
   */
  label?: React.ReactNode;
  /** Optional leading icon. */
  icon?: React.ReactNode;
  /** One or more `<ProcessingTrace.Task>` children. */
  children: React.ReactNode;
  /** Uncontrolled initial open state. @default true */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Callback fired when the card open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** @internal Additional CSS class. */
  UNSAFE_className?: string;
}

/**
 * Task plan card. Renders an auto-numbered header ("Task plan · N steps") and
 * a vertical list of `<ProcessingTrace.Task>` items backed by the LD
 * `Checkbox` primitive.
 */
export const ProcessingTraceTaskPlan: React.FunctionComponent<
  ProcessingTraceTaskPlanProps
> = (props) => {
  const {
    state = 'processing',
    statusLabel,
    label,
    icon,
    children,
    defaultOpen = true,
    open,
    onOpenChange,
    UNSAFE_className,
  } = props;

  const childArray = React.Children.toArray(children);
  const stepCount = childArray.length;
  const resolvedLabel = label ?? `Task plan · ${stepCount} step${stepCount === 1 ? '' : 's'}`;

  return (
    <TraceRow
      state={state}
      statusLabel={statusLabel}
      label={resolvedLabel}
      icon={icon}
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      UNSAFE_className={cx('ld-processingtrace-taskplan', UNSAFE_className)}
    >
      <ul className="ld-processingtrace-taskplan-list">{children}</ul>
    </TraceRow>
  );
};

ProcessingTraceTaskPlan.displayName = 'ProcessingTrace.TaskPlan';
