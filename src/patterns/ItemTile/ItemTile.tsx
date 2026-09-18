// @refresh reset

/**
 * @module ItemTile
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
 * For prop API + usage notes, read `ItemTile.md` in this folder
 * or run `npm run ld-kit -- show ItemTile`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {Chip, ChipGroup} from '../../components/Chip/Chip';
import {Flag, FlagVariant} from '../../components/Flag';
import {HeartView} from '../../components/HeartView';
import {RatingDisplay} from '../../components/RatingDisplay';
import {QuantityStepper} from '../../components/QuantityStepper';
import {ActionGroup} from '../../components/ActionGroup';
import type {ActionGroupRows} from '../../components/ActionGroup';
import {IconButton} from '../../components/IconButton/IconButton';
import {PlusIcon} from '../../components/Icons/Icons';
import {PriceBlock} from './PriceBlock';
import {Button} from '../../components/Button';
import './ItemTile.css';

export type ItemTileFlagType =
  | 'bestseller'
  | 'deal'
  | 'popular'
  | 'rollback'
  | 'clearance'
  | 'scarcity'
  | 'savings-subtle'
  | 'confidence-bold'
  | 'holiday-member'
  | 'social'
  | 'confidence-alt'
  | 'express'
  | 'neutral'
  | 'positive';

/**
 * Visual layout variants.
 *
 * - `vertical` — single-column tile. Renders as the compact 2x2 grid tile
 *   (Jump right back in, category grids) by default; automatically adopts the
 *   stacked CTA composition (Figma 94778:26462 at 0–899px / 94854:28502 at
 *   900px+) when `actions`, `offers`, `actionDetails`, `footer`, or `badges`
 *   is provided, since that content has nowhere to go in the compact tile.
 * - `horizontal` — media column + detail column, full-width action area (Figma 93919:24063).
 */
export type ItemTileLayout = 'vertical' | 'horizontal';

/** Responsive states for the horizontal tile. */
export type ItemTileBreakpoint = 'base' | 'lg';

/** Aspect ratios the product media box supports. */
export type ItemTileImageRatio = '1:1' | '2:3';

const IMAGE_RATIO_CLASS: Record<ItemTileImageRatio, string> = {
  '1:1': 'ld-wcp-itemtile-tile--ratio11',
  '2:3': 'ld-wcp-itemtile-tile--ratio23',
};

/** Width at which the horizontal tile switches to its `lg` configuration. */
export const ITEM_TILE_LG_BREAKPOINT = 900;

/**
 * Reports which ItemTile breakpoint a container is in, using the same 900px
 * threshold as the `ld-itemtile` container query in ItemTile.css.
 *
 * Sizing that CSS can own (the media column) is handled by that container query.
 * This hook exists for the parts CSS can't reach — component props such as
 * Button `size` — so both stay on one source of truth.
 *
 * Pass a ref to the element whose width defines the tile's context, then feed
 * the result into the action content:
 *
 * ```tsx
 * const ref = React.useRef<HTMLDivElement>(null);
 * const bp = useItemTileBreakpoint(ref);
 * <div ref={ref}><ItemTile layout="horizontal" actions={rowsFor(bp)} /></div>
 * ```
 */
export function useItemTileBreakpoint(
  ref: React.RefObject<HTMLElement>,
): ItemTileBreakpoint {
  const [breakpoint, setBreakpoint] = React.useState<ItemTileBreakpoint>('base');

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      // Functional update: skip the re-render when the state is unchanged.
      setBreakpoint((prev) => {
        const next = width >= ITEM_TILE_LG_BREAKPOINT ? 'lg' : 'base';
        return prev === next ? prev : next;
      });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return breakpoint;
}

/** @deprecated Use ItemTileFlagType */
export type ItemTileBadgeType = ItemTileFlagType;

