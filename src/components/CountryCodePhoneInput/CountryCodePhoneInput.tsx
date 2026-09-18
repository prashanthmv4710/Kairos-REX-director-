// @refresh reset

/**
 * @module CountryCodePhoneInput
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
 * For prop API + usage notes, read `CountryCodePhoneInput.md` in this folder
 * or run `npm run ld-kit -- show CountryCodePhoneInput`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {CaretDownIcon, ExclamationCircleIcon} from '../Icons';
import {Country, WCP_DEFAULT_COUNTRIES, CountrySelectBottomSheet} from '../CountrySelectBottomSheet';
import {VisuallyHidden} from '../VisuallyHidden';
import './CountryCodePhoneInput.css';

export type {Country} from '../CountrySelectBottomSheet';

export interface CountryCodePhoneInputProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style' | 'onChange'> {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  selectedCountry?: Country;
  onCountryChange?: (country: Country) => void;
  countries?: Country[];
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  helperText?: string;
  errorText?: string;
  placeholder?: string;
  id?: string;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

export const CountryCodePhoneInput: React.FunctionComponent<CountryCodePhoneInputProps> = (props) => {
  const {
    label = 'Phone number*',
    value = '',
    onChange,
    selectedCountry: controlledCountry,
    onCountryChange,
    countries = WCP_DEFAULT_COUNTRIES,
    disabled = false,
    readOnly = false,
    error = false,
    helperText = "We'll contact you in case anything comes up with your order.",
    errorText = 'Please enter a valid number',
    placeholder = '(000) 000-0000',
    id,
    className,
    ...rest
  } = applyCommonProps(props);

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [internalCountry, setInternalCountry] = React.useState<Country>(
    () => countries.find(c => c.code === 'US') || countries[0]
  );

  const country = controlledCountry ?? internalCountry;

  const handleCountryConfirm = (selected: Country | undefined) => {
    if (!selected) return;
    setInternalCountry(selected);
    onCountryChange?.(selected);
  };

  const autoId = React.useId();
  const inputId = id || autoId;
  const labelId = `${inputId}-label`;
  const countryStatusId = `${inputId}-country-status`;
  const helperTextId = `${inputId}-helper`;
  const errorTextId = `${inputId}-error`;

  return (
    <div className={cx('ld-wcp-countrycodephoneinput-root', className)} {...rest}>
      <label id={labelId} className={cx('ld-wcp-countrycodephoneinput-label', disabled && 'ld-wcp-countrycodephoneinput-labelDisabled')} htmlFor={inputId}>
        {label}
      </label>
      <div className={cx(
        'ld-wcp-countrycodephoneinput-container',
        error && 'ld-wcp-countrycodephoneinput-containerError',
        disabled && 'ld-wcp-countrycodephoneinput-containerDisabled',
        readOnly && 'ld-wcp-countrycodephoneinput-containerReadOnly',
      )}>
        <button
          type="button"
          className="ld-wcp-countrycodephoneinput-countryTrigger"
          onClick={() => !disabled && !readOnly && setSheetOpen(true)}
          disabled={disabled || readOnly}
          aria-label={`Select country, current: ${country.name} ${country.abbr} ${country.dialCode}`}
        >
          <img src={country.flagUrl} alt="" className="ld-wcp-countrycodephoneinput-triggerFlag" />
          <span className="ld-wcp-countrycodephoneinput-triggerAbbr">{country.abbr}</span>
          <span className="ld-wcp-countrycodephoneinput-triggerDialCode">{country.dialCode}</span>
          <span className="ld-wcp-countrycodephoneinput-caret"><CaretDownIcon size="small" /></span>
        </button>
        {/* Visually hidden — appended to input's label so AT reads "Phone number*, US +1 selected," */}
        <span id={countryStatusId} className="ld-wcp-countrycodephoneinput-srOnly">
          {`${country.abbr} ${country.dialCode} selected,`}
        </span>
        <span className="ld-wcp-countrycodephoneinput-divider" />
        <input
          id={inputId}
          type="tel"
          className="ld-wcp-countrycodephoneinput-phoneInput"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          aria-labelledby={`${labelId} ${countryStatusId}`}
          aria-describedby={error ? errorTextId : helperText ? helperTextId : undefined}
          aria-invalid={error || undefined}
        />
      </div>
      {error ? (
        <div id={errorTextId} className="ld-wcp-countrycodephoneinput-errorRow">
          <VisuallyHidden>Error: </VisuallyHidden>
          <span className="ld-wcp-countrycodephoneinput-errorIcon"><ExclamationCircleIcon size="small" /></span>
          <span className="ld-wcp-countrycodephoneinput-errorText">{errorText}</span>
        </div>
      ) : helperText ? (
        <span id={helperTextId} className={cx('ld-wcp-countrycodephoneinput-helperText', disabled && 'ld-wcp-countrycodephoneinput-helperTextDisabled')}>
          {helperText}
        </span>
      ) : null}
      <CountrySelectBottomSheet
        open={sheetOpen}
        countries={countries}
        value={country.code}
        variant="flat"
        onConfirm={handleCountryConfirm}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
};
CountryCodePhoneInput.displayName = 'CountryCodePhoneInput';
