'use client';

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps, invariant, useStableId} from '../../common/helpers';

import './SideNavigation.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TreeItemData {
  id: string;
  label: string;
  children?: TreeItemData[];
}

interface TreeBaseProps
  extends Omit<
      React.ComponentPropsWithoutRef<'div'>,
      'className' | 'style' | 'onSelect'
    > {
  /** Tree data to render. */
  data: TreeItemData[];
  /** IDs expanded by default. */
  defaultExpandedIds?: string[];
  /** Callback when a node is selected. */
  onSelect?: (id: string) => void;
  /** Currently selected node ID. */
  selectedId?: string;
}

type TreeWithLabel = TreeBaseProps & {
  /** Visible label for the tree. */
  label: string;
  a11yLabelledBy?: never;
};

type TreeWithA11yLabel = TreeBaseProps & {
  label?: never;
  /** ID of external label element. */
  a11yLabelledBy: string;
};

export type TreeProps = TreeWithLabel | TreeWithA11yLabel;

// ---------------------------------------------------------------------------
// Flat node helpers for keyboard navigation
// ---------------------------------------------------------------------------

interface FlatNode {
  id: string;
  label: string;
  parentId?: string;
  hasChildren: boolean;
}

/**
 * Returns all currently-visible nodes in DOM order (depth-first pre-order).
 * A branch's children are included only when the branch is expanded.
 */
