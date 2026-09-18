'use client';
// @refresh reset

/**
 * @module Feedback
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
 * For prop API + usage notes, read `Feedback.md` in this folder
 * or run `npm run ld-kit -- show Feedback`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {Body} from '../Text/Text';
import {Link} from '../Link';
import {IconButton} from '../IconButton';
import {Icon} from '../Icons';
import {Tooltip} from '../Tooltip';
import './Feedback.css';

/** The rating a user can give an agent response. */
export type FeedbackRating = 'positive' | 'negative';

export interface FeedbackProps
  extends Omit<
    React.ComponentPropsWithoutRef<'div'>,
    'className' | 'style' | 'onChange' | 'value' | 'defaultValue'
  > {
  /**
   * The resting prompt shown beside the rating controls.
   *
   * @default "Was this helpful?"
   */
  label?: React.ReactNode;
  /**
   * Whether to render the resting prompt text beside the rating controls.
   *
   * @default true
   */
  showLabel?: boolean;
  /**
   * The confirmation copy shown after a positive rating.
   *
   * @default "Thanks for your feedback."
   */
  positiveLabel?: React.ReactNode;
  /**
   * The label for the "share more" affordance shown after a negative rating —
   * an invitation to give richer feedback.
   *
   * @default "Share more"
   */
  shareMoreLabel?: React.ReactNode;
  /**
   * If provided, "share more" renders as a Link to this href. Otherwise it is a
   * button that fires {@link FeedbackProps.onShareMore}.
   */
  shareMoreHref?: string;
  /** Fired when the user activates the "share more" affordance. */
  onShareMore?: () => void;
  /**
   * The selected rating — pass to control the component. Leave undefined to let
   * Feedback manage its own state (use `defaultValue` to seed it).
   */
  value?: FeedbackRating | null;
  /**
   * The initial rating when uncontrolled.
   *
   * @default null
   */
  defaultValue?: FeedbackRating | null;
  /** Fired when the user rates the response. */
  onChange?: (rating: FeedbackRating) => void;
  /**
   * Accessible label for the positive (thumbs up) control.
   *
   * @default "Good response"
   */
  a11yPositiveLabel?: string;
  /**
   * Accessible label for the negative (thumbs down) control.
   *
   * @default "Bad response"
   */
  a11yNegativeLabel?: string;
}

/**
 * Feedback pairs with an agent (chat) response: a short prompt beside thumbs
 * up / down controls. It is interactive — selecting a rating swaps the controls
 * for a confirmation. A positive rating shows a thank-you with a filled thumb;
 * a negative rating shows a filled thumb plus a "Share more" affordance for
 * richer feedback.
 *
 * Pass `value` + `onChange` to control it, or leave `value` undefined and read
 * the rating from `onChange`.
 */
export const Feedback = React.forwardRef<HTMLDivElement, FeedbackProps>(
  (props, ref) => {
    const {
      className,
      label = 'Was this helpful?',
      showLabel = true,
      positiveLabel = 'Thanks for your feedback.',
      shareMoreLabel = 'Share more',
      shareMoreHref,
      onShareMore,
      value,
      defaultValue = null,
      onChange,
      a11yPositiveLabel = 'Good response',
      a11yNegativeLabel = 'Bad response',
      ...rest
    } = applyCommonProps(props);

    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState<FeedbackRating | null>(
      defaultValue
    );
    const rating = isControlled ? value : internal;

    const rate = (next: FeedbackRating) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    };

    // Rating swaps the thumb buttons for a confirmation, unmounting the button
    // that was clicked and stranding focus on <body>. When that happens, move
    // focus to the confirmation's actionable control (the "Share more"
    // affordance) if present, otherwise to the status region itself so keyboard
    // and screen-reader users keep their place.
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref],
    );
    const prevRating = React.useRef(rating);
    React.useEffect(() => {
      const prev = prevRating.current;
      prevRating.current = rating;
      if (prev === null && rating !== null) {
        const root = rootRef.current;
        if (!root) return;
        const focusable = root.querySelector<HTMLElement>('a[href], button:not([disabled])');
        (focusable ?? root).focus();
      }
    }, [rating]);

    return (
      <div
        ref={setRefs}
        role="status"
        aria-live="polite"
        tabIndex={-1}
        className={cx('ld-feedback', className)}
        {...rest}
      >
        {rating === null && (
          <>
            {showLabel ? (
              <Body as="span" size="small" color="subtle" UNSAFE_className="ld-feedback-label">
                {label}
              </Body>
            ) : null}
            <span className="ld-feedback-actions">
              <Tooltip content={a11yPositiveLabel} relationship="label" position="above">
                <IconButton
                  a11yLabel={a11yPositiveLabel}
                  color="tertiary"
                  size="small"
                  onClick={() => rate('positive')}
                >
                  <Icon name="ThumbUp" />
                </IconButton>
              </Tooltip>
              <Tooltip content={a11yNegativeLabel} relationship="label" position="above">
                <IconButton
                  a11yLabel={a11yNegativeLabel}
                  color="tertiary"
                  size="small"
                  onClick={() => rate('negative')}
                >
                  <Icon name="ThumbDown" />
                </IconButton>
              </Tooltip>
            </span>
          </>
        )}

        {rating === 'positive' && (
          <>
            <Body as="span" size="small" color="subtle" UNSAFE_className="ld-feedback-label">
              {positiveLabel}
            </Body>
            <Icon
              name="ThumbUpFill"
              a11yLabel={a11yPositiveLabel}
              className="ld-feedback-confirmicon"
            />
          </>
        )}

        {rating === 'negative' && (
          <>
            <Icon
              name="ThumbDownFill"
              a11yLabel={a11yNegativeLabel}
              className="ld-feedback-confirmicon"
            />
            {shareMoreHref ? (
              <Link
                href={shareMoreHref}
                onClick={() => onShareMore?.()}
                UNSAFE_className="ld-feedback-sharemore"
              >
                {shareMoreLabel}{' '}
                <Icon name="LinkExternal" decorative style={{fontSize: '0.875em'}} />
              </Link>
            ) : (
              <button
                type="button"
                className="ld-feedback-sharemore ld-feedback-sharemore--button"
                onClick={() => onShareMore?.()}
              >
                {shareMoreLabel}{' '}
                <Icon name="LinkExternal" decorative style={{fontSize: '0.875em'}} />
              </button>
            )}
          </>
        )}
      </div>
    );
  }
);

Feedback.displayName = 'Feedback';
