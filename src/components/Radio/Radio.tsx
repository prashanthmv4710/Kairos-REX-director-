'use client';
// @refresh reset

/**
 * @module Radio
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
 * For prop API + usage notes, read `Radio.md` in this folder
 * or run `npm run ld-kit -- show Radio`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {useStableId, invariant, remToPxValue, applyCommonProps} from '../../common/helpers';
import {emit} from '../../common/helpers';
import './Radio.css';
interface RadioBaseProps
  extends Omit<
      React.ComponentPropsWithoutRef<'label'>,
      'clasName' | 'onChange' | 'style'
    > {
  /**
   * If the radio is checked.
   *
   * @default false
   */
  checked?: boolean;
  /**
   * If the radio is disabled.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * The id for the radio.
   */
  id?: string;
  /**
   * The name for the radio.
   */
  name: string;
  /**
   * The callback fired when the radio requests to change.
   */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * The props spread to the radio's input element.
   *
   * @default {}
   */
  radioProps?: React.ComponentPropsWithoutRef<'input'>;
  /**
   * The size of the radio control. `'small'` is 20×20 px, `'medium'`
   * (default) is 24×24 px.
   *
   * Sizing rationale: Radio tops out at `'medium'` on purpose. There is
   * no `'large'` because form controls should not visually outweigh the
   * surrounding body text — anything larger competes with the label and
   * pulls focus away from the prompt. `'small'` is reserved for dense
   * surfaces where a Radio is rendered inside another control, such as
   * single-select Select dropdowns and menu items. For forms, dialogs,
   * preference lists, and most page-level use, stay on `'medium'`.
   *
   * @alpha New API — may change before it stabilizes.
   * @default 'medium'
   */
  size?: 'small' | 'medium';
  /**
   * The value for the radio.
   */
  value?: number | string;
}

export interface RadioA11yProps extends RadioBaseProps {
  /**
   * The accessible label reference IDs for the radio (Required if omitting `label`).
   */
  a11yLabelledBy: string;
  label?: never;
}

export interface RadioLabelProps extends RadioBaseProps {
  /**
   * The label for the radio (Required if omitting `a11yLabelledBy`).
   */
  label: React.ReactNode;
  a11yLabelledBy?: never;
}

export type RadioProps = RadioA11yProps | RadioLabelProps;

/**
 * Radio Buttons represent a group of mutually exclusive choices.
 *
 * {@link https://digitaltoolkit.livingdesign.walmart.com/components/radio/ Guidelines}
 * {@link https://digitaltoolkit.livingdesign.walmart.com/develop/react/components/radio/ React documentation}
 *
 */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (props, ref) => {
    const {
      a11yLabelledBy,
      checked = false,
      className,
      disabled = false,
      id: initialId,
      label,
      name,
      onChange,
      radioProps = {},
      size = 'medium',
      value,
      ...rest
    } = applyCommonProps(props);

    const labelCount = (label ? 1 : 0) + (a11yLabelledBy ? 1 : 0) === 1;

    invariant(
      labelCount,
      '`Radio` accessibility violation. `Radio` requires a `label` OR an `a11yLabelledBy`.'
    );

    const {className: radioClassName, ...radioRest} = radioProps;
    const id = useStableId(initialId);
    const inputBorderHeight = React.useMemo(
      () => remToPxValue(size === 'small' ? "1.25rem" : "1.5rem"),
      [size]
    );

    return (
      <label
        className={cx('ld-radio-label', size === 'small' && 'ld-radio-small', checked && 'ld-radio-checked', disabled && 'ld-radio-disabled', className)}
        htmlFor={id}
        {...rest}
      >
        <input
          checked={checked}
          className={cx('ld-radio-input', radioClassName)}
          disabled={disabled}
          id={id}
          name={name}
          onChange={(e) => { emit('ui:radio:change', {name, value}); onChange(e); }}
          ref={ref}
          type="radio"
          {...(a11yLabelledBy && {'aria-labelledby': a11yLabelledBy})}
          {...(value && {value})}
          {...radioRest}
        />

        <svg
          aria-hidden
          className={'ld-radio-radioInput'}
          viewBox={`0 0 ${inputBorderHeight} ${inputBorderHeight}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className={'ld-radio-radioInputOuter'}
            cx={inputBorderHeight / 2}
            cy={inputBorderHeight / 2}
          />
          <circle
            className={'ld-radio-radioInputInner'}
            cx={inputBorderHeight / 2}
            cy={inputBorderHeight / 2}
          />
        </svg>

        {label && <span className={'ld-radio-labelText'}>{label}</span>}
      </label>
    );
  }
);

Radio.displayName = 'Radio';
