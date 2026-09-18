'use client';

import * as React from 'react';

import {cx} from '../../../common/cx';
import {SearchIcon} from '../../Icons/Icons';
import {Body, Caption} from '../../Text/Text';

import {TraceRow} from '../TraceRow';
import type {TraceState} from '../ProcessingTrace';
import './Sources.css';

/* ============================================================
   ProcessingTraceSource — single source link
   ============================================================ */

export interface ProcessingTraceSourceProps {
  /** Visible title of the source. */
  title: React.ReactNode;
  /** Optional secondary text (hostname, snippet). */
  description?: React.ReactNode;
  /** Optional URL — when provided the title becomes a link. */
  href?: string;
  /** Optional leading icon (e.g. site favicon). */
  icon?: React.ReactNode;
  /** @internal Additional CSS class. */
  UNSAFE_className?: string;
}

export const ProcessingTraceSource: React.FunctionComponent<
  ProcessingTraceSourceProps
> = (props) => {
  const {title, description, href, icon, UNSAFE_className} = props;

  return (
    <li className={cx('ld-processingtrace-source', UNSAFE_className)}>
      {icon ? (
        <span className="ld-processingtrace-source-icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="ld-processingtrace-source-text">
        {href ? (
          <a
            className="ld-processingtrace-source-title"
            href={href}
            target="_blank"
            rel="noreferrer noopener"
          >
            {title}
          </a>
        ) : (
          <span className="ld-processingtrace-source-title">{title}</span>
        )}
        {description ? (
          <Caption color="subtle">{description}</Caption>
        ) : null}
      </span>
    </li>
  );
};

ProcessingTraceSource.displayName = 'ProcessingTrace.Source';

/* ============================================================
   ProcessingTraceSources — sources list card
   ============================================================ */

export interface ProcessingTraceSourcesProps {
  /** State of the search. @default "success" */
  state?: TraceState;
  /** Override the status pill label. */
  statusLabel?: React.ReactNode;
  /**
   * Override the auto-generated label. When omitted the label is computed as
   * `Sources · N`.
   */
  label?: React.ReactNode;
  /** Optional leading icon. @default `<SearchIcon />` */
  icon?: React.ReactNode;
  /** Optional query string rendered as a callout above the list. */
  query?: React.ReactNode;
  /** One or more `<ProcessingTrace.Source>` children. */
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
 * Sources card — renders an optional search-query header and a list of
 * `<ProcessingTrace.Source>` rows.
 */
export const ProcessingTraceSources: React.FunctionComponent<
  ProcessingTraceSourcesProps
> = (props) => {
  const {
    state = 'success',
    statusLabel,
    label,
    icon = <SearchIcon />,
    query,
    children,
    defaultOpen = true,
    open,
    onOpenChange,
    UNSAFE_className,
  } = props;

  const childArray = React.Children.toArray(children);
  const count = childArray.length;
  const resolvedLabel = label ?? `Sources · ${count}`;

  return (
    <TraceRow
      state={state}
      statusLabel={statusLabel}
      label={resolvedLabel}
      icon={icon}
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      UNSAFE_className={cx('ld-processingtrace-sources', UNSAFE_className)}
    >
      {query != null ? (
        <div className="ld-processingtrace-sources-query">
          <Caption color="subtle">Query</Caption>
          <Body size="small">{query}</Body>
        </div>
      ) : null}
      <ul className="ld-processingtrace-sources-list">{children}</ul>
    </TraceRow>
  );
};

ProcessingTraceSources.displayName = 'ProcessingTrace.Sources';
