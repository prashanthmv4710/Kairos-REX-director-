// @refresh reset

/**
 * @module Label
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
 * For prop API + usage notes, read `Label.md` in this folder
 * or run `npm run ld-kit -- show Label`.
 */

/**
 * @source PX
 * @ported-from notes/LD-PX-Starter-Kit - V2/client/components/ui/label.tsx
 *
 * PX form label. Slightly different slot API than ld-kit core's
 * `FormLabel` — kept as its own primitive for PX form-pattern parity.
 *
 * Changes from the source:
 * - `class-variance-authority`, `cn`, and the `peer-disabled:*` Tailwind
 *   selectors are dropped. Disabled-look styling is now handled by the
 *   `data-disabled` attribute (also set by `<Collapsible>` and other PX
 *   primitives) and by the consumer wrapping the label in their own
 *   disabled container.
 * - All inline-style font tokens move into `Label.css` so they behave
 *   correctly under theme overrides.
 */
import * as React from 'react';

import {cx} from '../../common/cx';

import './Label.css';

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Visually mark as disabled (also forwarded as `data-disabled`). */
  disabled?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  function Label({className, disabled, ...props}, ref) {
    return (
      <label
        ref={ref}
        data-disabled={disabled || undefined}
        className={cx('px-label', className)}
        {...props}
      />
    );
  },
);

Label.displayName = 'Label';
