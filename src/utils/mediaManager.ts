/* ── Media Manager ────────────────────────────────────────────────
 *  Single import surface for tenant-specific brand media (logos,
 *  wordmarks, card art, error states). Combines the runtime barrels
 *  in src/media (inline-SVG strings and imported PNG asset URLs) with the
 *  manifest metadata (token, dims, kind).
 *
 *  Media is keyed by *tenant*. The pipeline emits one entry per
 *  MEDIA_THEMES key in `airtable-sync/config.mjs`, with each tenant's
 *  asset set fully merged across its `inherits` chain (own overrides
 *  win). Current tenants:
 *
 *    wcp                — root for the Walmart family
 *    walmart-business   — inherits wcp
 *    walmart-mx         — inherits wcp
 *    walmart-ca         — inherits wcp
 *    walmart-plus       — inherits wcp
 *    sams-club          — inherits wcp (then adds Sam's-specific marks)
 *    sams-club-maverick — inherits sams-club
 *    members-mark       — inherits sams-club
 *    bodega             — inherits wcp
 *
 *  Each tenant is self-contained: `getMedia('walmart-business', name)`
 *  resolves an inherited WCP asset too. Use
 *  getMediaTenantForTheme(theme) to pick the most-specific tenant for
 *  the active theme, or useThemeMediaTenant() for the React hook.
 *
 *  Pair with src/context/media.mdc.
 * ─────────────────────────────────────────────────────────────── */

import manifest from '../media/manifest.json';
import { MEDIA_SVGS, MEDIA_IMAGES, MEDIA_TOKENS } from '../media';
import { useThemeMediaKey } from './Theming';
import {
  type MediaTenant,
  THEME_MEDIA_TENANT,
  getMediaTenantForTheme,
  useThemeMediaTenant,
} from './mediaTenant';

/** Coarse 3-bucket key (`wcp` | `sams-club` | `bodega`) re-exported for
 *  legacy consumers that pre-date the 10-tenant expansion. Prefer
 *  useThemeMediaTenant() for new code. */
export { useThemeMediaKey };

/** Fine-grained (10-tenant) theme→tenant mapping and resolvers, split into
 *  ./mediaTenant so asset-free consumers (e.g. <Logo>) can use them without
 *  pulling in this module's eager media barrel. Re-exported here so existing
 *  `from './mediaManager'` imports keep working unchanged. */
export { THEME_MEDIA_TENANT, getMediaTenantForTheme, useThemeMediaTenant };

/* ── Types ───────────────────────────────────────────────────── */

export type { MediaTenant };
export type MediaKind = 'svg' | 'png';

export interface MediaAsset {
  name: string;
  token: string;
  kind: MediaKind;
  width: number;
  height: number;
}

export interface MediaLookup {
  kind: MediaKind;
  /** Inline SVG markup. Present when kind === 'svg'. */
  svg?: string;
  /** Bundler-resolved PNG asset URL. Present when kind === 'png'. */
  src?: string;
  token: string;
  width: number;
  height: number;
}

/* ── Manifest queries ────────────────────────────────────────── */

export function listTenants(): MediaTenant[] {
  return Object.keys(manifest) as MediaTenant[];
}

export function getTenantInfo(tenant: MediaTenant): { label: string; count: number } {
  const entry = manifest[tenant];
  return { label: entry.label, count: entry.count };
}

export function listMedia(tenant: MediaTenant): MediaAsset[] {
  const entry = manifest[tenant];
  if (!entry) return [];
  return entry.assets.map((a) => ({
    name: a.name,
    token: a.token,
    kind: a.kind === 'png' ? 'png' : 'svg',
    width: a.width ?? 0,
    height: a.height ?? 0,
  }));
}

export function hasMedia(tenant: MediaTenant, name: string): boolean {
  const entry = manifest[tenant];
  if (!entry) return false;
  return entry.assets.some((a) => a.name === name);
}

export function searchMedia(tenant: MediaTenant, query: string): MediaAsset[] {
  const all = listMedia(tenant);
  const q = query.trim().toLowerCase();
  if (!q) return all;
  return all.filter((a) => a.name.toLowerCase().includes(q));
}

/**
 * Resolve a tenant asset to its renderable payload. Returns `null` if the
 * name doesn't exist for the tenant — that usually means a stale generated
 * module; re-run `npm run airtable:pull-media`.
 *
 * Inheritance is already merged into the tenant's manifest entry and runtime
 * barrel, so `getMedia('walmart-business', 'LogoSpark')` returns the WCP
 * default unless `walmart-business` has its own override.
 */
export function getMedia(tenant: MediaTenant, name: string): MediaLookup | null {
  const entry = manifest[tenant];
  const asset = entry?.assets.find((a) => a.name === name);
  if (!asset) {
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(`[Media] Unknown ${tenant} asset: "${name}". Run npm run airtable:pull-media.`);
    }
    return null;
  }
  const kind: MediaKind = asset.kind === 'png' ? 'png' : 'svg';
  const width = asset.width ?? 0;
  const height = asset.height ?? 0;
  const token = asset.token;

  if (kind === 'svg') {
    const svg = MEDIA_SVGS[tenant]?.[name];
    return svg ? { kind, svg, token, width, height } : null;
  }
  const src = MEDIA_IMAGES[tenant]?.[name];
  return src ? { kind, src, token, width, height } : null;
}

/** Airtable token associated with the asset (e.g. `wcp-primitive-media-logoSpark`). */
export function getMediaToken(tenant: MediaTenant, name: string): string | null {
  return MEDIA_TOKENS[tenant]?.[name] ?? null;
}
