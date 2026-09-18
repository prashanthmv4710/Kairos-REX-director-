'use client';
// @refresh reset

/**
 * @module AgentChatSidebar
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
 * For prop API + usage notes, read `AgentChatSidebar.md` in this folder
 * or run `npm run ld-kit -- show AgentChatSidebar`.
 */

/**
 * AgentChatSidebar (formerly "[AK] Sidebar") — the left rail for agent chat /
 * framework experiences.
 *
 * A compound sidebar built for agent-driven experiences. It extends the core
 * {@link SideNavigationItem} styling (the same `pageNav` design tokens) with
 * features the core Side Navigation doesn't have:
 *
 * For generic app navigation, use {@link SideNavigation} instead — this
 * component is specifically for agent chat / framework experiences (collapsible
 * rail, editable app name, agent sections, segment control, footer).
 *
 *  - **Collapse to an icon-only rail** (300px ↔ 57px) via context.
 *  - **Editable app-name header** (click the title to rename).
 *  - **Primary button items** (icon + bold label, optional Tag) that collapse to icons.
 *  - **Sections** of text-label items with an overflow "…" menu and inline rename.
 *  - **Segment control** that shows the full control when there's room, drops to
 *    icon-only when the rail is narrow, and shows just the active segment when collapsed.
 *  - **Footer** with four interchangeable types (avatar-button, menu-expand,
 *    icon-button, accordion).
 *
 * Usage mirrors the composable {@link Sidebar} pattern — wrap the tree in
 * {@link AgentChatSidebarProvider} and read collapse state with {@link useAgentChatSidebar}.
 */
import * as React from 'react';

import {cx} from '../../common/cx';
import {Avatar, type AvatarProps} from '../../components/Avatar';
import {Divider} from '../../components/Divider';
import {IconButton} from '../../components/IconButton';
import {
  ChevronDownIcon,
  CloseIcon,
  Icon,
  MoreIcon,
  SearchIcon,
} from '../../components/Icons';
import {
  Menu,
  MenuItem,
  MenuSectionTitleAccordion,
  type MenuPosition,
} from '../../components/Menu/Menu';
import {
  SegmentedControl,
  type SegmentedControlItem,
} from '../../components/SegmentedControl/SegmentedControl';
import {SearchBar} from '../../components/SearchBar/SearchBar';
import {Tooltip} from '../../components/Tooltip';
import {VisuallyHidden} from '../../components/VisuallyHidden';

import './AgentChatSidebar.css';

// ========================================================================
// Context & Provider
// ========================================================================

interface AgentChatSidebarContextValue {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  toggle: () => void;
  /** True when an <AgentChatSidebarLockToggle> is mounted inside this provider. */
  hasLockToggle: boolean;
  /** Called by AgentChatSidebarLockToggle to register/unregister itself. */
  registerLockToggle: (mounted: boolean) => void;
}

const AgentChatSidebarContext = React.createContext<AgentChatSidebarContextValue | null>(
  null,
);

/** Read the current collapse state. Throws outside {@link AgentChatSidebarProvider}. */
export function useAgentChatSidebar(): AgentChatSidebarContextValue {
  const ctx = React.useContext(AgentChatSidebarContext);
  if (!ctx)
    throw new Error('useAgentChatSidebar must be used inside <AgentChatSidebarProvider>');
  return ctx;
}

export interface AgentChatSidebarProviderProps {
  children?: React.ReactNode;
  /** Controlled collapsed state. */
  collapsed?: boolean;
  /** Initial collapsed state when uncontrolled. @default false */
  defaultCollapsed?: boolean;
  /** Called when the collapsed state changes (controlled or uncontrolled). */
  onCollapsedChange?: (collapsed: boolean) => void;
}

/**
 * Holds the collapse state for an {@link AgentChatSidebar} subtree. Supports both
 * controlled (`collapsed` + `onCollapsedChange`) and uncontrolled
 * (`defaultCollapsed`) usage.
 */
export const AgentChatSidebarProvider: React.FC<AgentChatSidebarProviderProps> = ({
  children,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
}) => {
  const [internalCollapsed, setInternalCollapsed] =
    React.useState(defaultCollapsed);
  const collapsed = collapsedProp ?? internalCollapsed;
  const [hasLockToggle, setHasLockToggle] = React.useState(false);

  const setCollapsed = React.useCallback(
    (value: boolean) => {
      if (onCollapsedChange) onCollapsedChange(value);
      if (collapsedProp === undefined) setInternalCollapsed(value);
    },
    [onCollapsedChange, collapsedProp],
  );

  const toggle = React.useCallback(
    () => setCollapsed(!collapsed),
    [collapsed, setCollapsed],
  );

  const registerLockToggle = React.useCallback((mounted: boolean) => {
    setHasLockToggle(mounted);
  }, []);

  const value = React.useMemo<AgentChatSidebarContextValue>(
    () => ({collapsed, setCollapsed, toggle, hasLockToggle, registerLockToggle}),
    [collapsed, setCollapsed, toggle, hasLockToggle, registerLockToggle],
  );

  return (
    <AgentChatSidebarContext.Provider value={value}>
      {children}
    </AgentChatSidebarContext.Provider>
  );
};

AgentChatSidebarProvider.displayName = 'AgentChatSidebarProvider';

// ========================================================================
// Root
// ========================================================================

export interface AgentChatSidebarProps
  extends Omit<React.ComponentPropsWithoutRef<'aside'>, 'className' | 'style'> {
  children?: React.ReactNode;
  /** Escape hatch — applied to the root `<aside>`. */
  UNSAFE_className?: string;
  /** Escape hatch — applied to the root `<aside>`. */
  UNSAFE_style?: React.CSSProperties;
  /** Accessible label for the navigation landmark. @default "Sidebar" */
  'aria-label'?: string;
  /**
   * Allow the user to drag the right edge to resize the expanded sidebar.
   * Has no effect while collapsed. @default false
   */
  resizable?: boolean;
  /** Initial expanded width in px (used when `resizable`). @default 300 */
  defaultWidth?: number;
  /** Minimum expanded width in px. @default 240 */
  minWidth?: number;
  /** Maximum expanded width in px. @default 420 */
  maxWidth?: number;
  /** Called with the new width (px) while resizing. */
  onWidthChange?: (width: number) => void;
}

