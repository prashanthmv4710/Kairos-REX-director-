// @refresh reset

/**
 * @module ServicesCard
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
 * For prop API + usage notes, read `ServicesCard.md` in this folder
 * or run `npm run ld-kit -- show ServicesCard`.
 */

import * as React from 'react';
import { useState } from "react";
import { cx } from '../../common/cx';
import { Button } from '../../components/Button';
import { Tag } from '../../components/Tag/Tag';
import { Alert } from '../../components/Alert';
import { Divider } from '../../components/Divider';
import { ProgressTracker, ProgressTrackerItem } from '../../components/ProgressTracker';
import { Link } from '../../components/Link';
import { Icon } from '../../components/Icons/Icons';
import './ServicesCard.css';

// ── Service types & status ──────────────────────────────────────────────────

export type ServiceType = "PHARMACY" | "AUTO" | "OPTICAL" | "BAKERY";
export type ServiceStatus =
  | "READY_FOR_PICKUP"
  | "IN_PROGRESS"
  | "PROCESSING"
  | "SCHEDULED"
  | "CANCELLED"
  | "OTHER";

export interface ServiceEntryDetail {
  scheduledTime?: string;
  pickupWindow?: string;
  referenceId?: string;
  provider?: string;
  plan?: string;
  vehicle?: string;
  note?: string;
}

export interface ServiceEntry {
  id: string;
  serviceType: ServiceType;
  serviceLabel: string;
  status: ServiceStatus;
  microcopy?: string;
  pickupDate?: string;
  pickupLocation?: string;
  activeStep?: number;
  detail?: ServiceEntryDetail;
  actions?: Array<{
    label: string;
    variant: "primary" | "secondary";
    onClick?: () => void;
  }>;
}

interface ServicesCardProps {
  services: ServiceEntry[];
  defaultExpanded?: boolean;
  defaultExpandedRowId?: string;
}

// ── Status config ───────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ServiceStatus, { label: string; color: "positive" | "info" | "gray" | "negative" }> = {
  READY_FOR_PICKUP: { label: "Ready", color: "positive" },
  IN_PROGRESS: { label: "In Progress", color: "info" },
  PROCESSING: { label: "Processing", color: "info" },
  SCHEDULED: { label: "Scheduled", color: "gray" },
  CANCELLED: { label: "Canceled", color: "negative" },
  OTHER: { label: "See details", color: "gray" },
};

const PRIORITY: Record<ServiceStatus, number> = {
  READY_FOR_PICKUP: 0,
  IN_PROGRESS: 1,
  PROCESSING: 2,
  SCHEDULED: 3,
  CANCELLED: 4,
  OTHER: 5,
};

// ── Service type icon ───────────────────────────────────────────────────────

const SERVICE_ICON_CONFIG: Record<ServiceType, { icon: string; bg: string; color: string }> = {
  PHARMACY: { icon: "Plus", bg: "var(--ld-semantic-color-fill-accent-green-subtle)", color: "var(--ld-semantic-color-text-accent-green)" },
  AUTO: { icon: "Car", bg: "var(--ld-semantic-color-fill-accent-blue-subtle)", color: "var(--ld-semantic-color-text-accent-blue)" },
  OPTICAL: { icon: "Eye", bg: "var(--ld-semantic-color-fill-accent-purple-subtle)", color: "var(--ld-semantic-color-text-accent-purple)" },
  BAKERY: { icon: "Gift", bg: "var(--ld-semantic-color-fill-accent-orange-subtle)", color: "var(--ld-semantic-color-text-accent-orange)" },
};

function ServiceTypeIcon({ type, size = 32 }: { type: ServiceType; size?: number }) {
  const { icon, bg, color } = SERVICE_ICON_CONFIG[type];
  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: 8,
        background: bg,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name={icon} decorative style={{ fontSize: size * 0.6, color }} />
    </div>
  );
}

// ── Tracking steps per service type ─────────────────────────────────────────

