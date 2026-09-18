# Attribute

**Import:** `import { Attribute } from "./components/Attribute"`
**Category:** components
**Intent:** Leading-icon + label pill with size/color variants and optional comparison label (pass iconLabel when the icon carries meaning)

## Props

- `label`: string (required) — Display label.
- `variant`: "default" | "extended"
- `size`: "small" | "medium" | "large"
- `color`: "default" | "subtle" | "brand" | "positive" | "negative" | "accent-blue" | "inverse"
- `icon`: ReactNode — Leading icon. Defaults to the LD `Tag` icon.
- `iconLabel`: string — Accessible name for the leading icon. When provided the icon is announced
- `additionalLabel`: boolean — When true, appends `→ label2` after the label.
- `label2`: string — Secondary label rendered when `additionalLabel` is true.
- `leadingLabel`: string — Extended variant: optional leading label. Defaults to `label`.
- `altLabel`: string — Extended variant: optional emphasized middle label.
- `trailingLabel`: string — Extended variant: optional trailing label.
- `trailingIcon`: ReactNode — Extended variant: optional trailing icon/media.
- `leadingLogoSvg`: string — Extended variant: optional leading logo SVG markup rendered in a 16x16 slot.
- `trailingLogoSvg`: string — Extended variant: optional trailing logo SVG markup rendered in a 16x16 slot.
- `trailingIconLabel`: string — Extended variant: accessible name for trailing media when meaningful.
- `showLeadingIcon`: boolean — Extended variant: show the leading icon/media.
- `showTrailingIcon`: boolean — Extended variant: show trailing icon/media.
- `showLeadingLabel`: boolean — Extended variant: show leading label.
- `showAltLabel`: boolean — Extended variant: show emphasized middle label.
- `showTrailingLabel`: boolean — Extended variant: show trailing label.