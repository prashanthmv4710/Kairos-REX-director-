// @refresh reset

/**
 * @module HeaderInstructional
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
 * For prop API + usage notes, read `HeaderInstructional.md` in this folder
 * or run `npm run ld-kit -- show HeaderInstructional`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/ui/HeaderInstructional.tsx
 *
 * AX Header Instructional — top-of-screen header that gives overall context
 * for an L2 screen and surfaces an optional trailing navigation action.
 *
 * - Single fixed size (heading-large title)
 * - Optional item count, description, and trailing nav action
 * - Trailing action: `'None' | 'Chevron' | 'LinkButton'`
 *
 * Changes from the source:
 * - CSS Module (`HeaderInstructional.module.css`) → plain `.css` using
 *   `ax-header-instructional-*` BEM classes.
 * - The chevron / link-button now use `core/Icons.ChevronRightIcon` and
 *   `core/LinkButton` instead of the AX kit's `ui/` copies.
 * - `UNSAFE_className` / `UNSAFE_style` dropped in favour of plain `className`
 *   / `style` to match how AX components are landed in ld-kit.
 */
import * as React from 'react';

import {cx} from '../../common/cx';
import {ChevronRightIcon} from '../Icons';
import {LinkButton} from '../LinkButton/LinkButton';

import './HeaderInstructional.css';

export type HeaderInstructionalNavigation = 'None' | 'Chevron' | 'LinkButton';

export interface HeaderInstructionalProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
  /** Title text. Truncated after 2 lines. */
  title: string;
  /** Optional item count rendered as `(N)` after the title. */
  count?: number | null;
  /** Optional description below the title. Truncated after 3 lines. */
  description?: string | null;
  /** Add bottom padding below the content. @default false */
  bottomPadding?: boolean;
  /** Trailing action type. @default 'None' */
  navigation?: HeaderInstructionalNavigation;
  /** Label for the trailing LinkButton (used only with `navigation="LinkButton"`). */
  trailingLabel?: string;
  /** Fires when the chevron / link button is activated. */
  onTrailingAction?: () => void;
}

export const HeaderInstructional = React.forwardRef<
  HTMLDivElement,
  HeaderInstructionalProps
>(
  (
    {
      title,
      count = null,
      description = null,
      bottomPadding = false,
      navigation = 'None',
      trailingLabel = 'Button label',
      onTrailingAction,
      className,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cx('ax-header-instructional', className)}
        {...rest}
      >
        <div className="ax-header-instructional__top-padding" aria-hidden />

        <div className="ax-header-instructional__content">
          <div className={cx('ax-header-instructional__title-row', navigation === 'Chevron' && 'ax-header-instructional__title-row--chevron')}>
            <h2 className="ax-header-instructional__title-and-count">
              <span className="ax-header-instructional__title">{title}</span>
              {count != null ? (
                <span className="ax-header-instructional__count-wrapper">
                  <span className="ax-header-instructional__count">({count})</span>
                </span>
              ) : null}
            </h2>

            {navigation === 'Chevron' ? (
              <button
                type="button"
                className="ax-header-instructional__chevron-button"
                onClick={onTrailingAction}
                aria-label={`${title}${count != null ? ` (${count})` : ''}, navigate forward`}
              >
                <ChevronRightIcon size="small" />
              </button>
            ) : null}

            {navigation === 'LinkButton' ? (
              <div className="ax-header-instructional__trailing-action">
                <LinkButton size="small" onClick={onTrailingAction}>
                  {trailingLabel}
                </LinkButton>
              </div>
            ) : null}
          </div>

          {description ? (
            <p className="ax-header-instructional__description">{description}</p>
          ) : null}
        </div>

        {bottomPadding ? (
          <div className="ax-header-instructional__bottom-padding" aria-hidden />
        ) : null}
      </div>
    );
  },
);

HeaderInstructional.displayName = 'HeaderInstructional';

