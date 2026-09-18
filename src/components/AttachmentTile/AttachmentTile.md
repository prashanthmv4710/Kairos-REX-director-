# AttachmentTile

**Import:** `import { AttachmentTile } from "./components/AttachmentTile"`
**Category:** components
**Intent:** Removable attached-file/image chip — icon variant (pictogram + text) or image variant (thumbnail); wire onRemove

## Props

- `closeButtonProps`: AttachmentTileCloseButtonProps — The props spread to the tile's close (remove) button.
- `description`: ReactNode — The description shown under the title. Only rendered for the `icon`
- `disabled`: boolean — If the tile is disabled.
- `image`: ReactNode — The image (thumbnail) content for the `image` variant — typically an
- `leading`: ReactNode — The leading content for the `icon` variant — typically a `SpotIcon` or a
- `thumbnailSrc`: string — A URL (or object URL) for an image thumbnail shown in the leading slot of
- `onRemove`: (event: MouseEvent<HTMLButtonElement>) => void — The callback fired when the tile's close (remove) button is clicked.
- `removeLabel`: string — The accessible label for the close (remove) button.
- `nonDismissible`: boolean — When `true`, the close (remove) button and its tooltip are not rendered.
- `title`: ReactNode — The title for the `icon` variant.
- `loading`: boolean — When `true`, shows a brand Spinner in the leading 48×48 slot, replacing
- `uploadProgress`: number — A 0–100 upload progress value. When defined, the normal SpotIcon/thumbnail
- `variant`: "icon" | "image" — The variant for the tile.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
