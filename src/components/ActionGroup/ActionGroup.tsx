// @refresh reset

/**
 * @module ActionGroup
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
 * For prop API + usage notes, read `ActionGroup.md` in this folder
 * or run `npm run ld-kit -- show ActionGroup`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {Button} from '../Button';
import type {ButtonSize} from '../Button';
import {LinkButton} from '../LinkButton';
import {emit} from '../../common/helpers';
import './ActionGroup.css';


// ── Rows-based API (vertical stack, each row independently togglable) ────────

/**
 * A single configurable row inside ActionGroup rows mode.
 * When visible is false (or the key is omitted), the row is not rendered
 * and leaves no empty space — remaining rows collapse naturally.
 */
export interface ActionRowConfig {
  /** Whether to render this row. Omit the key entirely to hide it. @default true */
  visible?: boolean;
  /** Any React content — Button pair, QuantityStepper, Link, Chip, Checkbox, etc. */
  content: React.ReactNode;
  /**
   * Horizontal alignment of the actions within this row. `leading` and `trailing`
   * keep each action at its intrinsic width; `stretch` lets a single full-width
   * control (e.g. a disclosure row) fill the row.
   * @default 'trailing'
   */
  align?: 'leading' | 'trailing' | 'stretch';
  /**
   * Lay the row out as N equal-width columns instead of intrinsic-width flow.
   * Each action fills its column, so widths are driven by the grid rather than
   * by label length. Ignored when omitted.
   */
  columns?: 2 | 3;
}

/**
 * Configurable row map for ActionGroup rows mode (Figma node 94623:24683).
 * Maps to the 6 boolean toggles on the Actions-horizontal / 0-899px component.
 * Rows render top-to-bottom in declaration order; set visible=false to hide any row.
 */
export interface ActionGroupRows {
  /** Row 1 — Primary + Secondary button pair (Figma: Button Group-In-line). */
  primaryActions?: ActionRowConfig;
  /** Row 2 — Alternate + Preferred / accordion-style actions (Figma: Accordion actions). */
  preferenceActions?: ActionRowConfig;
  /** Row 3 — Cart actions / QuantityStepper row (Figma: Cart actions). */
  quantityActions?: ActionRowConfig;
  /** Row 4 — Aisle / fulfillment / location button (Figma: Aisle button). */
  fulfillmentActions?: ActionRowConfig;
  /** Row 5 — Supporting links / accordion actions (Figma: List actions). */
  listActions?: ActionRowConfig;
  /** Row 6 — Checkbox selection row (Figma: Checkbox). */
  checkboxAction?: ActionRowConfig;
}

/** Fixed render order for rows — matches Figma layout top-to-bottom. */
const ROW_ORDER: (keyof ActionGroupRows)[] = [
  'primaryActions',
  'preferenceActions',
  'quantityActions',
  'fulfillmentActions',
  'listActions',
  'checkboxAction',
];

// ─────────────────────────────────────────────────────────────────────────────

export type ActionGroupLayout = 'inline' | 'stacked';
export type ActionGroupPattern =
  | 'primary-secondary'
  | 'primary-tertiary'
  | 'secondary-tertiary'
  | 'tertiary-tertiary'
  | 'three-options'
  | 'primary-link'
  | 'secondary-link'
  | 'primary-destructive';

