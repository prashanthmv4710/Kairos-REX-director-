// @refresh reset

/**
 * @module Sidebar
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
 * For prop API + usage notes, read `Sidebar.md` in this folder
 * or run `npm run ld-kit -- show Sidebar`.
 */

/**
 * Sidebar — unified layout sidebar with two usage patterns:
 *
 * **Composable variant** (`SidebarProvider` + structural sub-components):
 *   A headless-ish primitive kit where consumers compose the layout from
 *   `SidebarHeader`, `SidebarContent`, `SidebarMenu`, etc.
 *
 * **Shell variant** (`SidebarShell`):
 *   A data-driven, self-contained sidebar that renders a complete nav from
 *   a `menuItems` array with hover-to-expand, lock, resize, and submenus.
 *
 * Both variants use `SideNavigationItem` from core for individual nav items
 * and share the same `ld/semantic/color/pageNav/*` design tokens from the
 * Living Design system.
 */
import * as React from 'react';

import {cx} from '../../common/cx';
import {Slot} from '../../components/Slot';
import {ChevronDownIcon, Icon} from '../../components/Icons';

import './Sidebar.css';

// ========================================================================
// Context & Provider (composable variant)
// ========================================================================

const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

type SidebarStateValue = 'expanded' | 'collapsed';

interface SidebarContextValue {
  state: SidebarStateValue;
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  toggleSidebar: () => void;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used inside <SidebarProvider>');
  return ctx;
}

export const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const [openMobile, setOpenMobile] = React.useState(false);
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const open = openProp ?? internalOpen;

    const setOpen = React.useCallback(
      (value: boolean) => {
        if (onOpenChange) onOpenChange(value);
        else setInternalOpen(value);
      },
      [onOpenChange],
    );

    const toggleSidebar = React.useCallback(() => {
      setOpenMobile((m) => !m);
      setOpen(!open);
    }, [open, setOpen]);

    React.useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (
          e.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (e.metaKey || e.ctrlKey)
        ) {
          e.preventDefault();
          toggleSidebar();
        }
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [toggleSidebar]);

    const value = React.useMemo<SidebarContextValue>(
      () => ({
        state: open ? 'expanded' : 'collapsed',
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [open, setOpen, openMobile, toggleSidebar],
    );

    return (
      <SidebarContext.Provider value={value}>
        <div
          ref={ref}
          className={cx('ld-sidebar-wrapper', className)}
          data-state={value.state}
          {...rest}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    );
  },
);
SidebarProvider.displayName = 'SidebarProvider';

// ========================================================================
// Sidebar root (composable variant)
// ========================================================================

export interface SidebarProps extends React.ComponentProps<'aside'> {
  side?: 'left' | 'right';
  variant?: 'sidebar' | 'floating' | 'inset';
  collapsible?: 'offcanvas' | 'icon' | 'none';
}

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  (
    {
      side = 'left',
      variant = 'sidebar',
      collapsible = 'offcanvas',
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const {state} = useSidebar();
    return (
      <aside
        ref={ref}
        aria-label="Sidebar navigation"
        data-state={state}
        data-side={side}
        data-variant={variant}
        data-collapsible={state === 'collapsed' ? collapsible : ''}
        className={cx(
          'ld-sidebar',
          `ld-sidebar--side-${side}`,
          `ld-sidebar--variant-${variant}`,
          className,
        )}
        {...rest}
      >
        <div className="ld-sidebar__inner">{children}</div>
      </aside>
    );
  },
);
Sidebar.displayName = 'Sidebar';

// ========================================================================
// Composable sub-components
// ========================================================================

const PanelLeftIcon = () => <Icon name="Menu" size="small" decorative />;

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({className, onClick, children, ...rest}, ref) => {
  const {toggleSidebar} = useSidebar();
  return (
    <button
      ref={ref}
      type="button"
      data-sidebar="trigger"
      aria-label="Toggle sidebar"
      className={cx('ld-sidebar__trigger', className)}
      onClick={(e) => {
        onClick?.(e);
        toggleSidebar();
      }}
      {...rest}
    >
      {children ?? <PanelLeftIcon />}
    </button>
  );
});
SidebarTrigger.displayName = 'SidebarTrigger';

