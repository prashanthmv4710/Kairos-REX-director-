import * as React from 'react';
import {FONT_SANS} from './log-panel/constants';

/**
 * A11yFab — floating action button for the accessibility scanner.
 *
 * Always a 48px dark circle with an ♿-style a11y person icon.
 * A small badge at top-right communicates status (success/warning/error/count).
 * Expands LEFT on hover to show a text summary — icon stays anchored at right.
 * Click always toggles the log panel.
 *
 * States: default, scanning, success, warning, error, mixed.
 */

// ─── Design token values (inline for self-contained dev tooling) ─

// Semantic status colors
const COLOR_ERROR = '#ea1100';   // --ld-semantic-color-status-negative
const COLOR_WARNING = '#995213'; // --ld-semantic-color-status-warning
const COLOR_SUCCESS = '#2a8703'; // --ld-semantic-color-status-positive

// Neutral — matches GenLD Dev Tools FAB
const COLOR_SURFACE = 'rgba(28, 28, 30, 0.85)';
const COLOR_SURFACE_HOVER = 'rgba(44, 44, 46, 0.85)';
const COLOR_SURFACE_PRESSED = '#000';
const COLOR_TEXT = '#d1d5db';
const COLOR_RING_SCANNING = '#9ca3af'; // gray ring while scanning
const COLOR_ON_STATUS = '#fff'; // badge text + ring drawn against a status fill

// Elevation (--ld-semantic-elevation-300)
const SHADOW = '0 0.3125rem 0.625rem 0.1875rem #00000026, 0 -0.0625rem 0.25rem 0 #0000001a';

// Motion
const DURATION_FAST = '0.20s';    // --ld-semantic-duration-fast
const DURATION_MEDIUM = '0.30s';  // --ld-semantic-duration-medium
const DURATION_SLOWEST = '0.60s'; // --ld-semantic-duration-slowest
const EASE_OUT = 'cubic-bezier(0.165, 0.84, 0.44, 1)'; // --ld-semantic-timing-ease-out

// Sizing
const FAB_SIZE = 48;  // --ld-semantic-spacing-600
const BADGE_SIZE = 20;

// ─── Keyframe injector ──────────────────────────────────────────

