// @refresh reset

/**
 * @module DataTableConfigPanel
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
 * For prop API + usage notes, read `DataTableConfigPanel.md` in this folder
 * or run `npm run ld-kit -- show DataTableConfigPanel`.
 */

/**
 * @source PX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/ui/DataTableConfigPanel.tsx
 *
 * Data Table Config Panel — right-side overlay panel for customizing
 * `core/DataTable` columns (visibility, pinning, drag-reorder).
 *
 * Drag-and-drop:
 * - Mouse: HTML5 drag-and-drop with blue drop-line indicator.
 * - Keyboard (drag handle): Space to grab, Arrow Up/Down to move, Space/Enter
 *   to confirm, Escape to restore.
 * - Keyboard (move button): Focus the ⊕ button → Enter/Space opens a "Move to"
 *   menu → Arrow Up/Down to navigate → Enter to confirm. Escape closes.
 */
import * as React from 'react';

import {cx} from '../../common/cx';
import {useOnKeyDown} from '../../common/helpers';
import {Button} from '../Button/Button';
import {Checkbox} from '../Checkbox/Checkbox';
import {FocusTrap} from '../FocusTrap';

import '../../fonts/px/font.css';
import './DataTableConfigPanel.css';

export interface DataTableColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  /** Frozen / pinned to the left. */
  pinned: boolean;
  /** Cannot be hidden (e.g. "Campaign"). */
  alwaysVisible?: boolean;
  /** Always pinned and cannot be changed (e.g. "Actions"). */
  alwaysPinned?: boolean;
}

export interface DataTableConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  /** @default 'Customize Columns' */
  title?: string;
  columns: DataTableColumnConfig[];
  onApply: (columns: DataTableColumnConfig[]) => void;
  /** Optional className applied to the panel root. */
  className?: string;
}

const PxIcon = ({name, size}: {name: string; size: 'small' | 'medium'}) => (
  <i
    className={`px px-${name}`}
    aria-hidden
    style={{fontSize: size === 'small' ? '1rem' : '1.5rem', lineHeight: 1}}
  />
);

const DragHandleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M10.5 6C10.5 6.82843 9.82843 7.5 9 7.5C8.17157 7.5 7.5 6.82843 7.5 6C7.5 5.17157 8.17157 4.5 9 4.5C9.82843 4.5 10.5 5.17157 10.5 6Z" fill="currentColor" />
    <path d="M10.5 12C10.5 12.8284 9.82843 13.5 9 13.5C8.17157 13.5 7.5 12.8284 7.5 12C7.5 11.1716 8.17157 10.5 9 10.5C9.82843 10.5 10.5 11.1716 10.5 12Z" fill="currentColor" />
    <path d="M10.5 18C10.5 18.8284 9.82843 19.5 9 19.5C8.17157 19.5 7.5 18.8284 7.5 18C7.5 17.1716 8.17157 16.5 9 16.5C9.82843 16.5 10.5 17.1716 10.5 18Z" fill="currentColor" />
    <path d="M16.5 6C16.5 6.82843 15.8284 7.5 15 7.5C14.1716 7.5 13.5 6.82843 13.5 6C13.5 5.17157 14.1716 4.5 15 4.5C15.8284 4.5 16.5 5.17157 16.5 6Z" fill="currentColor" />
    <path d="M16.5 12C16.5 12.8284 15.8284 13.5 15 13.5C14.1716 13.5 13.5 12.8284 13.5 12C13.5 11.1716 14.1716 10.5 15 10.5C15.8284 10.5 16.5 11.1716 16.5 12Z" fill="currentColor" />
    <path d="M16.5 18C16.5 18.8284 15.8284 19.5 15 19.5C14.1716 19.5 13.5 18.8284 13.5 18C13.5 17.1716 14.1716 16.5 15 16.5C15.8284 16.5 16.5 17.1716 16.5 18Z" fill="currentColor" />
  </svg>
);

const MoveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
    <path d="M8 0L10.5 3H9V7H13V5.5L16 8L13 10.5V9H9V13H10.5L8 16L5.5 13H7V9H3V10.5L0 8L3 5.5V7H7V3H5.5L8 0Z"/>
  </svg>
);

