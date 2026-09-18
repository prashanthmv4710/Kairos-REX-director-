# MaintenanceHealthCard

**Import:** `import { MaintenanceHealthCard } from "./patterns/MaintenanceHealthCard"`
**Category:** patterns
**Intent:** Auto Care vehicle maintenance card — health-score ring, per-service status grid, bundle savings, schedule actions

## Props

- `vehicle`: string (required)
- `mileage`: string (required)
- `healthScore`: number (required)
- `items`: MaintenanceItem[] (required)
- `bundleSavings`: string
- `bundleSavingsAmount`: string
- `location`: string
- `illustration`: string
- `valueStatement`: string