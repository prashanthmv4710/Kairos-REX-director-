---
description: 'Living Design tokens — color, spacing scale, and breakpoints, canonical names + common picks, replaces hardcoded values'
applyTo: '**'
---
# Living Design Tokens

## Color

Reference for `--ld-semantic-color-*` tokens, sourced from `src/themes/base.css`. Apply tokens with `var(--ld-semantic-color-…)` in CSS files OR inline styles (`style={{ background: 'var(--ld-semantic-color-surface-subtle)' }}`). **Never hardcode hex colors.**

### Naming convention

`--ld-semantic-color-<role>-<tone>[-<state>]`

- `<role>` — where it applies: `surface`, `fill`, `border`, `text`, `link`, `separator`, …
- `<tone>` — meaning: `brand`, `info`, `warning`, `negative`, `positive`, `subtle`, `subtlest`, …
- `<state>` (component-internal) — `hovered`, `focused`, `pressed`, `disabled`, `activated`. Use base tokens in page code; component CSS handles its own states.

### Common picks (use these first)

For most page UI:

| Need | Token |
|---|---|
| Card / image-frame background | `--ld-semantic-color-surface-subtle` |
| Generic 1px border | `--ld-semantic-color-border-subtle` |
| Faint divider line | `--ld-semantic-color-border-subtlest` |
| Brand-color accent border (e.g. selected tab) | `--ld-semantic-color-border-brand` |
| Inline link text | `--ld-semantic-color-link-text` |
| Brand-color text | `--ld-semantic-color-text-brand` |
| Subtle informational fill (blue tint) | `--ld-semantic-color-fill-info-subtle` |
| Subtle warning fill (yellow tint) | `--ld-semantic-color-fill-warning-subtle` |
| Subtle negative fill (red tint) | `--ld-semantic-color-fill-negative-subtle` |
| Subtle positive fill (green tint) | `--ld-semantic-color-fill-positive-subtle` |
| Neutral skeleton / progress track | `--ld-semantic-color-fill-subtle` |
| Star rating fill | `--ld-semantic-color-rating-fill` |
| Body text | `--ld-semantic-color-text` |
| Muted secondary text | `--ld-semantic-color-text-subtle` |

These names are **real and validated**. Token names like `--ld-semantic-color-background-primary`, `--ld-semantic-color-border-primary`, or `--ld-semantic-color-background-warning-subtle` do **not** exist — those are common hallucinations. When in doubt, search this doc.

### Full reference (by role)

Each section lists base tokens only. State variants (`*-hovered`, `*-focused`, `*-pressed`, `*-disabled`, `*-activated`) are omitted from this view — they exist for component implementations. Run `grep -E "--ld-semantic-color-<role>" living-design.css` for the full set.

### surface

- `var(--ld-semantic-color-surface)` — `#ffffff`
- `var(--ld-semantic-color-surface-brand)` — `#e9f1fe`
- `var(--ld-semantic-color-surface-overlay)` — `#ffffff`
- `var(--ld-semantic-color-surface-overlay-brand-subtle)` — `#c9ebfd`
- `var(--ld-semantic-color-surface-overlay-inverse)` — `#001e60`
- `var(--ld-semantic-color-surface-subtle)` — `#f8f8f8`

### fill