const STEPS: Record<ServiceType, string[]> = {
  PHARMACY: ["Submitted", "Filling", "Ready", "Picked up"],
  AUTO: ["Scheduled", "Checked in", "In progress", "Complete"],
  OPTICAL: ["Ordered", "Lab processing", "Ready", "Picked up"],
  BAKERY: ["Ordered", "Decorating", "Ready", "Picked up"],
};

const STATUS_TO_STEP: Record<ServiceType, Partial<Record<ServiceStatus, number>>> = {
  PHARMACY: { READY_FOR_PICKUP: 2, IN_PROGRESS: 1, PROCESSING: 1, SCHEDULED: 0 },
  AUTO: { READY_FOR_PICKUP: 3, IN_PROGRESS: 2, PROCESSING: 1, SCHEDULED: 0 },
  OPTICAL: { READY_FOR_PICKUP: 2, IN_PROGRESS: 1, PROCESSING: 1, SCHEDULED: 0 },
  BAKERY: { READY_FOR_PICKUP: 2, IN_PROGRESS: 1, PROCESSING: 1, SCHEDULED: 0 },
};

function getTrackerVariant(status: ServiceStatus): "success" | "error" | "info" {
  if (status === "READY_FOR_PICKUP") return "success";
  if (status === "CANCELLED") return "error";
  return "info";
}

// ── Detail Row ──────────────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="ld-wcp-services-card-detail-row">
      <span className="ld-wcp-services-card-detail-label">{label}</span>
      <span className="ld-wcp-services-card-detail-value">{value}</span>
    </div>
  );
}

// ── Service Row Detail Panel ────────────────────────────────────────────────