export const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'>
>(({className, ...rest}, ref) => {
  const {toggleSidebar} = useSidebar();
  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle sidebar"
      className={cx('ld-sidebar__rail', className)}
      {...rest}
    />
  );
});
SidebarRail.displayName = 'SidebarRail';

export interface SidebarInsetProps extends React.ComponentProps<'main'> {
  /**
   * Override the rendered element. Use `"div"` when embedding in a page that
   * already has a `<main>` landmark so that there is never more than one main
   * per document.
   * @default "main"
   */
  as?: 'main' | 'div';
}

export const SidebarInset = React.forwardRef<HTMLElement, SidebarInsetProps>(
  ({as: Tag = 'main', className, ...rest}, ref) => (
    <Tag ref={ref as React.Ref<HTMLDivElement>} className={cx('ld-sidebar__inset', className)} {...(rest as any)} />
  ),
);
SidebarInset.displayName = 'SidebarInset';

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({className, ...rest}, ref) => (
  <div
    ref={ref}
    data-sidebar="header"
    className={cx('ld-sidebar__header', className)}
    {...rest}
  />
));
SidebarHeader.displayName = 'SidebarHeader';

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({className, ...rest}, ref) => (
  <div
    ref={ref}
    data-sidebar="footer"
    className={cx('ld-sidebar__footer', className)}
    {...rest}
  />
));
SidebarFooter.displayName = 'SidebarFooter';

export const SidebarSeparator = React.forwardRef<
  HTMLHRElement,
  React.ComponentProps<'hr'>
>(({className, ...rest}, ref) => (
  <hr
    ref={ref}
    data-sidebar="separator"
    className={cx('ld-sidebar__separator', className)}
    {...rest}
  />
));
SidebarSeparator.displayName = 'SidebarSeparator';

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({className, ...rest}, ref) => (
  <div
    ref={ref}
    data-sidebar="content"
    className={cx('ld-sidebar__content', className)}
    {...rest}
  />
));
SidebarContent.displayName = 'SidebarContent';

export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({className, ...rest}, ref) => (
  <div
    ref={ref}
    data-sidebar="group"
    className={cx('ld-sidebar__group', className)}
    {...rest}
  />
));
SidebarGroup.displayName = 'SidebarGroup';

export const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {asChild?: boolean}
>(({className, asChild = false, ...rest}, ref) => {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref as React.Ref<HTMLDivElement>}
      data-sidebar="group-label"
      className={cx('ld-sidebar__group-label', className)}
      {...rest}
    />
  );
});
SidebarGroupLabel.displayName = 'SidebarGroupLabel';

export const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({className, ...rest}, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cx('ld-sidebar__group-content', className)}
    {...rest}
  />
));
SidebarGroupContent.displayName = 'SidebarGroupContent';

export const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({className, ...rest}, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cx('ld-sidebar__menu', className)}
    {...rest}
  />
));
SidebarMenu.displayName = 'SidebarMenu';

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({className, ...rest}, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cx('ld-sidebar__menu-item', className)}
    {...rest}
  />
));
SidebarMenuItem.displayName = 'SidebarMenuItem';

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & {
    asChild?: boolean;
    isActive?: boolean;
    size?: 'sm' | 'default' | 'lg';
    variant?: 'default' | 'outline';
  }
>(
  (
    {
      asChild = false,
      isActive = false,
      size = 'default',
      variant = 'default',
      className,
      ...rest
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref as React.Ref<HTMLButtonElement>}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cx(
          'ld-sidebar__menu-button',
          `ld-sidebar__menu-button--size-${size}`,
          `ld-sidebar__menu-button--variant-${variant}`,
          isActive && 'ld-sidebar__menu-button--active',
          className,
        )}
        {...rest}
      />
    );
  },
);
SidebarMenuButton.displayName = 'SidebarMenuButton';

export const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({className, ...rest}, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cx('ld-sidebar__menu-sub', className)}
    {...rest}
  />
));
SidebarMenuSub.displayName = 'SidebarMenuSub';

export const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>((props, ref) => <li ref={ref} {...props} />);
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem';

export const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<'a'> & {
    asChild?: boolean;
    size?: 'sm' | 'md';
    isActive?: boolean;
  }
