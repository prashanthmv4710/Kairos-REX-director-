// @refresh reset

/**
 * @module ScheduleWidget
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
 * For prop API + usage notes, read `ScheduleWidget.md` in this folder
 * or run `npm run ld-kit -- show ScheduleWidget`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/walmart/ScheduleWidget.tsx
 *
 * AX Schedule Widget — list of upcoming associate shifts with role,
 * lunch, store, and an optional "Report an absence" CTA on the active
 * shift, plus a footer promo card.
 *
 * Icons use the theme font via the shared `Icon` component. `LunchIcon`
 * stays an inline SVG because no equivalent glyph exists in any theme's
 * icon font.
 */
import * as React from 'react';

import {Button} from '../../components/Button';
import {LinkButton} from '../../components/LinkButton';
import {Tag} from '../../components/Tag';
import {Icon} from '../../components/Icons';
import {cx} from '../../common/cx';

import './ScheduleWidget.css';

export interface Shift {
  id: string;
  dateLabel: string;
  role: string;
  lunchTime: string;
  store: string;
  isOffsite?: boolean;
  showReportAbsence?: boolean;
}

export interface ScheduleWidgetProps {
  shifts?: Shift[];
  onShiftClick?: (shift: Shift) => void;
  onViewFullSchedule?: () => void;
  onReportAbsence?: () => void;
  className?: string;
}

const LunchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M2.5 1H3.5V4.84c0 .067.012.128.034.184.034.226.094.449.18.662l.375.94c.28.695.395 1.099.347 1.846l-.307 4.597c-.033.503.366.93.87.93.504 0 .902-.427.87-.93l-.307-4.597c-.05-.747.067-1.151.348-1.847l.375-.94c.085-.213.144-.435.18-.661a.69.69 0 0 0 .034-.184V1h1v3.574c0 .509-.097 1.013-.285 1.486L6.838 7c-.223.556-.317.81-.278 1.407l.307 4.597c.072 1.08-.785 1.996-1.867 1.996-.531 0-1.008-.22-1.348-.573-.353-.366-.557-.873-.52-1.423l.307-4.597c.04-.597-.054-.851-.277-1.407l-.377-.94A4.005 4.005 0 0 1 2.5 4.574V1Z"
      fill="currentColor"
    />
    <path
      d="M3.85 1v3.5a.5.5 0 1 0 1 0V1h-1ZM8.5 3.5a2.5 2.5 0 0 1 5 0v.96a4.4 4.4 0 0 1-.465 1.97c-.35.7-.508 1.482-.456 2.263l.288 4.31c.072 1.081-.785 1.997-1.867 1.997s-1.94-.916-1.867-1.997l.288-4.31a4.4 4.4 0 0 0-.456-2.263A4.4 4.4 0 0 1 8.5 4.46V3.5Zm1.63 9.57a.875.875 0 0 0 1.74 0l-.288-4.31a5.4 5.4 0 0 1 .56-2.777c.236-.473.358-.994.358-1.523V3.5a1.5 1.5 0 0 0-3 0v.96c0 .529.123 1.05.36 1.523a5.4 5.4 0 0 1 .558 2.777l-.288 4.31Z"
      fill="currentColor"
    />
  </svg>
);

const ShiftItem: React.FC<{
  shift: Shift;
  onClick?: (shift: Shift) => void;
  onReportAbsence?: () => void;
}> = ({shift, onClick, onReportAbsence}) => (
  <div className="ax-schedule-widget__shift-item">
    <button
      type="button"
      className="ax-schedule-widget__shift-row"
      aria-label={`View shift details for ${shift.dateLabel}`}
      onClick={() => onClick?.(shift)}
    >
      <div className="ax-schedule-widget__shift-main">
        <div className="ax-schedule-widget__shift-header">
          <span className="ax-schedule-widget__shift-date">
            {shift.dateLabel}
          </span>
          {shift.isOffsite ? (
            <Tag variant="tertiary" color="brand">
              Offsite
            </Tag>
          ) : null}
        </div>
        <div className="ax-schedule-widget__shift-details">
          <span className="ax-schedule-widget__shift-detail">
            <Icon name="UserCircle" size="small" decorative />
            {shift.role}
          </span>
          <span className="ax-schedule-widget__shift-detail">
            <LunchIcon />
            {shift.lunchTime}
          </span>
          <span className="ax-schedule-widget__shift-detail">
            <Icon name="Facility" size="small" decorative />
            {shift.store}
          </span>
        </div>
      </div>
      <span className="ax-schedule-widget__chevron">
        <Icon name="ChevronRight" style={{fontSize: 20}} decorative />
      </span>
    </button>

    {shift.showReportAbsence ? (
      <div className="ax-schedule-widget__report-row">
        <Button
          variant="secondary"
          size="medium"
          isFullWidth
          onClick={onReportAbsence}
        >
          Report an absence
        </Button>
      </div>
    ) : null}

    <div
      className="ax-schedule-widget__shift-divider"
      role="separator"
      aria-hidden
    />
  </div>
);

export const ScheduleWidget: React.FC<ScheduleWidgetProps> = ({
  shifts = [],
  onShiftClick,
  onViewFullSchedule,
  onReportAbsence,
  className,
}) => {
  return (
    <div className={cx('ax-schedule-widget', className)}>
      <div className="ax-schedule-widget__header">
        <div className="ax-schedule-widget__header-left">
          <h2 className="ax-schedule-widget__title">Your schedule</h2>
          <LinkButton size="small" onClick={onViewFullSchedule}>
            View full schedule
          </LinkButton>
        </div>
        <p className="ax-schedule-widget__subtitle">
          Your next 3 shifts are shown. See your full schedule for all upcoming
          shifts.
        </p>
      </div>

      <div className="ax-schedule-widget__shift-list">
        {shifts.map((shift) => (
          <ShiftItem
            key={shift.id}
            shift={shift}
            onClick={onShiftClick}
            onReportAbsence={onReportAbsence}
          />
        ))}
      </div>

      <div className="ax-schedule-widget__promo-card">
        <p className="ax-schedule-widget__promo-title">
          See more of your schedule
        </p>
        <p className="ax-schedule-widget__promo-text">
          See all your shifts, and explore tools that put you in control of
          your schedule with ease and flexibility.
        </p>
        <Button
          variant="tertiary"
          size="small"
          onClick={onViewFullSchedule}
        >
          View full schedule
        </Button>
      </div>
    </div>
  );
};

ScheduleWidget.displayName = 'ScheduleWidget';

