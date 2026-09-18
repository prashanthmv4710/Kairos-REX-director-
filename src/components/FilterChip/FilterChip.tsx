// @refresh reset

/**
 * @module FilterChip
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
 * For prop API + usage notes, read `FilterChip.md` in this folder
 * or run `npm run ld-kit -- show FilterChip`.
 */

/**
 * @source PX
 *
 * FilterChip — Living Design 3.5 / PX
 *
 * Interactive, selectable pill-shaped toggle buttons for filtering.
 * Exposes selected state via `aria-pressed` and uses the FILTER semantic
 * token family. Three variants: Toggle, Multi-Select, All Filters.
 */
import * as React from 'react';
import {Icon} from '../Icons';
import './FilterChip.css';

/* -------------------------------------------------------------------------- */
/*  Props                                                                      */
/* -------------------------------------------------------------------------- */

export interface FilterChipProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'className' | 'style'
  > {
  /** Whether the filter chip is in selected/pressed state. @default false */
  selected?: boolean;
  /** Callback when filter chip selection changes. */
  onSelectedChange?: (selected: boolean) => void;
  /** Optional leading icon/content. Ignored when `isAllFilters` is true. */
  iconLeading?: React.ReactNode;
  /** Optional trailing icon/content. Ignored when `isMultiSelect` is true. */
  iconTrailing?: React.ReactNode;
  /** Whether the filter chip is disabled. @default false */
  disabled?: boolean;
  /**
   * Enable Multi-Select variant with chevron icons.
   * @default false
   */
  isMultiSelect?: boolean;
  /**
   * Controls the open/closed state for Multi-Select variant.
   * @default false
   */
  isOpen?: boolean;
  /**
   * Enable "All Filters" variant with Sliders icon.
   * @default false
   */
  isAllFilters?: boolean;
  /**
   * Show text label in All Filters variant.
   * @default true
   */
  showLabel?: boolean;
  /**
   * Show count in parentheses when `count` is provided.
   * @default false
   */
  showCount?: boolean;
  /** Active filter count to display. */
  count?: number;
  /** Escape hatch for additional CSS classes. */
  UNSAFE_className?: string;
  /** Escape hatch for inline styles. */
  UNSAFE_style?: React.CSSProperties;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export const FilterChip = React.forwardRef<HTMLButtonElement, FilterChipProps>(
  (
    {
      selected = false,
      onSelectedChange,
      iconLeading,
      iconTrailing,
      disabled = false,
      children,
      onClick,
      isAllFilters = false,
      isMultiSelect = false,
      isOpen = false,
      showLabel = true,
      showCount = false,
      count,
      UNSAFE_className,
      UNSAFE_style,
      ...restProps
    },
    ref,
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        onSelectedChange?.(!selected);
      }
      onClick?.(e);
    };

    const rootClass = [
      'px-filter-chip',
      selected && 'px-filter-chip--selected',
      isAllFilters && 'px-filter-chip--allFilters',
      isMultiSelect && 'px-filter-chip--multiSelect',
      UNSAFE_className,
    ]
      .filter(Boolean)
      .join(' ');

    const countText =
      showCount && typeof count === 'number' && count > 0 ? ` (${count})` : '';

    // All Filters variant
    if (isAllFilters) {
      const labelText = showLabel ? (children || 'All Filters') : null;
      return (
        <button
          ref={ref}
          type="button"
          className={rootClass}
          style={UNSAFE_style}
          disabled={disabled}
          aria-pressed={selected}
          onClick={handleClick}
          {...restProps}
        >
          <span className="px-filter-chip__icon-leading">
            <Icon name="Sliders" decorative />
          </span>
          {(labelText || countText) && (
            <span className="px-filter-chip__label">
              {labelText}{countText}
            </span>
          )}
        </button>
      );
    }

    // Multi-Select variant
    if (isMultiSelect) {
      return (
        <button
          ref={ref}
          type="button"
          className={rootClass}
          style={UNSAFE_style}
          disabled={disabled}
          aria-pressed={selected}
          aria-expanded={isOpen}
          onClick={handleClick}
          {...restProps}
        >
          {iconLeading && (
            <span className="px-filter-chip__icon-leading">{iconLeading}</span>
          )}
          <span className="px-filter-chip__label">
            {children}{countText}
          </span>
          <span className="px-filter-chip__icon-trailing">
            <Icon name={isOpen ? 'ChevronUp' : 'ChevronDown'} decorative />
          </span>
        </button>
      );
    }

    // Standard Toggle variant
    return (
      <button
        ref={ref}
        type="button"
        className={rootClass}
        style={UNSAFE_style}
        disabled={disabled}
        aria-pressed={selected}
        onClick={handleClick}
        {...restProps}
      >
        {iconLeading && (
          <span className="px-filter-chip__icon-leading">{iconLeading}</span>
        )}
        <span className="px-filter-chip__label">{children}</span>
        {iconTrailing && (
          <span className="px-filter-chip__icon-trailing">{iconTrailing}</span>
        )}
      </button>
    );
  },
);

FilterChip.displayName = 'FilterChip';