export interface ActionGroupProps
  extends Omit<React.ComponentPropsWithoutRef<'ul'>, 'className' | 'style'> {
  /** @default 'inline' */
  layout?: ActionGroupLayout;
  /** @default 'primary-secondary' */
  pattern?: ActionGroupPattern;
  /** Button size applied to every action in the group. @default 'medium' */
  size?: ButtonSize;
  preferredLabel?: string;
  alternateLabel?: string;
  thirdLabel?: string;
  /** @default true */
  preferredRight?: boolean;
  /** @default true */
  fullWidth?: boolean;
  onPreferred?: React.MouseEventHandler<HTMLButtonElement>;
  onAlternate?: React.MouseEventHandler<HTMLButtonElement>;
  onThird?: React.MouseEventHandler<HTMLButtonElement>;
  preferredButtonProps?: Omit<React.ComponentPropsWithoutRef<'button'>, 'onClick' | 'children'>;
  alternateButtonProps?: Omit<React.ComponentPropsWithoutRef<'button'>, 'onClick' | 'children'>;
  thirdButtonProps?: Omit<React.ComponentPropsWithoutRef<'button'>, 'onClick' | 'children'>;
  /**
   * Slot-based API (Figma: Actions-horizontal / 0-899px, node 89624:55465).
   * Pass 1–3 ReactNodes — Button, QuantityStepper, IconButton, Badge, Link, Chip, etc.
   * Each item is an interchangeable slot; the group resizes around its children (hug).
   * Array length controls how many actions show — no separate numActions prop needed.
   * When provided, renders in slot mode instead of the fixed-pattern mode.
   * Set fullWidth={true} to stretch each slot equally (full-width CTA rows).
   */
  slots?: [React.ReactNode] | [React.ReactNode, React.ReactNode] | [React.ReactNode, React.ReactNode, React.ReactNode];
  /**
   * Rows-based API (Figma: node 94623:24683 — Actions-horizontal with 6 row toggles).
   * Each key maps to a configurable row; set visible=false or omit the key to hide that row.
   * Hidden rows are NOT rendered and leave no residual space — spacing collapses automatically.
   * Takes precedence over slots when both are provided.
   */
  rows?: ActionGroupRows;
  /**
   * Horizontal alignment of slots within the group.
   * No-op when fullWidth is true (slots already fill the container).
   * @default 'leading'
   */
  align?: 'leading' | 'trailing';
  /**
   * Override the gap between slots with a CSS value or design token.
   * @default 'var(--ld-primitive-scale-space-100, 8px)'
   */
  gap?: string;
  /**
   * Allow slots to wrap onto a second line on narrow screens.
   * @default false
   */
  wrap?: boolean;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

const LI = ({children}: {children: React.ReactNode}) => (
  <li style={{display: 'contents'}}>{children}</li>
);

function PreferredPrimary({label, size = 'medium', fullWidth, onClick, buttonProps}: {label: string; size?: ButtonSize; fullWidth?: boolean; onClick?: React.MouseEventHandler<HTMLButtonElement>; buttonProps?: object}) {
  return <Button variant="primary" size={size} isFullWidth={fullWidth} onClick={(e: React.MouseEvent<HTMLButtonElement>) => { emit('ui:action-group:click', {role: 'preferred', variant: 'primary', label}); onClick?.(e); }} {...buttonProps}>{label}</Button>;
}

function PreferredSecondary({label, size = 'medium', fullWidth, onClick, buttonProps}: {label: string; size?: ButtonSize; fullWidth?: boolean; onClick?: React.MouseEventHandler<HTMLButtonElement>; buttonProps?: object}) {
  return <Button variant="secondary" size={size} isFullWidth={fullWidth} onClick={(e: React.MouseEvent<HTMLButtonElement>) => { emit('ui:action-group:click', {role: 'preferred', variant: 'secondary', label}); onClick?.(e); }} {...buttonProps}>{label}</Button>;
}

function AlternateSecondary({label, size = 'medium', fullWidth, onClick, buttonProps}: {label: string; size?: ButtonSize; fullWidth?: boolean; onClick?: React.MouseEventHandler<HTMLButtonElement>; buttonProps?: object}) {
  return <Button variant="secondary" size={size} isFullWidth={fullWidth} onClick={(e: React.MouseEvent<HTMLButtonElement>) => { emit('ui:action-group:click', {role: 'alternate', variant: 'secondary', label}); onClick?.(e); }} {...buttonProps}>{label}</Button>;
}

function TertiaryButton({label, size = 'medium', fullWidth, onClick, buttonProps}: {label: string; size?: ButtonSize; fullWidth?: boolean; onClick?: React.MouseEventHandler<HTMLButtonElement>; buttonProps?: object}) {
  return <Button variant="tertiary" size={size} isFullWidth={fullWidth} onClick={(e: React.MouseEvent<HTMLButtonElement>) => { emit('ui:action-group:click', {role: 'tertiary', variant: 'tertiary', label}); onClick?.(e); }} {...buttonProps}>{label}</Button>;
}

function LinkButtonAction({label, fullWidth, onClick}: {label: string; fullWidth?: boolean; onClick?: React.MouseEventHandler<HTMLButtonElement>}) {
  return <LinkButton isFullWidth={fullWidth} onClick={(e: React.MouseEvent<HTMLButtonElement>) => { emit('ui:action-group:click', {role: 'alternate', variant: 'link', label}); onClick?.(e); }}>{label}</LinkButton>;
}

function DestructiveButton({label, size = 'medium', fullWidth, onClick, buttonProps}: {label: string; size?: ButtonSize; fullWidth?: boolean; onClick?: React.MouseEventHandler<HTMLButtonElement>; buttonProps?: object}) {
  return <Button variant="destructive" size={size} isFullWidth={fullWidth} onClick={(e: React.MouseEvent<HTMLButtonElement>) => { emit('ui:action-group:click', {role: 'preferred', variant: 'destructive', label}); onClick?.(e); }} {...buttonProps}>{label}</Button>;
}

export const ActionGroup = React.forwardRef<HTMLUListElement, ActionGroupProps>((props, ref) => {
  const {
    layout = 'inline', pattern = 'primary-secondary', size = 'medium',
    preferredLabel = 'Preferred', alternateLabel = 'Alternate', thirdLabel = 'Alternate',
    preferredRight = true, fullWidth = true,
    onPreferred, onAlternate, onThird,
    preferredButtonProps, alternateButtonProps, thirdButtonProps,
    slots,
    rows,
    align = 'leading',
    gap,
    wrap = false,
    className, ...rest
  } = applyCommonProps(props);

  // ── Rows-based mode ───────────────────────────────────────────────────────
  // Each row is independently show/hide-able. Hidden rows are not rendered
  // and leave no space. Rows stack vertically with gap-only spacing.
  if (rows) {
    const visibleRows = ROW_ORDER.filter(key => {
      const row = rows[key];
      return row && row.visible !== false;
    });

    if (visibleRows.length === 0) return null;

    return (
      <ul
        ref={ref}
        className={cx('ld-wcp-actiongroup-group', 'ld-wcp-actiongroup-rows', className)}
        style={gap ? {'--ag-slot-gap': gap} as React.CSSProperties : undefined}
        {...rest}
      >
        {visibleRows.map(key => (
          <li
            key={key}
            className={cx(
              'ld-wcp-actiongroup-row-item',
              rows[key]!.align === 'leading' && 'ld-wcp-actiongroup-row-item--leading',
              rows[key]!.align === 'stretch' && 'ld-wcp-actiongroup-row-item--stretch',
              rows[key]!.columns && 'ld-wcp-actiongroup-row-item--columns',
            )}
            style={
              rows[key]!.columns
                ? ({'--ag-row-columns': rows[key]!.columns} as React.CSSProperties)
                : undefined
            }
          >
            {rows[key]!.content}
          </li>
        ))}
      </ul>
    );
  }

  // ── Slot-based mode ───────────────────────────────────────────────────────
  // When `slots` is provided, render a generic horizontal Auto Layout container.
  // Each slot is an interchangeable ReactNode — Button, QuantityStepper, etc.
  // Array length controls slot count (1–3); no numActions prop needed.
  if (slots && slots.length > 0) {
    const capped = (slots as React.ReactNode[]).slice(0, 3);
    return (
      <ul
        ref={ref}
        className={cx(
          'ld-wcp-actiongroup-group',
          'ld-wcp-actiongroup-slots',
          fullWidth && 'ld-wcp-actiongroup-slots--full-width',
          !fullWidth && align === 'trailing' && 'ld-wcp-actiongroup-slots--trailing',
          wrap && 'ld-wcp-actiongroup-slots--wrap',
          className,
        )}
        style={gap ? {'--ag-slot-gap': gap} as React.CSSProperties : undefined}
        {...rest}
      >
        {capped.map((slot, i) => (
          <li key={i} className="ld-wcp-actiongroup-slot-item">
            {slot}
          </li>
        ))}
      </ul>
    );
  }

  const isStacked = layout === 'stacked';

  if (isStacked && pattern === 'three-options') {
    return (
      <ul ref={ref} className={cx('ld-wcp-actiongroup-group', 'ld-wcp-actiongroup-stacked', 'ld-wcp-actiongroup-threeOptions', className)} {...rest}>
        <LI><AlternateSecondary label={alternateLabel} fullWidth size={size} onClick={onAlternate} buttonProps={alternateButtonProps} /></LI>
        <LI><PreferredPrimary label={preferredLabel} fullWidth size={size} onClick={onPreferred} buttonProps={preferredButtonProps} /></LI>
        <LI><TertiaryButton label={thirdLabel} fullWidth size={size} onClick={onThird} buttonProps={thirdButtonProps} /></LI>
      </ul>
    );
  }

  if (isStacked) {
    const preferred = pattern === 'primary-destructive'
      ? <DestructiveButton label={preferredLabel} fullWidth size={size} onClick={onPreferred} buttonProps={preferredButtonProps} />
      : (pattern === 'primary-secondary' || pattern === 'primary-tertiary' || pattern === 'primary-link')
      ? <PreferredPrimary label={preferredLabel} fullWidth size={size} onClick={onPreferred} buttonProps={preferredButtonProps} />
      : <PreferredSecondary label={preferredLabel} fullWidth size={size} onClick={onPreferred} buttonProps={preferredButtonProps} />;
    const alternate = (pattern === 'primary-secondary' || pattern === 'primary-destructive')
      ? <AlternateSecondary label={alternateLabel} fullWidth size={size} onClick={onAlternate} buttonProps={alternateButtonProps} />
      : (pattern === 'primary-link' || pattern === 'secondary-link')
      ? <LinkButtonAction label={alternateLabel} fullWidth onClick={onAlternate} />
      : <TertiaryButton label={alternateLabel} fullWidth size={size} onClick={onAlternate} buttonProps={alternateButtonProps} />;
    return (
      <ul ref={ref} className={cx('ld-wcp-actiongroup-group', 'ld-wcp-actiongroup-stacked', className)} {...rest}>
        <LI>{preferred}</LI>
        <LI>{alternate}</LI>
      </ul>
    );
  }

  // Inline
  function renderInline() {
    switch (pattern) {
      case 'primary-secondary': {
        const alt = <LI key="alt"><AlternateSecondary label={alternateLabel} fullWidth={fullWidth} size={size} onClick={onAlternate} buttonProps={alternateButtonProps} /></LI>;
        const pref = <LI key="pref"><PreferredPrimary label={preferredLabel} fullWidth={fullWidth} size={size} onClick={onPreferred} buttonProps={preferredButtonProps} /></LI>;
        return preferredRight ? <>{alt}{pref}</> : <>{pref}{alt}</>;
      }
      case 'primary-tertiary': {
        const alt = <LI key="alt"><TertiaryButton label={alternateLabel} fullWidth={fullWidth} size={size} onClick={onAlternate} buttonProps={alternateButtonProps} /></LI>;
        const prim = <LI key="prim"><PreferredPrimary label={preferredLabel} fullWidth={fullWidth} size={size} onClick={onPreferred} buttonProps={preferredButtonProps} /></LI>;
        return preferredRight ? <>{alt}{prim}</> : <>{prim}{alt}</>;
      }
      case 'secondary-tertiary': {
        const alt = <LI key="alt"><TertiaryButton label={alternateLabel} fullWidth={fullWidth} size={size} onClick={onAlternate} buttonProps={alternateButtonProps} /></LI>;
        const sec = <LI key="sec"><PreferredSecondary label={preferredLabel} fullWidth={fullWidth} size={size} onClick={onPreferred} buttonProps={preferredButtonProps} /></LI>;
        return preferredRight ? <>{alt}{sec}</> : <>{sec}{alt}</>;
      }
      case 'tertiary-tertiary': {
        return (
          <>
            <LI key="alt"><TertiaryButton label={alternateLabel} fullWidth={fullWidth} size={size} onClick={onAlternate} buttonProps={alternateButtonProps} /></LI>
            <LI key="pref"><TertiaryButton label={preferredLabel} fullWidth={fullWidth} size={size} onClick={onPreferred} buttonProps={preferredButtonProps} /></LI>
          </>
        );
      }
      case 'primary-link': {
        const alt = <LI key="alt"><LinkButtonAction label={alternateLabel} fullWidth={fullWidth} onClick={onAlternate} /></LI>;
        const pref = <LI key="pref"><PreferredPrimary label={preferredLabel} fullWidth={fullWidth} size={size} onClick={onPreferred} buttonProps={preferredButtonProps} /></LI>;
        return preferredRight ? <>{alt}{pref}</> : <>{pref}{alt}</>;
      }
      case 'secondary-link': {
        const alt = <LI key="alt"><LinkButtonAction label={alternateLabel} fullWidth={fullWidth} onClick={onAlternate} /></LI>;
        const sec = <LI key="sec"><PreferredSecondary label={preferredLabel} fullWidth={fullWidth} size={size} onClick={onPreferred} buttonProps={preferredButtonProps} /></LI>;
        return preferredRight ? <>{alt}{sec}</> : <>{sec}{alt}</>;
      }
      case 'primary-destructive': {
        const alt = <LI key="alt"><AlternateSecondary label={alternateLabel} fullWidth={fullWidth} size={size} onClick={onAlternate} buttonProps={alternateButtonProps} /></LI>;
        const dest = <LI key="dest"><DestructiveButton label={preferredLabel} fullWidth={fullWidth} size={size} onClick={onPreferred} buttonProps={preferredButtonProps} /></LI>;
        return preferredRight ? <>{alt}{dest}</> : <>{dest}{alt}</>;
      }
      default: return null;
    }
  }

  return (
    <ul ref={ref} className={cx('ld-wcp-actiongroup-group', 'ld-wcp-actiongroup-inline', fullWidth && 'ld-wcp-actiongroup-inlineFullWidth', className)} {...rest}>
      {renderInline()}
    </ul>
  );
});

ActionGroup.displayName = 'ActionGroup';
