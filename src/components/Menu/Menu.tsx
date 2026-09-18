'use client';
// @refresh reset

/**
 * @module Menu
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
 * For prop API + usage notes, read `Menu.md` in this folder
 * or run `npm run ld-kit -- show Menu`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {useStableId, applyCommonProps, CalculatePositionFn} from '../../common/helpers';
import {CSSTransition} from '../../common/CSSTransition';
import {WithIconProps} from '../../common/types';
import {SelectedIcon} from '../Icons';
// ---------------------------------------------------------------------------
// Menu.service (inlined sub-component)
// ---------------------------------------------------------------------------

export type MenuPosition =
  | 'bottomLeft'
  | 'bottomRight'
  | 'topLeft'
  | 'topRight';

export const useMenuCalculatePosition = (position: MenuPosition) =>
  React.useCallback<CalculatePositionFn>(
    ({referrerHeight, referrerWidth, targetHeight, targetWidth}) => ({
      left:
        position === 'bottomRight' || position === 'topRight'
          ? targetWidth - referrerWidth
          : 0,
      top:
        position === 'topLeft' || position === 'topRight'
          ? -1 * referrerHeight
          : targetHeight,
    }),
    [position]
  );

/* ------------------------------------------------------------------ */
/*  Inline SVG icons                                                   */
/* ------------------------------------------------------------------ */

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" d="M5.646 3.646a.5.5 0 01.708 0l4 4a.5.5 0 010 .708l-4 4a.5.5 0 01-.708-.708L9.293 8 5.646 4.354a.5.5 0 010-.708z" />
    </svg>
  );
}

function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" d="M10.354 3.646a.5.5 0 010 .708L6.707 8l3.647 3.646a.5.5 0 01-.708.708l-4-4a.5.5 0 010-.708l4-4a.5.5 0 01.708 0z" />
    </svg>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" d="M3.646 5.646a.5.5 0 01.708 0L8 9.293l3.646-3.647a.5.5 0 01.708.708l-4 4a.5.5 0 01-.708 0l-4-4a.5.5 0 010-.708z" />
    </svg>
  );
}

function InfoCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 7v3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.9" fill="currentColor" />
    </svg>
  );
}

function AlertIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M8 1.5A6.5 6.5 0 108 14.5 6.5 6.5 0 008 1.5zM7.25 4.5h1.5v4.5h-1.5V4.5zM8 12a.9.9 0 110-1.8.9.9 0 010 1.8z" />
    </svg>
  );
}

function ImagePlaceholderIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8.5" cy="9.5" r="1.5" fill="currentColor" />
      <path d="M4 17l4.5-4.5 3 3L15.5 11l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Contexts                                                           */
/* ------------------------------------------------------------------ */

interface MenuCloseContextValue {
  /** Close the whole menu (used by action items after they run). */
  close: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
}
const MenuCloseCtx = React.createContext<MenuCloseContextValue | null>(null);

interface MenuInfoEntry {
  id: string;
  title: React.ReactNode;
  details: React.ReactNode;
}
interface MenuInfoContextValue {
  /** Id of the item whose detail panel is currently expanded, if any. */
  activeId: string | null;
  /** Toggle the detail panel for an info item (expands, or collapses if same). */
  toggle: (entry: MenuInfoEntry) => void;
}
const MenuInfoCtx = React.createContext<MenuInfoContextValue | null>(null);

function renderLeadingIcon(icon: React.ReactNode, size: 'small' | 'medium' = 'small') {
  if (!icon) return null;
  return (
    <span className="ld-menu-leadingIcon">
      {React.isValidElement<WithIconProps>(icon)
        ? React.cloneElement(icon, {size})
        : icon}
    </span>
  );
}

// ---------------------------------------------------------------------------
// MenuContainer (inlined sub-component)
// ---------------------------------------------------------------------------

export interface MenuContainerProps
  extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * The content for the menu container.
   */
  children: React.ReactNode;
}

/**
 * @private
 */
export const MenuContainer = React.forwardRef<
  HTMLDivElement,
  MenuContainerProps
