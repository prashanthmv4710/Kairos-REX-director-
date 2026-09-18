# Living Design Scaffold

> **This README describes a project scaffolded from `@walmart/ld-kit`** — an app that *consumes* Living Design. Everything below applies to that generated project, not to the `ld-kit` repo that produces it. If you are contributing to `ld-kit` itself (adding or changing Living Design components), read `AGENTS.md` at the root of the `ld-kit` repo instead — the rules there are different, and in several places the opposite of these.

A standalone Vite + React + Tailwind scaffold pre-loaded with Living Design components. Use it with Claude Code, Cursor, or any IDE to vibe quickly with the Living Design system.

## Prerequisites

- **Node.js 22** (see `.nvmrc`)
- **npm**

## Getting Started

```bash
# Point nvm at the Walmart Node.js mirror so installs work on-network
export NVM_NODEJS_ORG_MIRROR="https://repository.walmart.com/content/repositories/nodejs/"
nvm install          # install Node 22 (see .nvmrc) from the Walmart mirror
nvm use              # switch to Node 22
npm install          # install dependencies (registry + proxy are pinned in .npmrc)
npm run dev          # start dev server on http://localhost:3099
```

## Project Structure

```
src/
  App.tsx                  # Your starting point — edit this!
  main.tsx                 # React root mount (no need to touch)
  components/              # Atoms, molecules, single components — Button, Card, …
  patterns/                # Composed page-level recipes — Header, Footer, OrderCard, …
  common/                  # Internal helpers used across components (read-only)
  hooks/                   # Shared hook utilities (read-only)
  index.ts                 # Top-level barrel — @livingdesign/react resolves here
  utils/                   # Shared helpers: Theming.tsx, Store.tsx (read-only)
  styles/
    index.css              # Tailwind directives + LD CSS import
    living-design.css      # Combined LD component styles (generated)
```

## Using Components

Primitives live at `src/components/<Name>/`. Patterns (composed recipes) live at `src/patterns/<Name>/`:

```tsx
import { Button } from './components/Button';
import { Card } from './components/Card';
import { TextField } from './components/TextField';
import { Accordion } from './components/Accordion';
import { Header } from './patterns/Header';
import { OrderCard } from './patterns/OrderCard';
```

Skim `.cursor/rules/components-index.mdc` (or `.claude/rules/components-index.md`) for the component catalogue. For prop API + usage notes on a specific component, open the `<Name>.md` next to its `.tsx` (e.g. `src/components/Button/Button.md` or `src/patterns/Header/Header.md`) or run `node scripts/ld/cli.mjs show <Name>`.

## Adding New Components

**In this scaffolded project**, `src/components/` and `src/patterns/` are generated from `@walmart/ld-kit` and are overwritten on every update — so create your own components **outside** those two directories, and import and compose the existing LD components in your own files.

(This rule is specific to a scaffolded project. In the `ld-kit` repo itself, `src/components/` and `src/patterns/` are hand-authored source and adding components there is the whole point — see `AGENTS.md` at that repo's root.)

## Context & Guidelines

### The context engine

`scripts/ld/` is a small, dependency-free CLI that answers "which rules and
components apply to this task?" It reads this project's own `rules/` and
`components.json`, so its answers always match the kit version you have.

```bash
node scripts/ld/cli.mjs context "build a PDP with product cards"
node scripts/ld/cli.mjs search bottom drawer     # rules AND components, ranked
node scripts/ld/cli.mjs show ProductService      # full API for one thing
node scripts/ld/cli.mjs rule a11y#forms          # one rule section
node scripts/ld/cli.mjs utils                    # what runtime services exist
node scripts/ld/cli.mjs doctor                   # is it all wired up?
```

There are `npm run ld*` aliases for these (see Scripts), but the `node` form is
what the agent rules use: it needs no install and works from **any** working
directory, since the engine locates its own project from its own path. That
matters when your editor is open on the folder *above* this one.

**For humans:** `npm run ld:menu` browses the rules and dry-runs what a given
ask would retrieve, with scores. `node scripts/ld/cli.mjs explain "<ask>"` is
the same thing non-interactively.

Your agent also gets a short, advisory context block injected on each turn (see
`.claude/settings.json` → `UserPromptSubmit`). It is de-duplicated across the
session, so a long conversation does not keep paying for the same rules. Set
`LD_CONTEXT_OFF=1` to turn it off; the accessibility loop is independent and
unaffected.

### Rule files

- `rules/` — canonical, always visible to any tool
- `.cursor/rules/` — Cursor (auto-loaded)
- `.claude/rules/` + `.claude/CLAUDE.md` — Claude Code
- `.github/instructions/` + `.github/copilot-instructions.md` — Copilot
- `AGENTS.md` — general agent orientation

All of them are generated from one source, so they never disagree. Session state
for the context engine lives in `.ld/` (gitignored).

## Accessibility runtime scanner (dev only)

This scaffold ships a dev-only accessibility scanner that runs in the browser and **covers the app with an unmissable red panel** whenever it detects common a11y defects (missing alt, unlabeled buttons, multiple `<h1>`, duplicate ids, clickable non-interactive elements, form controls without labels, etc.).

When violations exist you'll see:

- **In-page overlay** — a centered card titled `LD A11Y` listing every violation, with a "Copy violations" button. If a coding agent missed a defect, copy the panel contents and paste them back into your prompt.
- **`npm run dev` terminal banner** — violations print as a red `[LD A11Y]` block with numbered issues.

To inspect violations without opening DevTools:

```bash
# Machine-readable snapshot, written on every scan
cat .ld-a11y-report.json

# Live snapshot served by the dev server
curl http://localhost:3099/__ld_a11y_report
```

The scanner runs inside the browser, so the page must actually be loaded for violations to surface — a bare `curl /` won't trigger it. Use a browser, a browser-automation tool, or any agent that executes the page's JavaScript.

See `.cursor/rules/a11y.mdc` (or `.claude/rules/a11y.md`) for the full accessibility directive and the `unsafeDecorative={{ reason }}` opt-out contract.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (port 3099) |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm run ld:context -- "<ask>"` | Rules + APIs that apply to one ask |
| `npm run ld:search -- <keywords>` | Ranked search over rules and components |
| `npm run ld:utils` | List the runtime utilities available |
| `npm run ld:menu` | Interactive rule browser + retrieval dry-run (humans) |
| `npm run ld:doctor` | Self-check the context engine |
| `npm run a11y:scan` | One-off accessibility scan |
| `npm run a11y:endhook` | Run the accessibility end-hook manually |

The `ld:*` aliases exist for convenience. Prefer `node scripts/ld/cli.mjs …`
in anything an agent reads — it avoids npm's `--` passthrough and its stdout
banner, and it works from any directory.
