// @refresh reset

/**
 * @module ClockStatus
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
 * For prop API + usage notes, read `ClockStatus.md` in this folder
 * or run `npm run ld-kit -- show ClockStatus`.
 */

import * as React from 'react';

export type ClockState = 'clocked-out' | 'clocked-in';

export interface ClockStatusProps {
  active: boolean;
}

/**
 * Clock-in / clock-out indicator dot, sourced from the AX Component Library
 * Figma (`AX/Clock Status — Large`).
 */
export const ClockStatus: React.FC<ClockStatusProps> = ({active}) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
    <circle
      cx="9"
      cy="9"
      r="9"
      fill="var(--ld-semantic-color-background, #ffffff)"
    />
    <circle
      cx="9"
      cy="9"
      r="7.5"
      fill={
        active
          ? 'var(--ld-semantic-color-fill-positive, #2a8703)'
          : 'var(--ld-semantic-color-fill-subtle, #f8f8f8)'
      }
      stroke={
        active
          ? 'var(--ld-semantic-color-border-positive-bold, #1d5f02)'
          : 'var(--ld-semantic-color-border-subtle, #515357)'
      }
      strokeWidth="1"
    />
    {active ? (
      <circle
        cx="9"
        cy="9"
        r="2"
        fill="var(--ld-semantic-color-background, #ffffff)"
      />
    ) : null}
  </svg>
);

export const ClockOut = () => <ClockStatus active={false} />;
export const ClockIn = () => <ClockStatus active />;
