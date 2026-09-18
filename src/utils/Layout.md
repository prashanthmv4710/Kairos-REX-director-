# Layout

**Import:** `import { ... } from "./utils/Layout"`
**Category:** utils · runtime utility
**Intent:** Layout primitives for page shells, stacks and responsive spacing wrappers

## API

- `BREAKPOINTS_PX`: { readonly small: 0; readonly medium: 600; readonly large: 900; readonly xLarge: 1200; readonly xxLarge: 1920; }
- `useInitializeLayout`: () => void — Install matchMedia listeners for every canonical boundary, write the current tier onto `<html dat...
- `useViewport`: () => { tier: ViewportTier; isMobile: boolean; isAtLeastMedium: boolean; isAtLeastLarge: boolean; isAtLeastXLarge: boolean; isAtLeastXxLarg… — Subscribe to the active viewport tier and a few common booleans derived from it.

## Types

- `ViewportTier`
