# mediaTenant

**Import:** `import { ... } from "./utils/mediaTenant"`
**Category:** utils · runtime utility
**Intent:** Resolve the active theme to its media tenant — the brand whose logos and wordmarks apply

## API

- `getMediaTenantForTheme`: (theme: ThemeName) => MediaTenant — Resolve a runtime theme to its most-specific media tenant.
- `THEME_MEDIA_TENANT`: Record<"Walmart" | "Sam's Club" | "Sam's Club Maverick" | "Walmart B2B" | "Bodega" | "Cashi MX" | "Data Ventures" | "Walmart+" | "Member's …
- `useThemeMediaTenant`: () => MediaTenant — React hook returning the most-specific media tenant for the active theme.

## Types

- `MediaTenant`
