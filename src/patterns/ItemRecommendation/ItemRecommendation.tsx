// @refresh reset

/**
 * @module ItemRecommendation
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
 * For prop API + usage notes, read `ItemRecommendation.md` in this folder
 * or run `npm run ld-kit -- show ItemRecommendation`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/walmart/ItemRecommendation.tsx
 *
 * AX Item Recommendation — AI-driven product recommendation card with
 * a header (eyebrow + tag + trailing action), item details + image,
 * optional metrics row, location chip, sidekick magic-fill insight
 * banner, optional alert, and a pair of alternate / preferred buttons.
 *
 * Adaptation: `UNSAFE_*` props dropped in favour of `className` /
 * `style`. Product image can be provided via `imageUrl`, with
 * `PlaceholderMedia` retained as fallback. `LocationIcon` and
 * `ChevronRight` use the shared LD icon font; the Sidekick magic-fill
 * glyph stays an inline SVG (gradient artwork, no font equivalent).
 * `Tag` uses `core/Tag` (`color` dropped — falls back to default styling).
 */
import * as React from 'react';

import {Alert} from '../../components/Alert';
import {Button} from '../../components/Button';
import {Checkbox} from '../../components/Checkbox';
import {Divider} from '../../components/Divider';
import {LinkButton} from '../../components/LinkButton';
import {Tag} from '../../components/Tag';
import {Icon} from '../../components/Icons';
import {cx} from '../../common/cx';
import {PlaceholderMedia} from '../../common/PlaceholderMedia';

import './ItemRecommendation.css';

const SIDEKICK_GRADIENT_ID = 'ax-item-rec-sidekick-magic';

const SidekickMagicIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
    style={{flexShrink: 0}}
  >
    <defs>
      <linearGradient
        id={SIDEKICK_GRADIENT_ID}
        x1="0%"
        y1="0%"
        x2="100%"
        y2="0%"
      >
        <stop
          offset="0%"
          stopColor="var(--ld-semantic-color-text-magic-start, #0053E2)"
        />
        <stop
          offset="50%"
          stopColor="var(--ld-semantic-color-text-magic-middle, #3D90EC)"
        />
        <stop
          offset="100%"
          stopColor="var(--ld-semantic-color-text-magic-stop, #79CDF6)"
        />
      </linearGradient>
    </defs>
    <path
      d="M7.41 22.98c-1.36-1.36-1.36-3.56 0-4.92l9.84-9.84 1.48 1.47c1.9 1.9 1.9 4.99 0 6.89l-6.4 6.4c-1.36 1.36-3.56 1.36-4.92 0Z"
      fill={`url(#${SIDEKICK_GRADIENT_ID})`}
    />
    <path
      d="M5.27 14.31c-1.9-1.9-1.9-4.99 0-6.89l6.4-6.4c1.36-1.36 3.56-1.36 4.92 0 1.36 1.36 1.36 3.56 0 4.92L6.74 15.78l-1.47-1.47Z"
      fill={`url(#${SIDEKICK_GRADIENT_ID})`}
    />
  </svg>
);

const ChevronRightIcon = () => <Icon name="ChevronRight" style={{fontSize: 20}} decorative />;

const LocationIcon = () => <Icon name="Location" size="small" decorative />;

export type ItemRecommendationAction =
  | 'none'
  | 'navigate'
  | 'linkButton'
  | 'checkbox';

export interface ItemRecommendationMetric {
  label: string;
  value: string;
}

export interface ItemRecommendationProps {
  eyebrowText?: string;
  tagLabel?: string;
  trailingAction?: ItemRecommendationAction;
  linkButtonLabel?: string;
  onLinkButtonClick?: () => void;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onNavigate?: () => void;

  imageUrl?: string;
  imageAlt?: string;
  itemName?: string;
  itemColor?: string;
  price?: string;
  wasPrice?: string;
  pricingDetails?: string;
  unitPrice?: string;
  attributes?: Array<{key: string; value: string}>;

  metrics?: ItemRecommendationMetric[];

  locationCode?: string;
  additionalLocations?: number;
  onMoreLocations?: () => void;

  insightText?: string;
  showInsight?: boolean;

  alertMessage?: string;
  alertActionLabel?: string;
  onAlertAction?: () => void;
  showAlert?: boolean;

  alternateLabel?: string;
  preferredLabel?: string;
  onAlternate?: () => void;
  onPreferred?: () => void;

  className?: string;
  style?: React.CSSProperties;
}

