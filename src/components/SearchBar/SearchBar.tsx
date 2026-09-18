// @refresh reset

/**
 * @module SearchBar
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
 * For prop API + usage notes, read `SearchBar.md` in this folder
 * or run `npm run ld-kit -- show SearchBar`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {CloseIcon, SearchIcon} from '../Icons';
import {emit} from '../../common/helpers';
import './SearchBar.css';

export type SearchBarVariant = 'pill' | 'inline';
export type SearchBarSize = 'small' | 'large';

export interface SearchBarProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  disabled?: boolean;
  /**
   * Visual treatment. `'pill'` (default) is the full-width rounded search field
   * with a Cancel affordance, intended as a primary/page search. `'inline'` is a
   * compact rounded-rectangle field for searching within a section of a page.
   */
  variant?: SearchBarVariant;
  /**
   * Height of the field. Only applies to the `'inline'` variant —
   * `'small'` (32px) or `'large'` (40px). Defaults to `'large'`.
   */
  size?: SearchBarSize;
  /**
   * Leading icon shown before the input. Defaults to a search icon.
   * Pass `null` to remove the leading icon entirely.
   */
  leadingIcon?: React.ReactNode;
  /**
   * Trailing icon shown after the input when the field is empty. When the field
   * has a value, the clear (×) button takes the trailing slot instead (unless
   * `showClear` is `false`). Only applies to the `'inline'` variant.
   */
  trailingIcon?: React.ReactNode;
  /**
   * Whether to show the clear (×) button when the field has a value.
   * Defaults to `true`.
   */
  showClear?: boolean;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

export const SearchBar: React.FunctionComponent<SearchBarProps> = (props) => {
  const {
    value,
    onChange,
    onClear,
    onCancel,
    placeholder = 'Enter search term(s)',
    disabled = false,
    variant = 'pill',
    size = 'large',
    leadingIcon,
    trailingIcon,
    showClear = true,
    className,
    ...rest
  } = applyCommonProps(props);
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isActivated = isFocused;
  const hasValue = value.length > 0;

  // Track focus at the container level so Tabbing between input → clear → cancel
  // doesn't collapse the activated state. Only deactivate when focus truly leaves
  // the component (relatedTarget is null or outside the container).
  const handleContainerFocus = () => setIsFocused(true);
  const handleContainerBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setIsFocused(false);
    }
  };

  const handleClear = () => {
    emit('ui:search:clear', {previousValue: value});
    onChange('');
    onClear?.();
    inputRef.current?.focus();
  };

  const handleCancel = () => {
    emit('ui:search:cancel', {previousValue: value});
    onChange('');
    onCancel?.();
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handlePillClick = () => {
    if (!disabled) inputRef.current?.focus();
  };

  if (variant === 'inline') {
    const showClearBtn = showClear && hasValue;
    return (
      <div className={cx('ld-wcp-searchbar-wrapper', 'ld-wcp-searchbar-inlineWrapper', className)} role="search" {...rest}>
        <div
          className={cx(
            'ld-wcp-searchbar-inline',
            size === 'small' && 'ld-wcp-searchbar-inlineSmall',
            size === 'large' && 'ld-wcp-searchbar-inlineLarge',
            isActivated && 'ld-wcp-searchbar-inlineActivated',
            disabled && 'ld-wcp-searchbar-inlineDisabled'
          )}
          onClick={handlePillClick}
        >
          {leadingIcon !== null && (
            <span className="ld-wcp-searchbar-inlineLeadingIcon" aria-hidden="true">
              {leadingIcon ?? <SearchIcon decorative />}
            </span>
          )}
          <input
            ref={inputRef}
            type="search"
            className="ld-wcp-searchbar-input ld-wcp-searchbar-inlineInput"
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            aria-label={placeholder}
            autoComplete="off"
          />
          {showClearBtn ? (
            <button
              type="button"
              className="ld-wcp-searchbar-clearBtn ld-wcp-searchbar-inlineClearBtn"
              onClick={e => { e.stopPropagation(); handleClear(); }}
              aria-label="Clear search"
              tabIndex={0}
            >
              <CloseIcon size={size === 'small' ? 'small' : 'medium'} />
            </button>
          ) : (
            trailingIcon != null && (
              <span className="ld-wcp-searchbar-inlineTrailingIcon" aria-hidden="true">
                {trailingIcon}
              </span>
            )
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cx('ld-wcp-searchbar-wrapper', className)}
      role="search"
      onFocus={handleContainerFocus}
      onBlur={handleContainerBlur}
      {...rest}
    >
      <div
        className={cx(
          'ld-wcp-searchbar-pill',
          isActivated && 'ld-wcp-searchbar-pillActivated',
          disabled && 'ld-wcp-searchbar-pillDisabled'
        )}
        onClick={handlePillClick}
      >
        <div className="ld-wcp-searchbar-iconWrapper" aria-hidden="true">
          {leadingIcon ?? <i className="ld ld-Search ld-wcp-searchbar-searchIcon" aria-hidden="true" style={{fontSize: '24px'}} />}
        </div>
        <div className="ld-wcp-searchbar-inputArea">
          <input
            ref={inputRef}
            type="search"
            className="ld-wcp-searchbar-input"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={isActivated ? placeholder : ''}
            disabled={disabled}
            aria-label={placeholder}
            autoComplete="off"
          />
          {!isActivated && !hasValue && (
            <span className="ld-wcp-searchbar-placeholder" aria-hidden="true">{placeholder}</span>
          )}
        </div>
        {isActivated && hasValue && (
          <button
            type="button"
            className="ld-wcp-searchbar-clearBtn"
            onClick={e => { e.stopPropagation(); handleClear(); }}
            aria-label="Clear search"
          >
            <CloseIcon size="medium" />
          </button>
        )}
      </div>
      {isActivated && !disabled && (
        <button
          type="button"
          className="ld-wcp-searchbar-cancelBtn"
          aria-label="Cancel search"
          onMouseDown={e => e.preventDefault()}
          onClick={handleCancel}
        >
          Cancel
        </button>
      )}
    </div>
  );
};

SearchBar.displayName = 'SearchBar';