/** Keyboard step (px) for resizing the sidebar with arrow keys. */
const RESIZE_STEP = 16;

/**
 * The sidebar shell. Reads collapse state from context and exposes it as a
 * `data-state` attribute so its children's CSS can react to it. When
 * `resizable` is set, an expanded sidebar can be widened / narrowed by
 * dragging (or arrow-keying) the handle on its right edge.
 */
export const AgentChatSidebar = React.forwardRef<HTMLElement, AgentChatSidebarProps>(
  (
    {
      children,
      UNSAFE_className,
      UNSAFE_style,
      'aria-label': ariaLabel,
      resizable = false,
      defaultWidth = 300,
      minWidth = 240,
      maxWidth = 420,
      onWidthChange,
      ...rest
    },
    ref,
  ) => {
    const {collapsed} = useAgentChatSidebar();
    const [width, setWidth] = React.useState(defaultWidth);
    const [resizing, setResizing] = React.useState(false);
    const startX = React.useRef(0);
    const startWidth = React.useRef(0);

    const clamp = React.useCallback(
      (w: number) => Math.max(minWidth, Math.min(maxWidth, w)),
      [minWidth, maxWidth],
    );

    const applyWidth = React.useCallback(
      (w: number) => {
        const next = clamp(w);
        setWidth(next);
        onWidthChange?.(next);
      },
      [clamp, onWidthChange],
    );

    React.useEffect(() => {
      if (!resizing) return;
      const onMove = (e: MouseEvent) =>
        applyWidth(startWidth.current + (e.clientX - startX.current));
      const onUp = () => setResizing(false);
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      const prevUserSelect = document.body.style.userSelect;
      document.body.style.userSelect = 'none';
      return () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.body.style.userSelect = prevUserSelect;
      };
    }, [resizing, applyWidth]);

    const showHandle = resizable && !collapsed;

    // Inline width only applies while expanded; when collapsed the CSS
    // `data-state` rule drives the icon-rail width instead.
    const style: React.CSSProperties = {
      ...(showHandle ? {width, transition: resizing ? 'none' : undefined} : {}),
      ...UNSAFE_style,
    };

    return (
      <aside
        ref={ref}
        data-state={collapsed ? 'collapsed' : 'expanded'}
        aria-label={ariaLabel ?? 'Sidebar'}
        className={cx(
          'ld-agentchatsidebar',
          resizing && 'ld-agentchatsidebar--resizing',
          UNSAFE_className,
        )}
        style={style}
        {...rest}
      >
        <div className="ld-agentchatsidebar__inner">{children}</div>
        {showHandle ? (
          <div
            className="ld-agentchatsidebar__resize-handle"
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize sidebar"
            aria-valuenow={Math.round(width)}
            aria-valuemin={minWidth}
            aria-valuemax={maxWidth}
            tabIndex={0}
            onMouseDown={(e) => {
              e.preventDefault();
              startX.current = e.clientX;
              startWidth.current = width;
              setResizing(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') {
                e.preventDefault();
                applyWidth(width - RESIZE_STEP);
              } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                applyWidth(width + RESIZE_STEP);
              } else if (e.key === 'Home') {
                e.preventDefault();
                applyWidth(minWidth);
              } else if (e.key === 'End') {
                e.preventDefault();
                applyWidth(maxWidth);
              }
            }}
          />
        ) : null}
      </aside>
    );
  },
);

AgentChatSidebar.displayName = 'AgentChatSidebar';

// ========================================================================
// Trigger (collapse / expand)
// ========================================================================

export interface AgentChatSidebarTriggerProps {
  /** Accessible label override. @default "Collapse sidebar" / "Expand sidebar" */
  a11yLabel?: string;
}

/** A toggle button that collapses / expands the sidebar. */
export const AgentChatSidebarTrigger: React.FC<AgentChatSidebarTriggerProps> = ({
  a11yLabel,
}) => {
  const {collapsed, toggle} = useAgentChatSidebar();
  const label = a11yLabel ?? (collapsed ? 'Expand sidebar' : 'Collapse sidebar');
  return (
    <Tooltip content={label} relationship="label" position="after">
      <IconButton
        a11yLabel={label}
        color="tertiary"
        size="small"
        onClick={toggle}
      >
        <Icon name="SideMenu" decorative />
      </IconButton>
    </Tooltip>
  );
};

AgentChatSidebarTrigger.displayName = 'AgentChatSidebarTrigger';

// ========================================================================
// Lock / expand toggle
// ========================================================================

export interface AgentChatSidebarLockToggleProps {
  /** Label shown beside the arrow when expanded. @default "Lock" */
  label?: string;
}

/**
 * The canonical collapse affordance for the rail — the "lock and expand"
 * experience. Collapsed, it's a centered arrow ("→") that expands the sidebar;
 * expanded, it's a full-width "← Lock" row that collapses (locks) it again.
 *
 * Pin this near the bottom of the rail so the experience is identical wherever
 * the {@link AgentChatSidebar} is used (Focus Chat, the surface, etc.).
 */
export const AgentChatSidebarLockToggle: React.FC<AgentChatSidebarLockToggleProps> = ({
  label = 'Lock',
}) => {
  const {collapsed, toggle, registerLockToggle} = useAgentChatSidebar();
  const a11yLabel = collapsed ? 'Expand sidebar' : 'Lock sidebar';

  // Register this instance so the header can detect its presence and disable
  // the logo-hover toggle when both controls would otherwise coexist.
  React.useEffect(() => {
    registerLockToggle(true);
    return () => registerLockToggle(false);
  }, [registerLockToggle]);

  const button = (
    <button
      type="button"
      className={cx(
        'ld-agentchatsidebar__lock-toggle',
        collapsed
          ? 'ld-agentchatsidebar__lock-toggle--collapsed'
          : 'ld-agentchatsidebar__lock-toggle--expanded',
      )}
      onClick={toggle}
      aria-label={a11yLabel}
      aria-expanded={!collapsed}
    >
      {collapsed ? (
        <Icon name="ArrowRight" size="small" decorative />
      ) : (
        <>
          <Icon name="ArrowLeft" size="small" decorative />
          <span className="ld-agentchatsidebar__lock-label">{label}</span>
        </>
      )}
    </button>
  );

  return (
    <div className="ld-agentchatsidebar__lock">
      {collapsed ? (
        <Tooltip content={a11yLabel} relationship="label" position="after">
          {button}
        </Tooltip>
      ) : (
        button
      )}
    </div>
  );
};

