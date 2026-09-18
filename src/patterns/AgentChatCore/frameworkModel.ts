/**
 * MODEL — the open-framework list beside an agent chat.
 *
 * Pure TypeScript: no React, no DOM, no store. Generic over the item type so
 * the model never needs to know what a framework renders — `AgentFrameworkWorkspace`
 * owns the view and its `WorkspaceFramework` shape satisfies `FrameworkLike`.
 *
 * This replaces the add / close / focus / sequence logic that each chat surface
 * used to re-implement (and drift on) by hand.
 */

/** The only thing the model needs from a framework: a stable identity. */
export interface FrameworkLike {
  id: string;
}

export interface FrameworkState<T extends FrameworkLike> {
  items: T[];
  /** The framework the current chat turn refers to — drives the linked accent. */
  activeId: string | null;
  /** Monotonic counter backing generated framework ids. */
  seq: number;
}

export function initialFrameworkState<T extends FrameworkLike>(items: T[] = []): FrameworkState<T> {
  return {items, activeId: items[0]?.id ?? null, seq: items.length};
}

export type FrameworkEvent<T extends FrameworkLike> =
  /** Append a framework built from the next sequence number. Ignored at `max`. */
  | {type: 'open'; create: (seq: number) => T; max: number}
  /** Remove a framework. Focus falls to the first survivor. */
  | {type: 'close'; id: string}
  /** Mark a framework as the active reference for the current turn. */
  | {type: 'focus'; id: string}
  /** Replace the list wholesale — used by drag-reorder in the workspace view. */
  | {type: 'reorder'; items: T[]}
  /** Close everything. */
  | {type: 'clear'};

export function frameworkReducer<T extends FrameworkLike>(
  state: FrameworkState<T>,
  event: FrameworkEvent<T>,
): FrameworkState<T> {
  switch (event.type) {
    case 'open': {
      if (state.items.length >= event.max) return state;
      const seq = state.seq + 1;
      const next = event.create(seq);
      return {items: [...state.items, next], activeId: next.id, seq};
    }

    case 'close': {
      const items = state.items.filter((c) => c.id !== event.id);
      if (items.length === state.items.length) return state;
      return {
        ...state,
        items,
        // Keep focus where it was unless the focused framework is the one closing.
        activeId: state.activeId === event.id ? items[0]?.id ?? null : state.activeId,
      };
    }

    case 'focus':
      return state.activeId === event.id ? state : {...state, activeId: event.id};

    case 'reorder':
      return {...state, items: event.items};

    case 'clear':
      return state.items.length === 0 ? state : {...state, items: [], activeId: null};

    default:
      return state;
  }
}
