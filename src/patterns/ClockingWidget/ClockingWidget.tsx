// @refresh reset

/**
 * @module ClockingWidget
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
 * For prop API + usage notes, read `ClockingWidget.md` in this folder
 * or run `npm run ld-kit -- show ClockingWidget`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/walmart/ClockingWidget.tsx
 *
 * AX Clocking Widget — associate clock-in / clock-out summary card.
 * Shows current clock state, role, shift, lunch, store / WM-week, and
 * primary "Clock in" + "View timecard" actions.
 *
 * Adaptation:
 * - Imagery hero is rendered via `PlaceholderMedia` instead of a remote
 *   illustration URL.
 * - `StoreIcon` from the source kit's `icons-custom` is replaced with a
 *   small inline SVG so the port has no extra icon dependencies.
 * - The "Clock in" button is a custom button (not the core `Button`) that
 *   styles itself purely via the LD topNav fill / topNav text-onFill tokens
 *   — i.e. the "alt" fill contract used on top of the topNav surface — so
 *   the button always sits cleanly on the navy widget background and
 *   re-themes with the rest of the topNav surface.
 */
import * as React from 'react';

import {Button} from '../../components/Button';
import {ClockIn, ClockOut} from '../../components/ClockStatus';
import {Icon} from '../../components/Icons';
import {IconButton} from '../../components/IconButton';
import {LinkButton} from '../../components/LinkButton';
import type {ClockState} from '../../components/ClockStatus';
import {PlaceholderMedia} from '../../common/PlaceholderMedia';
import {cx} from '../../common/cx';

import './ClockingWidget.css';

export type {ClockState} from '../../components/ClockStatus';

export interface ClockingWidgetProps {
  clockState?: ClockState;
  role?: string;
  shiftTime?: string;
  lunchTime?: string;
  storeNumber?: string;
  walmartWeek?: string;
  onClockIn?: () => void;
  onViewTimecard?: () => void;
  /** When `false` (default), a placeholder illustration is shown on the
   * top-right (mobile widths). Pass `false` to opt out. */
  showIllustration?: boolean;
  /** Custom illustration node rendered in place of the default
   * `PlaceholderMedia` box, e.g. `<Illustration type="spot" name="AssociateOnTheWay" />`
   * from `src/utils/Illustration`. Ignored when `showIllustration` is `false`. */
  illustration?: React.ReactNode;

  /** Show a "Start meal" action alongside the clock button. @default false */
  showMealButton?: boolean;
  /** @default 'Start meal' */
  mealButtonLabel?: string;
  onStartMeal?: () => void;

  /** Show a trailing overflow ("⋯") trigger. @default false
   * When `true`, the "View timecard" link is omitted — it's expected to live
   * behind this overflow instead. Wiring up what the trigger opens (a menu,
   * a sheet, etc.) is the consumer's job; this just exposes the button. */
  showMoreButton?: boolean;
  onMoreClick?: () => void;
  /** @default 'More actions' */
  moreA11yLabel?: string;

  className?: string;
}

export {ClockIn, ClockOut} from '../../components/ClockStatus';

const ShiftTimeIcon = () => <Icon name="Clock" decorative style={{fontSize: 16}} />;

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
    <path
      d="M5.15 4.5V1h1v3.5a.5.5 0 1 1-1 0Z"
      fill="currentColor"
    />
  </svg>
);

const StoreIcon = () => <Icon name="Facility" decorative style={{fontSize: 16}} />;

// "ClockOut" only exists as a distinct icon for the clock-out state — there's
// no matching "ClockIn" glyph in the shared icon sets (wcp/sams-club/bodega),
// only in the AX-only font, which isn't what themes resolve to by default.
// Clock-in keeps the generic "Clock" icon.
const ClockButtonIcon = ({isClockedIn}: {isClockedIn: boolean}) => (
  <Icon name={isClockedIn ? 'ClockOut' : 'Clock'} decorative style={{fontSize: 16}} />
);

// Utensils is not in the LD icon set; reuse the same inline SVG used for the
// lunch attribute row so the icon renders correctly in all themes.
const MealButtonIcon = () => <LunchIcon />;

