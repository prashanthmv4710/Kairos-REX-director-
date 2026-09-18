'use client';

import * as React from 'react';

import {cx} from '../../common/cx';
import {ChevronRightIcon} from '../Icons/Icons';
import {Body} from '../Text/Text';

import {TraceTag} from './TraceTag';
import type {TraceState} from './ProcessingTrace';
import './TraceRow.css';

export interface TraceRowProps {
  /** State of this step. When omitted, no status pill is rendered. */
  state?: TraceState;
  /** Override the status pill label (e.g. "Done · 0.4s"). */
  statusLabel?: React.ReactNode;
  /** Row header label — the step name or tool name. */
  label: React.ReactNode;
  /** Render `label` in monospace (for tool names, file paths). @default false */
  mono?: boolean;
  /** Optional leading icon in the row header (sits next to the label). */
  icon?: React.ReactNode;
  /** Body content shown when the row is expanded. */
  children?: React.ReactNode;
  /** Uncontrolled initial open state. @default false */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Callback fired when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /**
   * When `false`, the row is rendered as a static (non-interactive) card:
   * no chevron, the body is always visible, and the header is not a button.
   * @default true
   */
  collapsible?: boolean;
  /** @internal Additional CSS class. */
  UNSAFE_className?: string;
}

/**
 * The generic step shell used by every `ProcessingTrace` subcomponent. An
 * outlined card with an interactive header (the only click target) and a
 * non-interactive body — children inside the body can be interactive on their
 * own. Consumers wanting custom step rows can use it directly as
 * `<ProcessingTrace.Row>`.
 */
export const TraceRow = React.forwardRef<HTMLDivElement, TraceRowProps>(
  (props, ref) => {
    const {
      state,
      statusLabel,
      label,
      mono = false,
      icon,
      children,
      defaultOpen = false,
      open: controlledOpen,
      onOpenChange,
      collapsible = true,
      UNSAFE_className,
    } = props;

    const isControlled = controlledOpen !== undefined;
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const isOpen = collapsible
      ? (isControlled ? (controlledOpen as boolean) : uncontrolledOpen)
      : true;
    const bodyId = React.useId();

    function handleToggle() {
      if (!collapsible) return;
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

    const headerContent = (
      <span className="ld-processingtrace-row-header-stack">
        {state != null ? (
          <TraceTag state={state} label={statusLabel} />
        ) : null}
        <span className="ld-processingtrace-row-header-label-row">
          {icon ? (
            <span
              className="ld-processingtrace-row-icon"
              aria-hidden="true"
            >
              {icon}
            </span>
          ) : null}
          <Body
            as="span"
            size="medium"
            weight="default"
            UNSAFE_className="ld-processingtrace-row-title"
          >
            {label}
          </Body>
        </span>
      </span>
    );

    return (
      <div
        ref={ref}
        className={cx(
          'ld-processingtrace-row',
          mono && 'ld-processingtrace-row--mono',
          isOpen && 'ld-processingtrace-row--open',
          !collapsible && 'ld-processingtrace-row--static',
          UNSAFE_className,
        )}
      >
        {collapsible ? (
          <button
            type="button"
            className="ld-processingtrace-row-header"
            aria-expanded={isOpen}
            aria-controls={bodyId}
            onClick={handleToggle}
          >
            {headerContent}
            <ChevronRightIcon
              className="ld-processingtrace-row-chevron"
              aria-hidden="true"
            />
          </button>
        ) : (
          <div className="ld-processingtrace-row-header">
            {headerContent}
          </div>
        )}
        {isOpen ? (
          <div id={bodyId} className="ld-processingtrace-row-body">
            {children}
          </div>
        ) : null}
      </div>
    );
  },
);

TraceRow.displayName = 'ProcessingTrace.Row';
