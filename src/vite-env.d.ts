/// <reference types="vite/client" />

declare module '*.css' {}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

// `?raw` imports (Vite) yield the file's text content as a string. Used by the
// generated media/illustration modules to pull inline SVG strings from the
// content-addressed store while keeping them out of the module source and
// de-duplicated across themes.
declare module '*.svg?raw' {
  const content: string;
  export default content;
}

// `?raw` JSON import — the file's text content (not the parsed object). Used by
// the generated Lottie module for `.json` animations so consumers keep the
// existing `JSON.parse` render path.
declare module '*.json?raw' {
  const content: string;
  export default content;
}

// `.lottie` dotLottie binaries (a ZIP container Vite doesn't treat as an asset
// by default). Imported with `?url` so it resolves to a bundler-emitted asset
// URL — passed straight to <DotLottieReact src>.
declare module '*.lottie?url' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}