>((props, ref) => {
  const {className, ...rest} = props;

  return (
    <div
      className={cx('ld-menu-menucontainer-container', className)}
      ref={ref}
      role="menu"
      {...rest}
    />
  );
});

// ---------------------------------------------------------------------------
// MenuItem (inlined sub-component)
// ---------------------------------------------------------------------------

export interface MenuItemProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'className' | 'style'> {
  /**
   * The text label for the menu item.
   */
  children: React.ReactNode;
  /**
   * If the menu item is disabled.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * The leading icon for the menu item.
   */
  leadingIcon?: React.ReactNode;
  /**
   * Optional trailing content (icon, shortcut, etc.) pinned to the end.
   */
  trailingIcon?: React.ReactNode;
  /**
   * Renders the item with destructive styling (e.g. a "Delete" command).
   *
   * @default false
   */
  destructive?: boolean;
  /** Whether this menu item is currently selected. */
  selected?: boolean;
}

/**
 * A standard menu item. Runs an action or navigates, then closes the menu.
 */
export const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(
  (props, ref) => {
    const {children, className, disabled, leadingIcon, trailingIcon, destructive, selected = false, onClick, ...rest} =
      applyCommonProps(props);
    const menu = React.useContext(MenuCloseCtx);
    const resolvedTrailingIcon = selected
      ? <SelectedIcon size="small" decorative />
      : trailingIcon;

    return (
      <button
        className={cx(
          'ld-menu-menuitem-menuItem',
          destructive && 'ld-menu-menuitem--destructive',
          selected && 'ld-menu-menuitem--selected',
          className,
        )}
        disabled={disabled}
        ref={ref}
        role={selected ? 'menuitemcheckbox' : 'menuitem'}
        aria-checked={selected || undefined}
        tabIndex={-1}
        type="button"
        onClick={(event) => {
          if (disabled) return;
          onClick?.(event);
          menu?.close(event);
        }}
        {...rest}
      >
        {renderLeadingIcon(leadingIcon)}
        <span className="ld-menu-menuitem-label">{children}</span>
        {resolvedTrailingIcon ? <span className="ld-menu-trailingIcon">{resolvedTrailingIcon}</span> : null}
      </button>
    );
  }
);

MenuItem.displayName = 'MenuItem';

// ---------------------------------------------------------------------------
// MenuDescriptionItem
// ---------------------------------------------------------------------------

export interface MenuDescriptionItemProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'className' | 'style' | 'title'> {
  /** Primary label. */
  title: React.ReactNode;
  /** Secondary descriptive text shown beneath the title. */
  description?: React.ReactNode;
  /** Leading media — defaults to a placeholder icon inside a round avatar. */
  icon?: React.ReactNode;
  disabled?: boolean;
}

/**
 * A richer menu item with a leading avatar, a bold title, and a supporting
 * description line. Runs an action or navigates, then closes the menu.
 */
export const MenuDescriptionItem = React.forwardRef<HTMLButtonElement, MenuDescriptionItemProps>(
  (props, ref) => {
    const {title, description, icon, disabled, className, onClick, ...rest} = applyCommonProps(props);
    const menu = React.useContext(MenuCloseCtx);

    return (
      <button
        className={cx('ld-menu-description-item', className)}
        disabled={disabled}
        ref={ref}
        role="menuitem"
        tabIndex={-1}
        type="button"
        onClick={(event) => {
          if (disabled) return;
          onClick?.(event);
          menu?.close(event);
        }}
        {...rest}
      >
        <span className="ld-menu-description-avatar" aria-hidden="true">
          {icon ?? <ImagePlaceholderIcon />}
        </span>
        <span className="ld-menu-description-text">
          <span className="ld-menu-description-title">{title}</span>
          {description ? <span className="ld-menu-description-desc">{description}</span> : null}
        </span>
      </button>
    );
  }
);

MenuDescriptionItem.displayName = 'MenuDescriptionItem';

// ---------------------------------------------------------------------------
// MenuInfoItem
// ---------------------------------------------------------------------------

