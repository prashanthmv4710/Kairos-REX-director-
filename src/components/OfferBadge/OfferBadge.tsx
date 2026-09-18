// @refresh reset

/**
 * @module OfferBadge
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
 * For prop API + usage notes, read `OfferBadge.md` in this folder
 * or run `npm run ld-kit -- show OfferBadge`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps, useStableId} from '../../common/helpers';
import {Checkbox} from '../Checkbox';
import {Link} from '../Link';
import {TagIcon} from '../Icons/Icons';
import './OfferBadge.css';

/**
 * Offer badge variants (Figma: `Offer badge / 0-899px` node 88885:18959,
 * `Offer badge / 900+px` node 88885:18960).
 *
 * - `cashback` — teal-subtle fill, leading Checkbox, primary message + optional
 *   subtitle / requirement text. The offer is opt-in, so it carries a control.
 * - `discount` — cyan-subtle fill, leading icon, single teal saving title. The
 *   offer is already applied, so it is read-only.
 */
export type OfferBadgeVariant = 'cashback' | 'discount';

export interface OfferBadgeProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'className' | 'style'> {
  /** @default 'cashback' */
  variant?: OfferBadgeVariant;
  /** Primary message (`cashback`) or saving title (`discount`). */
  label: string;
  /** Second line, `cashback` only. */
  subtitle?: string;
  /** Third line — terms/eligibility copy, `cashback` only. */
  requirementText?: string;
  /** Trailing link label. Omit to hide the link. */
  linkLabel?: string;
  /** @default '#' */
  linkHref?: string;
  /** Checkbox state, `cashback` only. */
  selected?: boolean;
  /** Called with the next checkbox state, `cashback` only. */
  onSelectedChange?: (selected: boolean) => void;
  /** Leading icon, `discount` only. @default <TagIcon /> */
  icon?: React.ReactNode;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

/**
 * Savings/offer badge shown inside an ItemTile's content column.
 *
 * Responsive behaviour is driven by the `ld-itemtile` container query, matching
 * the two Figma sources: caption type below 900px, body-small type at 900px+.
 * Outside an ItemTile the query never resolves, so the 0–899px form is used.
 */
export const OfferBadge: React.FunctionComponent<OfferBadgeProps> = (props) => {
  const {
    variant = 'cashback',
    label,
    subtitle,
    requirementText,
    linkLabel,
    linkHref = '#',
    selected = false,
    onSelectedChange,
    icon,
    className,
    ...rest
  } = applyCommonProps(props);

  const titleId = useStableId();
  const subtitleId = useStableId();
  const requirementId = useStableId();

  // Build the checkbox's aria-labelledby from all visible offer text so screen
  // readers announce the complete offer: primary message + subtitle + requirements.
  const checkboxLabelledBy = [
    titleId,
    subtitle ? subtitleId : null,
    requirementText ? requirementId : null,
  ].filter(Boolean).join(' ');

  const content = (
    <div className="ld-wcp-offerbadge-content">
      <span className="ld-wcp-offerbadge-title" id={titleId}>{label}</span>
      {variant === 'cashback' && subtitle && (
        <span className="ld-wcp-offerbadge-subtitle" id={subtitleId}>{subtitle}</span>
      )}
      {variant === 'cashback' && requirementText && (
        <span className="ld-wcp-offerbadge-requirement" id={requirementId}>{requirementText}</span>
      )}
      {linkLabel && (
        <Link href={linkHref} UNSAFE_className="ld-wcp-offerbadge-link">{linkLabel}</Link>
      )}
    </div>
  );

  return (
    <div
      className={cx(
        'ld-wcp-offerbadge',
        `ld-wcp-offerbadge--${variant}`,
        className,
      )}
      {...rest}
    >
      {variant === 'cashback' ? (
        // The badge text labels the control rather than wrapping it: a <label>
        // around the whole badge would swallow clicks meant for the terms Link.
        <Checkbox
          size="small"
          checked={selected}
          onChange={(e) => onSelectedChange?.(e.target.checked)}
          a11yLabelledBy={checkboxLabelledBy}
          UNSAFE_className="ld-wcp-offerbadge-checkbox"
        />
      ) : (
        <span className="ld-wcp-offerbadge-icon" aria-hidden="true">
          {icon ?? <TagIcon decorative size="small" />}
        </span>
      )}
      {content}
    </div>
  );
};
OfferBadge.displayName = 'OfferBadge';
