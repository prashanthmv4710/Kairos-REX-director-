// @refresh reset

/**
 * @module CountrySelectDropdown
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
 * For prop API + usage notes, read `CountrySelectDropdown.md` in this folder
 * or run `npm run ld-kit -- show CountrySelectDropdown`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps, useStableId} from '../../common/helpers';
import {CloseIcon, CaretDownIcon, SearchIcon} from '../Icons';
import {Badge} from '../Badge';
import {Button} from '../Button';
import {Country, WCP_DEFAULT_COUNTRIES} from '../CountrySelectBottomSheet';
import './CountrySelectDropdown.css';

export type {Country} from '../CountrySelectBottomSheet';

// Only allow http(s) and protocol-relative/relative URLs for image sources.
const sanitizeImageUrl = (url: string | undefined): string => {
  if (!url) return '';
  const trimmed = String(url).trim();
  if (/^(https?:)?\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../')) return trimmed;
  return '';
};

export interface CountrySelectDropdownProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style' | 'onChange'> {
  countries?: Country[];
  mode?: 'single' | 'multi';
  value?: string | string[];
  onChange?: (value: string | string[], countries: Country | Country[]) => void;
  placeholder?: string;
  showDialCode?: boolean;
  confirmLabel?: string;
  label?: string;
  disabled?: boolean;
  triggerWidth?: string | number;
  /**
   * When `true`, the Space key types a space character in the search input
   * (useful if searching for names like "United States"). When `false` (default),
   * Space always toggles the currently highlighted option.
   * @default false
   */
  allowSpaceInSearch?: boolean;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

