// @refresh reset

/**
 * @module FlashDealsItemTile
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
 * For prop API + usage notes, read `FlashDealsItemTile.md` in this folder
 * or run `npm run ld-kit -- show FlashDealsItemTile`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import { Flag, type FlagVariant } from '../../components/Flag';
import { HeartView } from '../../components/HeartView';
import { Button } from '../../components/Button';
import { QuantityStepper } from '../../components/QuantityStepper';
import {emit} from '../../common/helpers';
import './FlashDealsItemTile.css';

export type BadgeType = 'bestseller' | 'deal' | 'popular' | 'rollback' | 'clearance';

const BADGE_VARIANT_MAP: Record<BadgeType, FlagVariant> = {
  bestseller: 'brand-subtle',
  deal: 'confidence',
  popular: 'confidence',
  rollback: 'savings-bold',
  clearance: 'urgent',
};

export interface FlashDealsItemTileProps {
  image: string;
  name: string;
  price: string;
  cents: string;
  originalPrice?: string;
  pricePrefix?: string;
  badge?: { label: string; type: BadgeType };
  optionsText?: string;
  actionType: 'add' | 'options';
  idx: number;
  onAddToCart?: () => void;
  hearted?: boolean;
  onHeartChange?: (hearted: boolean) => void;
  cartQty?: number;
  onCartQtyChange?: (qty: number) => void;
}

export function FlashDealsItemTile({
  image,
  name,
  price,
  cents,
  originalPrice,
  pricePrefix,
  badge,
  optionsText,
  actionType,
  onAddToCart,
  hearted,
  onHeartChange,
  cartQty,
  onCartQtyChange,
}: FlashDealsItemTileProps) {
  const isSavings = !!pricePrefix;

  return (
    <div className="ld-wcp-flash-deals-item-tile-root">
      {/* Flag badge */}
      {badge && (
        <div className="ld-wcp-flash-deals-item-tile-badge">
          <Flag label={badge.label} variant={BADGE_VARIANT_MAP[badge.type]} />
        </div>
      )}

      {/* Heart */}
      <div className="ld-wcp-flash-deals-item-tile-heart">
        <HeartView size="small" calloutPosition="bottom" {...(hearted !== undefined ? {activated: hearted, onChange: onHeartChange} : {})} />
      </div>

      {/* Image */}
      <div className="ld-wcp-flash-deals-item-tile-image-wrap">
        <img
          src={image}
          alt={name}
          className="ld-wcp-flash-deals-item-tile-image"
        />
      </div>

      {/* Body */}
      <div className="ld-wcp-flash-deals-item-tile-body">
        {/* Price row */}
        <div
          className={cx(
            'ld-wcp-flash-deals-item-tile-price-row',
            isSavings && 'ld-wcp-flash-deals-item-tile-price-row--savings',
          )}
        >
          {pricePrefix && (
            <span className="ld-wcp-flash-deals-item-tile-price-prefix">
              {pricePrefix}{' '}
            </span>
          )}
          <span className="ld-wcp-flash-deals-item-tile-dollar">
            $
          </span>
          <span className="ld-wcp-flash-deals-item-tile-price">
            {price}
          </span>
          <span className="ld-wcp-flash-deals-item-tile-cents">
            {cents}
          </span>
        </div>

        {originalPrice && (
          <div className="ld-wcp-flash-deals-item-tile-original-price">
            {originalPrice}
          </div>
        )}

        {optionsText && (
          <p className="ld-wcp-flash-deals-item-tile-options">
            {optionsText}
          </p>
        )}

        <p className="ld-wcp-flash-deals-item-tile-name">
          {name}
        </p>
      </div>

      {/* Footer action */}
      <div className="ld-wcp-flash-deals-item-tile-footer">
        {actionType === 'add' && cartQty !== undefined ? (
          <QuantityStepper variant="secondary" size="small" count={cartQty} onChange={(qty: number) => { emit('ui:flash-deal:action', {actionType, name, price, cents}); onCartQtyChange?.(qty); }} />
        ) : (
          <Button variant="secondary" size="small" isFullWidth onClick={() => { emit('ui:flash-deal:action', {actionType, name, price, cents}); if (actionType === 'add') onAddToCart?.(); }}>
            {actionType === 'add' ? '+ Add' : 'Options'}
          </Button>
        )}
      </div>
    </div>
  );
}
FlashDealsItemTile.displayName = 'FlashDealsItemTile';
