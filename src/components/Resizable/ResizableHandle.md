# ResizableHandle

**Import:** `import { ResizableHandle } from "./components/Resizable"`
**Category:** components

## Composition

`ResizableHandle` is part of a compound component. Use together with: `ResizablePanel`, `ResizablePanelGroup`.

All pieces import from the same path (`./components/Resizable`). See each sibling's `.md` for its API.

## Props

- `withHandle`: boolean — Renders the six-dot grip indicator inside the handle.
- `expand`: boolean — Render the larger (square) grip box used for diagonal/full-canvas expansion.
- `snapPoints`: number[] — Percentage snap points used when double-clicking the handle.