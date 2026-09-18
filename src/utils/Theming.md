# Theming

**Import:** `import { ... } from "./utils/Theming"`
**Category:** utils · runtime utility
**Intent:** Theme runtime — initialize and switch the active brand theme for the whole app

## API

- `applyTheme`: (theme: ThemeName) => void
- `DEFAULT_THEME`: "Walmart" | "Sam's Club" | "Sam's Club Maverick" | "Walmart B2B" | "Bodega" | "Cashi MX" | "Data Ventures" | "Walmart+" | "Member's Mark" |…
- `FONT_CSS_CLASS`: Record<string, string>
- `getCurrentTheme`: () => ThemeName
- `getThemeIconCssPrefix`: (theme: ThemeName) => string
- `getThemePrimaryIconFont`: (theme: ThemeName) => string — Returns the manifest key for the theme's primary icon font (e.g. 'wcp', 'bodega').
- `loadIconFont`: (fontKey: string) => void
- `loadThemeFonts`: (theme: ThemeName) => void
- `THEME_FONT_CONFIG`: Record<"Walmart" | "Sam's Club" | "Sam's Club Maverick" | "Walmart B2B" | "Bodega" | "Cashi MX" | "Data Ventures" | "Walmart+" | "Member's …
- `THEME_NAMES`: readonly ["Walmart", "Sam's Club", "Sam's Club Maverick", "Walmart B2B", "Bodega", "Cashi MX", "Data Ventures", "Walmart+", "Member's Mark"…
- `THEME_PRESETS`: Record<string, ThemePreset>
- `useInitializeTheming`: (defaultTheme?: ThemeName, allowedThemes?: readonly ThemeName[]) => void
- `useThemeIconPrefix`: () => string
- `useThemeMediaKey`: () => string — Returns the active tenant's primary icon/media font key (e.g. 'wcp', 'sams-club', 'bodega').

## Types

- `ThemeName`
- `ThemePreset`
