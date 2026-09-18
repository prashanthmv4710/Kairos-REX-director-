# themeManager

**Import:** `import { ... } from "./utils/themeManager"`
**Category:** utils · runtime utility
**Intent:** Look up and switch brand themes — the list of supported themes and their metadata

## API

- `AGENT_THEME_CHANGE_EVENT`: "ld-kit-agent-theme-change"
- `AGENT_THEME_NAMES`: readonly ["customer", "partner", "associate", "developer", "wibey-light", "wibey"]
- `cleanAgentTheme`: () => void — Removes the app-wide `data-agent-theme` attribute from `<html>` and clears any persisted agent-th...
- `getAgentTheme`: () => AgentThemeName
- `getMegaMode`: () => boolean
- `getTheme`: () => string
- `getThemeNames`: () => string[]
- `initAgentTheme`: () => void
- `initMegaMode`: () => void
- `initTheme`: () => void
- `MEGA_CHANGE_EVENT`: "ld-kit-mega-change"
- `setAgentTheme`: (name: AgentThemeName) => void
- `setMegaMode`: (enabled: boolean) => void
- `setTheme`: (name: string) => void
- `THEME_FONT_CONFIG`: Record<"Walmart" | "Sam's Club" | "Sam's Club Maverick" | "Walmart B2B" | "Bodega" | "Cashi MX" | "Data Ventures" | "Walmart+" | "Member's …
- `THEME_PRESETS`: Record<string, ThemePreset>
- `ThemePreset`: any

## Types

- `AgentThemeName`