function ServiceRowDetail({
  serviceType,
  status,
  activeStep,
  pickupLocation,
  pickupDate,
  detail,
  actions,
}: {
  serviceType: ServiceType;
  status: ServiceStatus;
  activeStep?: number;
  pickupLocation?: string;
  pickupDate?: string;
  detail?: ServiceEntryDetail;
  actions?: Array<{ label: string; variant: "primary" | "secondary"; onClick?: () => void }>;
}) {
  const steps = STEPS[serviceType];
  const step = activeStep ?? STATUS_TO_STEP[serviceType][status] ?? 0;
  const variant = getTrackerVariant(status);

  const defaultActions: Array<{ label: string; variant: "primary" | "secondary"; onClick?: () => void }> = status === "READY_FOR_PICKUP"
    ? [{ label: "Pick up", variant: "primary" }, { label: "View details", variant: "secondary" }]
    : serviceType === "AUTO" && status === "SCHEDULED"
      ? [{ label: "Check in", variant: "primary" }, { label: "View details", variant: "secondary" }]
      : [{ label: "View details", variant: "primary" }];

  const resolvedActions = actions ?? defaultActions;

  return (
    <div className="ld-wcp-services-card-row-detail">
      <ProgressTracker activeIndex={step} variant={variant}>
        {steps.map((s) => (
          <ProgressTrackerItem key={s}>{s}</ProgressTrackerItem>
        ))}
      </ProgressTracker>

      {(pickupLocation || detail) && (
        <div className="ld-wcp-services-card-detail-info">
          {pickupLocation && <DetailRow label="Location" value={pickupLocation} />}
          {detail?.scheduledTime && <DetailRow label="Scheduled" value={detail.scheduledTime} />}
          {detail?.pickupWindow && <DetailRow label="Pickup window" value={detail.pickupWindow} />}
          {!detail?.scheduledTime && !detail?.pickupWindow && pickupDate && <DetailRow label="Date" value={pickupDate} />}
          {detail?.referenceId && <DetailRow label="Reference" value={detail.referenceId} />}
          {detail?.provider && <DetailRow label="Provider" value={detail.provider} />}
          {detail?.plan && <DetailRow label="Plan" value={detail.plan} />}
          {detail?.vehicle && <DetailRow label="Vehicle" value={detail.vehicle} />}
          {detail?.note && (
            <p className="ld-wcp-services-card-detail-note">
              {detail.note}
            </p>
          )}
        </div>
      )}

      <div className="ld-wcp-services-card-detail-actions">
        {resolvedActions.map((a) => (
          <Button key={a.label} variant={a.variant} size="small" onClick={a.onClick}>
            {a.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

// ── Service Row ─────────────────────────────────────────────────────────────

function ServiceRow({
  entry,
  isExpanded,
  onToggle,
}: {
  entry: ServiceEntry;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { label, color } = STATUS_CONFIG[entry.status];

  return (
    <div className="ld-wcp-services-card-row">
      <button
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-label={`${entry.serviceLabel}, ${label}`}
        className="ld-wcp-services-card-row-button"
      >
        <ServiceTypeIcon type={entry.serviceType} />

        <div className="ld-wcp-services-card-row-body">
          <span className="ld-wcp-services-card-row-label">
            {entry.serviceLabel}
          </span>
          {entry.microcopy && (
            <span className="ld-wcp-services-card-row-microcopy">
              {entry.microcopy}
            </span>
          )}
        </div>

        <Tag variant="tertiary" color={color}>
          {label}
        </Tag>

        {/* Chevron */}
        <Icon
          name="ChevronDown"
          decorative
          style={{ fontSize: 16, color: 'var(--ld-semantic-color-text-subtle)' }}
          className={cx('ld-wcp-services-card-chevron', isExpanded && 'ld-wcp-services-card-chevron-expanded')}
        />
      </button>

      {isExpanded && (
        <ServiceRowDetail
          serviceType={entry.serviceType}
          status={entry.status}
          activeStep={entry.activeStep}
          pickupLocation={entry.pickupLocation}
          pickupDate={entry.pickupDate}
          detail={entry.detail}
          actions={entry.actions}
        />
      )}
    </div>
  );
}

// ── Services Card ───────────────────────────────────────────────────────────

export function ServicesCard({
  services,
  defaultExpanded = false,
  defaultExpandedRowId,
}: ServicesCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(defaultExpandedRowId ?? null);

  const activeCount = services.filter((s) => s.status !== "CANCELLED").length;

  const sorted = [...services].sort((a, b) => {
    const diff = PRIORITY[a.status] - PRIORITY[b.status];
    if (diff !== 0) return diff;
    const da = a.pickupDate ? Date.parse(a.pickupDate) : Infinity;
    const db = b.pickupDate ? Date.parse(b.pickupDate) : Infinity;
    return (isNaN(da) ? Infinity : da) - (isNaN(db) ? Infinity : db);
  });

  const displayed = isExpanded ? sorted : sorted.slice(0, 2);
  const showToggle = sorted.length > 2;

  const readyServices = displayed.filter((s) => s.status === "READY_FOR_PICKUP" && s.pickupLocation);

  return (
    <article className="ld-wcp-services-card-root">
      {/* Header */}
      <div className="ld-wcp-services-card-header">
        <h3 className="ld-wcp-services-card-heading">
          Your Services
          <span className="ld-wcp-services-card-active-count">
            {" "}({activeCount} Active)
          </span>
        </h3>

        {showToggle && (
          <Button
            variant="tertiary"
            size="small"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? "Show less" : "Show all"}
          </Button>
        )}
      </div>

      {/* Urgency alerts */}
      {readyServices.length > 0 && (
        <div className="ld-wcp-services-card-alerts">
          {readyServices.map((s) => (
            <Alert key={s.id} variant="success">
              {s.serviceLabel} ready for pickup at {s.pickupLocation}
            </Alert>
          ))}
        </div>
      )}

      {/* Service rows */}
      <div>
        {displayed.map((entry, i) => (
          <div key={entry.id}>
            {i > 0 && <Divider />}
            <ServiceRow
              entry={entry}
              isExpanded={expandedRowId === entry.id}
              onToggle={() => setExpandedRowId((prev) => (prev === entry.id ? null : entry.id))}
            />
          </div>
        ))}
      </div>

      {/* View All footer */}
      {sorted.length > 2 && !isExpanded && (
        <>
          <Divider />
          <div className="ld-wcp-services-card-footer">
            <Link href="#">View all services</Link>
          </div>
        </>
      )}
    </article>
  );
}
ServicesCard.displayName = 'ServicesCard';