export interface MenuInfoItemProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'className' | 'style'> {
  children: React.ReactNode;
  disabled?: boolean;
  leadingIcon?: React.ReactNode;
  /** Accessible label for the trailing info affordance. */
  infoLabel?: string;
  /**
   * Detail content revealed in a panel docked beside the menu when the item is
   * activated. When provided, the item toggles that panel (and does not close
   * the menu) instead of running as a plain action; the trailing info icon
   * becomes a back chevron while expanded.
   */
  details?: React.ReactNode;
}

/**
 * A menu item that carries a trailing info indicator. With `details`, clicking
 * it expands a panel beside the menu showing more about the item; otherwise it
 * runs its action and closes the menu like a normal item.
 */
export const MenuInfoItem = React.forwardRef<HTMLButtonElement, MenuInfoItemProps>(
  (props, ref) => {
    const {children, disabled, leadingIcon, infoLabel = 'More information', details, className, onClick, ...rest} =
      applyCommonProps(props);
    const menu = React.useContext(MenuCloseCtx);
    const info = React.useContext(MenuInfoCtx);
    const reactId = React.useId();

    const expandable = details != null && info != null;
    const expanded = expandable && info!.activeId === reactId;

    return (
      <button
        className={cx('ld-menu-menuitem-menuItem', className)}
        disabled={disabled}
        ref={ref}
        role="menuitem"
        tabIndex={-1}
        type="button"
        aria-expanded={expandable ? expanded : undefined}
        data-state={expanded ? 'open' : undefined}
        onClick={(event) => {
          if (disabled) return;
          onClick?.(event);
          if (expandable) {
            info!.toggle({id: reactId, title: children, details});
          } else {
            menu?.close(event);
          }
        }}
        {...rest}
      >
        {renderLeadingIcon(leadingIcon)}
        <span className="ld-menu-menuitem-label">{children}</span>
        {expanded ? (
          <ChevronLeftIcon className="ld-menu-trailingIcon ld-menu-info-icon" aria-label="Collapse details" role="img" />
        ) : (
          <InfoCircleIcon className="ld-menu-trailingIcon ld-menu-info-icon" aria-label={infoLabel} role="img" />
        )}
      </button>
    );
  }
);

MenuInfoItem.displayName = 'MenuInfoItem';

// ---------------------------------------------------------------------------
// MenuNote
// ---------------------------------------------------------------------------

export interface MenuNoteProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  children: React.ReactNode;
}

/**
 * A non-interactive, wrapping note shown at the foot of a menu — e.g. a caveat
 * or explanatory sentence beneath a group of items.
 */
export const MenuNote = React.forwardRef<HTMLDivElement, MenuNoteProps>((props, ref) => {
  const {children, className, ...rest} = applyCommonProps(props);
  return (
    <div ref={ref} role="note" className={cx('ld-menu-note', className)} {...rest}>
      {children}
    </div>
  );
});

MenuNote.displayName = 'MenuNote';

// ---------------------------------------------------------------------------
// MenuSectionTitle
// ---------------------------------------------------------------------------

export interface MenuSectionTitleProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  variant?: 'regular' | 'bold';
  children: React.ReactNode;
}

/**
 * A non-interactive heading that groups menu items. Skipped by keyboard
 * navigation.
 */
