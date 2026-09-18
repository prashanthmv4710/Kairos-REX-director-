// @refresh reset

/**
 * @module AutoCareModals
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
 * For prop API + usage notes, read `AutoCareModals.md` in this folder
 * or run `npm run ld-kit -- show AutoCareModals`.
 */

import * as React from 'react';
import { useState, useEffect } from "react";
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Alert } from '../../components/Alert';
import { Divider } from '../../components/Divider';
import { DemoModal, DemoModalRaw } from '../DemoModal';
import { cx } from '../../common/cx';
import type { ServiceDetails } from '../OrderCard';
import './AutoCareModals.css';

export type AutoCareModalType = "checkIn" | "reschedule" | "viewDetails" | null;

interface AutoCareModalsProps {
  openModal: AutoCareModalType;
  onClose: () => void;
  onSwitchToCheckIn: () => void;
  onSwitchToReschedule: () => void;
  serviceDetails?: ServiceDetails;
  location?: string;
  statusHeading?: string;
  orderTotal?: string;
}

// -- Check-In Modal --

function CheckInModal({
  open,
  onClose,
  serviceDetails,
  location,
  statusHeading,
}: {
  open: boolean;
  onClose: () => void;
  serviceDetails?: ServiceDetails;
  location?: string;
  statusHeading?: string;
}) {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!open) setConfirmed(false);
  }, [open]);

  return (
    <DemoModalRaw open={open} onClose={onClose} width={440}>
      {confirmed ? (
        <div className="ld-wcp-auto-care-modals-confirm-wrap">
          <div className="ld-wcp-auto-care-modals-confirm-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 className="ld-wcp-auto-care-modals-confirm-title">You're checked in!</h2>
          <p className="ld-wcp-auto-care-modals-confirm-desc">
            A technician will be with you shortly. You'll receive updates on your service progress.
          </p>
          <Button variant="primary" isFullWidth onClick={onClose}>Done</Button>
        </div>
      ) : (
        <>
          <div className="ld-wcp-auto-care-modals-header">
            <h2 className="ld-wcp-auto-care-modals-header-title">Check in for service</h2>
            <button onClick={onClose} aria-label="Close" className="ld-wcp-auto-care-modals-close-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="ld-wcp-auto-care-modals-body">
            <Alert variant="info">Please arrive at the Auto Care Center before checking in.</Alert>

            {/* Appointment details */}
            <div className="ld-wcp-auto-care-modals-detail-card">
              {statusHeading && (
                <DetailRow label="Appointment" value={statusHeading} />
              )}
              {location && <DetailRow label="Location" value={location} />}
              {serviceDetails?.vehicle && <DetailRow label="Vehicle" value={serviceDetails.vehicle} />}
              {serviceDetails?.services && serviceDetails.services.length > 0 && (
                <DetailRow label="Services" value={serviceDetails.services.join(", ")} />
              )}
              {serviceDetails?.appointmentContact && (
                <DetailRow label="Contact" value={serviceDetails.appointmentContact} />
              )}
              {serviceDetails?.storePhone && (
                <DetailRow label="Phone" value={serviceDetails.storePhone} />
              )}
            </div>

            {serviceDetails?.serviceInstructions && (
              <div className="ld-wcp-auto-care-modals-notes-box">
                <span className="ld-wcp-auto-care-modals-notes-label">Your notes</span>
                <p className="ld-wcp-auto-care-modals-notes-text">{serviceDetails.serviceInstructions}</p>
              </div>
            )}
          </div>

          <div className="ld-wcp-auto-care-modals-footer">
            <Button variant="secondary" size="small" onClick={onClose}>Cancel</Button>
            <Button variant="primary" size="small" onClick={() => setConfirmed(true)}>Check in now</Button>
          </div>
        </>
      )}
    </DemoModalRaw>
  );
}

// -- Mini Calendar --

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const TIMES = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"];