- `var(--ld-semantic-color-fill)` — `#ffffff`
- `var(--ld-semantic-color-fill-accent-blue)` — `#0053e2`
- `var(--ld-semantic-color-fill-accent-blue-subtle)` — `#e9f1fe`
- `var(--ld-semantic-color-fill-accent-cyan)` — `#0076b3`
- `var(--ld-semantic-color-fill-accent-cyan-subtle)` — `#e7f6fe`
- `var(--ld-semantic-color-fill-accent-gray)` — `#74767c`
- `var(--ld-semantic-color-fill-accent-gray-subtle)` — `#f1f1f2`
- `var(--ld-semantic-color-fill-accent-green)` — `#2a8703`
- `var(--ld-semantic-color-fill-accent-green-subtle)` — `#eaf3e6`
- `var(--ld-semantic-color-fill-accent-orange)` — `#fc934d`
- `var(--ld-semantic-color-fill-accent-orange-subtle)` — `#fff0e6`
- `var(--ld-semantic-color-fill-accent-pink)` — `#cb2c90`
- `var(--ld-semantic-color-fill-accent-pink-subtle)` — `#fce9f5`
- `var(--ld-semantic-color-fill-accent-purple)` — `#63327e`
- `var(--ld-semantic-color-fill-accent-purple-subtle)` — `#efebf2`
- `var(--ld-semantic-color-fill-accent-red)` — `#ea1100`
- `var(--ld-semantic-color-fill-accent-red-subtle)` — `#fde9e8`
- `var(--ld-semantic-color-fill-accent-spark)` — `#ffc220`
- `var(--ld-semantic-color-fill-accent-spark-subtle)` — `#fef6de`
- `var(--ld-semantic-color-fill-accent-teal)` — `#00809e`
- `var(--ld-semantic-color-fill-accent-teal-subtle)` — `#e1f3f8`
- `var(--ld-semantic-color-fill-accent-yellow)` — `#fff200`
- `var(--ld-semantic-color-fill-accent-yellow-subtle)` — `#fffee6`
- `var(--ld-semantic-color-fill-activated-subtle)` — `#f0f5ff`
- `var(--ld-semantic-color-fill-brand)` — `#0053e2`
- `var(--ld-semantic-color-fill-brand-bold)` — `#001e60`
- `var(--ld-semantic-color-fill-brand-subtle)` — `#e9f1fe`
- `var(--ld-semantic-color-fill-edited)` — `#63327e`
- `var(--ld-semantic-color-fill-edited-subtle)` — `#efebf2`
- `var(--ld-semantic-color-fill-info)` — `#0053e2`
- `var(--ld-semantic-color-fill-info-subtle)` — `#e9f1fe`
- `var(--ld-semantic-color-fill-inverse)` — `#2e2f32`
- `var(--ld-semantic-color-fill-negative)` — `#ea1100`
- `var(--ld-semantic-color-fill-negative-subtle)` — `#fde9e8`
- `var(--ld-semantic-color-fill-positive)` — `#2a8703`
- `var(--ld-semantic-color-fill-positive-subtle)` — `#eaf3e6`
- `var(--ld-semantic-color-fill-subtle)` — `#f8f8f8`
- `var(--ld-semantic-color-fill-transparent)`
- `var(--ld-semantic-color-fill-warning)` — `#ffc220`
- `var(--ld-semantic-color-fill-warning-subtle)` — `#fef6de`

### border