export const MenuSectionTitle = React.forwardRef<HTMLDivElement, MenuSectionTitleProps>(
  (props, ref) => {
    const {variant = 'regular', children, className, ...rest} = applyCommonProps(props);
    return (
      <div
        ref={ref}
        role="presentation"
        data-variant={variant}
        className={cx('ld-menu-section-title', className)}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

MenuSectionTitle.displayName = 'MenuSectionTitle';

// ---------------------------------------------------------------------------
// MenuBreadcrumbItem
// ---------------------------------------------------------------------------

export interface MenuBreadcrumbItemProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'className' | 'style'> {
  children: React.ReactNode;
  disabled?: boolean;
}

/**
 * A breadcrumb row used inside a submenu to show — and navigate — the path
 * back toward the root menu. Leads with a bullet and trails with a chevron.
 */
export const MenuBreadcrumbItem = React.forwardRef<HTMLButtonElement, MenuBreadcrumbItemProps>(
  (props, ref) => {
    const {children, disabled, className, ...rest} = applyCommonProps(props);
    return (
      <button
        className={cx('ld-menu-breadcrumb', className)}
        disabled={disabled}
        ref={ref}
        role="menuitem"
        tabIndex={-1}
        type="button"
        {...rest}
      >
        <span className="ld-menu-breadcrumb-bullet" aria-hidden="true" />
        <span className="ld-menu-menuitem-label">{children}</span>
        <ChevronRightIcon className="ld-menu-chevron" />
      </button>
    );
  }
);

MenuBreadcrumbItem.displayName = 'MenuBreadcrumbItem';

// ---------------------------------------------------------------------------
// MenuSubMenu (drill-in)
// ---------------------------------------------------------------------------

export interface MenuSubMenuProps {
  /** Heading shown on the trigger row. */
  label: React.ReactNode;
  /** Leading icon for the trigger row. */
  leadingIcon?: React.ReactNode;
  disabled?: boolean;
  /** The submenu's items. */
  children: React.ReactNode;
}

/**
 * A submenu. Renders a trigger row in the parent menu; hovering or activating
 * it opens the submenu's items as a cascading flyout panel beside the trigger.
 */
export const MenuSubMenu: React.FunctionComponent<MenuSubMenuProps> = ({
  label,
  leadingIcon,
  disabled,
  children,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div
      className="ld-menu-sub"
      onMouseEnter={() => {
        if (!disabled) setOpen(true);
      }}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="ld-menu-sub-trigger"
        disabled={disabled}
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={open}
        data-state={open ? 'open' : 'closed'}
        tabIndex={-1}
        type="button"
        onClick={() => {
          if (!disabled) setOpen((o) => !o);
        }}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setOpen(true);
          } else if (event.key === 'ArrowLeft' || event.key === 'Escape') {
            setOpen(false);
          }
        }}
      >
        {renderLeadingIcon(leadingIcon)}
        <span className="ld-menu-menuitem-label">{label}</span>
        <ChevronRightIcon className="ld-menu-chevron" />
      </button>
      {open ? (
        <div role="menu" className="ld-menu-menucontainer-container ld-menu-sub-content">
          {children}
        </div>
      ) : null}
    </div>
  );
};

MenuSubMenu.displayName = 'MenuSubMenu';

// ---------------------------------------------------------------------------
// MenuSectionTitleAccordion
// ---------------------------------------------------------------------------

export interface MenuSectionTitleAccordionProps {
  /** Heading shown on the trigger row. */
  title: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  children: React.ReactNode;
}

/**
 * A collapsible section. The header toggles a group of items open and closed
 * without dismissing the menu; the header is bold while open.
 */
export const MenuSectionTitleAccordion: React.FunctionComponent<MenuSectionTitleAccordionProps> = ({
  title,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  disabled,
  children,
}) => {
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
    <div className="ld-menu-accordion">
      <button
        type="button"
        className="ld-menu-accordion-trigger"
        role="menuitem"
        aria-expanded={open}
        aria-controls={contentId}
        disabled={disabled}
        tabIndex={-1}
        data-state={open ? 'open' : 'closed'}
        onClick={toggle}
      >
        <span className="ld-menu-menuitem-label">{title}</span>
        <ChevronDownIcon className="ld-menu-accordion-chevron" />
      </button>
      <div id={contentId} role="group" hidden={!open} className="ld-menu-accordion-content">
        {open ? children : null}
      </div>
    </div>
  );
};

MenuSectionTitleAccordion.displayName = 'MenuSectionTitleAccordion';

// ---------------------------------------------------------------------------
// MenuEditItem
// ---------------------------------------------------------------------------

