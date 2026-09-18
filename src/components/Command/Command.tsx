'use client';
// @refresh reset

/**
 * @module Command
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
 * For prop API + usage notes, read `Command.md` in this folder
 * or run `npm run ld-kit -- show Command`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps, useStableId, mergeRefs} from '../../common/helpers';
import type {CommonProps} from '../../common/helpers';

import './Command.css';

// ---------------------------------------------------------------------------
// Search Icon (inline SVG)
// ---------------------------------------------------------------------------

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Command Context
// ---------------------------------------------------------------------------

interface RegisteredItem {
  id: string;
  value: string;
  onSelect?: () => void;
  disabled?: boolean;
}

interface CommandContextValue {
  search: string;
  setSearch: (value: string) => void;
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  visibleItems: React.MutableRefObject<RegisteredItem[]>;
  registerItem: (id: string, value: string, onSelect?: () => void, disabled?: boolean) => () => void;
  listId: string;
  /** Total number of visible (registered) enabled items — used by Separator and Group to self-hide */
  visibleCount: number;
  /** True when CommandList is mounted — drives aria-expanded on the combobox input */
  listMounted: boolean;
  setListMounted: (v: boolean) => void;
}

const CommandContext = React.createContext<CommandContextValue>({
  search: '',
  setSearch: () => {},
  selectedIndex: 0,
  setSelectedIndex: () => {},
  visibleItems: {current: []},
  registerItem: () => () => {},
  listId: '',
  visibleCount: 0,
  listMounted: false,
  setListMounted: () => {},
});

// ---------------------------------------------------------------------------
// CommandGroup visibility context (group-scoped item counter)
// ---------------------------------------------------------------------------

interface CommandGroupContextValue {
  registerGroupItem: () => () => void;
}

const CommandGroupContext = React.createContext<CommandGroupContextValue>({
  registerGroupItem: () => () => {},
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function matchesSearch(text: string, search: string): boolean {
  if (!search) return true;
  return text.toLowerCase().includes(search.toLowerCase());
}

// ---------------------------------------------------------------------------
// Command (root)
// ---------------------------------------------------------------------------

export interface CommandProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style' | 'onSelect'>,
    CommonProps {
  children: React.ReactNode;
  /** Optional callback when an item is selected */
  onSelect?: (value: string) => void;
}

export const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  (props, ref) => {
    const {children, onSelect, UNSAFE_className, UNSAFE_style, ...rest} = props;
    const [search, setSearch] = React.useState('');
    const [selectedIndex, setSelectedIndex] = React.useState(-1);
    const [visibleCount, setVisibleCount] = React.useState(0);
    const [listMounted, setListMounted] = React.useState(false);
    const visibleItems = React.useRef<RegisteredItem[]>([]);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const listId = useStableId();

    // Two live regions: polite for count, assertive for no results
    const [countAnnouncement, setCountAnnouncement] = React.useState('');
    const [noResultsAnnouncement, setNoResultsAnnouncement] = React.useState('');

    const registerItem = React.useCallback(
      (id: string, value: string, onSelectCb?: () => void, disabled?: boolean) => {
        const item: RegisteredItem = {id, value, onSelect: onSelectCb, disabled};
        visibleItems.current.push(item);
        if (!disabled) setVisibleCount((c) => c + 1);
        return () => {
          visibleItems.current = visibleItems.current.filter((i) => i !== item);
          if (!disabled) setVisibleCount((c) => Math.max(0, c - 1));
        };
      },
      [],
    );

    // When search is non-empty, auto-select first item; when cleared, deselect all
    React.useEffect(() => {
      setSelectedIndex(search ? 0 : -1);
    }, [search]);

    // Announce results after search changes (debounced)
    React.useEffect(() => {
      if (!search) {
        setCountAnnouncement('');
        setNoResultsAnnouncement('');
        return;
      }
      const timer = setTimeout(() => {
        const count = visibleItems.current.filter((i) => !i.disabled).length;
        if (count > 0) {
          setCountAnnouncement(`${count} option${count === 1 ? '' : 's'} available`);
          setNoResultsAnnouncement('');
        } else {
          setNoResultsAnnouncement(`No results found matching "${search}"`);
          setCountAnnouncement('');
        }
      }, 150);
      return () => clearTimeout(timer);
    }, [search]);

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const items = visibleItems.current.filter((i) => !i.disabled);
        if (items.length === 0) return;

        switch (e.key) {
          case 'ArrowDown': {
            e.preventDefault();
            setSelectedIndex((prev) => {
              if (prev === -1) return 0;
              const next = prev + 1;
              return next >= items.length ? 0 : next;
            });
            break;
          }
          case 'ArrowUp': {
            e.preventDefault();
            setSelectedIndex((prev) => {
              if (prev === -1) return items.length - 1;
              const next = prev - 1;
              return next < 0 ? items.length - 1 : next;
            });
            break;
          }
          case 'Enter': {
            if (selectedIndex < 0) break;
            e.preventDefault();
            const selected = items[selectedIndex];
            if (selected) {
              selected.onSelect?.();
              onSelect?.(selected.value);
            }
            break;
          }
          case 'Home': {
            e.preventDefault();
            setSelectedIndex(0);
            break;
          }
          case 'End': {
            e.preventDefault();
            setSelectedIndex(items.length - 1);
            break;
          }
          default:
            break;
        }
      },
      [selectedIndex, onSelect],
    );

    const ctx = React.useMemo(
      () => ({search, setSearch, selectedIndex, setSelectedIndex, visibleItems, registerItem, listId, visibleCount, listMounted, setListMounted}),
      [search, selectedIndex, registerItem, listId, visibleCount, listMounted],
    );

    return (
      <CommandContext.Provider value={ctx}>
        <div
          ref={mergeRefs(rootRef, ref)}
          className={cx('ld-command-root', UNSAFE_className)}
          style={UNSAFE_style}
          onKeyDown={handleKeyDown}
          {...rest}
        >
          {children}
          {/* Polite: count of available options */}
          <div aria-live="polite" aria-atomic="true" className="ld-command-sr-announce">
            {countAnnouncement}
          </div>
          {/* Assertive: no results alert */}
          <div aria-live="assertive" aria-atomic="true" className="ld-command-sr-announce">
            {noResultsAnnouncement}
          </div>
        </div>
      </CommandContext.Provider>
    );
  },
);
Command.displayName = 'Command';

