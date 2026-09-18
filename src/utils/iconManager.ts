/* ── Icon Manager ─────────────────────────────────────────────────
 *  Single import surface for everything icon-related.
 *
 *  Theme→font helpers are re-exported from Theming.tsx (the source
 *  of truth). Manifest-query helpers (listIcons, hasIcon,
 *  searchIcons, getIconsForTheme, …) are layered on top by reading
 *  src/fonts/icon-manifest.json.
 *
 *  Pair with src/context/icons.mdc — that file orients agents to
 *  this module.
 * ─────────────────────────────────────────────────────────────── */

import iconManifest from '../fonts/icon-manifest.json';
import {
  THEME_FONT_CONFIG,
  FONT_CSS_CLASS,
  getThemePrimaryIconFont,
  getThemeIconCssPrefix,
  useThemeIconPrefix,
  useThemeMediaKey,
  loadIconFont,
  type ThemeName,
} from './Theming';

export {
  THEME_FONT_CONFIG,
  FONT_CSS_CLASS,
  getThemePrimaryIconFont,
  getThemeIconCssPrefix,
  useThemeIconPrefix,
  useThemeMediaKey,
  loadIconFont,
};

/* ── Types ───────────────────────────────────────────────────── */

export type IconFontKey = keyof typeof iconManifest;

export interface IconFontInfo {
  label: string;
  fontFamily: string;
  cssClass: string;
  count: number;
}

/* ── Manifest queries ────────────────────────────────────────── */

export function listIconFonts(): IconFontKey[] {
  return Object.keys(iconManifest) as IconFontKey[];
}

export function getIconFontInfo(font: IconFontKey): IconFontInfo {
  const entry = iconManifest[font];
  return {
    label: entry.label,
    fontFamily: entry.fontFamily,
    cssClass: entry.cssClass,
    count: entry.count,
  };
}

export function listIcons(font: IconFontKey): string[] {
  return iconManifest[font]?.icons ?? [];
}

export function hasIcon(font: IconFontKey, name: string): boolean {
  return listIcons(font).includes(name);
}

export function searchIcons(font: IconFontKey, query: string): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return listIcons(font);
  return listIcons(font).filter((n) => n.toLowerCase().includes(q));
}

/* ── Theme-aware lookups ─────────────────────────────────────── */

/** Names of icons available in the theme's primary icon font.
 *  Mirrors what the Icon component will actually render. */
export function getIconsForTheme(theme: ThemeName): string[] {
  const fontKey = getThemePrimaryIconFont(theme) as IconFontKey;
  return listIcons(fontKey);
}

export function hasIconForTheme(theme: ThemeName, name: string): boolean {
  const fontKey = getThemePrimaryIconFont(theme) as IconFontKey;
  return hasIcon(fontKey, name);
}

/** Icon names present in every icon font — safe to use regardless of theme. */
export function getCommonIcons(): string[] {
  const fonts = listIconFonts();
  if (fonts.length === 0) return [];
  const [first, ...rest] = fonts;
  const baseline = new Set(listIcons(first));
  for (const font of rest) {
    const next = new Set(listIcons(font));
    for (const name of baseline) {
      if (!next.has(name)) baseline.delete(name);
    }
  }
  return Array.from(baseline).sort();
}
