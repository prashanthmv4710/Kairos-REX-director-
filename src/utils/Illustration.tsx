import * as React from 'react';
import {
  ILLUSTRATION_SVGS,
  ILLUSTRATION_META,
  MONO_SMALL_ILLUSTRATION_SVGS,
  MONO_LARGE_ILLUSTRATION_SVGS,
  SPOT_ILLUSTRATION_SVGS,
} from '../illustrations';
import manifest from '../illustrations/manifest.json';

/**
 * Public API for inline-SVG illustrations. The illustration assets and their
 * metadata are generated at build time by the Airtable sync — see
 * `airtable-sync/lib/illustration-pipeline.mjs`. This file is the only place
 * application code should reach into that generated layer; consumers should
 * import the `Illustration` component or the `getIllustration` helper below.
 *
 * Usage:
 *
 *   import {Illustration} from './Illustration';
 *
 *   <Illustration type="mono-small" name="WalmartBusiness" />
 *   <Illustration type="mono-large" name="Coupons" size={120} />
 *   <Illustration type="spot" name="AssociateOnTheWay" width={240} height={250} />
 *
 * Names autocomplete based on `type`, so renaming an illustration in Airtable
 * surfaces as a TS error in every consumer after the next sync.
 */

/** Map from each illustration type to the literal union of its valid names.
 *  The generated `ILLUSTRATION_SVGS` barrel is typed as `Record<string, …>`
 *  for runtime ergonomics, so `keyof` it would widen to `string`. We pin the
 *  type union here instead — the airtable-sync `ILLUSTRATION_TYPES` config in
 *  `airtable-sync/config.mjs` is the single source of truth; if you add a new
 *  type there, also add it here. */
export type IllustrationNamesByType = {
  'mono-small': keyof typeof MONO_SMALL_ILLUSTRATION_SVGS;
  'mono-large': keyof typeof MONO_LARGE_ILLUSTRATION_SVGS;
  'spot': keyof typeof SPOT_ILLUSTRATION_SVGS;
};

export type IllustrationType = keyof IllustrationNamesByType;

export type IllustrationName<T extends IllustrationType> = IllustrationNamesByType[T];

export interface IllustrationLookup {
  svg: string;
  width: number;
  height: number;
}

/**
 * Resolve an illustration to its inline SVG string and source dimensions.
 * Returns `null` when the name doesn't exist for the given type — that should
 * only happen if a generated module went stale, so it warns once in dev.
 */
export function getIllustration<T extends IllustrationType>(
  type: T,
  name: IllustrationName<T>,
): IllustrationLookup | null {
  const svgs = ILLUSTRATION_SVGS[type];
  const meta = ILLUSTRATION_META[type];
  const key = name as string;
  const svg = svgs?.[key];
  if (!svg) {
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(`[Illustration] Unknown ${type} illustration: "${key}". Run npm run airtable:pull-illustrations.`);
    }
    return null;
  }
  const dims = meta?.[key] ?? {width: 0, height: 0};
  return {svg, width: dims.width, height: dims.height};
}

/** All illustration names for a given type, sorted as the manifest emits them. */
export function listIllustrations<T extends IllustrationType>(type: T): Array<IllustrationName<T>> {
  const entry = manifest[type];
  if (!entry) return [];
  return entry.items.map((i) => i.name) as Array<IllustrationName<T>>;
}

/** Display label and count for a type — convenient for tab UIs. */
export function getIllustrationTypeInfo(type: IllustrationType): {label: string; count: number} {
  const entry = manifest[type];
  return {label: entry.label, count: entry.count};
}

// ─── React component ──────────────────────────────────────────────