// ---------------------------------------------------------------------------
// CommandInput
// ---------------------------------------------------------------------------

export interface CommandInputProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'className' | 'style' | 'value' | 'onChange'>,
    CommonProps {
}

export const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
  (props, ref) => {
    const {'aria-label': ariaLabel = 'Search', UNSAFE_className, UNSAFE_style, ...inputRest} = props as CommandInputProps & {'aria-label'?: string};
    const {search, setSearch, selectedIndex, visibleItems, listId, listMounted} = React.useContext(CommandContext);

    // Compute which option is currently active (for aria-activedescendant)
    const activeItemId = visibleItems.current.filter((i) => !i.disabled)[selectedIndex]?.id;

    return (
      <div className="ld-command-input-wrapper">
        <SearchIcon className="ld-command-search-icon" aria-hidden="true" />
        <input
          ref={ref}
          className={cx('ld-command-input', UNSAFE_className)}
          style={UNSAFE_style}
          type="text"
          role="combobox"
          aria-label={ariaLabel}
          aria-expanded={listMounted}
          aria-controls={listId}
          aria-activedescendant={activeItemId}
          aria-autocomplete="list"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          {...inputRest}
        />
      </div>
    );
  },
);
CommandInput.displayName = 'CommandInput';

// ---------------------------------------------------------------------------
// CommandList
// ---------------------------------------------------------------------------

export interface CommandListProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'>,
    CommonProps {
  children: React.ReactNode;
}

