'use client';
// @refresh reset

/**
 * @module AgentFrameworkWorkspace
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
 * For prop API + usage notes, read `AgentFrameworkWorkspace.md` in this folder
 * or run `npm run ld-kit -- show AgentFrameworkWorkspace`.
 */

/**
 * AgentFrameworkWorkspace — an arrangeable group of {@link AgentFramework} cards.
 *
 * Renders one or more frameworks in a resizable group and, once two or more are
 * open, lets a person grab a framework anywhere and drop it on another's left /
 * right edge to lay them side by side, or its top / bottom to stack them. One
 * framework can be maximized to fill the group, and open / close are animated.
 *
 * The caller owns the `items` list (adding and closing); the workspace owns the
 * arrangement, the animations, and the drag interaction. It is props-first and
 * has no store dependency — pair it with `useFrameworkWorkspace` from
 * `AgentChatCore` if you want the list state managed for you.
 */

import * as React from 'react';

import {AgentFramework} from '../../components/AgentFramework';
import {Button} from '../../components/Button';
import {FloatingButton} from '../../components/FloatingButton';
import {Icon} from '../../components/Icons';
import {type PanelImperativeHandle, ResizableHandle, ResizablePanel, ResizablePanelGroup} from '../../components/Resizable';
import {Caption} from '../../components/Text/Text';

import './AgentFrameworkWorkspace.css';

/** Class that plays the framework slide-in animation. Exported so a surface that
 *  animates a framework card itself (e.g. a floating overlay host) uses the same
 *  motion as the workspace instead of re-deriving it. */
export const AGENT_FRAMEWORK_ENTER_CLASS = 'ld-frameworkworkspace-frameworkEnter';

/** Class that plays the framework slide-out animation. See {@link AGENT_FRAMEWORK_ENTER_CLASS}. */
export const AGENT_FRAMEWORK_EXIT_CLASS = 'ld-frameworkworkspace-frameworkExit';

/** Class applied to a container whose direct children should transition their
 *  `flex-grow` while a sibling framework opens or closes, so neighbours reflow
 *  smoothly instead of snapping. */
export const AGENT_FRAMEWORK_REFLOW_CLASS = 'ld-frameworkworkspace-reflow';

/** True when the user has asked for reduced motion. */
export function usePrefersReducedMotion(): boolean {
  return React.useMemo(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );
}

/**
 * Duration constants (ms) for the framework close and open animations. Both use
 * the `--ld-semantic-duration-slide-in` token (300ms) so close and open feel
 * symmetric. Kept in JS so state advancement (unmounting / unmounting the
 * framework) reliably follows the CSS animation — this is more robust than
 * `transitionend` / `animationend`, which are throttled when the tab is
 * backgrounded. A 40ms slack absorbs scheduler jitter. */
export const AGENT_FRAMEWORK_EXIT_MS = 300;

export const AGENT_FRAMEWORK_ENTER_MS = 340;

type DropZone = 'left' | 'right' | 'top' | 'bottom';

/** Which edge of a framework the pointer is closest to during a drag. */
function computeDropZone(e: React.DragEvent, el: HTMLElement): DropZone {
  const r = el.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width;
  const py = (e.clientY - r.top) / r.height;
  const dist: Record<DropZone, number> = {left: px, right: 1 - px, top: py, bottom: 1 - py};
  return (Object.keys(dist) as DropZone[]).reduce((a, b) => (dist[b] < dist[a] ? b : a), 'left');
}

/** A translucent brand overlay marking the half a drop will land in. */
function FrameworkDropIndicator({zone}: {zone: DropZone}) {
  const pos: React.CSSProperties =
    zone === 'left'
      ? {left: 0, top: 0, bottom: 0, width: '50%'}
      : zone === 'right'
      ? {right: 0, top: 0, bottom: 0, width: '50%'}
      : zone === 'top'
      ? {left: 0, right: 0, top: 0, height: '50%'}
      : {left: 0, right: 0, bottom: 0, height: '50%'};
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        ...pos,
        borderRadius: 'var(--ld-primitive-scale-borderRadius-100, 0.5rem)',
        background: 'var(--ld-semantic-color-fill-brand-subtle, #e9f1fe)',
        border: '2px dashed var(--ld-semantic-color-border-brand, #0053e2)',
        pointerEvents: 'none',
        zIndex: 3,
      }}
    />
  );
}