AgentChatSidebarLockToggle.displayName = 'AgentChatSidebarLockToggle';

// ========================================================================
// EditableLabel (internal helper)
// ========================================================================

interface EditableLabelProps {
  value: string;
  onCommit: (next: string) => void;
  /** Controlled editing state — lets a caller (e.g. an overflow menu's
   *  "Rename" action) enter edit mode without relying on the double-click
   *  gesture, which isn't reachable for every input method. */
  editing: boolean;
  onEditingChange: (editing: boolean) => void;
  /** Fired on a single click — the label's normal (non-rename) action, e.g.
   *  selecting the chat. Double-clicking starts a rename instead. */
  onActivate?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Class for the resting (non-editing) text element. */
  className?: string;
  /** Class for the `<input>` shown while editing. */
  inputClassName?: string;
  /** Accessible label for the edit input. */
  a11yLabel?: string;
  /** Extra content appended to the resting label's accessible name only
   *  (e.g. a visually-hidden "Pinned chat" flag) — not shown while editing. */
  a11ySuffix?: React.ReactNode;
}

/**
 * A label that swaps to an `<input>` when activated. Enter / blur commits the
 * draft, Escape cancels. Shared by the header title and editable text items.
 * Renaming is double-click only — a single click fires `onActivate` (the
 * item's normal click action) instead, so the two gestures don't collide.
 */
function EditableLabel({
  value,
  onCommit,
  editing,
  onEditingChange,
  onActivate,
  className,
  inputClassName,
  a11yLabel,
  a11ySuffix,
}: EditableLabelProps) {
  const [draft, setDraft] = React.useState(value);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const labelRef = React.useRef<HTMLButtonElement>(null);
  // Enter/Escape commit or cancel while the input still has focus, so the
  // instant it unmounts, focus falls back to <body> — unlike Tab, which
  // already moves focus to whatever's next before the input goes away. Flag
  // those two cases so the effect below can hand focus back to the resting
  // label button once it remounts; a natural blur (Tab, click elsewhere)
  // leaves this unset and focus goes wherever the user sent it.
  const restoreFocusRef = React.useRef(false);

  React.useEffect(() => {
    if (editing) {
      setDraft(value);
      inputRef.current?.focus();
      inputRef.current?.select();
    } else if (restoreFocusRef.current) {
      restoreFocusRef.current = false;
      labelRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  const commit = () => {
    onEditingChange(false);
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) onCommit(trimmed);
  };

  const cancel = () => {
    onEditingChange(false);
    setDraft(value);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        className={cx('ld-agentchatsidebar__edit-input', inputClassName)}
        value={draft}
        aria-label={a11yLabel ?? 'Edit name'}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            restoreFocusRef.current = true;
            commit();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            restoreFocusRef.current = true;
            cancel();
          }
        }}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  return (
    <button
      ref={labelRef}
      type="button"
      className={cx('ld-agentchatsidebar__edit-text', className)}
      onClick={(e) => {
        e.stopPropagation();
        onActivate?.(e);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onEditingChange(true);
      }}
      title="Double-click to rename"
    >
      {value}
      {a11ySuffix}
    </button>
  );
}

// ========================================================================
// Header
// ========================================================================

export interface AgentChatSidebarHeaderProps {
  /** Brand mark / logo shown at the start of the header (always visible). */
  logo?: React.ReactNode;
  /** The app / workspace name. */
  title: string;
  /**
   * A secondary caption shown beneath the title — the "two lines" header
   * variant. Mutually exclusive with `tag` in the Figma library.
   */
  subtitle?: string;
  /** A Tag rendered inline after the title — the "one line, tag" variant. */
  tag?: React.ReactNode;
  /**
   * Render a trailing search button. Clicking it reveals an inline search field
   * that expands from the right edge leftward over the title. Called once when
   * the field is opened.
   */
  onSearch?: () => void;
  /** Called on every keystroke in the inline search field. */
  onSearchChange?: (value: string) => void;
  /** Called when the inline search is submitted (Enter). */
  onSearchSubmit?: (value: string) => void;
  /** Placeholder for the inline search field. @default "Search" */
  searchPlaceholder?: string;
  /**
   * When `true` and no {@link AgentChatSidebarLockToggle} is mounted in the same
   * provider, hovering the logo slot crossfades the logo to a panel toggle icon
   * so the user can expand/collapse the sidebar from the header.
   * @default false
   */
  logoAsToggle?: boolean;
  /** Override the tooltip copy. */
  logoTooltipLabels?: {expand?: string; collapse?: string};
}

// ========================================================================
// LogoToggle (internal)
// ========================================================================

/**
 * The logo slot rendered as a hover-activated expand/collapse button. The
 * provided logo node (avatar, wordmark, etc.) is layered beneath a panel icon
 * that fades in on hover / focus. The action label is surfaced via Tooltip.
 */
function LogoToggle({
  logo,
  expandLabel = 'Toggle sidebar',
  collapseLabel = 'Toggle sidebar',
}: {
  logo: React.ReactNode;
  expandLabel?: string;
  collapseLabel?: string;
}) {
  const {collapsed, toggle} = useAgentChatSidebar();
  // aria-expanded already communicates open/closed state, so the accessible
  // name itself stays state-agnostic ("Toggle sidebar") rather than flipping
  // between "Expand"/"Collapse" — the two together would otherwise talk past
  // each other. Tooltip (relationship="label") supplies the accessible name
  // via aria-labelledby, which wins over a plain aria-label, so the button
  // doesn't set one itself.
  const label = collapsed ? expandLabel : collapseLabel;
  return (
    <Tooltip content={label} relationship="label" position="after">
      <button
        type="button"
        className="ld-agentchatsidebar__logo-toggle"
        onClick={toggle}
        aria-expanded={!collapsed}
      >
        {/* The provided logo fades out on hover/focus; the panel icon fades in. */}
        <span className="ld-agentchatsidebar__logo-toggle-logo" aria-hidden="true">
          {logo}
        </span>
        <span className="ld-agentchatsidebar__logo-toggle-icon" aria-hidden="true">
          <Icon name={collapsed ? 'PanelLeftFill' : 'PanelLeft'} decorative />
        </span>
      </button>
    </Tooltip>
  );
}

