'use client';
// @refresh reset

/**
 * @module Combobox
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
 * For prop API + usage notes, read `Combobox.md` in this folder
 * or run `npm run ld-kit -- show Combobox`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {invariant, applyCommonProps, useStableId} from '../../common/helpers';
import './Combobox.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ComboboxOption {
  value: string;
  text: string;
  disabled?: boolean;
}

interface FluentComboboxBaseProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style' | 'onChange'> {
  disabled?: boolean;
  onChange?: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  selectedValue?: string;
  value?: string;
}

export interface FluentComboboxLabelProps extends FluentComboboxBaseProps {
  label: string;
  a11yLabelledBy?: never;
}

export interface FluentComboboxA11yProps extends FluentComboboxBaseProps {
  label?: never;
  a11yLabelledBy: string;
}

export type FluentComboboxProps = FluentComboboxLabelProps | FluentComboboxA11yProps;

// ---------------------------------------------------------------------------
// FluentCombobox
// ---------------------------------------------------------------------------

export const FluentCombobox: React.FunctionComponent<FluentComboboxProps> = (props) => {
  const {
    a11yLabelledBy,
    className,
    disabled = false,
    label,
    onChange,
    options,
    placeholder,
    selectedValue,
    value: controlledInputValue,
    ...rest
  } = applyCommonProps(props);

  const hasA11y = (label ? 1 : 0) + (a11yLabelledBy ? 1 : 0) === 1;
  invariant(
    hasA11y,
    '`FluentCombobox` accessibility violation. `FluentCombobox` requires a `label` OR an `a11yLabelledBy`.'
  );

  const inputId = useStableId();
  const listboxId = useStableId();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(controlledInputValue || '');
  const [activeIndex, setActiveIndex] = React.useState(-1);

  // Sync input value when controlled
  React.useEffect(() => {
    if (controlledInputValue !== undefined) {
      setInputValue(controlledInputValue);
    }
  }, [controlledInputValue]);

  // Filtered options
  const filtered = React.useMemo(() => {
    if (!inputValue.trim()) return options;
    const q = inputValue.toLowerCase();
    return options.filter((opt) => opt.text.toLowerCase().includes(q));
  }, [options, inputValue]);

  // Active descendant
  const activeDescendantId = activeIndex >= 0 && activeIndex < filtered.length
    ? `${listboxId}-opt-${activeIndex}`
    : undefined;

  // Click outside to close
  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  // Scroll active option into view
  React.useEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    const optionEl = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    optionEl?.scrollIntoView({block: 'nearest'});
  }, [activeIndex, isOpen]);

  const selectOption = (opt: ComboboxOption) => {
    setInputValue(opt.text);
    onChange?.(opt.value);
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setActiveIndex(-1);
    if (!isOpen) setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setActiveIndex(0);
        } else {
          setActiveIndex((i) => (i + 1 >= filtered.length ? 0 : i + 1));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setActiveIndex((i) => (i - 1 < 0 ? filtered.length - 1 : i - 1));
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (isOpen && activeIndex >= 0 && activeIndex < filtered.length) {
          const opt = filtered[activeIndex];
          if (!opt.disabled) selectOption(opt);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;
      case 'Tab':
        setIsOpen(false);
        setActiveIndex(-1);
        break;
      case 'Home':
        if (isOpen) {
          e.preventDefault();
          setActiveIndex(0);
        }
        break;
      case 'End':
        if (isOpen) {
          e.preventDefault();
          setActiveIndex(filtered.length - 1);
        }
        break;
    }
  };

  return (
    <div className={cx('ld-fluentcombobox-root', disabled && 'ld-fluentcombobox-disabled', className)} ref={containerRef} {...rest}>
      {label && (
        <label className="ld-fluentcombobox-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="ld-fluentcombobox-inputWrapper">
        <input
          aria-activedescendant={activeDescendantId}
          aria-autocomplete="list"
          aria-controls={isOpen ? listboxId : undefined}
          aria-expanded={isOpen}
          aria-labelledby={a11yLabelledBy}
          autoComplete="off"
          className="ld-fluentcombobox-input"
          disabled={disabled}
          id={inputId}
          onChange={handleInputChange}
          onClick={() => { if (!isOpen && !disabled) setIsOpen(true); }}
          onFocus={() => { if (!disabled) setIsOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          role="combobox"
          type="text"
          value={inputValue}
        />
        <button
          aria-label={isOpen ? 'Close' : 'Open'}
          className="ld-fluentcombobox-trigger"
          disabled={disabled}
          onClick={() => {
            if (isOpen) {
              setIsOpen(false);
            } else {
              setIsOpen(true);
              inputRef.current?.focus();
            }
          }}
          tabIndex={-1}
          type="button"
        >
          <svg
            aria-hidden="true"
            className={cx('ld-fluentcombobox-chevron', isOpen && 'ld-fluentcombobox-chevronOpen')}
            fill="currentColor"
            height="12"
            viewBox="0 0 20 20"
            width="12"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3.146 7.646a.5.5 0 0 1 .708 0L10 13.793l6.146-6.147a.5.5 0 0 1 .708.708l-6.5 6.5a.5.5 0 0 1-.708 0l-6.5-6.5a.5.5 0 0 1 0-.708Z" />
          </svg>
        </button>
      </div>

      {isOpen && filtered.length > 0 && (
        <div
          className="ld-fluentcombobox-listbox"
          id={listboxId}
          ref={listRef}
          role="listbox"
        >
          {filtered.map((opt, idx) => (
            <div
              aria-disabled={opt.disabled || undefined}
              aria-selected={opt.value === selectedValue}
              className={cx(
                'ld-fluentcombobox-option',
                idx === activeIndex && 'ld-fluentcombobox-optionActive',
                opt.value === selectedValue && 'ld-fluentcombobox-optionSelected',
                opt.disabled && 'ld-fluentcombobox-optionDisabled'
              )}
              id={`${listboxId}-opt-${idx}`}
              key={opt.value}
              onClick={() => { if (!opt.disabled) selectOption(opt); }}
              onMouseEnter={() => setActiveIndex(idx)}
              role="option"
            >
              {opt.text}
              {opt.value === selectedValue && (
                <svg aria-hidden="true" className="ld-fluentcombobox-checkmark" fill="currentColor" height="12" viewBox="0 0 20 20" width="12" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.03 13.72 3.56 10.22a.75.75 0 0 0-1.06 1.06l4 4a.75.75 0 0 0 1.06 0l9-9a.75.75 0 0 0-1.06-1.06L7.03 13.72Z" />
                </svg>
              )}
            </div>
          ))}
        </div>
      )}

      {isOpen && filtered.length === 0 && (
        <div className="ld-fluentcombobox-listbox ld-fluentcombobox-empty" role="listbox">
          <div className="ld-fluentcombobox-noResults">No results found</div>
        </div>
      )}
    </div>
  );
};

FluentCombobox.displayName = 'FluentCombobox';
