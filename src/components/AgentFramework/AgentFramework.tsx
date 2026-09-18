'use client';
// @refresh reset

/**
 * @module AgentFramework
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
 * For prop API + usage notes, read `AgentFramework.md` in this folder
 * or run `npm run ld-kit -- show AgentFramework`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps, CommonProps} from '../../common/helpers';
import {IconButton} from '../IconButton/IconButton';
import {Icon} from '../Icons';
import {ScrollArea} from '../ScrollArea';
import {Body, Heading, HeadingElement} from '../Text/Text';
import {Tooltip} from '../Tooltip';
import './AgentFramework.css';

export interface AgentFrameworkProps
  extends CommonProps,
    Omit<React.ComponentPropsWithoutRef<'section'>, 'className' | 'style' | 'title'> {
  /** The framework title shown in the header. */
  title: React.ReactNode;
  /**
   * Element for the title. Heading variants (`h2`–`h6`) render with heading
   * styles; `p` or `span` render with body-medium semi-bold styles, suited for
   * contexts where the framework is already identified by a surrounding landmark.
   * Defaults to `h2` to keep the document outline valid when used standalone.
   * @default "h2"
   */
  titleAs?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  /**
   * Typographic style applied to the title, independent of the semantic
   * `titleAs` element — `heading` uses Heading styles, `body` uses Body
   * styles. Defaults to `heading` for `h2`–`h6` and `body` for `p`/`span`.
   * Use e.g. `titleAs="h3"` with `titleVariant="body"` to keep a valid
   * heading tag while rendering body-sized text.
   */
  titleVariant?: 'heading' | 'body';
  /**
   * Visual size of the title text. Defaults to `small` for the `heading`
   * variant and `medium` for the `body` variant (e.g. pass `"large"` for
   * body-large styling).
   */
  titleSize?: 'small' | 'medium' | 'large';
  /**
   * Accessible name for the framework `<section>`, exposing it as a distinct
   * region landmark. In a multi-framework workspace pass a value that includes the
   * framework position (e.g. "Air fryer comparison, framework 2 of 3") so each region
   * is uniquely identifiable. Defaults to the title when it is a string.
   */
  a11yLabel?: string;
  /** Optional leading media in the header (icon / avatar). */
  icon?: React.ReactNode;
  /** Fired when the leading close (✕) control is pressed. Hidden when omitted. */
  onClose?: () => void;
  /** Accessible label for the close control. @default "Close framework" */
  closeLabel?: string;
  /** Whether the framework is expanded (maximized). Drives the expand toggle icon. */
  expanded?: boolean;
  /** Fired when the expand / restore control is pressed. Hidden when omitted. */
  onToggleExpand?: () => void;
  /** Extra trailing header actions (e.g. edit, more) placed before expand. */
  actions?: React.ReactNode;
  /** The body content. Scrolls (scrollbar on hover) when it overflows. */
  children: React.ReactNode;
  /** Footer content — typically the action Buttons. Hidden when omitted. */
  footer?: React.ReactNode;
  /**
   * Props spread onto the header bar — use to make the header a drag handle
   * (e.g. `draggable`, `onDragStart`) so the framework can be grabbed and moved.
   */
  headerProps?: React.HTMLAttributes<HTMLDivElement> & {draggable?: boolean};
  /**
   * Marks this framework as the active reference for the current chat turn — the
   * header's divider line picks up a subtle brand accent to tie it back to the
   * message it was opened from.
   */
  linked?: boolean;
}

/**
 * AgentFramework is the floating work surface beside an agent chat. It's a rounded,
 * elevated card with a header (close, title, actions, expand), a scrollable
 * body, and an optional action footer. Compose several inside a resizable group
 * to split, stack, move, and add frameworks.
 */
export const AgentFramework = React.forwardRef<HTMLElement, AgentFrameworkProps>(
  (props, ref) => {
    const {
      className,
      title,
      titleAs = 'h2',
      titleVariant,
      titleSize,
      a11yLabel,
      icon,
      onClose,
      closeLabel,
      expanded = false,
      onToggleExpand,
      actions,
      children,
      footer,
      headerProps,
      linked = false,
      ...rest
    } = applyCommonProps(props);

    // Derive the icon-button labels from the title so that, with multiple
    // frameworks open, each "Close" / "Expand" control has a unique accessible
    // name (e.g. "Close Air fryer comparison") instead of N identical ones.
    const titleText = typeof title === 'string' ? title : undefined;
    const sectionLabel = a11yLabel ?? titleText;
    const resolvedCloseLabel = closeLabel ?? (titleText ? `Close ${titleText}` : 'Close framework');
    const expandLabel = expanded
      ? titleText
        ? `Restore ${titleText}`
        : 'Restore framework'
      : titleText
        ? `Expand ${titleText}`
        : 'Expand framework';

    const resolvedTitleVariant =
      titleVariant ?? (titleAs === 'p' || titleAs === 'span' ? 'body' : 'heading');
    const resolvedTitleSize = titleSize ?? (resolvedTitleVariant === 'body' ? 'medium' : 'small');

    return (
      <section
        ref={ref}
        aria-label={sectionLabel}
        className={cx('ld-agentframework', linked && 'ld-agentframework--linked', className)}
        {...rest}
      >
        <div
          className={cx('ld-agentframework-header', headerProps?.draggable && 'ld-agentframework-header--draggable')}
          {...headerProps}
        >
          {onClose ? (
            <Tooltip content={resolvedCloseLabel} relationship="label" position="below">
              <IconButton a11yLabel={resolvedCloseLabel} color="tertiary" size="small" onClick={onClose}>
                <Icon name="Close" />
              </IconButton>
            </Tooltip>
          ) : null}
          {icon ? <span className="ld-agentframework-icon" aria-hidden="true">{icon}</span> : null}
          {resolvedTitleVariant === 'body' ? (
            <Body as={titleAs} size={resolvedTitleSize} weight="alt" UNSAFE_className="ld-agentframework-title">
              {title}
            </Body>
          ) : (
            <Heading as={titleAs as HeadingElement} size={resolvedTitleSize} UNSAFE_className="ld-agentframework-title">
              {title}
            </Heading>
          )}
          <span className="ld-agentframework-headerActions">
            {actions}
            {onToggleExpand ? (
              <Tooltip content={expandLabel} relationship="label" position="below">
                <IconButton
                  a11yLabel={expandLabel}
                  color="tertiary"
                  size="small"
                  onClick={onToggleExpand}
                >
                  <Icon name={expanded ? 'Minimize' : 'Maximize'} />
                </IconButton>
              </Tooltip>
            ) : null}
          </span>
        </div>

        <div className="ld-agentframework-body">
          <ScrollArea UNSAFE_style={{height: '100%'}}>
            <div className="ld-agentframework-bodyInner">{children}</div>
          </ScrollArea>
        </div>

        {footer ? <div className="ld-agentframework-footer">{footer}</div> : null}
      </section>
    );
  }
);

AgentFramework.displayName = 'AgentFramework';
