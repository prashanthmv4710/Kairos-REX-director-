// @refresh reset

/**
 * @module Flag
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
 * For prop API + usage notes, read `Flag.md` in this folder
 * or run `npm run ld-kit -- show Flag`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import './Flag.css';

export type FlagVariant =
  | 'holiday-restricted'
  | 'brand-subtle'
  | 'scarcity'
  | 'savings-bold'
  | 'savings-subtle'
  | 'confidence-subtle'
  | 'confidence-bold'
  | 'confidence-alt'
  | 'confidence'
  | 'holiday-member'
  | 'social'
  | 'urgent'
  | 'express'
  | 'drone-delivery'
  | 'neutral'
  | 'positive';

export interface FlagProps
  extends Omit<React.ComponentPropsWithoutRef<'span'>, 'className' | 'style'> {
  label?: string;
  variant?: FlagVariant;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  /** @default "medium" */
  size?: 'small' | 'medium';
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

const VARIANT_CLASS: Record<FlagVariant, string> = {
  'holiday-restricted': 'ld-wcp-flag-holiday-restricted',
  'brand-subtle': 'ld-wcp-flag-brand-subtle',
  'scarcity': 'ld-wcp-flag-scarcity',
  'savings-bold': 'ld-wcp-flag-savings-bold',
  'savings-subtle': 'ld-wcp-flag-savings-subtle',
  'confidence-subtle': 'ld-wcp-flag-confidence-subtle',
  'confidence-bold': 'ld-wcp-flag-confidence-bold',
  'confidence-alt': 'ld-wcp-flag-confidence-alt',
  'confidence': 'ld-wcp-flag-confidence',
  'holiday-member': 'ld-wcp-flag-holiday-member',
  'social': 'ld-wcp-flag-social',
  'urgent': 'ld-wcp-flag-urgent',
  'express': 'ld-wcp-flag-express',
  'drone-delivery': 'ld-wcp-flag-drone-delivery',
  'neutral': 'ld-wcp-flag-neutral',
  'positive': 'ld-wcp-flag-positive',
};

export const FLAG_VARIANTS: Array<{ variant: FlagVariant; label: string; description: string }> = [
  // Promotional
  { variant: 'brand-subtle', label: 'Brand Subtle', description: 'Subtle brand tint — tracks brand theme' },
  { variant: 'savings-bold', label: 'Savings Bold', description: 'Solid red — promotional savings / clearance' },
  { variant: 'savings-subtle', label: 'Savings Subtle', description: 'Light red tint, red text — savings indicator' },
  { variant: 'positive', label: 'Positive', description: 'Free, eco, or positive fulfillment indicator' },
  // Urgency & Scarcity
  { variant: 'scarcity', label: 'Scarcity', description: 'Low stock / limited availability indicator' },
  { variant: 'urgent', label: 'Urgent', description: 'Time-sensitive or deadline-driven messaging' },
  // Confidence & Social Proof
  { variant: 'confidence', label: 'Confidence', description: 'Navy — strong confidence or best-seller badge' },
  { variant: 'confidence-bold', label: 'Confidence Bold', description: 'Deep navy — highest-emphasis confidence badge' },
  { variant: 'confidence-subtle', label: 'Confidence Subtle', description: 'Light blue tint — soft confidence or info badge' },
  { variant: 'confidence-alt', label: 'Confidence Alt', description: 'Navy fill, spark-yellow icon — W+ confidence accent' },
  { variant: 'social', label: 'Social', description: 'Social proof indicator (e.g. "100+ bought today")' },
  // Fulfillment
  { variant: 'express', label: 'Express', description: 'W+ Express delivery — navy fill with spark-yellow icon' },
  { variant: 'drone-delivery', label: 'Drone Delivery', description: 'Drone delivery fulfillment label' },
  { variant: 'neutral', label: 'Neutral', description: 'Grey — neutral informational label (fulfillment, standard delivery)' },
  // Membership & Holiday
  { variant: 'holiday-member', label: 'Holiday Member', description: 'W+ member benefit during holiday season' },
  { variant: 'holiday-restricted', label: 'Holiday Restricted', description: 'Items unavailable or restricted during holiday period' },
];

export const Flag: React.FunctionComponent<FlagProps> = (props) => {
  const {label = 'Flag name', variant = 'brand-subtle', leadingIcon, trailingIcon, size = 'medium', className, ...rest} = applyCommonProps(props);

  return (
    <span
      className={cx('ld-wcp-flag-flag', VARIANT_CLASS[variant], size === 'small' && 'ld-wcp-flag-small', className)}
      data-variant={variant}
      {...rest}
    >
      {leadingIcon && <span className="ld-wcp-flag-iconWrap">{leadingIcon}</span>}
      <span className="ld-wcp-flag-label">{label}</span>
      {trailingIcon && <span className="ld-wcp-flag-iconWrap">{trailingIcon}</span>}
    </span>
  );
};

Flag.displayName = 'Flag';
