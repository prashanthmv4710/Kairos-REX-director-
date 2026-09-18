'use client';
// @refresh reset

/**
 * @module SharedForm
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
 * For prop API + usage notes, read `SharedForm.md` in this folder
 * or run `npm run ld-kit -- show SharedForm`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps, useStableId} from '../../common/helpers';
import type {CommonProps} from '../../common/helpers';

import './SharedForm.css';
import './SharedForm.css';

// ---------------------------------------------------------------------------
// Validation types
// ---------------------------------------------------------------------------

export interface ValidationRules {
  required?: boolean | string;
  minLength?: number | {value: number; message: string};
  maxLength?: number | {value: number; message: string};
  pattern?: RegExp | {value: RegExp; message: string};
  validate?: (value: string) => string | true;
}

export interface FieldState {
  value: string;
  error: string | null;
  touched: boolean;
  dirty: boolean;
}

// ---------------------------------------------------------------------------
// Form Context
// ---------------------------------------------------------------------------

interface FormContextValue {
  fields: Record<string, FieldState>;
  registerField: (name: string, rules?: ValidationRules) => void;
  unregisterField: (name: string) => void;
  setFieldValue: (name: string, value: string) => void;
  setFieldTouched: (name: string) => void;
  validateField: (name: string) => string | null;
  validateAll: () => boolean;
  getFieldState: (name: string) => FieldState;
}

const FormContext = React.createContext<FormContextValue>({
  fields: {},
  registerField: () => {},
  unregisterField: () => {},
  setFieldValue: () => {},
  setFieldTouched: () => {},
  validateField: () => null,
  validateAll: () => true,
  getFieldState: () => ({value: '', error: null, touched: false, dirty: false}),
});

// ---------------------------------------------------------------------------
// FormField Context
// ---------------------------------------------------------------------------

interface FormFieldContextValue {
  name: string;
  id: string;
  formItemId: string;
  formDescriptionId: string;
  formMessageId: string;
  rules?: ValidationRules;
}

const FormFieldContext = React.createContext<FormFieldContextValue>({
  name: '',
  id: '',
  formItemId: '',
  formDescriptionId: '',
  formMessageId: '',
});

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

function runValidation(value: string, rules?: ValidationRules): string | null {
  if (!rules) return null;

  // required
  if (rules.required) {
    if (!value || value.trim() === '') {
      if (typeof rules.required === 'string') return rules.required;
      return 'This field is required';
    }
  }

  // minLength
  if (rules.minLength != null) {
    const minLen = typeof rules.minLength === 'object' ? rules.minLength.value : rules.minLength;
    const msg = typeof rules.minLength === 'object' ? rules.minLength.message : `Must be at least ${minLen} characters`;
    if (value.length < minLen) return msg;
  }

  // maxLength
  if (rules.maxLength != null) {
    const maxLen = typeof rules.maxLength === 'object' ? rules.maxLength.value : rules.maxLength;
    const msg = typeof rules.maxLength === 'object' ? rules.maxLength.message : `Must be at most ${maxLen} characters`;
    if (value.length > maxLen) return msg;
  }

  // pattern
  if (rules.pattern) {
    const regex = rules.pattern instanceof RegExp ? rules.pattern : rules.pattern.value;
    const msg = rules.pattern instanceof RegExp ? 'Invalid format' : rules.pattern.message;
    if (!regex.test(value)) return msg;
  }

  // custom validate
  if (rules.validate) {
    const result = rules.validate(value);
    if (result !== true) return result;
  }

  return null;
}

// ---------------------------------------------------------------------------
// Form (root)
// ---------------------------------------------------------------------------

export interface FormProps
  extends Omit<React.ComponentPropsWithoutRef<'form'>, 'className' | 'style' | 'onSubmit'>,
    CommonProps {
  children: React.ReactNode;
  onSubmit?: (values: Record<string, string>, event: React.FormEvent<HTMLFormElement>) => void;
}

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  (props, ref) => {
    const {children, onSubmit, UNSAFE_className, UNSAFE_style, ...rest} = props;

    // Internal ref used to query the DOM for the first error message after submit.
    const internalFormRef = React.useRef<HTMLFormElement>(null);
    const mergedRef = React.useCallback(
      (node: HTMLFormElement | null) => {
        (internalFormRef as React.MutableRefObject<HTMLFormElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLFormElement | null>).current = node;
      },
      [ref],
    );

    const fieldsRef = React.useRef<Record<string, FieldState>>({});
    const rulesRef = React.useRef<Record<string, ValidationRules | undefined>>({});
    const [fields, setFields] = React.useState<Record<string, FieldState>>({});

    const registerField = React.useCallback((name: string, rules?: ValidationRules) => {
      rulesRef.current[name] = rules;
      if (!fieldsRef.current[name]) {
        fieldsRef.current[name] = {value: '', error: null, touched: false, dirty: false};
        setFields((prev) => ({...prev, [name]: fieldsRef.current[name]}));
      }
    }, []);

    const unregisterField = React.useCallback((name: string) => {
      delete fieldsRef.current[name];
      delete rulesRef.current[name];
      setFields((prev) => {
        const next = {...prev};
        delete next[name];
        return next;
      });
    }, []);

    const setFieldValue = React.useCallback((name: string, value: string) => {
      const field = fieldsRef.current[name];
      if (field) {
        field.value = value;
        field.dirty = true;
        // Clear error on change if touched
        if (field.touched) {
          field.error = runValidation(value, rulesRef.current[name]);
        }
        setFields((prev) => ({...prev, [name]: {...field}}));
      }
    }, []);

    const setFieldTouched = React.useCallback((name: string) => {
      const field = fieldsRef.current[name];
      if (field) {
        field.touched = true;
        field.error = runValidation(field.value, rulesRef.current[name]);
        setFields((prev) => ({...prev, [name]: {...field}}));
      }
    }, []);

    const validateField = React.useCallback((name: string): string | null => {
      const field = fieldsRef.current[name];
      if (!field) return null;
      const error = runValidation(field.value, rulesRef.current[name]);
      field.error = error;
      field.touched = true;
      setFields((prev) => ({...prev, [name]: {...field}}));
      return error;
    }, []);

    const validateAll = React.useCallback((): boolean => {
      let isValid = true;
      const updated: Record<string, FieldState> = {};
      for (const name of Object.keys(fieldsRef.current)) {
        const field = fieldsRef.current[name];
        const error = runValidation(field.value, rulesRef.current[name]);
        field.error = error;
        field.touched = true;
        updated[name] = {...field};
        if (error) isValid = false;
      }
      setFields((prev) => ({...prev, ...updated}));
      return isValid;
    }, []);

    const getFieldState = React.useCallback((name: string): FieldState => {
      return fieldsRef.current[name] || {value: '', error: null, touched: false, dirty: false};
    }, []);

    const ctx = React.useMemo<FormContextValue>(
      () => ({fields, registerField, unregisterField, setFieldValue, setFieldTouched, validateField, validateAll, getFieldState}),
      [fields, registerField, unregisterField, setFieldValue, setFieldTouched, validateField, validateAll, getFieldState],
    );

    const handleSubmit = React.useCallback(
      (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isValid = validateAll();
        if (isValid && onSubmit) {
          const values: Record<string, string> = {};
          for (const [name, field] of Object.entries(fieldsRef.current)) {
            values[name] = field.value;
          }
          onSubmit(values, e);
        } else if (!isValid) {
          // Per the Focus vs. Announcement Decision Tree:
          // A failed submit introduces a blocking/corrective requirement → move focus
          // to the first invalid field so screen reader users are immediately aware.
          // setTimeout defers until after React has flushed the error state to the DOM.
          setTimeout(() => {
            const firstInvalid = internalFormRef.current?.querySelector<HTMLElement>(
              'input[aria-invalid="true"], textarea[aria-invalid="true"], select[aria-invalid="true"]',
            );
            firstInvalid?.focus();
          }, 0);
        }
      },
      [validateAll, onSubmit],
    );

    return (
      <FormContext.Provider value={ctx}>
        <form
          ref={mergedRef}
          className={cx('ld-form-root', UNSAFE_className)}
          style={UNSAFE_style}
          onSubmit={handleSubmit}
          noValidate
          {...rest}
        >
          {children}
        </form>
      </FormContext.Provider>
    );
  },
);
Form.displayName = 'Form';

// ---------------------------------------------------------------------------
// FormField
// ---------------------------------------------------------------------------

export interface FormFieldProps {
  children: React.ReactNode;
  name: string;
  rules?: ValidationRules;
}

export const FormField: React.FunctionComponent<FormFieldProps> = (props) => {
  const {children, name, rules} = props;
  const {registerField, unregisterField} = React.useContext(FormContext);
  const fieldId = useStableId();

  React.useEffect(() => {
    registerField(name, rules);
    return () => unregisterField(name);
  }, [name]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update rules without re-registering
  React.useEffect(() => {
    // Re-register if rules change
    registerField(name, rules);
  }, [rules]); // eslint-disable-line react-hooks/exhaustive-deps

  const ctx = React.useMemo<FormFieldContextValue>(
    () => ({
      name,
      id: fieldId,
      formItemId: `${fieldId}-form-item`,
      formDescriptionId: `${fieldId}-form-item-description`,
      formMessageId: `${fieldId}-form-item-message`,
      rules,
    }),
    [name, fieldId, rules],
  );

  return (
    <FormFieldContext.Provider value={ctx}>
      {children}
    </FormFieldContext.Provider>
  );
};
FormField.displayName = 'FormField';

// ---------------------------------------------------------------------------
// useFormField hook
// ---------------------------------------------------------------------------

export function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const formContext = React.useContext(FormContext);
  const fieldState = formContext.getFieldState(fieldContext.name);

  const isRequired = !!fieldContext.rules?.required;

  return {
    ...fieldContext,
    ...fieldState,
    isRequired,
    setValue: (value: string) => formContext.setFieldValue(fieldContext.name, value),
    setTouched: () => formContext.setFieldTouched(fieldContext.name),
    validate: () => formContext.validateField(fieldContext.name),
  };
}

// ---------------------------------------------------------------------------
// FormItem
// ---------------------------------------------------------------------------

export interface FormItemProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'>,
    CommonProps {
  children: React.ReactNode;
}

export const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  (props, ref) => {
    const {children, UNSAFE_className, UNSAFE_style, ...rest} = props;

    return (
      <div
        ref={ref}
        className={cx('ld-form-item', UNSAFE_className)}
        style={UNSAFE_style}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
FormItem.displayName = 'FormItem';

// ---------------------------------------------------------------------------
// SharedFormLabel
// ---------------------------------------------------------------------------

export interface SharedFormLabelProps
  extends Omit<React.ComponentPropsWithoutRef<'label'>, 'className' | 'style'>,
    CommonProps {
  children: React.ReactNode;
  disabled?: boolean;
}

export const SharedFormLabel = React.forwardRef<HTMLLabelElement, SharedFormLabelProps>(
  (props, ref) => {
    const {children, disabled, UNSAFE_className, UNSAFE_style, ...rest} = props;
    const {formItemId, error} = useFormField();

    return (
      <label
        ref={ref}
        className={cx(
          'ld-form-label',
          error && 'ld-form-label-error',
          disabled && 'ld-form-label-disabled',
          UNSAFE_className,
        )}
        style={UNSAFE_style}
        htmlFor={formItemId}
        {...rest}
      >
        {children}
      </label>
    );
  },
);
SharedFormLabel.displayName = 'SharedFormLabel';

// ---------------------------------------------------------------------------
// FormControl
// ---------------------------------------------------------------------------

export interface FormControlProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'>,
    CommonProps {
  children: React.ReactNode;
}

export const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  (props, ref) => {
    const {children, UNSAFE_className, UNSAFE_style, ...rest} = props;
    const {formItemId, formDescriptionId, formMessageId, error, name, value, setValue, setTouched, isRequired} =
      useFormField();

    const child = React.Children.only(children) as React.ReactElement;
    const childProps = child.props as Record<string, unknown>;

    const ariaDescribedBy = error
      ? `${formDescriptionId} ${formMessageId}`
      : formDescriptionId;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValue(e.target.value);
      const originalOnChange = childProps.onChange;
      if (typeof originalOnChange === 'function') {
        (originalOnChange as (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void)(e);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setTouched();
      const originalOnBlur = childProps.onBlur;
      if (typeof originalOnBlur === 'function') {
        (originalOnBlur as (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void)(e);
      }
    };

    const isLdComponent = typeof child.type !== 'string';
    const errorMessage = error || undefined;

    // Determine which nested-props key carries `name` and `onBlur` for this
    // specific LD component. Spreading all three onto every component causes
    // React DOM warnings when the unknown props reach native elements.
    const displayName =
      typeof child.type === 'function' || typeof child.type === 'object'
        ? (child.type as {displayName?: string}).displayName ?? ''
        : '';
    const isTextArea = displayName === 'TextArea';
    const isSelect  = displayName === 'Select' || displayName === 'SelectField';

    // aria-invalid and required must land on the actual <input>/<textarea>, not the
    // outer wrapper div. For LD components they are spread via the nested props object.
    const inputAttrs = {
      name,
      onBlur: handleBlur,
      'aria-invalid': error ? true : undefined,
      ...(isRequired && {required: true}),
    };
    const nestedProps: Record<string, unknown> = isTextArea
      ? {textAreaProps: {...inputAttrs, ...(childProps.textAreaProps as Record<string, unknown> | undefined)}}
      : isSelect
      ? {selectProps: {...inputAttrs, ...(childProps.selectProps as Record<string, unknown> | undefined)}}
      : {textFieldProps: {...inputAttrs, ...(childProps.textFieldProps as Record<string, unknown> | undefined)}};

    const injectedProps: Record<string, unknown> = isLdComponent
      ? {
          id: formItemId,
          'aria-describedby': ariaDescribedBy,
          value,
          error: errorMessage,
          onChange: handleChange,
          ...nestedProps,
        }
      : {
          id: formItemId,
          'aria-describedby': ariaDescribedBy,
          'aria-invalid': error ? true : undefined,
          name,
          value,
          onChange: handleChange,
          onBlur: handleBlur,
          ...(isRequired && {required: true}),
        };

    const enhancedChild = React.cloneElement(child, injectedProps);

    return (
      <div
        ref={ref}
        className={cx('ld-form-control', UNSAFE_className)}
        style={UNSAFE_style}
        {...rest}
      >
        {enhancedChild}
      </div>
    );
  },
);
FormControl.displayName = 'FormControl';

// ---------------------------------------------------------------------------
// FormDescription
// ---------------------------------------------------------------------------

export interface FormDescriptionProps
  extends Omit<React.ComponentPropsWithoutRef<'p'>, 'className' | 'style'>,
    CommonProps {
  children: React.ReactNode;
}

export const FormDescription = React.forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  (props, ref) => {
    const {children, UNSAFE_className, UNSAFE_style, ...rest} = props;
    const {formDescriptionId} = useFormField();

    return (
      <p
        ref={ref}
        id={formDescriptionId}
        className={cx('ld-form-description', UNSAFE_className)}
        style={UNSAFE_style}
        {...rest}
      >
        {children}
      </p>
    );
  },
);
FormDescription.displayName = 'FormDescription';

// ---------------------------------------------------------------------------
// FormMessage
// ---------------------------------------------------------------------------

export interface FormMessageProps
  extends Omit<React.ComponentPropsWithoutRef<'p'>, 'className' | 'style'>,
    CommonProps {
  children?: React.ReactNode;
}

export const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  (props, ref) => {
    const {children, UNSAFE_className, UNSAFE_style, ...rest} = props;
    const {error, formMessageId} = useFormField();
    const body = error || children;

    if (!body) return null;

    return (
      <p
        ref={ref}
        id={formMessageId}
        className={cx('ld-form-message', UNSAFE_className)}
        style={UNSAFE_style}
        role="alert"
        // tabIndex={-1} allows programmatic focus after a failed submit so
        // screen reader users are immediately brought to the first error.
        tabIndex={-1}
        {...rest}
      >
        {body}
      </p>
    );
  },
);
FormMessage.displayName = 'FormMessage';