/**
 * The sidebar header — logo + app name + an optional search button. The name
 * supports the Figma header variants: one line, one line + Tag, or two lines
 * (title over a caption). The title can also be made editable. Collapses to
 * just the logo.
 */
export const AgentChatSidebarHeader: React.FC<AgentChatSidebarHeaderProps> = ({
  logo,
  title,
  subtitle,
  tag,
  onSearch,
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = 'Search',
  logoAsToggle = false,
  logoTooltipLabels,
}) => {
  const {collapsed, hasLockToggle} = useAgentChatSidebar();
  // The logo acts as a toggle only when explicitly enabled and no lock control
  // is present (they serve the same purpose; only one should exist at a time).
  const effectiveLogoAsToggle = logoAsToggle && !hasLockToggle;
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const searchWrapRef = React.useRef<HTMLDivElement>(null);
  const searchTriggerRef = React.useRef<HTMLButtonElement>(null);
  // Set when the search is dismissed via its own controls (Close button /
  // Escape) so focus returns to the trigger once it re-renders, instead of being
  // stranded on <body> when the search field unmounts.
  const restoreTriggerFocus = React.useRef(false);

  // Focus the field as it opens; collapsing the rail dismisses an open search.
  React.useEffect(() => {
    if (searchOpen) {
      searchWrapRef.current?.querySelector('input')?.focus();
    } else if (restoreTriggerFocus.current) {
      restoreTriggerFocus.current = false;
      requestAnimationFrame(() => searchTriggerRef.current?.focus());
    }
  }, [searchOpen]);
  React.useEffect(() => {
    if (collapsed) setSearchOpen(false);
  }, [collapsed]);

  const closeSearch = () => {
    // Dismissed by the user — send focus back to the search trigger.
    restoreTriggerFocus.current = true;
    setSearchOpen(false);
    setQuery('');
    onSearchChange?.('');
  };

  // When search is open, the logo + app name collapse so the SearchBar can take
  // the full header width.
  const searchActive = searchOpen && !collapsed;

  // Shared logo/title content builders.
  const titleBlock = (
    <div className="ld-agentchatsidebar__titlewrap">
      <div className="ld-agentchatsidebar__titlerow">
        <h2 style={{margin: 0, minWidth: 0}}>
          <span className="ld-agentchatsidebar__title">{title}</span>
        </h2>
        {tag ? <span className="ld-agentchatsidebar__title-tag">{tag}</span> : null}
      </div>
      {subtitle ? (
        <span className="ld-agentchatsidebar__subtitle">{subtitle}</span>
      ) : null}
    </div>
  );

  const logoToggleNode = logo ? (
    <LogoToggle
      logo={logo}
      expandLabel={logoTooltipLabels?.expand}
      collapseLabel={logoTooltipLabels?.collapse}
    />
  ) : null;

  const staticLogoNode = logo ? (
    <span
      className="ld-agentchatsidebar__logo"
      role="img"
      aria-label={typeof title === 'string' ? `${title} logo` : 'Logo'}
    >
      {logo}
    </span>
  ) : null;

  // When collapsed, only the logo (or toggle) appears — centered via CSS.
  if (collapsed) {
    return (
      <div className="ld-agentchatsidebar__header">
        {logo ? (
          effectiveLogoAsToggle ? logoToggleNode : staticLogoNode
        ) : null}
      </div>
    );
  }

  // Search overlay — logo/title collapse so the bar fills the full width.
  if (searchActive) {
    return (
      <div className="ld-agentchatsidebar__header">
        <div ref={searchWrapRef} className="ld-agentchatsidebar__searchOpen">
          <SearchBar
            variant="inline"
            size="small"
            value={query}
            placeholder={searchPlaceholder}
            UNSAFE_className="ld-agentchatsidebar__searchbar"
            onChange={(next) => {
              setQuery(next);
              onSearchChange?.(next);
            }}
            onClear={() => onSearchChange?.('')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSearchSubmit?.(query);
              } else if (e.key === 'Escape') {
                e.preventDefault();
                closeSearch();
              }
            }}
          />
          <Tooltip content="Close search" relationship="label" position="below">
            <IconButton
              a11yLabel="Close search"
              color="tertiary"
              size="small"
              onClick={closeSearch}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    );
  }

  // Expanded state — logo (or toggle) always sits LEFT of the title.
  //   logoAsToggle:  [avatar toggle LEFT] [title (flex:1)] [search?]
  //   default:       [static logo LEFT]   [title (flex:1)] [search?]
  return (
    <div className="ld-agentchatsidebar__header">
      {logo ? (
        effectiveLogoAsToggle ? logoToggleNode : staticLogoNode
      ) : null}
      {titleBlock}
      {onSearch ? (
        <div className="ld-agentchatsidebar__search">
          <Tooltip content="Search" relationship="label" position="below">
            <IconButton
              ref={searchTriggerRef}
              a11yLabel="Search"
              color="tertiary"
              size="small"
              onClick={() => {
                setSearchOpen(true);
                onSearch?.();
              }}
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>
        </div>
      ) : null}
    </div>
  );
};

AgentChatSidebarHeader.displayName = 'AgentChatSidebarHeader';

// ========================================================================
// Content & Separator
// ========================================================================

export interface AgentChatSidebarContentProps {
  children?: React.ReactNode;
  /**
   * Accessible name for this navigation landmark. Only needs to change from
   * the default when more than one `AgentChatSidebar` renders on the same
   * page (e.g. side-by-side demos) — landmarks with the same role + name
   * aren't distinguishable to screen-reader users.
   * @default "Workspace"
   */
  'aria-label'?: string;
}

