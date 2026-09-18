// @refresh reset

/**
 * @module MagicBorder
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
 * For prop API + usage notes, read `MagicBorder.md` in this folder
 * or run `npm run ld-kit -- show MagicBorder`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps, CommonProps} from '../../common/helpers';
import './MagicBorder.css';
export type MagicBorderVariant = 'subtle' | 'bold' | 'dark';
export type MagicBorderBorderRadius = '25' | '50' | '100' | '200' | '300' | 'round';

export interface MagicBorderProps
  extends CommonProps,
    Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  /**
   * Sweeps the border's gradient continuously around the ring instead of
   * rendering it as a fixed diagonal — a livelier treatment for a surface
   * that's actively "thinking" (e.g. a focused prompt composer) rather than
   * static AI-branded content. Respects `prefers-reduced-motion` by holding
   * the gradient at its start angle instead of spinning.
   *
   * @default false
   */
  animated?: boolean;
  /**
   * Keeps the ring hidden until a descendant receives focus (via
   * `:focus-within`), then shows it — for framing an interactive control's
   * own focused state (e.g. a prompt composer lighting up while the user is
   * typing into it) rather than always-on AI-branded framing.
   *
   * @default false
   */
  activateOnFocus?: boolean;
  /**
   * The border radius for the Magic Border.
   *
   * @default "100"
   */
  borderRadius?: MagicBorderBorderRadius;
  /**
   * The content to frame with the magic border.
   */
  children: React.ReactNode;
  /**
   * The height for the Magic Border.
   */
  height?: React.CSSProperties['height'];
  /**
   * Whether the framed content gets breathing room inside the ring. Turn
   * off for a self-contained control that already has its own internal
   * padding (e.g. a prompt composer) so the ring sits flush against the
   * control's own edge instead of floating a fixed gap outside it.
   *
   * @default true
   */
  padded?: boolean;
  /**
   * The angular gradient treatment for the border. `dark` is tuned to glow
   * out of a near-black interior (e.g. the Wibey agent theme) instead of
   * washing out like `subtle`'s pale stops would.
   *
   * @default "subtle"
   */
  variant?: MagicBorderVariant;
  /**
   * The width for the Magic Border.
   */
  width?: React.CSSProperties['width'];
}

/**
 * Magic Border frames AI-branded content with an angular gradient border, in
 * a subtle, bold, or dark treatment. Static and always-visible by default;
 * pass `animated` to sweep the gradient continuously around the ring, and/or
 * `activateOnFocus` to keep the ring hidden until the framed content is
 * focused.
 */
export const MagicBorder = React.forwardRef<HTMLDivElement, MagicBorderProps>(
  (props, ref) => {
    const {
      activateOnFocus = false,
      animated = false,
      borderRadius = '100',
      children,
      className,
      height,
      padded = true,
      style,
      variant = 'subtle',
      width,
      ...rest
    } = applyCommonProps(props);

    return (
      <div
        ref={ref}
        className={cx(
          'ld-magicborder-border',
          variant === 'subtle' && 'ld-magicborder-variantSubtle',
          variant === 'bold' && 'ld-magicborder-variantBold',
          variant === 'dark' && 'ld-magicborder-variantDark',
          animated && 'ld-magicborder-animated',
          activateOnFocus && 'ld-magicborder-activateOnFocus',
          borderRadius === '25' && 'ld-magicborder-borderRadius25',
          borderRadius === '50' && 'ld-magicborder-borderRadius50',
          borderRadius === '100' && 'ld-magicborder-borderRadius100',
          borderRadius === '200' && 'ld-magicborder-borderRadius200',
          borderRadius === '300' && 'ld-magicborder-borderRadius300',
          borderRadius === 'round' && 'ld-magicborder-borderRadiusRound',
          className
        )}
        style={{
          ...style,
          height,
          width,
        }}
        {...rest}
      >
        <div className={cx('ld-magicborder-contentWrapper', !padded && 'ld-magicborder-contentWrapperFlush')}>
          {children}
        </div>
      </div>
    );
  }
);

MagicBorder.displayName = 'MagicBorder';
