// @refresh reset

/**
 * @module MegaNavActionButton
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
 * For prop API + usage notes, read `MegaNavActionButton.md` in this folder
 * or run `npm run ld-kit -- show MegaNavActionButton`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/walmart/MegaNavActionButton.tsx
 *
 * AX MegaNav Action Button — vertical icon-over-label tile used inside
 * dark mega-nav strips.
 *
 * Adaptation: `UNSAFE_className` dropped in favour of plain `className`.
 */
import * as React from 'react';

import {cx} from '../../common/cx';

import './MegaNavActionButton.css';

export interface MegaNavActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}

export const MegaNavActionButton: React.FC<MegaNavActionButtonProps> = ({
  icon,
  label,
  onClick,
  className,
}) => (
  <button
    type="button"
    className={cx('ax-meganav-action-btn', className)}
    onClick={onClick}
  >
    <span className="ax-meganav-action-btn__icon" aria-hidden>
      {icon}
    </span>
    <span className="ax-meganav-action-btn__label">{label}</span>
  </button>
);

MegaNavActionButton.displayName = 'MegaNavActionButton';

