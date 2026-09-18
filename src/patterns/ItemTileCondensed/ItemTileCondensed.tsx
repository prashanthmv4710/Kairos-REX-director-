// @refresh reset

/**
 * @module ItemTileCondensed
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
 * For prop API + usage notes, read `ItemTileCondensed.md` in this folder
 * or run `npm run ld-kit -- show ItemTileCondensed`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/walmart/CondensedItemTile.tsx
 *
 * AX Item Tile Condensed — compact circular-image product tile used in
 * grocery / re-order grids. Composes a self-contained add-to-cart pill
 * (default mode) and `shared/QuantityStepper` (edit mode).
 *
 * Adaptation: external `<img>` swapped for `PlaceholderMedia`. The
 * upstream component referenced an `AddToCart` pill; this port uses the
 * shared `QuantityStepper` in icon-only mode for the same badge slot.
 * Check / circle icons inlined.
 */
import * as React from 'react';

import {QuantityStepper} from '../../components/QuantityStepper';
import {cx} from '../../common/cx';
import {PlaceholderMedia} from '../../common/PlaceholderMedia';

import './ItemTileCondensed.css';

export type ItemTileCondensedVariant = 'primary' | 'tertiary' | 'edit';

export interface ItemTileCondensedProps {
  /** Dollar portion of the price, e.g. "3" */
  price: string;
  /** Cents portion of the price, e.g. "25" */
  cents: string;
  /** Optional size/options tag text, e.g. "5 oz" */
  tag?: string;
  variant?: ItemTileCondensedVariant;
  fillContainer?: boolean;
  loading?: boolean;
  onAddToCart?: (count: number) => void;
  name?: string;
  quantity?: number;
  onQuantityChange?: (q: number) => void;
  isChecked?: boolean;
  onCheckChange?: (checked: boolean) => void;
  itemIndex?: number;
  animationClass?: string;
  className?: string;
}

const CheckCircleFill = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1 14L7 12l1.4-1.4 2.6 2.6 5.6-5.6L18 9l-7 7Z" />
  </svg>
);

const CircleOutline = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const ItemTileCondensed: React.FC<ItemTileCondensedProps> = ({
  price,
  cents,
  tag,
  variant = 'primary',
  loading = false,
  onAddToCart,
  name,
  quantity = 2,
  onQuantityChange,
  isChecked = true,
  onCheckChange,
  itemIndex = 0,
  animationClass,
  fillContainer = false,
  className,
}) => {
  const isEdit = variant === 'edit';
  return (
    <div
      className={cx(
        'ax-condensed-item-tile',
        isEdit && 'ax-condensed-item-tile--edit',
        loading && 'ax-condensed-item-tile--loading',
        animationClass,
        className,
      )}
      style={{['--item-delay' as string]: `${itemIndex * 41}ms`} as React.CSSProperties}
    >
      <div
        className={cx(
          'ax-condensed-item-tile__image-area',
          isEdit && 'ax-condensed-item-tile__image-area--edit',
          fillContainer && 'ax-condensed-item-tile__image-area--fill',
        )}
      >
        <div
          className={cx(
            'ax-condensed-item-tile__image',
            isEdit && 'ax-condensed-item-tile__image--edit',
            fillContainer && 'ax-condensed-item-tile__image--fill',
          )}
        >
          <PlaceholderMedia
            shape="rect"
            width="100%"
            height="100%"
            label={name || 'Product'}
          />
        </div>

        <button
          type="button"
          className={cx(
            'ax-condensed-item-tile__check',
            isEdit && 'ax-condensed-item-tile__check--visible',
          )}
          onClick={() => onCheckChange?.(!isChecked)}
          aria-label={isChecked ? 'Deselect item' : 'Select item'}
          tabIndex={isEdit ? 0 : -1}
        >
          {isChecked ? <CheckCircleFill /> : <CircleOutline />}
        </button>

        {!isEdit && onAddToCart ? (
          <div className="ax-condensed-item-tile__add-to-cart">
            <QuantityStepper
              variant={variant === 'primary' ? 'primary' : 'tertiary'}
              size="small"
              defaultCount={0}
              showAddLabel={false}
              onChange={onAddToCart}
            />
          </div>
        ) : null}
      </div>

      <div className="ax-condensed-item-tile__price-row">
        <div className="ax-condensed-item-tile__price-inner">
          <span className="ax-condensed-item-tile__dollar-sign">$</span>
          <span className="ax-condensed-item-tile__price">{price}</span>
          <span className="ax-condensed-item-tile__cents">{cents}</span>
        </div>
        {tag ? (
          <div className="ax-condensed-item-tile__tag">
            <span className="ax-condensed-item-tile__tag-text">{tag}</span>
          </div>
        ) : null}
      </div>

      <div
        className={cx(
          'ax-condensed-item-tile__edit-details',
          isEdit && 'ax-condensed-item-tile__edit-details--visible',
        )}
      >
        {name ? (
          <div className="ax-condensed-item-tile__edit-name">{name}</div>
        ) : null}

        <QuantityStepper
          key={isChecked ? 'checked' : 'unchecked'}
          variant="tertiary"
          size="small"
          defaultCount={isChecked ? quantity : 0}
          showTrashOnRemove
          onChange={(q) => {
            if (!isChecked && q > 0) onCheckChange?.(true);
            onQuantityChange?.(q);
          }}
        />
      </div>
    </div>
  );
};

ItemTileCondensed.displayName = 'ItemTileCondensed';