>(({asChild = false, size = 'md', isActive, className, ...rest}, ref) => {
  const Comp = asChild ? Slot : 'a';
  return (
    <Comp
      ref={ref as React.Ref<HTMLAnchorElement>}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cx(
        'ld-sidebar__menu-sub-button',
        `ld-sidebar__menu-sub-button--size-${size}`,
        isActive && 'ld-sidebar__menu-sub-button--active',
        className,
      )}
      {...rest}
    />
  );
});
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton';

// ========================================================================
// Shell variant (data-driven all-in-one)
// ========================================================================

export interface SidebarShellSubmenuItem {
  id: string;
  label: string;
  route?: string;
}

export interface SidebarShellMenuItem {
  id: string;
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  route?: string;
  submenuItems?: SidebarShellSubmenuItem[];
}

export interface SidebarShellProps {
  activeMenuItem?: string;
  onMenuItemClick?: (itemId: string, route?: string) => void;
  menuItems: SidebarShellMenuItem[];
  defaultLocked?: boolean;
  expanded?: boolean;
  /** Accessible label for the sidebar landmark. Use a unique value when multiple SidebarShell instances appear on the same page. */
  'aria-label'?: string;
}

const ArrowLeftIcon = () => <Icon name="ArrowLeft" size="small" decorative />;

const ArrowRightIcon = () => <Icon name="ArrowRight" size="small" decorative />;

const SubDot = ({active}: {active: boolean}) => (
  <svg width="6" height="6" viewBox="0 0 6 6" style={{flexShrink: 0}}>
    {active ? (
      <circle cx="3" cy="3" r="3" fill="var(--ld-semantic-color-action-fill-primary, #0053e2)" />
    ) : (
      <circle
        cx="3"
        cy="3"
        r="2.5"
        stroke="var(--ld-semantic-color-text, #2e2f32)"
        fill="none"
      />
    )}
  </svg>
);

