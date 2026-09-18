// @refresh reset

/**
 * @module SearchField
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
 * For prop API + usage notes, read `SearchField.md` in this folder
 * or run `npm run ld-kit -- show SearchField`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/walmart/SearchField.tsx
 *
 * AX Search Field — pill-shaped search input with leading magnifier,
 * inline mic/barcode IconButtons, and a slide-in Cancel link when
 * activated. Sizes xsmall / small / medium / large × default / rounded
 * corner styles.
 *
 * Adaptation: search/clear glyphs use the shared LD icon font, as do
 * mic/barcode. The mic/barcode buttons are plain `<button>`
 * elements with a "ghost" treatment in CSS since
 * `core/IconButton` only exposes `round` / `full` variants.
 */
import * as React from 'react';

import {LinkButton} from '../LinkButton';
import {Icon} from '../Icons';
import {cx} from '../../common/cx';

import './SearchField.css';

export type SearchFieldSize = 'xsmall' | 'small' | 'medium' | 'large';
export type SearchFieldCornerStyle = 'rounded' | 'default';

export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  onCancel?: () => void;
  /** Show microphone icon button in unfilled, resting state. @default true */
  showMic?: boolean;
  /** Show barcode icon button in unfilled, resting state. @default true */
  showBarcode?: boolean;
  onMicClick?: () => void;
  onBarcodeClick?: () => void;
  placeholder?: string;
  disabled?: boolean;
  /** Force the activated/focused visual state without real browser focus. */
  simulateFocused?: boolean;
  size?: SearchFieldSize;
  cornerStyle?: SearchFieldCornerStyle;
  className?: string;
}

const SearchIcon = ({size}: {size: number}) => (
  <Icon name="Search" style={{fontSize: size}} className="ax-search-field__search-icon" decorative />
);

const CloseIcon = ({size}: {size: number}) => (
  <Icon name="Close" style={{fontSize: size}} decorative />
);

export const SearchField: React.FC<SearchFieldProps> = ({
  value,
  onChange,
  onClear,
  onCancel,
  showMic = true,
  showBarcode = true,
  onMicClick,
  onBarcodeClick,
  placeholder = 'Search',
  disabled = false,
  simulateFocused = false,
  size = 'large',
  cornerStyle = 'default',
  className,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const valueOnFocus = React.useRef(value);

  const isActivated = (isFocused || simulateFocused) && !disabled;
  const hasValue = value.length > 0;
  const isSmallVariant = size === 'xsmall' || size === 'small';
  const searchIconSize = isSmallVariant ? 20 : 24;
  const trailingIconSize = isSmallVariant ? 16 : 20;

  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  const handleCancel = () => {
    onChange(valueOnFocus.current);
    onCancel?.();
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const trailingSlot = (() => {
    if (hasValue && !disabled) {
      return (
        <button
          type="button"
          className="ax-search-field__clear"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.stopPropagation();
            handleClear();
          }}
          aria-label="Clear search"
        >
          <CloseIcon size={searchIconSize} />
        </button>
      );
    }
    if (!hasValue && !isActivated && !disabled && (showMic || showBarcode)) {
      return (
        <div className="ax-search-field__trailing">
          {showMic ? (
            <button
              type="button"
              className="ax-search-field__icon-btn"
              aria-label="Search by voice"
              onClick={(e) => {
                e.stopPropagation();
                onMicClick?.();
              }}
            >
              <Icon name="Microphone" decorative style={{fontSize: trailingIconSize}} />
            </button>
          ) : null}
          {showBarcode ? (
            <button
              type="button"
              className="ax-search-field__icon-btn"
              aria-label="Scan barcode"
              onClick={(e) => {
                e.stopPropagation();
                onBarcodeClick?.();
              }}
            >
              <Icon name="Barcode" decorative style={{fontSize: trailingIconSize}} />
            </button>
          ) : null}
        </div>
      );
    }
    return null;
  })();

  return (
    <div className={cx('ax-search-field', className)}>
      <div
        className={cx(
          'ax-search-field__pill',
          `ax-search-field__pill--${size}`,
          cornerStyle === 'default' && 'ax-search-field__pill--square',
          isActivated && 'ax-search-field__pill--activated',
          disabled && 'ax-search-field__pill--disabled',
        )}
        onClick={() => {
          if (!disabled) inputRef.current?.focus();
        }}
      >
        <div className="ax-search-field__icon-wrap" aria-hidden>
          <SearchIcon size={searchIconSize} />
        </div>

        <div className="ax-search-field__input-area">
          <input
            ref={inputRef}
            type="search"
            className="ax-search-field__input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => {
              valueOnFocus.current = value;
              setIsFocused(true);
            }}
            onBlur={() => setIsFocused(false)}
            placeholder=""
            disabled={disabled}
            aria-label={placeholder}
            autoComplete="off"
          />
          {!isActivated && !hasValue ? (
            <span className="ax-search-field__placeholder" aria-hidden>
              {placeholder}
            </span>
          ) : null}
        </div>

        {trailingSlot}
      </div>

      {isActivated && !disabled ? (
        <LinkButton
          type="button"
          size="medium"
          color="default"
          onMouseDown={(e: React.MouseEvent) => {
            e.preventDefault();
            handleCancel();
          }}
        >
          Cancel
        </LinkButton>
      ) : null}
    </div>
  );
};

SearchField.displayName = 'SearchField';
