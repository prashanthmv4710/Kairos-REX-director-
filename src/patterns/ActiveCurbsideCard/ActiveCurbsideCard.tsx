// @refresh reset

/**
 * @module ActiveCurbsideCard
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
 * For prop API + usage notes, read `ActiveCurbsideCard.md` in this folder
 * or run `npm run ld-kit -- show ActiveCurbsideCard`.
 */

import * as React from 'react';
import { Button } from '../../components/Button';
import { ProgressTracker, ProgressTrackerItem } from '../../components/ProgressTracker';
import { Divider } from '../../components/Divider';
import './ActiveCurbsideCard.css';

export interface CurbsideProduct {
  src: string;
  alt: string;
}

interface ActiveCurbsideCardProps {
  storeName: string;
  status: string;
  products: CurbsideProduct[];
  onCheckIn?: () => void;
}

const CURBSIDE_STEPS = ["Placed", "Preparing", "Ready", "Picked up"];

export function ActiveCurbsideCard({
  storeName,
  status,
  products,
  onCheckIn,
}: ActiveCurbsideCardProps) {
  return (
    <article className="ld-wcp-active-curbside-card-root">
      <div className="ld-wcp-active-curbside-card-body">
        {/* Left column */}
        <div className="ld-wcp-active-curbside-card-left">
          {/* Fulfillment type + store + status */}
          <div className="ld-wcp-active-curbside-card-fulfillment">
            {/* Curbside icon */}
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F02297b1ff48d4a2f8e4d9ed415c47ecf%2Feb8e854b1c2441668631c59d482af3f2"
              alt=""
              aria-hidden="true"
              width={48}
              height={48}
              className="ld-wcp-active-curbside-card-icon"
            />
            <div className="ld-wcp-active-curbside-card-meta">
              <span className="ld-wcp-active-curbside-card-type-label">
                Curbside pickup
              </span>
              <span className="ld-wcp-active-curbside-card-store-name">
                {storeName}
              </span>
              <h3 className="ld-wcp-active-curbside-card-status">
                {status}
              </h3>
            </div>
          </div>

          {/* Progress Tracker (curbside-specific steps) */}
          <ProgressTracker activeIndex={2} variant="success">
            {CURBSIDE_STEPS.map((label) => (
              <ProgressTrackerItem key={label}>{label}</ProgressTrackerItem>
            ))}
          </ProgressTracker>

          {/* Product thumbnails */}
          {products.length > 0 && (
            <div className="ld-wcp-active-curbside-card-thumbnails">
              {products.slice(0, 5).map((p, i) => (
                <img
                  key={i}
                  src={p.src}
                  alt={p.alt}
                  className="ld-wcp-active-curbside-card-thumb"
                />
              ))}
              {products.length > 5 && (
                <div className="ld-wcp-active-curbside-card-thumb-overflow">
                  +{products.length - 5}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right column: Check in button */}
        <div className="ld-wcp-active-curbside-card-right">
          <Button
            variant="primary"
            size="small"
            isFullWidth
            onClick={onCheckIn}
          >
            Check in
          </Button>
          <Button variant="secondary" size="small" isFullWidth>
            View details
          </Button>
        </div>
      </div>

      {/* Footer */}
      <Divider />
      <div className="ld-wcp-active-curbside-card-footer">
        {/* Store location info */}
        <div className="ld-wcp-active-curbside-card-footer-location">
          {/* Location pin icon */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="ld-wcp-active-curbside-card-footer-pin"
          >
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
              fill="currentColor"
            />
          </svg>
          <span className="ld-wcp-active-curbside-card-footer-store">
            {storeName}
          </span>
        </div>
      </div>
    </article>
  );
}
ActiveCurbsideCard.displayName = 'ActiveCurbsideCard';
