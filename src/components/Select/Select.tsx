'use client';
// @refresh reset

/**
 * @module Select
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
 * For prop API + usage notes, read `Select.md` in this folder
 * or run `npm run ld-kit -- show Select`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {useStableId, applyCommonProps} from '../../common/helpers';
import {WithIconProps} from '../../common/types';
import {
  CaretDownIcon,
} from '../Icons';
import {VisuallyHidden} from '../VisuallyHidden';
import {FormHelperText, FormLabel} from '../Form';
import {emit} from '../../common/helpers';
import './Select.css';
export type SelectSize = 'large' | 'small';

export interface SelectProps
  extends Omit<
      React.ComponentPropsWithoutRef<'div'>,
      'className' | 'onChange' | 'style'
    > {
  /**
   * The accessible description of the Select that indicates the involvement of an AI agent.
   *
   * @default "AI Generated"
   */
  a11yMagicLabel?: string;
  /**
   * The content for the select.
   */
  children: React.ReactNode;
  /**
   * If the select is disabled.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * The error for the select.
   */
  error?: React.ReactNode;
  /**
   * The helper text for the select.
   */
  helperText?: React.ReactNode;
  /**
   * The id for the select.
   */
  id?: string;
  /**
   * If the Select should use visual styles that indicate the involvement of an AI agent.
   *
   * @default false
   */
  isMagic?: boolean;
  /**
   * The label for the select.
   */
  label: React.ReactNode;
  /**
   * The leading icon for the select.
   */
  leadingIcon?: React.ReactNode;
  /**
   * The callback fired when the select requests to change.
   */
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  /**
   * The props spread to the select's select element.
   *
   * @default {}
   */
  selectProps?: React.ComponentPropsWithoutRef<'select'>;
  /**
   * The size for the select.
   *
   * @default "large"
   */
  size?: SelectSize;
  /**
   * The value for the select.
   */
  value?: string;
}

/**
 * Select gives users the ability to make a single selection from a number of predefined options. It is usually found in forms.
 *
 * {@link https://digitaltoolkit.livingdesign.walmart.com/components/select/ Guidelines}
 * {@link https://digitaltoolkit.livingdesign.walmart.com/develop/react/components/select/ React documentation}
 *
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (props, ref) => {
    const {
      a11yMagicLabel = 'AI Generated',
      children,
      className,
      disabled = false,
      error,
      helperText,
      id: initialId,
      isMagic = false,
      label,
      leadingIcon,
      onChange,
      selectProps,
      size = 'large',
      value,
      ...rest
    } = applyCommonProps(props);

    const id = useStableId(initialId);
    const helperId = useStableId();
    const magicLabelId = useStableId();

    const hasError = !!error && !disabled;
    const helperContent = hasError ? error : helperText;

    const ariaDescribedBy =
      [isMagic ? magicLabelId : null, helperContent ? helperId : null]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
      <div
        className={cx('ld-select-root', disabled && 'ld-select-disabled', error && 'ld-select-error', isMagic && 'ld-select-isMagic', leadingIcon && 'ld-select-hasLeadingIcon', size === 'large' && 'ld-select-large', size === 'small' && 'ld-select-small', className)}
        {...rest}
      >
        <FormLabel
          className={'ld-select-label'}
          disabled={disabled}
          htmlFor={id}
          isMagic={isMagic}
          size={size}
        >
          {label}
        </FormLabel>

        <div className={'ld-select-container'}>
          {leadingIcon && (
            <span
              aria-hidden
              className={cx('ld-select-icon', 'ld-select-leadingIcon')}
            >
              {React.isValidElement<WithIconProps>(leadingIcon)
                ? React.cloneElement(leadingIcon, {
                    size: "medium",
                  })
                : leadingIcon}
            </span>
          )}

          <select
            aria-describedby={ariaDescribedBy}
            disabled={disabled}
            id={id}
            onChange={(e) => { emit('ui:select:change', {value: e.target.value}); onChange(e); }}
            ref={ref}
            value={value}
            {...selectProps}
            className={cx('ld-select-value', selectProps?.className)}
          >
            {children}
          </select>

          <CaretDownIcon
            className={cx('ld-select-icon', 'ld-select-trailingIcon')}
            size={"medium"}
          />
        </div>

        {isMagic && (
          <VisuallyHidden
            aria-hidden
            id={magicLabelId}
          >{`${a11yMagicLabel},`}</VisuallyHidden>
        )}

        {!!helperContent && (
          <FormHelperText
            className={'ld-select-helperText'}
            disabled={disabled}
            hasError={hasError}
            id={helperId}
          >
            {helperContent}
          </FormHelperText>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
