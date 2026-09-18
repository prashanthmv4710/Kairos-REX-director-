// @refresh reset

/**
 * @module CombinedOrderCard
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
 * For prop API + usage notes, read `CombinedOrderCard.md` in this folder
 * or run `npm run ld-kit -- show CombinedOrderCard`.
 */

import * as React from 'react';
import { Button } from '../../components/Button';
import { ProgressTracker, ProgressTrackerItem } from '../../components/ProgressTracker';
import { Divider } from '../../components/Divider';
import type { OrderProduct, OrderAction, ServiceDetails } from '../OrderCard';
import './CombinedOrderCard.css';

const ORDER_TYPE_LABELS: Record<string, string> = {
  delivery: "Delivery from store",
  curbside: "Curbside pickup",
  auto: "Auto Care Center",
};

const FULFILLMENT_ICONS: Record<string, string> = {
  curbside:
    "https://cdn.builder.io/api/v1/image/assets%2F02297b1ff48d4a2f8e4d9ed415c47ecf%2Feb8e854b1c2441668631c59d482af3f2",
  delivery:
    "https://cdn.builder.io/api/v1/image/assets%2F02297b1ff48d4a2f8e4d9ed415c47ecf%2F06ac09fed4534c02b62a8d43e759a824",
  auto:
    "https://cdn.builder.io/api/v1/image/assets%2F02297b1ff48d4a2f8e4d9ed415c47ecf%2F26a934c359774221bf674b2fb62d93da",
};

const DELIVERY_STEPS = ["Placed", "Preparing", "On the way", "Delivered"];
const PICKUP_STEPS = ["Placed", "Preparing", "Ready", "Picked up"];
const AUTO_STEPS = ["Scheduled", "Ready to service", "Serviced"];

const STEP_INDEX: Record<string, number> = {
  placed: 0,
  preparing: 1,
  "on-the-way": 2,
  delivered: 3,
};

interface CombinedSide {
  orderType: "delivery" | "curbside" | "auto";
  location?: string;
  statusHeading: string;
  timelineStep?: string;
  timelineVariant?: "delivery" | "pickup";
  products: OrderProduct[];
  orderTotal?: string;
  actions?: OrderAction[];
  serviceDetails?: ServiceDetails;
}

interface CombinedOrderCardProps {
  autoCare: CombinedSide;
  delivery: CombinedSide;
}

