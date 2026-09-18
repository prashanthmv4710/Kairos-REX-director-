# ProcessingTrace

**Import:** `import { ProcessingTrace } from "./components/ProcessingTrace"`
**Category:** components
**Intent:** Collapsible AI agent run trace with a status pill and composable body cards (Reasoning, TaskPlan, Sources, Timeline, etc.)

## Props

- `state`: "processing" | "success" | "failure" (required) — Overall state of the run. Drives the leading status pill.
- `label`: ReactNode (required) — Main header label — the human-readable summary of what happened
- `statusLabel`: ReactNode — Override the auto-generated status text inside the pill
- `children`: ReactNode — Body content — compose with `<ProcessingTrace.Row>` or any of the
- `defaultOpen`: boolean — Uncontrolled initial open state.
- `open`: boolean — Controlled open state.
- `onOpenChange`: (open: boolean) => void — Callback fired when the open state changes.
- `progress`: number — Optional determinate progress, 0–1. When provided, a thin progress bar is
- `size`: "small" | "large" — Visual size of the trace.
- `avatar`: ReactNode — Optional decorative avatar rendered before the status pill in the header
- `hideBorder`: boolean — Hide the container's hairline border for a fully inline appearance.
- `a11yLabel`: string — Optional accessible label for the toggle button.