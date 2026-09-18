'use client';
// @refresh reset

/**
 * @module TextFieldSplit
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
 * For prop API + usage notes, read `TextFieldSplit.md` in this folder
 * or run `npm run ld-kit -- show TextFieldSplit`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {useStableId, applyCommonProps} from '../../common/helpers';
import {CaretDownIcon} from '../Icons';
import {VisuallyHidden} from '../VisuallyHidden';
import {FormHelperText, FormLabel} from '../Form';
import type {TextFieldInputType, TextFieldSize} from '../TextField/TextField';
import '../TextField/TextField.css';
import './TextFieldSplit.css';

export interface TextFieldSplitProps
  extends Omit<
      React.ComponentPropsWithoutRef<'div'>,
      'className' | 'onChange' | 'style'
    > {
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
  /**
   * The accessible description of the Text Field that indicates the involvement of an AI agent.
   *
   * @default "AI Generated"
   */
  a11yMagicLabel?: string;
  /**
   * If the text field is disabled.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * The error for the text field.
   */
  error?: React.ReactNode;
  /**
   * The helper text for the text field.
   */
  helperText?: React.ReactNode;
  /**
   * The id for the text field.
   */
  id?: string;
  /**
   * If the Text Field should use visual styles that indicate the involvement of an AI agent.
   *
   * @default false
   */
  isMagic?: boolean;
  /**
   * The label for the text field.
   */
  label: React.ReactNode;
  /**
   * The callback fired when the text field requests to change.
   */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * If the text field is read only.
   *
   * @default false
   */
  readOnly?: boolean;
  /**
   * The visually hidden accessible label for the leading select. The visible
   * FormLabel describes the trailing input, so the select needs its own.
   */
  selectA11yLabel: string;
  /**
   * The option elements rendered inside the leading select.
   */
  selectChildren: React.ReactNode;
  /**
   * The callback fired when the leading select changes.
   */
  selectOnChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  /**
   * Props spread to the leading select element.
   *
   * @default {}
   */
  selectProps?: React.ComponentPropsWithoutRef<'select'>;
  /**
   * The value for the leading select.
   */
  selectValue?: string;
  /**
   * The size for the text field.
   *
   * @default "large"
   */
  size?: TextFieldSize;
  /**
   * The props spread to the text field's input element.
   *
   * @default {}
   */
  textFieldProps?: React.ComponentPropsWithoutRef<'input'>;
  /**
   * The trailing content for the text field.
   */
  trailing?: React.ReactNode;
  /**
   * The type for the text field.
   *
   * @default "text"
   */
  type?: TextFieldInputType;
  /**
   * The value for the text field.
   *
   * @default ""
   */
  value?: string;
}

/**
 * Text Field Split pairs a leading Select with a Text Field input — useful for
 * inputs whose meaning depends on a unit, prefix, or category (country code +
 * phone number, currency + amount, protocol + URL).
 */
export const TextFieldSplit = React.forwardRef<
  HTMLInputElement,
  TextFieldSplitProps
>((props, ref) => {
  const {
    a11yMagicLabel = 'AI Generated',
    className,
    disabled = false,
    error,
    helperText,
    id: initialId,
    isMagic = false,
    label,
    onChange,
    readOnly = false,
    selectA11yLabel,
    selectChildren,
    selectOnChange,
    selectProps,
    selectValue,
    size = 'large',
    textFieldProps,
    trailing,
    type = 'text',
    value = '',
    ...rest
  } = applyCommonProps(props);

  const id = useStableId(initialId);
  const selectId = useStableId();
  const helperId = useStableId();
  const magicLabelId = useStableId();
  const selectDescId = useStableId();

  const hasError = !!error && !disabled && !readOnly;
  const helperContent = hasError ? error : helperText;

  const ariaDescribedBy =
    [selectDescId, isMagic ? magicLabelId : null, helperContent ? helperId : null]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <div
      className={cx(
        'ld-textfield-root',
        'ld-textfieldsplit-root',
        disabled && 'ld-textfield-disabled',
        error && 'ld-textfield-error',
        isMagic && 'ld-textfield-isMagic',
        readOnly && 'ld-textfield-readOnly',
        size === 'large' && 'ld-textfield-large',
        size === 'small' && 'ld-textfield-small',
        className
      )}
      {...rest}
    >
      <FormLabel
        className={'ld-textfield-label'}
        disabled={disabled}
        htmlFor={id}
        isMagic={isMagic}
        size={size === 'xsmall' ? 'small' : size}
      >
        {label}
      </FormLabel>

      <div className={cx('ld-textfield-container', 'ld-textfieldsplit-container')}>
        <span className={'ld-textfieldsplit-selectWrap'}>
          <VisuallyHidden as="label" htmlFor={selectId}>
            {selectA11yLabel}
          </VisuallyHidden>
          <select
            disabled={disabled}
            id={selectId}
            onChange={selectOnChange}
            value={selectValue}
            {...selectProps}
            className={cx('ld-textfieldsplit-select', selectProps?.className)}
          >
            {selectChildren}
          </select>
          <CaretDownIcon
            aria-hidden
            className={'ld-textfieldsplit-selectCaret'}
            size="medium"
          />
        </span>

        <span aria-hidden className={'ld-textfieldsplit-divider'} />

        {/* Describes the current select value to the input — e.g. "Country code: +1" */}
        <VisuallyHidden id={selectDescId} aria-hidden="true" className="ld-a11y-nameSource">
          {`${selectA11yLabel}: ${selectValue ?? ''}`}
        </VisuallyHidden>

        <input
          aria-describedby={ariaDescribedBy}
          disabled={disabled}
          id={id}
          onChange={onChange}
          readOnly={readOnly}
          ref={ref}
          type={type}
          value={value}
          {...textFieldProps}
          className={cx('ld-textfield-value', 'ld-textfieldsplit-value', textFieldProps?.className)}
        />

        {isMagic && (
          <VisuallyHidden aria-hidden id={magicLabelId}>{`${a11yMagicLabel},`}</VisuallyHidden>
        )}

        {trailing && (
          <span className={cx('ld-textfield-icon', 'ld-textfield-trailing')}>
            {trailing}
          </span>
        )}
      </div>

      {!!helperContent && (
        <FormHelperText
          className={'ld-textfield-helperText'}
          disabled={disabled}
          id={helperId}
          hasError={hasError}
        >
          {helperContent}
        </FormHelperText>
      )}
    </div>
  );
});

TextFieldSplit.displayName = 'TextFieldSplit';
