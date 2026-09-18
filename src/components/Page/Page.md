# Page

**Import:** `import { Page } from "./components/Page"`
**Category:** components
**Intent:** Page shell (renders main landmark + single h1 + skip link). Exactly ONE Page per app — do not nest a Page inside another Page.

## Props

- `title`: string (required) — The page heading. Rendered as the single `<h1>` inside `<main>`.
- `skipLinkLabel`: string — Optional label for the skip-to-content link.
- `titleVisuallyHidden`: boolean — If `true`, the h1 rendered inside `<main>` is visually hidden but still
- `children`: ReactNode (required) — The page content. Renders inside the `<main>` landmark, below the h1.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).

## Usage notes

Page shell — renders the `<main>` landmark, the single page `<h1>`, and the skip-to-content link.

> ⚠️ **Exactly ONE `<Page>` per app.** The page module for the active route is the
> only thing that should render `<Page>`. Do NOT also wrap it in another `<Page>`
> inside `App.tsx` or any layout shell. Two `<Page>` wrappers produce two
> `<main>` landmarks and two `<h1>` elements, which breaks assistive-tech
> navigation; the runtime a11y scanner throws on this.

```tsx
// CORRECT — App.tsx renders the page module directly; the page module owns Page
// App.tsx
return (
  <A11yAnnouncementProvider>
    <CartPage />
  </A11yAnnouncementProvider>
);

// CartPage.tsx
return (
  <Page title="Cart">
    {/* page content */}
  </Page>
);

// WRONG — double Page wrapper (two <main>, two <h1>; a11y scanner throws)
// App.tsx
return (
  <Page title="My App">
    <CartPage />        {/* CartPage already renders its own <Page> inside */}
  </Page>
);
```

If you need a non-route-specific shell (theming/store init/global providers),
mount those providers in `App.tsx` **around** the page module, not inside another
`<Page>`. Each route's page module is responsible for its own `<Page>`.
