'use client';
// @refresh reset

/**
 * @module SpinButton
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
 * For prop API + usage notes, read `SpinButton.md` in this folder
 * or run `npm run ld-kit -- show SpinButton`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {invariant, applyCommonProps, useStableId} from '../../common/helpers';
import {ChevronUpIcon, ChevronDownIcon} from '../Icons';
import './SpinButton.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SpinButtonBaseProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style' | 'onChange'> {
  disabled?: boolean;
  max?: number;
  min?: number;
  onChange?: (value: number) => void;
  step?: number;
  value?: number;
}

export interface SpinButtonLabelProps extends SpinButtonBaseProps {
  label: string;
  a11yLabelledBy?: never;
}

export interface SpinButtonA11yProps extends SpinButtonBaseProps {
  label?: never;
  a11yLabelledBy: string;
}

export type SpinButtonProps = SpinButtonLabelProps | SpinButtonA11yProps;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

// ---------------------------------------------------------------------------
// SpinButton
// ---------------------------------------------------------------------------

export const SpinButton: React.FunctionComponent<SpinButtonProps> = (props) => {
  const {
    a11yLabelledBy,
    className,
    disabled = false,
    label,
    max = 100,
    min = 0,
    onChange,
    step = 1,
    value = 0,
    ...rest
  } = applyCommonProps(props);

  const hasA11y = (label ? 1 : 0) + (a11yLabelledBy ? 1 : 0) === 1;
  invariant(
    hasA11y,
    '`SpinButton` accessibility violation. `SpinButton` requires a `label` OR an `a11yLabelledBy`.'
  );

  const inputId = useStableId();
  const [displayValue, setDisplayValue] = React.useState(String(value));
  const [isFocused, setIsFocused] = React.useState(false);

  // Sync displayValue with controlled value when not focused
  React.useEffect(() => {
    if (!isFocused) {
      setDisplayValue(String(value));
    }
  }, [value, isFocused]);

  const commitValue = React.useCallback(
    (next: number) => {
      const clamped = clamp(next, min, max);
      onChange?.(clamped);
      setDisplayValue(String(clamped));
    },
    [min, max, onChange]
  );

  const increment = () => {
    if (!disabled) commitValue(value + step);
  };

  const decrement = () => {
    if (!disabled) commitValue(value - step);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    // Block non-numeric keys early (before the switch) so letters never appear.
    // Allow: digits, minus (for negative min), decimal point, control keys.
    const isDigit = event.key >= '0' && event.key <= '9';
    const isMinus = event.key === '-' && min < 0;
    const isDecimal = event.key === '.' && !Number.isInteger(step);
    const isControl =
      event.key.length > 1 || // named keys: Backspace, Delete, Arrow*, Tab, …
      event.ctrlKey ||
      event.metaKey;
    if (!isDigit && !isMinus && !isDecimal && !isControl) {
      event.preventDefault();
      return;
    }

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        commitValue(value + step);
        break;
      case 'ArrowDown':
        event.preventDefault();
        commitValue(value - step);
        break;
      case 'PageUp':
        event.preventDefault();
        commitValue(value + step * 10);
        break;
      case 'PageDown':
        event.preventDefault();
        commitValue(value - step * 10);
        break;
      case 'Home':
        event.preventDefault();
        commitValue(min);
        break;
      case 'End':
        event.preventDefault();
        commitValue(max);
        break;
      case 'Enter': {
        event.preventDefault();
        const parsed = parseFloat(displayValue);
        commitValue(isNaN(parsed) ? value : parsed);
        break;
      }
      case 'Escape':
        event.preventDefault();
        setDisplayValue(String(value));
        break;
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parseFloat(displayValue);
    commitValue(isNaN(parsed) ? value : parsed);
  };

  return (
    <div className={cx('ld-spinbutton-root', disabled && 'ld-spinbutton-disabled', className)} {...rest}>
      {label && (
        <label className="ld-spinbutton-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="ld-spinbutton-container">
        <input
          aria-labelledby={a11yLabelledBy}
          aria-valuemax={max}
          aria-valuemin={min}
          aria-valuenow={value}
          className="ld-spinbutton-input"
          disabled={disabled}
          id={inputId}
          inputMode="numeric"
          onBlur={handleBlur}
          onChange={(e) => {
            // Strip anything that can't form a valid number (handles paste too).
            const allowed = min < 0 ? /[^0-9.\-]/g : /[^0-9.]/g;
            setDisplayValue(e.target.value.replace(allowed, ''));
          }}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          role="spinbutton"
          type="text"
          value={displayValue}
        />
        <div className="ld-spinbutton-buttons">
          <button
            aria-label="Increment"
            className="ld-spinbutton-btn"
            disabled={disabled || value >= max}
            onClick={increment}
            tabIndex={-1}
            type="button"
          >
            <ChevronUpIcon size="small" />
          </button>
          <button
            aria-label="Decrement"
            className="ld-spinbutton-btn"
            disabled={disabled || value <= min}
            onClick={decrement}
            tabIndex={-1}
            type="button"
          >
            <ChevronDownIcon size="small" />
          </button>
        </div>
      </div>
    </div>
  );
};

SpinButton.displayName = 'SpinButton';
