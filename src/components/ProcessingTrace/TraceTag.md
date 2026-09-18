# TraceTag

**Import:** `import { TraceTag } from "./components/ProcessingTrace"`
**Category:** components
**Intent:** Collapsible AI agent run trace with a status pill and composable body cards (Reasoning, TaskPlan, Sources, Timeline, etc.)

## Props

- `state`: TraceState (required) — Current state — drives pill color and default label.
- `label`: ReactNode — Override the default text shown inside the pill.