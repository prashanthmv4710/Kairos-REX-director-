// @refresh reset

/**
 * @module MagicSurface
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
 * For prop API + usage notes, read `MagicSurface.md` in this folder
 * or run `npm run ld-kit -- show MagicSurface`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps, CommonProps} from '../../common/helpers';
import './MagicSurface.css';

export type MagicSurfaceBorderRadius = '25' | '50' | '100' | '200' | 'round';

export interface MagicSurfaceProps
  extends CommonProps,
    Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  /**
   * The border radius for the Magic Surface.
   *
   * @default "200"
   */
  borderRadius?: MagicSurfaceBorderRadius;
  /**
   * The content for the magic surface.
   */
  children: React.ReactNode;
  /**
   * The height for the Magic Surface.
   */
  height?: React.CSSProperties['height'];
  /**
   * The width for the Magic Surface.
   */
  width?: React.CSSProperties['width'];
}

/**
 * Magic Surfaces provide an ambient dual-radial-gradient background for
 * AI-branded panels and cards.
 * *
 */
export const MagicSurface: React.FunctionComponent<MagicSurfaceProps> = (props) => {
  const {
    borderRadius = '200',
    children,
    className,
    height,
    style,
    width,
    ...rest
  } = applyCommonProps(props);

  return (
    <div
      className={cx(
        'ld-magicsurface-surface',
        borderRadius === '25' && 'ld-magicsurface-borderRadius25',
        borderRadius === '50' && 'ld-magicsurface-borderRadius50',
        borderRadius === '100' && 'ld-magicsurface-borderRadius100',
        borderRadius === '200' && 'ld-magicsurface-borderRadius200',
        borderRadius === 'round' && 'ld-magicsurface-borderRadiusRound',
        className
      )}
      style={{
        ...style,
        height,
        width,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

MagicSurface.displayName = 'MagicSurface';