- `var(--ld-semantic-color-border)` — `#2e2f32`
- `var(--ld-semantic-color-border-accent-blue)` — `#0053e2`
- `var(--ld-semantic-color-border-accent-blue-bold)` — `#002e99`
- `var(--ld-semantic-color-border-accent-cyan)` — `#0076b3`
- `var(--ld-semantic-color-border-accent-cyan-bold)` — `#004a70`
- `var(--ld-semantic-color-border-accent-gray)` — `#74767c`
- `var(--ld-semantic-color-border-accent-gray-bold)` — `#515357`
- `var(--ld-semantic-color-border-accent-green)` — `#2a8703`
- `var(--ld-semantic-color-border-accent-green-bold)` — `#1d5f02`
- `var(--ld-semantic-color-border-accent-orange)` — `#c83c00`
- `var(--ld-semantic-color-border-accent-orange-bold)` — `#af2f00`
- `var(--ld-semantic-color-border-accent-pink)` — `#cb2c90`
- `var(--ld-semantic-color-border-accent-pink-bold)` — `#8c1e64`
- `var(--ld-semantic-color-border-accent-purple)` — `#63327e`
- `var(--ld-semantic-color-border-accent-purple-bold)` — `#452358`
- `var(--ld-semantic-color-border-accent-red)` — `#ea1100`
- `var(--ld-semantic-color-border-accent-red-bold)` — `#a20c00`
- `var(--ld-semantic-color-border-accent-spark)` — `#995213`
- `var(--ld-semantic-color-border-accent-spark-bold)` — `#662b0d`
- `var(--ld-semantic-color-border-accent-teal)` — `#00809e`
- `var(--ld-semantic-color-border-accent-teal-bold)` — `#005a6f`
- `var(--ld-semantic-color-border-accent-yellow)` — `#996900`
- `var(--ld-semantic-color-border-accent-yellow-bold)` — `#663800`
- `var(--ld-semantic-color-border-brand)` — `#0053e2`
- `var(--ld-semantic-color-border-brand-bold)` — `#001e60`
- `var(--ld-semantic-color-border-edited)` — `#63327e`
- `var(--ld-semantic-color-border-edited-bold)` — `#452358`
- `var(--ld-semantic-color-border-info)` — `#0053e2`
- `var(--ld-semantic-color-border-info-bold)` — `#002e99`
- `var(--ld-semantic-color-border-inverse)` — `#ffffff`
- `var(--ld-semantic-color-border-negative)` — `#ea1100`
- `var(--ld-semantic-color-border-negative-bold)` — `#a20c00`
- `var(--ld-semantic-color-border-positive)` — `#2a8703`
- `var(--ld-semantic-color-border-positive-bold)` — `#1d5f02`
- `var(--ld-semantic-color-border-subtle)` — `#515357`
- `var(--ld-semantic-color-border-subtlest)` — `#74767c`
- `var(--ld-semantic-color-border-warning)` — `#995213`
- `var(--ld-semantic-color-border-warning-bold)` — `#662b0d`

### text

- `var(--ld-semantic-color-text)` — `#2e2f32`
- `var(--ld-semantic-color-text-accent-blue)` — `#0053e2`
- `var(--ld-semantic-color-text-accent-blue-bold)` — `#002e99`
- `var(--ld-semantic-color-text-accent-cyan)` — `#0076b3`
- `var(--ld-semantic-color-text-accent-cyan-bold)` — `#004a70`
- `var(--ld-semantic-color-text-accent-gray)` — `#74767c`
- `var(--ld-semantic-color-text-accent-gray-bold)` — `#515357`
- `var(--ld-semantic-color-text-accent-green)` — `#2a8703`
- `var(--ld-semantic-color-text-accent-green-bold)` — `#1d5f02`
- `var(--ld-semantic-color-text-accent-orange)` — `#c83c00`
- `var(--ld-semantic-color-text-accent-orange-bold)` — `#af2f00`
- `var(--ld-semantic-color-text-accent-pink)` — `#cb2c90`
- `var(--ld-semantic-color-text-accent-pink-bold)` — `#8c1e64`
- `var(--ld-semantic-color-text-accent-purple)` — `#63327e`
- `var(--ld-semantic-color-text-accent-purple-bold)` — `#452358`
- `var(--ld-semantic-color-text-accent-red)` — `#ea1100`
- `var(--ld-semantic-color-text-accent-red-bold)` — `#a20c00`
- `var(--ld-semantic-color-text-accent-spark)` — `#995213`
- `var(--ld-semantic-color-text-accent-spark-bold)` — `#662b0d`
- `var(--ld-semantic-color-text-accent-teal)` — `#00809e`
- `var(--ld-semantic-color-text-accent-teal-bold)` — `#005a6f`
- `var(--ld-semantic-color-text-accent-white)` — `#ffffff`
- `var(--ld-semantic-color-text-accent-yellow)` — `#996900`
- `var(--ld-semantic-color-text-accent-yellow-bold)` — `#663800`
- `var(--ld-semantic-color-text-brand)` — `#0053e2`
- `var(--ld-semantic-color-text-brand-bold)` — `#001e60`
- `var(--ld-semantic-color-text-edited)` — `#63327e`
- `var(--ld-semantic-color-text-edited-bold)` — `#452358`
- `var(--ld-semantic-color-text-info)` — `#0053e2`
- `var(--ld-semantic-color-text-info-bold)` — `#002e99`
- `var(--ld-semantic-color-text-info-inverse)` — `#c9dcfd`
- `var(--ld-semantic-color-text-inverse)` — `#ffffff`
- `var(--ld-semantic-color-text-magic-brand)` — `#001e60`
- `var(--ld-semantic-color-text-negative)` — `#ea1100`
- `var(--ld-semantic-color-text-negative-bold)` — `#a20c00`
- `var(--ld-semantic-color-text-negative-inverse)` — `#f69991`
- `var(--ld-semantic-color-text-positive)` — `#2a8703`
- `var(--ld-semantic-color-text-positive-bold)` — `#1d5f02`
- `var(--ld-semantic-color-text-positive-inverse)` — `#95c381`
- `var(--ld-semantic-color-text-subtle)` — `#515357`
- `var(--ld-semantic-color-text-subtlest)` — `#74767c`
- `var(--ld-semantic-color-text-warning)` — `#995213`
- `var(--ld-semantic-color-text-warning-bold)` — `#662b0d`
- `var(--ld-semantic-color-text-warning-inverse)` — `#ffedbc`

