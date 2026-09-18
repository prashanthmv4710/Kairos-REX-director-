'use client';
// @refresh reset

/**
 * @module Logo
 *
 * # CRITICAL AGENT DIRECTIVE - HARD STOP
 * 
 * This file is read-only output. Treat it as immutable.
 * 
 * - NEVER edit this file directly.
 * - NEVER apply "quick fixes" in this file.
 * - NEVER reformat, refactor, or rewrite content in place.
 * - NEVER treat this file as the source of truth.
 * 
 * If behavior must change, modify the upstream source of this content (the canonical source), not this copy.
 * 
 * Any direct edits in this file are invalid and must be rejected.
 *
 * For prop API + usage notes, read `Logo.md` in this folder
 * or run `npm run ld-kit -- show Logo`.
 */

import * as React from 'react';
import type {CSSProperties} from 'react';
import {getCurrentTheme, type ThemeName} from '../../utils/Theming';
// Resolve the fine-grained (10-tenant) media tenant, NOT useThemeMediaKey()/
// getThemePrimaryIconFont() from Theming — those collapse every theme down to
// its coarse icon-FONT bucket (`wcp` | `sams-club` | `bodega`), which would
// silently show the wrong tenant's mark for Walmart+, Walmart B2B, Sam's Club
// Maverick, and Member's Mark (each has its own TopNavLogoCompact override —
// see src/media/manifest.json). ./mediaTenant is split out from
// mediaManager.ts specifically so this stays asset-free (see its header).
import {
  getMediaTenantForTheme,
  useThemeMediaTenant,
} from '../../utils/mediaTenant';
// Import from the asset-free loaders module, NOT '../../media' — the latter's
// eager aggregates statically import every brand's media, so importing it here
// would bundle all tenant PNGs/SVGs into any app that uses <Logo>. The loaders
// are pure dynamic-import thunks, so each tenant stays its own async chunk.
// `./svg-loaders`, NOT `./loaders`: the barrel also re-exports MEDIA_IMAGE_LOADERS,
// whose dynamic imports reach the tenant modules that carry PNG asset imports. A
// bundler emits an asset once it is in the module graph — before tree-shaking
// decides the chunk is dead — so importing the barrel here wrote every brand PNG
// into consumers' dist/, unreferenced by any chunk.
import {MEDIA_SVG_LOADERS} from '../../media/svg-loaders';
import './Logo.css';

interface LogoProps {
  /** Glyph name as it appears in Airtable (e.g. "Logo", "Wordmark", "LogoInverse"). Default: "Logo". */
  name?: string;
  /** Logo height in px. Width follows the SVG's intrinsic aspect ratio. */
  size?: number;
  /** Override the active tenant; defaults to the current theme. */
  tenant?: ThemeName;
  /** Accessible label. Defaults to `${tenant} Homepage`. */
  a11yLabel?: string;
  className?: string;
  style?: CSSProperties;
  title?: string;
}

export function Logo({
  name = 'Logo',
  size = 36,
  tenant,
  a11yLabel,
  className,
  style,
  title,
}: LogoProps) {
  const runtimeKey = useThemeMediaTenant();
  const mediaKey = tenant ? getMediaTenantForTheme(tenant) : runtimeKey;

  // Media is loaded per-tenant on demand (code-split) rather than importing
  // the whole MEDIA_SVGS aggregate — that would pull every brand's assets into
  // any bundle that uses <Logo>. Each tenant is its own async chunk, so only
  // the active theme's media downloads. Until it resolves (and if the name
  // doesn't exist for the tenant) we render nothing, same as before.
  const [svg, setSvg] = React.useState<string | null>(null);
  React.useEffect(() => {
    let active = true;
    const loader = MEDIA_SVG_LOADERS[mediaKey];
    if (!loader) {
      setSvg(null);
      return;
    }
    loader()
      .then((set) => {
        if (active) setSvg(set[name] ?? null);
      })
      .catch(() => {
        if (active) setSvg(null);
      });
    return () => {
      active = false;
    };
  }, [mediaKey, name]);

  if (!svg) return null;

  const label = a11yLabel ?? `${tenant ?? getCurrentTheme()} Homepage`;

  return (
    <span
      role="img"
      aria-label={label}
      title={title}
      className={`ld-logo${className ? ` ${className}` : ''}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: size,
        lineHeight: 0,
        ...style,
      }}
      dangerouslySetInnerHTML={{__html: svg}}
    />
  );
}