/** The scrollable body between the header and footer. */
export const AgentChatSidebarContent: React.FC<AgentChatSidebarContentProps> = ({
  children,
  'aria-label': ariaLabel = 'Workspace',
}) => (
  <nav className="ld-agentchatsidebar__content" aria-label={ariaLabel}>
    {children}
  </nav>
);

AgentChatSidebarContent.displayName = 'AgentChatSidebarContent';

/** A thin separator line. */
export const AgentChatSidebarSeparator: React.FC = () => (
  <div className="ld-agentchatsidebar__separator">
    <Divider />
  </div>
);

AgentChatSidebarSeparator.displayName = 'AgentChatSidebarSeparator';

// ========================================================================
// Primary button item
// ========================================================================

export interface AgentChatSidebarItemProps {
  children: string;
  /** Leading icon (always shown — it's the collapsed representation). */
  leading: React.ReactNode;
  /** Renders the item as a link. */
  href?: string;
  /** Marks the current page / active item. */
  isCurrent?: boolean;
  /** An optional trailing Tag, shown only when expanded. */
  tag?: React.ReactNode;
  /** Optional trailing content (e.g. an edit / overflow control), expanded only. */
  trailing?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  target?: string;
}

/**
 * A primary navigation item — leading icon + bold label, with an optional Tag
 * or trailing control. Collapses to an icon-only button (the label moves to the
 * accessible name + tooltip).
 */
export const AgentChatSidebarItem = React.forwardRef<
  HTMLElement,
  AgentChatSidebarItemProps
>(({children, leading, href, isCurrent, tag, trailing, onClick, target}, ref) => {
  const {collapsed} = useAgentChatSidebar();

  const rowClassName = cx(
    'ld-agentchatsidebar__item',
    isCurrent && 'ld-agentchatsidebar__item--current',
  );

  const content = (
    <>
      <span className="ld-agentchatsidebar__item-icon" aria-hidden="true">
        {leading}
      </span>
      {!collapsed ? (
        <>
          <span className="ld-agentchatsidebar__item-label">{children}</span>
          {tag ? <span className="ld-agentchatsidebar__item-tag">{tag}</span> : null}
        </>
      ) : null}
    </>
  );

  const common = {
    className: 'ld-agentchatsidebar__item-control',
    onClick,
    ...(isCurrent ? {'aria-current': 'page' as const} : {}),
    ...(collapsed ? {'aria-label': children} : {}),
  };

  const wrapCollapsedItemTooltip = <T extends React.ReactElement>(element: T): React.ReactElement =>
    collapsed ? (
      <Tooltip content={children} relationship="label" position="after">
        {element}
      </Tooltip>
    ) : (
      element
    );

  // `trailing` (e.g. an edit / overflow IconButton per its own docs) used to
  // render *inside* this row's own `<button>`/`<a>` — a control nested inside
  // another control, which axe's nested-interactive rule (and screen readers)
  // rightly reject. Restructured to match `AgentChatSidebarTextItem`'s already
  // -shipped pattern: a non-interactive row `<div>` holding the real
  // button/anchor (icon + label + tag) and `trailing` as an independent
  // sibling, each with their own focus target.
  const control = href ? (
    wrapCollapsedItemTooltip(
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target={target}
        {...common}
      >
        {content}
      </a>,
    )
  ) : (
    wrapCollapsedItemTooltip(
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        {...common}
      >
        {content}
      </button>,
    )
  );

  return (
    <div className={rowClassName}>
      {control}
      {!collapsed && trailing ? (
        <span className="ld-agentchatsidebar__item-trailing">{trailing}</span>
      ) : null}
    </div>
  );
});

AgentChatSidebarItem.displayName = 'AgentChatSidebarItem';

// ========================================================================
// Section
// ========================================================================

export interface AgentChatSidebarSectionProps {
  /** Section header label (hidden when the sidebar is collapsed). */
  title?: string;
  /**
   * Make the section header a toggle that expands / collapses its content
   * (a chevron appears beside the title). @default false
   */
  collapsible?: boolean;
  /** Initial expanded state when `collapsible`. @default true */
  defaultExpanded?: boolean;
  children?: React.ReactNode;
}

/**
 * A labeled group of secondary text items. When `collapsible`, the header
 * becomes a toggle that shows / hides the group's content.
 */
export const AgentChatSidebarSection: React.FC<AgentChatSidebarSectionProps> = ({
  title,
  collapsible = false,
  defaultExpanded = true,
  children,
}) => {
  const {collapsed} = useAgentChatSidebar();
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  // The header label is only meaningful while the sidebar is expanded.
  const showTitle = Boolean(title) && !collapsed;
  const isCollapsible = collapsible && !collapsed;
  const open = isCollapsible ? expanded : true;

  return (
    <div className="ld-agentchatsidebar__section">
      {showTitle ? (
        isCollapsible ? (
          <button
            type="button"
            className="ld-agentchatsidebar__section-title ld-agentchatsidebar__section-toggle"
            aria-expanded={expanded}
            onClick={() => setExpanded((e) => !e)}
          >
            <span>{title}</span>
            <span
              className={cx(
                'ld-agentchatsidebar__section-chevron',
                expanded && 'ld-agentchatsidebar__section-chevron--open',
              )}
              aria-hidden="true"
            >
              <ChevronDownIcon />
            </span>
          </button>
        ) : (
          <div className="ld-agentchatsidebar__section-title">{title}</div>
        )
      ) : null}
      {open ? children : null}
    </div>
  );
};

AgentChatSidebarSection.displayName = 'AgentChatSidebarSection';

// ========================================================================
// Text item (secondary)
// ========================================================================

export interface AgentChatSidebarOverflowItem {
  label: string;
  onClick?: () => void;
}

