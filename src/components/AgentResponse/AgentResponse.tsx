'use client';
// @refresh reset

/**
 * @module AgentResponse
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
 * For prop API + usage notes, read `AgentResponse.md` in this folder
 * or run `npm run ld-kit -- show AgentResponse`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {Avatar} from '../Avatar';
import {Body, Caption} from '../Text/Text';
import {Link} from '../Link';
import {Icon} from '../Icons';
import {VisuallyHidden} from '../VisuallyHidden';
import './AgentResponse.css';

export interface AgentResponseProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style' | 'slot'> {
  /** The agent's reply. Ignored while `thinking`. */
  children?: React.ReactNode;
  /** Optional rich content rendered beneath the reply (e.g. an ItemTile). */
  slot?: React.ReactNode;
  /** Optional follow-up link rendered beneath the content slot. */
  link?: string;
  /** Optional timestamp / read receipt caption. */
  timestamp?: string;
  /** When `true`, shows the streaming placeholder instead of `children`. */
  thinking?: boolean;
  /** The agent's display name shown in the header. @default "Polaris" */
  name?: string;
  /** Accessible label for the agent avatar. @default `${name} agent` */
  avatarA11yLabel?: string;
  /**
   * Copy shown while `thinking`. @default "Thinking…"
   * Pass an empty string to suppress the placeholder text entirely (e.g. when
   * a paired `trace` already communicates progress) while still holding back
   * `children` until `thinking` is `false`.
   */
  thinkingLabel?: string;
  /** Hide the leading avatar (e.g. when a status dot identifies the source). @default true */
  hideAvatar?: boolean;
  /** A status dot color shown before the name (e.g. a source/brand color). */
  statusColor?: string;
  /** Subtle meta text after the name (e.g. "generated this response"). */
  meta?: React.ReactNode;
  /** Show a trailing info affordance in the header. */
  info?: boolean;
  /** Accessible label for the info affordance. @default "About this response" */
  infoLabel?: string;
  /** A feedback / actions toolbar rendered beneath the response. */
  feedback?: React.ReactNode;
  /**
   * A system `ProcessingTrace` paired with this response. Rendered above the
   * reply body and programmatically associated with the response content via
   * `aria-details`, keeping the trace scoped to this chat turn.
   */
  trace?: React.ReactNode;
}

/**
 * AgentResponse renders an agent (assistant) chat turn: an optional avatar (or
 * status dot), the agent name and meta, the reply body (or a streaming
 * placeholder), optional content / link / timestamp slots, and an optional
 * feedback toolbar. Composed from LD primitives.
 */
export const AgentResponse = React.forwardRef<HTMLDivElement, AgentResponseProps>(
  (props, ref) => {
    const {
      children,
      className,
      slot,
      link,
      timestamp,
      thinking = false,
      name = 'Polaris',
      avatarA11yLabel,
      thinkingLabel = 'Thinking…',
      hideAvatar = true,
      statusColor,
      meta,
      info = false,
      infoLabel = 'About this response',
      feedback,
      trace,
      ...rest
    } = applyCommonProps(props);

    const traceId = React.useId();

    return (
      <div
        ref={ref}
        className={cx('ld-agentresponse', hideAvatar && 'ld-agentresponse--noavatar', className)}
        {...rest}
      >
        {/* Screen-reader-only ownership: announce who this turn is from, since
            visual layout (avatar / alignment) conveys it only to sighted users. */}
        <VisuallyHidden>{thinking ? 'Received message, generating' : 'Received message'}</VisuallyHidden>
        {!hideAvatar ? (
          <Avatar a11yLabel={avatarA11yLabel ?? `${name} agent`} name="AI" size="small" />
        ) : null}
        <div className="ld-agentresponse-header">
          {statusColor ? (
            <span
              className="ld-agentresponse-status"
              style={{backgroundColor: statusColor}}
              aria-hidden="true"
            />
          ) : null}
          <Body as="span" size="small" weight="alt" UNSAFE_className="ld-agentresponse-name">
            {name}
          </Body>
          {meta ? (
            <Caption color="subtle" UNSAFE_className="ld-agentresponse-meta">
              {meta}
            </Caption>
          ) : null}
          {info ? (
            <Icon
              name="InfoCircle"
              a11yLabel={infoLabel}
              className="ld-agentresponse-info"
            />
          ) : null}
        </div>
        <div
          className="ld-agentresponse-content"
          aria-details={trace ? traceId : undefined}
        >
          {trace ? (
            <div id={traceId} className="ld-agentresponse-trace">
              {trace}
            </div>
          ) : null}
          {thinking ? (
            thinkingLabel ? (
              <Body as="div" size="medium" color="subtle" UNSAFE_className="ld-agentresponse-thinking">
                {thinkingLabel}
              </Body>
            ) : null
          ) : (
            <div className="ld-agentresponse-body">{children}</div>
          )}
          {slot ? <div className="ld-agentresponse-slot">{slot}</div> : null}
          {link ? <Link href="#">{link}</Link> : null}
          {timestamp ? <Caption color="subtle">{timestamp}</Caption> : null}
          {feedback ? <div className="ld-agentresponse-feedback">{feedback}</div> : null}
        </div>
      </div>
    );
  }
);

AgentResponse.displayName = 'AgentResponse';