/** A single framework rendered inside a {@link AgentFrameworkWorkspace}. */
export interface AgentFrameworkItem {
  id: string;
  title: string;
  /** The scrollable framework body. */
  body: React.ReactNode;
  /** Optional header action cluster (e.g. an Edit button). */
  actions?: React.ReactNode;
  /** Optional action footer. */
  footer?: React.ReactNode;
}

/**
 * The shared multi-framework workspace. Renders one or more {@link AgentFramework}
 * cards in a resizable group and, when 2+ are open, lets you grab a framework
 * anywhere and drop it onto the left/right of another to lay them side by side,
 * or onto the top/bottom to stack them — plus maximize one to fill the group.
 *
 * It's the engine behind the standalone workspace demo and the framework region of
 * the Chat Side Panel, Focus Chat, and Chat Overlay experiences. The parent owns
 * the `items` list (add / close); the workspace owns the arrangement.
 */
export function AgentFrameworkWorkspace({
  items,
  onReorder,
  activeId,
  onActiveChange,
  onClose,
  onAdd,
  maxItems = 4,
  /** Allow closing the final framework (hands the area back to the caller). */
  allowCloseLast = false,
  /** Wrap the group in the padded grey showcase box (standalone demo). When
   *  false the group fills its host panel (chat experiences). */
  framed = false,
  caption,
  /** Inset padding (px) applied around each framework panel. Defaults to 6.
   *  Pass 0 for overlay/floating-card contexts where the outer card already
   *  provides shape and spacing. */
  panelPadding = 6,
  /** Skip the built-in slide-right + fade exit animation. Use this in the
   *  overlay/floating-card contexts where the OUTER wrapper handles the exit
   *  animation, so we don't double-translate the framework. */
  disableCloseAnimation = false,
  /** Fired synchronously when a framework close animation begins. The chat
   *  surface uses this to run its own outer-panel width transition in
   *  parallel so the chat pane grows to fill as the framework slides out. */
  onExitStart,
  /** Stack the second framework below the first (column layout) the moment it
   *  opens, instead of the default side-by-side. Fires once, only at the 1→2
   *  transition — the layout stays rearrangeable by drag and 3rd+ frameworks are
   *  not forced. Used by the Chat Side Panel. */
  stackSecondFramework = false,
  /** When true, stacked frameworks (column direction, 2+ items, not maximized)
   *  are laid out as a simple flex column with a 16px gap instead of a
   *  ResizablePanelGroup. Used by overlay-mode instances so each inner card
   *  keeps its own rounded corners and shadow with visible separation. */
  gapStack = false,
  /** Whether the overlay is currently in expanded (wide) mode. When true with
   *  multiple frameworks, the workspace renders a carousel — one card at a time
   *  with left/right chevron navigation. The expand button on every card shows
   *  the Minimize icon and calls `onExpand` to toggle back. */
  overlayExpanded = false,
  /** Called when the expand / collapse button on any framework is clicked.
   *  When provided, overrides the built-in per-framework maximize toggle and
   *  delegates expand-state ownership to the parent surface. */
  onExpand,
}: {
  items: AgentFrameworkItem[];
  onReorder: (next: AgentFrameworkItem[]) => void;
  activeId: string | null;
  onActiveChange: (id: string) => void;
  onClose?: (id: string) => void;
  onAdd?: () => void;
  maxItems?: number;
  allowCloseLast?: boolean;
  framed?: boolean;
  caption?: React.ReactNode;
  panelPadding?: number;
  disableCloseAnimation?: boolean;
  onExitStart?: (id: string) => void;
  stackSecondFramework?: boolean;
  gapStack?: boolean;
  overlayExpanded?: boolean;
  onExpand?: () => void;
}) {
  // Start stacked (column) when we mount already holding 2+ frameworks — covers
  // the Chat Side Panel's overlay instance, which mounts fresh when the panel
  // narrows and would otherwise miss the live 1→2 transition below.
  const [direction, setDirection] = React.useState<'row' | 'column'>(
    () => (stackSecondFramework && items.length >= 2 ? 'column' : 'row'),
  );
  const [maximized, setMaximized] = React.useState<string | null>(null);
  // Stack the second framework below the first (column) once, at the 1→2
  // transition, when `stackSecondFramework` is set. useLayoutEffect flips the
  // direction before paint so the 2nd framework never flashes side-by-side first.
  // Rearrangeable afterward via drag; 3rd+ opens are not forced.
  const prevItemsLenRef = React.useRef(items.length);
  React.useLayoutEffect(() => {
    const prev = prevItemsLenRef.current;
    prevItemsLenRef.current = items.length;
    if (stackSecondFramework && prev === 1 && items.length === 2) {
      setDirection('column');
    }
  }, [items.length, stackSecondFramework]);
  const dragId = React.useRef<string | null>(null);
  const [draggingId, setDraggingId] = React.useState<string | null>(null);
  const [hint, setHint] = React.useState<{id: string; zone: DropZone} | null>(null);

  // ── Close animation state ──────────────────────────────────────────────
  // While `exitingId` is set, the corresponding framework plays a slide-right +
  // fade CSS transition (see `.ld-frameworkworkspace-frameworkExit`) before it is actually removed
  // from `items`. `panelRefsRef` gives us the imperative handle needed to
  // shrink the panel's flex-grow to 0 in parallel so sibling panels reflow
  // smoothly instead of snapping when the item unmounts.
  const [exitingId, setExitingId] = React.useState<string | null>(null);
  // ── Open animation state ───────────────────────────────────────────────
  // While `enteringId` is set, the corresponding framework plays a slide-in
  // CSS keyframe animation (`.ld-frameworkworkspace-frameworkEnter`) and its siblings' flex-grows
  // transition to give it space (`.ld-frameworkworkspace-reflow` on the wrapper).
  const [enteringId, setEnteringId] = React.useState<string | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const panelRefsRef = React.useRef<Map<string, PanelImperativeHandle | null>>(new Map());
  const exitTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const enterTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // Tracks the set of IDs from the previous render to detect newly added items.
  const prevItemIdsRef = React.useRef<Set<string>>(new Set(items.map((c) => c.id)));
  // Incremented on drag-reorder AND on framework close so the ResizablePanelGroup
  // remounts, resetting the surviving panels' sizes to equal fractions. Without
  // the remount on close, the library's persisted per-panel sizes leave a
  // survivor collapsed. Adds do NOT bump — they animate in via `enteringId`.
  const remountVersionRef = React.useRef(0);

  React.useEffect(() => () => {
    if (exitTimerRef.current !== undefined) clearTimeout(exitTimerRef.current);
    if (enterTimerRef.current !== undefined) clearTimeout(enterTimerRef.current);
  }, []);

  // Detect newly added items and start the enter animation.
  React.useEffect(() => {
    const prevIds = prevItemIdsRef.current;
    const newItem = items.find((c) => !prevIds.has(c.id));
    prevItemIdsRef.current = new Set(items.map((c) => c.id));
    if (!newItem || disableCloseAnimation) return;
    if (reducedMotion) return; // Skip animation; CSS `animation: none` already handles it
    setEnteringId(newItem.id);
    if (enterTimerRef.current !== undefined) clearTimeout(enterTimerRef.current);
    enterTimerRef.current = setTimeout(() => {
      setEnteringId(null);
      enterTimerRef.current = undefined;
    }, AGENT_FRAMEWORK_ENTER_MS);
  // Run whenever `items` identity changes; disableCloseAnimation and
  // reducedMotion are stable across the relevant renders.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // Drop the maximize if its framework goes away.
  React.useEffect(() => {
    if (maximized && !items.some((c) => c.id === maximized)) setMaximized(null);
  }, [items, maximized]);

  /** Drop `dragId` relative to `targetId` — the zone sets the order and whether
   *  the workspace lays out as a row (side by side) or column (stacked). */
  const place = (targetId: string, zone: DropZone) => {
    const from = dragId.current;
    dragId.current = null;
    setDraggingId(null);
    setHint(null);
    if (!from || from === targetId) return;
    setDirection(zone === 'left' || zone === 'right' ? 'row' : 'column');
    const moved = items.find((c) => c.id === from);
    if (!moved) return;
    const rest = items.filter((c) => c.id !== from);
    const ti = rest.findIndex((c) => c.id === targetId);
    const at = zone === 'right' || zone === 'bottom' ? ti + 1 : ti;
    rest.splice(at, 0, moved);
    // Bump the version so the ResizablePanelGroup remounts on reorder (resetting
    // panel sizes to equal fractions for the new arrangement). Adds do NOT bump
    // this version — those animate in via `enteringId`.
    remountVersionRef.current += 1;
    onReorder(rest);
  };

  const visible = maximized ? items.filter((c) => c.id === maximized) : items;
  // Carousel: one card at a time with prev/next navigation when the overlay is
  // expanded and multiple frameworks are open.
  const useCarousel = overlayExpanded && visible.length > 1;
  // Gap-stack: simple 50/50 flex column with 16px gap when stacking 2+ frameworks
  // in overlay mode (column direction, not maximized, not carousel).
  const useGapStack = gapStack && direction === 'column' && visible.length > 1 && !maximized && !useCarousel;
  // Drag-drop rearrangement is only meaningful in the resizable-panel group.
  const canArrange = !maximized && visible.length > 1 && !useCarousel && !useGapStack;
  const closable = (id: string) => {
    if (!onClose || (items.length <= 1 && !allowCloseLast)) return undefined;
    return () => {
      // Skip the animation if the caller opts out (e.g. the floating overlay
      // wrapper animates the whole card itself) or if the user prefers reduced
      // motion beyond the brief opacity fade our CSS already provides.
      if (disableCloseAnimation) {
        // Bump the remount version so surviving panels reset to equal fractions.
        remountVersionRef.current += 1;
        onClose(id);
        return;
      }
      if (visible.length > 1) {
        // Survivors remain: animate only the exiting inner panel to 0 so the
        // surviving framework(es) reflow to fill the freed space. Do NOT notify the
        // surface to collapse the outer dock — the dock stays open, so
        // `onExitStart` (which collapses the whole framework panel) must not fire.
        const handle = panelRefsRef.current.get(id);
        handle?.resize(0);
      } else {
        // Last framework: notify the surface so it can collapse the outer dock and
        // let the chat pane grow to fill (runs in parallel with this exit).
        onExitStart?.(id);
      }
      setExitingId(id);
      if (exitTimerRef.current !== undefined) clearTimeout(exitTimerRef.current);
      exitTimerRef.current = setTimeout(() => {
        exitTimerRef.current = undefined;
        setExitingId((current) => (current === id ? null : current));
        panelRefsRef.current.delete(id);
        // Remount the group so the surviving panels reset to equal fractions —
        // their persisted sizes would otherwise leave a survivor collapsed.
        remountVersionRef.current += 1;
        onClose(id);
      }, AGENT_FRAMEWORK_EXIT_MS);
    };
  };

  const group = (
    <ResizablePanelGroup
      // Remount on drag-reorder / framework-close (remountVersionRef bump) or
      // direction change so panel sizes reset to equal fractions. Adds keep the
      // group alive so the enter animation runs smoothly.
      key={`${remountVersionRef.current}-${direction}`}
      direction={direction === 'row' ? 'horizontal' : 'vertical'}
    >
      {visible.map((c, i) => (
        <React.Fragment key={c.id}>
          {i > 0 ? (
            <ResizableHandle />
          ) : null}
          <ResizablePanel
            defaultSize={framed && items.length === 1 ? 70 : 100 / visible.length}
            minSize={18}
            panelRef={(handle) => {
              // Track panel handles by id so the close intercept can call
              // `resize(0)` on the specific exiting panel.
              if (handle) panelRefsRef.current.set(c.id, handle);
              else panelRefsRef.current.delete(c.id);
            }}
          >
            <div
              style={{height: '100%', padding: panelPadding, boxSizing: 'border-box', position: 'relative'}}
              // Clip the entering framework so it doesn't bleed over adjacent panels
              // during the translateX keyframe animation. Removed after the timer clears.
              className={enteringId === c.id ? 'ld-frameworkworkspace-enterHost' : undefined}
              onDragOver={
                canArrange
                  ? (e) => {
                      e.preventDefault();
                      if (dragId.current && dragId.current !== c.id) {
                        setHint({id: c.id, zone: computeDropZone(e, e.currentTarget)});
                      }
                    }
                  : undefined
              }
              onDragLeave={(e) => {
                if (e.currentTarget === e.target) setHint((h) => (h?.id === c.id ? null : h));
              }}
              onDrop={
                canArrange
                  ? (e) => {
                      e.preventDefault();
                      place(c.id, computeDropZone(e, e.currentTarget));
                    }
                  : undefined
              }
            >
              <AgentFramework
                title={c.title}
                titleAs="h3"
                titleVariant="body"
                titleSize="large"
                a11yLabel={`${c.title}, framework ${i + 1} of ${visible.length}`}
                closeLabel={`Close ${c.title}`}
                linked={activeId === c.id && items.length > 1}
                onClick={() => onActiveChange(c.id)}
                onClose={closable(c.id)}
                expanded={onExpand ? overlayExpanded : maximized === c.id}
                onToggleExpand={
                  onExpand
                    ? onExpand
                    : items.length > 1
                      ? () => setMaximized((m) => (m === c.id ? null : c.id))
                      : undefined
                }
                actions={c.actions}
                footer={c.footer}
                // Grab the whole card (not just the header) to move it — only
                // meaningful once there's a second framework to arrange against.
                draggable={canArrange}
                UNSAFE_className={`ld-agentframework--grabbable${
                  draggingId === c.id ? ' ld-agentframework--dragging' : ''
                }${exitingId === c.id ? ' ld-frameworkworkspace-frameworkExit' : ''
                }${enteringId === c.id ? ' ld-frameworkworkspace-frameworkEnter' : ''}`}
                onDragStart={
                  canArrange
                    ? (e) => {
                        if (
                          (e.target as HTMLElement).closest(
                            'button, a, input, textarea, select, [contenteditable="true"]',
                          )
                        ) {
                          e.preventDefault();
                          return;
                        }
                        dragId.current = c.id;
                        setDraggingId(c.id);
                        // setData is required for the drag to start in some browsers.
                        e.dataTransfer.setData('text/plain', c.id);
                        e.dataTransfer.effectAllowed = 'move';
                      }
                    : undefined
                }
                onDragEnd={() => {
                  dragId.current = null;
                  setDraggingId(null);
                  setHint(null);
                }}
              >
                {c.body}
              </AgentFramework>
              {hint?.id === c.id ? <FrameworkDropIndicator zone={hint.zone} /> : null}
            </div>
          </ResizablePanel>
        </React.Fragment>
      ))}
      {framed && items.length === 1 ? (
        <>
          <ResizableHandle />
          <ResizablePanel defaultSize={30} minSize={10}>
            <div style={{height: '100%'}} />
          </ResizablePanel>
        </>
      ) : null}
    </ResizablePanelGroup>
  );

  // ── Carousel content ─────────────────────────────────────────────────────
  // Shown when overlayExpanded and 2+ frameworks are open. One card at a time,
  // navigable with left/right chevron buttons overlaid on the card edges.
  const carouselContent = useCarousel ? (() => {
    const currentIndex = visible.findIndex((c) => c.id === activeId);
    const idx = currentIndex < 0 ? 0 : currentIndex;
    const card = visible[idx];
    if (!card) return null;
    const goPrev = () => onActiveChange(visible[(idx - 1 + visible.length) % visible.length].id);
    const goNext = () => onActiveChange(visible[(idx + 1) % visible.length].id);
    return (
      <div
        style={{position: 'relative', height: '100%', outline: 'none'}}
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
          else if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
        }}
      >
        <AgentFramework
          title={card.title}
          titleAs="h3"
          titleVariant="body"
          titleSize="large"
          a11yLabel={`${card.title}, framework ${idx + 1} of ${visible.length}`}
          closeLabel={`Close ${card.title}`}
          linked={activeId === card.id && items.length > 1}
          onClick={() => onActiveChange(card.id)}
          onClose={closable(card.id)}
          expanded={true}
          onToggleExpand={onExpand}
          actions={card.actions}
          footer={card.footer}
          UNSAFE_className={exitingId === card.id ? 'ld-frameworkworkspace-frameworkExit' : enteringId === card.id ? 'ld-frameworkworkspace-frameworkEnter' : undefined}
        >
          {card.body}
        </AgentFramework>
        {/* Left chevron */}
        <div style={{position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', zIndex: 2}}>
          <FloatingButton
            aria-label={`Previous: ${visible[(idx - 1 + visible.length) % visible.length].title}`}
            onClick={goPrev}
          >
            <Icon name="ArrowLeft" decorative />
          </FloatingButton>
        </div>
        {/* Right chevron */}
        <div style={{position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', zIndex: 2}}>
          <FloatingButton
            aria-label={`Next: ${visible[(idx + 1) % visible.length].title}`}
            onClick={goNext}
          >
            <Icon name="ArrowRight" decorative />
          </FloatingButton>
        </div>
      </div>
    );
  })() : null;

  // ── Gap-stack content ─────────────────────────────────────────────────────
  // Shown when gapStack is true, direction is column, and 2+ frameworks are
  // stacked in overlay mode. Simple flex column with 16px gap — no resize
  // handle — so each card keeps its own visual identity.
  const gapStackContent = useGapStack ? (
    <div style={{display: 'flex', flexDirection: 'column', gap: 16, height: '100%'}}>
      {visible.map((c, i) => (
        <div key={c.id} style={{flex: '1 1 0', minHeight: 0, position: 'relative'}}>
          <AgentFramework
            title={c.title}
            titleAs="h3"
            titleVariant="body"
            titleSize="large"
            a11yLabel={`${c.title}, framework ${i + 1} of ${visible.length}`}
            closeLabel={`Close ${c.title}`}
            linked={activeId === c.id && items.length > 1}
            onClick={() => onActiveChange(c.id)}
            onClose={closable(c.id)}
            expanded={false}
            onToggleExpand={onExpand}
            actions={c.actions}
            footer={c.footer}
            UNSAFE_className={exitingId === c.id ? 'ld-frameworkworkspace-frameworkExit' : enteringId === c.id ? 'ld-frameworkworkspace-frameworkEnter' : undefined}
          >
            {c.body}
          </AgentFramework>
        </div>
      ))}
    </div>
  ) : null;

  const content = useCarousel ? carouselContent : useGapStack ? gapStackContent : group;

  const toolbar =
    onAdd || maximized ? (
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center'}}>
        {onAdd ? (
          <Button
            variant="secondary"
            size="small"
            onClick={onAdd}
            disabled={items.length >= maxItems}
          >
            + Add framework
          </Button>
        ) : null}
        {maximized ? (
          <Button variant="tertiary" size="small" onClick={() => setMaximized(null)}>
            Restore all
          </Button>
        ) : null}
      </div>
    ) : null;

  if (framed) {
    return (
      <div style={{display: 'grid', gap: 12}}>
        {toolbar}
        <div
          className={exitingId ? 'ld-frameworkworkspace-reflow' : enteringId ? 'ld-frameworkworkspace-reflow' : undefined}
          style={{
            height: 560,
            borderRadius: 'var(--ld-primitive-scale-borderRadius-200, 1rem)',
            background: 'var(--ld-semantic-color-loading-subtle, #f5f5f6)',
            padding: 12,
            boxSizing: 'border-box',
          }}
        >
          {content}
        </div>
        {caption ? <Caption color="subtle">{caption}</Caption> : null}
      </div>
    );
  }

  return (
    <div
      className={exitingId ? 'ld-frameworkworkspace-reflow' : enteringId ? 'ld-frameworkworkspace-reflow' : undefined}
      style={{display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, minWidth: 0}}
    >
      {toolbar ? <div style={{padding: '8px 8px 0'}}>{toolbar}</div> : null}
      <div style={{flex: 1, minHeight: 0, minWidth: 0}}>{content}</div>
    </div>
  );
}

AgentFrameworkWorkspace.displayName = 'AgentFrameworkWorkspace';