type IllustrationBaseProps = {
  /** Optional accessible label. Defaults to the illustration name. Pass empty
   *  string to mark the SVG decorative (`aria-hidden`). */
  title?: string;
  /** Pixel width of the rendered box. If only `size` is given, applies to the
   *  longer dimension and the other is derived from the source aspect ratio. */
  width?: number | string;
  /** Pixel height of the rendered box. */
  height?: number | string;
  /** Square-ish convenience: sets max(width, height). Use for single-axis
   *  sizing when you don't care which dimension drives. */
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  /**
   * Illustration-theme key (see `src/illustrations/theme-manifest.json`,
   * e.g. `'walmart-connect'`, `'bodega'`) applied via
   * `data-ld-illustration-theme`. Only illustrations whose Airtable row has
   * been tagged with the 7-slot palette (see illustration-pipeline.mjs)
   * respond to this — everything else keeps its original hardcoded colors
   * regardless of what's passed here. Omit to render the base look.
   */
  illustrationTheme?: string;
  /**
   * Manual per-slot color overrides, for design QA — index 0 overrides slot
   * 1 (`--ld-illustration-token-1`), index 6 overrides slot 7. Takes
   * precedence over `illustrationTheme` since inline styles win the CSS
   * cascade. Falsy entries fall through to the active theme/base color.
   */
  tokenOverrides?: Array<string | null | undefined>;
};

export type IllustrationProps<T extends IllustrationType = IllustrationType> = {
  type: T;
  name: IllustrationName<T>;
} & IllustrationBaseProps;

/**
 * Render an inline-SVG illustration. Purely presentational — no async
 * loading. Sizing strategy:
 *
 *   • If `width` and `height` are both given, the box uses both literally.
 *   • If only one is given, the other derives from the source aspect ratio.
 *   • If `size` is given, it sets the longer source dimension; the shorter
 *     dimension scales proportionally.
 *   • If nothing is given, the box renders at 100% width with the source
 *     aspect ratio preserved via `aspect-ratio` CSS.
 *
 * Theming: illustrations tagged with the 7-slot palette in Airtable (see
 * illustration-pipeline.mjs) ship their fills as
 * `var(--ld-illustration-token-N, <original hex>)`, so passing nothing here
 * renders identically to an untagged illustration. Pass `illustrationTheme`
 * to apply one of the themes in `src/illustrations/theme-manifest.json` via
 * `data-ld-illustration-theme`, or `tokenOverrides` for one-off manual slot
 * overrides (e.g. a design-QA swatch panel).
 */
export function Illustration<T extends IllustrationType>(props: IllustrationProps<T>) {
  const {type, name, title, width, height, size, className, style, illustrationTheme, tokenOverrides} = props;
  const lookup = getIllustration(type, name);
  if (!lookup) return null;

  const {svg, width: srcW, height: srcH} = lookup;
  const aspectRatio = srcW > 0 && srcH > 0 ? `${srcW} / ${srcH}` : undefined;

  let resolvedWidth: number | string | undefined = width;
  let resolvedHeight: number | string | undefined = height;
  if (resolvedWidth === undefined && resolvedHeight === undefined && size !== undefined) {
    if (srcW >= srcH) {
      resolvedWidth = size;
    } else {
      resolvedHeight = size;
    }
  }

  const labelProps: React.HTMLAttributes<HTMLSpanElement> =
    title === ''
      ? {'aria-hidden': true}
      : {role: 'img', 'aria-label': title ?? String(name)};

  // Custom properties aren't in React.CSSProperties' type, so they're built
  // separately and merged into the cast style object below.
  const overrideVars: Record<string, string> = {};
  tokenOverrides?.forEach((hex, idx) => {
    if (hex) overrideVars[`--ld-illustration-token-${idx + 1}`] = hex;
  });

  return (
    <span
      {...labelProps}
      className={className}
      data-ld-illustration-theme={illustrationTheme}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: resolvedWidth,
        height: resolvedHeight,
        aspectRatio: resolvedWidth !== undefined && resolvedHeight !== undefined ? undefined : aspectRatio,
        ...overrideVars,
        ...style,
      } as React.CSSProperties}
      dangerouslySetInnerHTML={{__html: svg}}
    />
  );
}
