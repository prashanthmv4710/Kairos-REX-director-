'use client';
// @refresh reset

/**
 * @module Chip
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
 * For prop API + usage notes, read `Chip.md` in this folder
 * or run `npm run ld-kit -- show Chip`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps, invariant, type CommonProps} from '../../common/helpers';
import {emit} from '../../common/helpers';
import {Icon} from '../Icons/Icons';
import './Chip.css';
// ---------------------------------------------------------------------------
// ChipGroup (inlined sub-component)
// ---------------------------------------------------------------------------

export interface ChipGroupProps
  extends Omit<React.ComponentPropsWithoutRef<'ul'>, 'className' | 'style'> {
  /**
   * The content for the chip group.
   */
  children: React.ReactNode;
  /**
   * Accessible label for the group, announced by screen readers before the
   * individual chip labels. Required when the group has no visible heading —
   * e.g. `aria-label="Filter by category"`.
   */
  'aria-label'?: string;
  /**
   * ID of a visible element that labels the group (alternative to `aria-label`).
   */
  'aria-labelledby'?: string;
}

/**
 * Chip Groups display multiple related chips in a horizontal row to help with arrangement and spacing.
 * *
 */
export const ChipGroup: React.FunctionComponent<ChipGroupProps> = (props) => {
  const {'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, children, className, ...rest} = applyCommonProps(props);

  invariant(
    !!(ariaLabel || ariaLabelledBy),
    'Provide `aria-label` or `aria-labelledby`.',
  );

  return (
    <ul
      className={cx('ld-chip-chipgroup-chipGroup', className)}
      role="group"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      {...rest}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) {
          return null;
        }
        return (
          <li key={index}>
            {child}
          </li>
        );
      })}
    </ul>
  );
};

ChipGroup.displayName = 'ChipGroup';

export type ChipSize = 'large' | 'medium' | 'small';

export interface ChipProps
  extends Omit<React.ComponentPropsWithRef<'button'>, 'className' | 'style'>,
    CommonProps {
  /**
   * The content for the chip.
   */
  children: React.ReactNode;
  /**
   * If the chip is disabled.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * The leading content for the chip.
   */
  leading?: React.ReactNode;
  /**
   * The callback fired when the chip is clicked.
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * If the chip is selected (checked). Sets `aria-checked` on the button.
   *
   * @default false
   */
  selected?: boolean;
  /**
   * If true, shows a selection checkmark when selected and no leading icon is provided.
   *
   * @default false
   */
  selectionIndicator?: boolean;
  /**
   * The size for the chip.
   *
   * @default "medium"
   */
  size?: ChipSize;
  /**
   * If true, renders the chip with fully rounded (pill) corners.
   *
   * @default false
   */
  pill?: boolean;
  /**
   * The trailing content for the chip.
   */
  trailing?: React.ReactNode;
}

/**
 * Chips allow users to make selections, filter content, or trigger actions.
 * *
 */
export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (props, ref) => {
    const {
      children,
      className,
      leading,
      trailing,
      pill = false,
      selected = false,
      selectionIndicator = false,
      size = 'medium',
      onClick,
      ...rest
    } = applyCommonProps(props);
    const showSelectionIndicator = selectionIndicator && selected && !leading;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      emit('ui:chip:click', {selected: !selected, children: typeof children === 'string' ? children : undefined});
      onClick?.(e);
    };

    return (
      <button
        role="checkbox"
        aria-checked={selected}
        className={cx(
          'ld-chip-chip',
          size === 'large' && 'ld-chip-large',
          size === 'medium' && 'ld-chip-medium',
          size === 'small' && 'ld-chip-small',
          (Boolean(leading) || showSelectionIndicator) && 'ld-chip-hasLeading',
          Boolean(trailing) && 'ld-chip-hasTrailing',
          selected && 'ld-chip-selected',
          pill && 'ld-chip-pill',
          className,
        )}
        ref={ref}
        type="button"
        onClick={handleClick}
        {...rest}
      >
        {showSelectionIndicator && (
          <span className={'ld-chip-selectionIndicator'}>
            <Icon name="Check" decorative size={size === 'large' ? 'medium' : 'small'} />
          </span>
        )}
        {leading && <span className={'ld-chip-leading'}>{leading}</span>}
        {children}
        {trailing && <span className={'ld-chip-trailing'}>{trailing}</span>}
      </button>
    );
  }
);

Chip.displayName = 'Chip';
