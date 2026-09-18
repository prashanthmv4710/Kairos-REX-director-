# MobileMenuPanel

**Import:** `import { MobileMenuPanel } from "./patterns/MobileMenuPanel"`
**Category:** patterns
**Intent:** Full-height mobile nav drawer with dark action header, section rail and scrollable link list (controlled isOpen)

## Props

- `isOpen`: boolean (required)
- `onClose`: () => void (required)
- `sections`: MobileMenuSection[] (required)
- `actionTiles`: MobileMenuActionTile[] — Top-bar action tiles (e.g. Sidekick / Scan / Notes).
- `footerLinks`: MobileMenuLink[] — Persistent footer link list.
- `utilityLinks`: MobileMenuLink[] — Bottom links in the left section rail. Defaults to GIF and Sign out.
- `clockLabel`: string — Optional clock label rendered above the action tiles.
- `clockState`: ClockState — Clock status icon rendered with the label.
- `onClockClick`: () => void
- `defaultSectionId`: string — Initially-active section id. Defaults to `sections[0].id`.
- `isInlinePreview`: boolean — Render in-flow for documentation previews instead of as a fixed overlay.
- `isContainedOverlay`: boolean — Render as an absolute overlay inside the nearest positioned ancestor.