export const SidebarShell: React.FC<SidebarShellProps> = ({
  activeMenuItem: controlledActive,
  onMenuItemClick,
  menuItems,
  defaultLocked = false,
  expanded: expandedProp,
  'aria-label': ariaLabel = 'Application navigation',
}) => {
  const [internalActive, setInternalActive] = React.useState<string>(
    menuItems[0]?.id ?? '',
  );
  const activeMenuItem = controlledActive ?? internalActive;

  const [sidebarLocked, setSidebarLocked] = React.useState(defaultLocked);
  const [sidebarHovered, setSidebarHovered] = React.useState(false);
  const [sidebarWidth, setSidebarWidth] = React.useState(220);
  const [isResizing, setIsResizing] = React.useState(false);
  const resizeStartX = React.useRef(0);
  const resizeStartWidth = React.useRef(0);
  const [expandedSubmenus, setExpandedSubmenus] = React.useState<
    Record<string, boolean>
  >(() => {
    const initial: Record<string, boolean> = {};
    menuItems.forEach((item) => {
      if (item.submenuItems && item.submenuItems.length > 0)
        initial[item.id] = true;
    });
    return initial;
  });

  const iconOnly = expandedProp === false;
  const sidebarExpanded = iconOnly ? false : sidebarLocked || sidebarHovered;

  React.useEffect(() => {
    if (!isResizing) return;
    const onMove = (e: MouseEvent) => {
      const delta = e.clientX - resizeStartX.current;
      const next = Math.max(64, Math.min(400, resizeStartWidth.current + delta));
      setSidebarWidth(next);
    };
    const onUp = () => setIsResizing(false);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [isResizing]);

  const handleToggle = () => {
    if (sidebarLocked) {
      setSidebarLocked(false);
    } else {
      setSidebarLocked(true);
      if (sidebarWidth < 220) setSidebarWidth(220);
    }
  };

  const handleItemClick = (item: SidebarShellMenuItem) => {
    const hasSubmenu = item.submenuItems && item.submenuItems.length > 0;
    if (hasSubmenu) {
      if (!sidebarExpanded) {
        onMenuItemClick?.(item.id, item.route);
        setInternalActive(item.id);
        return;
      }
      setExpandedSubmenus((prev) => ({...prev, [item.id]: !prev[item.id]}));
    } else {
      onMenuItemClick?.(item.id, item.route);
      setInternalActive(item.id);
    }
  };

  const handleSubItemClick = (sub: SidebarShellSubmenuItem) => {
    onMenuItemClick?.(sub.id, sub.route);
    setInternalActive(sub.id);
  };

  return (
    <aside
      aria-label={ariaLabel}
      className="ld-sidebar-shell"
      style={{
        width: sidebarExpanded ? `${sidebarWidth}px` : '64px',
        transition: isResizing ? 'none' : 'width 300ms ease-in-out',
      }}
      onMouseEnter={() => !iconOnly && setSidebarHovered(true)}
      onMouseLeave={() => !iconOnly && setSidebarHovered(false)}
    >
      <div className="ld-sidebar-shell__items">
        {menuItems.map((item) => {
          const isActive =
            activeMenuItem === item.id ||
            (item.submenuItems?.some((s) => activeMenuItem === s.id) ?? false);
          const hasSubmenu =
            item.submenuItems && item.submenuItems.length > 0;
          const isExpanded = expandedSubmenus[item.id] ?? false;
          const Icon = item.Icon;

          return (
            <div key={item.id}>
              <button
                type="button"
                className={cx(
                  'ld-sidebar-shell__item',
                  sidebarExpanded
                    ? 'ld-sidebar-shell__item--expanded'
                    : 'ld-sidebar-shell__item--collapsed',
                  isActive && sidebarExpanded && 'ld-sidebar-shell__item--active',
                )}
                onClick={() => handleItemClick(item)}
                aria-label={item.label}
                title={!sidebarExpanded ? item.label : undefined}
              >
                <span className="ld-sidebar-shell__item-content">
                  <Icon
                    className={cx(
                      'ld-sidebar-shell__item-icon',
                      isActive && 'ld-sidebar-shell__item-icon--active',
                    )}
                    width={16}
                    height={16}
                  />
                  {sidebarExpanded ? (
                    <span
                      className={cx(
                        'ld-sidebar-shell__item-label',
                        isActive && 'ld-sidebar-shell__item-label--active',
                      )}
                    >
                      {item.label}
                    </span>
                  ) : null}
                </span>
                {sidebarExpanded && hasSubmenu ? (
                  <span
                    className={cx(
                      'ld-sidebar-shell__chevron',
                      isExpanded && 'ld-sidebar-shell__chevron--rotated',
                    )}
                  >
                    <ChevronDownIcon />
                  </span>
                ) : null}
              </button>

              {hasSubmenu && isExpanded && sidebarExpanded ? (
                <div className="ld-sidebar-shell__submenu">
                  {item.submenuItems!.map((sub) => {
                    const isSubActive = activeMenuItem === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        className="ld-sidebar-shell__sub-item"
                        onClick={() => handleSubItemClick(sub)}
                        aria-label={sub.label}
                      >
                        <SubDot active={isSubActive} />
                        <span
                          className={cx(
                            'ld-sidebar-shell__sub-label',
                            isSubActive &&
                              'ld-sidebar-shell__sub-label--active',
                          )}
                        >
                          {sub.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {hasSubmenu && !sidebarExpanded ? (
                <div className="ld-sidebar-shell__submenu-collapsed">
                  {item.submenuItems!.map((sub) => {
                    const isSubActive = activeMenuItem === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        className="ld-sidebar-shell__sub-item-collapsed"
                        onClick={() => handleSubItemClick(sub)}
                        aria-label={sub.label}
                        title={sub.label}
                      >
                        <SubDot active={isSubActive} />
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div>
        <button
          type="button"
          className={cx(
            'ld-sidebar-shell__toggle',
            sidebarExpanded
              ? 'ld-sidebar-shell__toggle--expanded'
              : 'ld-sidebar-shell__toggle--collapsed',
          )}
          onClick={handleToggle}
          aria-label={sidebarLocked ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-expanded={sidebarLocked}
        >
          {sidebarExpanded ? (
            <>
              <ArrowLeftIcon />
              <span className="ld-sidebar-shell__toggle-label">Lock</span>
            </>
          ) : (
            <ArrowRightIcon />
          )}
        </button>
      </div>

      {sidebarExpanded ? (
        <div
          className="ld-sidebar-shell__resize-handle"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
            resizeStartX.current = e.clientX;
            resizeStartWidth.current = sidebarWidth;
          }}
        />
      ) : null}
    </aside>
  );
};

SidebarShell.displayName = 'SidebarShell';
