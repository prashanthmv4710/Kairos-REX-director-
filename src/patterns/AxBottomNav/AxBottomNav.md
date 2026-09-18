# AxBottomNav

**Import:** `import { AxBottomNav } from "./patterns/AxBottomNav"`
**Category:** patterns
**Intent:** Mobile associate bottom tab bar (For you / Today's Plan / Your team) with optional floating AI agent button

## Props

- `activeTab`: "for-you" | "todays-plan" | "your-team" | "more"
- `platform`: "ios" | "android"
- `onTabChange`: (tab: "for-you" | "todays-plan" | "your-team" | "more") => void
- `contained`: boolean — Renders in-flow (not fixed) for use inside a patterns/documentation page
- `showAgentButton`: boolean