export interface AgentChatSidebarTextItemProps {
  children: string;
  href?: string;
  isCurrent?: boolean;
  /** When set, clicking the label renames it inline; called on commit. */
  onRename?: (next: string) => void;
  /** Items for a trailing "…" overflow menu. */
  overflow?: AgentChatSidebarOverflowItem[];
  /** Marks the chat as pinned. Renders a bookmark indicator in the trailing
   *  slot by default; hovering the row swaps it for the overflow button. */
  isPinned?: boolean;
  /**
   * Glyph used for the pinned indicator (only meaningful when `isPinned`).
   *  - `'bookmark'` (default) — the LD `Bookmark` glyph, available in every theme.
   *  - `'pin'` — the theme's `Pin` glyph, shipped in the WCP icon font. Only
   *    resolves under WCP-family themes (Walmart, Walmart+, Walmart B2B,
   *    Cashi MX, Data Ventures); other themes (LD-only, Sam's Club, Bodega)
   *    don't ship a `Pin` glyph, so keep the `'bookmark'` default there.
   * @default 'bookmark'
   */
  pinIcon?: 'bookmark' | 'pin';
  /**
   * Called when the user toggles the pinned state via the overflow menu.
   * Providing this callback auto-injects a “Pin chat” / “Unpin chat” entry
   * at the top of the overflow menu (rendered even when `overflow` is empty).
   * The consumer owns the list order — pinning should move the row to the top
   * of its group (newest-pinned first); unpinning should return it to its
   * original position.
   */
  onPinToggle?: (nextPinned: boolean) => void;
  /**
   * Overrides the visually-hidden "Pinned chat" suffix announced as part of
   * the label's accessible name (only rendered when `isPinned`). Non-English
   * banners (cashi-mx, bodega) need their own string here — there's no way
   * to override this hardcoded English text otherwise.
   * @default 'Pinned chat'
   */
  pinnedLabel?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  target?: string;
}

/**
 * A secondary text-label row. Supports inline rename (`onRename`) and a trailing
 * overflow menu (`overflow`). Hidden entirely when the sidebar is collapsed —
 * secondary items don't have an icon representation.
 */
export const AgentChatSidebarTextItem: React.FC<AgentChatSidebarTextItemProps> = ({
  children,
  href,
  isCurrent,
  onRename,
  overflow,
  isPinned = false,
  pinIcon = 'bookmark',
  onPinToggle,
  pinnedLabel = 'Pinned chat',
  onClick,
  target,
}) => {
  const {collapsed} = useAgentChatSidebar();
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuPosition, setMenuPosition] = React.useState<MenuPosition>('bottomRight');
  // Renaming isn't reachable by double-click alone (not every input method
  // supports it), so it's also exposed as a "Rename" entry in the overflow
  // menu — both paths flip this same controlled editing state.
  const [renaming, setRenaming] = React.useState(false);

  // When onRename / onPinToggle are provided, prepend "Rename" / “Pin chat”
  // (or "Unpin chat") entries to the caller's overflow items. The menu still
  // renders even if `overflow` is empty, so both actions stay reachable.
  const menuItems = React.useMemo<AgentChatSidebarOverflowItem[]>(() => {
    const renameEntry: AgentChatSidebarOverflowItem | null = onRename
      ? {label: 'Rename', onClick: () => setRenaming(true)}
      : null;
    const pinEntry: AgentChatSidebarOverflowItem | null = onPinToggle
      ? {
          label: isPinned ? 'Unpin chat' : 'Pin chat',
          onClick: () => onPinToggle(!isPinned),
        }
      : null;
    return [
      ...(renameEntry ? [renameEntry] : []),
      ...(pinEntry ? [pinEntry] : []),
      ...(overflow ?? []),
    ];
  }, [onRename, onPinToggle, isPinned, overflow]);

  // Location-aware: the overflow menu renders inline (not portaled), so opening
  // downward near the bottom of the sidebar gets it clipped by the sidebar's
  // rounded/overflow edge and can slip under the footer. Measure the trigger on
  // open and flip the menu upward when there isn't room for it below.
  const openMenu = () => {
    const trigger = triggerRef.current;
    if (trigger) {
      const rect = trigger.getBoundingClientRect();
      // Rough menu height: ~40px per row + vertical padding.
      const estimatedHeight = (menuItems.length || 1) * 40 + 16;
      // Measure against the clipping container (the scrollable content / sidebar
      // card), not the viewport — the sidebar is a small card, so a downward menu
      // is clipped by its edge long before the window bottom.
      const clip =
        trigger.closest('.ld-agentchatsidebar__content') ?? trigger.closest('.ld-agentchatsidebar');
      const bottomBoundary = clip ? clip.getBoundingClientRect().bottom : window.innerHeight;
      const spaceBelow = bottomBoundary - rect.bottom;
      setMenuPosition(spaceBelow < estimatedHeight ? 'topRight' : 'bottomRight');
    }
    setMenuOpen(true);
  };

  if (collapsed) return null;

  const className = cx(
    'ld-agentchatsidebar__textitem',
    isCurrent && 'ld-agentchatsidebar__textitem--current',
    isPinned && 'ld-agentchatsidebar__textitem--pinned',
  );

  // Announced as part of the label's accessible name — pinned state is
  // otherwise only conveyed visually (the bookmark/pin glyph in the trailing
  // slot), which a screen-reader user tabbing to the label itself would miss.
  const pinnedSuffix = isPinned ? <VisuallyHidden> ({pinnedLabel})</VisuallyHidden> : null;

  const label = onRename ? (
    <EditableLabel
      value={children}
      onCommit={onRename}
      editing={renaming}
      onEditingChange={setRenaming}
      onActivate={onClick}
      className="ld-agentchatsidebar__textitem-label"
      inputClassName="ld-agentchatsidebar__textitem-input"
      a11yLabel="Rename item"
      a11ySuffix={pinnedSuffix}
    />
  ) : href ? (
    <a
      href={href}
      target={target}
      onClick={onClick}
      className="ld-agentchatsidebar__textitem-label ld-agentchatsidebar__textitem-link"
      {...(isCurrent ? {'aria-current': 'page' as const} : {})}
    >
      {children}
      {pinnedSuffix}
    </a>
  ) : (
    <button
      type="button"
      onClick={onClick}
      className="ld-agentchatsidebar__textitem-label ld-agentchatsidebar__textitem-link"
    >
      {children}
      {pinnedSuffix}
    </button>
  );

  return (
    <div className={className}>
      {label}
      {(overflow && overflow.length > 0) || onPinToggle || onRename ? (
        <Menu
          isOpen={menuOpen}
          onOpen={openMenu}
          onClose={() => setMenuOpen(false)}
          triggerRef={triggerRef}
          position={menuPosition}
          trigger={
            <IconButton
              ref={triggerRef}
              a11yLabel={`More actions for ${children}`}
              color="tertiary"
              size="xsmall"
            >
              {isPinned ? (
                // Logo-toggle pattern: pin icon and MoreIcon stacked in the
                // same slot; pin is visible at rest, More appears on hover/focus.
                <span className="ld-agentchatsidebar__textitem-toggle" aria-hidden="true">
                  <span className="ld-agentchatsidebar__textitem-pin-icon">
                    <Icon name={pinIcon === 'pin' ? 'Pin' : 'Bookmark'} decorative />
                  </span>
                  <span className="ld-agentchatsidebar__textitem-more-icon">
                    <MoreIcon />
                  </span>
                </span>
              ) : (
                <MoreIcon />
              )}
            </IconButton>
          }
        >
          {menuItems.map((o, i) => (
            <MenuItem
              // Index-qualified: labels alone aren't guaranteed unique (e.g. a
              // caller-supplied overflow item happens to share text with an
              // auto-injected "Rename"/"Pin chat" entry). A label-only key
              // caused exactly that — duplicate-key warning plus pointer
              // clicks landing on the wrong handler after reconciliation.
              key={`${i}-${o.label}`}
              onClick={() => {
                setMenuOpen(false);
                o.onClick?.();
              }}
            >
              {o.label}
            </MenuItem>
          ))}
        </Menu>
      ) : null}
    </div>
  );
};

