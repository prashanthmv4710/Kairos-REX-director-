/* ── Theme Manager ────────────────────────────────────────────────
 *  Thin wrapper around Theming.tsx for the root ld-kit app.
 *  Provides an imperative API (initTheme, setTheme, getTheme)
 *  used by IndexPage and AppNav.
 *
 *  THEME_PRESETS are re-exported from Theming.tsx
 *  which is the single source of truth for all theme presets.
 * ─────────────────────────────────────────────────────────────── */

import {
  THEME_PRESETS,
  THEME_FONT_CONFIG,
  applyTheme,
  loadThemeFonts,
  type ThemePreset,
  type ThemeName,
} from './Theming';

export { THEME_PRESETS, THEME_FONT_CONFIG, type ThemePreset };

const STORAGE_KEY = 'ld-kit-theme';
const MEGA_STORAGE_KEY = 'ld-kit-mega';
const DENSITY_ATTR = 'data-ld-density';
export const MEGA_CHANGE_EVENT = 'ld-kit-mega-change';

/* ── Module-level state ──────────────────────────────────────── */

let _currentTheme = 'Walmart';
let _megaMode = false;

/* ── Public API ──────────────────────────────────────────────── */

export function initTheme(): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && THEME_PRESETS[stored]) {
      _currentTheme = stored;
      applyTheme(stored as ThemeName);
      return;
    }
  } catch {
    // localStorage may be unavailable; fall back to default.
  }
  // Load fonts for the default theme
  loadThemeFonts(_currentTheme as ThemeName);
}

export function setTheme(name: string): void {
  if (!THEME_PRESETS[name]) return;
  _currentTheme = name;
  applyTheme(name as ThemeName);
}

export function getTheme(): string {
  return _currentTheme;
}

export function getThemeNames(): string[] {
  return Object.keys(THEME_PRESETS);
}

/* ── Mega mode ───────────────────────────────────────────────────
 * Scales the root font-size to 150% via a `data-ld-density` attribute
 * on <html>. Intended for in-store touch screens / kiosks where bigger
 * tap targets and larger type both matter. */

function applyMegaToDOM(enabled: boolean): void {
  if (typeof document === 'undefined') return;
  if (enabled) {
    document.documentElement.setAttribute(DENSITY_ATTR, 'mega');
  } else {
    document.documentElement.removeAttribute(DENSITY_ATTR);
  }
}

export function initMegaMode(): void {
  try {
    const stored = localStorage.getItem(MEGA_STORAGE_KEY);
    _megaMode = stored === '1';
  } catch {
    _megaMode = false;
  }
  applyMegaToDOM(_megaMode);
}

export function setMegaMode(enabled: boolean): void {
  _megaMode = enabled;
  applyMegaToDOM(enabled);
  try {
    localStorage.setItem(MEGA_STORAGE_KEY, enabled ? '1' : '0');
  } catch {
    // localStorage may be unavailable; toggle still applies in-session.
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(MEGA_CHANGE_EVENT, { detail: { enabled } }));
  }
}

export function getMegaMode(): boolean {
  return _megaMode;
}

/* ── Agent theme ─────────────────────────────────────────────────
 * A non-brand theming dimension for the Magic* gradient components
 * (MagicText, MagicFill, MagicBorder, MagicSurface), scoped via a
 * `data-agent-theme` attribute on <html> — independent of the brand
 * theme (`data-ld-theme`) and density (`data-ld-density`), so it can be
 * layered on top of any brand. Values live in src/themes/agent-themes.css.
 *
 * 'wibey-light'/'wibey' are listed here because that's still the attribute
 * value the generated CSS is keyed on, but they are NOT exposed through this
 * API's own app-wide switcher — unlike customer/partner/associate/developer,
 * Wibey's [data-agent-theme] blocks override nearly every semantic token
 * (background, fill, border, action-*, field-*, chart-*, nav-*, ...), so it
 * behaves like a full brand theme rather than a scoped accent. It's exposed
 * as "Wibey Light"/"Wibey Dark" brand options in the THEME_PRESETS dropdown
 * instead (see WIBEY_BRAND_TO_AGENT_THEME in Theming.tsx), which sets this
 * same `data-agent-theme` attribute as a side effect of applyTheme(). */

export const AGENT_THEME_NAMES = ['customer', 'partner', 'associate', 'developer', 'wibey-light', 'wibey'] as const;
export type AgentThemeName = (typeof AGENT_THEME_NAMES)[number];

const AGENT_THEME_ATTR = 'data-agent-theme';
const AGENT_THEME_STORAGE_KEY = 'ld-kit-agent-theme';
export const AGENT_THEME_CHANGE_EVENT = 'ld-kit-agent-theme-change';

let _agentTheme: AgentThemeName = 'developer';

function isAgentThemeName(value: string | null): value is AgentThemeName {
  return !!value && (AGENT_THEME_NAMES as readonly string[]).includes(value);
}

function applyAgentThemeToDOM(name: AgentThemeName): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute(AGENT_THEME_ATTR, name);
}

export function initAgentTheme(): void {
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(AGENT_THEME_STORAGE_KEY);
  } catch {
    stored = null;
  }
  _agentTheme = isAgentThemeName(stored) ? stored : 'developer';
  applyAgentThemeToDOM(_agentTheme);
}

/** Removes the app-wide `data-agent-theme` attribute from `<html>` and
 *  clears any persisted agent-theme from localStorage.
 *
 *  Call this on app init so stale developer-theme tokens from a previous
 *  session (or HMR reload) never leak into pages that don't opt-in to an
 *  agent theme. Agent themes should always be scoped locally via a wrapper
 *  `<div data-agent-theme={...}>` — never set on the document root. The one
 *  exception is Wibey, which applyTheme() (Theming.tsx) sets directly on
 *  `<html>` when "Wibey Light"/"Wibey Dark" is the active brand — this
 *  function only cleans up the customer/partner/associate/developer case. */
export function cleanAgentTheme(): void {
  if (typeof document !== 'undefined') {
    document.documentElement.removeAttribute(AGENT_THEME_ATTR);
  }
  try {
    localStorage.removeItem(AGENT_THEME_STORAGE_KEY);
  } catch {
    // localStorage may be unavailable; the DOM cleanup above already ran.
  }
}

export function setAgentTheme(name: AgentThemeName): void {
  if (!isAgentThemeName(name)) return;
  _agentTheme = name;
  applyAgentThemeToDOM(name);
  try {
    localStorage.setItem(AGENT_THEME_STORAGE_KEY, name);
  } catch {
    // localStorage may be unavailable; the switch still applies in-session.
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(AGENT_THEME_CHANGE_EVENT, { detail: { name } }));
  }
}

export function getAgentTheme(): AgentThemeName {
  return _agentTheme;
}
