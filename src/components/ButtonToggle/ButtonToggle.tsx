'use client';
// @refresh reset

/**
 * @module ButtonToggle
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
 * For prop API + usage notes, read `ButtonToggle.md` in this folder
 * or run `npm run ld-kit -- show ButtonToggle`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps, CommonProps} from '../../common/helpers';
import {ChevronDownIcon, ChevronRightIcon, ChevronUpIcon} from '../Icons/Icons';
import './ButtonToggle.css';

/**
 * Button Toggle size. Controls both the text style and the height/padding:
 * - `small` → Body Small (14px), 32px tall
 * - `medium` → Body Medium (16px), 40px tall
 * - `large` → Body Large (18px), 48px tall
 */
export type ButtonToggleSize = 'large' | 'medium' | 'small';

/**
 * Button Toggle shape:
 * - `pill` → fully rounded corners (default)
 * - `square` → 4px rounded corners
 */
export type ButtonToggleShape = 'pill' | 'square';

/**
 * Button Toggle trailing chevron behavior:
 * - `updown` → chevron points up when open and down when closed; the button
 *   acts as a disclosure (sets `aria-expanded`).
 * - `next` → chevron always points right (the page-next affordance), signaling
 *   the button navigates forward rather than expanding in place.
 */
export type ButtonToggleChevron = 'next' | 'updown';

export interface ButtonToggleProps
  extends CommonProps,
    Omit<
      React.ComponentPropsWithoutRef<'button'>,
      'className' | 'style'
    > {
  /**
   * The content for the button (its label).
   */
  children: React.ReactNode;
  /**
   * The trailing chevron behavior. `updown` flips the chevron with `isOpen`
   * and exposes the button as a disclosure; `next` shows a fixed right-pointing
   * (page-next) chevron.
   *
   * @default "updown"
   */
  chevron?: ButtonToggleChevron;
  /**
   * An optional count shown after the label as `+N`. This is dynamic and
   * consumer-driven — typically the number of options selected in the paired
   * menu or select dropdown, e.g. `count={selected.length}`. Hidden when `0`
   * or omitted.
   */
  count?: number;
  /**
   * If the button is disabled.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the toggle is in its open state. With `chevron="updown"` this
   * points the chevron up (vs. down) and is reflected as `aria-expanded`.
   *
   * @default false
   */
  isOpen?: boolean;
  /**
   * The leading content for the button (typically an icon).
   */
  leading?: React.ReactNode;
  /**
   * If the button has no fill on its default (enabled) state — transparent
   * background and border, gaining a subtle fill only on hover/focus/press.
   *
   * @default false
   */
  noFill?: boolean;
  /**
   * The shape for the button. `pill` is fully rounded; `square` uses 4px
   * corners.
   *
   * @default "pill"
   */
  shape?: ButtonToggleShape;
  /**
   * The size for the button. Controls both text style and height/padding.
   *
   * @default "small"
   */
  size?: ButtonToggleSize;
}

/**
 * Button Toggle is a button that reveals or expands related content. The
 * trailing chevron communicates state: with `chevron="updown"` (default) it
 * points down when closed and up when `isOpen`, acting as a disclosure
 * (`aria-expanded`); with `chevron="next"` it shows a fixed page-next chevron
 * for forward navigation.
 *
 * Use `shape` to switch between a fully rounded `pill` (default) and a
 * `square` (4px) silhouette, and `noFill` to drop the default fill and border
 * so the button reads as transparent until hovered or focused.
 */
export const ButtonToggle = React.forwardRef<
  HTMLButtonElement,
  ButtonToggleProps
>((props, ref) => {
  const {
    children,
    chevron = 'updown',
    className,
    count,
    disabled = false,
    isOpen = false,
    leading,
    noFill = false,
    shape = 'pill',
    size = 'small',
    type = 'button',
    ...rest
  } = applyCommonProps(props);

  // Small uses a small (16px) icon; medium and large both use a medium (24px) icon.
  const iconSize = size === 'small' ? 'small' : 'medium';

  const chevronIcon =
    chevron === 'next' ? (
      <ChevronRightIcon decorative size={iconSize} />
    ) : isOpen ? (
      <ChevronUpIcon decorative size={iconSize} />
    ) : (
      <ChevronDownIcon decorative size={iconSize} />
    );

  return (
    <button
      aria-expanded={chevron === 'updown' ? isOpen : undefined}
      className={cx(
        'ld-buttontoggle-button',
        shape === 'pill' && 'ld-buttontoggle-pill',
        shape === 'square' && 'ld-buttontoggle-square',
        noFill && 'ld-buttontoggle-noFill',
        size === 'small' && 'ld-buttontoggle-small',
        size === 'medium' && 'ld-buttontoggle-medium',
        size === 'large' && 'ld-buttontoggle-large',
        className
      )}
      disabled={disabled}
      ref={ref}
      /* eslint-disable-next-line react/button-has-type */
      type={type}
      {...rest}
    >
      {leading && (
        <span className={'ld-buttontoggle-leadingIcon'} aria-hidden="true">
          {leading}
        </span>
      )}
      <span className={'ld-buttontoggle-label'}>{children}</span>
      {count ? <span className={'ld-buttontoggle-count'}>+{count}</span> : null}
      <span className={'ld-buttontoggle-chevron'} aria-hidden="true">
        {chevronIcon}
      </span>
    </button>
  );
});

ButtonToggle.displayName = 'ButtonToggle';
