'use client';

import * as React from 'react';

import {cx} from '../../../common/cx';
import {LinkButton} from '../../LinkButton/LinkButton';
import {Body} from '../../Text/Text';

import {TraceRow} from '../TraceRow';
import type {TraceState} from '../ProcessingTrace';
import './Reasoning.css';

export interface ProcessingTraceReasoningProps {
  /** State of this reasoning block. @default "success" */
  state?: TraceState;
  /** Override the status pill label (e.g. "Done · 1.2s"). */
  statusLabel?: React.ReactNode;
  /** Header label. @default "Reasoning summary" */
  label?: React.ReactNode;
  /** Optional leading icon in the row header. */
  icon?: React.ReactNode;
  /** The reasoning body — paragraphs, lists, or arbitrary markup. */
  children: React.ReactNode;
  /**
   * Clamp the body to N lines and reveal a "Show more" toggle. Omit (or set to
   * 0) to render the full body without a toggle.
   */
  clamp?: number;
  /** Uncontrolled initial open state of the outer card. @default true */
  defaultOpen?: boolean;
  /** Controlled open state of the outer card. */
  open?: boolean;
  /** Callback fired when the card open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** @internal Additional CSS class. */
  UNSAFE_className?: string;
}

/**
 * Reasoning summary card. Displays the agent's narrative thought process with
 * an optional "Show more" affordance when the content exceeds `clamp` lines.
 */
export const ProcessingTraceReasoning: React.FunctionComponent<
  ProcessingTraceReasoningProps
> = (props) => {
  const {
    state = 'success',
    statusLabel,
    label = 'Reasoning summary',
    icon,
    children,
    clamp,
    defaultOpen = true,
    open,
    onOpenChange,
    UNSAFE_className,
  } = props;

  const [expanded, setExpanded] = React.useState(false);
  const shouldClamp = !!clamp && clamp > 0 && !expanded;

  return (
    <TraceRow
      state={state}
      statusLabel={statusLabel}
      label={label}
      icon={icon}
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      UNSAFE_className={cx('ld-processingtrace-reasoning', UNSAFE_className)}
    >
      <Body
        as="div"
        size="small"
        UNSAFE_className={cx(
          'ld-processingtrace-reasoning-body',
          shouldClamp && 'ld-processingtrace-reasoning-body--clamped',
        )}
        style={
          shouldClamp
            ? ({
                ['--ld-processingtrace-reasoning-clamp' as string]: String(clamp),
              } as React.CSSProperties)
            : undefined
        }
      >
        {children}
      </Body>
      {clamp && clamp > 0 ? (
        <LinkButton
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? 'Show less' : 'Show more'}
        </LinkButton>
      ) : null}
    </TraceRow>
  );
};

ProcessingTraceReasoning.displayName = 'ProcessingTrace.Reasoning';