### link

- `var(--ld-semantic-color-link-legal)` — `#0053e2`
- `var(--ld-semantic-color-link-text)` — `#2e2f32`
- `var(--ld-semantic-color-link-text-accent-white)` — `#ffffff`
- `var(--ld-semantic-color-link-text-subtle)` — `#515357`

### separator

- `var(--ld-semantic-color-separator)` — `#e3e4e5`

### scrim

- `var(--ld-semantic-color-scrim)`
- `var(--ld-semantic-color-scrim-inverse)`

### notice

- `var(--ld-semantic-color-notice-fill-info)` — `#0053e2`
- `var(--ld-semantic-color-notice-fill-negative)` — `#ea1100`
- `var(--ld-semantic-color-notice-fill-positive)` — `#2a8703`
- `var(--ld-semantic-color-notice-fill-warning)` — `#ffc220`

### rating

- `var(--ld-semantic-color-rating-border)` — `#cc851a`
- `var(--ld-semantic-color-rating-fill)` — `#ffc220`

### loading

- `var(--ld-semantic-color-loading)` — `#74767c`
- `var(--ld-semantic-color-loading-subtle)` — `#e3e4e5`
- `var(--ld-semantic-color-loading-subtlest)` — `#f8f8f8`
- `var(--ld-semantic-color-loading-white)` — `#ffffff`

### background

- `var(--ld-semantic-color-background)` — `#ffffff`
- `var(--ld-semantic-color-background-inverse)` — `#2e2f32`
- `var(--ld-semantic-color-background-subtle)` — `#f8f8f8`

### action

- `var(--ld-semantic-color-action-border-secondary)` — `#2e2f32`
- `var(--ld-semantic-color-action-border-tertiary)` — `#babbbe`
- `var(--ld-semantic-color-action-border-transparent)`
- `var(--ld-semantic-color-action-fill-accent-white)`
- `var(--ld-semantic-color-action-fill-negative)` — `#ea1100`
- `var(--ld-semantic-color-action-fill-primary)` — `#0053e2`
- `var(--ld-semantic-color-action-fill-secondary)` — `#ffffff`
- `var(--ld-semantic-color-action-fill-tertiary)` — `#ffffff`
- `var(--ld-semantic-color-action-fill-transparent)`

### chart

- `var(--ld-semantic-color-chart-categorical-1)` — `#002e99`
- `var(--ld-semantic-color-chart-categorical-2)` — `#df74b1`
- `var(--ld-semantic-color-chart-categorical-3)` — `#cc851a`
- `var(--ld-semantic-color-chart-categorical-4)` — `#0092db`
- `var(--ld-semantic-color-chart-categorical-5)` — `#af2f00`
- `var(--ld-semantic-color-chart-categorical-6)` — `#a184b2`
- `var(--ld-semantic-color-chart-categorical-7)` — `#3f931c`
- `var(--ld-semantic-color-chart-categorical-8)` — `#b1267d`

### field

