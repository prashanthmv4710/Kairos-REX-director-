// @refresh reset

/**
 * @module CarouselProductCard
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
 * For prop API + usage notes, read `CarouselProductCard.md` in this folder
 * or run `npm run ld-kit -- show CarouselProductCard`.
 */

import * as React from 'react';
import { Button } from '../../components/Button';
import { QuantityStepper } from '../../components/QuantityStepper';
import {emit} from '../../common/helpers';
import './CarouselProductCard.css';

export interface CarouselProductCardProps {
  image: string;
  price: string;
  cents: string;
  onAddToCart?: () => void;
  cartQty?: number;
  onCartQtyChange?: (qty: number) => void;
}

export function CarouselProductCard({ image, price, cents, onAddToCart, cartQty, onCartQtyChange }: CarouselProductCardProps) {
  return (
    <div className="ld-wcp-carousel-product-card-root">
      {/* Image */}
      <div className="ld-wcp-carousel-product-card-image-wrap">
        <img
          src={image}
          alt="Product"
          className="ld-wcp-carousel-product-card-image"
        />
      </div>

      {/* Footer: price + add button */}
      <div className="ld-wcp-carousel-product-card-footer">
        {/* Price row */}
        <div className="ld-wcp-carousel-product-card-price-row">
          <span className="ld-wcp-carousel-product-card-currency">
            $
          </span>
          <span className="ld-wcp-carousel-product-card-dollars">
            {price}
          </span>
          <span className="ld-wcp-carousel-product-card-cents">
            {cents}
          </span>
        </div>

        {/* Add to cart */}
        <div className="ld-wcp-carousel-product-card-add-btn">
          {cartQty !== undefined ? (
            <QuantityStepper variant="tertiary" size="small" showAddLabel={false} count={cartQty} onChange={(qty: number) => { emit('ui:carousel-card:add', {price, cents}); onCartQtyChange?.(qty); }} />
          ) : (
            <Button variant="tertiary" size="small" onClick={() => { emit('ui:carousel-card:add', {price, cents}); onAddToCart?.(); }}>
              + Add
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
CarouselProductCard.displayName = 'CarouselProductCard';