export function CombinedOrderCard({ autoCare, delivery }: CombinedOrderCardProps) {
  const parsePrice = (s?: string) => parseFloat((s ?? "0").replace(/[^0-9.]/g, "")) || 0;
  const bundleTotal = `$${(parsePrice(autoCare.orderTotal) + parsePrice(delivery.orderTotal)).toFixed(2)}`;

  const deliveryActiveStep = delivery.timelineStep ? STEP_INDEX[delivery.timelineStep] : undefined;
  const rightLabel = ORDER_TYPE_LABELS[delivery.orderType] ?? ORDER_TYPE_LABELS.delivery;
  const rightSteps = delivery.timelineVariant === "pickup" ? PICKUP_STEPS : DELIVERY_STEPS;
  const rightTrackerVariant = delivery.timelineStep === "delivered" ? "success" : "info";

  return (
    <article className="ld-wcp-combined-order-card-root">
      {/* Two-column body */}
      <div className="ld-wcp-combined-order-card-body">
        {/* Left: Auto Care */}
        <div className="ld-wcp-combined-order-card-left">
          <div className="ld-wcp-combined-order-card-side-header">
            <img
              src={FULFILLMENT_ICONS.auto}
              alt=""
              aria-hidden="true"
              width={48}
              height={48}
              className="ld-wcp-combined-order-card-side-icon"
            />
            <div className="ld-wcp-combined-order-card-side-meta">
              <span className="ld-wcp-combined-order-card-side-type-label">
                {ORDER_TYPE_LABELS.auto}
              </span>
              {autoCare.location && (
                <span className="ld-wcp-combined-order-card-side-location">
                  {autoCare.location}
                </span>
              )}
              <h3 className="ld-wcp-combined-order-card-side-heading">
                {autoCare.statusHeading}
              </h3>
            </div>
          </div>

          <ProgressTracker activeIndex={autoCare.serviceDetails?.appointmentStep ?? 0} variant="info">
            {AUTO_STEPS.map((label) => (
              <ProgressTrackerItem key={label}>{label}</ProgressTrackerItem>
            ))}
          </ProgressTracker>

          {autoCare.serviceDetails && (
            <div className="ld-wcp-combined-order-card-service-details">
              <span className="ld-wcp-combined-order-card-vehicle">
                {autoCare.serviceDetails.vehicle}
              </span>
              <ul className="ld-wcp-combined-order-card-services-list">
                {autoCare.serviceDetails.services.map((s, i) => (
                  <li key={i} className="ld-wcp-combined-order-card-service-item">
                    <span className="ld-wcp-combined-order-card-bullet" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(autoCare.actions?.length ?? 0) > 0 && (
            <div className="ld-wcp-combined-order-card-actions">
              {autoCare.actions!.map((a) => (
                <Button key={a.label} variant={a.variant} size="small" onClick={a.onClick}>
                  {a.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Vertical divider */}
        <div aria-hidden="true" className="ld-wcp-combined-order-card-vdivider" />

        {/* Right: Delivery / Curbside */}
        <div className="ld-wcp-combined-order-card-right">
          <div className="ld-wcp-combined-order-card-side-header ld-wcp-combined-order-card-side-header-right">
            <img
              src={FULFILLMENT_ICONS[delivery.orderType] ?? FULFILLMENT_ICONS.delivery}
              alt=""
              aria-hidden="true"
              width={48}
              height={48}
              className="ld-wcp-combined-order-card-side-icon"
            />
            <div className="ld-wcp-combined-order-card-side-meta">
              <span className="ld-wcp-combined-order-card-side-type-label">
                {rightLabel}
              </span>
              {delivery.location && (
                <span className="ld-wcp-combined-order-card-side-location">
                  {delivery.location}
                </span>
              )}
              <h3 className="ld-wcp-combined-order-card-side-heading">
                {delivery.statusHeading}
              </h3>
            </div>
          </div>

          {delivery.timelineStep && deliveryActiveStep !== undefined && (
            <ProgressTracker activeIndex={deliveryActiveStep} variant={rightTrackerVariant}>
              {rightSteps.map((label) => (
                <ProgressTrackerItem key={label}>{label}</ProgressTrackerItem>
              ))}
            </ProgressTracker>
          )}

          {delivery.products.length > 0 && (
            <div className="ld-wcp-combined-order-card-products">
              {delivery.products.slice(0, 5).map((p, i) => (
                <img
                  key={i}
                  src={p.src}
                  alt={p.alt}
                  className="ld-wcp-combined-order-card-product-thumb"
                />
              ))}
            </div>
          )}

          {(delivery.actions?.length ?? 0) > 0 && (
            <div className="ld-wcp-combined-order-card-actions">
              {delivery.actions!.map((a) => (
                <Button key={a.label} variant={a.variant} size="small" onClick={a.onClick}>
                  {a.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Divider />
      <div className="ld-wcp-combined-order-card-footer">
        <div className="ld-wcp-combined-order-card-footer-left">
          <span className="ld-wcp-combined-order-card-footer-label">
            Auto Care
          </span>
          <span className="ld-wcp-combined-order-card-footer-total">
            Order total {autoCare.orderTotal}
          </span>
        </div>
        <span aria-hidden="true" className="ld-wcp-combined-order-card-footer-hdivider" />
        <div className="ld-wcp-combined-order-card-footer-right">
          <span className="ld-wcp-combined-order-card-footer-label">
            {rightLabel}
          </span>
          <span className="ld-wcp-combined-order-card-footer-total">
            Order total {delivery.orderTotal}
          </span>
        </div>
      </div>

      {/* Bundle total row */}
      <div className="ld-wcp-combined-order-card-bundle">
        <span className="ld-wcp-combined-order-card-bundle-label">
          Bundle total
        </span>
        <span className="ld-wcp-combined-order-card-bundle-total">
          {bundleTotal}
        </span>
      </div>
    </article>
  );
}
CombinedOrderCard.displayName = 'CombinedOrderCard';
