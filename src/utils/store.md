# store

**Import:** `import { ... } from "./utils/store"`
**Category:** utils · runtime utility
**Intent:** Shared cross-component state via pub/sub — cart, favorites, header and search-query bindings

## API

- `addToCart`: (sku: string, name: string, priceCents: number, qty?: number) => void
- `clearCart`: () => void
- `emit`: (topic: string, payload?: any) => void — Emit to all subscribers of a topic.
- `getLastUiEvent`: <TPayload = any>(topic: string) => UiEventSnapshot<TPayload> | undefined — Read the latest payload for a UI topic.
- `getStoreValue`: <T = any>(key: string) => T | undefined — Get a value from the store.
- `heartItem`: (sku: string, name: string, priceCents: number) => void
- `hydrateStoreValue`: <T = any>(key: string, fallback: T) => T — Load a persisted value from localStorage into the store.
- `isEmitting`: () => boolean — True while this module is delivering an `emit()`.
- `on`: (topic: string, handler: EventHandler) => () => void — Subscribe to a topic.
- `removeFromCart`: (sku: string) => void
- `setCartQty`: (sku: string, name: string, priceCents: number, qty: number) => void — Set exact cart quantity.
- `setLastUiEvent`: <TPayload = any>(topic: string, payload: TPayload) => void — Store and broadcast the latest payload for a UI topic.
- `setStoreValue`: <T = any>(key: string, value: T, options?: { persist?: boolean; }) => void — Set a value in the store.
- `unheartItem`: (sku: string) => void
- `useCart`: () => { state: { items: Record<string, { sku: string; name: string; priceCents: number; qty: number; }>; }; summary: CartSummary; addItem: … — React hook for cart state.
- `useEvent`: (topic: string, handler: EventHandler) => void — Subscribe to a pub/sub topic.
- `useHeaderCartBindings`: () => HeaderCartBindings — Header adapter: returns drop-in props for desktop/mobile headers.
- `useInitializeStore`: () => void — Call once in App component to install the store + commerce API on window.ldKit.
- `useItems`: () => { items: ItemsState; favorites: ItemRecord[]; cartLines: ItemRecord[]; summary: CartSummary; heartItem: (sku: string, name: string, p… — React hook for the full items store.
- `useItemState`: (sku: string) => ItemRecord | null — React hook for a single item's state.
- `useLastUiEvent`: <TPayload = any>(topic: string) => UiEventSnapshot<TPayload> | undefined — React hook for latest UI payload snapshots (ui:* topics).
- `useSharedFulfillment`: () => string — Shared fulfillment selection synchronized from ui:header:fulfillment events.
- `useSharedSearchQuery`: () => string — Shared search query synchronized from ui:header:search-submit events.
- `useStore`: <T = any>(key: string, fallback?: T) => T — Subscribe to a store key.
- `useStoreConnectedItemBindings`: () => (item: StoreItemIdentity) => StoreConnectedItemBindings — Product adapter factory for tiles/cards.

## Types

- `CartSummary`
- `HeaderCartBindings`
- `ItemRecord`
- `ItemsState`
- `StoreConnectedItemBindings`
- `StoreItemIdentity`
- `UiEventSnapshot`