AgentChatSidebarTextItem.displayName = 'AgentChatSidebarTextItem';

// ========================================================================
// Segment control
// ========================================================================

export interface AgentChatSidebarSegmentProps {
  items: SegmentedControlItem[];
  value: string;
  onChange: (value: string) => void;
  'aria-label'?: string;
}

/** Approx. px each labelled segment needs before its text starts to crowd. */
const SEGMENT_LABEL_MIN_WIDTH = 96;

/**
 * A segmented control inside the sidebar. It renders the full control with
 * icon + text labels when there's room, but collapses to **icon-only** squares
 * when space runs out, so the labels never crowd or butt up against the rail's
 * right edge:
 *
 *  - **Sidebar collapsed** (icon rail) → only the active segment, icon-only.
 *  - **Expanded but narrow** → all segments, icon-only, hugging their content
 *    (not stretched) so they don't reach the container edge.
 *  - **Expanded with room** → the full control with text, stretched full-width.
 *
 * Each item should provide an `icon` so the collapsed forms have something to
 * render (the label is preserved as the segment's accessible name + tooltip).
 */
export const AgentChatSidebarSegment: React.FC<AgentChatSidebarSegmentProps> = ({
  items,
  value,
  onChange,
  'aria-label': ariaLabel,
}) => {
  const {collapsed} = useAgentChatSidebar();
  const wrapRef = React.useRef<HTMLDivElement>(null);
  // True when the expanded rail is too narrow to fit the text labels.
  const [compact, setCompact] = React.useState(false);

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      setCompact(w > 0 && w < items.length * SEGMENT_LABEL_MIN_WIDTH);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [items.length]);

  // Fully collapsed rail — show just the active segment as one icon square.
  if (collapsed) {
    const active = items.find((i) => i.value === value) ?? items[0];
    return (
      <div className="ld-agentchatsidebar__segment ld-agentchatsidebar__segment--collapsed">
        <SegmentedControl
          items={active ? [active] : []}
          value={value}
          onChange={onChange}
          aria-label={ariaLabel}
          iconOnly
        />
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className={cx(
        'ld-agentchatsidebar__segment',
        compact && 'ld-agentchatsidebar__segment--compact',
      )}
    >
      <SegmentedControl
        items={items}
        value={value}
        onChange={onChange}
        aria-label={ariaLabel}
        iconOnly={compact}
        isFullWidth={!compact}
      />
    </div>
  );
};

AgentChatSidebarSegment.displayName = 'AgentChatSidebarSegment';

// ========================================================================
// Footer
// ========================================================================

interface AgentChatSidebarFooterBase {
  /** The leading avatar (avatar-button / menu-expand types). */
  avatar?: AvatarProps;
  /** Label beside the avatar / icon (expanded only). */
  label?: string;
}

export interface AgentChatSidebarFooterAvatarButton
  extends AgentChatSidebarFooterBase {
  type: 'avatar-button';
  onClick?: () => void;
}

/** An accordion (collapsible group) entry within the footer flyout menu. */
export interface AgentChatSidebarMenuAccordion {
  /** The accordion heading row. */
  accordion: string;
  /** Sub-items revealed when the accordion is open. */
  items: AgentChatSidebarOverflowItem[];
  /** Initial open state. @default false */
  defaultOpen?: boolean;
}

/** A footer-menu entry: either a plain link or a collapsible accordion group. */
export type AgentChatSidebarMenuEntry =
  | AgentChatSidebarOverflowItem
  | AgentChatSidebarMenuAccordion;

export interface AgentChatSidebarFooterMenuExpand extends AgentChatSidebarFooterBase {
  type: 'menu-expand';
  /**
   * Entries shown in the flyout menu — plain links, or an accordion group
   * (`{accordion, items}`) that expands a sub-section without closing the menu.
   */
  menuItems: AgentChatSidebarMenuEntry[];
  /** Optional segmented control rendered at the bottom of the menu (e.g. theme). */
  segment?: AgentChatSidebarSegmentProps;
}

export interface AgentChatSidebarFooterIconButton {
  type: 'icon-button';
  icon: React.ReactNode;
  a11yLabel: string;
  onClick?: () => void;
}

export interface AgentChatSidebarFooterAccordion {
  type: 'accordion';
  title: string;
  subtext?: string;
  avatar?: AvatarProps;
  /** Expandable content shown above the row. */
  children?: React.ReactNode;
}