/** A single button inside the Action Details group. */
export interface ItemTileActionButton {
  /** Whether to render this button. @default true */
  visible?: boolean;
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

/**
 * Stacked Primary + Secondary buttons that belong to the product detail content
 * (Figma: Offers + Action details). Distinct from `actions` — Action Details sits
 * inside the content column, above the full-width ActionGroup.
 *
 * Each button is independently togglable; a hidden button is not rendered, so
 * the remaining one keeps the full width with no residual gap. When both are
 * hidden (or `visible` is false) the whole group collapses.
 */
export interface ItemTileActionDetails {
  /** Whether to render the group at all. @default true */
  visible?: boolean;
  primary?: ItemTileActionButton;
  secondary?: ItemTileActionButton;
}

const FLAG_VARIANT_MAP: Record<ItemTileFlagType, FlagVariant> = {
  bestseller:        'brand-subtle',
  deal:              'confidence',
  popular:           'confidence',
  rollback:          'savings-bold',
  clearance:         'urgent',
  scarcity:          'scarcity',
  'savings-subtle':  'savings-subtle',
  'confidence-bold': 'confidence-bold',
  'holiday-member':  'holiday-member',
  social:            'social',
  'confidence-alt':  'confidence-alt',
  express:           'express',
  neutral:           'neutral',
  positive:          'positive',
};

export interface ItemTileBadge {
  label: string;
  type: ItemTileFlagType;
}

/**
 * One selectable product variation (color, material, or pattern) shown in the
 * swatch row below the image.
 */
export interface ItemTileSwatch {
  /** Stable identity used for selection. */
  id: string;
  /** Accessible name — e.g. "Midnight blue". */
  label: string;
  /**
   * Any CSS background value: a solid color (`#0053e2`), or a pattern such as a
   * `repeating-linear-gradient(...)`. Ignored when `image` is set.
   */
  color?: string;
  /** Image or texture URL used as the swatch fill. Takes precedence over `color`. */
  image?: string;
  /** Renders the Figma `State=Disabled` treatment and blocks selection. */
  disabled?: boolean;
}

/** One selectable product option chip — e.g. "Single", "2 pack". */
export interface ItemTileOption {
  id: string;
  label: string;
}

export interface ItemTileProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  image: string;
  /**
   * Aspect ratio of the product media box in the vertical layouts. Omit to keep
   * the height the layout already uses. Not applied to the horizontal tile,
   * whose media column is square at every breakpoint.
   */
  imageRatio?: ItemTileImageRatio;
  name: string;
  /** Dollar amount. Omit to render an image-only tile with no price/name row. */
  price?: string;
  cents?: string;
  originalPrice?: string;
  pricePrefix?: string;
  priceSuffix?: string;
  /** Per-unit price rendered in the pricing zone.
   * @deprecated Use captionLabel
   */
  unitPrice?: string;
  /**
   * Generic caption label(s) below the price block. String or array of strings.
   */
  captionLabel?: string | string[];
  /**
   * Subtle caption trailing the strikethrough original price, e.g. "12.5¢/oz"
   */
  strikethroughCaption?: string;
  /**
   * W+ subscribed price — shown inline in the pricing zone as an alternative price state.
   * Renders as: [W+ icon] "$price.cents when subscribed"
   */
  subscribedPrice?: import('./PriceBlock').PriceBlockProps['subscribedPrice'];
  /** When true renders a standalone W+ Early Access row in the pricing zone. */
  earlyAccess?: boolean;
  /**
   * Label for the small positive Flag pill shown below a "Now" price row.
   * e.g. "You save", "Subscribe to save"
   */
  savingsLabel?: string;
  /**
   * Optional trailing text after the savings pill, e.g. "$40.00".
   * Only renders when savingsLabel is set.
   */
  savingsAmount?: string;
  /** Promotional flag rendered over the tile image. */
  flag?: { label: string; type: ItemTileFlagType };
  /** Size variant applied to promotional flags. @default 'medium' */
  flagSize?: 'small' | 'medium';
  /** Position variant for the primary flag. @default 'overlay' */
  flagPosition?: 'overlay' | 'above';
  /** @deprecated Use flag */
  badge?: { label: string; type: ItemTileFlagType };
  /**
   * Flag row rendered above the media when the tile adopts the CTA composition
   * (Figma: `Flags`, up to 3 side-by-side flags). Falls back to `badge` when
   * omitted, so existing single-badge callers keep working unchanged. Ignored
   * by the horizontal layout and by the compact (non-CTA) vertical tile.
   */
  badges?: { label: string; type: ItemTileFlagType }[];
  /**
   * Number of lines the product name is clamped to.
   * @default 1 vertical, 2 horizontal
   */
  nameLines?: 1 | 2 | 3;
  hearted?: boolean;
  onHeartChange?: (hearted: boolean) => void;
  /** Slot for benefit attributes (e.g. "Built for Better", scarcity indicators, brand offers) */
  benefitsSlot?: React.ReactNode;
  /** Slot for inventory status (e.g. stock level, aisle location, pickup availability) */
  inventorySlot?: React.ReactNode;
  /** Slot for item descriptor tags (e.g. compliance, content rating, condition, seller tags) */
  attributesSlot?: React.ReactNode;
  /**
   * Slot for fulfillment method indicators (e.g. pickup, express, free delivery, drone).
   * Rendered between the inventory slot and the price block.
   * Use small-size Attribute components with leading icons for each method.
   */
  fulfillmentSlot?: React.ReactNode;
  /** Optional attribute row rendered above the price block. */
  prePriceSlot?: React.ReactNode;
  /** Visual layout variant. @default 'vertical' */
  layout?: ItemTileLayout;
  /** Star rating value (0–5). Renders RatingDisplay when provided. */
  rating?: number;
  /** Review count string passed to RatingDisplay, e.g. "1,234". */
  reviewCount?: string;
  /** Controlled cart quantity. Renders QuantityStepper when provided. */
  cartQty?: number;
  /** Called when cart quantity changes via QuantityStepper. */
  onCartQtyChange?: (qty: number) => void;
  /**
   * Configurable action rows rendered at the bottom of the horizontal layout
   * (Figma: node 94623:24683 — Actions-horizontal with 6 independently togglable rows).
   * Each row has visible + content. Set visible=false or omit to hide with zero residual space.
   * Rows: primaryActions, preferenceActions, quantityActions, listActions, fulfillmentActions, checkboxAction.
   */
  actions?: ActionGroupRows;
  /**
   * Where the horizontal tile's actions live. The two positions are exclusive,
   * so a tile never shows actions in both places.
   *
   * - `fullWidth` — the `actions` rows sit below all content and span the tile.
   *   The whole row set is available; `actionDetails` is not rendered.
   * - `inline` — only the `actionDetails` button pair sits in the content column
   *   beside the media. `actions` rows are not rendered; there is no room for them.
   *
   * Ignored by the vertical layout, which has its own fixed action position.
   * @default 'fullWidth'
   */
  actionPlacement?: 'inline' | 'fullWidth';
  /** Flags rendered in a row above the image, as in the swatch-selection tile. */
  flags?: ItemTileBadge[];
  /**
   * Responsive breakpoint the tile renders at (Figma: the `breakpoint` variant
   * property). Drives the image size *and* the size variant of every control
   * inside the tile. Omit to follow the tile's own measured width.
   */
  breakpoint?: ItemTileBreakpoint;
  /**
   * Product variations shown as a swatch row below the image. At most
   * {@link MAX_VISIBLE_SWATCHES} circles render; the rest belong behind the
   * "+" affordance.
   */
  swatches?: ItemTileSwatch[];
  /**
   * Whether the swatches expose interactive states (selected, hover, pressed,
   * focus). Defaults to `false` at the `base` breakpoint — the 0–899px tile
   * shows stateless circles — and `true` otherwise.
   */
  swatchesInteractive?: boolean;
  selectedSwatchId?: string;
  onSwatchChange?: (swatchId: string) => void;
  /** Show the trailing "+" affordance for variations that don't fit the row. */
  showSwatchMore?: boolean;
  onSwatchMoreClick?: () => void;
  /** Accessible label for the "+" affordance. */
  swatchMoreLabel?: string;
  /** Product options rendered as single-select Chips below the swatches. */
  options?: ItemTileOption[];
  selectedOptionId?: string;
  onOptionChange?: (optionId: string) => void;
  /**
   * Offer content rendered in the content column, below the item details and
   * above Action Details (Figma: `Offer badge` 88885:18959 / 88885:18960).
   * Pass one or more {@link OfferBadge}s. Omit to remove the section entirely —
   * no space is reserved. Horizontal layout, and the vertical tile's CTA
   * composition, only.
   */
  offers?: React.ReactNode;
  /**
   * Stacked Primary + Secondary buttons below Offers and above the `actions`
   * ActionGroup. Horizontal layout, and the vertical tile's CTA composition, only.
   */
  actionDetails?: ItemTileActionDetails;
  /**
   * Trailing full-width slot below the item details, shown by the vertical
   * tile's CTA composition for the 900px+ disclosure row (Figma: `.Accordion
   * actions / 900+px`). Omit to render nothing — no space is reserved.
   */
  footer?: React.ReactNode;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

/** Design cap: a tile never shows more than four circles, "+" excluded. */
export const MAX_VISIBLE_SWATCHES = 4;

const BREAKPOINT_CLASS: Record<ItemTileBreakpoint, string> = {
  base: 'ld-wcp-itemtile-sizeSmall',
  lg: 'ld-wcp-itemtile-sizeLarge',
};

/** Arrow keys move selection inside the swatch radio group, per WAI-ARIA. */
const ARROW_STEP: Record<string, number> = {
  ArrowLeft: -1,
  ArrowUp: -1,
  ArrowRight: 1,
  ArrowDown: 1,
};

export const ItemTile: React.FunctionComponent<ItemTileProps> = (props) => {
  const {
    image,
    imageRatio,
    name,
    price,
    cents,
    originalPrice,
    pricePrefix,
    priceSuffix,
    unitPrice,
    captionLabel,
    strikethroughCaption,
    subscribedPrice,
    earlyAccess,
    savingsLabel,
    savingsAmount,
    flag,
    badge,
    badges,
    flagSize = 'medium',
    flagPosition = 'overlay',
    nameLines,
    hearted,
    onHeartChange,
    benefitsSlot,
    inventorySlot,
    attributesSlot,
    fulfillmentSlot,
    prePriceSlot,
    layout = 'vertical',
    rating,
    reviewCount,
    cartQty,
    onCartQtyChange,
    actions,
    actionPlacement = 'fullWidth',
    flags,
    breakpoint,
    swatches,
    swatchesInteractive,
    selectedSwatchId,
    onSwatchChange,
    showSwatchMore,
    onSwatchMoreClick,
    swatchMoreLabel = 'More options',
    options,
    selectedOptionId,
    onOptionChange,
    offers,
    actionDetails,
    footer,
    className,
    ...rest
  } = applyCommonProps(props);

  const activeFlag = flag ?? badge;
  const isHorizontal = layout === 'horizontal';
  // The CTA slot is content, not a layout choice a caller makes explicitly:
  // the vertical tile adopts the CTA composition as soon as anything that
  // only makes sense there (actions, offers, action details, footer, or a
  // multi-flag row) is provided — the compact tile has nowhere to put it.
  const hasCtaContent = !!actions || !!offers || !!footer || !!actionDetails || !!badges?.length;
  const isVerticalCta = !isHorizontal && hasCtaContent;
  // The horizontal tile has room for a second line, so it clamps at 2 unless asked otherwise.
  const resolvedNameLines = nameLines ?? (isHorizontal ? 2 : 1);
  // Action Details button `size` is a prop, so it can't come from the container
  // query — read the tile's own width off the same 900px threshold instead.
  const tileRef = React.useRef<HTMLDivElement>(null);
  const measuredBreakpoint = useItemTileBreakpoint(tileRef);
  // An explicit breakpoint pins every size; otherwise the tile follows its own width.
  const pinnedBreakpoint = breakpoint;
  const activeBreakpoint = pinnedBreakpoint ?? measuredBreakpoint;
  // Figma steps every control up one size at 900px+ (heart 24→32, button/stepper 32→40).
  const controlSize = activeBreakpoint === 'lg' ? 'medium' : 'small';
  const [hasImageError, setHasImageError] = React.useState(false);
  const hasImage = !!image?.trim() && !hasImageError;
  // The row is capped here rather than at the call site so no consumer can
  // render a fifth circle.
  const visibleSwatches = swatches?.slice(0, MAX_VISIBLE_SWATCHES) ?? [];
  const hasSwatches = visibleSwatches.length > 0;
  const hasOptions = !!options?.length;
  const hasPrice = price !== undefined;
  const swatchRowRef = React.useRef<HTMLDivElement>(null);
  // 0–899px swatches are presentational: no selected ring, no hover/press/focus.
  const isSwatchInteractive = swatchesInteractive ?? activeBreakpoint !== 'base';

  React.useEffect(() => {
    setHasImageError(false);
  }, [image]);

  // Only tiles that opt into the swatch/option slots get the 164/288 sizing;
  // classic price tiles keep their existing 200px footprint untouched.
  const sizeClass = pinnedBreakpoint
    ? BREAKPOINT_CLASS[pinnedBreakpoint]
    : hasSwatches || hasOptions
      ? 'ld-wcp-itemtile-sizeResponsive'
      : undefined;

  const handleSwatchKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = ARROW_STEP[event.key];
    if (!step || !visibleSwatches.length) return;
    event.preventDefault();

    // Walk in the arrow direction, skipping disabled swatches.
    // Guard against a fully-disabled set by limiting iterations to length - 1.
    let next = (index + step + visibleSwatches.length) % visibleSwatches.length;
    let attempts = visibleSwatches.length - 1;
    while (visibleSwatches[next].disabled && attempts > 0) {
      next = (next + step + visibleSwatches.length) % visibleSwatches.length;
      attempts--;
    }
    // If every candidate is disabled, leave selection and focus unchanged.
    if (visibleSwatches[next].disabled) return;

    onSwatchChange?.(visibleSwatches[next].id);
    const buttons = swatchRowRef.current?.querySelectorAll<HTMLButtonElement>(
      '.ld-wcp-itemtile-swatch',
    );
    buttons?.[next]?.focus();
  };