let stylesInjected = false;
function injectStyles() {
  if (stylesInjected || typeof document === 'undefined') return;
  stylesInjected = true;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes a11y-fab-radar {
      0%   { transform: scale(1);   opacity: 0.6; border-width: 2px; }
      100% { transform: scale(1.5); opacity: 0;   border-width: 0.5px; }
    }
    @keyframes a11y-fab-ring-pulse {
      0%   { outline-color: rgba(156, 163, 175, 0); }
      18%  { outline-color: rgba(156, 163, 175, 1); }
      36%  { outline-color: rgba(156, 163, 175, 0.12); }
      54%  { outline-color: rgba(156, 163, 175, 1); }
      72%  { outline-color: rgba(156, 163, 175, 0.12); }
      90%  { outline-color: rgba(156, 163, 175, 1); }
      100% { outline-color: rgba(156, 163, 175, 0.4); }
    }
  `;
  document.head.appendChild(style);
}

// ─── SVG Icons ──────────────────────────────────────────────────

/**
 * A11yPersonIcon — the scanner's a11y-person mark. Exported (not just used
 * locally) so pages/A11ySystemPage.tsx's static docs illustrations can reuse
 * it instead of re-pasting the same two multi-hundred-character SVG paths,
 * and so it can be sized dynamically via the `size` prop instead of shipping
 * as a fixed-dimension static asset.
 */
export function A11yPersonIcon({size = 22, color = '#fff'}: {size?: number; color?: string}) {
  return (
    <svg width={size} height={size} viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M15.923 8.37599C16.8351 7.45584 17.3476 6.20784 17.3476 4.90654C17.3476 3.60525 16.8351 2.35725 15.923 1.43709C15.0109 0.516938 13.7738 0 12.4838 0C11.1938 0 9.95673 0.516938 9.04459 1.43709C8.13244 2.35725 7.61999 3.60525 7.61999 4.90654C7.61999 6.20784 8.13244 7.45584 9.04459 8.37599C9.95673 9.29615 11.1938 9.81308 12.4838 9.81308C13.7738 9.81308 15.0109 9.29615 15.923 8.37599ZM14.02 6.45623C13.6125 6.86723 13.06 7.09813 12.4838 7.09813C11.9076 7.09813 11.3551 6.86723 10.9476 6.45623C10.5402 6.04523 10.3113 5.48779 10.3113 4.90654C10.3113 4.3253 10.5402 3.76786 10.9476 3.35685C11.3551 2.94585 11.9076 2.71495 12.4838 2.71495C13.06 2.71495 13.6125 2.94585 14.02 3.35685C14.4274 3.76786 14.6563 4.3253 14.6563 4.90654C14.6563 5.48779 14.4274 6.04523 14.02 6.45623Z" fill={color} />
      <path d="M7.49031 14.0654C4.64932 13.3257 2.06052 11.8221 0 9.71495L2.26982 7.42523C3.61661 8.75433 5.21534 9.79569 6.97035 10.487C8.72537 11.1783 10.6006 11.5054 12.4838 11.4486C14.3724 11.5098 16.2538 11.1849 18.0147 10.4935C19.7756 9.80205 21.3796 8.75836 22.7302 7.42523L25 9.71495C22.9395 11.8221 20.3507 13.3257 17.5097 14.0654L18.6122 24.3364L19.0013 27.6075L15.7587 28L15.4021 24.729C15.3295 24.009 14.9938 23.342 14.4602 22.8582C13.9267 22.3744 13.2336 22.1084 12.5162 22.1121C11.7988 22.1084 11.1058 22.3744 10.5722 22.8582C10.0387 23.342 9.70288 24.009 9.63035 24.729L9.27366 28L6.03113 27.6075L6.38781 24.3364L7.49031 14.0654ZM14.2672 14.7196H10.7004L10.1816 19.3318C10.9121 19.0294 11.6942 18.8738 12.4838 18.8738C13.2692 18.853 14.0511 18.9863 14.786 19.2664L14.2672 14.7196Z" fill={color} />
    </svg>
  );
}

function CheckIcon({size = 10, color = '#fff'}: {size?: number; color?: string}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M5 13l4 4L19 7" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Badge ──────────────────────────────────────────────────────

type BadgeVariant = 'success' | 'warning' | 'error' | 'none';

function FabBadge({variant, count, visible}: {variant: BadgeVariant; count: number; visible: boolean}) {
  if (variant === 'none') return null;

  const isSuccess = variant === 'success';
  const color = variant === 'error' ? COLOR_ERROR : variant === 'warning' ? COLOR_WARNING : COLOR_SUCCESS;

  return (
    <div
      style={{
        position: 'absolute',
        top: -4,
        right: -2,
        minWidth: BADGE_SIZE,
        height: BADGE_SIZE,
        borderRadius: BADGE_SIZE / 2,
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `2px solid ${COLOR_ON_STATUS}`,
        padding: isSuccess ? 0 : '0 4px',
        boxSizing: 'border-box',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.5)',
        transition: `opacity ${DURATION_FAST} ${EASE_OUT}, transform ${DURATION_FAST} ${EASE_OUT}`,
        pointerEvents: 'none',
        // Sits in the BUTTON's stacking context (it's a sibling of the icon
        // circle), above the icon circle and its scanning animation.
        zIndex: 10,
      }}
    >
      {isSuccess ? (
        <CheckIcon size={10} color="#fff" />
      ) : (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: COLOR_ON_STATUS,
            lineHeight: 1,
            fontFamily: FONT_SANS,
          }}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  );
}

// ─── Radar sweep (scanning state) ───────────────────────────────

function RadarSweep({active}: {active: boolean}) {
  if (!active) return null;
  return (
    <div
      style={{
        position: 'absolute',
        inset: -4,
        borderRadius: '50%',
        border: `2px solid ${COLOR_SUCCESS}`,
        animation: `a11y-fab-radar ${DURATION_SLOWEST} ${EASE_OUT} forwards`,
        pointerEvents: 'none',
        zIndex: 1, // below the count badge
      }}
    />
  );
}

// ─── Hover text helper ──────────────────────────────────────────

function getHoverText(errorCount: number, warningCount: number): string {
  if (errorCount === 0 && warningCount === 0) return 'No issues detected';
  const parts: string[] = [];
  if (errorCount > 0) parts.push(`${errorCount} Error${errorCount !== 1 ? 's' : ''}`);
  if (warningCount > 0) parts.push(`${warningCount} Warning${warningCount !== 1 ? 's' : ''}`);
  return parts.join(', ');
}

// ─── Main Component ─────────────────────────────────────────────

export interface A11yFabProps {
  violationCount: number;
  errorCount: number;
  warningCount: number;
  resolvedCount: number;
  panelOpen: boolean;
  onTogglePanel: () => void;
  scanning?: boolean;
}

export function A11yFab({
  violationCount,
  errorCount,
  warningCount,
  panelOpen,
  onTogglePanel,
  scanning = false,
}: A11yFabProps): JSX.Element {
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const [focusVisible, setFocusVisible] = React.useState(false);
  const [sweepKey, setSweepKey] = React.useState(0);

  React.useEffect(() => { injectStyles(); }, []);

  // Trigger radar sweep when scanning starts
  React.useEffect(() => {
    if (scanning) setSweepKey((k) => k + 1);
  }, [scanning]);

  // Determine badge variant
  const isClean = violationCount === 0 && !scanning;
  let badgeVariant: BadgeVariant = 'none';
  if (isClean) badgeVariant = 'success';
  else if (errorCount > 0) badgeVariant = 'error';
  else if (warningCount > 0) badgeVariant = 'warning';

  // Determine ring color: none for default/success/error/warning, gray for scanning, accent for active panel
  let ringColor = 'transparent';
  if (scanning) ringColor = COLOR_RING_SCANNING;

  const hoverText = getHoverText(errorCount, warningCount);

  // Reveal the text summary on hover only. (Keyboard users get the same info
  // from the button's aria-label, announced on focus — expanding the pill on
  // focus too produced a confusing double label when multiple FABs are on the
  // page, e.g. the demo pages.)
  const showSummary = hovered && !panelOpen;

  const ariaLabel = isClean
    ? `No accessibility issues. ${panelOpen ? 'Close' : 'Open'} panel.`
    : `${violationCount} accessibility issue${violationCount !== 1 ? 's' : ''}. ${panelOpen ? 'Close' : 'Open'} panel.`;

  const handleFocus = (e: React.FocusEvent) => {
    try { setFocusVisible(e.target.matches(':focus-visible')); } catch { setFocusVisible(true); }
  };

  return (
    <div
      role="presentation"
      style={{
        position: 'fixed',
        bottom: 76,
        right: 22,
        zIndex: 2147483645,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <button
        type="button"
        data-ld-a11y-ignore="true"
        data-ld-a11y-devtool="true"
        aria-label={ariaLabel}
        onClick={onTogglePanel}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setPressed(false); }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onFocus={handleFocus}
        onBlur={() => setFocusVisible(false)}
        // Native <button> handles Enter/Space activation, focusability, and
        // role exposure for free — no onKeyDown polyfill needed.
        style={{
          all: 'unset', // strip UA button styling first, then re-apply below
          boxSizing: 'border-box',
          position: 'relative', // containing block + stable stacking context for the badge
          display: 'inline-flex',
          alignItems: 'center',
          height: FAB_SIZE,
          borderRadius: 9999,
          background: (pressed || panelOpen) ? COLOR_SURFACE_PRESSED : hovered ? COLOR_SURFACE_HOVER : COLOR_SURFACE,
          backdropFilter: 'blur(24px) saturate(150%)',
          WebkitBackdropFilter: 'blur(24px) saturate(150%)',
          boxShadow: SHADOW,
          cursor: 'pointer',
          fontFamily: FONT_SANS,
          WebkitFontSmoothing: 'antialiased',
          transition: `background ${DURATION_FAST} ${EASE_OUT}, transform ${DURATION_FAST} ${EASE_OUT}, backdrop-filter ${DURATION_FAST} ${EASE_OUT}`,
          transform: (pressed || panelOpen) ? 'scale(0.96)' : 'scale(1)',
          outline: (focusVisible && !panelOpen) ? '2px solid #60a5fa' : 'none',
          outlineOffset: 2,
          userSelect: 'none',
        }}
      >
        {/* Expandable text area (left side — grows leftward) */}
        <div
          style={{
            maxWidth: showSummary ? 220 : 0,
            opacity: showSummary ? 1 : 0,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            height: FAB_SIZE,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: `max-width ${DURATION_MEDIUM} ${EASE_OUT}, opacity ${DURATION_FAST} ${EASE_OUT}`,
          }}
        >
          <span
            style={{
              paddingLeft: 16,
              paddingRight: 4,
              fontSize: 12,
              fontWeight: 600,
              color: COLOR_TEXT,
            }}
          >
            {hoverText}
          </span>
        </div>

        {/* Icon circle (right side — always 48px, stays anchored) */}
        <div
          style={{
            position: 'relative',
            width: FAB_SIZE,
            height: FAB_SIZE,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            outline: ringColor !== 'transparent' ? `3px solid ${ringColor}` : 'none',
            outlineOffset: 2,
            animation: scanning ? `a11y-fab-ring-pulse 2s ${EASE_OUT} forwards` : 'none',
            transition: `outline-color ${DURATION_FAST} ${EASE_OUT}`,
          }}
        >
          <A11yPersonIcon size={24} color="#fff" />

          {/* Scanning radar sweep */}
          <RadarSweep active={scanning} key={sweepKey} />
        </div>

        {/* Status badge — rendered as a sibling of the icon circle (a direct
            child of the button) so the icon circle's scanning animation, which
            creates a stacking context, can never trap it behind the ring or
            sweep. Pinned to the button's top-right, which coincides with the
            icon circle's corner since the icon is flush-right. */}
        <FabBadge variant={badgeVariant} count={violationCount} visible={!scanning} />
      </button>
    </div>
  );
}
