'use client';
// @refresh reset

/**
 * @module TextField
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
 * For prop API + usage notes, read `TextField.md` in this folder
 * or run `npm run ld-kit -- show TextField`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {useStableId, applyCommonProps} from '../../common/helpers';
import {WithIconProps} from '../../common/types';
import {VisuallyHidden} from '../VisuallyHidden';
import {FormHelperText, FormLabel} from '../Form';
import './TextField.css';
export type TextFieldInputType =
  | 'email'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'text'
  | 'time'
  | 'url';

export type TextFieldSize = 'large' | 'small' | 'xsmall';

export interface TextFieldProps
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
   * The leading icon for the text field.
   */
  leadingIcon?: React.ReactNode;
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
 * Text Fields allow users to enter and edit text.
 *
 * {@link https://digitaltoolkit.livingdesign.walmart.com/components/text-field/ Guidelines}
 * {@link https://digitaltoolkit.livingdesign.walmart.com/develop/react/components/text-field/ React documentation}
 *
 */
export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (props, ref) => {
    const {
      a11yMagicLabel = 'AI Generated',
      className,
      disabled = false,
      error,
      helperText,
      id: initialId,
      isMagic = false,
      label,
      leadingIcon,
      onChange,
      readOnly = false,
      size = 'large',
      textFieldProps,
      trailing,
      type = 'text',
      value = '',
      ...rest
    } = applyCommonProps(props);

    const id = useStableId(initialId);
    const helperId = useStableId();
    const magicLabelId = useStableId();

    const hasError = !!error && !disabled && !readOnly;
    const helperContent = hasError ? error : helperText;

    const ariaDescribedBy =
      [isMagic ? magicLabelId : null, helperContent ? helperId : null]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
      <div
        className={cx('ld-textfield-root', disabled && 'ld-textfield-disabled', error && 'ld-textfield-error', isMagic && 'ld-textfield-isMagic', leadingIcon && 'ld-textfield-hasLeadingIcon', readOnly && 'ld-textfield-readOnly', size === 'large' && 'ld-textfield-large', size === 'small' && 'ld-textfield-small', size === 'xsmall' && 'ld-textfield-xsmall', className)}
        {...rest}
      >
        <FormLabel
          className={'ld-textfield-label'}
          disabled={disabled}
          htmlFor={id}
          isMagic={isMagic}
          size={size === 'large' ? 'large' : 'small'}
        >
          {label}
        </FormLabel>

        <div className={'ld-textfield-container'}>
          {leadingIcon && (
            <span
              aria-hidden
              className={cx('ld-textfield-icon', 'ld-textfield-leadingIcon')}
            >
              {React.isValidElement<WithIconProps>(leadingIcon)
                ? React.cloneElement(leadingIcon, {
                    size: "medium",
                  })
                : leadingIcon}
            </span>
          )}

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
            className={cx('ld-textfield-value', textFieldProps?.className)}
          />

          {isMagic && (
            <VisuallyHidden
              aria-hidden
              id={magicLabelId}
            >{`${a11yMagicLabel},`}</VisuallyHidden>
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
  }
);

TextField.displayName = 'TextField';
