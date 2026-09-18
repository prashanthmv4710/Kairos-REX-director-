// @refresh reset

/**
 * @module HeaderSection
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
 * For prop API + usage notes, read `HeaderSection.md` in this folder
 * or run `npm run ld-kit -- show HeaderSection`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/ui/HeaderSection.tsx
 *
 * AX Header Section — defines screen sections and creates typographic
 * hierarchy within a screen.
 *
 * - **medium** — heading-medium title + optional count + LinkButton trailing
 *   action
 * - **small** — heading-small title + optional count + chevron expand /
 *   collapse toggle
 *
 * Changes from the source:
 * - CSS Module → plain `.css` with `ax-header-section-*` BEM classes.
 * - The chevron / link-button now use `core/Icons` (`ChevronUpIcon`,
 *   `ChevronDownIcon`) and `core/LinkButton`.
 * - Divider switched to `core/Divider` (already decorative by default —
 *   `decorative` prop dropped).
 * - `UNSAFE_className` / `UNSAFE_style` dropped in favour of plain
 *   `className` / `style`.
 */
import * as React from 'react';

import {cx} from '../../common/cx';
import {Divider} from '../Divider/Divider';
import {ChevronDownIcon, ChevronUpIcon} from '../Icons';
import {LinkButton} from '../LinkButton/LinkButton';

import './HeaderSection.css';

export type HeaderSectionSize = 'medium' | 'small';

export interface HeaderSectionProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
  /** Size variant. @default 'medium' */
  size?: HeaderSectionSize;
  /** Title text. Truncated after 2 lines. */
  title: string;
  /** Optional item count rendered as `(N)` after the title. */
  count?: number | null;
  /** Optional description below the title. Truncated after 3 lines. */
  description?: string | null;
  /**
   * Label for the trailing LinkButton (medium only).
   * @default 'Button label'
   */
  trailingLabel?: string;
  /**
   * Fires when the trailing action is triggered. For `medium`, on LinkButton
   * click; for `small`, on chevron click. Providing this for `small` does not
   * disable the internal expanded state — pair with `expanded` to control it
   * externally.
   */
  onTrailingAction?: () => void;
  /**
   * Controlled expanded state for `small`. When provided, the chevron icon
   * reflects this value and the internal toggle is bypassed.
   */
  expanded?: boolean;
  /** Render a `core/Divider` at the bottom. @default true */
  showDivider?: boolean;
  /**
   * Adds left + right padding to the content area. The divider stays
   * full-width.
   * @default false
   */
  contentInset?: boolean;
}

export const HeaderSection = React.forwardRef<HTMLDivElement, HeaderSectionProps>(
  (
    {
      size = 'medium',
      title,
      count = null,
      description = null,
      trailingLabel = 'Button label',
      onTrailingAction,
      expanded: expandedProp,
      showDivider = true,
      contentInset = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const [internalExpanded, setInternalExpanded] = React.useState(true);
    const isControlled = expandedProp !== undefined;
    const expanded = isControlled ? expandedProp : internalExpanded;
    const isSmall = size === 'small';

    const handleSmallToggle = () => {
      if (!isControlled) {
        setInternalExpanded((prev) => !prev);
      }
      onTrailingAction?.();
    };

    return (
      <div
        ref={ref}
        className={cx('ax-header-section', className)}
        {...rest}
      >
        <div className="ax-header-section__content">
          {contentInset ? (
            <div className="ax-header-section__padding-left" aria-hidden />
          ) : null}

          <div className="ax-header-section__inner">
            <div
              className={cx(
                'ax-header-section__title-row',
                isSmall
                  ? 'ax-header-section__title-row--small'
                  : 'ax-header-section__title-row--medium',
              )}
            >
              <h2 className="ax-header-section__title-and-count">
                <span
                  className={
                    isSmall
                      ? 'ax-header-section__title--small'
                      : 'ax-header-section__title--medium'
                  }
                >
                  {title}
                </span>
                {count != null ? (
                  <span className="ax-header-section__count-wrapper">
                    <span className="ax-header-section__count">({count})</span>
                  </span>
                ) : null}
              </h2>

              {isSmall ? (
                <button
                  type="button"
                  className="ax-header-section__chevron-button"
                  onClick={handleSmallToggle}
                  aria-expanded={expanded}
                  aria-label={`${title}${count != null ? ` (${count})` : ''}, section`}
                >
                  {expanded ? (
                    <ChevronUpIcon size="medium" />
                  ) : (
                    <ChevronDownIcon size="medium" />
                  )}
                </button>
              ) : (
                <div className="ax-header-section__trailing-action--medium">
                  <LinkButton size="small" onClick={onTrailingAction}>
                    {trailingLabel}
                  </LinkButton>
                </div>
              )}
            </div>

            {description ? (
              <p className="ax-header-section__description">{description}</p>
            ) : null}
          </div>

          {contentInset ? (
            <div className="ax-header-section__padding-right" aria-hidden />
          ) : null}
        </div>

        <div className="ax-header-section__bottom-padding" aria-hidden />

        {showDivider ? <Divider /> : null}
      </div>
    );
  },
);

HeaderSection.displayName = 'HeaderSection';

