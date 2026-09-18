// @refresh reset

/**
 * @module MagicText
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
 * For prop API + usage notes, read `MagicText.md` in this folder
 * or run `npm run ld-kit -- show MagicText`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {PolymorphicElementWithoutRef} from '../../common/types';
import './MagicText.css';

export type MagicTextVariant = 'subtle' | 'bold';
export type MagicTextElement = 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';

interface MagicTextBaseProps {
  /**
   * The content to render with the AI-branded gradient text treatment.
   */
  children: React.ReactNode;
  /**
   * The text treatment variant. `subtle` is a single flat brand color;
   * `bold` clips a two-bloom gradient to the text.
   *
   * @default "subtle"
   */
  variant?: MagicTextVariant;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

/*
 * Omit className/style here even though PolymorphicElementWithoutRef would
 * otherwise merge them in from the native element props (they're not keys of
 * MagicTextBaseProps). applyCommonProps silently drops plain style/
 * className at runtime — only UNSAFE_style/UNSAFE_className apply — so the
 * public type must close that gap instead of accepting props that are
 * quietly ignored.
 */
export type MagicTextProps<T extends MagicTextElement> = Omit<
  PolymorphicElementWithoutRef<T, MagicTextBaseProps>,
  'className' | 'style'
>;

/**
 * MagicText applies an AI-branded text treatment — a subtle flat brand
 * color, or a bold gradient clipped to the text with two soft corner
 * blooms. It inherits font-size, line-height, and font-family from its
 * rendering context, so wrap it in Heading or Body for sizing.
 */
export const MagicText = <T extends MagicTextElement = 'span'>(props: MagicTextProps<T>) => {

  const {as: Component = 'span' as any, className, variant = 'subtle', ...rest} = applyCommonProps(props as any);

  return (
    <Component
      className={cx(
        variant === 'subtle' && 'ld-magictext-subtle',
        variant === 'bold' && 'ld-magictext-bold',
        className,
      )}
      {...rest}
    />
  );
};

MagicText.displayName = 'MagicText';