const MoreButtonIcon = () => <Icon name="More" decorative style={{fontSize: 16}} />;

export const ClockingWidget: React.FC<ClockingWidgetProps> = ({
  clockState = 'clocked-out',
  role = 'Food & Consumables TL',
  shiftTime = 'Today, 7:30am – 4:00pm',
  lunchTime = '12:00pm – 12:30pm',
  storeNumber = 'Store #972',
  walmartWeek = 'WM WK 9',
  onClockIn,
  onViewTimecard,
  showIllustration = true,
  illustration,
  showMealButton = false,
  mealButtonLabel = 'Start meal',
  onStartMeal,
  showMoreButton = false,
  onMoreClick,
  moreA11yLabel = 'More actions',
  className,
}) => {
  const isClockedIn = clockState === 'clocked-in';

  if (process.env.NODE_ENV !== 'production') {
    if (showMoreButton && !onMoreClick) {
      // eslint-disable-next-line no-console
      console.warn(
        '[ClockingWidget] showMoreButton=true but onMoreClick is undefined. ' +
          'The more button will render with no click handler.',
      );
    }
  }

  return (
    <div className={cx('ax-clocking-widget', className)}>
      <div className="ax-clocking-widget__inner">
        <div className="ax-clocking-widget__top-row">
          <div className="ax-clocking-widget__info-column">
            <div className="ax-clocking-widget__status-row">
              <span className="ax-clocking-widget__status-label">
                {isClockedIn ? 'Clocked in' : 'Clocked out'}
              </span>
              <span className="ax-clocking-widget__status-icon">
                {isClockedIn ? <ClockIn /> : <ClockOut />}
              </span>
            </div>
            <p className="ax-clocking-widget__role">{role}</p>
            <div className="ax-clocking-widget__attributes">
              <span className="ax-clocking-widget__attribute">
                <ShiftTimeIcon />
                {shiftTime}
              </span>
              <span className="ax-clocking-widget__attribute">
                <LunchIcon />
                {lunchTime}
              </span>
              <span className="ax-clocking-widget__attribute">
                <StoreIcon />
                {storeNumber}
                <span className="ax-clocking-widget__separator">|</span>
                {walmartWeek}
              </span>
            </div>
          </div>
          {showIllustration ? (
            <div className="ax-clocking-widget__illustration" aria-hidden>
              {illustration ?? (
                <PlaceholderMedia
                  shape="rect"
                  width="100%"
                  height="100%"
                  label="Associates"
                />
              )}
            </div>
          ) : null}
        </div>

        <div className="ax-clocking-widget__actions">
          {showMealButton ? (
            <Button
              variant="topnav-action-alt"
              size="small"
              UNSAFE_className={cx(
                'ax-clocking-widget__clock-button',
                'ax-clocking-widget__clock-button--topnav-fill-alt',
              )}
              leading={<MealButtonIcon />}
              onClick={onStartMeal}
            >
              {mealButtonLabel}
            </Button>
          ) : null}
          <Button
            variant="topnav-action-alt"
            size="small"
            UNSAFE_className={cx(
              'ax-clocking-widget__clock-button',
              'ax-clocking-widget__clock-button--topnav-fill-alt',
            )}
            leading={<ClockButtonIcon isClockedIn={isClockedIn} />}
            onClick={onClockIn}
          >
            {isClockedIn ? 'Clock out' : 'Clock in'}
          </Button>
          {showMoreButton ? (
            <IconButton
              variant="ghost"
              size="small"
              a11yLabel={moreA11yLabel}
              onClick={onMoreClick}
              UNSAFE_className={cx(
                'ax-clocking-widget__more-button',
                'ax-clocking-widget__clock-button--topnav-fill-alt',
              )}
            >
              <MoreButtonIcon />
            </IconButton>
          ) : (
            <LinkButton color="white" size="small" onClick={onViewTimecard}>
              View timecard
            </LinkButton>
          )}
        </div>
      </div>
    </div>
  );
};

ClockingWidget.displayName = 'ClockingWidget';

