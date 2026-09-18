'use client';
// @refresh reset

/**
 * @module SelectDropdown
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
 * For prop API + usage notes, read `SelectDropdown.md` in this folder
 * or run `npm run ld-kit -- show SelectDropdown`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps, mergeRefs} from '../../common/helpers';
import type {CommonProps} from '../../common/helpers';
import {Switch} from '../Switch/Switch';
import {StarFillIcon, StarIcon as StarOutlineIcon} from '../Icons/Icons';
import './SelectDropdown.css';

/* ------------------------------------------------------------------ */
/*  Inline SVG Icons                                                   */
/* ------------------------------------------------------------------ */

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.354 4.354l-7 7a.5.5 0 01-.708 0l-3.5-3.5.708-.708L6 10.293l6.646-6.647.708.708z"
        fill="currentColor"
      />
    </svg>
  );
}


function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M5.646 3.646a.5.5 0 01.708 0l4 4a.5.5 0 010 .708l-4 4a.5.5 0 01-.708-.708L9.293 8 5.646 4.354a.5.5 0 010-.708z"
      />
    </svg>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M3.646 5.646a.5.5 0 01.708 0L8 9.293l3.646-3.647a.5.5 0 01.708.708l-4 4a.5.5 0 01-.708 0l-4-4a.5.5 0 010-.708z"
      />
    </svg>
  );
}

function AlertIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M8 1.5A6.5 6.5 0 108 14.5 6.5 6.5 0 008 1.5zM7.25 4.5h1.5v4.5h-1.5V4.5zM8 12a.9.9 0 110-1.8.9.9 0 010 1.8z" />
    </svg>
  );
}

function ImagePlaceholderIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8.5" cy="9.5" r="1.5" fill="currentColor" />
      <path d="M4 17l4.5-4.5 3 3L15.5 11l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Contexts                                                           */
/* ------------------------------------------------------------------ */

interface MenuContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | HTMLDivElement | null>;
  highlightedIndex: number;
  setHighlightedIndex: (i: number) => void;
  /** Whether this is a right-click context menu */
  isContextMenu: boolean;
  /** Mouse position when using context-menu trigger */
  contextPosition: { x: number; y: number };
  setContextPosition: (pos: { x: number; y: number }) => void;
}

const MenuCtx = React.createContext<MenuContextValue | null>(null);

function useMenuCtx() {
  const ctx = React.useContext(MenuCtx);
  if (!ctx) throw new Error('SelectDropdown components must be used within <SelectDropdown>');
  return ctx;
}

interface RadioGroupContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const RadioGroupCtx = React.createContext<RadioGroupContextValue | null>(null);

/* ------------------------------------------------------------------ */
/*  Root                                                               */
/* ------------------------------------------------------------------ */

interface SelectDropdownProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  /**
   * How the menu is triggered.
   * - `'click'` (default): opens on button click
   * - `'context-menu'`: opens on right-click at the cursor position
   */
  trigger?: 'click' | 'context-menu';
}

function SelectDropdown({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
  trigger = 'click',
}: SelectDropdownProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const triggerRef = React.useRef<HTMLButtonElement | HTMLDivElement | null>(null);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const [contextPosition, setContextPosition] = React.useState({ x: 0, y: 0 });

  const handleChange = React.useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
      if (!next) setHighlightedIndex(-1);
    },
    [controlledOpen, onOpenChange],
  );

  return (
    <MenuCtx.Provider
      value={{
        open,
        onOpenChange: handleChange,
        triggerRef,
        highlightedIndex,
        setHighlightedIndex,
        isContextMenu: trigger === 'context-menu',
        contextPosition,
        setContextPosition,
      }}
    >
      {children}
    </MenuCtx.Provider>
  );
}

SelectDropdown.displayName = 'SelectDropdown';

/* ------------------------------------------------------------------ */
/*  Trigger                                                            */
/* ------------------------------------------------------------------ */

