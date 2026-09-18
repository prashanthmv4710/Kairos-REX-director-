// @refresh reset

/**
 * @module TimerView
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
 * For prop API + usage notes, read `TimerView.md` in this folder
 * or run `npm run ld-kit -- show TimerView`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import './TimerView.css';

// ── Inlined useWCPTimer hook ──────────────────────────────────────────────────

export type TimerUrgency = 'normal' | 'warning' | 'critical';

export interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isExpired: boolean;
  urgency: TimerUrgency;
  formatted: string;
}

function computeTimerState(endTime: Date | number | string): TimerState {
  const end = new Date(endTime).getTime();
  const now = Date.now();
  const diff = Math.max(0, Math.floor((end - now) / 1000));

  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isExpired: true, urgency: 'critical', formatted: '00:00' };
  }

  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

  let urgency: TimerUrgency = 'normal';
  if (diff < 60) urgency = 'critical';
  else if (diff < 600) urgency = 'warning';

  const pad = (n: number) => String(n).padStart(2, '0');
  const formatted = hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;

  return { hours, minutes, seconds, totalSeconds: diff, isExpired: false, urgency, formatted };
}

export function useWCPTimer(
  endTime: Date | number | string,
  onExpire?: () => void,
): TimerState {
  const [state, setState] = React.useState<TimerState>(() => computeTimerState(endTime));
  const onExpireRef = React.useRef(onExpire);
  onExpireRef.current = onExpire;
  const expiredFiredRef = React.useRef(false);

  const tick = React.useCallback(() => {
    const next = computeTimerState(endTime);
    setState(next);
    if (next.isExpired && !expiredFiredRef.current) {
      expiredFiredRef.current = true;
      onExpireRef.current?.();
    }
  }, [endTime]);

  React.useEffect(() => {
    expiredFiredRef.current = false;
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);

  return state;
}

// ── Component ─────────────────────────────────────────────────────────────────

export type TimerViewVariant = 'waiting' | 'warning' | 'expiring' | 'badge' | 'brand-bold' | 'outlined' | 'transparent';
export type TimerViewSize = 'medium' | 'small';
export type TimerBadgeColor = 'blue' | 'spark' | 'negative';

export interface TimerViewProps
  extends Omit<React.ComponentPropsWithoutRef<'span'>, 'className' | 'style'> {
  timeDisplay?: string;
  /** @default 'waiting' */
  variant?: TimerViewVariant;
  /** @default 'medium' */
  size?: TimerViewSize;
  endTime?: Date | number | string;
  badgeColor?: TimerBadgeColor;
  label?: string;
  showLabel?: boolean;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

const VARIANT_CLASS: Record<string, string> = {
  waiting: 'ld-wcp-timerview-waiting',
  warning: 'ld-wcp-timerview-warning',
  expiring: 'ld-wcp-timerview-expiring',
  'brand-bold': 'ld-wcp-timerview-brand-bold',
  outlined: 'ld-wcp-timerview-outlined',
  transparent: 'ld-wcp-timerview-transparent',
};

const BADGE_COLOR_TO_VARIANT: Record<TimerBadgeColor, string> = {
  blue: 'waiting',
  spark: 'warning',
  negative: 'expiring',
};

export const TimerView: React.FunctionComponent<TimerViewProps> = (props) => {
  const {timeDisplay, variant = 'waiting', size = 'medium', endTime, badgeColor, label, showLabel = true, className, ...rest} = applyCommonProps(props);

  const timer = useWCPTimer(endTime ?? 0);
  const hasEndTime = endTime !== undefined;

  const display = hasEndTime ? timer.formatted : (timeDisplay ?? '');

  let resolvedVariant: string;
  if (variant === 'badge' && badgeColor) {
    resolvedVariant = BADGE_COLOR_TO_VARIANT[badgeColor] ?? 'waiting';
  } else if (variant === 'badge') {
    resolvedVariant = timer.urgency === 'critical' ? 'expiring' : timer.urgency === 'warning' ? 'warning' : 'waiting';
  } else if (hasEndTime && variant === 'waiting') {
    resolvedVariant = timer.urgency === 'critical' ? 'expiring' : timer.urgency === 'warning' ? 'warning' : 'waiting';
  } else {
    resolvedVariant = variant;
  }

  return (
    <>
      <span
        className={cx(
          'ld-wcp-timerview-timer',
          VARIANT_CLASS[resolvedVariant] ?? 'ld-wcp-timerview-waiting',
          size === 'small' && 'ld-wcp-timerview-small',
          className
        )}
        {...rest}
      >
        {display}
      </span>
      {label && showLabel && <span className="ld-wcp-timerview-label">{label}</span>}
    </>
  );
};

TimerView.displayName = 'TimerView';
