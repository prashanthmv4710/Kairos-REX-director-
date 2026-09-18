'use client';
// @refresh reset

/**
 * @module UserResponse
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
 * For prop API + usage notes, read `UserResponse.md` in this folder
 * or run `npm run ld-kit -- show UserResponse`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {IconButton} from '../IconButton';
import {LinkButton} from '../LinkButton';
import {Icon} from '../Icons';
import {Body} from '../Text/Text';
import {Tooltip} from '../Tooltip';
import {VisuallyHidden} from '../VisuallyHidden';
import './UserResponse.css';

/** Allowed UserResponse fill/text pairings. */
export const USER_RESPONSE_COLOR_PAIRINGS = [
  {fill: 'brand-bold', textColor: 'onfill-brand'},
  {fill: 'brand-subtle', textColor: 'onfill-brand-subtle'},
  {fill: 'subtle', textColor: 'default'},
  {fill: 'inverse', textColor: 'inverse'},
  {fill: 'accent-purple', textColor: 'inverse'},
  {fill: 'accent-teal', textColor: 'inverse'},
] as const;

type UserResponseColorPair = (typeof USER_RESPONSE_COLOR_PAIRINGS)[number];

/** The allowed bubble fill options from the pairing map. */
export type UserResponseFill = UserResponseColorPair['fill'];

/** The allowed text color options from the pairing map. */
export type UserResponseTextColor = UserResponseColorPair['textColor'];

const FILL_TO_TEXT_COLOR: Record<UserResponseFill, UserResponseTextColor> = {
  'brand-bold': 'onfill-brand',
  'brand-subtle': 'onfill-brand-subtle',
  subtle: 'default',
  inverse: 'inverse',
  'accent-purple': 'inverse',
  'accent-teal': 'inverse',
};

const TEXT_TO_FILL: Record<UserResponseTextColor, UserResponseFill> = {
  'onfill-brand': 'brand-bold',
  'onfill-brand-subtle': 'brand-subtle',
  default: 'subtle',
  inverse: 'inverse',
};

/** Fill value → CSS color (token with a hex fallback). */
const FILL_COLORS: Record<UserResponseFill, string> = {
  'brand-bold': 'var(--ld-semantic-color-fill-brand-bold, #001e60)',
  'brand-subtle': 'var(--ld-semantic-color-fill-brand-subtle, #e6f1fd)',
  'accent-purple': 'var(--ld-semantic-color-fill-accent-purple, #63327e)',
  'accent-teal': 'var(--ld-semantic-color-fill-accent-teal, #00809e)',
  inverse: 'var(--ld-semantic-color-fill-inverse, #2e2f32)',
  subtle: 'var(--ld-semantic-color-fill-subtle, #f0f1f2)',
};

/** Text value → CSS color (token with a hex fallback). */
const TEXT_COLORS: Record<UserResponseTextColor, string> = {
  'onfill-brand': 'var(--ld-semantic-color-text-onfill-brand, #ffffff)',
  'onfill-brand-subtle': 'var(--ld-semantic-color-text-brand-bold, #001e60)',
  inverse: 'var(--ld-semantic-color-text-onFill-inverse, #ffffff)',
  default: 'var(--ld-semantic-color-text, #2e2f32)',
};

export interface UserResponseProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style' | 'slot' | 'onCopy'> {
  /** The user's message. */
  children: React.ReactNode;
  /** Optional rich content rendered beneath the message (e.g. an attachment). */
  slot?: React.ReactNode;
  /**
   * Optional delivery caption rendered below the bubble, right-aligned — e.g.
   * a "Not delivered · Try again" status when a message fails to send.
   */
  caption?: React.ReactNode;
  /**
   * File attachment tiles rendered above the prompt bubble, right-aligned.
   * Pass one or more `AttachmentTile` components (or any ReactNode) — UserResponse
   * stacks them vertically and aligns them with the bubble's right edge.
   * Do not embed raw attachment data: pass the rendered tile components directly,
   * matching the pattern used throughout the Agent Canvas composer and side panel.
   */
  attachments?: React.ReactNode;
  /**
   * Custom footer content rendered directly beneath the bubble, right-aligned.
   * Use for actions beyond the built-in Copy button. Shares the same
   * hover-reveal behaviour as `onCopy`.
   */
  footer?: React.ReactNode;
  /**
   * Called when the user activates the Copy action — receives the current
   * message text so the parent can write it to the clipboard or handle it
   * otherwise. The component shows a checkmark confirmation optimistically on
   * click without inspecting the outcome. When provided, a Copy button is
   * rendered in the footer.
   */
  onCopy?: (text: string) => void;
  /**
   * The bubble fill. `textColor` is derived from the mapped pairing.
   *
   * @default "brand-subtle"
   */
  fill?: UserResponseFill;
  /**
   * The bubble text color. `fill` is derived from the mapped pairing.
   *
   * @default "onfill-brand-subtle"
   */
  textColor?: UserResponseTextColor;
}

