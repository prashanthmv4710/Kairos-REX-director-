// @refresh reset

/**
 * @module FormGroup
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
 * For prop API + usage notes, read `FormGroup.md` in this folder
 * or run `npm run ld-kit -- show FormGroup`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {FormHelperText} from '../Form';
import './FormGroup.css';

export interface FormGroupProps
  extends Omit<
      React.ComponentPropsWithoutRef<'fieldset'>,
      'className' | 'style'
    > {
  /**
   * The content for the form group.
   */
  children: React.ReactNode;
  /**
   * The error for the form group.
   */
  error?: React.ReactNode;
  /**
   * The helper text for the form group.
   */
  helperText?: React.ReactNode;
  /**
   * The label for the form group.
   */
  label?: React.ReactNode;
}

/**
 * Form Groups let you create a list of grouped form elements. The form elements can be radio buttons, checkboxes, text area, etc.
 * *
 */
export const FormGroup: React.FunctionComponent<FormGroupProps> = (props) => {
  const {children, className, error, helperText, label, ...rest} = applyCommonProps(props);

  // Safari/WebKit bug: unexpected vertical empty space at the bottom of the fieldset
  // when <fieldset> and <legend> elements are used together inside flex container with flex-direction: column.
  // Reference: {@link https://bugs.webkit.org/show_bug.cgi?id=245402}
  return (
    <fieldset className={cx('ld-formgroup-formGroup', className)} {...rest}>
      {(error || helperText || label) && (
        <legend className={'ld-formgroup-formGroupLegend'}>
          {label && <span className={'ld-formgroup-title'}>{label}</span>}

          {(error || helperText) && (
            <div className={'ld-formgroup-helperTextContainer'}>
              <FormHelperText hasError={!!error}>
                {error || helperText}
              </FormHelperText>
            </div>
          )}
        </legend>
      )}

      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return null;
        }
        return <div className={'ld-formgroup-formGroupRow'}>{child}</div>;
      })}
    </fieldset>
  );
};

FormGroup.displayName = 'FormGroup';
