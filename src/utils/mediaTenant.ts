/* ── Theme → Media Tenant Mapping ─────────────────────────────────
 *  Split out from mediaManager.ts so consumers that only need the
 *  theme→tenant resolution (e.g. <Logo>, which lazy-loads assets via
 *  MEDIA_SVG_LOADERS) don't transitively import mediaManager's eager
 *  `../media` barrel. That barrel statically imports every tenant's
 *  PNG/SVG assets, and a bundler emits a module's assets from the
 *  import graph before tree-shaking can decide the chunk is dead — so
 *  merely importing mediaManager.ts (even for an unrelated named
 *  export) would pull every brand's media into the consuming bundle.
 *  `manifest.json` is plain metadata (name/token/kind/width/height),
 *  not asset bytes, so importing it here is cheap.
 * ─────────────────────────────────────────────────────────────── */

import * as React from 'react';
import manifest from '../media/manifest.json';
import { getCurrentTheme, type ThemeName } from './Theming';

export type MediaTenant = keyof typeof manifest;

/** Most-specific media tenant for each runtime theme. Themes that
 *  don't have a brand-specific tenant fall back to the closest
 *  ancestor — `wcp` for the Walmart family, `sams-club` for the
 *  warehouse-club family. Keep this aligned with
 *  airtable-sync/config.mjs::MEDIA_THEMES. */
export const THEME_MEDIA_TENANT: Record<ThemeName, MediaTenant> = {
  'Walmart':         'wcp',
  "Sam's Club":      'sams-club',
  "Sam's Club Maverick": 'sams-club-maverick',
  'Walmart B2B':     'walmart-business',
  'Bodega':          'bodega',
  'Cashi MX':        'wcp',
  'Data Ventures':   'wcp',
  'Walmart+':        'walmart-plus',
  "Member's Mark":   'members-mark',
  // Wibey has no brand-specific media tenant of its own — falls back to the
  // Walmart family, same as Cashi MX/Data Ventures above.
  'Wibey Light':     'wcp',
  'Wibey Dark':      'wcp',
};

/** Resolve a runtime theme to its most-specific media tenant. Falls back to
 *  `wcp` if the theme isn't in the mapping (e.g. a future theme name). */
export function getMediaTenantForTheme(theme: ThemeName): MediaTenant {
  return THEME_MEDIA_TENANT[theme] ?? 'wcp';
}

/** React hook returning the most-specific media tenant for the active theme.
 *  Re-derives on every `ld-kit-theme-change` event. */
export function useThemeMediaTenant(): MediaTenant {
  const [tenant, setTenant] = React.useState<MediaTenant>(() =>
    getMediaTenantForTheme(getCurrentTheme()),
  );

  React.useEffect(() => {
    const handler = (e: Event) => {
      const next = (e as CustomEvent).detail?.theme as ThemeName | undefined;
      if (next) setTenant(getMediaTenantForTheme(next));
    };
    window.addEventListener('ld-kit-theme-change', handler);
    return () => window.removeEventListener('ld-kit-theme-change', handler);
  }, []);

  return tenant;
}
