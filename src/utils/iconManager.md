# iconManager

**Import:** `import { ... } from "./utils/iconManager"`
**Category:** utils · runtime utility
**Intent:** Look up icon names available in the active theme icon font

## API

- `FONT_CSS_CLASS`: Record<string, string>
- `getCommonIcons`: () => string[] — Icon names present in every icon font — safe to use regardless of theme.
- `getIconFontInfo`: (font: IconFontKey) => IconFontInfo
- `getIconsForTheme`: (theme: ThemeName) => string[] — Names of icons available in the theme's primary icon font.
- `getThemeIconCssPrefix`: (theme: ThemeName) => string
- `getThemePrimaryIconFont`: (theme: ThemeName) => string
- `hasIcon`: (font: IconFontKey, name: string) => boolean
- `hasIconForTheme`: (theme: ThemeName, name: string) => boolean
- `listIconFonts`: () => IconFontKey[]
- `listIcons`: (font: IconFontKey) => string[]
- `loadIconFont`: (fontKey: string) => void
- `searchIcons`: (font: IconFontKey, query: string) => string[]
- `THEME_FONT_CONFIG`: Record<"Walmart" | "Sam's Club" | "Sam's Club Maverick" | "Walmart B2B" | "Bodega" | "Cashi MX" | "Data Ventures" | "Walmart+" | "Member's …
- `useThemeIconPrefix`: () => string
- `useThemeMediaKey`: () => string

## Types

- `IconFontInfo`
- `IconFontKey`
