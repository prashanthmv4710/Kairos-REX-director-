'use client';
// @refresh reset

/**
 * @module Text
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
 * For prop API + usage notes, read `Text.md` in this folder
 * or run `npm run ld-kit -- show Text`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {PolymorphicElementWithoutRef} from '../../common/types';
import './Text.css';

// TextColor service — each value maps 1:1 to a `.ld-text-textcolor-*` class in
// Text.css, which sets `color` from a `--ld-semantic-color-text-*` token. No
// hex values live in this file; the token is the single source of truth.
export type TextColor =
  | 'accentBlue' | 'accentBlueBold' | 'accentCyan' | 'accentCyanBold'
  | 'accentGray' | 'accentGrayBold' | 'accentGreen' | 'accentGreenBold'
  | 'accentOrange' | 'accentOrangeBold' | 'accentPink' | 'accentPinkBold'
  | 'accentPurple' | 'accentPurpleBold' | 'accentRed' | 'accentRedBold'
  | 'accentSpark' | 'accentSparkBold' | 'accentTeal' | 'accentTealBold'
  | 'accentYellow' | 'accentYellowBold'
  | 'onFillAccentBlue' | 'onFillAccentBlueSubtle' | 'onFillAccentCyan' | 'onFillAccentCyanSubtle'
  | 'onFillAccentGray' | 'onFillAccentGraySubtle' | 'onFillAccentGreen' | 'onFillAccentGreenSubtle'
  | 'onFillAccentOrange' | 'onFillAccentOrangeSubtle' | 'onFillAccentPink' | 'onFillAccentPinkSubtle'
  | 'onFillAccentPurple' | 'onFillAccentPurpleSubtle' | 'onFillAccentRed' | 'onFillAccentRedSubtle'
  | 'onFillAccentSpark' | 'onFillAccentSparkSubtle' | 'onFillAccentTeal' | 'onFillAccentTealSubtle'
  | 'onFillAccentYellow' | 'onFillAccentYellowSubtle'
  | 'onFill' | 'onFillActivated' | 'onFillActivatedDisabled' | 'onFillActivatedSubtle'
  | 'onFillActivatedSubtleDisabled' | 'onFillBrand' | 'onFillBrandBold' | 'onFillBrandSubtle'
  | 'onFillDisabled' | 'onFillEdited' | 'onFillEditedSubtle' | 'onFillInfo' | 'onFillInfoSubtle'
  | 'onFillInverse' | 'onFillNegative' | 'onFillNegativeSubtle' | 'onFillPositive'
  | 'onFillPositiveSubtle' | 'onFillTransparent' | 'onFillWarning' | 'onFillWarningSubtle'
  | 'activated' | 'brand' | 'brandBold' | 'disabled' | 'edited' | 'editedBold'
  | 'info' | 'infoBold' | 'infoInverse' | 'inverse'
  | 'magicStart' | 'magicMiddle' | 'magicStop'
  | 'negative' | 'negativeBold' | 'negativeInverse'
  | 'positive' | 'positiveBold' | 'positiveInverse'
  | 'subtle' | 'subtlest'
  | 'warning' | 'warningBold' | 'warningInverse';

function getTextColorClassName(color?: TextColor): string | undefined {
  return color ? `ld-text-textcolor-${color}` : undefined;
}

// ---------------------------------------------------------------------------
// Body
// ---------------------------------------------------------------------------

export type BodyColor = TextColor;
export type BodyElement = 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
export type BodySize = 'large' | 'medium' | 'small';
export type BodyWeight = 'default' | 'alt';

interface BodyBaseProps {
  color?: BodyColor;
  isMonospace?: boolean;
  size?: BodySize;
  weight?: BodyWeight;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

export type BodyProps<T extends BodyElement> = PolymorphicElementWithoutRef<T, BodyBaseProps>;

export const Body = <T extends BodyElement = 'span'>(props: BodyProps<T>) => {

  const {as: Component = 'span' as any, className, color, isMonospace = false, size = 'medium', weight = 'default', ...rest} = applyCommonProps(props as any);
  return (
    <Component
      className={cx(
        'ld-text-body-body',
        getTextColorClassName(color),
        isMonospace && 'ld-text-body-isMonospace',
        size === 'large' && 'ld-text-body-large',
        size === 'medium' && 'ld-text-body-medium',
        size === 'small' && 'ld-text-body-small',
        weight === 'default' && 'ld-text-body-weightDefault',
        weight === 'alt' && 'ld-text-body-weightAlt',
        className,
      )}
      {...rest}
    />
  );
};
Body.displayName = 'Body';

// ---------------------------------------------------------------------------
// Caption
// ---------------------------------------------------------------------------

export type CaptionColor = TextColor;
export type CaptionElement = 'div' | 'p' | 'small' | 'span';
export type CaptionWeight = 'default' | 'alt';

interface CaptionBaseProps {
  color?: CaptionColor;
  isMonospace?: boolean;
  weight?: CaptionWeight;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

export type CaptionProps<T extends CaptionElement> = PolymorphicElementWithoutRef<T, CaptionBaseProps>;

export const Caption = <T extends CaptionElement = 'span'>(props: CaptionProps<T>) => {

  const {as: Component = 'span' as any, className, color, isMonospace = false, weight = 'default', ...rest} = applyCommonProps(props as any);
  return (
    <Component
      className={cx(
        'ld-text-caption-caption',
        getTextColorClassName(color),
        isMonospace && 'ld-text-caption-isMonospace',
        weight === 'default' && 'ld-text-caption-weightDefault',
        weight === 'alt' && 'ld-text-caption-weightAlt',
        className,
      )}
      {...rest}
    />
  );
};
Caption.displayName = 'Caption';

// ---------------------------------------------------------------------------
// Heading
// ---------------------------------------------------------------------------

export type HeadingColor = TextColor;
export type HeadingElement = 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
export type HeadingSize = 'large' | 'medium' | 'small';
export type HeadingWeight = 'default' | 'alt';

interface HeadingBaseProps {
  color?: HeadingColor;
  size?: HeadingSize;
  weight?: HeadingWeight;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

export type HeadingProps<T extends HeadingElement> = PolymorphicElementWithoutRef<T, HeadingBaseProps>;

export const Heading = <T extends HeadingElement = 'span'>(props: HeadingProps<T>) => {

  const {as: Component = 'span' as any, className, color, size = 'medium', weight = 'default', ...rest} = applyCommonProps(props as any);
  return (
    <Component
      className={cx(
        'ld-text-heading-heading',
        getTextColorClassName(color),
        size === 'large' && 'ld-text-heading-large',
        size === 'medium' && 'ld-text-heading-medium',
        size === 'small' && 'ld-text-heading-small',
        weight === 'default' && 'ld-text-heading-weightDefault',
        weight === 'alt' && 'ld-text-heading-weightAlt',
        className,
      )}
      {...rest}
    />
  );
};
Heading.displayName = 'Heading';

// ---------------------------------------------------------------------------
// Display
// ---------------------------------------------------------------------------

export type DisplayColor = TextColor;
export type DisplayElement = 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
export type DisplaySize = 'large' | 'small';
export type DisplayWeight = 'default' | 'alt';

interface DisplayBaseProps {
  color?: DisplayColor;
  size?: DisplaySize;
  weight?: DisplayWeight;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

export type DisplayProps<T extends DisplayElement> = PolymorphicElementWithoutRef<T, DisplayBaseProps>;

export const Display = <T extends DisplayElement = 'span'>(props: DisplayProps<T>) => {

  const {as: Component = 'span' as any, className, color, size = 'large', weight = 'default', ...rest} = applyCommonProps(props as any);
  return (
    <Component
      className={cx(
        'ld-text-display-display',
        getTextColorClassName(color),
        size === 'large' && 'ld-text-display-large',
        size === 'small' && 'ld-text-display-small',
        weight === 'default' && 'ld-text-display-weightDefault',
        weight === 'alt' && 'ld-text-display-weightAlt',
        className,
      )}
      {...rest}
    />
  );
};
Display.displayName = 'Display';
