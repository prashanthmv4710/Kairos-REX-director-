// @refresh reset

/**
 * @module DelayedDeliveryModals
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
 * For prop API + usage notes, read `DelayedDeliveryModals.md` in this folder
 * or run `npm run ld-kit -- show DelayedDeliveryModals`.
 */

import * as React from 'react';
import { useState, useEffect } from "react";
import {cx} from '../../common/cx';
import { Button } from '../../components/Button';
import { Alert } from '../../components/Alert';
import { DemoModalRaw } from '../DemoModal';
import './DelayedDeliveryModals.css';

export type DelayedModalType = "reschedule" | "pickupInstead" | "viewDetails" | "cancel" | null;

interface DelayedDeliveryModalsProps {
  openModal: DelayedModalType;
  onClose: () => void;
  orderTotal?: string;
}

// ── Reschedule Delivery Modal ──

function RescheduleDeliveryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selectedSlot, setSelectedSlot] = useState("today-6pm");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!open) { setConfirmed(false); setSelectedSlot("today-6pm"); }
  }, [open]);

  const slots = [
    { id: "today-6pm", label: "Today, 6:00pm – 7:00pm", sublabel: "Earliest available" },
    { id: "today-8pm", label: "Today, 8:00pm – 9:00pm", sublabel: "" },
    { id: "tomorrow-12pm", label: "Tomorrow, 12:00pm – 1:00pm", sublabel: "" },
    { id: "tomorrow-3pm", label: "Tomorrow, 3:00pm – 4:00pm", sublabel: "" },
  ];

  if (confirmed) {
    const slot = slots.find((s) => s.id === selectedSlot);
    return (
      <DemoModalRaw open={open} onClose={onClose} width={420}>
        <div className="ld-wcp-delayed-delivery-modals-success-body">
          <div className="ld-wcp-delayed-delivery-modals-success-icon ld-wcp-delayed-delivery-modals-success-icon--positive">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <h2 className="ld-wcp-delayed-delivery-modals-success-title">Delivery rescheduled</h2>
          <p className="ld-wcp-delayed-delivery-modals-success-desc">
            Your new delivery window is <strong>{slot?.label}</strong>.
          </p>
          <Button variant="primary" isFullWidth onClick={onClose}>Done</Button>
        </div>
      </DemoModalRaw>
    );
  }

  return (
    <DemoModalRaw open={open} onClose={onClose} width={420}>
      <div className="ld-wcp-delayed-delivery-modals-header">
        <h2 className="ld-wcp-delayed-delivery-modals-header-title">Reschedule delivery</h2>
        <button onClick={onClose} aria-label="Close" className="ld-wcp-delayed-delivery-modals-close-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="ld-wcp-delayed-delivery-modals-content">
        <p className="ld-wcp-delayed-delivery-modals-content-text">
          Choose a new delivery window:
        </p>
        {slots.map((slot) => (
          <button
            key={slot.id}
            onClick={() => setSelectedSlot(slot.id)}
            className={cx(
              'ld-wcp-delayed-delivery-modals-slot',
              selectedSlot === slot.id && 'ld-wcp-delayed-delivery-modals-slot--selected',
            )}
          >
            <div
              className={cx(
                'ld-wcp-delayed-delivery-modals-slot-radio',
                selectedSlot === slot.id && 'ld-wcp-delayed-delivery-modals-slot-radio--selected',
              )}
            />
            <div>
              <span className="ld-wcp-delayed-delivery-modals-slot-label">{slot.label}</span>
              {slot.sublabel && <span className="ld-wcp-delayed-delivery-modals-slot-sublabel">{slot.sublabel}</span>}
            </div>
          </button>
        ))}
      </div>

      <div className="ld-wcp-delayed-delivery-modals-footer">
        <Button variant="secondary" size="small" onClick={onClose}>Cancel</Button>
        <Button variant="primary" size="small" onClick={() => setConfirmed(true)}>Confirm reschedule</Button>
      </div>
    </DemoModalRaw>
  );
}

// ── Pickup Instead Modal ──

function PickupInsteadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => { if (!open) setConfirmed(false); }, [open]);

  if (confirmed) {
    return (
      <DemoModalRaw open={open} onClose={onClose} width={420}>
        <div className="ld-wcp-delayed-delivery-modals-success-body">
          <div className="ld-wcp-delayed-delivery-modals-success-icon ld-wcp-delayed-delivery-modals-success-icon--positive">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <h2 className="ld-wcp-delayed-delivery-modals-success-title">Switched to pickup!</h2>
          <p className="ld-wcp-delayed-delivery-modals-success-desc">
            Your order has been switched to curbside pickup. We'll let you know when it's ready.
          </p>
          <Button variant="primary" isFullWidth onClick={onClose}>Done</Button>
        </div>
      </DemoModalRaw>
    );
  }

  return (
    <DemoModalRaw open={open} onClose={onClose} width={420}>
      <div className="ld-wcp-delayed-delivery-modals-header">
        <h2 className="ld-wcp-delayed-delivery-modals-header-title">Switch to pickup</h2>
        <button onClick={onClose} aria-label="Close" className="ld-wcp-delayed-delivery-modals-close-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="ld-wcp-delayed-delivery-modals-content">
        <Alert variant="info">Your delivery is running late. You can pick up your order instead.</Alert>
        <div className="ld-wcp-delayed-delivery-modals-info-box">
          <div className="ld-wcp-delayed-delivery-modals-info-row">
            <span className="ld-wcp-delayed-delivery-modals-info-label">Pickup at</span>
            <span className="ld-wcp-delayed-delivery-modals-info-value">Sunnyvale Supercenter</span>
          </div>
          <div className="ld-wcp-delayed-delivery-modals-info-row">
            <span className="ld-wcp-delayed-delivery-modals-info-label">Ready by</span>
            <span className="ld-wcp-delayed-delivery-modals-info-value">~30 minutes</span>
          </div>
        </div>
        <p className="ld-wcp-delayed-delivery-modals-fine-print">
          Delivery fee will be removed. You'll get a notification when your order is ready for pickup.
        </p>
      </div>
      <div className="ld-wcp-delayed-delivery-modals-footer">
        <Button variant="secondary" size="small" onClick={onClose}>Keep delivery</Button>
        <Button variant="primary" size="small" onClick={() => setConfirmed(true)}>Switch to pickup</Button>
      </div>
    </DemoModalRaw>
  );
}

