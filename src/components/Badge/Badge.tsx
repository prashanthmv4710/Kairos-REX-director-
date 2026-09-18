// @refresh reset

/**
 * @module Badge
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
 * For prop API + usage notes, read `Badge.md` in this folder
 * or run `npm run ld-kit -- show Badge`.
 */

/**
 * ## Accessibility — badge grouping with a parent element
 *
 * Badge is a visual indicator. When it sits next to an interactive element
 * (button, link, nav item), the badge is **decorative** — the parent element's
 * label must carry the count so screen readers announce it as one unit.
 *
 * ### Pattern
 * ```tsx
 * // ✅ Correct — SR reads "Messages, 12 new messages"
 * <Button aria-label="Messages, 12 new messages">Messages</Button>
 * <Badge aria-hidden="true" color="brand">12</Badge>
 *
 * // ✅ Correct — dot badge, SR reads "Messages, new messages"
 * <Button aria-label="Messages, new messages">Messages</Button>
 * <Badge aria-hidden="true" color="brand" />
 *
 * // ❌ Wrong — SR reads "Messages" then "12" with no context
 * <Button>Messages</Button>
 * <Badge color="brand">12</Badge>
 * ```
 *
 * ### Label format
 * Use `"{element label}, {count} {description}"`:
 * - `"Messages, 12 new messages"` (count badge)
 * - `"Inbox, 2 unread"` (count badge)
 * - `"Print, 2 items"` (count badge)
 * - `"Messages, new messages"` (dot badge — omit count, describe presence)
 *
 * ### Standalone badges (no interactive parent)
 * When Badge appears in a non-interactive context (table cell, status row),
 * it is read naturally in DOM order — no `aria-hidden` needed:
 * ```tsx
 * <span>Active orders</span>
 * <Badge color="green">5</Badge>
 * // SR reads: "Active orders 5" — already correct
 * ```
 *
 * Always `aria-hidden` the badge and update the parent label. Never rely on
 * the badge's text content alone for conveying count to assistive technology.
 */
import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import './Badge.css';

export type BadgeColor =
  | 'blue' | 'brand' | 'brandBold' | 'cyan' | 'edited'
  | 'gray' | 'green' | 'info' | 'negative' | 'neutral'
  | 'orange' | 'pink' | 'positive' | 'purple' | 'red'
  | 'spark' | 'teal' | 'warning' | 'yellow';

export interface BadgeProps
  extends Omit<React.ComponentPropsWithoutRef<'span'>, 'className' | 'style'> {
  /**
   * The count to display. Badge only supports integers — for text status
   * labels (e.g. "New", "Beta", "Out of stock"), use `Tag` instead.
   * Omit `children` entirely to render a status dot.
   */
  children?: number | string;
  /** @default "blue" */
  color?: BadgeColor;
  /**
   * Dot size. Only applies when the badge renders as a dot (no children).
   * `'small'` is 8×8 px, `'medium'` (default) is 12×12 px.
   *
   * @alpha The small-dot variant is new and may change before it stabilizes.
   * @default "medium"
   */
  size?: 'small' | 'medium';
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

const COLOR_CLASS: Record<BadgeColor, string> = {
  blue: 'ld-badge-blue',
  brand: 'ld-badge-brand',
  brandBold: 'ld-badge-brandBold',
  cyan: 'ld-badge-cyan',
  edited: 'ld-badge-edited',
  gray: 'ld-badge-gray',
  green: 'ld-badge-green',
  info: 'ld-badge-info',
  negative: 'ld-badge-negative',
  neutral: 'ld-badge-neutral',
  orange: 'ld-badge-orange',
  pink: 'ld-badge-pink',
  positive: 'ld-badge-positive',
  purple: 'ld-badge-purple',
  red: 'ld-badge-red',
  spark: 'ld-badge-spark',
  teal: 'ld-badge-teal',
  warning: 'ld-badge-warning',
  yellow: 'ld-badge-yellow',
};

function assertIsInteger(value: number | string): void {
  const isValidNumber = typeof value === 'number' && Number.isInteger(value);
  const isValidString = typeof value === 'string' && /^-?\d+$/.test(value.trim());

  if (!isValidNumber && !isValidString) {
    throw new Error(
      `Badge only accepts integers. Received ${typeof value === 'string' ? `"${value}"` : String(value)}. ` +
        'Use Tag for text status labels (e.g. "New", "Beta"), or omit children for a status dot.'
    );
  }
}

export const Badge: React.FunctionComponent<BadgeProps> = (props) => {
  const {children, color = 'blue', size = 'medium', className, ...rest} = applyCommonProps(props);

  const hasTextLabel = children !== null && typeof children !== 'undefined';

  if (hasTextLabel) {
    assertIsInteger(children);
  }

  return (
    <span
      className={cx(
        'ld-badge-badge',
        hasTextLabel && 'ld-badge-hasTextLabel',
        !hasTextLabel && size === 'small' && 'ld-badge-dotSmall',
        COLOR_CLASS[color],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
