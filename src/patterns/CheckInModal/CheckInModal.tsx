// @refresh reset

/**
 * @module CheckInModal
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
 * For prop API + usage notes, read `CheckInModal.md` in this folder
 * or run `npm run ld-kit -- show CheckInModal`.
 */

import * as React from 'react';
import { useState, useEffect } from "react";
import { Button } from '../../components/Button';
import { Alert } from '../../components/Alert';
import { DemoModalRaw } from '../DemoModal';
import './CheckInModal.css';

interface CheckInModalProps {
  open: boolean;
  onClose: () => void;
  storeName?: string;
}

export function CheckInModal({ open, onClose, storeName = "Sunnyvale Supercenter" }: CheckInModalProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [bayNumber] = useState(() => Math.floor(Math.random() * 12) + 1);

  useEffect(() => {
    if (!open) setConfirmed(false);
  }, [open]);

  return (
    <DemoModalRaw open={open} onClose={onClose} width={400}>
      {confirmed ? (
        <div className="ld-wcp-check-in-modal-confirmed">
          <div className="ld-wcp-check-in-modal-check-circle">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 className="ld-wcp-check-in-modal-confirmed-title">You're checked in!</h2>
          <p className="ld-wcp-check-in-modal-confirmed-desc">
            Head to <strong>Bay {bayNumber}</strong> at {storeName}. An associate will bring your order out shortly.
          </p>
          <Button variant="primary" isFullWidth onClick={onClose}>Done</Button>
        </div>
      ) : (
        <>
          <div className="ld-wcp-check-in-modal-header">
            <h2 className="ld-wcp-check-in-modal-header-title">Check in for pickup</h2>
            <button onClick={onClose} aria-label="Close" className="ld-wcp-check-in-modal-close-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="ld-wcp-check-in-modal-body">
            <Alert variant="info">Make sure you're at the store before checking in.</Alert>

            <div className="ld-wcp-check-in-modal-info-box">
              <div className="ld-wcp-check-in-modal-info-row">
                <span className="ld-wcp-check-in-modal-info-label">Store</span>
                <span className="ld-wcp-check-in-modal-info-value">{storeName}</span>
              </div>
              <div className="ld-wcp-check-in-modal-info-row">
                <span className="ld-wcp-check-in-modal-info-label">Status</span>
                <span className="ld-wcp-check-in-modal-info-value-positive">Ready for pickup</span>
              </div>
            </div>

            <p className="ld-wcp-check-in-modal-fine-print">
              After you check in, an associate will bring your order to your car. Please stay in the designated curbside area.
            </p>
          </div>

          <div className="ld-wcp-check-in-modal-footer">
            <Button variant="secondary" size="small" onClick={onClose}>Cancel</Button>
            <Button variant="primary" size="small" onClick={() => setConfirmed(true)}>I'm here — check in</Button>
          </div>
        </>
      )}
    </DemoModalRaw>
  );
}
CheckInModal.displayName = 'CheckInModal';