export type AgentChatSidebarFooterProps =
  | AgentChatSidebarFooterAvatarButton
  | AgentChatSidebarFooterMenuExpand
  | AgentChatSidebarFooterIconButton
  | AgentChatSidebarFooterAccordion;

/** The sidebar footer — one of four interchangeable layouts. */
export const AgentChatSidebarFooter: React.FC<AgentChatSidebarFooterProps> = (props) => {
  const {collapsed} = useAgentChatSidebar();

  if (props.type === 'icon-button') {
    return (
      <div className="ld-agentchatsidebar__footer">
        <Tooltip content={props.a11yLabel} relationship="label" position="after">
          <IconButton
            a11yLabel={props.a11yLabel}
            color="tertiary"
            size="small"
            onClick={props.onClick}
          >
            {props.icon}
          </IconButton>
        </Tooltip>
      </div>
    );
  }

  if (props.type === 'avatar-button') {
    const button = (
      <button
        type="button"
        className="ld-agentchatsidebar__footer-button"
        onClick={props.onClick}
        {...(collapsed && props.label
          ? {'aria-label': props.label}
          : {})}
      >
        {props.avatar ? (
          /* Decorative here — the visible label (or the button's aria-label
             when collapsed) already names the control; labeling the avatar
             too would double the accessible name. */
          <span aria-hidden="true" style={{display: 'contents'}}>
            <Avatar size="small" {...props.avatar} />
          </span>
        ) : null}
        {!collapsed && props.label ? (
          <span className="ld-agentchatsidebar__footer-label">{props.label}</span>
        ) : null}
      </button>
    );
    return (
      <div className="ld-agentchatsidebar__footer">
        {collapsed && props.label ? (
          <Tooltip content={props.label} relationship="label" position="after">
            {button}
          </Tooltip>
        ) : (
          button
        )}
      </div>
    );
  }

  if (props.type === 'menu-expand') {
    return <FooterMenuExpand {...props} />;
  }

  // accordion
  return <FooterAccordion {...props} />;
};

AgentChatSidebarFooter.displayName = 'AgentChatSidebarFooter';

function FooterMenuExpand(props: AgentChatSidebarFooterMenuExpand) {
  const {collapsed} = useAgentChatSidebar();
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);
  const position: MenuPosition = 'topLeft';
  const triggerButton = (
    <button
      ref={triggerRef}
      type="button"
      className="ld-agentchatsidebar__footer-button"
      aria-haspopup="menu"
      aria-expanded={open}
      {...(collapsed && props.label
        ? {'aria-label': props.label}
        : {})}
    >
      {props.avatar ? (
      /* Decorative here — the visible label (or the button's aria-label
         when collapsed) already names the control; labeling the avatar
         too would double the accessible name. */
      <span aria-hidden="true" style={{display: 'contents'}}>
        <Avatar size="small" {...props.avatar} />
      </span>
    ) : null}
      {!collapsed && props.label ? (
        <span className="ld-agentchatsidebar__footer-label">{props.label}</span>
      ) : null}
    </button>
  );

  return (
    <div className="ld-agentchatsidebar__footer">
      <Menu
        isOpen={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        triggerRef={triggerRef}
        position={position}
        trigger={
          collapsed && props.label ? (
            <Tooltip content={props.label} relationship="label" position="after">
              {triggerButton}
            </Tooltip>
          ) : (
            triggerButton
          )
        }
      >
        {props.menuItems.map((m, i) =>
          'accordion' in m ? (
            <MenuSectionTitleAccordion
              key={`acc-${m.accordion}-${i}`}
              title={m.accordion}
              defaultOpen={m.defaultOpen}
            >
              {m.items.map((s) => (
                <MenuItem
                  key={s.label}
                  onClick={() => {
                    setOpen(false);
                    s.onClick?.();
                  }}
                >
                  {s.label}
                </MenuItem>
              ))}
            </MenuSectionTitleAccordion>
          ) : (
            <MenuItem
              key={`item-${m.label}-${i}`}
              onClick={() => {
                setOpen(false);
                m.onClick?.();
              }}
            >
              {m.label}
            </MenuItem>
          ),
        )}
        {props.segment ? (
          <div className="ld-agentchatsidebar__footer-menu-segment">
            <SegmentedControl
              items={props.segment.items}
              value={props.segment.value}
              onChange={props.segment.onChange}
              aria-label={props.segment['aria-label']}
              isFullWidth
            />
          </div>
        ) : null}
      </Menu>
    </div>
  );
}

function FooterAccordion(props: AgentChatSidebarFooterAccordion) {
  const {collapsed} = useAgentChatSidebar();
  const [open, setOpen] = React.useState(false);
  const button = (
    <button
      type="button"
      className="ld-agentchatsidebar__footer-button ld-agentchatsidebar__footer-accordion-row"
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      {...(collapsed
        ? {'aria-label': props.title}
        : {})}
    >
      {props.avatar ? <Avatar size="small" {...props.avatar} /> : null}
      {!collapsed ? (
        <span className="ld-agentchatsidebar__footer-accordion-text">
          <span className="ld-agentchatsidebar__footer-accordion-title">
            {props.title}
          </span>
          {props.subtext ? (
            <span className="ld-agentchatsidebar__footer-accordion-subtext">
              {props.subtext}
            </span>
          ) : null}
        </span>
      ) : null}
      {!collapsed ? (
        <span
          className={cx(
            'ld-agentchatsidebar__footer-accordion-chevron',
            open && 'ld-agentchatsidebar__footer-accordion-chevron--open',
          )}
          aria-hidden="true"
        >
          <ChevronDownIcon />
        </span>
      ) : null}
    </button>
  );

  return (
    <div className="ld-agentchatsidebar__footer ld-agentchatsidebar__footer--accordion">
      {open && !collapsed && props.children ? (
        <div className="ld-agentchatsidebar__footer-accordion-content">
          {props.children}
        </div>
      ) : null}
      {collapsed ? (
        <Tooltip content={props.title} relationship="label" position="after">
          {button}
        </Tooltip>
      ) : (
        button
      )}
    </div>
  );
}
