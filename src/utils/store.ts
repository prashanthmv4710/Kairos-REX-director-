import * as React from 'react';

/**
 * ld-kit store — a small reactive state layer used for cross-component
 * communication in the vibe-coding scaffold. Two logical layers live here:
 *
 *   1. Generic core — a framework-agnostic pub/sub event bus + an in-memory
 *      key-value store with optional localStorage persistence and React hooks
 *      (`on`/`emit`, `getStoreValue`/`setStoreValue`, `useStore`/`useEvent`).
 *      No product/commerce knowledge. Use this alone for plain messaging.
 *
 *   2. Commerce adapters — optional cart/favorites/product state built on the
 *      core (`addToCart`, `useItems`, `useHeaderCartBindings`,
 *      `useStoreConnectedItemBindings`) plus `useInitializeStore()`, which
 *      installs the `window.ldKit` global.
 *
 * Library components and patterns are props-first and do NOT require either
 * layer. The `@walmart/ld-kit/store` entry re-exports everything here; the
 * scaffold wires the commerce layer for drop-in product/cart/header sync.
 */

// ── Event Bus ──────────────────────────────────────────────────────

type EventHandler = (payload: any) => void;
const _listeners: Record<string, Set<EventHandler>> = {};

const GENLD_EVENT = 'ld-kit-event';
const UI_LAST_EVENT_KEY_PREFIX = 'ui:last:';
const SEARCH_QUERY_KEY = 'ui:search:query';
const HEADER_FULFILLMENT_KEY = 'ui:header:fulfillment';

export type UiEventSnapshot<TPayload = any> = {
  topic: string;
  payload: TPayload;
  at: number;
};

/** Subscribe to a topic. Returns an unsubscribe function. */
export function on(topic: string, handler: EventHandler): () => void {
  if (!_listeners[topic]) _listeners[topic] = new Set();
  _listeners[topic].add(handler);
  return () => {
    _listeners[topic]?.delete(handler);
  };
}

/**
 * Depth of the currently-executing `emit()` calls, not a boolean.
 *
 * `emit` delivers twice: once in-memory to `on()` subscribers, then once as a
 * DOM CustomEvent so listeners outside this module's instance still hear it.
 * Anything listening on BOTH paths (see `useEvent`) must ignore the DOM leg of
 * an emit we just made, or it handles the same event twice.
 *
 * This has to be a counter. A subscriber is allowed to `emit()` from inside its
 * handler ("message sent" → "open a canvas"); with a boolean, that inner call's
 * `finally` cleared the flag while the OUTER emit was still mid-flight, so the
 * outer `dispatchEvent` below looked like an external dispatch and every
 * `useEvent` subscriber fired a second time. Incrementing and decrementing
 * keeps the flag true until the outermost emit has fully unwound.
 */
let _emitDepth = 0;

/**
 * True while this module is delivering an `emit()`.
 *
 * Consumers that attach a raw `window.addEventListener('ld-kit-event', …)`
 * alongside an `on()` subscription need this guard for the same reason
 * `useEvent` does — without it they double-handle every local emit.
 */
export function isEmitting(): boolean {
  return _emitDepth > 0;
}

/** Emit to all subscribers of a topic. */
export function emit(topic: string, payload?: any): void {
  _emitDepth++;
  try {
    _listeners[topic]?.forEach((fn) => fn(payload));
    window.dispatchEvent(
      new CustomEvent(GENLD_EVENT, {detail: {topic, payload}}),
    );
  } finally {
    _emitDepth--;
  }
}

// ── Key-Value Store ────────────────────────────────────────────────

const STORE_KEY_PREFIX = 'ld-kit-store:';
const _store: Record<string, any> = {};

/** Get a value from the store. */
export function getStoreValue<T = any>(key: string): T | undefined {
  return _store[key];
}

/** Set a value in the store. Notifies all subscribers and optionally persists. */
export function setStoreValue<T = any>(
  key: string,
  value: T,
  options?: {persist?: boolean},
): void {
  const prev = _store[key];
  _store[key] = value;
  if (options?.persist) {
    try {
      localStorage.setItem(STORE_KEY_PREFIX + key, JSON.stringify(value));
    } catch {
      /* Ignore storage failures. */
    }
  }
  emit(`store:${key}`, {key, value, prev});
}

function uiEventSnapshotKey(topic: string): string {
  return `${UI_LAST_EVENT_KEY_PREFIX}${topic}`;
}

