// @refresh reset

/**
 * @module DataTableTitle
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
 * For prop API + usage notes, read `DataTableTitle.md` in this folder
 * or run `npm run ld-kit -- show DataTableTitle`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/ui/DataTableTitle.tsx
 *
 * AX Data Table Title — header bar above a `core/DataTable` with a title,
 * optional subtitle, and right-aligned actions slot.
 *
 * Changes from the source: CSS module → plain `.css` w/ BEM classes;
 * `UNSAFE_className` / `UNSAFE_style` → plain `className` / `style`.
 */
import * as React from 'react';

import {cx} from '../../common/cx';

import './DataTableTitle.css';

export interface DataTableTitleProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
  /** Title text. */
  children: React.ReactNode;
  /** Optional right-aligned actions (buttons, icons, etc.). */
  actions?: React.ReactNode;
  /** Optional subtitle / description below the title. */
  subtitle?: React.ReactNode;
}

export const DataTableTitle = React.forwardRef<HTMLDivElement, DataTableTitleProps>(
  ({children, actions, subtitle, className, ...rest}, ref) => (
    <div ref={ref} className={cx('ax-data-table-title', className)} {...rest}>
      <div className="ax-data-table-title__content">
        <h3 className="ax-data-table-title__title">{children}</h3>
        {subtitle ? <p className="ax-data-table-title__subtitle">{subtitle}</p> : null}
      </div>
      {actions ? <div className="ax-data-table-title__actions">{actions}</div> : null}
    </div>
  ),
);

DataTableTitle.displayName = 'DataTableTitle';

