# LanguageSelector

**Import:** `import { LanguageSelector } from "./components/LanguageSelector"`
**Category:** components
**Intent:** Circular flag dropdown for switching locales (controlled value/onChange)

## Props

- `value`: string — Active language code (controlled). Defaults to the first entry in `languages`.
- `onChange`: (code: string) => void — Fired when the user picks a language.
- `languages`: Language[] — Available languages. Defaults to en / fr / es.