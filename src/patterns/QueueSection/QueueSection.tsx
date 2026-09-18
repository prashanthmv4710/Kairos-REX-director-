// @refresh reset

/**
 * @module QueueSection
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
 * For prop API + usage notes, read `QueueSection.md` in this folder
 * or run `npm run ld-kit -- show QueueSection`.
 */

import * as React from 'react';
import {TimerView} from '../../components/TimerView';
import {QueueCard} from '../QueueCard';
import {QueueBanner} from '../QueueBanner';
import {QueueLanding} from '../QueueLanding';

export interface QueueProduct {
  image: string;
  description: string;
  price: string;
  originalPrice?: string;
}

export type QueueState =
  | {
      kind: 'timer';
      endTime: Date;
    }
  | {
      kind: 'card';
      product: QueueProduct;
      endTime: Date;
    }
  | {
      kind: 'banner';
      variant: 'lineJoined' | 'warning' | 'checkout' | 'error';
      endTime?: Date;
      message?: string;
      snackbarText?: string;
      productImage?: string;
      onView?: () => void;
      onLeave?: () => void;
      onAction?: () => void;
      onClose?: () => void;
    }
  | {
      kind: 'landing';
      authenticated: boolean;
      product: QueueProduct;
      endTime?: Date;
      onSignIn?: () => void;
    };

export interface QueueSectionProps {
  /** Current queue state. Discriminated by `kind`. */
  state: QueueState;
}

/**
 * QueueSection — discriminated-union wrapper for queue/reservation flows.
 *
 * Picks the right primitive based on `state.kind`:
 *   - `timer`   → TimerView (urgency pill)
 *   - `card`    → QueueCard (product + timer)
 *   - `banner`  → QueueBanner (sticky banner with variant)
 *   - `landing` → QueueLanding (full waiting-room page)
 *
 * State and props pass through to the underlying primitive — internal timer
 * animation and urgency-color resolution remain in the primitives.
 */
export function QueueSection({state}: QueueSectionProps) {
  switch (state.kind) {
    case 'timer':
      return <TimerView endTime={state.endTime} />;
    case 'card':
      return (
        <QueueCard
          image={state.product.image}
          description={state.product.description}
          price={state.product.price}
          originalPrice={state.product.originalPrice}
          endTime={state.endTime}
        />
      );
    case 'banner':
      return (
        <QueueBanner
          variant={state.variant}
          endTime={state.endTime}
          message={state.message}
          snackbarText={state.snackbarText}
          productImage={state.productImage}
          onView={state.onView}
          onLeave={state.onLeave}
          onAction={state.onAction}
          onClose={state.onClose}
        />
      );
    case 'landing':
      return (
        <QueueLanding
          variant={state.authenticated ? 'authenticated' : 'unauthenticated'}
          product={state.product}
          endTime={state.endTime}
          onSignIn={state.onSignIn}
        />
      );
  }
}

QueueSection.displayName = 'QueueSection';
