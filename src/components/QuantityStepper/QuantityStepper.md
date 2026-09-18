# QuantityStepper

**Import:** `import { QuantityStepper } from "./components/QuantityStepper"`
**Category:** components
**Intent:** Increment/decrement stepper (onChange = absolute count)

## Props

- `variant`: "primary" | "secondary" | "tertiary" — Visual style variant.
- `size`: "small" | "medium" | "large" — Size of the stepper.
- `count`: number — Controlled quantity count. When provided, the component is controlled.
- `defaultCount`: number — Initial quantity count (uncontrolled). 0 = show Add button.
- `maxQuantity`: number — Maximum allowed quantity. When reached, increment button is disabled.
- `addLabel`: string — Label text for the "+ Add" button mode. Becomes the button's `aria-label` in initial
- `addA11yLabel`: string — Accessible name for the Add button, used when the visible `addLabel` has to
- `showAddLabel`: boolean — When false, hides the text label in "+ Add" mode, showing only the + icon.
- `cartLabel`: string — When provided, renders as an "Add to cart" text-only button instead of "+ Add".
- `countLabel`: string — Label shown after count in stepper mode.
- `disabled`: boolean — Disables the entire component.
- `showTrashOnRemove`: boolean — When true, replaces the minus button with a trash icon when count === 1.
- `onChange`: (count: number) => void — Called whenever the quantity changes.