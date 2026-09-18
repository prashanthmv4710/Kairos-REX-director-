// @refresh reset

/**
 * @module OrderStatusCard
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
 * For prop API + usage notes, read `OrderStatusCard.md` in this folder
 * or run `npm run ld-kit -- show OrderStatusCard`.
 */

import * as React from 'react';
import { useState } from "react";
import { Link } from '../../components/Link';
import { CloseIcon } from '../../components/Icons';
import './OrderStatusCard.css';

interface OrderStatusCardProps {
  image: string;
  statusLine: string;
  deliveryLine: string;
  trackHref?: string;
}

export function OrderStatusCard({
  image,
  statusLine,
  deliveryLine,
  trackHref = "#",
}: OrderStatusCardProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="ld-wcp-order-status-card-root">
      <img
        src={image}
        alt="Order status"
        className="ld-wcp-order-status-card-image"
      />

      <div className="ld-wcp-order-status-card-body">
        <span className="ld-wcp-order-status-card-status">
          {statusLine}
        </span>
        <span className="ld-wcp-order-status-card-delivery">
          {deliveryLine}
        </span>
        <Link href={trackHref}>Track</Link>
      </div>

      <button
        aria-label="Dismiss order status"
        onClick={() => setDismissed(true)}
        className="ld-wcp-order-status-card-dismiss"
      >
        <CloseIcon size="small" />
      </button>
    </div>
  );
}
OrderStatusCard.displayName = 'OrderStatusCard';
