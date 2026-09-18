// @refresh reset

/**
 * @module Tag
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
 * For prop API + usage notes, read `Tag.md` in this folder
 * or run `npm run ld-kit -- show Tag`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import './Tag.css';
/**
 * Tag color tokens. `brandBold` and `neutral` are `@alpha` — they were
 * added to reach parity with Badge and may be renamed before stabilizing.
 * All other values are stable.
 */
export type TagColor =
  | 'blue'
  | 'brand'
  | 'brandBold'
  | 'cyan'
  | 'edited'
  | 'gray'
  | 'green'
  | 'info'
  | 'negative'
  | 'neutral'
  | 'orange'
  | 'pink'
  | 'positive'
  | 'purple'
  | 'red'
  | 'spark'
  | 'teal'
  | 'warning'
  | 'yellow';

export type TagVariant = 'primary' | 'secondary' | 'tertiary';

/** @alpha New API — small variant uses 2×4 padding for dense layouts. */
export type TagSize = 'small' | 'medium';

export interface TagProps
  extends Omit<React.ComponentPropsWithoutRef<'span'>, 'className' | 'style'> {
  /**
   * The content for the tag.
   */
  children: React.ReactNode;
  /**
   * The color for the tag.
   *
   * @default "brand"
   */
  color?: TagColor;
  /**
   * The leading content for the tag.
   */
  leading?: React.ReactNode;
  /**
   * The size for the tag. `'small'` uses 2px vertical / 4px horizontal
   * padding for dense layouts.
   *
   * @alpha New API — may change before it stabilizes.
   * @default "medium"
   */
  size?: TagSize;
  /**
   * The variant for the tag.
   *
   * @default "secondary"
   */
  variant?: TagVariant;
}

/**
 * Tags are used to draw a customer’s focus to item traits such as availability, status, or media rating. Items may be products, fulfillment slots, or something else. They are visual only and non-interactive.
 *
 * {@link https://digitaltoolkit.livingdesign.walmart.com/components/tag/ Guidelines}
 * {@link https://digitaltoolkit.livingdesign.walmart.com/develop/react/components/tag/ React documentation}
 *
 */
export const Tag: React.FunctionComponent<TagProps> = (props) => {
  const {
    children,
    className,
    color = 'brand',
    leading,
    size = 'medium',
    variant = 'secondary',
    ...rest
  } = applyCommonProps(props);

  return (
    <span
      className={cx('ld-tag-tag', color === 'blue' && 'ld-tag-blue', color === 'brand' && 'ld-tag-brand', color === 'brandBold' && 'ld-tag-brandBold', color === 'cyan' && 'ld-tag-cyan', color === 'edited' && 'ld-tag-edited', color === 'gray' && 'ld-tag-gray', color === 'green' && 'ld-tag-green', color === 'info' && 'ld-tag-info', color === 'negative' && 'ld-tag-negative', color === 'neutral' && 'ld-tag-neutral', color === 'orange' && 'ld-tag-orange', color === 'pink' && 'ld-tag-pink', color === 'positive' && 'ld-tag-positive', color === 'purple' && 'ld-tag-purple', color === 'red' && 'ld-tag-red', color === 'spark' && 'ld-tag-spark', color === 'teal' && 'ld-tag-teal', color === 'warning' && 'ld-tag-warning', color === 'yellow' && 'ld-tag-yellow', variant === 'primary' && 'ld-tag-primary', variant === 'secondary' && 'ld-tag-secondary', variant === 'tertiary' && 'ld-tag-tertiary', size === 'small' && 'ld-tag-small', className)}
      {...rest}
    >
      {leading && <span className={'ld-tag-leadingIcon'}>{leading}</span>}

      {children}
    </span>
  );
};

Tag.displayName = 'Tag';