export const ItemRecommendation: React.FC<ItemRecommendationProps> = ({
  eyebrowText = 'Eyebrow text',
  tagLabel,
  trailingAction = 'navigate',
  linkButtonLabel = 'Button',
  onLinkButtonClick,
  checked = false,
  onCheckedChange,
  onNavigate,
  imageUrl,
  imageAlt = '',
  itemName = 'ITEM NAME',
  itemColor = 'Color',
  price = '$10.98 ea',
  wasPrice = '$11.98',
  pricingDetails,
  unitPrice,
  attributes = [],
  metrics = [],
  locationCode,
  additionalLocations,
  onMoreLocations,
  insightText = 'Data-based intelligence to support action.',
  showInsight = true,
  alertMessage,
  alertActionLabel,
  onAlertAction,
  showAlert = false,
  alternateLabel = 'Alternate',
  preferredLabel = 'Preferred',
  onAlternate,
  onPreferred,
  className,
  style,
}) => {
  const checkboxId = React.useId();
  return (
    <div className={cx('ax-item-recommendation', className)} style={style}>
      <div className="ax-item-recommendation__header">
        <div className="ax-item-recommendation__header-left">
          <span className="ax-item-recommendation__eyebrow">{eyebrowText}</span>
          {tagLabel ? <Tag variant="tertiary">{tagLabel}</Tag> : null}
        </div>

        <div className="ax-item-recommendation__header-trailing">
          {trailingAction === 'navigate' ? (
            <button
              type="button"
              className="ax-item-recommendation__navigate-btn"
              onClick={onNavigate}
              aria-label="View item details"
            >
              <ChevronRightIcon />
            </button>
          ) : null}
          {trailingAction === 'linkButton' ? (
            <LinkButton size="small" onClick={onLinkButtonClick}>
              {linkButtonLabel}
            </LinkButton>
          ) : null}
          {trailingAction === 'checkbox' ? (
            <Checkbox
              id={checkboxId}
              checked={checked}
              onChange={(e) => onCheckedChange?.(e.target.checked)}
              label="Select item"
            />
          ) : null}
        </div>
      </div>

      <div className="ax-item-recommendation__item-row">
        <div className="ax-item-recommendation__image-wrapper">
          {imageUrl ? (
            <img
              className="ax-item-recommendation__image"
              src={imageUrl}
              alt={imageAlt}
            />
          ) : (
            <PlaceholderMedia
              shape="rect"
              width={56}
              height={56}
              label={imageAlt}
            />
          )}
        </div>
        <div className="ax-item-recommendation__item-details">
          <p className="ax-item-recommendation__item-name">{itemName}</p>
          {itemColor ? (
            <p className="ax-item-recommendation__item-color">{itemColor}</p>
          ) : null}
          <p className="ax-item-recommendation__price-row">
            <span className="ax-item-recommendation__price">{price}</span>
            {wasPrice ? (
              <span className="ax-item-recommendation__was-price">
                WAS{' '}
                <span className="ax-item-recommendation__was-price-value">
                  {wasPrice}
                </span>
              </span>
            ) : null}
          </p>
          {pricingDetails ? (
            <p className="ax-item-recommendation__pricing-details">
              {pricingDetails}
            </p>
          ) : null}
          {unitPrice ? (
            <p className="ax-item-recommendation__unit-price">{unitPrice}</p>
          ) : null}
          {attributes.map((attr) => (
            <p
              key={attr.key}
              className="ax-item-recommendation__attribute-row"
            >
              <span className="ax-item-recommendation__attr-key">
                {attr.key}
              </span>
              <span className="ax-item-recommendation__attr-value">
                {attr.value}
              </span>
            </p>
          ))}
        </div>
      </div>

      {metrics.length > 0 ? (
        <div className="ax-item-recommendation__metrics">
          {metrics.map((metric, i) => (
            <React.Fragment key={metric.label}>
              {i > 0 ? (
                <div
                  className="ax-item-recommendation__metric-divider"
                  aria-hidden
                />
              ) : null}
              <div className="ax-item-recommendation__metric">
                <span className="ax-item-recommendation__metric-label">
                  {metric.label}
                </span>
                <span className="ax-item-recommendation__metric-value">
                  {metric.value}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
      ) : null}

      {locationCode ? (
        <>
          <Divider />
          <div className="ax-item-recommendation__location">
            <span className="ax-item-recommendation__location-icon" aria-hidden>
              <LocationIcon />
            </span>
            <span className="ax-item-recommendation__location-code">
              {locationCode}
            </span>
            {additionalLocations != null && additionalLocations > 0 ? (
              <button
                type="button"
                className="ax-item-recommendation__more-locations"
                onClick={onMoreLocations}
              >
                +{additionalLocations} more locations
              </button>
            ) : null}
          </div>
        </>
      ) : null}

      {showInsight ? (
        <div className="ax-item-recommendation__insight">
          <SidekickMagicIcon />
          <span className="ax-item-recommendation__insight-text">
            {insightText}
          </span>
        </div>
      ) : null}

      {showAlert && alertMessage ? (
        <Alert
          variant="error"
          actionButtonProps={
            alertActionLabel
              ? {children: alertActionLabel, onClick: onAlertAction}
              : undefined
          }
        >
          {alertMessage}
        </Alert>
      ) : null}

      <div className="ax-item-recommendation__actions">
        <Button variant="secondary" size="small" isFullWidth onClick={onAlternate}>
          {alternateLabel}
        </Button>
        <Button variant="primary" size="small" isFullWidth onClick={onPreferred}>
          {preferredLabel}
        </Button>
      </div>
    </div>
  );
};

ItemRecommendation.displayName = 'ItemRecommendation';

