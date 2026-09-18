import * as React from 'react';
import { Icon } from '../Icons';
import { ArrowRightLineIcon, ArrowLineLeftIcon } from './SidebarToggleIcons';
import { cx } from '../../common/cx';
import './AppSidebar.css';

export interface AppSidebarMenuItem {
  id: string;
  label: string;
  /** Font icon name — see src/components/Icons */
  iconName: string;
  route?: string;
}

export interface AppSidebarProps {
  menuItems: AppSidebarMenuItem[];
  activeMenuItem?: string;
  onMenuItemClick?: (itemId: string, route?: string) => void;
  /** Whether the sidebar starts pinned open (expanded) rather than hover-to-expand. */
  defaultLocked?: boolean;
  /** Accessible label for the sidebar landmark. */
  'aria-label'?: string;
}

const MIN_WIDTH = 64;
const MAX_WIDTH = 400;
const DEFAULT_WIDTH = 220;
const COLLAPSED_WIDTH = 64;

/**
 * Left navigation rail — hover-to-expand, lock, and resize, matching the
 * generated `SidebarShell` pattern's exact visuals (`.ld-sidebar-shell*`
 * classes, ported into `AppSidebar.css`). Built as a project-local
 * component (not `SidebarShell` itself) because `SidebarShell`'s built-in
 * lock toggle always renders the static label "Lock" regardless of the
 * actual lock state and exposes no prop to control or relabel it —
 * `SidebarShell` is generated/read-only, so that couldn't be fixed in
 * place. This keeps the same look, hover/lock/resize behavior, and adds a
 * Lock/LockOpen icon plus a label that correctly reads "Lock" when
 * unlocked and "Unlock" when locked.
 */
export function AppSidebar({
  menuItems,
  activeMenuItem,
  onMenuItemClick,
  defaultLocked = false,
  'aria-label': ariaLabel = 'Application navigation',
}: AppSidebarProps) {
  const [locked, setLocked] = React.useState(defaultLocked);
  const [hovered, setHovered] = React.useState(false);
  const [width, setWidth] = React.useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = React.useState(false);
  const resizeStartX = React.useRef(0);
  const resizeStartWidth = React.useRef(0);

  const expanded = locked || hovered;

  React.useEffect(() => {
    if (!isResizing) return;
    const onMove = (e: MouseEvent) => {
      const delta = e.clientX - resizeStartX.current;
      const next = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, resizeStartWidth.current + delta));
      setWidth(next);
    };
    const onUp = () => setIsResizing(false);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [isResizing]);

  const handleToggleLock = () => {
    if (locked) {
      setLocked(false);
      // `expanded` is `locked || hovered` — the cursor is still physically
      // over the sidebar right after this click, so `hovered` alone would
      // keep it expanded until the mouse eventually leaves. Clear it here
      // so "Collapse" collapses immediately; it'll re-expand on the next
      // real mouseenter if the cursor is still within the (now narrower)
      // collapsed rail.
      setHovered(false);
    } else {
      setLocked(true);
      if (width < DEFAULT_WIDTH) setWidth(DEFAULT_WIDTH);
    }
  };

  return (
    <aside
      aria-label={ariaLabel}
      className="ld-app-sidebar-shell"
      style={{
        width: expanded ? `${width}px` : `${COLLAPSED_WIDTH}px`,
        transition: isResizing ? 'none' : 'width 300ms ease-in-out',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <nav aria-label="Main" className="ld-app-sidebar-shell__items">
        {menuItems.map((item) => {
          const isActive = activeMenuItem === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={cx(
                'ld-app-sidebar-shell__item',
                expanded ? 'ld-app-sidebar-shell__item--expanded' : 'ld-app-sidebar-shell__item--collapsed',
                isActive && expanded && 'ld-app-sidebar-shell__item--active',
              )}
              onClick={() => onMenuItemClick?.(item.id, item.route)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={!expanded ? item.label : undefined}
              title={!expanded ? item.label : undefined}
            >
              <span className="ld-app-sidebar-shell__item-content">
                <span
                  className={cx(
                    'ld-app-sidebar-shell__item-icon',
                    isActive && 'ld-app-sidebar-shell__item-icon--active',
                  )}
                >
                  <Icon name={item.iconName} size="small" decorative />
                </span>
                {expanded ? (
                  <span
                    className={cx(
                      'ld-app-sidebar-shell__item-label',
                      isActive && 'ld-app-sidebar-shell__item-label--active',
                    )}
                  >
                    {item.label}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </nav>

      <div>
        <button
          type="button"
          className={cx(
            'ld-app-sidebar-shell__toggle',
            expanded ? 'ld-app-sidebar-shell__toggle--expanded' : 'ld-app-sidebar-shell__toggle--collapsed',
          )}
          onClick={handleToggleLock}
          aria-label={!expanded ? (locked ? 'Collapse sidebar' : 'Lock sidebar open') : undefined}
          aria-expanded={locked}
        >
          <span className="ld-app-sidebar-shell__toggle-icon">
            {locked ? <ArrowLineLeftIcon /> : <ArrowRightLineIcon />}
          </span>
          {expanded ? (
            <span className="ld-app-sidebar-shell__toggle-label">{locked ? 'Collapse' : 'Lock'}</span>
          ) : null}
        </button>
      </div>

      {expanded ? (
        <div
          className="ld-app-sidebar-shell__resize-handle"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
            resizeStartX.current = e.clientX;
            resizeStartWidth.current = width;
          }}
        />
      ) : null}
    </aside>
  );
}