function getVisibleNodes(
  data: TreeItemData[],
  expandedIds: Set<string>,
  parentId?: string
): FlatNode[] {
  const result: FlatNode[] = [];
  for (const node of data) {
    const hasChildren = !!(node.children && node.children.length > 0);
    result.push({id: node.id, label: node.label, parentId, hasChildren});
    if (hasChildren && expandedIds.has(node.id)) {
      result.push(...getVisibleNodes(node.children!, expandedIds, node.id));
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// TreeNode (internal)
// ---------------------------------------------------------------------------

interface TreeNodeProps {
  node: TreeItemData;
  /** 1-based ARIA level */
  level: number;
  /** 1-based position within parent */
  posinset: number;
  /** Total siblings at this level */
  setsize: number;
  expandedIds: Set<string>;
  selectedId?: string;
  focusedId: string | null;
  /** Whether this tree instance currently has DOM focus (controls outline visibility). */
  hasDOMFocus: boolean;
  onToggle: (id: string) => void;
  onSelect?: (id: string) => void;
  onFocus: (id: string) => void;
  nodeRefs: React.MutableRefObject<Map<string, HTMLLIElement>>;
}

function TreeNode({
  node,
  level,
  posinset,
  setsize,
  expandedIds,
  selectedId,
  focusedId,
  hasDOMFocus,
  onToggle,
  onSelect,
  onFocus,
  nodeRefs,
}: TreeNodeProps) {
  const hasChildren = !!(node.children && node.children.length > 0);
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const isFocused = focusedId === node.id;
  // Show focus ring only when this node is active AND the tree has real DOM focus.
  const showFocusRing = isFocused && hasDOMFocus;

  const refCallback = React.useCallback(
    (el: HTMLLIElement | null) => {
      if (el) {
        nodeRefs.current.set(node.id, el);
      } else {
        nodeRefs.current.delete(node.id);
      }
    },
    [node.id, nodeRefs]
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFocus(node.id);
    if (hasChildren) {
      onToggle(node.id);
    }
    onSelect?.(node.id);
  };

  return (
    <li
      ref={refCallback}
      role="treeitem"
      id={`treeitem-${node.id}`}
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={isSelected}
      aria-level={level}
      aria-setsize={setsize}
      aria-posinset={posinset}
      tabIndex={isFocused ? 0 : -1}
      onClick={handleClick}
    >
      <div
        className={cx('ld-tree-node', isSelected && 'ld-tree-node--selected', showFocusRing && 'ld-tree-node--focused')}
        style={{paddingLeft: `${(level - 1) * 1.5 + 0.5}rem`}}
      >
        <span className="ld-tree-node-toggle" aria-hidden="true">
          {hasChildren ? (
            <svg
              className={cx(
                'ld-tree-node-chevron',
                isExpanded && 'ld-tree-node-chevron--expanded'
              )}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M6 3l5 5-5 5z" />
            </svg>
          ) : (
            <span className="ld-tree-node-spacer" />
          )}
        </span>
        <span className="ld-tree-node-label">{node.label}</span>
      </div>
      {hasChildren && isExpanded && (
        <ul role="group" className="ld-tree-group">
          {node.children!.map((child, index) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              posinset={index + 1}
              setsize={node.children!.length}
              expandedIds={expandedIds}
              selectedId={selectedId}
              focusedId={focusedId}
              hasDOMFocus={hasDOMFocus}
              onToggle={onToggle}
              onSelect={onSelect}
              onFocus={onFocus}
              nodeRefs={nodeRefs}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

// ---------------------------------------------------------------------------
// Tree
// ---------------------------------------------------------------------------

export const Tree = React.forwardRef<HTMLDivElement, TreeProps>(
  (props, ref) => {
    const {
      a11yLabelledBy,
      className,
      data,
      defaultExpandedIds = [],
      label,
      onSelect,
      selectedId,
      ...rest
    } = applyCommonProps(props);

    const id = useStableId();

    invariant(
      !!(label || a11yLabelledBy),
      'Tree requires either a `label` or `a11yLabelledBy` prop for accessibility.'
    );

    const [expandedIds, setExpandedIds] = React.useState<Set<string>>(
      () => new Set(defaultExpandedIds)
    );

    // Roving tabindex: track which node is "active" (has tabIndex=0).
    // Initialise to the first root node if data is non-empty.
    const [focusedId, setFocusedId] = React.useState<string | null>(
      () => (data.length > 0 ? data[0].id : null)
    );

    // True when any treeitem inside this tree has real DOM focus.
    // Only when hasDOMFocus is true do we show the focus ring.
    const [hasDOMFocus, setHasDOMFocus] = React.useState(false);

    // Map from node id → <li> DOM element, populated by ref callbacks.
    const nodeRefs = React.useRef<Map<string, HTMLLIElement>>(new Map());

    const handleToggle = React.useCallback((nodeId: string) => {
      setExpandedIds(prev => {
        const next = new Set(prev);
        if (next.has(nodeId)) {
          next.delete(nodeId);
        } else {
          next.add(nodeId);
        }
        return next;
      });
    }, []);

    const handleNodeFocus = React.useCallback((nodeId: string) => {
      setFocusedId(nodeId);
    }, []);

    /**
     * Central keyboard handler attached to the <ul role="tree"> element.
     * Uses event.target to determine which treeitem currently has focus.
     */
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLUListElement>) => {
        // Find the focused treeitem from the event target chain.
        const target = (e.target as HTMLElement).closest('[role="treeitem"]') as HTMLLIElement | null;
        if (!target) return;

        const currentId = target.id.replace(/^treeitem-/, '');
        if (!currentId) return;

        // Build the flat visible list fresh on each keydown so it always
        // reflects the current expand/collapse state.
        // We capture expandedIds via the closure; this callback is recreated
        // whenever expandedIds changes (see deps below).
        const flat = getVisibleNodes(data, expandedIds);
        const currentIndex = flat.findIndex(n => n.id === currentId);
        if (currentIndex === -1) return;

        const current = flat[currentIndex];

        const moveFocusTo = (nodeId: string) => {
          setFocusedId(nodeId);
          // Call focus directly — tabIndex="-1" elements can still receive
          // programmatic focus, so we don't need to wait for re-render.
          nodeRefs.current.get(nodeId)?.focus();
        };

        switch (e.key) {
          case 'ArrowDown': {
            e.preventDefault();
            if (currentIndex < flat.length - 1) {
              moveFocusTo(flat[currentIndex + 1].id);
            }
            break;
          }
          case 'ArrowUp': {
            e.preventDefault();
            if (currentIndex > 0) {
              moveFocusTo(flat[currentIndex - 1].id);
            }
            break;
          }
          case 'ArrowRight': {
            e.preventDefault();
            if (current.hasChildren) {
              if (!expandedIds.has(currentId)) {
                // Collapsed branch — expand it.
                handleToggle(currentId);
              } else {
                // Expanded branch — move to first child.
                if (currentIndex < flat.length - 1) {
                  moveFocusTo(flat[currentIndex + 1].id);
                }
              }
            }
            // Leaf — no-op.
            break;
          }
          case 'ArrowLeft': {
            e.preventDefault();
            if (current.hasChildren && expandedIds.has(currentId)) {
              // Expanded branch — collapse it.
              handleToggle(currentId);
            } else if (current.parentId) {
              // Collapsed branch or leaf — move to parent.
              moveFocusTo(current.parentId);
            }
            // Root with no parent — no-op.
            break;
          }
          case 'Home': {
            e.preventDefault();
            if (flat.length > 0) {
              moveFocusTo(flat[0].id);
            }
            break;
          }
          case 'End': {
            e.preventDefault();
            if (flat.length > 0) {
              moveFocusTo(flat[flat.length - 1].id);
            }
            break;
          }
          case 'Enter': {
            e.preventDefault();
            // Select and toggle expand (if branch).
            if (current.hasChildren) {
              handleToggle(currentId);
            }
            onSelect?.(currentId);
            break;
          }
          case ' ': {
            e.preventDefault();
            // Select only — do not toggle.
            onSelect?.(currentId);
            break;
          }
          default: {
            // Printable character type-ahead.
            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
              const char = e.key.toLowerCase();
              // Search from the node after current, wrapping around.
              const afterCurrent = [
                ...flat.slice(currentIndex + 1),
                ...flat.slice(0, currentIndex),
              ];
              const match = afterCurrent.find(n =>
                n.label.toLowerCase().startsWith(char)
              );
              if (match) {
                moveFocusTo(match.id);
              }
            }
            break;
          }
        }
      },
      [data, expandedIds, handleToggle, onSelect]
    );

    const classes = cx('ld-tree', className);

    return (
      <div className={classes} ref={ref} {...rest}>
        {label && (
          <div className="ld-tree-label" id={`${id}-label`}>
            {label}
          </div>
        )}
        <ul
          role="tree"
          aria-labelledby={a11yLabelledBy || (label ? `${id}-label` : undefined)}
          className="ld-tree-root"
          onKeyDown={handleKeyDown}
          onFocus={() => setHasDOMFocus(true)}
          onBlur={(e) => {
            // Only clear when focus leaves the tree entirely (not moving between nodes).
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              setHasDOMFocus(false);
            }
          }}
        >
          {data.map((node, index) => (
            <TreeNode
              key={node.id}
              node={node}
              level={1}
              posinset={index + 1}
              setsize={data.length}
              expandedIds={expandedIds}
              selectedId={selectedId}
              focusedId={focusedId}
              hasDOMFocus={hasDOMFocus}
              onToggle={handleToggle}
              onSelect={onSelect}
              onFocus={handleNodeFocus}
              nodeRefs={nodeRefs}
            />
          ))}
        </ul>
      </div>
    );
  }
);

Tree.displayName = 'Tree';