function MiniCalendar({ selectedDate, onSelect }: { selectedDate: Date; onSelect: (d: Date) => void }) {
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const isSelected = (d: number) =>
    d === selectedDate.getDate() && viewMonth === selectedDate.getMonth() && viewYear === selectedDate.getFullYear();
  const isPast = (d: number) => new Date(viewYear, viewMonth, d) < today;

  return (
    <div className="ld-wcp-auto-care-modals-calendar">
      <div className="ld-wcp-auto-care-modals-calendar-header">
        <button onClick={prevMonth} aria-label="Previous month" className="ld-wcp-auto-care-modals-calendar-nav-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <span className="ld-wcp-auto-care-modals-calendar-month">{MONTHS[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} aria-label="Next month" className="ld-wcp-auto-care-modals-calendar-nav-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>
      <div className="ld-wcp-auto-care-modals-calendar-grid">
        {WEEK_DAYS.map((d) => (
          <span key={d} className="ld-wcp-auto-care-modals-calendar-weekday">{d}</span>
        ))}
        {cells.map((d, i) =>
          d === null ? (
            <span key={`e-${i}`} />
          ) : (
            <button
              key={d}
              disabled={isPast(d)}
              onClick={() => onSelect(new Date(viewYear, viewMonth, d))}
              className={cx(
                'ld-wcp-auto-care-modals-calendar-day',
                isSelected(d) && 'ld-wcp-auto-care-modals-calendar-day-selected',
                isPast(d) && 'ld-wcp-auto-care-modals-calendar-day-past'
              )}
            >
              {d}
            </button>
          ),
        )}
      </div>
    </div>
  );
}

// -- Reschedule Modal --

function RescheduleModal({
  open,
  onClose,
  serviceDetails,
  location,
}: {
  open: boolean;
  onClose: () => void;
  serviceDetails?: ServiceDetails;
  location?: string;
}) {
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 2, 7));
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!open) {
      setConfirmed(false);
      setSelectedDate(new Date(2026, 2, 7));
      setSelectedTime("10:00 AM");
    }
  }, [open]);

  return (
    <DemoModalRaw open={open} onClose={onClose} width={440}>
      {confirmed ? (
        <div className="ld-wcp-auto-care-modals-confirm-wrap">
          <div className="ld-wcp-auto-care-modals-confirm-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <h2 className="ld-wcp-auto-care-modals-confirm-title">Rescheduled!</h2>
          <p className="ld-wcp-auto-care-modals-confirm-desc">
            Your appointment has been moved to{" "}
            <strong>{selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}, {selectedTime}</strong>.
          </p>
          <Button variant="primary" isFullWidth onClick={onClose}>Done</Button>
        </div>
      ) : (
        <>
          <div className="ld-wcp-auto-care-modals-header">
            <h2 className="ld-wcp-auto-care-modals-header-title">Reschedule appointment</h2>
            <button onClick={onClose} aria-label="Close" className="ld-wcp-auto-care-modals-close-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="ld-wcp-auto-care-modals-body">
            {serviceDetails && (
              <div className="ld-wcp-auto-care-modals-service-summary">
                <strong className="ld-wcp-auto-care-modals-service-summary-vehicle">{serviceDetails.vehicle}</strong>
                {" — "}
                {serviceDetails.services.join(", ")}
              </div>
            )}
            {location && (
              <div className="ld-wcp-auto-care-modals-location-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" /></svg>
                {location}
              </div>
            )}

            <Divider />

            <div>
              <p className="ld-wcp-auto-care-modals-section-label">Select a date</p>
              <MiniCalendar selectedDate={selectedDate} onSelect={setSelectedDate} />
            </div>

            <div>
              <p className="ld-wcp-auto-care-modals-section-label-time">Select a time</p>
              <div className="ld-wcp-auto-care-modals-time-chips">
                {TIMES.map((t) => (
                  <Chip
                    key={t}
                    selected={selectedTime === t}
                    onClick={() => setSelectedTime(t)}
                  >
                    {t}
                  </Chip>
                ))}
              </div>
            </div>
          </div>

          <div className="ld-wcp-auto-care-modals-footer">
            <Button variant="secondary" size="small" onClick={onClose}>Cancel</Button>
            <Button variant="primary" size="small" onClick={() => setConfirmed(true)}>Confirm reschedule</Button>
          </div>
        </>
      )}
    </DemoModalRaw>
  );
}