/** Store and broadcast the latest payload for a UI topic. */
export function setLastUiEvent<TPayload = any>(topic: string, payload: TPayload): void {
  setStoreValue<UiEventSnapshot<TPayload>>(uiEventSnapshotKey(topic), {
    topic,
    payload,
    at: Date.now(),
  });
}

/** Read the latest payload for a UI topic. */
export function getLastUiEvent<TPayload = any>(
  topic: string,
): UiEventSnapshot<TPayload> | undefined {
  return getStoreValue<UiEventSnapshot<TPayload>>(uiEventSnapshotKey(topic));
}

/** Load a persisted value from localStorage into the store. */
export function hydrateStoreValue<T = any>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORE_KEY_PREFIX + key);
    if (raw !== null) {
      _store[key] = JSON.parse(raw);
      return _store[key];
    }
  } catch {
    /* Corrupt or unavailable. */
  }
  _store[key] = fallback;
  return fallback;
}

// ── React Hooks (generic) ──────────────────────────────────────────

/**
 * Subscribe to a pub/sub topic. Fires handler on every emit.
 * Uses in-memory listener for same-tree events; CustomEvent listener
 * only fires for cross-tree / external dispatches (skipped when our
 * own emit() already handled it via the in-memory path).
 */
export function useEvent(topic: string, handler: EventHandler): void {
  const ref = React.useRef(handler);
  ref.current = handler;
  React.useEffect(() => {
    const fn = (p: any) => ref.current(p);
    const unsub = on(topic, fn);
    // Only listen to CustomEvent for cross-tree sources (external dispatchEvent
    // calls that bypass our emit()). Our emit() bumps the depth so we can skip.
    const dom = (e: Event) => {
      if (isEmitting()) return; // already handled by in-memory on()
      const d = (e as CustomEvent).detail;
      if (d?.topic === topic) fn(d.payload);
    };
    window.addEventListener(GENLD_EVENT, dom);
    return () => {
      unsub();
      window.removeEventListener(GENLD_EVENT, dom);
    };
  }, [topic]);
}

/** Subscribe to a store key. Re-renders on change. */
export function useStore<T = any>(key: string, fallback?: T): T {
  const [value, setValue] = React.useState<T>(
    () => getStoreValue<T>(key) ?? (fallback as T),
  );
  React.useEffect(() => {
    const current = getStoreValue<T>(key);
    if (current !== undefined && current !== value) setValue(current);
    return on(`store:${key}`, (detail) => setValue(detail.value));
  }, [key]);
  return value;
}

/** React hook for latest UI payload snapshots (ui:* topics). */
export function useLastUiEvent<TPayload = any>(
  topic: string,
): UiEventSnapshot<TPayload> | undefined {
  return useStore<UiEventSnapshot<TPayload> | undefined>(uiEventSnapshotKey(topic));
}

/** Shared search query synchronized from ui:header:search-submit events. */
export function useSharedSearchQuery(): string {
  return useStore<string>(SEARCH_QUERY_KEY, '');
}

/** Shared fulfillment selection synchronized from ui:header:fulfillment events. */
export function useSharedFulfillment(): string {
  return useStore<string>(HEADER_FULFILLMENT_KEY, 'none');
}

// ── Items Store (commerce: unified item state keyed by SKU) ────────

const ITEMS_KEY = 'items';

export type ItemRecord = {
  sku: string;
  name: string;
  priceCents: number;
  hearted: boolean;
  cartQty: number;
};
export type ItemsState = Record<string, ItemRecord>;
export type CartSummary = {totalQty: number; subtotalCents: number; lineCount: number};
export type HeaderCartBindings = {
  cartCount: number;
  cartPrice: string;
  cartSummary: CartSummary;
};
export type StoreItemIdentity = {
  sku: string;
  name: string;
  priceCents: number;
};
export type StoreConnectedItemBindings = {
  hearted: boolean;
  cartQty: number;
  onHeartChange: (hearted: boolean) => void;
  onCartQtyChange: (qty: number) => void;
  onAddToCart: () => void;
};

function emptyItems(): ItemsState {
  return {};
}

function getItemsState(): ItemsState {
  return getStoreValue<ItemsState>(ITEMS_KEY) ?? emptyItems();
}

function setItemsState(next: ItemsState): void {
  setStoreValue(ITEMS_KEY, next, {persist: true});
}

function deriveCartSummary(items: ItemsState): CartSummary {
  let totalQty = 0;
  let subtotalCents = 0;
  let lineCount = 0;
  for (const rec of Object.values(items)) {
    if (rec.cartQty > 0) {
      totalQty += rec.cartQty;
      subtotalCents += rec.cartQty * rec.priceCents;
      lineCount++;
    }
  }
  return {totalQty, subtotalCents, lineCount};
}

