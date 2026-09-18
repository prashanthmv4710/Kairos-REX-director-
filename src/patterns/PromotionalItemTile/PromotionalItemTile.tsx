// @refresh reset

/**
 * @module PromotionalItemTile
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
 * For prop API + usage notes, read `PromotionalItemTile.md` in this folder
 * or run `npm run ld-kit -- show PromotionalItemTile`.
 */

import * as React from 'react';
import { Button } from '../../components/Button';
import { QuantityStepper } from '../../components/QuantityStepper';
import {emit, invariant} from '../../common/helpers';
import './PromotionalItemTile.css';

export interface PromotionalItemTileProps {
  image: string;
  /**
   * The product name. Used as the image alt text so screen reader users know
   * what the promotional tile is offering. Required.
   */
  name: string;
  price: string;
  cents: string;
  onAddToCart?: () => void;
  cartQty?: number;
  onCartQtyChange?: (qty: number) => void;
}

export function PromotionalItemTile({ image, name, price, cents, onAddToCart, cartQty, onCartQtyChange }: PromotionalItemTileProps) {
  invariant(
    typeof name === 'string' && name.trim().length > 0,
    '`PromotionalItemTile` accessibility violation. `name` is required and becomes the image alt text — pass the product name.',
  );

  return (
    <div className="ld-wcp-promotional-item-tile-root">
      {/* Image */}
      <div className="ld-wcp-promotional-item-tile-image-wrap">
        <img
          src={image}
          alt={name}
          className="ld-wcp-promotional-item-tile-image"
        />
      </div>

      {/* Footer: price + add button */}
      <div className="ld-wcp-promotional-item-tile-footer">
        {/* Price row */}
        <div className="ld-wcp-promotional-item-tile-price-row">
          <span className="ld-wcp-promotional-item-tile-currency">
            $
          </span>
          <span className="ld-wcp-promotional-item-tile-dollars">
            {price}
          </span>
          <span className="ld-wcp-promotional-item-tile-cents">
            {cents}
          </span>
        </div>

        {/* Add to cart */}
        <div className="ld-wcp-promotional-item-tile-add-btn">
          {cartQty !== undefined ? (
            <QuantityStepper variant="tertiary" size="small" showAddLabel={false} count={cartQty} onChange={(qty: number) => { emit('ui:promo-tile:add', {price, cents}); onCartQtyChange?.(qty); }} />
          ) : (
            <Button variant="tertiary" size="small" onClick={() => { emit('ui:promo-tile:add', {price, cents}); onAddToCart?.(); }}>
              + Add
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
PromotionalItemTile.displayName = 'PromotionalItemTile';