// -- View Details Modal --

function ViewDetailsModal({
  open,
  onClose,
  onSwitchToCheckIn,
  onSwitchToReschedule,
  serviceDetails,
  location,
  statusHeading,
  orderTotal,
}: {
  open: boolean;
  onClose: () => void;
  onSwitchToCheckIn: () => void;
  onSwitchToReschedule: () => void;
  serviceDetails?: ServiceDetails;
  location?: string;
  statusHeading?: string;
  orderTotal?: string;
}) {
  return (
    <DemoModal open={open} onClose={onClose} title="Appointment Details" width={480}>
      <div className="ld-wcp-auto-care-modals-body">
        {/* Vehicle + services */}
        <div className="ld-wcp-auto-care-modals-view-header">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F02297b1ff48d4a2f8e4d9ed415c47ecf%2F26a934c359774221bf674b2fb62d93da"
            alt="" aria-hidden="true" width={48} height={48} className="ld-wcp-auto-care-modals-view-icon"
          />
          <div>
            <p className="ld-wcp-auto-care-modals-view-overline">Auto Care Center</p>
            {statusHeading && <p className="ld-wcp-auto-care-modals-view-title">{statusHeading}</p>}
          </div>
        </div>

        {/* Detail table */}
        <div className="ld-wcp-auto-care-modals-detail-card">
          {location && <DetailRow label="Location" value={location} />}
          {serviceDetails?.vehicle && <DetailRow label="Vehicle" value={serviceDetails.vehicle} />}
          {serviceDetails?.services.map((s, i) => (
            <DetailRow key={i} label={i === 0 ? "Services" : ""} value={s} />
          ))}
          {serviceDetails?.appointmentContact && <DetailRow label="Contact" value={serviceDetails.appointmentContact} />}
          {serviceDetails?.storePhone && <DetailRow label="Phone" value={serviceDetails.storePhone} />}
          {serviceDetails?.storeHours && <DetailRow label="Hours" value={serviceDetails.storeHours} />}
          {orderTotal && <DetailRow label="Order total" value={orderTotal} />}
        </div>

        {serviceDetails?.serviceInstructions && (
          <div className="ld-wcp-auto-care-modals-notes-box">
            <span className="ld-wcp-auto-care-modals-notes-label">Customer notes</span>
            <p className="ld-wcp-auto-care-modals-notes-text">{serviceDetails.serviceInstructions}</p>
          </div>
        )}
      </div>

      <div className="ld-wcp-auto-care-modals-footer">
        <Button variant="secondary" size="small" onClick={onSwitchToReschedule}>Reschedule</Button>
        <Button variant="primary" size="small" onClick={onSwitchToCheckIn}>Check in</Button>
      </div>
    </DemoModal>
  );
}

// -- Detail Row helper --

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="ld-wcp-auto-care-modals-detail-row">
      <span className="ld-wcp-auto-care-modals-detail-row-label">{label}</span>
      <span className="ld-wcp-auto-care-modals-detail-row-value">{value}</span>
    </div>
  );
}

// -- Main AutoCareModals component --

export function AutoCareModals({
  openModal,
  onClose,
  onSwitchToCheckIn,
  onSwitchToReschedule,
  serviceDetails,
  location,
  statusHeading,
  orderTotal,
}: AutoCareModalsProps) {
  return (
    <>
      <CheckInModal
        open={openModal === "checkIn"}
        onClose={onClose}
        serviceDetails={serviceDetails}
        location={location}
        statusHeading={statusHeading}
      />
      <RescheduleModal
        open={openModal === "reschedule"}
        onClose={onClose}
        serviceDetails={serviceDetails}
        location={location}
      />
      <ViewDetailsModal
        open={openModal === "viewDetails"}
        onClose={onClose}
        onSwitchToCheckIn={onSwitchToCheckIn}
        onSwitchToReschedule={onSwitchToReschedule}
        serviceDetails={serviceDetails}
        location={location}
        statusHeading={statusHeading}
        orderTotal={orderTotal}
      />
    </>
  );
}
AutoCareModals.displayName = 'AutoCareModals';