export const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(
  (props, ref) => {
    const {children, UNSAFE_className, UNSAFE_style, 'aria-label': ariaLabel = 'Search results', ...rest} = props as CommandListProps & {'aria-label'?: string};
    const {listId, setListMounted} = React.useContext(CommandContext);

    React.useEffect(() => {
      setListMounted(true);
      return () => setListMounted(false);
    }, [setListMounted]);

    return (
      <div
        ref={ref}
        id={listId}
        className={cx('ld-command-list', UNSAFE_className)}
        style={UNSAFE_style}
        role="listbox"
        aria-label={ariaLabel}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
CommandList.displayName = 'CommandList';

// ---------------------------------------------------------------------------
// CommandEmpty
// ---------------------------------------------------------------------------

export interface CommandEmptyProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'>,
    CommonProps {
  children: React.ReactNode;
}

export const CommandEmpty = React.forwardRef<HTMLDivElement, CommandEmptyProps>(
  (props, ref) => {
    const {children, UNSAFE_className, UNSAFE_style, ...rest} = props;
    const {visibleItems} = React.useContext(CommandContext);
    const [hasItems, setHasItems] = React.useState(true);

    React.useEffect(() => {
      const timer = setTimeout(() => {
        setHasItems(visibleItems.current.length > 0);
      }, 0);
      return () => clearTimeout(timer);
    });

    if (hasItems) return null;

    return (
      <div
        ref={ref}
        className={cx('ld-command-empty', UNSAFE_className)}
        style={UNSAFE_style}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
CommandEmpty.displayName = 'CommandEmpty';

// ---------------------------------------------------------------------------
// CommandGroup
// ---------------------------------------------------------------------------

export interface CommandGroupProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'>,
    CommonProps {
  children: React.ReactNode;
  heading?: string;
}

export const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  (props, ref) => {
    const {children, heading, UNSAFE_className, UNSAFE_style, ...rest} = props;
    const headingId = useStableId();
    const {search} = React.useContext(CommandContext);
    const [groupVisibleCount, setGroupVisibleCount] = React.useState(0);

    const registerGroupItem = React.useCallback(() => {
      setGroupVisibleCount((c) => c + 1);
      return () => setGroupVisibleCount((c) => Math.max(0, c - 1));
    }, []);

    const groupCtx = React.useMemo(() => ({registerGroupItem}), [registerGroupItem]);

    // Hide the entire group (including heading) when searching and no items match
    if (search && groupVisibleCount === 0) return null;

    return (
      <CommandGroupContext.Provider value={groupCtx}>
        <div
          ref={ref}
          className={cx('ld-command-group', UNSAFE_className)}
          style={UNSAFE_style}
          role="group"
          aria-labelledby={heading ? headingId : undefined}
          {...rest}
        >
          {heading && (
            <div className="ld-command-group-heading" id={headingId}>
              {heading}
            </div>
          )}
          {children}
        </div>
      </CommandGroupContext.Provider>
    );
  },
);
CommandGroup.displayName = 'CommandGroup';

// ---------------------------------------------------------------------------
// CommandItem
// ---------------------------------------------------------------------------

export interface CommandItemProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style' | 'onSelect'>,
    CommonProps {
  children: React.ReactNode;
  /** The value used for filtering and selection. Defaults to text content. */
  value?: string;
  disabled?: boolean;
  onSelect?: () => void;
}

export const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  (props, ref) => {
    const {children, value, disabled = false, onSelect, UNSAFE_className, UNSAFE_style, ...rest} = props;
    const {search, selectedIndex, visibleItems, registerItem, visibleCount} = React.useContext(CommandContext);
    const {registerGroupItem} = React.useContext(CommandGroupContext);
    const itemRef = React.useRef<HTMLDivElement>(null);
    const itemId = useStableId();

    // Derive text value from children if not provided
    const textValue = React.useMemo(() => {
      if (value) return value;
      const extractText = (node: React.ReactNode): string => {
        if (typeof node === 'string') return node;
        if (typeof node === 'number') return String(node);
        if (Array.isArray(node)) return node.map(extractText).join('');
        if (React.isValidElement(node) && node.props.children) {
          return extractText(node.props.children);
        }
        return '';
      };
      return extractText(children);
    }, [value, children]);

    const isVisible = matchesSearch(textValue, search);

    // Register in root context
    React.useEffect(() => {
      if (!isVisible) return;
      return registerItem(itemId, textValue, onSelect, disabled);
    }, [isVisible, itemId, textValue, onSelect, disabled, registerItem]);

    // Register in group context (for group-level visibility tracking)
    React.useEffect(() => {
      if (!isVisible) return;
      return registerGroupItem();
    }, [isVisible, registerGroupItem]);

    // Determine this item's position in the enabled list.
    // Depends on visibleCount (state) so it re-runs whenever items register/unregister,
    // including when search resets selectedIndex 0→0 (no state change would otherwise trigger it).
    const currentIndex = React.useMemo(() => {
      if (!isVisible) return -1;
      const enabledItems = visibleItems.current.filter((i) => !i.disabled);
      return enabledItems.findIndex((i) => i.id === itemId);
    }, [isVisible, itemId, visibleCount]); // eslint-disable-line react-hooks/exhaustive-deps

    // isSelected: guard against selectedIndex=-1 matching disabled items' currentIndex=-1
    const isSelected = selectedIndex >= 0 && currentIndex === selectedIndex;

    // Scroll into view when selected
    React.useEffect(() => {
      if (isSelected && itemRef.current) {
        itemRef.current.scrollIntoView({block: 'nearest'});
      }
    }, [isSelected]);

    if (!isVisible) return null;

    return (
      <div
        ref={mergeRefs(itemRef, ref)}
        id={itemId}
        className={cx('ld-command-item', UNSAFE_className)}
        style={UNSAFE_style}
        role="option"
        aria-selected={isSelected}
        aria-disabled={disabled}
        data-selected={isSelected ? 'true' : 'false'}
        data-disabled={disabled ? 'true' : 'false'}
        onClick={() => {
          if (!disabled) {
            onSelect?.();
          }
        }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
CommandItem.displayName = 'CommandItem';

// ---------------------------------------------------------------------------
// CommandSeparator
// ---------------------------------------------------------------------------

export interface CommandSeparatorProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'>,
    CommonProps {
}

export const CommandSeparator = React.forwardRef<HTMLDivElement, CommandSeparatorProps>(
  (props, ref) => {
    const {UNSAFE_className, UNSAFE_style, ...rest} = props;
    const {search} = React.useContext(CommandContext);

    // Hide separators while filtering — hidden groups leave orphaned lines, and
    // group headings provide sufficient visual separation during search.
    if (search) return null;

    return (
      <div
        ref={ref}
        className={cx('ld-command-separator', UNSAFE_className)}
        style={UNSAFE_style}
        aria-hidden="true"
        {...rest}
      />
    );
  },
);
CommandSeparator.displayName = 'CommandSeparator';

// ---------------------------------------------------------------------------
// CommandShortcut
// ---------------------------------------------------------------------------

export interface CommandShortcutProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'className' | 'style'>,
    CommonProps {
}

export const CommandShortcut: React.FunctionComponent<CommandShortcutProps> = (props) => {
  const {UNSAFE_className, UNSAFE_style, ...rest} = props;

  return (
    <span
      className={cx('ld-command-shortcut', UNSAFE_className)}
      style={UNSAFE_style}
      {...rest}
    />
  );
};
CommandShortcut.displayName = 'CommandShortcut';

// ---------------------------------------------------------------------------
// CommandDialog
// ---------------------------------------------------------------------------

export interface CommandDialogProps extends CommonProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Accessible label for the dialog.
   * Defaults to a concise instruction for screen reader users.
   */
  'aria-label'?: string;
}

export const CommandDialog: React.FunctionComponent<CommandDialogProps> = (props) => {
  const {children, open = false, onOpenChange, UNSAFE_className, UNSAFE_style, 'aria-label': ariaLabel = 'Command palette. Search to filter options.'} = props;
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<Element | null>(null);

  // Capture the focused element before opening, focus input on open
  React.useEffect(() => {
    if (!open) return;
    // Remember what had focus so we can restore it on close
    triggerRef.current = document.activeElement;
    const timer = setTimeout(() => {
      dialogRef.current?.querySelector<HTMLInputElement>('input[role="combobox"]')?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, [open]);

  const close = React.useCallback(() => {
    onOpenChange?.(false);
    // Return focus to the element that opened the dialog
    setTimeout(() => {
      (triggerRef.current as HTMLElement | null)?.focus();
    }, 0);
  }, [onOpenChange]);

  // Close on Escape
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, close]);

  // Focus trap — Tab cycles only within the dialog
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusables = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'input:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);

      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    // Capture phase so we run before any inner handlers
    document.addEventListener('keydown', handler, true);
    return () => document.removeEventListener('keydown', handler, true);
  }, [open]);

  // Lock body scroll
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on overlay click
  const handleOverlayClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === overlayRef.current) {
        close();
      }
    },
    [close],
  );

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="ld-command-overlay"
      onClick={handleOverlayClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={cx('ld-command-dialog', UNSAFE_className)}
        style={UNSAFE_style}
      >
        <Command>{children}</Command>
        {/* Visually-hidden close button — appears on focus when Tab loops to it */}
        <button
          type="button"
          className="ld-command-close-btn"
          onClick={close}
        >
          Close dialog
        </button>
      </div>
    </div>
  );
};
CommandDialog.displayName = 'CommandDialog';
