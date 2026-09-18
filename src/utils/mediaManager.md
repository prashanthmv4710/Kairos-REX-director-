# mediaManager

**Import:** `import { ... } from "./utils/mediaManager"`
**Category:** utils · runtime utility
**Intent:** Look up tenant-branded media — logos, wordmarks, card art and error-state imagery

## API

- `getMedia`: (tenant: MediaTenant, name: string) => MediaLookup | null — Resolve a tenant asset to its renderable payload.
- `getMediaTenantForTheme`: (theme: import("/home/jenkins/workspace/ld-kit/ws/src/utils/Theming").ThemeName) => MediaTenant
- `getMediaToken`: (tenant: MediaTenant, name: string) => string | null — Airtable token associated with the asset (e.g.
- `getTenantInfo`: (tenant: MediaTenant) => { label: string; count: number; }
- `hasMedia`: (tenant: MediaTenant, name: string) => boolean
- `listMedia`: (tenant: MediaTenant) => MediaAsset[]
- `listTenants`: () => MediaTenant[]
- `MediaTenant`: any
- `searchMedia`: (tenant: MediaTenant, query: string) => MediaAsset[]
- `THEME_MEDIA_TENANT`: Record<"Walmart" | "Sam's Club" | "Sam's Club Maverick" | "Walmart B2B" | "Bodega" | "Cashi MX" | "Data Ventures" | "Walmart+" | "Member's …
- `useThemeMediaKey`: () => string
- `useThemeMediaTenant`: () => MediaTenant

## Types

- `MediaAsset`
- `MediaKind`
- `MediaLookup`