- `var(--ld-semantic-color-field-border)` — `#909196`
- `var(--ld-semantic-color-field-border-negative)` — `#ea1100`
- `var(--ld-semantic-color-field-fill)` — `#ffffff`
- `var(--ld-semantic-color-field-fill-negative)` — `#ffffff`
- `var(--ld-semantic-color-field-fill-readonly)` — `#f1f1f2`

### filter

- `var(--ld-semantic-color-filter-border)` — `#2e2f32`
- `var(--ld-semantic-color-filter-fill)` — `#ffffff`

### input

- `var(--ld-semantic-color-input-border)` — `#2e2f32`
- `var(--ld-semantic-color-input-border-accent-white)` — `#ffffff`
- `var(--ld-semantic-color-input-fill)` — `#ffffff`
- `var(--ld-semantic-color-input-fill-accent-white)`

### progress

- `var(--ld-semantic-color-progress-fill)` — `#909196`
- `var(--ld-semantic-color-progress-fill-info)` — `#0053e2`
- `var(--ld-semantic-color-progress-fill-negative)` — `#ea1100`
- `var(--ld-semantic-color-progress-fill-positive)` — `#2a8703`
- `var(--ld-semantic-color-progress-fill-subtle)` — `#e3e4e5`
- `var(--ld-semantic-color-progress-fill-warning)` — `#995213`

### switch

- `var(--ld-semantic-color-switch-fill)` — `#74767c`
- `var(--ld-semantic-color-switch-indicator)` — `#ffffff`

## Spacing scale

Reference for `--ld-primitive-scale-space-*`, sourced from `src/themes/base.css`. Apply with `var(--ld-primitive-scale-space-N)` — this is the form used throughout the shipped CSS. **Never hardcode a spacing value that has a token.**

| Token | rem | px |
|---|---|---|
| `var(--ld-primitive-scale-space-25)` | 0.125rem | 2px |
| `var(--ld-primitive-scale-space-50)` | 0.25rem | 4px |
| `var(--ld-primitive-scale-space-100)` | 0.5rem | 8px |
| `var(--ld-primitive-scale-space-150)` | 0.75rem | 12px |
| `var(--ld-primitive-scale-space-200)` | 1rem | 16px |
| `var(--ld-primitive-scale-space-250)` | 1.25rem | 20px |
| `var(--ld-primitive-scale-space-300)` | 1.5rem | 24px |
| `var(--ld-primitive-scale-space-400)` | 2rem | 32px |
| `var(--ld-primitive-scale-space-500)` | 2.5rem | 40px |
| `var(--ld-primitive-scale-space-600)` | 3rem | 48px |
| `var(--ld-primitive-scale-space-700)` | 3.5rem | 56px |
| `var(--ld-primitive-scale-space-800)` | 4rem | 64px |
| `var(--ld-primitive-scale-space-900)` | 4.5rem | 72px |
| `var(--ld-primitive-scale-space-1000)` | 5rem | 80px |

## Breakpoints

The only breakpoints allowed in this project, sourced from `src/themes/base.css`. **Never invent a custom width** (e.g. 768px, 1024px) — every responsive rule must align to one of these.

| Token | px | rem (use in `@media`) | `<GridColumn>` prop |
|---|---|---|---|
| `--ld-primitive-scale-breakpoint-small` | 0px | 0rem | sm |
| `--ld-primitive-scale-breakpoint-medium` | 600px | 37.5rem | md |
| `--ld-primitive-scale-breakpoint-large` | 900px | 56.25rem | lg |
| `--ld-primitive-scale-breakpoint-xLarge` | 1200px | 75rem | _(raw media query)_ |
| `--ld-primitive-scale-breakpoint-xxLarge` | 1920px | 120rem | _(raw media query)_ |

CSS `@media` cannot consume `var()` — use the rem literal from the table (e.g. `@media (min-width: 56.25rem)`). For JS-side logic, read the CSS variable via `getComputedStyle`. `<GridColumn>` exposes only `sm`/`md`/`lg`; for `xLarge`/`xxLarge` adjustments, write a raw `@media` query alongside the grid.