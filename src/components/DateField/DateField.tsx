'use client';
// @refresh reset

/**
 * @module DateField
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
 * For prop API + usage notes, read `DateField.md` in this folder
 * or run `npm run ld-kit -- show DateField`.
 */

import * as React from 'react';

import {applyCommonProps} from '../../common/helpers';
import {TextField} from '../TextField';
import {useDateField} from '../DatePicker';

export type DateFieldSize = 'large' | 'small';

export interface DateFieldProps
  extends Omit<
      React.ComponentPropsWithoutRef<'div'>,
      'className' | 'onChange' | 'style'
    > {
  /**
   * If the date field is disabled.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * The error for the date field.
   */
  error?: React.ReactNode;
  /**
   * The date string format for the date field.
   *
   * @default "MM/dd/yyyy"
   */
  format?: string;
  /**
   * The helper text for the date field.
   */
  helperText?: React.ReactNode;
  /**
   * The id for the date field.
   */
  id?: string;
  /**
   * The label for the date field.
   */
  label: React.ReactNode;
  /**
   * The callback fired when the date field requests to change.
   */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * If the date field is read only.
   *
   * @default false
   */
  readOnly?: boolean;
  /**
   * The callback fired when date picker date field input is invalid.
   *
   * @default () => {
   *   return `Use the required format {props.format}`;
   * }
   */
  renderError?: (error?: Error) => string;
  /**
   * The size for the date field.
   *
   * @default "large"
   */
  size?: DateFieldSize;
  /**
   * The props spread to the date field's input element.
   *
   * @default {}
   */
  textFieldProps?: React.ComponentPropsWithoutRef<'input'>;
  /**
   * The value for the date field.
   *
   * @default ""
   */
  value?: string;
}

/**
 * Date Fields allow users to enter a single date in a field.
 * *
 */
export const DateField = React.forwardRef<HTMLInputElement, DateFieldProps>(
  (props, ref) => {
    const {
      className,
      error: errorProp,
      format = 'MM/dd/yyyy',
      label,
      renderError: renderErrorProp,
      textFieldProps = {},
      value = '',
      ...rest
    } = applyCommonProps(props);

    const [error, setError] = React.useState<string>('');

    const renderError = React.useMemo(
      () => renderErrorProp ?? (() => `Use the required format ${format}`),
      [format, renderErrorProp]
    );

    const {validateValue} = useDateField({
      format,
      renderError,
      setError,
    });

    return (
      <TextField
        error={errorProp ?? error}
        label={label}
        ref={ref}
        onBlur={() => validateValue(value)}
        textFieldProps={{
          ...textFieldProps,
          type: 'text',
        }}
        UNSAFE_className={className}
        value={value}
        {...rest}
      />
    );
  }
);

DateField.displayName = 'DateField';
