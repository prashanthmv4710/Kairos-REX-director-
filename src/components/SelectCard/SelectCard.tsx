'use client';
// @refresh reset

/**
 * @module SelectCard
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
 * For prop API + usage notes, read `SelectCard.md` in this folder
 * or run `npm run ld-kit -- show SelectCard`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {useStableId, invariant, applyCommonProps} from '../../common/helpers';
import {emit} from '../../common/helpers';
import {Checkbox} from '../Checkbox/Checkbox';
import {Radio} from '../Radio/Radio';
import './SelectCard.css';

// ---------------------------------------------------------------------------
// SelectCard - Single Select Mode (Radio)
// ---------------------------------------------------------------------------

export interface SelectCardSingleSelectProps
  extends Omit<
      React.ComponentPropsWithoutRef<'div'>,
      'className' | 'onChange' | 'style'
    > {
  /**
   * Enable single-select mode using Radio button control.
   * When true, only one card in the group can be selected.
   *
   * @default false
   */
  singleSelect: true;

  /**
   * The callback fired when the radio selection changes.
   */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * If the card is checked (selected).
   *
   * @default false
   */
  checked?: boolean;

  /**
   * The radio group name - required for single select to work properly.
   */
  name: string;

  /**
   * The value for the radio.
   */
  value?: number | string;

  /**
   * Disable multi-select specific props for single-select mode.
   */
  indeterminate?: never;
}

// ---------------------------------------------------------------------------
// SelectCard - Multi Select Mode (Checkbox)
// ---------------------------------------------------------------------------

export interface SelectCardMultiSelectProps
  extends Omit<
      React.ComponentPropsWithoutRef<'div'>,
      'className' | 'onChange' | 'style'
    > {
  /**
   * Enable multi-select mode using Checkbox control.
   * When false (or omitted), multiple cards can be selected independently.
   *
   * @default false
   */
  singleSelect?: false;

  /**
   * The callback fired when the checkbox selection changes.
   */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * If the checkbox is checked (selected).
   *
   * @default false
   */
  checked?: boolean;

  /**
   * If the checkbox is indeterminate (shows dash icon).
   * Only applies in multi-select mode.
   *
   * @default false
   */
  indeterminate?: boolean;

  /**
   * The name for the checkbox.
   */
  name?: string;

  /**
   * The value for the checkbox.
   */
  value?: number | string;
}

// ---------------------------------------------------------------------------
// Common SelectCard Props
// ---------------------------------------------------------------------------

export interface SelectCardCommonProps {
  /**
   * The label/title for the card.
   * Required for accessibility unless a11yLabelledBy is provided.
   *
   * The label text is rendered next to the control and automatically becomes
   * the first part of the input's accessible name. Any `children` content is
   * appended as the second part via `aria-labelledby`, so screen readers
   * announce: "[label] [children text], checkbox/radio".
   */
  label?: React.ReactNode;

  /**
   * The accessible label reference IDs for the selection control.
   * Required if omitting `label`. When provided, the consumer is fully
   * responsible for wiring the accessible name.
   */
  a11yLabelledBy?: string;

  /**
   * The content for the card body (e.g. a description or sub-label).
   * When `label` is provided, this content is automatically included in the
   * input's accessible name via `aria-labelledby`.
   */
  children?: React.ReactNode;

  /**
   * If the card selection is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * The id for the selection input.
   */
  id?: string;

  /**
   * The size for the card.
   * `'small'` is 20×20 px control, `'medium'` (default) is 24×24 px.
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium';

  /**
   * Apply custom styles (not recommended for primary styling).
   */
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;

  /**
   * The props spread to the selection control (Checkbox or Radio input).
   *
   * @default {}
   */
  selectProps?: React.ComponentPropsWithoutRef<'input'>;
}

export type SelectCardProps = (
  | SelectCardSingleSelectProps
  | SelectCardMultiSelectProps
) &
  SelectCardCommonProps;

/**
 * SelectCard combines a Card with a Checkbox (multi-select) or Radio (single-select) control.
 * Use this component to allow users to select one or more cards from a list.
 *
 * ## Accessibility
 * - The entire card is a click target — clicking anywhere toggles the control.
 * - When `label` is provided alongside `children`, the input's accessible name
 *   combines both: screen readers announce "[label] [children], checkbox/radio".
 * - Provide `label` OR `a11yLabelledBy` — never both, never neither.
 */
