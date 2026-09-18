// @refresh reset

/**
 * @module OrderStatusSection
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
 * For prop API + usage notes, read `OrderStatusSection.md` in this folder
 * or run `npm run ld-kit -- show OrderStatusSection`.
 */

import * as React from 'react';
import {OrderStatusCard} from '../OrderStatusCard';
import {OrderStatusBanner} from '../OrderStatusBanner';

export interface OrderStatusEntry {
  /** Stable identifier (used as React key). */
  id?: string;
  /** Product image URL. */
  image: string;
  /** Headline: "Your order is on the way", "Delivered", etc. */
  statusLine: string;
  /** Detail: "Arrives tomorrow by 8pm", etc. */
  deliveryLine: string;
  /** Optional tracking link href. */
  trackHref?: string;
  /**
   * Render this entry as the slim banner instead of the full card.
   * Use for top-of-page notices when card real estate matters.
   */
  asBanner?: boolean;
}

export interface OrderStatusSectionProps {
  /**
   * Entries to render. Each picks card or banner via `asBanner`.
   * Iteration order is preserved.
   */
  orders: readonly OrderStatusEntry[];
}

/**
 * OrderStatusSection — stack of order-status notifications.
 *
 * Picks `OrderStatusCard` (default) or `OrderStatusBanner` (when `asBanner`
 * is true) per entry. Dismissal state lives inside each underlying component.
 */
export function OrderStatusSection({orders}: OrderStatusSectionProps) {
  return (
    <>
      {orders.map((o, i) => {
        if (o.asBanner) return <OrderStatusBanner key={o.id ?? i} />;
        return (
          <OrderStatusCard
            key={o.id ?? i}
            image={o.image}
            statusLine={o.statusLine}
            deliveryLine={o.deliveryLine}
            trackHref={o.trackHref}
          />
        );
      })}
    </>
  );
}

OrderStatusSection.displayName = 'OrderStatusSection';
