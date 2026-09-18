// @refresh reset

/**
 * @module DelayedDeliveryCard
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
 * For prop API + usage notes, read `DelayedDeliveryCard.md` in this folder
 * or run `npm run ld-kit -- show DelayedDeliveryCard`.
 */

import * as React from 'react';
import { Button } from '../../components/Button';
import { Tag } from '../../components/Tag';
import { Alert } from '../../components/Alert';
import { ProgressTracker, ProgressTrackerItem } from '../../components/ProgressTracker';
import type { OrderProduct } from '../OrderCard';
import './DelayedDeliveryCard.css';

interface DelayedDeliveryCardProps {
  statusHeading: string;
  delayEstimate: string;
  products: OrderProduct[];
  orderTotal?: string;
  onReschedule?: () => void;
  onPickupInstead?: () => void;
  onViewDetails?: () => void;
  onCancelOrder?: () => void;
}

const DELIVERY_STEPS = ["Placed", "Preparing", "On the way", "Delivered"];

export function DelayedDeliveryCard({
  statusHeading,
  delayEstimate,
  products,
  orderTotal,
  onReschedule,
  onPickupInstead,
  onViewDetails,
  onCancelOrder,
}: DelayedDeliveryCardProps) {
  return (
    <article className="ld-wcp-delayed-delivery-card-root">
      {/* Warning banner */}
      <div className="ld-wcp-delayed-delivery-card-banner">
        <div className="ld-wcp-delayed-delivery-card-banner-left">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="ld-wcp-delayed-delivery-card-banner-icon"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="ld-wcp-delayed-delivery-card-banner-text">
            Running late — we're sorry for the wait
          </span>
        </div>
        <Tag color="warning">
          Delayed
        </Tag>
      </div>

      {/* Main body */}
      <div className="ld-wcp-delayed-delivery-card-body">
        {/* Left column */}
        <div className="ld-wcp-delayed-delivery-card-left">
          {/* Meta: icon + status heading */}
          <div className="ld-wcp-delayed-delivery-card-meta">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F02297b1ff48d4a2f8e4d9ed415c47ecf%2F06ac09fed4534c02b62a8d43e759a824"
              alt=""
              aria-hidden="true"
              width={48}
              height={48}
              className="ld-wcp-delayed-delivery-card-meta-img"
            />
            <div>
              <span className="ld-wcp-delayed-delivery-card-meta-subtitle">
                Delivery from store
              </span>
              <h3 className="ld-wcp-delayed-delivery-card-meta-heading">
                {statusHeading}
              </h3>
            </div>
          </div>

          {/* Alert */}
          <Alert variant="warning">
            <strong>{delayEstimate}</strong> — We're working to get your order to you as quickly as possible.
          </Alert>

          {/* Progress Tracker (stuck at Preparing with warning) */}
          <ProgressTracker activeIndex={1} variant="warning">
            {DELIVERY_STEPS.map((label) => (
              <ProgressTrackerItem key={label}>{label}</ProgressTrackerItem>
            ))}
          </ProgressTracker>

          {/* Product thumbnails */}
          {products.length > 0 && (
            <div className="ld-wcp-delayed-delivery-card-thumbnails">
              {products.slice(0, 5).map((p, i) => (
                <img
                  key={i}
                  src={p.src}
                  alt={p.alt}
                  className="ld-wcp-delayed-delivery-card-thumbnail"
                />
              ))}
            </div>
          )}
        </div>

        {/* Right column: action buttons */}
        <div className="ld-wcp-delayed-delivery-card-actions">
          <Button variant="primary" size="small" isFullWidth onClick={onReschedule}>
            Reschedule delivery
          </Button>
          <Button variant="secondary" size="small" isFullWidth onClick={onPickupInstead}>
            Pickup instead
          </Button>
          <Button variant="secondary" size="small" isFullWidth onClick={onViewDetails}>
            View details
          </Button>
          <Button variant="secondary" size="small" isFullWidth onClick={onCancelOrder}>
            Cancel order
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="ld-wcp-delayed-delivery-card-footer">
        {orderTotal && (
          <span className="ld-wcp-delayed-delivery-card-footer-total">
            Order total {orderTotal}
          </span>
        )}
      </div>
    </article>
  );
}
DelayedDeliveryCard.displayName = 'DelayedDeliveryCard';
