// @refresh reset

/**
 * @module Skeleton
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
 * For prop API + usage notes, read `Skeleton.md` in this folder
 * or run `npm run ld-kit -- show Skeleton`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import './Skeleton.css';
// ---------------------------------------------------------------------------
// SkeletonText (inlined sub-component)
// ---------------------------------------------------------------------------

export interface SkeletonTextProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  /**
   * If the Skeleton Text should use visual styles that indicate the involvement of an AI agent.
   */
  isMagic?: boolean;
  /**
   * The number of lines for the Skeleton Text.
   *
   * @default 3
   */
  lines?: number;
}

const MAGIC_ANIMATION_DELAY_MS = 200; /* --ld-semantic-duration-fast */

/**
 * Skeleton Text
 *
 * {@link https://digitaltoolkit.livingdesign.walmart.com/components/skeleton/ Guidelines}
 * {@link https://digitaltoolkit.livingdesign.walmart.com/develop/react/components/skeleton/#skeleton-text React documentation}
 *
 */
export const SkeletonText: React.FunctionComponent<SkeletonTextProps> = (
  props
) => {
  const {
    className,
    isMagic,
    lines = 3,
    ...rest
  } = applyCommonProps(props);

  return (
    <div className={cx('ld-skeleton-skeletontext-skeletonText', className)} {...rest}>
      {Array.from(new Array(lines)).map((_, index) => (
        <Skeleton
          isMagic={isMagic}
          key={index}
          UNSAFE_className={'ld-skeleton-skeletontext-skeleton'}
          UNSAFE_style={{
            ...(isMagic && {
              animationDelay: `${MAGIC_ANIMATION_DELAY_MS * index}ms`,
            }),
          }}
        />
      ))}
    </div>
  );
};

SkeletonText.displayName = 'SkeletonText';

export type SkeletonVariant = 'rectangle' | 'rounded';

export interface SkeletonProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
  /**
   * The height for the Skeleton.
   */
  height?: number | string;
  /**
   * If the Skeleton should use visual styles that indicate the involvement of an AI agent.
   */
  isMagic?: boolean;
  /**
   * The variant for the Skeleton.
   *
   * @default "rectangle"
   */
  variant?: SkeletonVariant;
  /**
   * The width for the Skeleton.
   */
  width?: number | string;
}

/**
 * Skeletons are low-fidelity shapes that approximate interface elements and indicate loading of content. A group of Skeletons roughly matching a loaded screen can improve perceived responsiveness when loading data is slow.
 *
 * {@link https://digitaltoolkit.livingdesign.walmart.com/components/skeleton/ Guidelines}
 * {@link https://digitaltoolkit.livingdesign.walmart.com/develop/react/components/skeleton/ React documentation}
 *
 */
export const Skeleton: React.FunctionComponent<SkeletonProps> = (props) => {
  const {
    className,
    height,
    isMagic,
    style: styleProp,
    variant = 'rectangle',
    width,
    ...rest
  } = applyCommonProps(props);

  return (
    <div
      className={cx('ld-skeleton-skeleton', variant === 'rectangle' && 'ld-skeleton-rectangle', variant === 'rounded' && 'ld-skeleton-rounded', isMagic && 'ld-skeleton-isMagic', className)}
      style={{
        ...styleProp,
        height,
        width,
      }}
      {...rest}
    />
  );
};

Skeleton.displayName = 'Skeleton';
