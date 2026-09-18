# FilterChip

**Import:** `import { FilterChip } from "./components/FilterChip"`
**Category:** components

## Props

- `selected`: boolean — Whether the filter chip is in selected/pressed state.
- `onSelectedChange`: (selected: boolean) => void — Callback when filter chip selection changes.
- `iconLeading`: ReactNode — Optional leading icon/content. Ignored when `isAllFilters` is true.
- `iconTrailing`: ReactNode — Optional trailing icon/content. Ignored when `isMultiSelect` is true.
- `disabled`: boolean — Whether the filter chip is disabled.
- `isMultiSelect`: boolean — Enable Multi-Select variant with chevron icons.
- `isOpen`: boolean — Controls the open/closed state for Multi-Select variant.
- `isAllFilters`: boolean — Enable "All Filters" variant with Sliders icon.
- `showLabel`: boolean — Show text label in All Filters variant.
- `showCount`: boolean — Show count in parentheses when `count` is provided.
- `count`: number — Active filter count to display.