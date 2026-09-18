'use client';
// @refresh reset

/**
 * @module TagInteractive
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
 * For prop API + usage notes, read `TagInteractive.md` in this folder
 * or run `npm run ld-kit -- show TagInteractive`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {ChevronRightIcon, XIcon} from '../Icons/Icons';
import './TagInteractive.css';

/**
 * Tag Interactive color tokens. Each maps to a subtle semantic fill plus a
 * matching accent text color, so the tag stays legible across themes.
 */
export type TagInteractiveColor =
  | 'brand'
  | 'info'
  | 'negative'
  | 'positive'
  | 'warning';

/**
 * Tag Interactive action. Determines the trailing affordance and behavior:
 * - `dismiss` → trailing remove (×) icon; clicking fires `onDismiss`.
 * - `navigate` → trailing next (chevron) icon, signaling the tag navigates
 *   like a button or link; clicking fires `onClick`.
 */
export type TagInteractiveAction = 'dismiss' | 'navigate';

/**
 * Tag Interactive size. Each step changes both the text style and the
 * padding:
 * - `small` → Caption (12px / 16px line height)
 * - `medium` → Body Small (14px / 20px line height)
 * - `large` → Body Medium (16px / 24px line height)
 */
export type TagInteractiveSize = 'large' | 'medium' | 'small';

export interface TagInteractiveProps
  extends Omit<React.ComponentPropsWithRef<'button'>, 'className' | 'style'> {
  /**
   * The trailing affordance and behavior. `dismiss` shows a remove (×) icon
   * and fires `onDismiss`; `navigate` shows a next (chevron) icon and acts
   * like a button or link via `onClick`.
   *
   * @default "dismiss"
   */
  action?: TagInteractiveAction;
  /**
   * The content for the tag.
   */
  children: React.ReactNode;
  /**
   * The color for the tag.
   *
   * @default "brand"
   */
  color?: TagInteractiveColor;
  /**
   * If the tag is disabled.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * The leading content for the tag (typically an icon).
   */
  leading?: React.ReactNode;
  /**
   * The callback fired when a `dismiss` tag is dismissed (clicked). The tag
   * closes (removes itself) afterward; call `event.preventDefault()` inside
   * the handler to keep it mounted and manage visibility yourself. Not called
   * for `navigate` tags — use `onClick` for those.
   */
  onDismiss?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * The size for the tag. Controls both text style and padding.
   *
   * @default "medium"
   */
  size?: TagInteractiveSize;
}

/**
 * Tag Interactive is an interactive label — a clickable tag with hover, focus,
 * pressed, and disabled states. Set `action` to control the trailing
 * affordance: `dismiss` (default) shows a remove (×) icon for removable
 * selections such as applied filters or recipient chips, while `navigate`
 * shows a next (chevron) icon to signal the tag navigates like a button or
 * link. For non-interactive, visual-only labels use {@link Tag}.
 *
 * Choose `size` to set both the text style and padding: `small` uses Caption
 * text, `medium` uses Body Small, and `large` uses Body Medium.
 */
export const TagInteractive = React.forwardRef<
  HTMLButtonElement,
  TagInteractiveProps
>((props, ref) => {
  const {
    action = 'dismiss',
    children,
    className,
    color = 'brand',
    leading,
    size = 'medium',
    onDismiss,
    onClick,
    'aria-label': ariaLabel,
    ...rest
  } = applyCommonProps(props);

  const [dismissed, setDismissed] = React.useState(false);

  // Keep our own handle on the button so we can move focus to a neighbouring
  // tag before this one unmounts (otherwise focus falls to <body>).
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const setRefs = React.useCallback(
    (node: HTMLButtonElement | null) => {
      buttonRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    },
    [ref],
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (action === 'dismiss') {
      onDismiss?.(event);
      // Close the tag unless the consumer vetoed it via preventDefault().
      if (!event.defaultPrevented) {
        // Before unmounting, hand focus to the next (or previous) sibling tag so
        // keyboard/screen-reader users aren't stranded on <body>.
        const el = buttonRef.current;
        const siblings = el
          ? (Array.from(
              el.parentElement?.querySelectorAll<HTMLElement>('.ld-taginteractive-interactiveTag') ?? [],
            ))
          : [];
        const i = el ? siblings.indexOf(el) : -1;
        const target = i >= 0 ? siblings[i + 1] ?? siblings[i - 1] ?? null : null;
        setDismissed(true);
        if (target) requestAnimationFrame(() => target.focus());
      }
    }
  };

  if (dismissed) return null;

  // For dismiss tags with plain-text content, expose a descriptive name so the
  // action reads as "Remove {text}". Navigate tags rely on their visible text.
  const computedLabel =
    ariaLabel ??
    (action === 'dismiss' && typeof children === 'string'
      ? `Remove ${children}`
      : undefined);

  return (
    <button
      aria-label={computedLabel}
      className={cx(
        'ld-taginteractive-interactiveTag',
        color === 'brand' && 'ld-taginteractive-brand',
        color === 'info' && 'ld-taginteractive-info',
        color === 'negative' && 'ld-taginteractive-negative',
        color === 'positive' && 'ld-taginteractive-positive',
        color === 'warning' && 'ld-taginteractive-warning',
        size === 'small' && 'ld-taginteractive-small',
        size === 'medium' && 'ld-taginteractive-medium',
        size === 'large' && 'ld-taginteractive-large',
        className
      )}
      ref={setRefs}
      type="button"
      onClick={handleClick}
      {...rest}
    >
      {leading && (
        <span className={'ld-taginteractive-leadingIcon'}>{leading}</span>
      )}

      <span className={'ld-taginteractive-label'}>{children}</span>

      <span className={'ld-taginteractive-trailingIcon'} aria-hidden="true">
        {action === 'navigate' ? <ChevronRightIcon decorative /> : <XIcon decorative />}
      </span>
    </button>
  );
});

TagInteractive.displayName = 'TagInteractive';
