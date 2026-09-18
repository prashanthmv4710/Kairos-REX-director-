// @refresh reset

/**
 * @module ProductCardGrid
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
 * For prop API + usage notes, read `ProductCardGrid.md` in this folder
 * or run `npm run ld-kit -- show ProductCardGrid`.
 */

import * as React from 'react';
import { Button } from '../../components/Button';
import { QuantityStepper } from '../../components/QuantityStepper';
import { Flag, type FlagVariant } from '../../components/Flag';
import { RatingDisplay } from '../../components/RatingDisplay';
import { HeartView } from '../../components/HeartView';
import './ProductCardGrid.css';

/**
 * Maps a flag label to its correct Flag variant based on Walmart design guidelines.
 */
function getFlagVariant(flag: string): FlagVariant {
  const lower = flag.toLowerCase();

  if (lower === 'rollback') return 'savings-bold';
  if (lower === 'clearance') return 'urgent';
  if (lower === 'reduced price') return 'social';
  if (lower === 'flash deal') return 'scarcity';
  if (lower === 'deal') return 'confidence';
  if (lower === 'popular pick') return 'confidence';
  if (lower === 'online only') return 'holiday-restricted';
  if (lower === 'early access') return 'holiday-member';
  if (lower === 'preorder') return 'confidence-bold';
  if (lower === 'black friday deal') return 'confidence-bold';
  if (lower === 'preview black friday') return 'confidence';
  if (lower === 'prescription item') return 'social';

  // Social proof patterns (e.g. "In 200+ people's carts", "100+ bought since yesterday")
  if (/bought|people|viewing|carts/.test(lower)) return 'social';

  // Default for "Best seller" and other brand flags
  return 'brand-subtle';
}

export interface ProductCardGridProps {
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
  onAddToCart?: () => void;
  hearted?: boolean;
  onHeartChange?: (hearted: boolean) => void;
  cartQty?: number;
  onCartQtyChange?: (qty: number) => void;
}

export function ProductCardGrid({
  image,
  name,
  price,
  cents,
  wasPrice,
  flag,
  flagVariant,
  rating,
  ratingCount,
  pickup,
  onAddToCart,
  hearted,
  onHeartChange,
  cartQty,
  onCartQtyChange,
}: ProductCardGridProps) {
  const hasSavings = !!wasPrice;

  return (
    <div className="ld-wcp-product-card-grid-root">
      {/* Image area — responsive square like production */}
      <div className="ld-wcp-product-card-grid-image-area">
        {/* Flag badge */}
        {flag && (
          <div className="ld-wcp-product-card-grid-flag-wrap">
            <Flag label={flag} variant={flagVariant ?? getFlagVariant(flag)} />
          </div>
        )}

        {/* Favorite heart toggle */}
        <div className="ld-wcp-product-card-grid-heart-wrap">
          <HeartView
            size="small"
            {...(hearted !== undefined ? {activated: hearted, onChange: onHeartChange} : {})}
          />
        </div>

        <img
          src={image}
          alt={name}
          className="ld-wcp-product-card-grid-image"
        />
      </div>

      {/* Content */}
      <div className="ld-wcp-product-card-grid-content">
        {/* Price row */}
        <div className="ld-wcp-product-card-grid-price-row">
          {hasSavings ? (
            <>
              <span className="ld-wcp-product-card-grid-price-super ld-wcp-product-card-grid-price-positive">
                Now $
              </span>
              <span className="ld-wcp-product-card-grid-price-main ld-wcp-product-card-grid-price-positive">
                {price}
              </span>
              <span className="ld-wcp-product-card-grid-price-super ld-wcp-product-card-grid-price-positive">
                {cents}
              </span>
              <span className="ld-wcp-product-card-grid-was-price">
                {wasPrice}
              </span>
            </>
          ) : (
            <>
              <span className="ld-wcp-product-card-grid-price-super">
                $
              </span>
              <span className="ld-wcp-product-card-grid-price-main">
                {price}
              </span>
              <span className="ld-wcp-product-card-grid-price-super">
                {cents}
              </span>
            </>
          )}
        </div>

        {/* Product name */}
        <p className="ld-wcp-product-card-grid-name">
          {name}
        </p>

        {/* Rating */}
        <RatingDisplay
          value={rating}
          count={ratingCount}
          size="small"
        />

        {/* Pickup */}
        {pickup && (
          <p className="ld-wcp-product-card-grid-pickup">
            Pickup{' '}
            <span className="ld-wcp-product-card-grid-pickup-time">{pickup}</span>
          </p>
        )}

        {/* Add to cart */}
        <div className="ld-wcp-product-card-grid-cart-wrap">
          {cartQty !== undefined ? (
            <QuantityStepper variant="primary" size="small" cartLabel="Add to cart" count={cartQty} onChange={onCartQtyChange} />
          ) : (
            <Button
              variant="primary"
              size="small"
              isFullWidth
              onClick={onAddToCart}
            >
              Add to cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
ProductCardGrid.displayName = 'ProductCardGrid';
