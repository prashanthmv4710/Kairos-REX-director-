// @refresh reset

/**
 * @module DemoModal
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
 * For prop API + usage notes, read `DemoModal.md` in this folder
 * or run `npm run ld-kit -- show DemoModal`.
 */

import * as React from 'react';
import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import './DemoModal.css';

interface DemoModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  width?: number;
}

function useModalEffects(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
}

export function DemoModal({ open, onClose, title, children, width = 480 }: DemoModalProps) {
  useModalEffects(open, onClose);

  if (!open) return null;

  return createPortal(
    <>
      <div className="ld-wcp-demo-modal-scrim" onClick={onClose} />
      <div className="ld-wcp-demo-modal-container" style={{ width }} role="dialog" aria-modal="true">
        {title && (
          <div className="ld-wcp-demo-modal-header">
            <h2 className="ld-wcp-demo-modal-title">{title}</h2>
            <button className="ld-wcp-demo-modal-close-btn" onClick={onClose} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {children}
      </div>
    </>,
    document.body,
  );
}

/** Headerless modal variant for custom layouts */
export function DemoModalRaw({ open, onClose, children, width = 480 }: Omit<DemoModalProps, "title">) {
  useModalEffects(open, onClose);

  if (!open) return null;

  return createPortal(
    <>
      <div className="ld-wcp-demo-modal-scrim" onClick={onClose} />
      <div className="ld-wcp-demo-modal-container" style={{ width }} role="dialog" aria-modal="true">
        {children}
      </div>
    </>,
    document.body,
  );
}
DemoModal.displayName = 'DemoModal';
