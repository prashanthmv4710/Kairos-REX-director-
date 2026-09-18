// @refresh reset

/**
 * @module AutoCareUpsellOfferCard
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
 * For prop API + usage notes, read `AutoCareUpsellOfferCard.md` in this folder
 * or run `npm run ld-kit -- show AutoCareUpsellOfferCard`.
 */

import * as React from 'react';
import { useState } from "react";
import { Button } from '../../components/Button';
import { Tag } from '../../components/Tag';
import { Alert } from '../../components/Alert';
import { cx } from '../../common/cx';
import './AutoCareUpsellOfferCard.css';

interface AutoCareUpsellOfferCardProps {
  vehicle: string;
  vehicleSub: string;
  serviceName: string;
  discountPct: number;
  regularPrice: string;
  memberPrice: string;
  savings: string;
  expiresInDays: number;
  terms?: string;
  illustration?: string;
  valueBullets?: string[];
}

export function AutoCareUpsellOfferCard({
  vehicle,
  vehicleSub,
  serviceName,
  discountPct,
  regularPrice,
  memberPrice,
  savings,
  expiresInDays,
  terms,
  illustration,
  valueBullets,
}: AutoCareUpsellOfferCardProps) {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <article className="ld-wcp-auto-care-upsell-offer-card-root">
      {/* Offer header */}
      <div className="ld-wcp-auto-care-upsell-offer-card-header">
        {illustration && (
          <img
            src={illustration}
            alt="" aria-hidden="true"
            className="ld-wcp-auto-care-upsell-offer-card-header-illustration"
          />
        )}
        <div className="ld-wcp-auto-care-upsell-offer-card-header-text">
          <p className="ld-wcp-auto-care-upsell-offer-card-header-eyebrow">Special offer</p>
          <p className="ld-wcp-auto-care-upsell-offer-card-header-title">{discountPct}% off {serviceName}</p>
          <p className="ld-wcp-auto-care-upsell-offer-card-header-subtitle">{vehicle} · {vehicleSub}</p>
        </div>
        <div className="ld-wcp-auto-care-upsell-offer-card-badge">
          <span className="ld-wcp-auto-care-upsell-offer-card-badge-pct">{discountPct}%</span>
          <span className="ld-wcp-auto-care-upsell-offer-card-badge-off">off</span>
        </div>
      </div>

      {/* Pricing */}
      <div className="ld-wcp-auto-care-upsell-offer-card-pricing">
        <div className="ld-wcp-auto-care-upsell-offer-card-price-row">
          <div className="ld-wcp-auto-care-upsell-offer-card-price-col">
            <span className="ld-wcp-auto-care-upsell-offer-card-regular-price">
              Regular: {regularPrice}
            </span>
            <span className="ld-wcp-auto-care-upsell-offer-card-member-price">
              {memberPrice}
            </span>
          </div>
          <Tag color="positive">
            Save {savings}
          </Tag>
        </div>

        <div className="ld-wcp-auto-care-upsell-offer-card-expires">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span className="ld-wcp-auto-care-upsell-offer-card-expires-text">Expires in {expiresInDays} day{expiresInDays !== 1 ? "s" : ""}</span>
        </div>

        {/* Value bullets */}
        {valueBullets && valueBullets.length > 0 && (
          <ul className="ld-wcp-auto-care-upsell-offer-card-bullets">
            {valueBullets.map((b, i) => (
              <li key={i} className="ld-wcp-auto-care-upsell-offer-card-bullet">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ld-semantic-color-text-positive, #16a34a)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ld-wcp-auto-care-upsell-offer-card-bullet-icon">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Terms toggle */}
      {terms && (
        <div className="ld-wcp-auto-care-upsell-offer-card-terms-wrap">
          <button
            onClick={() => setShowTerms((v) => !v)}
            className="ld-wcp-auto-care-upsell-offer-card-terms-btn"
          >
            <svg
              width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className={cx('ld-wcp-auto-care-upsell-offer-card-terms-chevron', showTerms && 'ld-wcp-auto-care-upsell-offer-card-terms-chevron-open')}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
            {showTerms ? "Hide terms" : "Show terms"}
          </button>
          {showTerms && (
            <p className="ld-wcp-auto-care-upsell-offer-card-terms-text">
              {terms}
            </p>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="ld-wcp-auto-care-upsell-offer-card-footer">
        <Button variant="secondary" size="small">
          Not interested
        </Button>
        <Button variant="primary" size="small">
          Schedule now
        </Button>
      </div>
    </article>
  );
}
AutoCareUpsellOfferCard.displayName = 'AutoCareUpsellOfferCard';
