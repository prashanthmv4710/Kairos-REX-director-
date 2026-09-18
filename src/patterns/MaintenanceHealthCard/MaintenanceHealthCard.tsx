// @refresh reset

/**
 * @module MaintenanceHealthCard
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
 * For prop API + usage notes, read `MaintenanceHealthCard.md` in this folder
 * or run `npm run ld-kit -- show MaintenanceHealthCard`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import { Button } from '../../components/Button';
import { Tag } from '../../components/Tag';
import { Alert } from '../../components/Alert';
import './MaintenanceHealthCard.css';

export type HealthStatus = "overdue" | "due" | "good";

export interface MaintenanceItem {
  name: string;
  status: HealthStatus;
  detail: string;
  price?: string;
}

export interface MaintenanceHealthCardProps {
  vehicle: string;
  mileage: string;
  healthScore: number; // 0–100
  items: MaintenanceItem[];
  bundleSavings?: string;
  bundleSavingsAmount?: string;
  location?: string;
  illustration?: string;
  valueStatement?: string;
}

const STATUS_TAG: Record<HealthStatus, { color: "negative" | "warning" | "positive"; label: string }> = {
  overdue: { color: "negative", label: "Overdue" },
  due: { color: "warning", label: "Due soon" },
  good: { color: "positive", label: "Good" },
};

function ScoreRing({ score }: { score: number }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color =
    score >= 70
      ? "var(--ld-semantic-color-text-positive, #4ADE80)"
      : score >= 40
        ? "var(--ld-semantic-color-rating-fill, #FACC15)"
        : "var(--ld-semantic-color-text-negative, #F87171)";

  return (
    <svg width="52" height="52" viewBox="0 0 52 52" aria-label={`Health score: ${score} out of 100`}>
      <circle cx="26" cy="26" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="5" />
      <circle
        cx="26" cy="26" r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 26 26)"
      />
      <text
        x="26" y="26"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#ffffff"
        fontSize="12"
        fontWeight="700"
      >
        {score}
      </text>
    </svg>
  );
}

export function MaintenanceHealthCard({
  vehicle,
  mileage,
  healthScore,
  items,
  bundleSavings,
  bundleSavingsAmount,
  location,
  illustration,
  valueStatement,
}: MaintenanceHealthCardProps) {
  const needsAction = items.some((i) => i.status === "overdue" || i.status === "due");

  return (
    <article className="ld-wcp-maintenance-health-card-root">
      {/* Header */}
      <div className="ld-wcp-maintenance-health-card-header">
        {illustration && (
          <img
            src={illustration}
            alt=""
            aria-hidden="true"
            className="ld-wcp-maintenance-health-card-header-illustration"
          />
        )}
        <div className="ld-wcp-maintenance-health-card-header-info">
          <p className="ld-wcp-maintenance-health-card-header-label">
            Auto Care Center
          </p>
          <p className="ld-wcp-maintenance-health-card-header-vehicle">{vehicle}</p>
          {location && <p className="ld-wcp-maintenance-health-card-header-sub">{location}</p>}
          <p className="ld-wcp-maintenance-health-card-header-sub">{mileage}</p>
        </div>
        <div className="ld-wcp-maintenance-health-card-header-score">
          <ScoreRing score={healthScore} />
          <span className="ld-wcp-maintenance-health-card-score-label">
            Health
          </span>
        </div>
      </div>

      {/* Value statement */}
      {valueStatement && (
        <div className="ld-wcp-maintenance-health-card-value-statement">
          <Alert variant="info">{valueStatement}</Alert>
        </div>
      )}

      {/* Maintenance grid */}
      <div className="ld-wcp-maintenance-health-card-grid-section">
        <p className="ld-wcp-maintenance-health-card-grid-heading">
          Maintenance status
        </p>
        <div
          className="ld-wcp-maintenance-health-card-grid"
          style={{ gridTemplateColumns: `repeat(${Math.min(items.length, 3)}, 1fr)` }}
        >
          {items.map((item) => {
            const tag = STATUS_TAG[item.status];
            return (
              <div
                key={item.name}
                className="ld-wcp-maintenance-health-card-grid-item"
              >
                <Tag color={tag.color}>
                  {tag.label}
                </Tag>
                <p className="ld-wcp-maintenance-health-card-item-name">
                  {item.name}
                </p>
                <p className="ld-wcp-maintenance-health-card-item-detail">
                  {item.detail}
                </p>
                {item.price && (
                  <p className="ld-wcp-maintenance-health-card-item-price">
                    ~{item.price}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bundle savings */}
      {bundleSavings && (
        <div className="ld-wcp-maintenance-health-card-bundle">
          <Alert variant="success">
            {bundleSavings}
            {bundleSavingsAmount && <> — <strong>Save {bundleSavingsAmount}</strong></>}
          </Alert>
        </div>
      )}

      {/* Footer */}
      <div className="ld-wcp-maintenance-health-card-footer">
        <span
          className={cx(
            'ld-wcp-maintenance-health-card-footer-status',
            needsAction ? 'ld-wcp-maintenance-health-card-footer-status--action' : 'ld-wcp-maintenance-health-card-footer-status--ok',
          )}
        >
          {needsAction ? "Action recommended" : "All services on track"}
        </span>
        <div className="ld-wcp-maintenance-health-card-footer-actions">
          <Button variant="secondary" size="small">
            View full report
          </Button>
          <Button variant="primary" size="small">
            Schedule services
          </Button>
        </div>
      </div>
    </article>
  );
}
MaintenanceHealthCard.displayName = 'MaintenanceHealthCard';