/** Ensure an item record exists, creating it if needed. */
function ensureItem(items: ItemsState, sku: string, name: string, priceCents: number): ItemRecord {
  return items[sku] ?? {sku, name, priceCents, hearted: false, cartQty: 0};
}

// ── Heart functions ───────────────────────────────────────────────

export function heartItem(sku: string, name: string, priceCents: number): void {
  const items = getItemsState();
  const rec = ensureItem(items, sku, name, priceCents);
  setItemsState({...items, [sku]: {...rec, hearted: true}});
}

export function unheartItem(sku: string): void {
  const items = getItemsState();
  const rec = items[sku];
  if (!rec) return;
  const updated = {...rec, hearted: false};
  // Remove record entirely if no cart qty and not hearted
  if (updated.cartQty <= 0) {
    const next = {...items};
    delete next[sku];
    setItemsState(next);
  } else {
    setItemsState({...items, [sku]: updated});
  }
}

// ── Cart functions (derived from items) ───────────────────────────

export function addToCart(sku: string, name: string, priceCents: number, qty?: number): void {
  const items = getItemsState();
  const rec = ensureItem(items, sku, name, priceCents);
  const addQty = Math.max(1, qty ?? 1);
  setItemsState({...items, [sku]: {...rec, cartQty: rec.cartQty + addQty}});
}

/** Set exact cart quantity. Use with controlled QuantityStepper. */
export function setCartQty(sku: string, name: string, priceCents: number, qty: number): void {
  const items = getItemsState();
  if (qty <= 0) {
    // Remove or keep if hearted
    const rec = items[sku];
    if (!rec) return;
    if (rec.hearted) {
      setItemsState({...items, [sku]: {...rec, cartQty: 0}});
    } else {
      const next = {...items};
      delete next[sku];
      setItemsState(next);
    }
    return;
  }
  const rec = ensureItem(items, sku, name, priceCents);
  setItemsState({...items, [sku]: {...rec, cartQty: qty}});
}

export function removeFromCart(sku: string): void {
  const items = getItemsState();
  const rec = items[sku];
  if (!rec) return;
  const updated = {...rec, cartQty: 0};
  // Remove record entirely if not hearted either
  if (!updated.hearted) {
    const next = {...items};
    delete next[sku];
    setItemsState(next);
  } else {
    setItemsState({...items, [sku]: updated});
  }
}

export function clearCart(): void {
  const items = getItemsState();
  const next: ItemsState = {};
  for (const [sku, rec] of Object.entries(items)) {
    if (rec.hearted) {
      next[sku] = {...rec, cartQty: 0};
    }
  }
  setItemsState(next);
}

/** React hook for a single item's state. */
export function useItemState(sku: string): ItemRecord | null {
  const items = useStore<ItemsState>(ITEMS_KEY, emptyItems());
  return items[sku] ?? null;
}

/** React hook for the full items store. Returns items map, favorites, and cart summary. */
export function useItems() {
  const items = useStore<ItemsState>(ITEMS_KEY, emptyItems());
  return React.useMemo(() => {
    const all = Object.values(items);
    return {
      items,
      favorites: all.filter((r) => r.hearted),
      cartLines: all.filter((r) => r.cartQty > 0),
      summary: deriveCartSummary(items),
      heartItem,
      unheartItem,
      addToCart,
      setCartQty,
      removeFromCart,
      clearCart,
    };
  }, [items]);
}

/** React hook for cart state. Same return shape as before — derived from items store. */
export function useCart() {
  const items = useStore<ItemsState>(ITEMS_KEY, emptyItems());
  return React.useMemo(() => {
    // Build a cart-compatible state view for backwards compat
    const cartItems: Record<string, {sku: string; name: string; priceCents: number; qty: number}> = {};
    for (const rec of Object.values(items)) {
      if (rec.cartQty > 0) {
        cartItems[rec.sku] = {sku: rec.sku, name: rec.name, priceCents: rec.priceCents, qty: rec.cartQty};
      }
    }
    return {
      state: {items: cartItems},
      summary: deriveCartSummary(items),
      addItem: (item: {sku: string; name: string; priceCents: number; qty?: number}) =>
        addToCart(item.sku, item.name, item.priceCents, item.qty),
      remove: removeFromCart,
      clear: clearCart,
    };
  }, [items]);
}

function formatUsdFromCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Header adapter: returns drop-in props for desktop/mobile headers.
 * Lets pages mount headers without re-implementing cart formatting.
 */
export function useHeaderCartBindings(): HeaderCartBindings {
  const cart = useCart();
  return React.useMemo(
    () => ({
      cartCount: cart.summary.totalQty,
      cartPrice: formatUsdFromCents(cart.summary.subtotalCents),
      cartSummary: cart.summary,
    }),
    [cart.summary],
  );
}

/**
 * Product adapter factory for tiles/cards.
 * Produces ready-to-spread bindings from SKU/name/price identity.
 */
export function useStoreConnectedItemBindings(): (
  item: StoreItemIdentity,
) => StoreConnectedItemBindings {
  const {
    items,
    heartItem: heart,
    unheartItem: unheart,
    setCartQty: setQty,
    addToCart: add,
  } = useItems();

  return React.useCallback(
    ({sku, name, priceCents}: StoreItemIdentity) => {
      const record = items[sku];
      return {
        hearted: record?.hearted ?? false,
        cartQty: record?.cartQty ?? 0,
        onHeartChange: (hearted: boolean) =>
          hearted ? heart(sku, name, priceCents) : unheart(sku),
        onCartQtyChange: (qty: number) => setQty(sku, name, priceCents, qty),
        onAddToCart: () => add(sku, name, priceCents, 1),
      };
    },
    [add, heart, items, setQty, unheart],
  );
}

// ── Window API ─────────────────────────────────────────────────────

/** Call once in App component to install the store + commerce API on window.ldKit. */
export function useInitializeStore(): void {
  React.useEffect(() => {
    // Hydrate items + shared UI state from localStorage on startup
    hydrateStoreValue<ItemsState>(ITEMS_KEY, emptyItems());
    hydrateStoreValue<string>(SEARCH_QUERY_KEY, '');
    hydrateStoreValue<string>(HEADER_FULFILLMENT_KEY, 'none');

    // Conventions: mirror ui:* event payloads into store for cross-component
    // "just works" communication, even when producers only emit CustomEvents.
    const onUiEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail as
        | {topic?: string; payload?: any}
        | undefined;
      const topic = detail?.topic;
      if (typeof topic !== 'string' || !topic.startsWith('ui:')) return;

      setLastUiEvent(topic, detail?.payload);

      if (topic === 'ui:header:search-submit') {
        const query =
          typeof detail?.payload?.query === 'string'
            ? detail.payload.query
            : '';
        setStoreValue(SEARCH_QUERY_KEY, query, {persist: true});
      }

      if (topic === 'ui:header:fulfillment') {
        const selection =
          typeof detail?.payload?.selection === 'string'
            ? detail.payload.selection
            : 'none';
        setStoreValue(HEADER_FULFILLMENT_KEY, selection, {persist: true});
      }
    };
    window.addEventListener(GENLD_EVENT, onUiEvent);

    const w = window as any;
    w.ldKit = {
      ...(w.ldKit ?? {}),
      emit,
      on,
      store: {
        get: getStoreValue,
        set: setStoreValue,
        hydrate: hydrateStoreValue,
        getLastUiEvent,
      },
      items: {
        getAll: getItemsState,
        heart: heartItem,
        unheart: unheartItem,
        addToCart,
        setCartQty,
        removeFromCart,
        clearCart,
      },
      // Convenience alias — same shape as before
      cart: {
        add: (item: {sku: string; name: string; priceCents: number; qty?: number}) =>
          addToCart(item.sku, item.name, item.priceCents, item.qty),
        remove: removeFromCart,
        clear: clearCart,
        getState: () => {
          const items = getItemsState();
          const cartItems: Record<string, {sku: string; name: string; priceCents: number; qty: number}> = {};
          for (const rec of Object.values(items)) {
            if (rec.cartQty > 0) cartItems[rec.sku] = {sku: rec.sku, name: rec.name, priceCents: rec.priceCents, qty: rec.cartQty};
          }
          return {items: cartItems};
        },
        getSummary: () => deriveCartSummary(getItemsState()),
      },
      ui: {
        getLastEvent: getLastUiEvent,
        getSearchQuery: () => getStoreValue<string>(SEARCH_QUERY_KEY) ?? '',
        getFulfillment: () =>
          getStoreValue<string>(HEADER_FULFILLMENT_KEY) ?? 'none',
      },
    };
    return () => {
      window.removeEventListener(GENLD_EVENT, onUiEvent);
    };
  }, []);
}