export const SelectCard = React.forwardRef<HTMLInputElement, SelectCardProps>(
  (props, ref) => {
    const {
      a11yLabelledBy,
      checked = false,
      children,
      disabled = false,
      id: initialId,
      indeterminate = false,
      label,
      name,
      onChange,
      selectProps = {},
      singleSelect = false,
      size = 'medium',
      value,
      UNSAFE_className,
      UNSAFE_style,
      ...rest
    } = applyCommonProps(props);

    const hasLabel = (label ? 1 : 0) + (a11yLabelledBy ? 1 : 0) === 1;

    invariant(
      hasLabel,
      '`SelectCard` accessibility violation. `SelectCard` requires a `label` OR an `a11yLabelledBy`.'
    );

    const id = useStableId(initialId);
    const {className: selectClassName, ...selectRest} = selectProps;

    // Stable IDs for aria-labelledby composition.
    // When `label` is provided, we render the label text ourselves (with this id)
    // and pass aria-labelledby to the input pointing to [labelId, descId] so AT
    // announces both the label AND the children as the combined accessible name.
    const labelId = label ? `${id}-label` : undefined;
    const descId = label && children ? `${id}-desc` : undefined;
    // `hasLabel` (checked above) guarantees exactly one of `label` /
    // `a11yLabelledBy` is set, so the non-label branch always has a string.
    const computedA11yLabelledBy: string = label
      ? [labelId, descId].filter(Boolean).join(' ')
      : (a11yLabelledBy as string);

    const cardClasses = cx(
      'ld-select-card-container',
      singleSelect && 'ld-select-card-single-select',
      !singleSelect && 'ld-select-card-multi-select',
      checked && 'ld-select-card-checked',
      disabled && 'ld-select-card-disabled',
      size === 'small' && 'ld-select-card-small',
      UNSAFE_className
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const eventType = singleSelect ? 'ui:select-card:radio:change' : 'ui:select-card:checkbox:change';
      emit(eventType, {name, value, checked: e.target.checked});
      onChange(e);
    };

    // Clicking anywhere on the card (outside the control itself) should toggle
    // the input. We find the input by id to avoid needing an extra internal ref.
    const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      const target = e.target as Element;
      // If the click is already within the control area, the native label/input
      // interaction handles it — avoid double-firing.
      if (target.closest('.ld-select-card-control')) return;
      const input = document.getElementById(id) as HTMLInputElement | null;
      input?.click();
    };

    const commonProps = {
      checked,
      disabled,
      id,
      onChange: handleChange,
      ref,
      size: size as 'small' | 'medium',
      value,
    };

    const radioCheckboxProps = singleSelect
      ? { radioProps: {className: selectClassName, ...selectRest} }
      : { checkboxProps: {className: selectClassName, ...selectRest} };

    // When `label` is provided we pass it to Checkbox/Radio only for visual
    // rendering purposes (we suppress the label from them and render it ourselves
    // with a stable id so we can wire aria-labelledby to both label + children).
    const control = singleSelect ? (
      <Radio
        name={name as string}
        a11yLabelledBy={computedA11yLabelledBy}
        {...commonProps}
        {...radioCheckboxProps}
      />
    ) : (
      <Checkbox
        name={name}
        a11yLabelledBy={computedA11yLabelledBy}
        indeterminate={indeterminate}
        {...commonProps}
        {...radioCheckboxProps}
      />
    );

    return (
      <div
        className={cardClasses}
        style={UNSAFE_style}
        onClick={handleCardClick}
        {...rest}
      >
        <div className={'ld-select-card-content-wrapper'}>
          <div className={'ld-select-card-control'}>
            {control}
            {/* Label text rendered here (not inside Checkbox/Radio) so we can
                assign a stable id for aria-labelledby composition. */}
            {label && (
              <span id={labelId} className="ld-select-card-label-text">
                {label}
              </span>
            )}
          </div>

          {children && (
            <div id={descId} className={'ld-select-card-children'}>
              {children}
            </div>
          )}
        </div>
      </div>
    );
  }
);

SelectCard.displayName = 'SelectCard';