export interface MenuEditItemProps {
  /** Controlled value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Fired on Enter / commit. Receives the current value. */
  onSubmit?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Error message rendered beneath the field; also applies error styling. */
  error?: React.ReactNode;
  /**
   * When `true`, the item starts read-only and only becomes editable after a
   * double-click (or Enter while focused). Clicking away — or pressing Enter —
   * saves; Escape cancels. Defaults to `false` (always editable).
   */
  editOnDoubleClick?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * An inline editable field rendered as a menu row — e.g. renaming the item the
 * menu is attached to. Does not close the menu on interaction.
 */
export const MenuEditItem = React.forwardRef<HTMLInputElement, MenuEditItemProps>(
  function MenuEditItem(props, ref) {
    const {
      value: controlledValue,
      defaultValue = '',
      onValueChange,
      onSubmit,
      placeholder,
      disabled,
      error,
      editOnDoubleClick = false,
      className,
      style,
    } = props;

    const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
    const value = controlledValue !== undefined ? controlledValue : uncontrolled;

    const [editing, setEditing] = React.useState(!editOnDoubleClick);
    const editStartValue = React.useRef(value);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const setRefs = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
    };

    const setValue = (next: string) => {
      if (controlledValue === undefined) setUncontrolled(next);
      onValueChange?.(next);
    };

    const beginEdit = () => {
      if (disabled || !editOnDoubleClick) return;
      editStartValue.current = value;
      setEditing(true);
    };
    const commit = () => {
      if (editOnDoubleClick) setEditing(false);
      onSubmit?.(value);
    };
    const cancel = () => {
      setValue(editStartValue.current);
      if (editOnDoubleClick) setEditing(false);
    };

    React.useEffect(() => {
      if (editing && editOnDoubleClick && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, [editing, editOnDoubleClick]);

    const readOnly = editOnDoubleClick && !editing;

    return (
      <div
        className={cx('ld-menu-edit-item', className)}
        data-disabled={disabled || undefined}
        data-error={error ? '' : undefined}
        style={style}
        onDoubleClick={beginEdit}
      >
        <div className="ld-menu-edit-row">
          <div className="ld-menu-edit-field" data-readonly={readOnly || undefined}>
            <input
              ref={setRefs}
              type="text"
              className="ld-menu-edit-input"
              value={value}
              placeholder={placeholder}
              disabled={disabled}
              readOnly={readOnly}
              aria-invalid={error ? true : undefined}
              onChange={(e) => setValue(e.target.value)}
              onBlur={() => {
                if (editing && editOnDoubleClick) commit();
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (readOnly && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  beginEdit();
                } else if (e.key === 'Enter') {
                  e.preventDefault();
                  commit();
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  cancel();
                }
              }}
            />
          </div>
        </div>
        {error ? (
          <div className="ld-menu-edit-error">
            <AlertIcon className="ld-menu-edit-error-icon" aria-hidden="true" />
            <span>{error}</span>
          </div>
        ) : null}
      </div>
    );
  }
);

MenuEditItem.displayName = 'MenuEditItem';

// ---------------------------------------------------------------------------
// MenuLayoutContainer (inlined sub-component)
// ---------------------------------------------------------------------------

export interface MenuLayoutContainerProps
  extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * The content for the menu layout container.
   */
  children: React.ReactNode;
  /**
   * The callback fired when the menu layout container requests to close.
   */
  onClose: (event: MouseEvent | PointerEvent | TouchEvent) => void;
  /**
   * The position for the menu layout container.
   */
  position: MenuPosition;
}

/**
 * @private
 */
export const MenuLayoutContainer = React.forwardRef<
  HTMLDivElement,
  MenuLayoutContainerProps
>((props, ref) => {
  const {className, onClose, position, ...rest} = props;

  return (
    <div
      ref={ref}
      className={cx(position === 'bottomLeft' && 'ld-menu-menulayoutcontainer-bottomLeft', position === 'bottomRight' && 'ld-menu-menulayoutcontainer-bottomRight', position === 'topLeft' && 'ld-menu-menulayoutcontainer-topLeft', position === 'topRight' && 'ld-menu-menulayoutcontainer-topRight', className)}
      {...rest}
    />
  );
});

MenuLayoutContainer.displayName = 'MenuLayoutContainer';

// TODO: 'CSSTransition' from 'react-transition-group' needs a portable replacement
import {LayoutContainer} from '../LayoutContainer';
import './Menu.css';

// Inlined from hooks to avoid transitive @livingdesign/tokens dependency
const useOnClick = (
  onClick: (event: PointerEvent | MouseEvent | TouchEvent) => void,
  dependencies: ReadonlyArray<unknown> = [],
  useCapture = false
) =>
  React.useEffect(() => {
    if (window.PointerEvent) {
      document.addEventListener('pointerdown', onClick, useCapture);
    } else {
      document.addEventListener('mousedown', onClick, useCapture);
      document.addEventListener('touchstart', onClick, useCapture);
    }
    return () => {
      if (window.PointerEvent) {
        document.removeEventListener('pointerdown', onClick, useCapture);
      } else {
        document.removeEventListener('mousedown', onClick, useCapture);
        document.removeEventListener('touchstart', onClick, useCapture);
      }
    };
  }, [onClick, ...dependencies, useCapture]);

const useOnClickOutside = (
  ref: React.RefObject<HTMLElement> | React.RefObject<HTMLElement>[],
  onClick: (event: PointerEvent | MouseEvent | TouchEvent) => void,
  useCapture = false
) => {
  const listener = (event: PointerEvent | MouseEvent | TouchEvent) => {
    const elementRef = Array.isArray(ref) ? ref : [ref];
    if (
      elementRef.some((ref2) => ref2.current?.contains(event.target as Node))
    ) {
      return;
    }
    onClick(event);
  };
  useOnClick(listener, [ref, listener], useCapture);
};

// MenuPosition is already exported above

export interface MenuProps
  extends Omit<React.ComponentPropsWithoutRef<'span'>, 'className' | 'style'> {
  /**
   * The content for the menu.
   */
  children: React.ReactNode;
  /**
   * If the menu is open.
   *
   * @default false
   */
  isOpen?: boolean;
  /**
   * The callback fired when the menu requests to close.
   */
  onClose: (
    event:
      | React.KeyboardEvent<HTMLElement>
      | React.MouseEvent<HTMLElement>
      | MouseEvent
      | PointerEvent
      | TouchEvent
  ) => void;
  /**
   * The callback fired when the menu requests to open.
   */
  onOpen: (
    event: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>
  ) => void;
  /**
   * The position for the menu.
   *
   * @default "bottomLeft"
   */
  position?: MenuPosition;
  /**
   * The trigger for the menu.
   */
  trigger: React.ReactElement;
  /**
   * The trigger ref for the menu.
   */
  triggerRef: React.RefObject<HTMLElement>;
}

/**
 * Menus are containers with items for user-triggered navigation and commands.
 * Items run an action or navigate, then the menu closes. The menu supports a
 * mix of standard items, section titles, descriptions, info rows, submenus
 * (drill-in), collapsible accordions, and an inline edit row.
 */
export const Menu: React.FunctionComponent<MenuProps> = (props) => {
  const {
    children,
    className,
    isOpen = false,
    onClose,
    onKeyDown,
    onOpen,
    position = 'bottomLeft',
    trigger,
    triggerRef,
    ...rest
  } = applyCommonProps(props);

  const calculatePosition = useMenuCalculatePosition(position);

  const menuContainerRef = React.useRef<HTMLDivElement>(null);
  const menuId = useStableId();
  const triggerId = useStableId(trigger.props.id);

  // Keyboard focus the menu should grab once it has mounted.
  const pendingFocus = React.useRef<null | 'first' | 'last'>(null);

  useOnClickOutside([menuContainerRef, triggerRef], onClose);

  // Roving focus over the interactive rows in the *root* panel. Querying the
  // live DOM (rather than indexing children) keeps navigation correct when
  // section titles are present or an accordion expands. Rows inside an open
  // submenu flyout are excluded so the parent list navigation stays put.
  const getItems = React.useCallback((): HTMLElement[] => {
    const el = menuContainerRef.current;
    if (!el) return [];
    return Array.from(
      el.querySelectorAll<HTMLElement>('[role^="menuitem"]:not([aria-disabled="true"]):not(:disabled)'),
    ).filter((node) => node.offsetParent !== null && !node.closest('.ld-menu-sub-content'));
  }, []);

  const focusFirst = React.useCallback(() => {
    const items = getItems();
    items[0]?.focus();
  }, [getItems]);
  const focusLast = React.useCallback(() => {
    const items = getItems();
    items[items.length - 1]?.focus();
  }, [getItems]);
  const moveFocus = React.useCallback(
    (dir: 1 | -1) => {
      const items = getItems();
      if (items.length === 0) return;
      const current = items.findIndex((node) => node === document.activeElement);
      const next = current === -1 ? (dir === 1 ? 0 : items.length - 1) : (current + dir + items.length) % items.length;
      items[next]?.focus();
    },
    [getItems],
  );

  // Type-ahead: focus the next interactive row whose text starts with the typed
  // character, cycling from the currently-focused item. Uses the same live-DOM
  // query as roving focus so it stays correct with section titles / accordions.
  const focusItemByChar = React.useCallback(
    (char: string) => {
      const items = getItems();
      if (items.length === 0) return;
      const lower = char.toLowerCase();
      const current = items.findIndex((node) => node === document.activeElement);
      const start = (current + 1) % items.length;
      const ordered = [...items.slice(start), ...items.slice(0, start)];
      const match = ordered.find((el) =>
        el.textContent?.trimStart().toLowerCase().startsWith(lower),
      );
      match?.focus();
    },
    [getItems],
  );

  // After opening, honor a pending keyboard focus request. The menu enters via a
  // CSS transition, so on the first frame(s) after opening the items exist but
  // are not yet focusable (the transitioning wrapper starts hidden), and a
  // single `.focus()` silently no-ops. Retry across a few frames until focus
  // actually lands on an item (or give up), so opening with ArrowDown/ArrowUp
  // reliably moves focus into the menu per the WAI-ARIA menu-button pattern.
  React.useEffect(() => {
    if (!isOpen || !pendingFocus.current) return;
    const which = pendingFocus.current;
    pendingFocus.current = null;
    let raf = 0;
    let tries = 0;
    const attempt = () => {
      if (which === 'last') focusLast();
      else focusFirst();
      const items = getItems();
      const landed = items.length > 0 && items.includes(document.activeElement as HTMLElement);
      if (!landed && tries++ < 15) {
        raf = requestAnimationFrame(attempt);
      }
    };
    raf = requestAnimationFrame(attempt);
    return () => cancelAnimationFrame(raf);
  }, [isOpen, focusFirst, focusLast, getItems]);

  // On close, return focus to the trigger when it was left orphaned — i.e.
  // focus is still inside the closing menu (Escape, Tab, selecting an item) or
  // dropped to <body>. This keeps keyboard/screen-reader users oriented. If
  // focus already moved to another real element (e.g. click-outside on a
  // button), it is left alone.
  const wasOpenRef = React.useRef(isOpen);
  React.useEffect(() => {
    const wasOpen = wasOpenRef.current;
    wasOpenRef.current = isOpen;
    if (!wasOpen || isOpen) return; // only run on the open → closed transition
    const active = document.activeElement as HTMLElement | null;
    const orphaned =
      !active ||
      active === document.body ||
      (menuContainerRef.current?.contains(active) ?? false);
    if (orphaned) triggerRef.current?.focus();
  }, [isOpen, triggerRef]);

  const closeCtx = React.useMemo<MenuCloseContextValue>(
    () => ({close: (event) => onClose(event)}),
    [onClose],
  );

  // Info-detail panel: tracks which info item is expanded. Reset when closed.
  const [infoActive, setInfoActive] = React.useState<MenuInfoEntry | null>(null);
  React.useEffect(() => {
    if (!isOpen) setInfoActive(null);
  }, [isOpen]);
  const infoCtx = React.useMemo<MenuInfoContextValue>(
    () => ({
      activeId: infoActive?.id ?? null,
      toggle: (entry) => setInfoActive((cur) => (cur?.id === entry.id ? null : entry)),
    }),
    [infoActive],
  );

  return (
    <LayoutContainer
      calculatePosition={calculatePosition}
      className={cx(position === 'bottomLeft' && 'ld-menu-bottomLeft', position === 'bottomRight' && 'ld-menu-bottomRight', position === 'topLeft' && 'ld-menu-topLeft', position === 'topRight' && 'ld-menu-topRight')}
      content={
        <CSSTransition
          classNames={{
            enter: 'ld-menu-enter',
            enterActive: 'ld-menu-enterActive',
            exit: 'ld-menu-exit',
            exitActive: 'ld-menu-exitActive',
          }}
          in={isOpen}
          mountOnEnter
          nodeRef={menuContainerRef}
          timeout={100}
          unmountOnExit
        >
          <MenuLayoutContainer onClose={onClose} position={position}>
            <MenuContainer
              aria-labelledby={triggerId}
              id={menuId}
              className={cx(infoActive && 'ld-menu--with-detail')}
              onKeyDown={(event) => {
                const {key} = event;
                if (key === 'ArrowDown') {
                  event.preventDefault();
                  moveFocus(1);
                } else if (key === 'ArrowUp') {
                  event.preventDefault();
                  moveFocus(-1);
                } else if (key === 'Home') {
                  event.preventDefault();
                  focusFirst();
                } else if (key === 'End') {
                  event.preventDefault();
                  focusLast();
                } else if (key === 'ArrowLeft' && infoActive) {
                  event.preventDefault();
                  setInfoActive(null);
                } else if (key === 'Tab') {
                  // Close the menu and let Tab move focus onward naturally
                  // (do NOT preventDefault so the browser advances focus).
                  onClose(event);
                } else if (
                  key.length === 1 &&
                  key !== ' ' &&
                  !event.ctrlKey &&
                  !event.altKey &&
                  !event.metaKey
                ) {
                  // Type-ahead: jump to the next item starting with this char.
                  event.preventDefault();
                  focusItemByChar(key);
                }
              }}
              ref={menuContainerRef}
            >
              <MenuCloseCtx.Provider value={closeCtx}>
                <MenuInfoCtx.Provider value={infoCtx}>
                  <div className="ld-menu-pane">{children}</div>
                  {infoActive ? (
                    <div className="ld-menu-detail" role="region" aria-label="Details">
                      <div className="ld-menu-detail-title">{infoActive.title}</div>
                      <div className="ld-menu-detail-body">{infoActive.details}</div>
                    </div>
                  ) : null}
                </MenuInfoCtx.Provider>
              </MenuCloseCtx.Provider>
            </MenuContainer>
          </MenuLayoutContainer>
        </CSSTransition>
      }
      onKeyDown={(event) => {
        onKeyDown?.(event);

        if (isOpen && event.key === 'Escape') {
          onClose(event);
        }
      }}
      trigger={React.cloneElement(trigger, {
        'aria-controls': menuId,
        'aria-expanded': isOpen,
        'aria-haspopup': true,
        id: triggerId,
        onClick(event: React.MouseEvent<HTMLElement>) {
          if (isOpen) {
            onClose(event);
            return;
          }
          trigger.props.onClick?.(event);
          onOpen(event);
        },
        onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
          trigger.props.onKeyDown?.(event);

          const {key} = event;

          if (key === 'ArrowDown' || key === 'Enter' || key === ' ') {
            event.preventDefault();
            if (isOpen) {
              // Already open (e.g. opened by mouse) — move focus into the menu
              // now. The pendingFocus effect only fires on the closed→open
              // transition, so it can't help here.
              focusFirst();
            } else {
              pendingFocus.current = 'first';
              onOpen(event);
            }
          } else if (key === 'ArrowUp') {
            event.preventDefault();
            if (isOpen) {
              focusLast();
            } else {
              pendingFocus.current = 'last';
              onOpen(event);
            }
          }
        },
      })}
      triggerRef={triggerRef}
      {...rest}
    />
  );
};

Menu.displayName = 'Menu';
