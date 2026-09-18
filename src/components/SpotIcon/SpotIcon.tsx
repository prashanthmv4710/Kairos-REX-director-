// @refresh reset

/**
 * @module SpotIcon
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
 * For prop API + usage notes, read `SpotIcon.md` in this folder
 * or run `npm run ld-kit -- show SpotIcon`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import './SpotIcon.css';
export type SpotIconColor =
  | 'brand'
  | 'neutral'
  | 'blue'
  | 'green'
  | 'orange'
  | 'pink'
  | 'purple'
  | 'teal';

export type SpotIconSize = 'large' | 'medium' | 'small';

export type SpotIconShape = 'circle' | 'square';

export interface SpotIconProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  /**
   * The icon for the spot icon.
   */
  children: React.ReactElement;
  /**
   * The color for the spot icon.
   *
   * @default "brand"
   */
  color?: SpotIconColor;
  /**
   * The shape of the spot icon container.
   *
   * @default "circle"
   */
  shape?: SpotIconShape;
  /**
   * The size for the spot icon.
   *
   * @default "small"
   */
  size?: SpotIconSize;
}

const spotIconIconSize: Record<SpotIconSize, string> = {
  large: 'large',
  medium: 'large',
  small: 'medium',
};

/**
 * Explicit glyph sizes (in px) for the square shape. The icon font only ships
 * small/medium/large (16/24/32px) presets, so these are applied via `fontSize`.
 */
const squareIconSize: Record<SpotIconSize, number> = {
  large: 90,
  medium: 48,
  small: 32,
};

/**
 * Spot Icons are decorative elements that add visual interest to messaging or other screen elements such as list items.
 *
 * {@link https://digitaltoolkit.livingdesign.walmart.com/components/spot-icon/ Guidelines}
 * {@link https://digitaltoolkit.livingdesign.walmart.com/develop/react/components/spot-icon/ React documentation}
 *
 */
export const SpotIcon: React.FunctionComponent<SpotIconProps> = (props) => {
  const {
    children,
    className,
    color = 'brand',
    shape = 'circle',
    size = 'small',
    ...rest
  } = applyCommonProps(props);

  const child = React.Children.only(children);

  // Square uses explicit pixel glyph sizes; circle keeps the size-token presets.
  const childProps =
    shape === 'square'
      ? {style: {...(child.props.style as React.CSSProperties), fontSize: squareIconSize[size]}}
      : {size: spotIconIconSize[size]};

  return (
    <div
      className={cx(
        'ld-spoticon-spotIcon',
        `ld-spoticon-shape-${shape}`,
        `ld-spoticon-color-${color}`,
        `ld-spoticon-size-${size}`,
        className,
      )}
      {...rest}
    >
      {React.cloneElement(child, childProps)}
    </div>
  );
};