const PinIcon = () => <PxIcon name="Pin" size="small" />;
const PinFillIcon = () => <PxIcon name="PinFill" size="small" />;
const CloseIcon = () => <PxIcon name="Close" size="medium" />;

export function DataTableConfigPanel({
  isOpen,
  onClose,
  title = 'Customize Columns',
  columns,
  onApply,
  className,
}: DataTableConfigPanelProps) {
  const [localColumns, setLocalColumns] =
    React.useState<DataTableColumnConfig[]>(columns);

  // ─── Mouse drag state ───────────────────────────────────────────────────────
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);
  // Index AFTER which the drop line appears (-1 = before the first row)
  const [dropAfterIndex, setDropAfterIndex] = React.useState<number | null>(null);

  // ─── Keyboard drag state ────────────────────────────────────────────────────
  // Track by col.id (stable across re-renders as items move in the list).
  const [keyboardDragId, setKeyboardDragId] = React.useState<string | null>(null);
  // Store original order so Escape can restore it.
  const [preDragColumns, setPreDragColumns] = React.useState<DataTableColumnConfig[] | null>(null);

  // ─── "Move to" accessible menu state ───────────────────────────────────────
  // Which column's move menu is open (by col.id), and its viewport position.
  const [moveMenuOpenId, setMoveMenuOpenId] = React.useState<string | null>(null);
  const [moveMenuPos, setMoveMenuPos] = React.useState<{top: number; left: number} | null>(null);
  // Which row has keyboard focus — used to reveal the move button via React state.
  const [focusedRowId, setFocusedRowId] = React.useState<string | null>(null);

  // ─── Screen reader announcements ────────────────────────────────────────────
  const [announcement, setAnnouncement] = React.useState('');

  const labelIdPrefix = React.useId();
  const titleId = `${labelIdPrefix}-title`;
  const dndHintId = `${labelIdPrefix}-dnd-hint`;

  const triggerRef = React.useRef<Element | null>(null);
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const columnListRef = React.useRef<HTMLDivElement>(null);
  const dropLineElRef = React.useRef<HTMLDivElement>(null);

  // Ref map: col.id → drag-handle <button>. Used to re-focus after a move.
  const dragHandleRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
  // Ref map: col.id → move <button>. Used to re-focus after menu closes.
  const moveButtonRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());

  // Capture trigger before FocusTrap moves focus away.
  React.useLayoutEffect(() => {
    if (isOpen) triggerRef.current = document.activeElement;
  }, [isOpen]);

  // Move focus to heading on open so screen readers get immediate context.
  React.useEffect(() => {
    if (isOpen) headingRef.current?.focus();
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen) setLocalColumns(columns);
  }, [isOpen, columns]);

  React.useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  // Document-level dragover — always fires regardless of Panel scroll-container blocking.
  // Positions the drop-line indicator via direct DOM manipulation (no React render needed).
  React.useEffect(() => {
    if (!isOpen || dragIndex === null) return;

    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      const list = columnListRef.current;
      const lineEl = dropLineElRef.current;
      if (!list || !lineEl) return;
      const listRect = list.getBoundingClientRect();
      const rows = list.querySelectorAll<HTMLDivElement>('.px-data-table-config-panel__column-row');
      for (let i = 0; i < rows.length; i++) {
        const rect = rows[i].getBoundingClientRect();
        if (e.clientY >= rect.top && e.clientY < rect.bottom) {
          const inUpperHalf = e.clientY < rect.top + rect.height / 2;
          const y = (inUpperHalf ? rect.top : rect.bottom) - listRect.top + list.scrollTop - 1;
          lineEl.style.display = 'block';
          lineEl.style.top = `${y}px`;
          setDropAfterIndex(inUpperHalf ? i - 1 : i);
          return;
        }
      }
      lineEl.style.display = 'none';
    };

    document.addEventListener('dragover', onDragOver);
    return () => {
      document.removeEventListener('dragover', onDragOver);
      if (dropLineElRef.current) dropLineElRef.current.style.display = 'none';
    };
  }, [isOpen, dragIndex]);

  // Close move menu when clicking outside it.
  React.useEffect(() => {
    if (!moveMenuOpenId) return;
    const onPointerDown = (e: PointerEvent) => {
      const menu = document.getElementById(`${labelIdPrefix}-move-menu`);
      const btn = moveButtonRefs.current.get(moveMenuOpenId);
      if (
        menu && !menu.contains(e.target as Node) &&
        btn && !btn.contains(e.target as Node)
      ) {
        setMoveMenuOpenId(null);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [moveMenuOpenId, labelIdPrefix]);

  const returnFocus = React.useCallback(() => {
    requestAnimationFrame(() => {
      (triggerRef.current as HTMLElement | null)?.focus();
    });
  }, []);

  const handleApply = React.useCallback(() => {
    onApply(localColumns);
    onClose();
    returnFocus();
  }, [localColumns, onApply, onClose, returnFocus]);

  const handleCancel = React.useCallback(() => {
    setLocalColumns(columns);
    onClose();
    returnFocus();
  }, [columns, onClose, returnFocus]);

  // Escape: close move menu first; if no menu open, cancel/close the panel.
  useOnKeyDown(['Esc', 'Escape'], () => {
    if (moveMenuOpenId) {
      const id = moveMenuOpenId;
      setMoveMenuOpenId(null);
      requestAnimationFrame(() => moveButtonRefs.current.get(id)?.focus());
    } else {
      handleCancel();
    }
  });

  if (!isOpen) return null;

  const totalCount = localColumns.length;
  const visibleCount = localColumns.filter(c => c.visible).length;

  // ─── Helpers ────────────────────────────────────────────────────────────────

  /** Re-focus a drag handle button after the list re-renders (item moved). */
  const refocusDragHandle = (id: string) => {
    requestAnimationFrame(() => {
      dragHandleRefs.current.get(id)?.focus();
    });
  };

  // ─── Mouse drag ─────────────────────────────────────────────────────────────

  /** Move/show the absolutely-positioned drop-line indicator via direct DOM. */
  const showDropLine = (y: number) => {
    const el = dropLineElRef.current;
    if (!el) return;
    el.style.display = 'block';
    el.style.top = `${y}px`;
  };

  const hideDropLine = () => {
    const el = dropLineElRef.current;
    if (el) el.style.display = 'none';
  };

  const handleDragStart = (index: number) => setDragIndex(index);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // required to allow drop on this row
  };

  const handleDrop = () => {
    hideDropLine();
    if (dragIndex === null || dropAfterIndex === null) {
      setDragIndex(null); setDragOverIndex(null); setDropAfterIndex(null);
      return;
    }
    const next = [...localColumns];
    const [moved] = next.splice(dragIndex, 1);
    let insertAt = dropAfterIndex + 1;
    if (dragIndex < insertAt) insertAt--;
    insertAt = Math.max(0, Math.min(insertAt, next.length));
    next.splice(insertAt, 0, moved);
    const alwaysVis = next.filter(c => c.alwaysVisible);
    const alwaysPin = next.filter(c => c.alwaysPinned);
    const rest = next.filter(c => !c.alwaysVisible && !c.alwaysPinned);
    setLocalColumns([...alwaysVis, ...rest, ...alwaysPin]);
    setDragIndex(null); setDragOverIndex(null); setDropAfterIndex(null);
  };

  const handleDragEnd = () => {
    hideDropLine();
    setDragIndex(null); setDragOverIndex(null); setDropAfterIndex(null);
  };

  // ─── "Move to" menu handlers ────────────────────────────────────────────────

  const handleOpenMoveMenu = (colId: string) => {
    const btn = moveButtonRefs.current.get(colId);
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    setMoveMenuPos({top: rect.bottom + 4, left: rect.left - 120});
    setMoveMenuOpenId(colId);
    // Focus first menu item on next frame
    requestAnimationFrame(() => {
      const menu = document.getElementById(`${labelIdPrefix}-move-menu`);
      (menu?.querySelector('[role="menuitem"]') as HTMLElement | null)?.focus();
    });
  };

  const handleMoveTo = (fromId: string, insertBeforeId: string | '__end__') => {
    setLocalColumns(cols => {
      const fromIndex = cols.findIndex(c => c.id === fromId);
      if (fromIndex === -1) return cols;
      const next = [...cols];
      const [moved] = next.splice(fromIndex, 1);
      const toIndex =
        insertBeforeId === '__end__'
          ? next.length
          : next.findIndex(c => c.id === insertBeforeId);
      const insertAt = toIndex === -1 ? next.length : toIndex;
      next.splice(insertAt, 0, moved);
      return next;
    });
    setMoveMenuOpenId(null);
    const col = localColumns.find(c => c.id === fromId);
    if (col) setAnnouncement(`${col.label} moved.`);
    requestAnimationFrame(() => {
      moveButtonRefs.current.get(fromId)?.focus();
    });
  };

  const handleMoveMenuKeyDown = (
    fromId: string,
    e: React.KeyboardEvent<HTMLElement>,
  ) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setMoveMenuOpenId(null);
      requestAnimationFrame(() => moveButtonRefs.current.get(fromId)?.focus());
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const menu = document.getElementById(`${labelIdPrefix}-move-menu`);
      if (!menu) return;
      const items = Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]'));
      const current = document.activeElement as HTMLElement;
      const idx = items.indexOf(current);
      const next =
        e.key === 'ArrowDown'
          ? items[(idx + 1) % items.length]
          : items[(idx - 1 + items.length) % items.length];
      next?.focus();
    }
  };

  // ─── Field handlers ─────────────────────────────────────────────────────────

  const handleSelectAll = () => {
    setLocalColumns(cols => cols.map(c => ({...c, visible: true})));
  };

  const handleClearSelected = () => {
    setLocalColumns(cols =>
      cols.map(c =>
        c.alwaysVisible || c.alwaysPinned ? c : {...c, visible: false, pinned: false}
      )
    );
  };

  const handleToggleVisible = (id: string) => {
    setLocalColumns(cols =>
      cols.map(c =>
        c.id === id
          ? {...c, visible: !c.visible, pinned: !c.visible ? c.pinned : false}
          : c
      )
    );
  };

  const handleTogglePinned = (id: string) => {
    setLocalColumns(cols =>
      cols.map(c => (c.id === id ? {...c, pinned: !c.pinned} : c))
    );
  };

  // ─── Keyboard drag per-handle handler ───────────────────────────────────────

  const makeDragHandleKeyDown =
    (colId: string, colLabel: string) =>
    (e: React.KeyboardEvent) => {
      const isGrabbed = keyboardDragId === colId;

      if (e.key === ' ') {
        e.preventDefault();
        if (keyboardDragId === null) {
          // Grab: snapshot order, enter drag mode
          setPreDragColumns([...localColumns]);
          setKeyboardDragId(colId);
          setAnnouncement(
            `${colLabel} grabbed. Press Arrow Up or Arrow Down to move, Space or Enter to confirm, Escape to cancel.`
          );
        } else if (isGrabbed) {
          // Confirm: keep current position
          setPreDragColumns(null);
          setKeyboardDragId(null);
          setAnnouncement(`${colLabel} placed.`);
        }
        return;
      }

      if ((e.key === 'Enter') && isGrabbed) {
        e.preventDefault();
        setPreDragColumns(null);
        setKeyboardDragId(null);
        setAnnouncement(`${colLabel} placed.`);
        return;
      }

      if (e.key === 'Escape' && keyboardDragId !== null) {
        e.preventDefault();
        if (preDragColumns) setLocalColumns(preDragColumns);
        setPreDragColumns(null);
        setKeyboardDragId(null);
        setAnnouncement(`${colLabel} reorder cancelled.`);
        // Re-focus the drag handle after columns restore
        requestAnimationFrame(() => {
          dragHandleRefs.current.get(colId)?.focus();
        });
        return;
      }

      if (isGrabbed && e.key === 'ArrowUp') {
        e.preventDefault();
        setLocalColumns(cols => {
          const i = cols.findIndex(c => c.id === colId);
          // Can't move above alwaysVisible items or to top boundary
          if (i <= 0 || cols[i - 1]?.alwaysVisible) return cols;
          const next = [...cols];
          [next[i - 1], next[i]] = [next[i], next[i - 1]];
          return next;
        });
        refocusDragHandle(colId);
        setAnnouncement(`${colLabel} moved up.`);
        return;
      }

      if (isGrabbed && e.key === 'ArrowDown') {
        e.preventDefault();
        setLocalColumns(cols => {
          const i = cols.findIndex(c => c.id === colId);
          // Can't move below alwaysPinned items or past bottom boundary
          if (i >= cols.length - 1 || cols[i + 1]?.alwaysPinned) return cols;
          const next = [...cols];
          [next[i], next[i + 1]] = [next[i + 1], next[i]];
          return next;
        });
        refocusDragHandle(colId);
        setAnnouncement(`${colLabel} moved down.`);
        return;
      }
    };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      className="px-data-table-config-panel__overlay"
      onClick={handleCancel}
    >
      <FocusTrap
        hasFocusReturn={false}
        UNSAFE_className={cx('px-data-table-config-panel', className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Assertive live region for keyboard drag announcements */}
        <div
          role="alert"
          aria-atomic="true"
          className="px-data-table-config-panel__sr-only"
        >
          {announcement}
        </div>

        <div className="px-data-table-config-panel__header">
          <h2
            ref={headingRef}
            id={titleId}
            className="px-data-table-config-panel__title"
            tabIndex={-1}
          >
            {title}
          </h2>
          <button
            type="button"
            className="px-data-table-config-panel__close-button"
            onClick={handleCancel}
            aria-label="Close panel"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="px-data-table-config-panel__divider" aria-hidden />

        <div className="px-data-table-config-panel__content">
          <div className="px-data-table-config-panel__actions-row">
            <button
              type="button"
              className="px-data-table-config-panel__link-button"
              onClick={handleSelectAll}
            >
              Select all ({totalCount})
            </button>
            <button
              type="button"
              className="px-data-table-config-panel__link-button"
              onClick={handleClearSelected}
            >
              Clear selected ({visibleCount})
            </button>
          </div>

          {/* Hidden hint – announced to SR when drag handle receives focus */}
          <span id={dndHintId} className="px-data-table-config-panel__sr-only">
            Press Space to reorder
          </span>

          <div
            className="px-data-table-config-panel__column-list"
            ref={columnListRef}
            style={{position: 'relative'}}
          >
            {/* Absolutely-positioned drop indicator — moved via DOM in dragover handler */}
            <div
              ref={dropLineElRef}
              aria-hidden
              className="px-data-table-config-panel__drop-line"
              style={{display: 'none', position: 'absolute', left: 4, right: 0, top: 0}}
            />
            {localColumns.map((col, index) => {
              const isDragging = dragIndex === index;
              const isGrabbedByKeyboard = keyboardDragId === col.id;
              const canDrag = !col.alwaysVisible && !col.alwaysPinned;
              const labelId = `${labelIdPrefix}-${col.id}`;
              const labelDisabled = !!(col.alwaysVisible || col.alwaysPinned);

              return (
                <div
                  key={col.id}
                  className={cx(
                    'px-data-table-config-panel__column-row',
                    isDragging && 'px-data-table-config-panel__column-row--dragging',
                    isGrabbedByKeyboard && 'px-data-table-config-panel__column-row--grabbed',
                  )}
                  draggable={canDrag}
                  onDragStart={canDrag ? () => handleDragStart(index) : undefined}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                  onFocus={() => setFocusedRowId(col.id)}
                  onBlur={e => {
                    // Only clear if focus truly left the row (not moved to a sibling inside it)
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setFocusedRowId(id => id === col.id ? null : id);
                    }
                  }}
                >
                  <div className="px-data-table-config-panel__column-row-left">
                    <Checkbox
                      checked={col.visible}
                      disabled={labelDisabled}
                      a11yLabelledBy={labelId}
                      onChange={() => {
                        if (!labelDisabled) handleToggleVisible(col.id);
                      }}
                    />
                    <span
                      id={labelId}
                      className={cx(
                        'px-data-table-config-panel__column-label',
                        labelDisabled &&
                          'px-data-table-config-panel__column-label--disabled',
                      )}
                    >
                      {col.label}
                    </span>
                  </div>

                  <div className="px-data-table-config-panel__column-row-right">
                    {canDrag && (
                      <button
                        type="button"
                        ref={el => {
                          if (el) moveButtonRefs.current.set(col.id, el);
                          else moveButtonRefs.current.delete(col.id);
                        }}
                        className={cx(
                          'px-data-table-config-panel__move-btn',
                          (focusedRowId === col.id || moveMenuOpenId === col.id) &&
                            'px-data-table-config-panel__move-btn--visible',
                        )}
                        aria-label={`Move ${col.label}`}
                        aria-haspopup="menu"
                        aria-expanded={moveMenuOpenId === col.id}
                        onClick={() =>
                          moveMenuOpenId === col.id
                            ? setMoveMenuOpenId(null)
                            : handleOpenMoveMenu(col.id)
                        }
                        onKeyDown={e => {
                          if (moveMenuOpenId === col.id) handleMoveMenuKeyDown(col.id, e);
                        }}
                      >
                        <MoveIcon />
                      </button>
                    )}
                    {col.alwaysPinned ? (
                      <span
                        role="checkbox"
                        aria-checked="true"
                        aria-disabled="true"
                        aria-label={`Pin ${col.label}`}
                        className="px-data-table-config-panel__pin-button px-data-table-config-panel__pin-button--active"
                      >
                        <PinFillIcon />
                      </span>
                    ) : col.visible ? (
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={col.pinned}
                        className={cx(
                          'px-data-table-config-panel__pin-button',
                          col.pinned &&
                            'px-data-table-config-panel__pin-button--active',
                        )}
                        onClick={() => handleTogglePinned(col.id)}
                        aria-label={`Pin ${col.label}`}
                        title={`Pin ${col.label} to left`}
                      >
                        {col.pinned ? <PinFillIcon /> : <PinIcon />}
                      </button>
                    ) : (
                      <span className="px-data-table-config-panel__pin-button-spacer" />
                    )}

                    {canDrag ? (
                      <button
                        type="button"
                        ref={el => {
                          if (el) dragHandleRefs.current.set(col.id, el);
                          else dragHandleRefs.current.delete(col.id);
                        }}
                        className={cx(
                          'px-data-table-config-panel__drag-handle-btn',
                          isGrabbedByKeyboard &&
                            'px-data-table-config-panel__drag-handle-btn--grabbed',
                        )}
                        aria-label={`Reorder ${col.label}`}
                        aria-pressed={isGrabbedByKeyboard}
                        aria-describedby={isGrabbedByKeyboard ? undefined : dndHintId}
                        onKeyDown={makeDragHandleKeyDown(col.id, col.label)}
                      >
                        <DragHandleIcon />
                      </button>
                    ) : (
                      <span
                        className="px-data-table-config-panel__drag-handle-btn px-data-table-config-panel__drag-handle-btn--hidden"
                        aria-hidden
                      >
                        <DragHandleIcon />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* "Move to" menu — fixed-positioned so it escapes the scroll container */}
        {moveMenuOpenId && moveMenuPos && (() => {
          const fromCol = localColumns.find(c => c.id === moveMenuOpenId);
          if (!fromCol) return null;
          const targets = localColumns.filter(
            c => c.id !== moveMenuOpenId && !c.alwaysVisible && !c.alwaysPinned,
          );
          return (
            <div
              id={`${labelIdPrefix}-move-menu`}
              role="menu"
              aria-label={`Move ${fromCol.label} to`}
              className="px-data-table-config-panel__move-menu"
              style={{position: 'fixed', top: moveMenuPos.top, left: moveMenuPos.left}}
              onKeyDown={e => handleMoveMenuKeyDown(moveMenuOpenId, e)}
            >
              {targets.map(t => (
                <button
                  key={t.id}
                  type="button"
                  role="menuitem"
                  className="px-data-table-config-panel__move-menu-item"
                  onClick={() => handleMoveTo(moveMenuOpenId, t.id)}
                >
                  Before {t.label}
                </button>
              ))}
              <button
                type="button"
                role="menuitem"
                className="px-data-table-config-panel__move-menu-item"
                onClick={() => handleMoveTo(moveMenuOpenId, '__end__')}
              >
                Move to end
              </button>
            </div>
          );
        })()}

        <div className="px-data-table-config-panel__divider" aria-hidden />

        <div className="px-data-table-config-panel__footer">
          <button
            type="button"
            className="px-data-table-config-panel__link-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <Button variant="secondary" size="small" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </FocusTrap>
    </div>
  );
}

DataTableConfigPanel.displayName = 'DataTableConfigPanel';