interface SelectDropdownTriggerProps extends CommonProps {
  children: React.ReactNode;
  asChild?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const SelectDropdownTrigger = React.forwardRef<
  HTMLButtonElement | HTMLDivElement,
  SelectDropdownTriggerProps
>(function SelectDropdownTriggerInner(props, ref) {
  const { className, ...rest } = applyCommonProps(props);
  const { onClick, children, asChild, ...domProps } = rest;
  const { open, onOpenChange, triggerRef, isContextMenu, setContextPosition } = useMenuCtx();

  // Context-menu mode: render a div that listens for right-clicks
  if (isContextMenu) {
    const mergedContextRef = mergeRefs<HTMLDivElement>(
      triggerRef as React.MutableRefObject<HTMLDivElement | null>,
      ref as React.ForwardedRef<HTMLDivElement>,
    );

    return (
      <div
        ref={mergedContextRef}
        className={className}
        onContextMenu={(e) => {
          e.preventDefault();
          setContextPosition({ x: e.clientX, y: e.clientY });
          onOpenChange(true);
          onClick?.(e);
        }}
        {...(domProps as React.HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </div>
    );
  }

  // Click mode (default)
  const mergedClickRef = mergeRefs<HTMLButtonElement>(
    triggerRef as React.MutableRefObject<HTMLButtonElement | null>,
    ref as React.ForwardedRef<HTMLButtonElement>,
  );

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    onOpenChange(!open);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      ref: mergedClickRef,
      onClick: handleClick,
      'aria-expanded': open,
      'aria-haspopup': 'menu',
      'data-state': open ? 'open' : 'closed',
    });
  }

  return (
    <button
      ref={mergedClickRef}
      type="button"
      className={className}
      onClick={handleClick}
      aria-expanded={open}
      aria-haspopup="menu"
      data-state={open ? 'open' : 'closed'}
      {...(domProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
});

SelectDropdownTrigger.displayName = 'SelectDropdownTrigger';

/* ------------------------------------------------------------------ */
/*  Sub (simplified)                                                   */
/* ------------------------------------------------------------------ */

interface SubContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SubCtx = React.createContext<SubContextValue | null>(null);

function SelectDropdownSub({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <SubCtx.Provider value={{ open, onOpenChange: setOpen }}>
      <div
        className="ld-select-dropdown-sub"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {children}
      </div>
    </SubCtx.Provider>
  );
}

SelectDropdownSub.displayName = 'SelectDropdownSub';

/* ------------------------------------------------------------------ */
/*  RadioGroup                                                         */
/* ------------------------------------------------------------------ */

interface SelectDropdownRadioGroupProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'>,
    CommonProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
}

const SelectDropdownRadioGroup = React.forwardRef<HTMLDivElement, SelectDropdownRadioGroupProps>(
  function SelectDropdownRadioGroupInner(props, ref) {
    const { className, ...rest } = applyCommonProps(props);
    const { value = '', onValueChange, children, ...domProps } = rest;
    return (
      <RadioGroupCtx.Provider value={{ value: value ?? '', onValueChange: onValueChange || (() => {}) }}>
        <div ref={ref} role="group" className={className} {...(domProps as React.HTMLAttributes<HTMLDivElement>)}>
          {children}
        </div>
      </RadioGroupCtx.Provider>
    );
  },
);

SelectDropdownRadioGroup.displayName = 'SelectDropdownRadioGroup';

/* ------------------------------------------------------------------ */
/*  SubTrigger                                                         */
/* ------------------------------------------------------------------ */

interface SelectDropdownSubTriggerProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'>,
    CommonProps {
  inset?: boolean;
  children?: React.ReactNode;
}

const SelectDropdownSubTrigger = React.forwardRef<HTMLDivElement, SelectDropdownSubTriggerProps>(
  function SelectDropdownSubTriggerInner(props, ref) {
    const { className, ...rest } = applyCommonProps(props);
    const { inset, children, onMouseEnter, onMouseLeave, ...domProps } = rest;
    const sub = React.useContext(SubCtx);

    return (
      <div
        ref={ref}
        role="menuitem"
        aria-haspopup="menu"
        data-state={sub?.open ? 'open' : 'closed'}
        className={cx(
          'ld-select-dropdown-sub-trigger',
          inset && 'ld-select-dropdown-item--inset',
          className,
        )}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...(domProps as React.HTMLAttributes<HTMLDivElement>)}
      >
        {children}
        <ChevronRightIcon className="ld-select-dropdown-chevron" aria-hidden="true" />
      </div>
    );
  },
);

SelectDropdownSubTrigger.displayName = 'SelectDropdownSubTrigger';

/* ------------------------------------------------------------------ */
/*  SubContent                                                         */
/* ------------------------------------------------------------------ */

interface SelectDropdownSubContentProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'>,
    CommonProps {
  children?: React.ReactNode;
}

const SelectDropdownSubContent = React.forwardRef<HTMLDivElement, SelectDropdownSubContentProps>(
  function SelectDropdownSubContentInner(props, ref) {
    const { className, ...rest } = applyCommonProps(props);
    const { children, ...domProps } = rest;
    const sub = React.useContext(SubCtx);
    if (!sub?.open) return null;

    return (
      <div
        ref={ref}
        role="menu"
        data-state="open"
        className={cx('ld-select-dropdown-content ld-select-dropdown-sub-content', className)}
        {...(domProps as React.HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </div>
    );
  },
);

SelectDropdownSubContent.displayName = 'SelectDropdownSubContent';

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

interface SelectDropdownContentProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'>,
    CommonProps {
  sideOffset?: number;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  children?: React.ReactNode;
}

const SelectDropdownContent = React.forwardRef<HTMLDivElement, SelectDropdownContentProps>(
  function SelectDropdownContentInner(props, ref) {
    const { className, style, ...rest } = applyCommonProps(props);
    const { sideOffset = 4, side = 'bottom', align = 'start', children, ...domProps } = rest;
    const { open, onOpenChange, triggerRef, isContextMenu, contextPosition } = useMenuCtx();
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [pos, setPos] = React.useState<{ top: number; left: number }>({ top: 0, left: 0 });

    const combinedRef = mergeRefs<HTMLDivElement>(contentRef, ref);

    // Position relative to trigger, honoring `side` (which edge the menu opens
    // from) and `align` (how it lines up along the cross axis).
    const updatePosition = React.useCallback(() => {
      if (!triggerRef.current || !contentRef.current) return;
      const trigger = triggerRef.current.getBoundingClientRect();
      const content = contentRef.current.getBoundingClientRect();
      const offset = sideOffset as number;

      let top = trigger.bottom + offset;
      let left = trigger.left;

      // Main axis: which side of the trigger the menu sits on.
      if (side === 'top') top = trigger.top - content.height - offset;
      else if (side === 'bottom') top = trigger.bottom + offset;
      else if (side === 'left') left = trigger.left - content.width - offset;
      else if (side === 'right') left = trigger.right + offset;

      // Cross axis: how the menu aligns relative to the trigger.
      if (side === 'top' || side === 'bottom') {
        if (align === 'start') left = trigger.left;
        else if (align === 'center') left = trigger.left + trigger.width / 2 - content.width / 2;
        else if (align === 'end') left = trigger.right - content.width;
      } else {
        if (align === 'start') top = trigger.top;
        else if (align === 'center') top = trigger.top + trigger.height / 2 - content.height / 2;
        else if (align === 'end') top = trigger.bottom - content.height;
      }

      setPos({ top, left });
    }, [sideOffset, side, align, triggerRef]);

    // Run in a layout effect so the menu is placed before paint (no visible
    // jump). A ResizeObserver re-runs positioning if the content's measured
    // size settles late (e.g. once the icon font loads), which matters for
    // `top`/`left` placements that depend on the content's height/width.
    React.useLayoutEffect(() => {
      if (!open || isContextMenu) return;
      updatePosition();

      const content = contentRef.current;
      if (!content || typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(() => updatePosition());
      observer.observe(content);
      return () => observer.disconnect();
    }, [open, isContextMenu, updatePosition]);

    // Click outside + escape
    React.useEffect(() => {
      if (!open) return;

      const handleClickOutside = (e: MouseEvent) => {
        if (
          contentRef.current &&
          !contentRef.current.contains(e.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(e.target as Node)
        ) {
          onOpenChange(false);
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onOpenChange(false);
          (triggerRef.current as HTMLElement)?.focus();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [open, onOpenChange, triggerRef]);

    // Keyboard navigation
    React.useEffect(() => {
      if (!open || !contentRef.current) return;

      const el = contentRef.current;
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          const items = el.querySelectorAll<HTMLElement>(
            '[role="menuitem"]:not([data-disabled]),[role="menuitemcheckbox"]:not([data-disabled]),[role="menuitemradio"]:not([data-disabled])',
          );
          if (!items || items.length === 0) return;

          const current = Array.from(items).findIndex((item) => item === document.activeElement);
          let next: number;

          if (e.key === 'ArrowDown') {
            next = current < items.length - 1 ? current + 1 : 0;
          } else {
            next = current > 0 ? current - 1 : items.length - 1;
          }

          items[next].focus();
        }
      };

      el.addEventListener('keydown', handleKeyDown);
      return () => el.removeEventListener('keydown', handleKeyDown);
    }, [open]);

    if (!open) return null;

    // In context-menu mode, position at the cursor rather than the trigger button
    const contentPos = isContextMenu
      ? { top: contextPosition.y, left: contextPosition.x }
      : pos;

    return (
      <div
        ref={combinedRef}
        role="menu"
        data-state="open"
        className={cx('ld-select-dropdown-content', className)}
        style={{
          position: 'fixed',
          top: contentPos.top,
          left: contentPos.left,
          zIndex: 50,
          ...(style as React.CSSProperties),
        }}
        {...(domProps as React.HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </div>
    );
  },
);

SelectDropdownContent.displayName = 'SelectDropdownContent';

/* ------------------------------------------------------------------ */
/*  Item                                                               */
/* ------------------------------------------------------------------ */

interface SelectDropdownItemProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'>,
    CommonProps {
  inset?: boolean;
  disabled?: boolean;
  /** Renders the item with destructive styling (e.g. a "Delete" action). */
  destructive?: boolean;
  onSelect?: () => void;
  children?: React.ReactNode;
}

const SelectDropdownItem = React.forwardRef<HTMLDivElement, SelectDropdownItemProps>(
  function SelectDropdownItemInner(props, ref) {
    const { className, ...rest } = applyCommonProps(props);
    const { inset, disabled, destructive, onSelect, onClick, children, ...domProps } = rest;
    const { onOpenChange } = useMenuCtx();

    return (
      <div
        ref={ref}
        role="menuitem"
        tabIndex={disabled ? undefined : -1}
        data-disabled={disabled || undefined}
        className={cx(
          'ld-select-dropdown-item',
          inset && 'ld-select-dropdown-item--inset',
          destructive && 'ld-select-dropdown-item--destructive',
          className,
        )}
        onClick={(e) => {
          if (disabled) return;
          onClick?.(e);
          onSelect?.();
          onOpenChange(false);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!disabled) {
              onSelect?.();
              onOpenChange(false);
            }
          }
        }}
        {...(domProps as React.HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </div>
    );
  },
);

SelectDropdownItem.displayName = 'SelectDropdownItem';

/* ------------------------------------------------------------------ */
/*  CheckboxItem                                                       */
/* ------------------------------------------------------------------ */

interface SelectDropdownCheckboxItemProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'>,
    CommonProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  /**
   * Close the menu after toggling. Defaults to `false` so multi-select menus
   * stay open while the user picks several options.
   */
  closeOnSelect?: boolean;
  children?: React.ReactNode;
}

const SelectDropdownCheckboxItem = React.forwardRef<HTMLDivElement, SelectDropdownCheckboxItemProps>(
  function SelectDropdownCheckboxItemInner(props, ref) {
    const { className, ...rest } = applyCommonProps(props);
    const { children, checked, onCheckedChange, disabled, closeOnSelect = false, onClick, ...domProps } = rest;
    const { onOpenChange } = useMenuCtx();

    const toggle = () => {
      onCheckedChange?.(!checked);
      if (closeOnSelect) onOpenChange(false);
    };

    return (
      <div
        ref={ref}
        role="menuitemcheckbox"
        aria-checked={checked}
        tabIndex={disabled ? undefined : -1}
        data-disabled={disabled || undefined}
        data-state={checked ? 'checked' : 'unchecked'}
        className={cx('ld-select-dropdown-item-with-indicator', className)}
        onClick={(e) => {
          if (disabled) return;
          onClick?.(e);
          toggle();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!disabled) toggle();
          }
        }}
        {...(domProps as React.HTMLAttributes<HTMLDivElement>)}
      >
        <span className="ld-select-dropdown-indicator">
          {checked && <CheckIcon />}
        </span>
        <span
          className="ld-select-dropdown-checkbox-label"
          data-text={typeof children === 'string' ? children : undefined}
        >
          {children}
        </span>
      </div>
    );
  },
);

SelectDropdownCheckboxItem.displayName = 'SelectDropdownCheckboxItem';

/* ------------------------------------------------------------------ */
/*  RadioItem                                                          */
/* ------------------------------------------------------------------ */

interface SelectDropdownRadioItemProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'>,
    CommonProps {
  value: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

const SelectDropdownRadioItem = React.forwardRef<HTMLDivElement, SelectDropdownRadioItemProps>(
  function SelectDropdownRadioItemInner(props, ref) {
    const { className, ...rest } = applyCommonProps(props);
    const { children, value, disabled, onClick, ...domProps } = rest;
    const { onOpenChange } = useMenuCtx();
    const radioGroup = React.useContext(RadioGroupCtx);
    const checked = radioGroup?.value === value;

    return (
      <div
        ref={ref}
        role="menuitemradio"
        aria-checked={checked}
        tabIndex={disabled ? undefined : -1}
        data-disabled={disabled || undefined}
        data-state={checked ? 'checked' : 'unchecked'}
        className={cx('ld-select-dropdown-radio-item', className)}
        onClick={(e) => {
          if (disabled) return;
          onClick?.(e);
          radioGroup?.onValueChange(value);
          onOpenChange(false);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!disabled) {
              radioGroup?.onValueChange(value);
              onOpenChange(false);
            }
          }
        }}
        {...(domProps as React.HTMLAttributes<HTMLDivElement>)}
      >
        <span className="ld-select-dropdown-radio-control" aria-hidden="true" />
        <span
          className="ld-select-dropdown-radio-label"
          data-text={typeof children === 'string' ? children : undefined}
        >
          {children}
        </span>
      </div>
    );
  },
);

SelectDropdownRadioItem.displayName = 'SelectDropdownRadioItem';

/* ------------------------------------------------------------------ */
/*  Label                                                              */
/* ------------------------------------------------------------------ */

interface SelectDropdownLabelProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'>,
    CommonProps {
  inset?: boolean;
  children?: React.ReactNode;
}

const SelectDropdownLabel = React.forwardRef<HTMLDivElement, SelectDropdownLabelProps>(
  function SelectDropdownLabelInner(props, ref) {
    const { className, ...rest } = applyCommonProps(props);
    const { inset, children, ...domProps } = rest;

    return (
      <div
        ref={ref}
        className={cx(
          'ld-select-dropdown-label',
          inset && 'ld-select-dropdown-label--inset',
          className,
        )}
        {...(domProps as React.HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </div>
    );
  },
);

SelectDropdownLabel.displayName = 'SelectDropdownLabel';

/* ------------------------------------------------------------------ */
/*  Separator                                                          */
/* ------------------------------------------------------------------ */

const SelectDropdownSeparator = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> & CommonProps
>(function SelectDropdownSeparatorInner(props, ref) {
  const { className, ...rest } = applyCommonProps(props);
  return (
    <div
      ref={ref}
      role="separator"
      className={cx('ld-select-dropdown-separator', className)}
      {...(rest as React.HTMLAttributes<HTMLDivElement>)}
    />
  );
});

SelectDropdownSeparator.displayName = 'SelectDropdownSeparator';

/* ------------------------------------------------------------------ */
/*  Footer — sticky action row (e.g. Cancel / Apply for filters)       */
/* ------------------------------------------------------------------ */

interface SelectDropdownFooterProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'>,
    CommonProps {
  children?: React.ReactNode;
}

const SelectDropdownFooter = React.forwardRef<HTMLDivElement, SelectDropdownFooterProps>(
  function SelectDropdownFooterInner(props, ref) {
    const { className, ...rest } = applyCommonProps(props);
    const { children, ...domProps } = rest;
    return (
      <div
        ref={ref}
        className={cx('ld-select-dropdown-footer', className)}
        {...(domProps as React.HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </div>
    );
  },
);

SelectDropdownFooter.displayName = 'SelectDropdownFooter';

/* ------------------------------------------------------------------ */
/*  Shortcut                                                           */
/* ------------------------------------------------------------------ */

interface SelectDropdownShortcutProps
  extends Omit<React.ComponentPropsWithoutRef<'span'>, 'className' | 'style'>,
    CommonProps {
  children?: React.ReactNode;
}

function SelectDropdownShortcut(props: SelectDropdownShortcutProps) {
  const { className, ...rest } = applyCommonProps(props);
  const { children, ...domProps } = rest;
  return (
    <span className={cx('ld-select-dropdown-shortcut', className)} {...(domProps as React.HTMLAttributes<HTMLSpanElement>)}>
      {children}
    </span>
  );
}

SelectDropdownShortcut.displayName = 'SelectDropdownShortcut';

/* ------------------------------------------------------------------ */
/*  CheckmarkItem — single-select option with a trailing checkmark     */
/* ------------------------------------------------------------------ */

interface SelectDropdownCheckmarkItemProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'>,
    CommonProps {
  /** Whether this option is currently selected. */
  checked?: boolean;
  disabled?: boolean;
  /** Fired when the option is activated. */
  onSelect?: () => void;
  /** Close the menu after selection. Defaults to `true`. */
  closeOnSelect?: boolean;
  children?: React.ReactNode;
}

const SelectDropdownCheckmarkItem = React.forwardRef<HTMLDivElement, SelectDropdownCheckmarkItemProps>(
  function SelectDropdownCheckmarkItemInner(props, ref) {
    const { className, ...rest } = applyCommonProps(props);
    const { children, checked, disabled, onSelect, onClick, closeOnSelect = true, ...domProps } = rest;
    const { onOpenChange } = useMenuCtx();

    const activate = () => {
      if (disabled) return;
      onSelect?.();
      if (closeOnSelect) onOpenChange(false);
    };

    return (
      <div
        ref={ref}
        role="menuitemcheckbox"
        aria-checked={checked}
        tabIndex={disabled ? undefined : -1}
        data-disabled={disabled || undefined}
        data-state={checked ? 'checked' : 'unchecked'}
        className={cx('ld-select-dropdown-checkmark-item', className)}
        onClick={(e) => {
          onClick?.(e);
          activate();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            activate();
          }
        }}
        {...(domProps as React.HTMLAttributes<HTMLDivElement>)}
      >
        <span
          className="ld-select-dropdown-checkmark-label"
          data-text={typeof children === 'string' ? children : undefined}
        >
          {children}
        </span>
        <span className="ld-select-dropdown-trailing-check" aria-hidden="true">
          {checked ? <CheckIcon /> : null}
        </span>
      </div>
    );
  },
);

SelectDropdownCheckmarkItem.displayName = 'SelectDropdownCheckmarkItem';

/* ------------------------------------------------------------------ */
/*  DescriptionItem — leading icon, title + description, trailing check */
/* ------------------------------------------------------------------ */

interface SelectDropdownDescriptionItemProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style' | 'title'>,
    CommonProps {
  /** Primary label. */
  title: React.ReactNode;
  /** Secondary descriptive text shown beneath the title. */
  description?: React.ReactNode;
  /** Leading media — defaults to a placeholder icon inside a round avatar. */
  icon?: React.ReactNode;
  /** Whether this option is currently selected. */
  checked?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  /** Close the menu after selection. Defaults to `true`. */
  closeOnSelect?: boolean;
}

const SelectDropdownDescriptionItem = React.forwardRef<HTMLDivElement, SelectDropdownDescriptionItemProps>(
  function SelectDropdownDescriptionItemInner(props, ref) {
    const { className, ...rest } = applyCommonProps(props);
    const { title, description, icon, checked, disabled, onSelect, onClick, closeOnSelect = true, ...domProps } = rest;
    const { onOpenChange } = useMenuCtx();

    const activate = () => {
      if (disabled) return;
      onSelect?.();
      if (closeOnSelect) onOpenChange(false);
    };

    return (
      <div
        ref={ref}
        role="menuitemcheckbox"
        aria-checked={checked}
        tabIndex={disabled ? undefined : -1}
        data-disabled={disabled || undefined}
        data-state={checked ? 'checked' : 'unchecked'}
        className={cx('ld-select-dropdown-description-item', className)}
        onClick={(e) => {
          onClick?.(e);
          activate();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            activate();
          }
        }}
        {...(domProps as React.HTMLAttributes<HTMLDivElement>)}
      >
        <span className="ld-select-dropdown-description-avatar" aria-hidden="true">
          {icon ?? <ImagePlaceholderIcon />}
        </span>
        <span className="ld-select-dropdown-description-text">
          <span
            className="ld-select-dropdown-description-title"
            data-text={typeof title === 'string' ? title : undefined}
          >
            {title}
          </span>
          {description ? (
            <span className="ld-select-dropdown-description-desc">{description}</span>
          ) : null}
        </span>
        <span className="ld-select-dropdown-trailing-check" aria-hidden="true">
          {checked ? <CheckIcon /> : null}
        </span>
      </div>
    );
  },
);

SelectDropdownDescriptionItem.displayName = 'SelectDropdownDescriptionItem';

/* ------------------------------------------------------------------ */
/*  DescriptionFavoriteItem — description item + trailing favorite star */
/* ------------------------------------------------------------------ */

interface SelectDropdownDescriptionFavoriteItemProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style' | 'title'>,
    CommonProps {
  /** Primary label. */
  title: React.ReactNode;
  /** Secondary descriptive text shown beneath the title. */
  description?: React.ReactNode;
  /** Leading media — defaults to a placeholder icon inside a round avatar. */
  icon?: React.ReactNode;
  /** Whether this option is currently selected (shows a trailing checkmark). */
  checked?: boolean;
  /** Whether this option is favorited (shows a filled star). */
  favorite?: boolean;
  /** Fired when the favorite star is toggled. */
  onFavoriteChange?: (favorite: boolean) => void;
  disabled?: boolean;
  onSelect?: () => void;
  /** Close the menu after selection. Defaults to `true`. */
  closeOnSelect?: boolean;
}

const SelectDropdownDescriptionFavoriteItem = React.forwardRef<
  HTMLDivElement,
  SelectDropdownDescriptionFavoriteItemProps
>(function SelectDropdownDescriptionFavoriteItemInner(props, ref) {
  const { className, ...rest } = applyCommonProps(props);
  const {
    title,
    description,
    icon,
    checked,
    favorite,
    onFavoriteChange,
    disabled,
    onSelect,
    onClick,
    closeOnSelect = true,
    ...domProps
  } = rest;
  const { onOpenChange } = useMenuCtx();

  const activate = () => {
    if (disabled) return;
    onSelect?.();
    if (closeOnSelect) onOpenChange(false);
  };

  return (
    <div
      ref={ref}
      role="menuitemcheckbox"
      aria-checked={checked}
      tabIndex={disabled ? undefined : -1}
      data-disabled={disabled || undefined}
      data-state={checked ? 'checked' : 'unchecked'}
      className={cx('ld-select-dropdown-description-item', className)}
      onClick={(e) => {
        onClick?.(e);
        activate();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate();
        }
      }}
      {...(domProps as React.HTMLAttributes<HTMLDivElement>)}
    >
      <span className="ld-select-dropdown-description-avatar" aria-hidden="true">
        {icon ?? <ImagePlaceholderIcon />}
      </span>
      <span className="ld-select-dropdown-description-text">
        <span
          className="ld-select-dropdown-description-title"
          data-text={typeof title === 'string' ? title : undefined}
        >
          {title}
        </span>
        {description ? (
          <span className="ld-select-dropdown-description-desc">{description}</span>
        ) : null}
      </span>
      <button
        type="button"
        className="ld-select-dropdown-favorite-button"
        aria-pressed={favorite}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        tabIndex={-1}
        disabled={disabled}
        onClick={(e) => {
          // Toggling the star must not also select the row.
          e.stopPropagation();
          onFavoriteChange?.(!favorite);
        }}
      >
        {favorite ? (
          <span className="ld-select-dropdown-favorite-star" aria-hidden="true">
            <StarFillIcon decorative size="small" className="ld-select-dropdown-favorite-star-fill" />
            <StarOutlineIcon decorative size="small" className="ld-select-dropdown-favorite-star-border" />
          </span>
        ) : (
          <StarOutlineIcon decorative size="small" />
        )}
      </button>
      <span className="ld-select-dropdown-trailing-check" aria-hidden="true">
        {checked ? <CheckIcon /> : null}
      </span>
    </div>
  );
});

SelectDropdownDescriptionFavoriteItem.displayName = 'SelectDropdownDescriptionFavoriteItem';

/* ------------------------------------------------------------------ */
/*  SwitchItem — row with a label and a trailing toggle switch          */
/* ------------------------------------------------------------------ */

interface SelectDropdownSwitchItemProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'>,
    CommonProps {
  /** Whether the switch is on. */
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** Optional leading icon. */
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const SelectDropdownSwitchItem = React.forwardRef<HTMLDivElement, SelectDropdownSwitchItemProps>(
  function SelectDropdownSwitchItemInner(props, ref) {
    const { className, ...rest } = applyCommonProps(props);
    const { children, checked, onCheckedChange, disabled, icon, onClick, ...domProps } = rest;
    const labelId = React.useId();

    const toggle = () => {
      if (disabled) return;
      onCheckedChange?.(!checked);
    };

    return (
      <div
        ref={ref}
        role="menuitemcheckbox"
        aria-checked={checked}
        tabIndex={disabled ? undefined : -1}
        data-disabled={disabled || undefined}
        data-state={checked ? 'checked' : 'unchecked'}
        className={cx('ld-select-dropdown-switch-item', className)}
        onClick={(e) => {
          if (disabled) return;
          onClick?.(e);
          toggle();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        }}
        {...(domProps as React.HTMLAttributes<HTMLDivElement>)}
      >
        {icon ? (
          <span className="ld-select-dropdown-switch-icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <span
          id={labelId}
          className="ld-select-dropdown-switch-label"
          data-text={typeof children === 'string' ? children : undefined}
        >
          {children}
        </span>
        {/* Visual only — the row (menuitemcheckbox) is the interactive control. */}
        <span className="ld-select-dropdown-switch-control" aria-hidden="true">
          <Switch
            size="small"
            isOn={!!checked}
            disabled={disabled}
            a11yLabelledBy={labelId}
            tabIndex={-1}
          />
        </span>
      </div>
    );
  },
);

SelectDropdownSwitchItem.displayName = 'SelectDropdownSwitchItem';

/* ------------------------------------------------------------------ */
/*  EditItem — inline editable field rendered as a select option       */
/* ------------------------------------------------------------------ */

interface SelectDropdownEditItemProps extends CommonProps {
  /** Controlled value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Fired on Enter. Receives the current value. */
  onSubmit?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Error message rendered beneath the field. Also applies the error styling. */
  error?: React.ReactNode;
  /** Whether this option is currently selected (shows a trailing checkmark). */
  checked?: boolean;
  /**
   * Fired when the read-only row is clicked once (gated mode only). Use this to
   * select the item in the list. A double-click enters edit mode instead.
   */
  onSelect?: () => void;
  /**
   * When `true`, the item starts read-only and only becomes editable after a
   * double-click (or F2 while focused). A single click selects the row via
   * `onSelect`. Clicking away — or pressing Enter — saves the value and returns
   * the item to read-only. Escape cancels the edit and restores the previous
   * value. Defaults to `false` (always editable).
   */
  editOnDoubleClick?: boolean;
}

const SelectDropdownEditItem = React.forwardRef<HTMLInputElement, SelectDropdownEditItemProps>(
  function SelectDropdownEditItemInner(props, ref) {
    const { className, style, ...rest } = applyCommonProps(props);
    const {
      value: controlledValue,
      defaultValue = '',
      onValueChange,
      onSubmit,
      onSelect,
      placeholder,
      disabled,
      error,
      checked,
      editOnDoubleClick = false,
    } = rest as SelectDropdownEditItemProps;

    const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
    const value = controlledValue !== undefined ? controlledValue : uncontrolled;

    // Gated-edit state: when `editOnDoubleClick` is set the field is read-only
    // until the user double-clicks into it, then commits on blur/Enter.
    const [editing, setEditing] = React.useState(false);
    // Snapshot of the value when editing began, so Escape can restore it.
    const editStartValue = React.useRef(value);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergedInputRef = mergeRefs<HTMLInputElement>(inputRef, ref);

    const setValue = React.useCallback(
      (next: string) => {
        if (controlledValue === undefined) setUncontrolled(next);
        onValueChange?.(next);
      },
      [controlledValue, onValueChange],
    );

    const beginEdit = () => {
      if (disabled) return;
      editStartValue.current = value;
      setEditing(true);
    };

    const commit = () => {
      setEditing(false);
      onSubmit?.(value);
    };

    const cancel = () => {
      setValue(editStartValue.current);
      setEditing(false);
    };

    // Focus and select the input when entering edit mode.
    React.useEffect(() => {
      if (editing && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, [editing]);

    // In gated mode, render a read-only display row until the user edits.
    const readOnly = editOnDoubleClick && !editing;

    // In read-only (gated) mode the whole item behaves like a menu item: a
    // single click selects it, a double-click opens it for editing.
    const readOnlyProps = readOnly
      ? {
          role: 'menuitem',
          tabIndex: disabled ? undefined : -1,
          onClick: () => {
            if (!disabled) onSelect?.();
          },
          onDoubleClick: beginEdit,
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === 'F2') {
              e.preventDefault();
              beginEdit();
            } else if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (!disabled) onSelect?.();
            }
          },
        }
      : {};

    return (
      <div
        className={cx(
          'ld-select-dropdown-edit-item',
          readOnly && 'ld-select-dropdown-edit-item--readonly',
          className,
        )}
        data-disabled={disabled || undefined}
        data-error={error ? '' : undefined}
        style={style as React.CSSProperties}
        {...readOnlyProps}
      >
        <div className="ld-select-dropdown-edit-row">
          {readOnly ? (
            <div
              className="ld-select-dropdown-edit-display"
              data-placeholder={value ? undefined : ''}
            >
              {value || placeholder}
            </div>
          ) : (
            <div className="ld-select-dropdown-edit-field">
              <input
                ref={mergedInputRef}
                type="text"
                className="ld-select-dropdown-edit-input"
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                aria-invalid={error ? true : undefined}
                onChange={(e) => setValue(e.target.value)}
                onBlur={() => {
                  if (editOnDoubleClick) commit();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (editOnDoubleClick) commit();
                    else onSubmit?.(value);
                  } else if (e.key === 'Escape' && editOnDoubleClick) {
                    e.preventDefault();
                    cancel();
                  }
                  // Don't let the menu's arrow-key navigation steal the caret.
                  e.stopPropagation();
                }}
              />
            </div>
          )}
          <span className="ld-select-dropdown-trailing-check" aria-hidden="true">
            {checked ? <CheckIcon /> : null}
          </span>
        </div>
        {error ? (
          <div className="ld-select-dropdown-edit-error">
            <AlertIcon className="ld-select-dropdown-edit-error-icon" aria-hidden="true" />
            <span>{error}</span>
          </div>
        ) : null}
      </div>
    );
  },
);

SelectDropdownEditItem.displayName = 'SelectDropdownEditItem';

/* ------------------------------------------------------------------ */
/*  SectionTitle — non-interactive group heading (regular / bold)      */
/* ------------------------------------------------------------------ */

interface SelectDropdownSectionTitleProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'>,
    CommonProps {
  variant?: 'regular' | 'bold';
  children?: React.ReactNode;
}

const SelectDropdownSectionTitle = React.forwardRef<HTMLDivElement, SelectDropdownSectionTitleProps>(
  function SelectDropdownSectionTitleInner(props, ref) {
    const { className, ...rest } = applyCommonProps(props);
    const { variant = 'regular', children, ...domProps } = rest;
    return (
      <div
        ref={ref}
        role="presentation"
        data-variant={variant}
        className={cx('ld-select-dropdown-section-title', className)}
        {...(domProps as React.HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </div>
    );
  },
);

SelectDropdownSectionTitle.displayName = 'SelectDropdownSectionTitle';

/* ------------------------------------------------------------------ */
/*  AccordionSection — expandable / collapsible group of options       */
/* ------------------------------------------------------------------ */

interface SelectDropdownAccordionSectionProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style' | 'title' | 'onToggle'>,
    CommonProps {
  /** Heading shown on the trigger row. */
  title: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

const SelectDropdownAccordionSection = React.forwardRef<HTMLDivElement, SelectDropdownAccordionSectionProps>(
  function SelectDropdownAccordionSectionInner(props, ref) {
    const { className, ...rest } = applyCommonProps(props);
    const { title, open: controlledOpen, defaultOpen = false, onOpenChange, disabled, children, ...domProps } = rest;
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
    const contentId = React.useId();

    const toggle = () => {
      if (disabled) return;
      const next = !open;
      if (controlledOpen === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
    };

    return (
      <div
        ref={ref}
        className={cx('ld-select-dropdown-accordion', className)}
        {...(domProps as React.HTMLAttributes<HTMLDivElement>)}
      >
        <button
          type="button"
          className="ld-select-dropdown-accordion-trigger"
          aria-expanded={open}
          aria-controls={contentId}
          disabled={disabled}
          data-disabled={disabled || undefined}
          data-state={open ? 'open' : 'closed'}
          onClick={toggle}
        >
          <span className="ld-select-dropdown-accordion-title">{title}</span>
          <ChevronDownIcon className="ld-select-dropdown-accordion-chevron" aria-hidden="true" />
        </button>
        <div id={contentId} role="group" hidden={!open} className="ld-select-dropdown-accordion-content">
          {open ? children : null}
        </div>
      </div>
    );
  },
);

SelectDropdownAccordionSection.displayName = 'SelectDropdownAccordionSection';

/* ------------------------------------------------------------------ */
/*  Exports                                                            */
/* ------------------------------------------------------------------ */

export {
  SelectDropdown,
  SelectDropdownTrigger,
  SelectDropdownContent,
  SelectDropdownItem,
  SelectDropdownCheckboxItem,
  SelectDropdownRadioItem,
  SelectDropdownCheckmarkItem,
  SelectDropdownDescriptionItem,
  SelectDropdownDescriptionFavoriteItem,
  SelectDropdownSwitchItem,
  SelectDropdownEditItem,
  SelectDropdownSectionTitle,
  SelectDropdownAccordionSection,
  SelectDropdownLabel,
  SelectDropdownSeparator,
  SelectDropdownFooter,
  SelectDropdownShortcut,
  SelectDropdownSub,
  SelectDropdownSubContent,
  SelectDropdownSubTrigger,
  SelectDropdownRadioGroup,
};

export type {
  SelectDropdownProps,
  SelectDropdownContentProps,
  SelectDropdownItemProps,
  SelectDropdownCheckboxItemProps,
  SelectDropdownRadioItemProps,
  SelectDropdownCheckmarkItemProps,
  SelectDropdownDescriptionItemProps,
  SelectDropdownDescriptionFavoriteItemProps,
  SelectDropdownSwitchItemProps,
  SelectDropdownEditItemProps,
  SelectDropdownSectionTitleProps,
  SelectDropdownAccordionSectionProps,
  SelectDropdownRadioGroupProps,
  SelectDropdownLabelProps,
  SelectDropdownFooterProps,
  SelectDropdownSubTriggerProps,
  SelectDropdownSubContentProps,
  SelectDropdownTriggerProps,
  SelectDropdownShortcutProps,
};
