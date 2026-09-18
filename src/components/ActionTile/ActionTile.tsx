'use client';
// @refresh reset

/**
 * @module ActionTile
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
 * For prop API + usage notes, read `ActionTile.md` in this folder
 * or run `npm run ld-kit -- show ActionTile`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps, CommonProps} from '../../common/helpers';
import './ActionTile.css';

/**
 * Action Tile variant. Bundles a layout and a size:
 * - `full` → vertical, large square-ish tile (130×124). Icon top, title bottom.
 * - `tall` → vertical, taller/narrower tile. Icon top, title bottom.
 * - `short` → vertical, compact tile. Icon and title stacked close together.
 * - `horizontal` → row layout. Icon leads, title sits to its right.
 *
 * `full`, `tall`, and `short` are the size variants (all vertical); `horizontal`
 * is the layout variant.
 */
export type ActionTileVariant = 'full' | 'horizontal' | 'short' | 'tall';

/**
 * The font weight applied to the tile title.
 * - `bold` → Body Small/Medium Bold (700). The default, matching the Figma spec.
 * - `regular` → Body Small/Medium (400) for a lighter, less emphatic label.
 */
export type ActionTileTitleWeight = 'bold' | 'regular';

export interface ActionTileProps
  extends CommonProps,
    Omit<React.ComponentPropsWithoutRef<'button'>, 'className' | 'style' | 'title'> {
  /**
   * The title (label) for the tile.
   */
  children: React.ReactNode;
  /**
   * If the tile is disabled.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * The leading content for the tile — typically an `Icon` or a `SpotIcon`.
   * Vertical variants (`full`/`tall`/`short`) expect a large (32px) icon and
   * `horizontal` a medium (24px) icon; size the icon you pass accordingly.
   */
  leading?: React.ReactNode;
  /**
   * Whether the tile is activated (selected). Renders the activated blue border
   * and is reflected as `aria-pressed`.
   *
   * @default false
   */
  selected?: boolean;
  /**
   * The font weight for the title.
   *
   * @default "bold"
   */
  titleWeight?: ActionTileTitleWeight;
  /**
   * The variant for the tile. Controls both the layout and the size.
   *
   * @default "full"
   */
  variant?: ActionTileVariant;
}

/**
 * Action Tiles are compact, selectable buttons that pair a leading icon (or
 * `SpotIcon`) with a short title. Use them to present a set of mutually related
 * actions or choices — e.g. a grid of category shortcuts or a single-select
 * picker.
 *
 * Choose a `variant` to set both layout and size: `full`, `tall`, and `short`
 * are vertical (icon over title) at decreasing heights, while `horizontal`
 * places the icon before the title in a row. Drive the activated state with
 * `selected` (reflected as `aria-pressed`) and pick a `titleWeight` of `bold`
 * (default) or `regular` for the label.
 */
export const ActionTile = React.forwardRef<HTMLButtonElement, ActionTileProps>(
  (props, ref) => {
    const {
      children,
      className,
      disabled = false,
      leading,
      selected = false,
      titleWeight = 'bold',
      type = 'button',
      variant = 'full',
      ...rest
    } = applyCommonProps(props);

    return (
      <button
        aria-pressed={selected}
        className={cx(
          'ld-actiontile-tile',
          variant === 'full' && 'ld-actiontile-full',
          variant === 'tall' && 'ld-actiontile-tall',
          variant === 'short' && 'ld-actiontile-short',
          variant === 'horizontal' && 'ld-actiontile-horizontal',
          selected && 'ld-actiontile-selected',
          titleWeight === 'regular' && 'ld-actiontile-titleRegular',
          className
        )}
        disabled={disabled}
        ref={ref}
        /* eslint-disable-next-line react/button-has-type */
        type={type}
        {...rest}
      >
        {leading && (
          <span className={'ld-actiontile-leading'} aria-hidden="true">
            {leading}
          </span>
        )}
        <span className={'ld-actiontile-title'}>{children}</span>
      </button>
    );
  }
);

ActionTile.displayName = 'ActionTile';
