# useChatDropOverlay

**Import:** `import { useChatDropOverlay } from "./patterns/ChatDropOverlay"`
**Category:** patterns · React hook
**Intent:** Attach OS drag-and-drop listeners to a container element and expose a stable `isDragging` boolean.

## Signature

```ts
useChatDropOverlay(options?: UseChatDropOverlayOptions): UseChatDropOverlayResult
```

## Options

- `onFiles`: (files: File[]) => void — Called with the dropped files when the user releases inside the region.
- `disabled`: boolean — Disable drop detection entirely (e.g., when the region is offscreen).

## Returns

`UseChatDropOverlayResult`

## Usage notes

Attach OS drag-and-drop listeners to a container element and expose a stable
`isDragging` boolean. Only engages when the drag payload contains files —
text selections, DOM drags, etc. are ignored so the overlay never appears for
intra-page drags.

A `dragenter` counter is used so the overlay stays visible while the pointer
moves between child elements (each child boundary fires an enter + leave pair
whose net effect on the counter is zero).

Usage: `const {isDragging, ref} = useChatDropOverlay({onFiles});` then apply
`ref` to the container: `<div ref={ref}>`.