/** Duration (ms) the checkmark confirmation icon is shown after Copy. */
const CONFIRM_DURATION_MS = 2000;

/**
 * UserResponse renders a right-aligned user chat bubble. Fill and textColor are
 * constrained to mapped pairs; when one is provided, the other is auto-derived.
 *
 * Provide `onCopy` to add a hover-revealed Copy button beneath the bubble.
 * The footer is hidden at rest and revealed when the pointer enters the bubble
 * or the button receives keyboard focus.
 */
export const UserResponse = React.forwardRef<HTMLDivElement, UserResponseProps>(
  (props, ref) => {
    const {
      children,
      className,
      slot,
      caption,
      attachments,
      footer,
      onCopy,
      fill,
      textColor,
      ...rest
    } = applyCommonProps(props);

    const resolvedFill = fill ?? (textColor ? TEXT_TO_FILL[textColor] : 'brand-subtle');
    const resolvedTextColor = FILL_TO_TEXT_COLOR[resolvedFill];

    const fillColor = FILL_COLORS[resolvedFill];
    const textColorValue = TEXT_COLORS[resolvedTextColor];

    // True when any footer content will be rendered.
    const hasFooter = !!(footer || onCopy);

    // ── Footer hover visibility ────────────────────────────────────────────
    // Mouse: JS state toggles the --visible modifier on the footer.
    // Keyboard: CSS :focus-within handles reveal without JS involvement.
    const [footerVisible, setFooterVisible] = React.useState(false);
    const hideTimerRef = React.useRef<number | undefined>(undefined);

    // ── Copy confirmation state ────────────────────────────────────────────
    // The Copy button swaps its icon for a checkmark for CONFIRM_DURATION_MS ms.
    const [copied, setCopied] = React.useState(false);
    const copyTimerRef = React.useRef<number | undefined>(undefined);

    // ── Long-prompt truncation ─────────────────────────────────────────────
    // isOverflowing: true when the body's natural scroll height exceeds 5 lines.
    // expanded: true after "Show more" is clicked; false after "Show less".
    const [isOverflowing, setIsOverflowing] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);

    // ── Text extraction ────────────────────────────────────────────────────
    // Body is not forwardRef'd, so we ref the bubble container and find the
    // body element via querySelector. For string children (the common case)
    // we can short-circuit without a DOM read.
    const bubbleRef = React.useRef<HTMLDivElement>(null);

    const getMessageText = React.useCallback((): string => {
      if (typeof children === 'string') return children;
      return (
        bubbleRef.current
          ?.querySelector<HTMLElement>('.ld-userresponse-body')
          ?.textContent?.trim() ?? ''
      );
    }, [children]);

    // ── Overflow detection ─────────────────────────────────────────────────
    // Observes the bubble container width. When width changes, text reflows
    // and the body's scrollHeight changes. scrollHeight is unaffected by
    // max-height / overflow:hidden, so the comparison works in both clamped
    // and expanded states.
    React.useEffect(() => {
      const bubble = bubbleRef.current;
      if (!bubble) return;

      const checkOverflow = () => {
        const bodyEl = bubble.querySelector<HTMLElement>('.ld-userresponse-body');
        if (!bodyEl) return;
        const lineHeight = parseFloat(getComputedStyle(bodyEl).lineHeight);
        if (!lineHeight) return;
        // Use requestAnimationFrame to avoid "ResizeObserver loop" warnings
        // that can surface when the clamp itself changes the bubble height and
        // immediately re-triggers the observer.
        requestAnimationFrame(() => {
          setIsOverflowing(bodyEl.scrollHeight > Math.ceil(lineHeight * 5));
        });
      };

      checkOverflow();
      const ro = new ResizeObserver(checkOverflow);
      ro.observe(bubble);
      return () => ro.disconnect();
    }, [children]);

    // Collapse back to 5-line view when content shrinks below the threshold
    // (e.g. viewport widens) so "Show less" never orphans without a collapsed
    // state to return to.
    React.useEffect(() => {
      if (!isOverflowing) setExpanded(false);
    }, [isOverflowing]);

    // ── Cleanup timers on unmount ──────────────────────────────────────────
    React.useEffect(
      () => () => {
        window.clearTimeout(hideTimerRef.current);
        window.clearTimeout(copyTimerRef.current);
      },
      []
    );

    // ── Footer visibility handlers ─────────────────────────────────────────
    const showFooter = React.useCallback(() => {
      window.clearTimeout(hideTimerRef.current);
      setFooterVisible(true);
    }, []);

    // Debounce the hide so the pointer can cross the 4px gap between the
    // bubble and the footer buttons without the footer flickering away.
    const scheduleHide = React.useCallback(() => {
      hideTimerRef.current = window.setTimeout(() => setFooterVisible(false), 100);
    }, []);

    // ── Copy handler ───────────────────────────────────────────────────────
    // Delegates the side effect entirely to the parent via onCopy — the
    // component is clipboard-unaware, consistent with how Feedback.onChange
    // and ViolationCard.onCopy work. The checkmark is shown optimistically.
    const handleCopy = React.useCallback(() => {
      const text = getMessageText();
      // Clear any in-flight confirmation so rapid clicks don't leak.
      window.clearTimeout(copyTimerRef.current);
      onCopy?.(text);
      setCopied(true);
      copyTimerRef.current = window.setTimeout(() => setCopied(false), CONFIRM_DURATION_MS);
    }, [getMessageText, onCopy]);

    return (
      <div ref={ref} className={cx('ld-userresponse', className)} {...rest}>
        {attachments ? (
          <div className="ld-userresponse-attachments">{attachments}</div>
        ) : null}
        <div
          ref={bubbleRef}
          className="ld-userresponse-bubble"
          data-fill={resolvedFill}
          style={{background: fillColor, color: textColorValue}}
          onMouseEnter={hasFooter ? showFooter : undefined}
          onMouseLeave={hasFooter ? scheduleHide : undefined}
        >
          {/* Screen-reader-only ownership: visual right-alignment tells sighted
              users who sent this; announce it for assistive tech. */}
          <VisuallyHidden>Sent message</VisuallyHidden>
          <Body
            as="div"
            size="medium"
            UNSAFE_className={cx(
              'ld-userresponse-body',
              !expanded && isOverflowing && 'ld-userresponse-body--clamped'
            )}
            UNSAFE_style={{color: textColorValue}}
          >
            {children}
          </Body>
          {isOverflowing ? (
            <LinkButton
              UNSAFE_className="ld-userresponse-expand"
              onClick={() => setExpanded((e) => !e)}
              trailing={<Icon name={expanded ? 'ChevronUp' : 'ChevronDown'} decorative />}
            >
              {expanded ? 'Show less' : 'Show more'}
            </LinkButton>
          ) : null}
          {slot ? <div className="ld-userresponse-slot">{slot}</div> : null}
        </div>

        {hasFooter ? (
          <div
            className={cx(
              'ld-userresponse-footer',
              footerVisible && 'ld-userresponse-footer--visible'
            )}
            onMouseEnter={showFooter}
            onMouseLeave={scheduleHide}
          >
            {onCopy ? (
              <Tooltip
                content={copied ? 'Copied' : 'Copy'}
                relationship="label"
                position="below"
              >
                <IconButton
                  a11yLabel={copied ? 'Copied' : 'Copy'}
                  color="tertiary"
                  size="small"
                  onClick={handleCopy}
                >
                  <Icon name={copied ? 'Check' : 'Copy'} decorative />
                </IconButton>
              </Tooltip>
            ) : null}
            {footer}
          </div>
        ) : null}

        {caption ? <div className="ld-userresponse-caption">{caption}</div> : null}
      </div>
    );
  }
);

UserResponse.displayName = 'UserResponse';
