// @refresh reset

/**
 * @module Attribute
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
 * For prop API + usage notes, read `Attribute.md` in this folder
 * or run `npm run ld-kit -- show Attribute`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/walmart/Attribute.tsx
 *
 * AX Attribute — leading-icon + label pattern with size (small / large) and
 * 5 color variants. Optionally appends a `→ secondary label` to the right.
 *
 * ---
 * ## Accessibility
 *
 * By default the leading icon is decorative (`aria-hidden`) — the `label` text
 * carries all the meaning. When the icon conveys additional context that the
 * label alone does not express, pass `iconLabel` to give it a spoken name:
 *
 * ```tsx
 * // SR reads: "Coupon, Limit 2"
 * <Attribute icon={<TagIcon />} iconLabel="Coupon" label="Limit 2" />
 *
 * // SR reads: "Scheduled time, 2 hours → 3 hours"
 * <Attribute icon={<ClockIcon />} iconLabel="Scheduled time" label="2 hours"
 *   additionalLabel label2="3 hours" />
 * ```
 *
 * When `iconLabel` is omitted the icon is hidden from assistive technology
 * and only the label is announced — correct for purely decorative icons.
 */
import * as React from 'react';

import {cx} from '../../common/cx';
import {Icon} from '../Icons';

import './Attribute.css';

export type AttributeSize = 'small' | 'medium' | 'large';
export type AttributeColor =
  | 'default'
  | 'subtle'
  | 'brand'
  | 'positive'
  | 'negative'
  | 'accent-blue'
  | 'inverse';
export type AttributeVariant = 'default' | 'extended';

export interface AttributeProps {
  /** Display label. */
  label: string;
  /** @default 'default' */
  variant?: AttributeVariant;
  /** @default 'medium' */
  size?: AttributeSize;
  /** @default 'default' */
  color?: AttributeColor;
  /** Leading icon. Defaults to the LD `Tag` icon. */
  icon?: React.ReactNode;
  /**
   * Accessible name for the leading icon. When provided the icon is announced
   * by screen readers (e.g. `iconLabel="Coupon"` → SR reads "Coupon, Limit 2").
   * Omit when the icon is purely decorative and the label text is self-explanatory.
   */
  iconLabel?: string;
  /** When true, appends `→ label2` after the label. @default false */
  additionalLabel?: boolean;
  /** Secondary label rendered when `additionalLabel` is true. */
  label2?: string;
  /** Extended variant: optional leading label. Defaults to `label`. */
  leadingLabel?: string;
  /** Extended variant: optional emphasized middle label. */
  altLabel?: string;
  /** Extended variant: optional trailing label. */
  trailingLabel?: string;
  /** Extended variant: optional trailing icon/media. */
  trailingIcon?: React.ReactNode;
  /** Extended variant: optional leading logo SVG markup rendered in a 16x16 slot. */
  leadingLogoSvg?: string;
  /** Extended variant: optional trailing logo SVG markup rendered in a 16x16 slot. */
  trailingLogoSvg?: string;
  /** Extended variant: accessible name for trailing media when meaningful. */
  trailingIconLabel?: string;
  /** Extended variant: show the leading icon/media. @default true */
  showLeadingIcon?: boolean;
  /** Extended variant: show trailing icon/media. @default false */
  showTrailingIcon?: boolean;
  /** Extended variant: show leading label. @default true */
  showLeadingLabel?: boolean;
  /** Extended variant: show emphasized middle label. @default true */
  showAltLabel?: boolean;
  /** Extended variant: show trailing label. @default true */
  showTrailingLabel?: boolean;
  className?: string;
}

const ICON_SIZE: Record<AttributeSize, string> = {
  small: 'var(--ld-primitive-scale-space-200)',
  medium: 'var(--ld-primitive-scale-space-200)',
  large: 'var(--ld-primitive-scale-space-200)',
};

function ArrowRightIcon({size = 16}: {size?: number}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      role="img"
      aria-label="Compared to"
      className="ax-attribute__additional-icon"
    >
      <path
        d="M9 3.5 13.5 8 9 12.5M13 8H2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SvgMedia({svg, label}: {svg: string; label?: string}) {
  return (
    <span
      className="ax-attribute__media"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{__html: svg}}
    />
  );
}

