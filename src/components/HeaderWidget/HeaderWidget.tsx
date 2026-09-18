// @refresh reset

/**
 * @module HeaderWidget
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
 * For prop API + usage notes, read `HeaderWidget.md` in this folder
 * or run `npm run ld-kit -- show HeaderWidget`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/ui/HeaderWidget.tsx
 *
 * AX Header Widget — concise title + optional count + optional description +
 * optional trailing action for a self-contained widget (a card / section
 * within a screen). Use once per widget, positioned at the top.
 *
 * - Trailing action: `'None' | 'Chevron' | 'LinkButton'`
 * - Optional bottom divider
 * - `type='Error'` renders a `core/Alert` (warning variant) below the
 *   content
 *
 * Changes from the source:
 * - CSS Module → plain `.css` with `ax-header-widget-*` BEM classes.
 * - Chevron / LinkButton use `core/Icons.ChevronRightIcon` and
 *   `core/LinkButton`.
 * - Divider switched to `core/Divider` (decorative by default).
 * - Source rendered the alert action with a custom inline `<button>` passed
 *   through an `action` prop. `core/Alert` instead takes
 *   `actionButtonProps={{children, onClick}}`, so this port forwards the
 *   alert action through that shape — visual styling now follows
 *   `core/Alert.AlertActionButton` rather than the source's bespoke
 *   underlined button.
 * - `UNSAFE_className` / `UNSAFE_style` dropped in favour of plain
 *   `className` / `style`.
 */
import * as React from 'react';

import {cx} from '../../common/cx';
import {Alert} from '../Alert/Alert';
import {Divider} from '../Divider/Divider';
import {ChevronRightIcon} from '../Icons';
import {LinkButton} from '../LinkButton/LinkButton';

import './HeaderWidget.css';

export type HeaderWidgetNavigation = 'None' | 'Chevron' | 'LinkButton';
export type HeaderWidgetType = 'Default' | 'Error';

export interface HeaderWidgetProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
  /** Widget title text. Truncated after 2 lines. */
  title?: string;
  /** Optional item count rendered as `(N)` after the title. */
  count?: number | null;
  /** Optional description below the title. Truncated after 3 lines. */
  description?: string | null;
  /** Render a `core/Divider` at the bottom. @default false */
  showDivider?: boolean;
  /** Trailing action type. @default 'None' */
  navigation?: HeaderWidgetNavigation;
  /** Label for the trailing LinkButton (used only with `navigation="LinkButton"`). */
  trailingLabel?: string;
  /** Fires when the chevron / link button is activated. */
  onTrailingAction?: () => void;
  /** Component type. `Error` renders a warning alert below the content. @default 'Default' */
  type?: HeaderWidgetType;
  /** Alert body text (used only with `type="Error"`). */
  alertMessage?: string;
  /** Alert action label (used only with `type="Error"`). */
  alertActionLabel?: string;
  /** Fires when the alert action is activated. */
  onAlertAction?: () => void;
}

export const HeaderWidget = React.forwardRef<HTMLDivElement, HeaderWidgetProps>(
  (
    {
      title,
      count = null,
      description = null,
      showDivider = false,
      navigation = 'None',
      trailingLabel = 'Button label',
      onTrailingAction,
      type = 'Default',
      alertMessage = 'Failed to load content.',
      alertActionLabel = 'Try again',
      onAlertAction,
      className,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cx('ax-header-widget', className)}
        {...rest}
      >
        <div className="ax-header-widget__content">
          <div
            className={cx(
              'ax-header-widget__title-row',
              navigation === 'Chevron' && 'ax-header-widget__title-row--chevron',
            )}
          >
            <h2 className="ax-header-widget__title-and-count">
              {title ? (
                <span className="ax-header-widget__title">{title}</span>
              ) : null}
              {count != null ? (
                <span className="ax-header-widget__count-wrapper">
                  <span className="ax-header-widget__count">({count})</span>
                </span>
              ) : null}
            </h2>

            {navigation === 'Chevron' ? (
              <button
                type="button"
                className="ax-header-widget__chevron-button"
                onClick={onTrailingAction}
                aria-label={`${title ?? ''}${count != null ? ` (${count})` : ''}, navigate forward`}
              >
                <ChevronRightIcon size="small" />
              </button>
            ) : null}

            {navigation === 'LinkButton' ? (
              <div className="ax-header-widget__trailing-action">
                <LinkButton size="small" onClick={onTrailingAction}>
                  {trailingLabel}
                </LinkButton>
              </div>
            ) : null}
          </div>

          {description ? (
            <p className="ax-header-widget__description">{description}</p>
          ) : null}
        </div>

        {type === 'Error' ? (
          <div className="ax-header-widget__alert-container">
            <Alert
              variant="warning"
              actionButtonProps={
                onAlertAction
                  ? {
                      children: alertActionLabel,
                      onClick: onAlertAction,
                    }
                  : undefined
              }
            >
              {alertMessage}
            </Alert>
          </div>
        ) : null}

        {showDivider ? (
          <div className="ax-header-widget__divider-container">
            <Divider />
          </div>
        ) : null}
      </div>
    );
  },
);

HeaderWidget.displayName = 'HeaderWidget';