  const swatchFillStyle = (swatch: ItemTileSwatch): React.CSSProperties | undefined =>
    swatch.image
      ? {backgroundImage: `url(${swatch.image})`}
      : swatch.color
        ? {background: swatch.color}
        : undefined;


  const imageContent = hasImage ? (
    <img
      src={image}
      alt={name}
      className="ld-wcp-itemtile-image"
      onError={() => setHasImageError(true)}
    />
  ) : (
    <div className="ld-wcp-itemtile-imagePlaceholder" aria-hidden="true">
      <span className="ld-wcp-itemtile-imagePlaceholderText">
        {hasImageError ? 'Image unavailable' : name?.trim() || 'Placeholder'}
      </span>
    </div>
  );

  const swatchRowContent = hasSwatches ? (
    <div
      className="ld-wcp-itemtile-swatchRow"
      ref={swatchRowRef}
      {...(isSwatchInteractive
        ? {role: 'radiogroup', 'aria-label': `${name} variations`}
        : {role: 'list', 'aria-label': `${name} available variations`})}
    >
      {visibleSwatches.map((swatch, index) => {
        const isSelected = isSwatchInteractive && swatch.id === selectedSwatchId;
        // Stateless presentation for the 0–899px tile: no button, so no
        // hover/press/focus/selected treatment can appear.
        if (!isSwatchInteractive) {
          return (
            <span
              key={swatch.id}
              role="listitem"
              aria-label={swatch.label}
              className="ld-wcp-itemtile-swatch"
            >
              <span className="ld-wcp-itemtile-swatchFill" style={swatchFillStyle(swatch)} />
            </span>
          );
        }
        return (
          <button
            key={swatch.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={swatch.label}
            disabled={swatch.disabled}
            // Roving tabindex: the group is one tab stop, arrows move within it.
            tabIndex={isSelected || (!selectedSwatchId && index === 0) ? 0 : -1}
            className={cx(
              'ld-wcp-itemtile-swatch',
              'ld-wcp-itemtile-swatchInteractive',
              isSelected && 'ld-wcp-itemtile-swatchSelected',
            )}
            onClick={() => onSwatchChange?.(swatch.id)}
            onKeyDown={(event) => handleSwatchKeyDown(event, index)}
          >
            <span className="ld-wcp-itemtile-swatchFill" style={swatchFillStyle(swatch)} />
          </button>
        );
      })}
      {showSwatchMore && (
        <IconButton
          a11yLabel={swatchMoreLabel}
          size="xsmall"
          variant="round"
          onClick={onSwatchMoreClick}
        >
          <PlusIcon decorative size="small" />
        </IconButton>
      )}
    </div>
  ) : null;

  const optionsContent = hasOptions ? (
    <div className="ld-wcp-itemtile-options">
      <ChipGroup aria-label={`${name} options`}>
        {options.map((option) => (
          <Chip
            key={option.id}
            size="medium"
            selected={option.id === selectedOptionId}
            onClick={() => onOptionChange?.(option.id)}
          >
            {option.label}
          </Chip>
        ))}
      </ChipGroup>
    </div>
  ) : null;

  // `price` is optional so a swatch/image-only tile can omit the pricing zone
  // entirely; PriceBlock requires both halves, so gate on hasPrice.
  const priceBlock = hasPrice ? (
    <PriceBlock
      price={price}
      cents={cents ?? '00'}
      prefix={pricePrefix}
      suffix={priceSuffix}
      originalPrice={originalPrice}
      unitPrice={unitPrice}
      captionLabel={captionLabel}
      strikethroughCaption={strikethroughCaption}
      subscribedPrice={subscribedPrice}
      earlyAccess={earlyAccess}
      savingsLabel={savingsLabel}
      savingsAmount={savingsAmount}
    />
  ) : null;

  // Action Details — each button is optional, and the group disappears when the
  // caller hides it or hides both buttons, so no empty block is ever rendered.
  const detailPrimary = actionDetails?.primary;
  const detailSecondary = actionDetails?.secondary;
  const showDetailPrimary = !!detailPrimary && detailPrimary.visible !== false;
  const showDetailSecondary = !!detailSecondary && detailSecondary.visible !== false;
  const showActionDetails =
    !!actionDetails &&
    actionDetails.visible !== false &&
    (showDetailPrimary || showDetailSecondary);
  const detailButtonSize = controlSize;

  if (isVerticalCta) {
    // Figma renders a `Flags` row of up to 3 flags above the media. `badges` is
    // the multi-flag form; `badge` remains the single-flag shorthand.
    const flagList = badges?.length ? badges : activeFlag ? [activeFlag] : [];
    // A multi-flag row always sits above the media; a single flag follows
    // flagPosition so the prop means the same thing in every layout.
    const showFlagRow = flagList.length > 1 || (flagList.length === 1 && flagPosition === 'above');
    const overlayFlag = flagList.length === 1 && !showFlagRow ? flagList[0] : null;

    return (
      <div
        ref={tileRef}
        className={cx(
          'ld-wcp-itemtile-tile',
          'ld-wcp-itemtile-tile--v',
          pinnedBreakpoint === 'lg' && 'ld-wcp-itemtile-tile--vLg',
          pinnedBreakpoint === 'base' && 'ld-wcp-itemtile-tile--vBase',
          imageRatio && IMAGE_RATIO_CLASS[imageRatio],
          className,
        )}
        {...rest}
      >
        {/* Item visual — flag row above the square media, heart overlaid on it. */}
        <div className="ld-wcp-itemtile-visual--v">
          {showFlagRow && (
            <div className="ld-wcp-itemtile-flags--v">
              {flagList.map((f, i) => (
                <Flag key={`${f.type}-${i}`} label={f.label} variant={FLAG_VARIANT_MAP[f.type]} size={flagSize} />
              ))}
            </div>
          )}
          {/*
            The heart is a sibling of the image wrapper rather than a child: the
            wrapper clips overflow to keep the image inside its radius, which
            would also clip the heart's callout.
          */}
          <div className="ld-wcp-itemtile-media--v">
            {overlayFlag && (
              <div className="ld-wcp-itemtile-flagWrap">
                <Flag label={overlayFlag.label} variant={FLAG_VARIANT_MAP[overlayFlag.type]} size={flagSize} />
              </div>
            )}
            <div className="ld-wcp-itemtile-imageWrapper ld-wcp-itemtile-imageWrapper--v">
              {imageContent}
            </div>
            <div className="ld-wcp-itemtile-heartWrap ld-wcp-itemtile-heartWrap--v">
              <HeartView size={controlSize} calloutPosition="top" aria-label={`Save ${name} to favorites`} {...(hearted !== undefined ? {activated: hearted, onChange: onHeartChange} : {})} />
            </div>
          </div>
          {swatchRowContent}
          {optionsContent}
        </div>

        {/*
          Actions sit between the media and the item details (Figma:
          `Actions-vertical`), not at the bottom as in the horizontal layout.
        */}
        {actions && (
          <div className="ld-wcp-itemtile-actions--v">
            <ActionGroup rows={actions} />
          </div>
        )}

        {/* Item details */}
        <div className="ld-wcp-itemtile-body ld-wcp-itemtile-body--v">
          {prePriceSlot && <div className="ld-wcp-itemtile-prePriceSlot">{prePriceSlot}</div>}
          {priceBlock}
          <p className={cx('ld-wcp-itemtile-name', 'ld-wcp-itemtile-name--v', `ld-wcp-itemtile-name--lines-${resolvedNameLines}`)}>{name}</p>
          {rating !== undefined && (
            <RatingDisplay value={rating} count={reviewCount} size="small" />
          )}
          {benefitsSlot && <div className="ld-wcp-itemtile-benefitsSlot">{benefitsSlot}</div>}
          {inventorySlot && <div className="ld-wcp-itemtile-inventorySlot">{inventorySlot}</div>}
          {fulfillmentSlot && <div className="ld-wcp-itemtile-fulfillmentSlot">{fulfillmentSlot}</div>}
          {attributesSlot && <div className="ld-wcp-itemtile-attributesSlot">{attributesSlot}</div>}

          {offers && <div className="ld-wcp-itemtile-offers--v">{offers}</div>}

          {showActionDetails && (
            <div className="ld-wcp-itemtile-actionDetails--v">
              {showDetailPrimary && detailPrimary && (
                <Button
                  variant="primary"
                  size={detailButtonSize}
                  isFullWidth
                  onClick={detailPrimary.onClick}
                >
                  {detailPrimary.label}
                </Button>
              )}
              {showDetailSecondary && detailSecondary && (
                <Button
                  variant="secondary"
                  size={detailButtonSize}
                  isFullWidth
                  onClick={detailSecondary.onClick}
                >
                  {detailSecondary.label}
                </Button>
              )}
            </div>
          )}
        </div>

        {footer && <div className="ld-wcp-itemtile-footer--v">{footer}</div>}
      </div>
    );
  }

  if (isHorizontal) {
    return (
      <div
        ref={tileRef}
        className={cx(
          'ld-wcp-itemtile-tile',
          'ld-wcp-itemtile-tile--h',
          pinnedBreakpoint === 'lg' && 'ld-wcp-itemtile-tile--hLg',
          pinnedBreakpoint === 'base' && 'ld-wcp-itemtile-tile--hBase',
          className,
        )}
        {...rest}
      >
        {activeFlag && flagPosition === 'above' && (
          <div className="ld-wcp-itemtile-flagRow ld-wcp-itemtile-flagRow--above">
            <Flag label={activeFlag.label} variant={FLAG_VARIANT_MAP[activeFlag.type]} size={flagSize} />
          </div>
        )}
        {/* Media + content row */}
        <div className="ld-wcp-itemtile-main--h">
          {/* Heart is a sibling of the wrapper, whose overflow would clip its callout. */}
          <div className="ld-wcp-itemtile-media--h">
            <div className="ld-wcp-itemtile-imageWrapper ld-wcp-itemtile-imageWrapper--h">
              {activeFlag && flagPosition === 'overlay' && (
                <div className="ld-wcp-itemtile-flagWrap">
                  <Flag label={activeFlag.label} variant={FLAG_VARIANT_MAP[activeFlag.type]} size={flagSize} />
                </div>
              )}
              {imageContent}
            </div>
            <div className="ld-wcp-itemtile-heartWrap ld-wcp-itemtile-heartWrap--h">
              <HeartView size={controlSize} calloutPosition="top" aria-label={`Save ${name} to favorites`} {...(hearted !== undefined ? {activated: hearted, onChange: onHeartChange} : {})} />
            </div>
          </div>

          {/* Content column */}
          <div className="ld-wcp-itemtile-body ld-wcp-itemtile-body--h">
            {prePriceSlot && <div className="ld-wcp-itemtile-prePriceSlot">{prePriceSlot}</div>}
            {priceBlock}
            <p className={cx('ld-wcp-itemtile-name', 'ld-wcp-itemtile-name--h', `ld-wcp-itemtile-name--lines-${resolvedNameLines}`)}>{name}</p>
            {rating !== undefined && (
              <RatingDisplay value={rating} count={reviewCount} size="small" />
            )}
            {benefitsSlot && <div className="ld-wcp-itemtile-benefitsSlot">{benefitsSlot}</div>}
            {inventorySlot && <div className="ld-wcp-itemtile-inventorySlot">{inventorySlot}</div>}
            {fulfillmentSlot && <div className="ld-wcp-itemtile-fulfillmentSlot">{fulfillmentSlot}</div>}
            {attributesSlot && <div className="ld-wcp-itemtile-attributesSlot">{attributesSlot}</div>}

            {offers && <div className="ld-wcp-itemtile-offers--h">{offers}</div>}

            {showActionDetails && actionPlacement === 'inline' && (
              <div className="ld-wcp-itemtile-actionDetails--h">
                {showDetailPrimary && detailPrimary && (
                  <Button
                    variant="primary"
                    size={detailButtonSize}
                    isFullWidth
                    onClick={detailPrimary.onClick}
                  >
                    {detailPrimary.label}
                  </Button>
                )}
                {showDetailSecondary && detailSecondary && (
                  <Button
                    variant="secondary"
                    size={detailButtonSize}
                    isFullWidth
                    onClick={detailSecondary.onClick}
                  >
                    {detailSecondary.label}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions span the full tile width, below the media/content row. */}
        {actions && actionPlacement === 'fullWidth' && (
          <div className="ld-wcp-itemtile-actions ld-wcp-itemtile-actions--h">
            <ActionGroup rows={actions} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={tileRef} className={cx('ld-wcp-itemtile-tile', sizeClass, imageRatio && IMAGE_RATIO_CLASS[imageRatio], className)} {...rest}>
      {activeFlag && flagPosition === 'above' && (
        <div className="ld-wcp-itemtile-flagRow ld-wcp-itemtile-flagRow--above">
          <Flag label={activeFlag.label} variant={FLAG_VARIANT_MAP[activeFlag.type]} size={flagSize} />
        </div>
      )}
      {!!flags?.length && (
        <div className="ld-wcp-itemtile-flagRow">
          {flags.map((f, index) => (
            // eslint-disable-next-line react/no-array-index-key -- labels repeat; position is the only stable identity
            <Flag key={`${f.label}-${index}`} label={f.label} variant={FLAG_VARIANT_MAP[f.type]} size={flagSize} />
          ))}
        </div>
      )}
      {/* Relative wrapper so the heart and overlay flag anchor to the image without
          living inside its `overflow: hidden` box (which would clip the callout). */}
      <div className="ld-wcp-itemtile-media">
        {activeFlag && flagPosition === 'overlay' && (
          <div className="ld-wcp-itemtile-flagWrap">
            <Flag label={activeFlag.label} variant={FLAG_VARIANT_MAP[activeFlag.type]} size={flagSize} />
          </div>
        )}
        <div className="ld-wcp-itemtile-heartWrap">
          <HeartView size={controlSize} calloutPosition="top" aria-label={`Save ${name} to favorites`} {...(hearted !== undefined ? {activated: hearted, onChange: onHeartChange} : {})} />
        </div>
        <div className="ld-wcp-itemtile-imageWrapper">
          {imageContent}
        </div>
      </div>
      {swatchRowContent}
      {optionsContent}
      <div className="ld-wcp-itemtile-body">
        {prePriceSlot && <div className="ld-wcp-itemtile-prePriceSlot">{prePriceSlot}</div>}
        {priceBlock}
        <p className={cx('ld-wcp-itemtile-name', `ld-wcp-itemtile-name--lines-${resolvedNameLines}`)}>{name}</p>
        {rating !== undefined && (
          <RatingDisplay value={rating} count={reviewCount} size="small" />
        )}
        {benefitsSlot && <div className="ld-wcp-itemtile-benefitsSlot">{benefitsSlot}</div>}
        {inventorySlot && <div className="ld-wcp-itemtile-inventorySlot">{inventorySlot}</div>}
        {fulfillmentSlot && <div className="ld-wcp-itemtile-fulfillmentSlot">{fulfillmentSlot}</div>}
        {attributesSlot && <div className="ld-wcp-itemtile-attributesSlot">{attributesSlot}</div>}
        {cartQty !== undefined && (
          <div className="ld-wcp-itemtile-cta">
            <QuantityStepper
              variant="secondary"
              size={controlSize}
              count={cartQty}
              onChange={onCartQtyChange}
              // Visible label stays "+ Add"; the product name rides on the
              // accessible name so it stays unique per tile (WCAG 2.4.6).
              addLabel="Add"
              addA11yLabel={`Add ${name}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};
ItemTile.displayName = 'ItemTile';