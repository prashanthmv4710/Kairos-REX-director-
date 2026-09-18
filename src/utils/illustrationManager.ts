/* ── Illustration Manager ─────────────────────────────────────────
 *  Single import surface for inline-SVG illustrations.
 *
 *  Component + per-name lookups are re-exported from Illustration.tsx
 *  (the source of truth). Discovery helpers (listIllustrationTypes,
 *  hasIllustration, searchIllustrations) are layered on top by
 *  reading src/illustrations/manifest.json.
 *
 *  Pair with src/context/illustrations.mdc.
 * ─────────────────────────────────────────────────────────────── */

import manifest from '../illustrations/manifest.json';
import {
  Illustration,
  getIllustration,
  listIllustrations,
  getIllustrationTypeInfo,
  type IllustrationType,
  type IllustrationName,
  type IllustrationProps,
  type IllustrationLookup,
  type IllustrationNamesByType,
} from './Illustration';

export {
  Illustration,
  getIllustration,
  listIllustrations,
  getIllustrationTypeInfo,
};
export type {
  IllustrationType,
  IllustrationName,
  IllustrationProps,
  IllustrationLookup,
  IllustrationNamesByType,
};

/* ── Discovery helpers ───────────────────────────────────────── */

export function listIllustrationTypes(): IllustrationType[] {
  return Object.keys(manifest) as IllustrationType[];
}

export function hasIllustration<T extends IllustrationType>(
  type: T,
  name: string,
): name is IllustrationName<T> & string {
  const entry = manifest[type];
  if (!entry) return false;
  return entry.items.some((i) => i.name === name);
}

export function searchIllustrations<T extends IllustrationType>(
  type: T,
  query: string,
): Array<IllustrationName<T>> {
  const entry = manifest[type];
  if (!entry) return [];
  const q = query.trim().toLowerCase();
  const names = entry.items.map((i) => i.name);
  const filtered = q ? names.filter((n) => n.toLowerCase().includes(q)) : names;
  return filtered as Array<IllustrationName<T>>;
}
