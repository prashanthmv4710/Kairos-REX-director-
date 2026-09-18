---
description: 'Component communication via store.ts — shared state, pub/sub events, and product binding patterns'
applyTo: 'src/**/*.tsx,src/**/*.ts'
---

# Component Communication

All cross-component state in this project flows through `src/utils/store.ts`. Do NOT invent ad-hoc React context providers, prop-drilling chains, or external state libraries. The Store already provides reactive key-value state, pub/sub events, and pre-built adapters for products, cart, search, and fulfillment.

## Import

```tsx
import { useItems, useHeaderCartBindings, useStoreConnectedItemBindings, emit, setStoreValue } from "./utils/store";
```

Adjust relative depth from your file location. Never duplicate Store functionality.

## Architecture

store.ts has three layers. Pick the highest-level one that fits:

| Layer | What it does | When to use |
|-------|-------------|-------------|
| **Adapter hooks** | Ready-to-spread bindings for headers, product cards | Wiring Walmart-flavored components to shared state |
| **Domain hooks** | `useItems()`, `useCart()`, `useSharedSearchQuery()` | Reading/writing item, cart, or search state |
| **Primitives** | `useStore()`, `useEvent()`, `emit()`, `setStoreValue()` | Custom cross-component state not covered above |

## Product Binding Pattern (preferred)

Use `useStoreConnectedItemBindings()` to get a factory, then call it per product. The returned bindings spread directly onto tile/card components:

```tsx
function ProductPage() {
  const bindItem = useStoreConnectedItemBindings();

  const product = bindItem({
    sku: "demo-blender",
    name: "3-in-1 Blender",
    priceCents: 16998,
  });

  return (
    <ItemTile
      image={img}
      name="3-in-1 Blender"
      price="169"
      cents="98"
      hearted={product.hearted}
      onHeartChange={product.onHeartChange}
    />
  );
}
```

The same SKU bound in multiple components (tile, grid card, list card, carousel card) stays automatically in sync — changing quantity or heart state in one updates all others.

### Built-in Flash Deals row

`FlashDealsCarousel` is a fixed-data organism. By default its built-in `+ Add` actions fall back to `window.ldKit.items.addToCart(...)`, so header cart totals still update when the component is dropped onto a page with the store initialized. It also accepts an optional `onAddToCart(item)` prop — pass it to wire the deals to your own cart/state instead of the global (props-first); the global fallback is used only when the prop is omitted.

Use this as a convenience for the canned flash-deals content. For **custom product rows**, always build `Carousel` + `CarouselProductCard` and wire each product via `useStoreConnectedItemBindings()`.

### Binding shape

`useStoreConnectedItemBindings()` returns a factory `(item: StoreItemIdentity) => StoreConnectedItemBindings`:

```ts
type StoreItemIdentity = { sku: string; name: string; priceCents: number };
type StoreConnectedItemBindings = {
  hearted: boolean;
  cartQty: number;
  onHeartChange: (hearted: boolean) => void;
  onCartQtyChange: (qty: number) => void;
  onAddToCart: () => void;
};
```

### CRITICAL: `addToCart` vs `setCartQty` — know the difference

These two functions have **different semantics** and using the wrong one causes cart count bugs:

| Function | Behavior | Use when |
|----------|----------|----------|
| `addToCart(sku, name, priceCents, qty?)` | **Increments** cart by `qty` (default 1). Existing 3 + addToCart(2) = 5 | Initial "Add to cart" button click |
| `setCartQty(sku, name, priceCents, qty)` | **Sets exact** cart quantity. Existing 3 + setCartQty(2) = 2 | QuantityStepper onChange, controlled inputs |

