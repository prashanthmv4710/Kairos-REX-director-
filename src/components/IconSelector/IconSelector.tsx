'use client';
// @refresh reset

/**
 * @module IconSelector
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
 * For prop API + usage notes, read `IconSelector.md` in this folder
 * or run `npm run ld-kit -- show IconSelector`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps, invariant, emit} from '../../common/helpers';
import {WithIconProps} from '../../common/types';
import './IconSelector.css';

export type IconSelectorSize = 'large' | 'medium' | 'small' | 'xsmall';
export type IconSelectorColor = 'default' | 'white' | 'primary';
export type IconSelectorVariant = 'round' | 'full';

export interface IconSelectorProps
  extends Omit<
    React.ComponentPropsWithoutRef<'button'>,
    'className' | 'onChange' | 'style' | 'type'
  > {
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
  /**
   * The accessible label for the icon selector. Announced by assistive tech
   * alongside the `aria-checked` state.
   */
  a11yLabel: string;
  /**
   * The icon shown when the selector is **selected** (the "on" state). Pair
   * this with `iconUnselected` to form a binary set — typically outline/filled
   * (e.g. Heart → HeartFill) or default/slash (e.g. Bell → BellSlash).
   */
  iconSelected: React.ReactNode;
  /**
   * The icon shown when the selector is **unselected** (the "off" state).
   * Pair this with `iconSelected` to form a binary set.
   */
  iconUnselected: React.ReactNode;
  /**
   * The color of the icon selector. Mirrors the corresponding colors on
   * `IconButton`.
   *
   * @default "default"
   */
  color?: IconSelectorColor;
  /**
   * The default selected state (uncontrolled). Use together with
   * `onSelectedChange` to let the component manage its own state.
   *
   * @default false
   */
  defaultSelected?: boolean;
  /**
   * If the icon selector is disabled.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * The callback fired when the selected state changes. Called with the next
   * selected value.
   */
  onSelectedChange?: (selected: boolean) => void;
  /**
   * The selected state (controlled). When provided, the parent owns the
   * state and must update it in response to `onSelectedChange`.
   */
  selected?: boolean;
  /**
   * The size for the icon selector. Matches the sizing scale of `IconButton`.
   *
   * @default "small"
   */
  size?: IconSelectorSize;
  /**
   * The variant for the icon selector. `round` is fully rounded; `full` uses
   * a 4px corner — both shapes are shown in the Figma frames at every size.
   *
   * @default "round"
   */
  variant?: IconSelectorVariant;
}

/**
 * Icon Selectors are binary on/off controls represented by a paired set of
 * icons (outline/filled or default/slash). Behavior mirrors a checkbox: the
 * button toggles `aria-checked` on each activation and announces as a
 * `switch` to assistive tech. Use one of the established icon pairings — do
 * not pair arbitrary icons.
 */
export const IconSelector = React.forwardRef<HTMLButtonElement, IconSelectorProps>(
  (props, ref) => {
    const {
      a11yLabel,
      className,
      color = 'default',
      defaultSelected = false,
      disabled = false,
      iconSelected,
      iconUnselected,
      onClick,
      onSelectedChange,
      selected: controlledSelected,
      size = 'small',
      variant = 'round',
      ...rest
    } = applyCommonProps(props);

    invariant(
      !!a11yLabel,
      '`IconSelector` accessibility violation. `IconSelector` requires an `a11yLabel`.'
    );

    const isControlled = controlledSelected !== undefined;
    const [internalSelected, setInternalSelected] = React.useState(defaultSelected);
    const isSelected = isControlled ? !!controlledSelected : internalSelected;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const next = !isSelected;
      if (!isControlled) setInternalSelected(next);
      emit('ui:icon-selector:change', {a11yLabel, selected: next});
      onSelectedChange?.(next);
      onClick?.(e);
    };

    const classes = cx(
      'ld-iconselector-iconSelector',
      color === 'default' && 'ld-iconselector-defaultColor',
      color === 'white' && 'ld-iconselector-white',
      color === 'primary' && 'ld-iconselector-primary',
      size === 'xsmall' && 'ld-iconselector-xsmall',
      variant === 'round' && 'ld-iconselector-round',
      variant === 'full' && 'ld-iconselector-full',
      isSelected && 'ld-iconselector-selected',
      className
    );

    const activeIcon = isSelected ? iconSelected : iconUnselected;
    const content = React.isValidElement<WithIconProps>(activeIcon)
      ? React.cloneElement(activeIcon, {size: size === 'xsmall' ? 'small' : size})
      : activeIcon;

    return (
      <button
        aria-checked={isSelected}
        aria-label={a11yLabel}
        className={classes}
        data-state={isSelected ? 'on' : 'off'}
        disabled={disabled}
        onClick={handleClick}
        ref={ref}
        role="switch"
        type="button"
        {...rest}
      >
        {content}
      </button>
    );
  }
);

IconSelector.displayName = 'IconSelector';
