# Illustration

**Import:** `import { ... } from "./utils/Illustration"`
**Category:** utils · runtime utility
**Intent:** Render an inline-SVG Living Design illustration by type and name

## API

- `getIllustration`: <T extends IllustrationType>(type: T, name: IllustrationName<T>) => IllustrationLookup | null — Resolve an illustration to its inline SVG string and source dimensions.
- `getIllustrationTypeInfo`: (type: IllustrationType) => { label: string; count: number; } — Display label and count for a type — convenient for tab UIs.
- `Illustration`: <T extends IllustrationType>(props: IllustrationProps<T>) => import("/home/jenkins/workspace/ld-kit/ws/node_modules/@types/react/jsx-runtim… — Render an inline-SVG illustration.
- `listIllustrations`: <T extends IllustrationType>(type: T) => Array<IllustrationName<T>> — All illustration names for a given type, sorted as the manifest emits them.

## Types

- `IllustrationLookup`
- `IllustrationName`
- `IllustrationNamesByType`
- `IllustrationProps`
- `IllustrationType`
