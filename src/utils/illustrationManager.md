# illustrationManager

**Import:** `import { ... } from "./utils/illustrationManager"`
**Category:** utils · runtime utility
**Intent:** Look up available inline-SVG illustrations by type (mono-small, mono-large, spot) and name

## API

- `getIllustration`: <T extends IllustrationType>(type: T, name: IllustrationName<T>) => IllustrationLookup | null
- `getIllustrationTypeInfo`: (type: IllustrationType) => { label: string; count: number; }
- `hasIllustration`: <T extends IllustrationType>(type: T, name: string) => name is IllustrationName<T> & string
- `Illustration`: <T extends IllustrationType>(props: IllustrationProps<T>) => import("/home/jenkins/workspace/ld-kit/ws/node_modules/@types/react/jsx-runtim…
- `IllustrationLookup`: any
- `IllustrationName`: any
- `IllustrationNamesByType`: any
- `IllustrationProps`: any
- `IllustrationType`: any
- `listIllustrations`: <T extends IllustrationType>(type: T) => Array<IllustrationName<T>>
- `listIllustrationTypes`: () => IllustrationType[]
- `searchIllustrations`: <T extends IllustrationType>(type: T, query: string) => Array<IllustrationName<T>>