**`QuantityStepper` onChange passes the new absolute count** (e.g., 3→2 passes `2`). You MUST use `setCartQty` (or the binding's `onCartQtyChange`) — never `addToCart`:

```tsx
// CORRECT — QuantityStepper wired to setCartQty via bindings
const bindings = bindItem({ sku, name, priceCents });
<QuantityStepper count={bindings.cartQty} onChange={bindings.onCartQtyChange} />

// CORRECT — QuantityStepper with direct setCartQty
<QuantityStepper count={qty} onChange={(count) => setCartQty(sku, name, priceCents, count)} />

// WRONG — addToCart increments, so pressing minus ADDS items
<QuantityStepper count={qty} onChange={(count) => addToCart(sku, name, priceCents, count)} />
```

**Rule**: Whenever a callback receives an absolute quantity (QuantityStepper, number inputs, controlled steppers), use `setCartQty` or `onCartQtyChange`. Use `addToCart` or `onAddToCart` only for one-shot "Add" button clicks that increment by 1.

### CRITICAL: Use bindings for ALL product interactions — no local state

NEVER duplicate product state in local `useState`. If a page has a product with heart and cart controls, use `useStoreConnectedItemBindings()` for that product — even if it's the "main" product on a PDP. Local state creates disconnected islands where:
- The header cart count and the product stepper disagree
- Adding from a "You may also like" carousel doesn't reflect in the main product area
- Heart state toggles aren't persisted

```tsx
// CORRECT — single source of truth for the main product
const bindItem = useStoreConnectedItemBindings();
const product = bindItem({ sku: PRODUCT.sku, name: PRODUCT.name, priceCents: PRODUCT.priceCents });
<HeartView activated={product.hearted} onChange={product.onHeartChange} />
<QuantityStepper count={product.cartQty} onChange={product.onCartQtyChange} />

// WRONG — local state disconnected from Store
const [qty, setQty] = useState(0);
const [hearted, setHearted] = useState(false);
<QuantityStepper count={qty} onChange={(c) => { setQty(c); addToCart(sku, name, price, c); }} />
```

## Header Binding Pattern

Use `useHeaderCartBindings()` for cart count and formatted price on headers:

```tsx
function PageWithHeader() {
  const { cartCount, cartPrice } = useHeaderCartBindings();

  return (
    <>
      <Header cartCount={cartCount} cartPrice={cartPrice} />
    </>
  );
}
```

Headers update live as items are added/removed from any component on the page.

**NEVER hardcode `cartCount` or `cartPrice`:**

```tsx
// WRONG — static values, header never updates when cart changes
<Header cartCount={3} cartPrice="$127.45" />

// WRONG — manually computing values bypasses Store reactivity
<Header cartCount={myItems.length} cartPrice={formatPrice(myTotal)} />
```

## Domain Hooks

### Items & Cart

```tsx
const { items, favorites, cartLines, summary, addToCart, heartItem, clearCart } = useItems();
```

- `summary.totalQty` / `summary.subtotalCents` / `summary.lineCount` — derived cart totals
- `addToCart(sku, name, priceCents, qty?)` — add or increment
- `setCartQty(sku, name, priceCents, qty)` — set exact quantity (for steppers)
- `heartItem(sku, name, priceCents)` / `unheartItem(sku)` — favorite toggle

### Search & Fulfillment

```tsx
const query = useSharedSearchQuery();       // reactive current search
const fulfillment = useSharedFulfillment(); // reactive fulfillment selection
```

To update search programmatically:

```tsx
setStoreValue("ui:search:query", "blender", { persist: true });
emit("ui:header:search-submit", { query: "blender" });
```

### Event Snapshots

Read the latest payload for any `ui:*` event:

```tsx
const lastSearch = useLastUiEvent<{ query?: string }>("ui:header:search-submit");
const lastHeart = useLastUiEvent<{ activated?: boolean }>("ui:heart:toggle");
```

## Primitives (custom state)

For app-specific state not covered by the domain hooks:

```tsx
// Write
setStoreValue("my:custom:key", value, { persist: true });

// React-reactive read
const value = useStore<MyType>("my:custom:key", defaultValue);

// Fire-and-forget events
emit("my:custom:event", { some: "payload" });
useEvent("my:custom:event", (payload) => { /* handle */ });
```

## Hard Constraints

- MUST use store.ts for any state shared between components. Do not create React context providers, Redux stores, Zustand stores, or other state management for cross-component communication.
- MUST call `useInitializeStore()` exactly once in the root App component. It hydrates persisted state and installs `window.ldKit`.
- MUST use `useStoreConnectedItemBindings()` when wiring product tiles/cards to cart and favorites — do not manually read/write item state. This applies to ALL product interactions on a page, including the "main" product on a PDP.
- MUST use `useHeaderCartBindings()` when mounting `Header` — do not manually format cart totals.
- MUST identify products by `{ sku, name, priceCents }` — this is the key for all item state operations.
- MUST use `{ persist: true }` on `setStoreValue` when the value should survive page reloads.
- MUST use `setCartQty` (or `onCartQtyChange`) when wiring `QuantityStepper` onChange — NEVER use `addToCart` with QuantityStepper. `addToCart` increments; QuantityStepper passes absolute counts.
- MUST use Store bindings for product heart/cart state — NEVER create local `useState` for `qty`, `hearted`, or `cartQty` that duplicates Store state.
- MUST render exactly ONE add-to-cart control per product, anywhere it appears — never both a `QuantityStepper` and a separate "Add to cart" `Button` for the same item. Show the "Add to cart" button when `cartQty === 0`, switch to `QuantityStepper` once added. Use `size="medium"` for primary cart actions — `size="large"` is rarely appropriate.
- MUST treat `FlashDealsCarousel` as fixed-data only — never invent unsupported props (for example `items`) to pass custom product arrays.
- NEVER duplicate cart/favorites/search logic that store.ts already provides.
- NEVER import Store internals — only use the exported functions and hooks.

## Product Page (PDP) Pattern

On a product detail page, the main product MUST use the same `useStoreConnectedItemBindings()` pattern as product cards. This ensures the main product, "You may also like" carousel, and header cart badge all stay in sync.

Each product page should have exactly **one** add-to-cart control per product. The layout uses a two-column `Grid` with the image gallery on the left and product info on the right:

```tsx
function ProductDetailPage() {
  const { cartCount, cartPrice } = useHeaderCartBindings();
  const bindItem = useStoreConnectedItemBindings();
  const product = bindItem({ sku: PRODUCT.sku, name: PRODUCT.name, priceCents: PRODUCT.priceCents });

  return (
    <>
      <Header cartCount={cartCount} cartPrice={cartPrice} />
      <Page title={PRODUCT.name} titleVisuallyHidden>
        <Container>
          <Grid hasGutter>
            {/* Image gallery — MUST constrain maxWidth for desktop */}
            <GridColumn sm={12} md={6} lg={6}>
              <div style={{ maxWidth: 500, margin: '0 auto' }}>
                <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', borderRadius: 8 }}>
                  <Image src={image} alt={PRODUCT.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            </GridColumn>

            {/* Product info — the visible product heading is an <h2> under the Page h1 */}
            <GridColumn sm={12} md={6} lg={6}>
              <Heading as="h2">{PRODUCT.name}</Heading>
              <HeartView activated={product.hearted} onChange={product.onHeartChange} />
              {product.cartQty === 0 ? (
                <Button variant="primary" onClick={product.onAddToCart}>Add to cart</Button>
              ) : (
                <QuantityStepper count={product.cartQty} onChange={product.onCartQtyChange} />
              )}
            </GridColumn>
          </Grid>

          {/* "You may also like" carousel — same bindItem factory */}
          <Carousel>
            <CarouselContent>
              {similarProducts.map(p => {
                const b = bindItem({ sku: p.sku, name: p.name, priceCents: p.priceCents });
                return (
                  <CarouselItem key={p.sku} UNSAFE_className="ld-carousel-item--multi">
                    <CarouselProductCard onAddToCart={b.onAddToCart} cartQty={b.cartQty} onCartQtyChange={b.onCartQtyChange} />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </Container>
      </Page>
    </>
  );
}
```

**Rules for PDP pages:**
- ONE add-to-cart control per product — do not render both a QuantityStepper and an "Add to cart" Button for the same item
- Use `product.cartQty === 0` to conditionally show "Add to cart" button vs QuantityStepper
- **Image gallery MUST have `maxWidth: 500`** (or similar constraint) inside its `GridColumn` — without it, a 50% column on a 1612px container creates an ~780px image
- Use `margin: '0 auto'` on the maxWidth wrapper to center the image in its column
- Secondary actions like "Join & save with Plus" or "Buy now" are NOT add-to-cart duplicates — they navigate or open a separate flow
- Use `size="medium"` for primary cart actions — `size="large"` is rarely appropriate on PDPs
