// @refresh reset

/**
 * @module GenericItemTile
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
 * For prop API + usage notes, read `GenericItemTile.md` in this folder
 * or run `npm run ld-kit -- show GenericItemTile`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {emit} from '../../common/helpers';
import {Flag, type FlagVariant} from '../../components/Flag';
import {HeartView} from '../../components/HeartView';
import {Button} from '../../components/Button';
import {QuantityStepper} from '../../components/QuantityStepper';
import {RatingDisplay} from '../../components/RatingDisplay';
import {Attribute} from '../../components/Attribute';
import {TagIcon, CheckCircleIcon} from '../../components/Icons/Icons';
import './GenericItemTile.css';

// ── Types ─────────────────────────────────────────────────────────────────────

type BadgeType = 'bestseller' | 'deal' | 'popular' | 'rollback' | 'clearance';

const BADGE_VARIANT_MAP: Record<BadgeType, FlagVariant> = {
  bestseller: 'brand-subtle',
  deal: 'confidence',
  popular: 'confidence',
  rollback: 'savings-bold',
  clearance: 'urgent',
};

export interface GenericItemTileSwatch {
  /** CSS color value, e.g. "#e63946" */
  color: string;
  /** Accessible label, e.g. "Red" */
  label: string;
}

export interface GenericItemTileProps {
  /** Product image URL */
  image: string;
  /** Product name / description */
  name: string;
  /** Dollar portion of the price, e.g. "24" */
  price: string;
  /** Cents portion of the price, e.g. "88" */
  cents: string;
  /** Strikethrough was-price, e.g. "$34.99" */
  originalPrice?: string;
  /** Leading price label — pass "Now" to switch to savings (green) styling */
  pricePrefix?: string;
  /** Trailing price modifier, e.g. "/mo" */
  priceSuffix?: string;
  /** Flag / badge in the top-left of the image */
  badge?: { label: string; type: BadgeType };
  /** Show "Sponsored" attribute above the price */
  sponsored?: boolean;
  /** Numeric star rating (0–5) */
  rating?: number;
  /** Formatted review count shown next to the stars, e.g. "12,234" */
  ratingCount?: string;
  /** First fulfillment line, e.g. "Pickup today" */
  delivery?: string;
  /** Second fulfillment line, e.g. "Walmart fulfilled" */
  fulfillment?: string;
  /** Color swatches — rendered as small circles below the image */
  swatches?: GenericItemTileSwatch[];
  /** Pack-size options rendered as chips below the swatches */
  packOptions?: string[];
  /** Currently selected pack option */
  selectedPack?: string;
  /** Called when a pack chip is clicked */
  onPackSelect?: (pack: string) => void;
  /** Heart / save state */
  hearted?: boolean;
  onHeartChange?: (hearted: boolean) => void;
  /** Cart quantity — 0 means "not in cart" (shows Add button) */
  cartQty?: number;
  onCartQtyChange?: (qty: number) => void;
  onAddToCart?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function GenericItemTile({
  image,
  name,
  price,
  cents,
  originalPrice,
  pricePrefix,
  priceSuffix,
  badge,
  sponsored,
  rating,
  ratingCount,
  delivery,
  fulfillment,
  swatches,
  packOptions,
  selectedPack,
  onPackSelect,
  hearted,
  onHeartChange,
  cartQty,
  onCartQtyChange,
  onAddToCart,
}: GenericItemTileProps) {
  const isSavings = !!pricePrefix;
  const [hasImageError, setHasImageError] = React.useState(false);
  const hasImage = !!image?.trim() && !hasImageError;

  React.useEffect(() => {
    setHasImageError(false);
  }, [image]);

  const handleAdd = () => {
    emit('ui:generic-item-tile:add', {name, price, cents});
    onAddToCart?.();
  };

  const handleQtyChange = (qty: number) => {
    emit('ui:generic-item-tile:qty', {name, qty});
    onCartQtyChange?.(qty);
  };

  return (
    <div className="ld-wcp-generic-tile-root">
      {/* ── Item visual ───────────────────────────────────────────────────── */}
      <div className="ld-wcp-generic-tile-visual">

        {/* Flags row */}
        {badge && (
          <div className="ld-wcp-generic-tile-flags">
            <Flag label={badge.label} variant={BADGE_VARIANT_MAP[badge.type]} />
          </div>
        )}

        {/* Image + Heart overlay */}
        <div className="ld-wcp-generic-tile-image-wrap">
          {hasImage ? (
            <img
              src={image}
              alt={name}
              className="ld-wcp-generic-tile-image"
              onError={() => setHasImageError(true)}
            />
          ) : (
            <div className="ld-wcp-generic-tile-image-placeholder" aria-hidden="true">
              <span className="ld-wcp-generic-tile-image-placeholder-text">
                {name?.trim() || 'Product'}
              </span>
            </div>
          )}

          <div className="ld-wcp-generic-tile-heart">
            <HeartView
              size="small"
              calloutPosition="bottom"
              {...(hearted !== undefined ? {activated: hearted, onChange: onHeartChange} : {})}
            />
          </div>
        </div>

        {/* Color swatches */}
        {swatches && swatches.length > 0 && (
          <div className="ld-wcp-generic-tile-swatches" aria-label="Color options">
            {swatches.slice(0, 4).map((s) => (
              <span
                key={s.label}
                role="img"
                className="ld-wcp-generic-tile-swatch"
                style={{background: s.color}}
                title={s.label}
                aria-label={s.label}
              />
            ))}
            {swatches.length > 4 && (
              <span className="ld-wcp-generic-tile-swatch-more">
                +{swatches.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Pack selector chips */}
        {packOptions && packOptions.length > 0 && (
          <div className="ld-wcp-generic-tile-packs" role="group" aria-label="Pack size">
            {packOptions.map((pack) => (
              <button
                key={pack}
                type="button"
                className={cx(
                  'ld-wcp-generic-tile-pack-chip',
                  pack === selectedPack && 'ld-wcp-generic-tile-pack-chip--selected',
                )}
                aria-pressed={pack === selectedPack}
                onClick={() => onPackSelect?.(pack)}
              >
                {pack}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <div className="ld-wcp-generic-tile-actions">
        {cartQty !== undefined && cartQty > 0 ? (
          <QuantityStepper
            variant="primary"
            size="small"
            count={cartQty}
            onChange={handleQtyChange}
          />
        ) : (
          <Button variant="primary" size="small" isFullWidth onClick={handleAdd}>
            + Add
          </Button>
        )}
      </div>

      {/* ── Item details ──────────────────────────────────────────────────── */}
      <div className="ld-wcp-generic-tile-details">

        {/* Sponsored */}
        {sponsored && (
          <div className="ld-wcp-generic-tile-sponsored">
            <Attribute
              label="Sponsored"
              size="small"
              color="default"
              icon={<TagIcon decorative />}
            />
          </div>
        )}

        {/* Price */}
        <div
          className={cx(
            'ld-wcp-generic-tile-price-row',
            isSavings && 'ld-wcp-generic-tile-price-row--savings',
          )}
        >
          {pricePrefix && (
            <span className="ld-wcp-generic-tile-price-prefix">{pricePrefix} </span>
          )}
          <span className="ld-wcp-generic-tile-dollar">$</span>
          <span className="ld-wcp-generic-tile-price">{price}</span>
          <span className="ld-wcp-generic-tile-cents">{cents}</span>
          {priceSuffix && (
            <span className="ld-wcp-generic-tile-suffix">{priceSuffix}</span>
          )}
        </div>

        {originalPrice && (
          <div className="ld-wcp-generic-tile-original-price">{originalPrice}</div>
        )}

        {/* Description */}
        <p className="ld-wcp-generic-tile-name">{name}</p>

        {/* Rating */}
        {rating !== undefined && (
          <div className="ld-wcp-generic-tile-rating">
            <RatingDisplay value={rating} size="small" count={ratingCount} />
          </div>
        )}

        {/* Fulfillment attributes */}
        {delivery && (
          <div className="ld-wcp-generic-tile-attribute">
            <Attribute
              label={delivery}
              size="small"
              color="default"
              icon={<CheckCircleIcon decorative />}
            />
          </div>
        )}
        {fulfillment && (
          <div className="ld-wcp-generic-tile-attribute">
            <Attribute
              label={fulfillment}
              size="small"
              color="default"
              icon={<CheckCircleIcon decorative />}
            />
          </div>
        )}
      </div>
    </div>
  );
}

GenericItemTile.displayName = 'GenericItemTile';
