---
description: 'Icon font reference — available icons per theme, lookup instructions, and usage patterns'
applyTo: 'src/**/*.tsx'
---

# Icon System Reference

This project uses **font-based icons** organized into themed icon sets. Each theme maps to a primary icon font. The base `ld` (Living Design) icons are always available.

## Theme → Icon Font Mapping

Each theme has exactly **one primary icon font**. The mapping is defined in `src/fonts/theme-icon-map.json` (designer-editable):

| Theme | Primary Icon Font |
|-------|-------------------|
| Walmart | `wcp` |
| Sam's Club | `sams-club` |
| Walmart B2B | `wcp` |
| Bodega | `bodega` |
| Cashi MX | `wcp` |
| Data Ventures | `wcp` |
| Sparky | `wcp` |
| Walmart Legacy | `wcp` |
| Walmart+ | `wcp` |
| Member's Mark | `wcp` |

**This is a 1:1 relationship.** Each theme resolves to one primary icon font. The `Icon` component uses `useThemeIconPrefix()` which returns only that primary font's CSS prefix — it never renders `ld`-prefixed icons.

Use `THEME_FONT_CONFIG[theme].primaryIconFont` to get the manifest key (e.g. `'wcp'`, `'bodega'`), or `getThemePrimaryIconFont(theme)` / `getThemeIconCssPrefix(theme)` from Theming.tsx. The `_loadFonts` array is internal to CSS font loading — never iterate it in UI code.

## How to Find Available Icons

1. **Search or list by font or theme** — `node scripts/ld/cli.mjs icons <query>` finds an icon by name across every font (e.g. `icons cart`); `node scripts/ld/cli.mjs icons <font-or-theme> <query>` scopes to one font and also accepts a theme name directly (`icons Walmart cart` resolves the theme's primary font for you). `node scripts/ld/cli.mjs icons` with no arguments lists every font and its count. This reads the same manifest `iconManager`'s `listIcons`/`searchIcons` read at runtime, so the answer matches what the app will actually render.
2. **Quick reference** — check the common icons list below.
3. **Codepoint files** — each font has a `*Icons.tsx` file in `src/fonts/<font>/` with the exact codepoint mapping.

### Common Icons (available in all fonts)

These icons exist in every icon set and are safe to use regardless of theme:

ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Bell, Bookmark, Calendar, Camera,
CaretDown, CaretUp, Check, CheckCircle, ChevronDown, ChevronLeft, ChevronRight,
ChevronUp, Clock, Close, Copy, Dollar, Download, Email, Eye, EyeSlash,
Filter, Flash, Gear, Gift, Globe, Heart, HeartFill, Home, InfoCircle,
Link, List, Location, Lock, Menu, Minus, More, Pencil, Phone, Play,
Plus, Printer, Refresh, Search, Share, Star, StarFill, Tag, Trash, Truck,
User, Users, Warning

## Programmatic Access

All icon code should import from `src/utils/iconManager` — one
import surface for both theme→font helpers and manifest queries:

```ts
import {
  // Theme → font (re-exported from Theming)
  getThemePrimaryIconFont,
  getThemeIconCssPrefix,
  useThemeIconPrefix,
  // Manifest queries
  listIconFonts,
  getIconFontInfo,
  listIcons,
  hasIcon,
  searchIcons,
  getIconsForTheme,
  hasIconForTheme,
  getCommonIcons,
} from 'src/utils/iconManager';

getIconsForTheme('Walmart');          // string[] of icon names for the wcp font
hasIcon('sams-club', 'Cart');          // true
searchIcons('wcp', 'chevron');         // ['ChevronDown', 'ChevronLeft', ...]
getCommonIcons();                      // names present in every font
```

Use these helpers for any "what icons exist for theme X" question — they
read `src/fonts/icon-manifest.json` directly, so they stay in sync with
the next Airtable pull.

## Usage

### Pre-made icon components (preferred)

Import from `src/components/Icons/Icons`:

```tsx
import {SearchIcon, StarIcon, SettingsIcon, PlusIcon, CheckIcon, XIcon, InfoIcon, AlertTriangleIcon, ChevronUpIcon}
  from 'src/components/Icons/Icons';

<IconButton a11yLabel="Search"><SearchIcon /></IconButton>
<SpotIcon color="brand"><StarIcon /></SpotIcon>
```

Available pre-made wrappers: `SearchIcon`, `ChevronUpIcon`, `SettingsIcon` (Gear), `StarIcon`, `CheckIcon`, `PlusIcon`, `InfoIcon` (InfoCircle), `AlertTriangleIcon` (Warning), `XIcon` (Close).

These components are **theme-aware** — they automatically resolve the correct icon font CSS class based on the active theme (e.g. `wcp wcp-Search` for Walmart, `sc sc-Search` for Sam's Club). Font loading is handled by the theming system (`loadThemeFonts()` in `Theming.tsx`), no manual font injection is needed.

### Generic icon component (any icon name)

```tsx
import {Icon} from 'src/components/Icons/Icons';

<Icon name="Cart" />
<Icon name="Heart" style={{fontSize: 24}} />
```

Props: `name` (required), `size` (`"small"` | `"medium"` | `"large"`), `a11yLabel`, `style`, `className`, `title`. The component reads the current theme from the `data-ld-theme` attribute and renders with the appropriate font CSS prefix.

### SVG icons (theme-independent)

A small number of SVG-only icons remain in `src/common/icons.tsx` for cases with no font equivalent: `WPlusIcon`, `SparkIcon`, `HourglassIcon`, `ShieldCheckIcon`. All other icons have been migrated to the font-based `Icon` system in `src/components/Icons/Icons`.

## Rules

- **Check the active theme** before using commerce-specific icons (e.g., `Cart`, `AddToCart`, `GroceryBag`). These exist in `wcp`, `sams-club`, and `bodega` but not in `ld`.
- **Use pre-made wrappers** when available — they provide consistent sizing and accessibility defaults.
- **For custom icons**, use `Icon` with a `name` from the manifest, not raw codepoints.
- **Do not hardcode font-family** — the theme system loads the correct icon font automatically via `loadThemeFonts()`.
- **Accessibility**: Icons inside interactive elements (Button, IconButton) get `aria-hidden="true"` — the parent provides the label. Standalone decorative icons need no label. Informational standalone icons need a `title` prop.
