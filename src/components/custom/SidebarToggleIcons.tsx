import * as React from 'react';

/**
 * Sidebar expand/collapse glyphs — sourced from the Figma "[PX] ArrowRightLine"
 * and "[PX] ArrowLineLeft" icons (node 12642:73191, RPM user journey file).
 * No equivalent exists in the Living Design icon font sets (`ld`, `wcp`,
 * `sams-club`, …), which only offer the plain `ArrowLeft` / `ArrowRight`
 * glyphs — these carry the "line" bar that marks them as panel/rail
 * expand-collapse affordances rather than generic directional arrows.
 *
 * Always used next to a text label or with an `aria-label` on the button
 * that hosts them — always rendered `aria-hidden` here.
 */

type SidebarToggleIconProps = {
  className?: string;
  style?: React.CSSProperties;
};

/** "[PX] ArrowRightLine" — sidebar collapsed, click to expand. */
export function ArrowRightLineIcon({ className, style }: SidebarToggleIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.99997 7.51367L10.3662 7.5127L8.38669 5.4082L9.12302 4.75L11.8691 7.6709C12.0437 7.85689 12.0436 8.14303 11.8691 8.3291L9.12302 11.25L8.38669 10.5918L10.3662 8.48633L4.99997 8.4873V14H3.99997V1.99902H4.99997V7.51367Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** "[PX] ArrowLineLeft" — sidebar expanded/locked, click to collapse. */
export function ArrowLineLeftIcon({ className, style }: SidebarToggleIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9998 14H10.9998V8.48535L5.63354 8.48633L7.61303 10.5908L6.8767 11.249L4.13061 8.32812C3.95601 8.14208 3.95601 7.85596 4.13061 7.66992L6.8767 4.74902L7.61303 5.40723L5.63354 7.5127L10.9998 7.51172V1.99902H11.9998V14Z"
        fill="currentColor"
      />
    </svg>
  );
}
