// @refresh reset

/**
 * @module GetItNowModal
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
 * For prop API + usage notes, read `GetItNowModal.md` in this folder
 * or run `npm run ld-kit -- show GetItNowModal`.
 */

import * as React from 'react';
import { useState, useEffect } from "react";
import { Button } from '../../components/Button';
import { Tag } from '../../components/Tag/Tag';
import { DemoModalRaw } from '../DemoModal';
import './GetItNowModal.css';

interface GetItNowModalProps {
  open: boolean;
  onClose: () => void;
  location?: string;
  orderTotal?: string;
}

export function GetItNowModal({ open, onClose, location, orderTotal }: GetItNowModalProps) {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!open) setConfirmed(false);
  }, [open]);

  const storeName = location ? location.replace(/^.* at /, "") : "1213 Trinity Mills Rd, Carrollton, TX";
  const deliveryFee = 9.95;
  const newTotal = orderTotal ? `$${(parseFloat(orderTotal.replace("$", "")) + deliveryFee).toFixed(2)}` : "$94.95";

  return (
    <DemoModalRaw open={open} onClose={onClose} width={420}>
      {confirmed ? (
        /* Success state */
        <div className="ld-wcp-get-it-now-modal-success-body">
          <div className="ld-wcp-get-it-now-modal-success-close-wrap">
            <button
              onClick={onClose}
              aria-label="Close"
              className="ld-wcp-get-it-now-modal-close-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="ld-wcp-get-it-now-modal-success-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--ld-semantic-color-text-inverse)'}}>
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 className="ld-wcp-get-it-now-modal-success-title">On its way!</h2>
          <p className="ld-wcp-get-it-now-modal-success-desc">
            Your order has been switched to express delivery. A driver will pick it up shortly and head your way.
          </p>
          <Button variant="primary" isFullWidth onClick={onClose}>
            Done
          </Button>
        </div>
      ) : (
        /* Confirmation state */
        <>
          <div className="ld-wcp-get-it-now-modal-header">
            <h2 className="ld-wcp-get-it-now-modal-header-title">Get it now</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="ld-wcp-get-it-now-modal-close-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="ld-wcp-get-it-now-modal-content">
            <Tag variant="primary" color="info">
              Express delivery
            </Tag>

            <p className="ld-wcp-get-it-now-modal-content-text">
              Switch your curbside pickup to express delivery and get your order delivered to your door in as little as <strong>1 hour</strong>.
            </p>

            {/* Detail rows */}
            <div className="ld-wcp-get-it-now-modal-details">
              {[
                { label: "From", value: storeName },
                { label: "Est. arrival", value: "Within 1 hour" },
                { label: "Delivery fee", value: "$9.95" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="ld-wcp-get-it-now-modal-detail-row"
                >
                  <span className="ld-wcp-get-it-now-modal-detail-label">{row.label}</span>
                  <span className="ld-wcp-get-it-now-modal-detail-value">{row.value}</span>
                </div>
              ))}
              <div className="ld-wcp-get-it-now-modal-total-row">
                <span className="ld-wcp-get-it-now-modal-total-label">New order total</span>
                <span className="ld-wcp-get-it-now-modal-total-value">{newTotal}</span>
              </div>
            </div>

            <p className="ld-wcp-get-it-now-modal-fine-print">
              By confirming, your order status will update from curbside pickup to express delivery. You'll receive a notification when a driver is assigned.
            </p>
          </div>

          <div className="ld-wcp-get-it-now-modal-footer">
            <Button variant="secondary" size="small" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="small" onClick={() => setConfirmed(true)}>
              Confirm — get it now
            </Button>
          </div>
        </>
      )}
    </DemoModalRaw>
  );
}
GetItNowModal.displayName = 'GetItNowModal';
