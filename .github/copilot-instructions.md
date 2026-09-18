
# Living Design Skill/IDE Starter

**This project is a responsive, mobile-first web application** built with Living Design components. Compose UI from the existing components in `src/components/` and the composed recipes in `src/patterns/`. Only create net-new components when nothing in the library satisfies the requirement — and even then, build them on top of existing components.

## Get The Context For Your Ask

There is a command that answers "what applies here?" in one shot:

```bash
node scripts/ld/cli.mjs context "<the user's ask, verbatim>"
```

It prints the hard rules, the rule sections that bear on that specific ask, and the prop APIs of the components and utilities you are most likely to need — already token-bounded. **Run it; don't read its source.**

Use it when it helps and skip it when it doesn't. Building or changing UI, picking a component, touching product data, laying out a page — worth a call. Renaming a local variable or fixing a comment — not worth a call. It's a reference you can pull, not a gate you have to pass.

It's worth re-running on a *new* ask rather than once per session: guidance that was in your context twenty turns ago is no longer steering you, which is the whole reason this command exists.

| Need | Command |
|------|---------|
| Which component or utility does X? | `node scripts/ld/cli.mjs search <keywords>` — ranked over rule sections *and* the catalogue |
| Full API for one thing | `node scripts/ld/cli.mjs show <Name>` |
| One rule section in full | `node scripts/ld/cli.mjs rule <id>` |
| What runtime services exist? | `node scripts/ld/cli.mjs utils` |
| Is any of this wired up? | `node scripts/ld/cli.mjs doctor` |

## Working From Another Directory?

`scripts/ld/cli.mjs` works out its own project root from its own location, so **an absolute path works from anywhere**:

```bash
node <absolute-path-to-this-project>/scripts/ld/cli.mjs context "<ask>"
```

`ld-kit init` printed that absolute path, and every run echoes the resolved project back to you. If your working directory is the parent of this project — common when it was scaffolded into a subfolder — use the absolute form, or `cd` in first. Paths in this file and in the rule files are relative to **this file's location, the project root**.

## Hard Rules — always in force

- **NEVER** edit or create files under `src/components/` or `src/patterns/` — they are generated, read-only output.
- **ALWAYS** import via relative paths (`../components/<Name>`, `../patterns/<Name>` — siblings, not nested) — **NEVER** from `@livingdesign/react` directly.
- **NEVER** recreate an existing Living Design component with raw HTML or another UI library.
- **NEVER** hand-write product data (names, SKUs, prices, images). It comes from `ProductService` — see `utilities.instructions.md`.
- New pages go in `src/pages/<PageName>.tsx`; new components in `src/components/<feature-name>/` or `src/components/custom/`. Full decision tree in `living-design-guidelines.instructions.md`.
- Set the active theme before rendering anything — see `theming.instructions.md`.

## Verify Your Work

Accessibility rules are binding and **machine-checked**. A runtime scanner covers the app with an unmissable overlay during `npm run dev`, and a Stop hook re-engages you with a fix list. Follow the verification loop in the `a11y` rules file before marking any UI task complete — reading it first is cheaper than fighting the scanner afterwards.

## Required Reading — the fallback map

Prefer the context command above; it selects from these for you. Read them directly when it is unavailable, or when you want a whole topic rather than the slice that matches one ask.

The canonical copy lives in `rules/` (`.md` files) at the project root — always visible to any tool. The same content is mirrored into hidden per-tool directories for auto-loading:

| Tool | Rules directory |
|------|----------------|
| Any tool (canonical) | `rules/` (`.md` files) |
| Cursor | `.cursor/rules/` (`.mdc` files) |
| Claude Code | `.claude/rules/` (`.md` files) |
| GitHub Copilot (VS Code) | `.github/instructions/` (`.instructions.md` files) |

The dot-directories are hidden — some tools' file listings and searches omit them entirely. If you cannot see them, read `rules/` at the project root.

| Rule file | Read it when |
|-----------|--------------|
| `theming.instructions.md` | always — set the theme before the first render |
| `a11y` | always — before writing any UI |
| `living-design-guidelines.instructions.md` | choosing a component; deciding where a new file goes |
| `components-index.instructions.md` | browsing the whole catalogue by eye |
| `component-communication.instructions.md` | anything touching shared state, cart, or header |
| `utilities.instructions.md` | product data, media, icons, illustrations |
| `spacing` | layout, breakpoints, spacing tokens |

## Project Layout

- **Living Design components**: `src/components/` — generated wrappers (read-only); patterns in `src/patterns/`
- **Your pages**: `src/pages/<PageName>.tsx` — one file per page
- **Your components**: `src/components/custom/<ComponentName>.tsx` (default) or `src/components/<feature-name>/` (domain-scoped)
- **Runtime utilities**: `src/utils/` — theme runtime, store, product catalog, media/icon lookups. List them with `node scripts/ld/cli.mjs utils`.
- **App entry**: `src/App.tsx` — calls theme runtime, renders app
- **Context engine**: `scripts/ld/` — run it, don't read it
- **Agent rules**: `rules/` (canonical, always visible); mirrored per-tool in `.github/instructions/`

## Tech Stack

- React 18 + TypeScript + Vite, NPM
- UI: Living Design (`@livingdesign/react`) via local wrappers in `src/components/`
- Theming: `src/utils/Theming.tsx` (called from `src/App.tsx`)

## Development Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # Production build
npm run preview    # Preview the production build
```
