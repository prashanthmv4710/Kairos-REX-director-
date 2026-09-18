// @refresh reset

/**
 * @module Menubar
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
 * For prop API + usage notes, read `Menubar.md` in this folder
 * or run `npm run ld-kit -- show Menubar`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/ui/menubar.tsx
 *
 * AX Menubar — classic desktop menubar (`File` / `Edit` / `View` …).
 * Hand-rolled (no Radix); supports menus, sub-menus, items, checkbox /
 * radio items, labels, separators, and shortcuts.
 *
 * Adaptation: CSS modules → plain `.css` BEM; chevron / check use the
 * shared LD icon font. The radio dot stays an inline SVG — it's a
 * selection primitive with no equivalent glyph in the icon font.
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Icon} from '../Icons';
import {cx} from '../../common/cx';

import './Menubar.css';

interface MenubarContextValue {
  activeMenu: string | null;
  setActiveMenu: (id: string | null) => void;
}
const MenubarCtx = React.createContext<MenubarContextValue>({
  activeMenu: null,
  setActiveMenu: () => {},
});

interface MenuContextValue {
  menuId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}
const MenuCtx = React.createContext<MenuContextValue | null>(null);
function useMenuCtx() {
  const ctx = React.useContext(MenuCtx);
  if (!ctx) throw new Error('Menubar menu components must be inside <MenubarMenu>');
  return ctx;
}

interface RadioGroupContextValue {
  value: string;
  onValueChange: (value: string) => void;
}
const RadioGroupCtx = React.createContext<RadioGroupContextValue | null>(null);

interface SubContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const SubCtx = React.createContext<SubContextValue | null>(null);

const CheckIcon = () => <Icon name="Check" style={{fontSize: 14}} decorative />;

const ChevronRightIcon = () => <Icon name="ChevronRight" style={{fontSize: 14}} decorative />;

const RadioDotIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden>
    <circle cx="4" cy="4" r="3" fill="currentColor" />
  </svg>
);

export const Menubar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => {
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  return (
    <MenubarCtx.Provider value={{activeMenu, setActiveMenu}}>
      <div
        ref={ref}
        role="menubar"
        className={cx('ax-menubar', className)}
        {...props}
      />
    </MenubarCtx.Provider>
  );
});
Menubar.displayName = 'Menubar';

export function MenubarMenu({children}: {children: React.ReactNode}) {
  const menuId = React.useId();
  const {activeMenu, setActiveMenu} = React.useContext(MenubarCtx);
  const open = activeMenu === menuId;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const onOpenChange = React.useCallback(
    (next: boolean) => setActiveMenu(next ? menuId : null),
    [menuId, setActiveMenu],
  );
  return (
    <MenuCtx.Provider value={{menuId, open, onOpenChange, triggerRef}}>
      {children}
    </MenuCtx.Provider>
  );
}

export const MenubarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => <div ref={ref} role="group" {...props} />);
MenubarGroup.displayName = 'MenubarGroup';

export function MenubarPortal({children}: {children: React.ReactNode}) {
  return ReactDOM.createPortal(children, document.body);
}

export function MenubarSub({children}: {children: React.ReactNode}) {
  const [open, setOpen] = React.useState(false);
  return (
    <SubCtx.Provider value={{open, onOpenChange: setOpen}}>{children}</SubCtx.Provider>
  );
}

interface MenubarRadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

export const MenubarRadioGroup = React.forwardRef<
  HTMLDivElement,
  MenubarRadioGroupProps
>(({value = '', onValueChange, ...props}, ref) => (
  <RadioGroupCtx.Provider
    value={{value, onValueChange: onValueChange || (() => {})}}
  >
    <div ref={ref} role="group" {...props} />
  </RadioGroupCtx.Provider>
));
MenubarRadioGroup.displayName = 'MenubarRadioGroup';

export const MenubarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({className, onClick, ...props}, ref) => {
  const {open, onOpenChange, triggerRef} = useMenuCtx();
  const {activeMenu} = React.useContext(MenubarCtx);

  const mergedRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref)
        (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    },
    [ref, triggerRef],
  );

  return (
    <button
      ref={mergedRef}
      type="button"
      role="menuitem"
      aria-expanded={open}
      aria-haspopup="menu"
      data-state={open ? 'open' : 'closed'}
      className={cx('ax-menubar__trigger', className)}
      onClick={(e) => {
        onClick?.(e);
        onOpenChange(!open);
      }}
      onMouseEnter={() => {
        if (activeMenu !== null) onOpenChange(true);
      }}
      {...props}
    />
  );
});
MenubarTrigger.displayName = 'MenubarTrigger';

export const MenubarSubTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {inset?: boolean}
>(({className, inset, children, onMouseEnter, onMouseLeave, ...props}, ref) => {
  const sub = React.useContext(SubCtx);
  return (
    <div
      ref={ref}
      role="menuitem"
      aria-haspopup="menu"
      data-state={sub?.open ? 'open' : 'closed'}
      className={cx(
        'ax-menubar__sub-trigger',
        inset && 'ax-menubar__item--inset',
        className,
      )}
      onMouseEnter={(e) => {
        sub?.onOpenChange(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        sub?.onOpenChange(false);
        onMouseLeave?.(e);
      }}
      {...props}
    >
      {children}
      <span className="ax-menubar__chevron">
        <ChevronRightIcon />
      </span>
    </div>
  );
});
MenubarSubTrigger.displayName = 'MenubarSubTrigger';

export const MenubarSubContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => {
  const sub = React.useContext(SubCtx);
  if (!sub?.open) return null;
  return (
    <div
      ref={ref}
      role="menu"
      data-state="open"
      className={cx('ax-menubar__content', className)}
      style={{position: 'absolute', left: '100%', top: 0}}
      {...props}
    />
  );
});
MenubarSubContent.displayName = 'MenubarSubContent';

export interface MenubarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
  sideOffset?: number;
}

export const MenubarContent = React.forwardRef<
  HTMLDivElement,
  MenubarContentProps
>(({className, align = 'start', alignOffset = -4, sideOffset = 8, style, ...props}, ref) => {
  const {open, onOpenChange, triggerRef} = useMenuCtx();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState<{top: number; left: number}>({top: 0, left: 0});

  const mergedRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref)
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [ref],
  );

  React.useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    let left = rect.left + alignOffset;
    if (align === 'end') left = rect.right + alignOffset;
    if (align === 'center') left = rect.left + rect.width / 2 + alignOffset;
    setPos({top: rect.bottom + sideOffset, left});
  }, [open, align, alignOffset, sideOffset, triggerRef]);

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
        triggerRef.current?.focus();
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const items = contentRef.current?.querySelectorAll<HTMLElement>(
          '[role="menuitem"]:not([data-disabled])',
        );
        if (!items || items.length === 0) return;
        const current = Array.from(items).findIndex(
          (el) => el === document.activeElement,
        );
        const next =
          e.key === 'ArrowDown'
            ? current < items.length - 1
              ? current + 1
              : 0
            : current > 0
              ? current - 1
              : items.length - 1;
        items[next].focus();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onOpenChange, triggerRef]);

  if (!open) return null;
  return (
    <MenubarPortal>
      <div
        ref={mergedRef}
        role="menu"
        data-state="open"
        className={cx('ax-menubar__content', className)}
        style={{
          position: 'fixed',
          top: pos.top,
          left: pos.left,
          zIndex: 50,
          ...style,
        }}
        {...props}
      />
    </MenubarPortal>
  );
});
MenubarContent.displayName = 'MenubarContent';

export const MenubarItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    inset?: boolean;
    disabled?: boolean;
    onSelect?: () => void;
  }
>(({className, inset, disabled, onSelect, onClick, ...props}, ref) => {
  const {onOpenChange} = useMenuCtx();
  return (
    <div
      ref={ref}
      role="menuitem"
      tabIndex={disabled ? undefined : -1}
      data-disabled={disabled || undefined}
      className={cx(
        'ax-menubar__item',
        inset && 'ax-menubar__item--inset',
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
      {...props}
    />
  );
});
MenubarItem.displayName = 'MenubarItem';

export interface MenubarCheckboxItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export const MenubarCheckboxItem = React.forwardRef<
  HTMLDivElement,
  MenubarCheckboxItemProps
>(
  (
    {className, children, checked, onCheckedChange, disabled, onClick, ...props},
    ref,
  ) => {
    const {onOpenChange} = useMenuCtx();
    return (
      <div
        ref={ref}
        role="menuitemcheckbox"
        aria-checked={checked}
        tabIndex={disabled ? undefined : -1}
        data-disabled={disabled || undefined}
        data-state={checked ? 'checked' : 'unchecked'}
        className={cx('ax-menubar__item-with-indicator', className)}
        onClick={(e) => {
          if (disabled) return;
          onClick?.(e);
          onCheckedChange?.(!checked);
          onOpenChange(false);
        }}
        {...props}
      >
        <span className="ax-menubar__indicator">{checked ? <CheckIcon /> : null}</span>
        {children}
      </div>
    );
  },
);
MenubarCheckboxItem.displayName = 'MenubarCheckboxItem';

export interface MenubarRadioItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

export const MenubarRadioItem = React.forwardRef<
  HTMLDivElement,
  MenubarRadioItemProps
>(({className, children, value, disabled, onClick, ...props}, ref) => {
  const {onOpenChange} = useMenuCtx();
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
      className={cx('ax-menubar__item-with-indicator', className)}
      onClick={(e) => {
        if (disabled) return;
        onClick?.(e);
        radioGroup?.onValueChange(value);
        onOpenChange(false);
      }}
      {...props}
    >
      <span className="ax-menubar__indicator">
        {checked ? <RadioDotIcon /> : null}
      </span>
      {children}
    </div>
  );
});
MenubarRadioItem.displayName = 'MenubarRadioItem';

export const MenubarLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {inset?: boolean}
>(({className, inset, ...props}, ref) => (
  <div
    ref={ref}
    className={cx(
      'ax-menubar__label',
      inset && 'ax-menubar__label--inset',
      className,
    )}
    {...props}
  />
));
MenubarLabel.displayName = 'MenubarLabel';

export const MenubarSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
  <div
    ref={ref}
    role="separator"
    className={cx('ax-menubar__separator', className)}
    {...props}
  />
));
MenubarSeparator.displayName = 'MenubarSeparator';

export const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cx('ax-menubar__shortcut', className)} {...props} />
);
MenubarShortcut.displayName = 'MenubarShortcut';


MenubarMenu.displayName = 'MenubarMenu';
MenubarPortal.displayName = 'MenubarPortal';
MenubarSub.displayName = 'MenubarSub';