export function Attribute({
  label,
  variant = 'default',
  size = 'medium',
  color = 'default',
  icon,
  iconLabel,
  additionalLabel = false,
  label2 = 'Label 2',
  leadingLabel,
  altLabel,
  trailingLabel,
  trailingIcon,
  leadingLogoSvg,
  trailingLogoSvg,
  trailingIconLabel,
  showLeadingIcon = true,
  showTrailingIcon = false,
  showLeadingLabel = true,
  showAltLabel = true,
  showTrailingLabel = true,
  className,
}: AttributeProps) {
  const resolvedColor: AttributeColor = color;
  const iconSize = ICON_SIZE[size];
  const resolvedIcon = icon ?? (
    <Icon name="Tag" decorative style={{fontSize: iconSize}} />
  );
  const resolvedTrailingIcon = trailingIcon ?? resolvedIcon;
  const leadingMedia = leadingLogoSvg ? <SvgMedia svg={leadingLogoSvg} /> : null;
  const trailingMedia = trailingLogoSvg ? <SvgMedia svg={trailingLogoSvg} /> : null;

  if (variant === 'extended') {
    return (
      <span
        className={cx(
          'ax-attribute',
          'ax-attribute--extended',
          `ax-attribute--${size}`,
          `ax-attribute--color-${resolvedColor}`,
          className,
        )}
      >
        {showLeadingIcon ? (
          leadingMedia ?? (
            <span
              className="ax-attribute__icon"
              role={iconLabel ? 'img' : undefined}
              aria-label={iconLabel}
              aria-hidden={iconLabel ? undefined : true}
            >
              {resolvedIcon}
            </span>
          )
        ) : null}
        <span className="ax-attribute__composite-label-group">
          {showLeadingLabel ? (
            <span className="ax-attribute__composite-label ax-attribute__composite-label--regular">
              {leadingLabel ?? label}
            </span>
          ) : null}
          {showAltLabel && altLabel ? (
            <span className="ax-attribute__composite-label ax-attribute__composite-label--alt">
              {altLabel}
            </span>
          ) : null}
          {showTrailingLabel && trailingLabel ? (
            <span className="ax-attribute__composite-label ax-attribute__composite-label--regular">
              {trailingLabel}
            </span>
          ) : null}
        </span>
        {showTrailingIcon ? (
          trailingMedia ?? (
            <span
              className="ax-attribute__icon"
              role={trailingIconLabel ? 'img' : undefined}
              aria-label={trailingIconLabel}
              aria-hidden={trailingIconLabel ? undefined : true}
            >
              {resolvedTrailingIcon}
            </span>
          )
        ) : null}
      </span>
    );
  }

  return (
    <span
      className={cx(
        'ax-attribute',
        `ax-attribute--${size}`,
        `ax-attribute--color-${resolvedColor}`,
        className,
      )}
    >
      {/* When iconLabel is provided the wrapper becomes a named img role so
          screen readers announce it. Otherwise aria-hidden hides the icon.
          showLeadingIcon=false suppresses the icon entirely. */}
      {showLeadingIcon !== false && (
        <span
          className="ax-attribute__icon"
          role={iconLabel ? 'img' : undefined}
          aria-label={iconLabel}
          aria-hidden={iconLabel ? undefined : true}
        >
          {resolvedIcon}
        </span>
      )}
      {additionalLabel ? (
        <span className="ax-attribute__additional-container">
          <span className={cx('ax-attribute__label', `ax-attribute__text--${size}`)}>
            {label}
          </span>
          <ArrowRightIcon />
          <span className={cx('ax-attribute__label', `ax-attribute__text--${size}`)}>
            {label2}
          </span>
        </span>
      ) : (
        <span className={cx('ax-attribute__label', `ax-attribute__text--${size}`)}>
          {label}
        </span>
      )}
    </span>
  );
}


Attribute.displayName = 'Attribute';
