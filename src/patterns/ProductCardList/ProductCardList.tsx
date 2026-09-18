// @refresh reset

/**
 * @module ProductCardList
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
 * For prop API + usage notes, read `ProductCardList.md` in this folder
 * or run `npm run ld-kit -- show ProductCardList`.
 */

import * as React from 'react';
import { cx } from '../../common/cx';
import { Button } from '../../components/Button';
import { QuantityStepper } from '../../components/QuantityStepper';
import { Flag, type FlagVariant } from '../../components/Flag';
import { RatingDisplay } from '../../components/RatingDisplay';
import './ProductCardList.css';

export interface ProductCardListProps {
  image: string;
  name: string;
  price: string;
  cents: string;
  wasPrice?: string;
  flag?: string;
  flagVariant?: FlagVariant;
  rating: number;
  ratingCount: string;
  pickup?: string;
  stock?: string;
  unitPrice?: string;
  ebt?: boolean;
  cue?: string;
  brand?: string;
  onAddToCart?: () => void;
  cartQty?: number;
  onCartQtyChange?: (qty: number) => void;
}

export function ProductCardList({
  image,
  name,
  price,
  cents,
  wasPrice,
  flag,
  flagVariant = 'brand-subtle',
  rating,
  ratingCount,
  pickup,
  stock,
  unitPrice,
  ebt,
  cue,
  brand,
  onAddToCart,
  cartQty,
  onCartQtyChange,
}: ProductCardListProps) {
  const hasSavings = !!wasPrice;

  return (
    <div className="ld-wcp-product-card-list-root">
      {/* Image column */}
      <div className="ld-wcp-product-card-list-image-col">
        {flag && (
          <div className="ld-wcp-product-card-list-flag-wrap">
            <Flag label={flag} variant={flagVariant} />
          </div>
        )}
        <img
          src={image}
          alt={name}
          className="ld-wcp-product-card-list-image"
        />
      </div>

      {/* Content column */}
      <div className="ld-wcp-product-card-list-content">
        {/* Price row */}
        <div className={cx('ld-wcp-product-card-list-price-row', hasSavings && 'ld-wcp-product-card-list-price-row-savings')}>
          {hasSavings && (
            <span className="ld-wcp-product-card-list-now-prefix">
              Now{' '}
            </span>
          )}
          <span className="ld-wcp-product-card-list-dollar-sign">
            $
          </span>
          <span className="ld-wcp-product-card-list-price">
            {price}
          </span>
          <span className="ld-wcp-product-card-list-cents">
            {cents}
          </span>
          {wasPrice && (
            <span className="ld-wcp-product-card-list-was-price">
              {wasPrice}
            </span>
          )}
        </div>

        {/* Unit price */}
        {unitPrice && (
          <p className="ld-wcp-product-card-list-unit-price">
            {unitPrice}
          </p>
        )}

        {/* Product name */}
        <p className="ld-wcp-product-card-list-name">
          {name}
        </p>

        {/* Cue text */}
        {cue && (
          <p className="ld-wcp-product-card-list-cue">
            {cue}
          </p>
        )}

        {/* Rating */}
        <RatingDisplay
          value={rating}
          count={ratingCount}
          size="small"
        />

        {/* EBT eligible */}
        {ebt && (
          <span className="ld-wcp-product-card-list-ebt">
            EBT eligible
          </span>
        )}

        {/* Pickup */}
        {pickup && (
          <p className="ld-wcp-product-card-list-pickup">
            Pickup{' '}
            <span className="ld-wcp-product-card-list-pickup-bold">{pickup}</span>
          </p>
        )}

        {/* Stock warning */}
        {stock && (
          <p className="ld-wcp-product-card-list-stock">
            {stock}
          </p>
        )}

        {/* Add to cart */}
        <div className="ld-wcp-product-card-list-add-to-cart">
          {cartQty !== undefined ? (
            <QuantityStepper variant="primary" size="small" cartLabel="Add to cart" count={cartQty} onChange={onCartQtyChange} />
          ) : (
            <Button variant="primary" size="small" onClick={onAddToCart}>
              Add to cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
ProductCardList.displayName = 'ProductCardList';