export const CountrySelectDropdown: React.FunctionComponent<CountrySelectDropdownProps> = (props) => {
  const {
    countries = WCP_DEFAULT_COUNTRIES,
    mode = 'single',
    value,
    onChange,
    placeholder = 'Select country',
    showDialCode = false,
    confirmLabel = 'Apply',
    label,
    disabled = false,
    triggerWidth = 280,
    allowSpaceInSearch = false,
    className,
    ...rest
  } = applyCommonProps(props);

  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [singleSelected, setSingleSelected] = React.useState<string>(typeof value === 'string' ? value : '');
  const [multiSelected, setMultiSelected] = React.useState<string[]>(Array.isArray(value) ? value : []);
  const [pendingMulti, setPendingMulti] = React.useState<string[]>(Array.isArray(value) ? value : []);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isKeyboardNav, setIsKeyboardNav] = React.useState(false);

  // Split live regions: polite for count, assertive for no-results
  const [countAnnouncement, setCountAnnouncement] = React.useState('');
  const [noResultsAnnouncement, setNoResultsAnnouncement] = React.useState('');

  const listId = useStableId();
  const labelId = useStableId();

  React.useEffect(() => {
    if (typeof value === 'string') setSingleSelected(value);
    else if (Array.isArray(value)) { setMultiSelected(value); setPendingMulti(value); }
  }, [value]);

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);


  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!triggerRef.current?.contains(e.target as Node) && !dropdownRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Focus search input when dropdown opens
  React.useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  const filtered = countries.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  // Reset active index when search changes
  React.useEffect(() => {
    setActiveIndex(0);
  }, [search]);

  // Scroll active option into view
  React.useEffect(() => {
    if (!open || filtered.length === 0) return;
    const optId = `${listId}-opt-${filtered[activeIndex]?.code}`;
    document.getElementById(optId)?.scrollIntoView({block: 'nearest'});
  }, [activeIndex, open, listId, filtered]);

  // Announce filtered count (debounced) — polite for count, assertive for no results
  React.useEffect(() => {
    if (!open) {
      setCountAnnouncement('');
      setNoResultsAnnouncement('');
      return;
    }
    const timer = setTimeout(() => {
      if (filtered.length > 0) {
        setCountAnnouncement(`${filtered.length} option${filtered.length === 1 ? '' : 's'} available`);
        setNoResultsAnnouncement('');
      } else {
        setNoResultsAnnouncement(search ? `No results found matching "${search}"` : 'No results');
        setCountAnnouncement('');
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [search, open, filtered.length]);

  // Fix 1: return focus to trigger after single select
  const handleSingleSelect = (country: Country) => {
    setSingleSelected(country.code);
    onChange?.(country.code, country);
    setOpen(false);
    setSearch('');
    setTimeout(() => triggerRef.current?.focus(), 0);
  };

  const handleMultiToggle = (code: string) => {
    setPendingMulti(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
  };

  // Fix 1: return focus to trigger after multi confirm
  const handleMultiConfirm = () => {
    setMultiSelected(pendingMulti);
    const selected = countries.filter(c => pendingMulti.includes(c.code));
    onChange?.(pendingMulti, selected);
    setOpen(false);
    setSearch('');
    setTimeout(() => triggerRef.current?.focus(), 0);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        setIsKeyboardNav(true);
        setActiveIndex(prev => {
          const next = prev + 1;
          return next >= filtered.length ? 0 : next;
        });
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        setIsKeyboardNav(true);
        setActiveIndex(prev => {
          const next = prev - 1;
          return next < 0 ? filtered.length - 1 : next;
        });
        break;
      }
      case 'Enter': {
        e.preventDefault();
        const country = filtered[activeIndex];
        if (country) {
          if (mode === 'single') {
            handleSingleSelect(country);
          } else {
            handleMultiToggle(country.code);
          }
        }
        break;
      }
      case ' ': {
        // By default Space always toggles the highlighted option.
        // Set allowSpaceInSearch=true to let Space type normally in the search field.
        if (!allowSpaceInSearch) {
          e.preventDefault();
          const country = filtered[activeIndex];
          if (country) {
            if (mode === 'single') {
              handleSingleSelect(country);
            } else {
              handleMultiToggle(country.code);
            }
          }
        }
        break;
      }
      case 'Home': {
        e.preventDefault();
        setIsKeyboardNav(true);
        setActiveIndex(0);
        break;
      }
      case 'End': {
        e.preventDefault();
        setIsKeyboardNav(true);
        setActiveIndex(filtered.length - 1);
        break;
      }
      case 'Escape': {
        e.preventDefault();
        if (search) {
          setSearch('');
        } else {
          setOpen(false);
          triggerRef.current?.focus();
        }
        break;
      }
      default:
        break;
    }
  };

  // Open dropdown on ArrowDown/ArrowUp from the trigger button (ARIA listbox pattern)
  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      // ArrowUp opens and jumps to last option; ArrowDown opens at first
      if (e.key === 'ArrowUp') {
        setActiveIndex(filtered.length > 0 ? filtered.length - 1 : 0);
      } else {
        setActiveIndex(0);
      }
    }
  };

  // Fix 4: prevent arrow keys from scrolling the page when focused anywhere in the dropdown
  const handleDropdownKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const triggerLabel = React.useMemo(() => {
    if (mode === 'single') {
      const found = countries.find(c => c.code === singleSelected);
      return found ? { country: found, label: found.name } : null;
    }
    if (mode === 'multi') {
      if (multiSelected.length === 0) return null;
      if (multiSelected.length === 1) {
        const found = countries.find(c => c.code === multiSelected[0]);
        return found ? { country: found, label: found.name } : null;
      }
      return { country: null, label: `${multiSelected.length} countries selected` };
    }
    return null;
  }, [mode, singleSelected, multiSelected, countries]);

  const activeDescendant = filtered[activeIndex]
    ? `${listId}-opt-${filtered[activeIndex].code}`
    : undefined;

  // Fix 2: compute a full accessible name for the trigger button
  // e.g. "Country: Canada" or "Country: Select country"
  const triggerAriaLabel = [
    label,
    triggerLabel?.label ?? placeholder,
  ].filter(Boolean).join(': ');

  return (
    <div
      className={cx('ld-wcp-countryselectdropdown-root', className)}
      style={{ width: typeof triggerWidth === 'number' ? `${triggerWidth}px` : triggerWidth }}
      {...rest}
    >
      {label && (
        <span id={labelId} className="ld-wcp-countryselectdropdown-label" aria-hidden="true">
          {label}
        </span>
      )}
      <button
        ref={triggerRef}
        type="button"
        className={cx(
          'ld-wcp-countryselectdropdown-trigger',
          open && 'ld-wcp-countryselectdropdown-triggerOpen',
          disabled && 'ld-wcp-countryselectdropdown-triggerDisabled',
        )}
        onClick={() => !disabled && setOpen(!open)}
        onKeyDown={handleTriggerKeyDown}
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={triggerAriaLabel || undefined}
      >
        <span className="ld-wcp-countryselectdropdown-triggerContent">
          {triggerLabel ? (
            <>
              {triggerLabel.country && (
                <img src={sanitizeImageUrl(triggerLabel.country.flagUrl)} alt="" className="ld-wcp-countryselectdropdown-triggerFlag" />
              )}
              {mode === 'multi' && multiSelected.length > 1 && (
                <Badge color="blue">{multiSelected.length}</Badge>
              )}
              <span className="ld-wcp-countryselectdropdown-triggerText">{triggerLabel.label}</span>
            </>
          ) : (
            <span className="ld-wcp-countryselectdropdown-triggerPlaceholder">{placeholder}</span>
          )}
        </span>
        <span className={cx('ld-wcp-countryselectdropdown-chevron', open && 'ld-wcp-countryselectdropdown-chevronOpen')}>
          <CaretDownIcon size="small" />
        </span>
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className="ld-wcp-countryselectdropdown-dropdown"
          onKeyDown={handleDropdownKeyDown}
        >
          <div className="ld-wcp-countryselectdropdown-searchWrap">
            <span className="ld-wcp-countryselectdropdown-searchIcon"><SearchIcon size="small" /></span>
            <input
              ref={searchRef}
              type="text"
              role="combobox"
              className="ld-wcp-countryselectdropdown-searchInput"
              placeholder="Search..."
              aria-label="Search countries"
              aria-expanded={open}
              aria-controls={listId}
              aria-activedescendant={activeDescendant}
              aria-autocomplete="list"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            {search && (
              <button
                type="button"
                className="ld-wcp-countryselectdropdown-searchClear"
                onClick={() => { setSearch(''); searchRef.current?.focus(); }}
                aria-label="Clear search"
              >
                <CloseIcon size="small" />
              </button>
            )}
          </div>
          <ul
            id={listId}
            className="ld-wcp-countryselectdropdown-list"
            role="listbox"
            aria-label={label ?? 'Countries'}
            aria-multiselectable={mode === 'multi' ? true : undefined}
            onMouseMove={() => setIsKeyboardNav(false)}
          >
            {filtered.length === 0 && (
              <li className="ld-wcp-countryselectdropdown-emptyState" role="presentation">
                No results found
              </li>
            )}
            {filtered.map((country, idx) => {
              const isSelected = mode === 'single' ? country.code === singleSelected : pendingMulti.includes(country.code);
              const isActive = idx === activeIndex && isKeyboardNav;
              return (
                <li
                  key={country.code}
                  id={`${listId}-opt-${country.code}`}
                  role="option"
                  aria-selected={isSelected}
                  className={cx(
                    'ld-wcp-countryselectdropdown-row',
                    isSelected && 'ld-wcp-countryselectdropdown-rowSelected',
                    isActive && 'ld-wcp-countryselectdropdown-rowActive',
                  )}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setActiveIndex(idx);
                    mode === 'single' ? handleSingleSelect(country) : handleMultiToggle(country.code);
                  }}
                >
                  <span className="ld-wcp-countryselectdropdown-selectionControl">
                    {mode === 'single' ? (
                      <svg
                        aria-hidden
                        className="ld-wcp-countryselectdropdown-radioSvg"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle className="ld-wcp-countryselectdropdown-radioOuter" cx="12" cy="12" r="11" />
                        <circle className="ld-wcp-countryselectdropdown-radioInner" cx="12" cy="12" r="4" />
                      </svg>
                    ) : (
                      <span className="ld-wcp-countryselectdropdown-checkboxBox">
                        <svg
                          aria-hidden
                          className="ld-wcp-countryselectdropdown-checkboxIcon"
                          viewBox="0 0 16 16"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {isSelected && (
                            <path d="M15 3.80705L6.23047 12.6609C5.78259 13.113 5.05642 13.113 4.60854 12.6609L1 9.01759L2.72031 7.28075L5.41951 10.1053L13.2101 2L15 3.80705Z" />
                          )}
                        </svg>
                      </span>
                    )}
                  </span>
                  <img src={sanitizeImageUrl(country.flagUrl)} alt="" className="ld-wcp-countryselectdropdown-flag" />
                  <span className={cx('ld-wcp-countryselectdropdown-name', isSelected && 'ld-wcp-countryselectdropdown-nameSelected')}>
                    {country.name}
                  </span>
                  {showDialCode && <span className="ld-wcp-countryselectdropdown-dialCode">{country.dialCode}</span>}
                </li>
              );
            })}
          </ul>
          {mode === 'multi' && (
            <div className="ld-wcp-countryselectdropdown-footer">
              <Button variant="primary" isFullWidth onClick={handleMultiConfirm}>
                {confirmLabel}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Polite: result count */}
      <div aria-live="polite" aria-atomic="true" className="ld-wcp-countryselectdropdown-srAnnounce">
        {countAnnouncement}
      </div>
      {/* Assertive: no-results alert */}
      <div aria-live="assertive" aria-atomic="true" className="ld-wcp-countryselectdropdown-srAnnounce">
        {noResultsAnnouncement}
      </div>
    </div>
  );
};
CountrySelectDropdown.displayName = 'CountrySelectDropdown';