// ── Cancel Order Modal ──

function CancelOrderModal({ open, onClose, orderTotal }: { open: boolean; onClose: () => void; orderTotal?: string }) {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => { if (!open) setConfirmed(false); }, [open]);

  if (confirmed) {
    return (
      <DemoModalRaw open={open} onClose={onClose} width={400}>
        <div className="ld-wcp-delayed-delivery-modals-success-body">
          <div className="ld-wcp-delayed-delivery-modals-success-icon ld-wcp-delayed-delivery-modals-success-icon--negative">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </div>
          <h2 className="ld-wcp-delayed-delivery-modals-success-title">Order canceled</h2>
          <p className="ld-wcp-delayed-delivery-modals-success-desc">
            {orderTotal ? `A refund of ${orderTotal} will be issued to your original payment method within 3–5 business days.` : "Your refund will be issued within 3–5 business days."}
          </p>
          <Button variant="primary" isFullWidth onClick={onClose}>Done</Button>
        </div>
      </DemoModalRaw>
    );
  }

  return (
    <DemoModalRaw open={open} onClose={onClose} width={400}>
      <div className="ld-wcp-delayed-delivery-modals-header">
        <h2 className="ld-wcp-delayed-delivery-modals-header-title">Cancel order?</h2>
        <button onClick={onClose} aria-label="Close" className="ld-wcp-delayed-delivery-modals-close-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="ld-wcp-delayed-delivery-modals-content">
        <Alert variant="warning">This action cannot be undone.</Alert>
        <p className="ld-wcp-delayed-delivery-modals-content-text ld-wcp-delayed-delivery-modals-content-text--line-height">
          Are you sure you want to cancel this order? {orderTotal && <>Your refund of <strong>{orderTotal}</strong> will be processed within 3–5 business days.</>}
        </p>
      </div>
      <div className="ld-wcp-delayed-delivery-modals-footer">
        <Button variant="secondary" size="small" onClick={onClose}>Keep order</Button>
        <Button variant="primary" size="small" onClick={() => setConfirmed(true)}>Cancel order</Button>
      </div>
    </DemoModalRaw>
  );
}

// ── View Details Modal (for delayed orders) ──

function ViewDelayedDetailsModal({ open, onClose, orderTotal }: { open: boolean; onClose: () => void; orderTotal?: string }) {
  return (
    <DemoModalRaw open={open} onClose={onClose} width={440}>
      <div className="ld-wcp-delayed-delivery-modals-header">
        <h2 className="ld-wcp-delayed-delivery-modals-header-title">Order details</h2>
        <button onClick={onClose} aria-label="Close" className="ld-wcp-delayed-delivery-modals-close-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="ld-wcp-delayed-delivery-modals-content">
        <Alert variant="warning">This order is delayed. Estimated arrival has been updated.</Alert>
        <div className="ld-wcp-delayed-delivery-modals-info-box">
          <Row label="Order #" value="WM-20260307-4821" />
          <Row label="Status" value="Delayed — Preparing" />
          <Row label="Original ETA" value="Today, 2:00pm – 3:00pm" />
          <Row label="Updated ETA" value="Today, 4:00pm – 5:00pm" />
          <Row label="Items" value="3 items" />
          {orderTotal && <Row label="Total" value={orderTotal} />}
        </div>
      </div>
      <div className="ld-wcp-delayed-delivery-modals-footer">
        <Button variant="primary" size="small" onClick={onClose}>Close</Button>
      </div>
    </DemoModalRaw>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="ld-wcp-delayed-delivery-modals-info-row">
      <span className="ld-wcp-delayed-delivery-modals-info-label">{label}</span>
      <span className="ld-wcp-delayed-delivery-modals-info-value">{value}</span>
    </div>
  );
}

// ── Main component ──

export function DelayedDeliveryModals({ openModal, onClose, orderTotal }: DelayedDeliveryModalsProps) {
  return (
    <>
      <RescheduleDeliveryModal open={openModal === "reschedule"} onClose={onClose} />
      <PickupInsteadModal open={openModal === "pickupInstead"} onClose={onClose} />
      <CancelOrderModal open={openModal === "cancel"} onClose={onClose} orderTotal={orderTotal} />
      <ViewDelayedDetailsModal open={openModal === "viewDetails"} onClose={onClose} orderTotal={orderTotal} />
    </>
  );
}
DelayedDeliveryModals.displayName = 'DelayedDeliveryModals';
