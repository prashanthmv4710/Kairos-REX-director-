// @refresh reset

/**
 * @module OrderCardSection
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
 * For prop API + usage notes, read `OrderCardSection.md` in this folder
 * or run `npm run ld-kit -- show OrderCardSection`.
 */

import * as React from 'react';
import {OrderCard} from '../OrderCard';
import {DelayedDeliveryCard} from '../DelayedDeliveryCard';
import {ActiveCurbsideCard} from '../ActiveCurbsideCard';
import {CombinedOrderCard} from '../CombinedOrderCard';
import {ServicesCard} from '../ServicesCard';
import {MaintenanceHealthCard} from '../MaintenanceHealthCard';
import {AutoCareUpsellOfferCard} from '../AutoCareUpsellOfferCard';

type OrderProps = React.ComponentProps<typeof OrderCard>;
type DelayedProps = React.ComponentProps<typeof DelayedDeliveryCard>;
type CurbsideProps = React.ComponentProps<typeof ActiveCurbsideCard>;
type CombinedProps = React.ComponentProps<typeof CombinedOrderCard>;
type ServicesProps = React.ComponentProps<typeof ServicesCard>;
type MaintenanceProps = React.ComponentProps<typeof MaintenanceHealthCard>;
type AutoCareUpsellProps = React.ComponentProps<typeof AutoCareUpsellOfferCard>;

/**
 * Tagged-union entry for an order section. Pick `kind` to choose the variant;
 * the remaining fields are forwarded to the underlying variant's props.
 */
export type OrderEntry =
  | ({kind: 'order'; id?: string} & OrderProps)
  | ({kind: 'delayed'; id?: string} & DelayedProps)
  | ({kind: 'curbside'; id?: string} & CurbsideProps)
  | ({kind: 'combined'; id?: string} & CombinedProps)
  | ({kind: 'services'; id?: string} & ServicesProps)
  | ({kind: 'maintenance'; id?: string} & MaintenanceProps)
  | ({kind: 'autocare-upsell'; id?: string} & AutoCareUpsellProps);

export interface OrderCardSectionProps {
  /** Orders to render. Each picks a variant via `kind`. */
  orders: readonly OrderEntry[];
}

/**
 * OrderCardSection — discriminated-union wrapper for a stack of order cards.
 *
 * Picks the right variant per entry from `kind`:
 *   - `order`            → OrderCard (default delivery/pickup card)
 *   - `delayed`          → DelayedDeliveryCard
 *   - `curbside`         → ActiveCurbsideCard
 *   - `combined`         → CombinedOrderCard
 *   - `services`         → ServicesCard
 *   - `maintenance`      → MaintenanceHealthCard
 *   - `autocare-upsell`  → AutoCareUpsellOfferCard
 *
 * Each variant's modal state (GetItNow / CheckIn / AutoCare / DelayedDelivery /
 * Demo) stays inside the variant itself — this wrapper is dispatch-only.
 */
export function OrderCardSection({orders}: OrderCardSectionProps) {
  return (
    <>
      {orders.map((o, i) => {
        const key = o.id ?? i;
        switch (o.kind) {
          case 'order': {
            const {kind: _k, id: _id, ...rest} = o;
            return <OrderCard key={key} {...(rest as OrderProps)} />;
          }
          case 'delayed': {
            const {kind: _k, id: _id, ...rest} = o;
            return <DelayedDeliveryCard key={key} {...(rest as DelayedProps)} />;
          }
          case 'curbside': {
            const {kind: _k, id: _id, ...rest} = o;
            return <ActiveCurbsideCard key={key} {...(rest as CurbsideProps)} />;
          }
          case 'combined': {
            const {kind: _k, id: _id, ...rest} = o;
            return <CombinedOrderCard key={key} {...(rest as CombinedProps)} />;
          }
          case 'services': {
            const {kind: _k, id: _id, ...rest} = o;
            return <ServicesCard key={key} {...(rest as ServicesProps)} />;
          }
          case 'maintenance': {
            const {kind: _k, id: _id, ...rest} = o;
            return <MaintenanceHealthCard key={key} {...(rest as MaintenanceProps)} />;
          }
          case 'autocare-upsell': {
            const {kind: _k, id: _id, ...rest} = o;
            return <AutoCareUpsellOfferCard key={key} {...(rest as AutoCareUpsellProps)} />;
          }
        }
      })}
    </>
  );
}

OrderCardSection.displayName = 'OrderCardSection';
