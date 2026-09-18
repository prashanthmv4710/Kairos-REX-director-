// @refresh reset

/**
 * @module Grid
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
 * For prop API + usage notes, read `Grid.md` in this folder
 * or run `npm run ld-kit -- show Grid`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import './Grid.css';
// ---------------------------------------------------------------------------
// GridColumn (inlined sub-component)
// ---------------------------------------------------------------------------

export type GridColumnSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface GridColumnProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  /**
   * The content for the grid column.
   */
  children: React.ReactNode;
  /**
   * If the grid column has a gutter.
   *
   * @default false
   */
  hasGutter?: boolean;
  /**
   * The number of columns at the large breakpoint.
   */
  lg?: GridColumnSpan;
  /**
   * The number of columns at the medium breakpoint.
   */
  md?: GridColumnSpan;
  /**
   * The number of columns at the small breakpoint.
   *
   * @default 12
   */
  sm?: GridColumnSpan;
  /**
   * The number of columns at the extra-large breakpoint.
   */
  xl?: GridColumnSpan;
  /**
   * The number of columns at the extra-extra-large breakpoint.
   */
  xxl?: GridColumnSpan;
}

/**
 * Grid Column
 * *
 */
export const GridColumn: React.FunctionComponent<GridColumnProps> = (props) => {
  const {
    children,
    className,
    hasGutter = false,
    lg,
    md,
    sm = 12,
    xl,
    xxl,
    ...rest
  } = applyCommonProps(props);

  return (
    <div
      className={cx('ld-grid-gridcolumn-gridColumn', hasGutter && 'ld-grid-gridcolumn-gutter', `ld-grid-small${sm}`, md && `ld-grid-medium${md}`, lg && `ld-grid-large${lg}`, xl && `ld-grid-xlarge${xl}`, xxl && `ld-grid-xxlarge${xxl}`, className)}
      {...rest}
    >
      {children}
    </div>
  );
};

GridColumn.displayName = 'GridColumn';

export interface GridProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  /**
   * The content for the grid.
   */
  children: React.ReactNode;
  /**
   * If the grid has a gutter.
   *
   * @default false
   */
  hasGutter?: boolean;
}

/**
 * Grids provide a framework for the rhythmic and consistent positioning of elements onscreen. Grids consist of 12 columns.
 * *
 */
export const Grid: React.FunctionComponent<GridProps> = (props) => {
  const {
    children,
    className,
    hasGutter = false,
    ...rest
  } = applyCommonProps(props);

  return (
    <div
      className={cx('ld-grid-grid', hasGutter && 'ld-grid-gutter', className)}
      {...rest}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement<GridColumnProps>(child)
          ? React.cloneElement(child, {hasGutter})
          : child
      )}
    </div>
  );
};

Grid.displayName = 'Grid';
