'use client';

import * as React from 'react';

import {cx} from '../../../common/cx';
import {
  CheckCircleFillIcon,
  ExclamationCircleFillIcon,
} from '../../Icons/Icons';
import {Spinner} from '../../Spinner/Spinner';
import {Body, Caption} from '../../Text/Text';
import {VisuallyHidden} from '../../VisuallyHidden';

import {TraceRow} from '../TraceRow';
import type {TraceState} from '../ProcessingTrace';
import './ActivityList.css';

/* ============================================================
   ProcessingTraceActivityItem — single activity row
   ============================================================ */

export interface ProcessingTraceActivityItemProps {
  /** Activity state — drives the leading glyph. */
  state: TraceState;
  /**
   * Overrides the visually-hidden state announcement text (e.g. "In progress:")
   * for non-English banners. Merged over `DEFAULT_TRACE_STATE_LABELS` — supply
   * only the states you need to override. Falls back to whatever a parent
   * `ProcessingTrace.ActivityList`'s own `stateLabels` prop provides.
   */
  stateLabels?: Partial<Record<TraceState, string>>;
  /** Activity label. */
  label: React.ReactNode;
  /** Optional secondary text (timestamp, target, hint). */
  meta?: React.ReactNode;
  /**
   * Optional custom leading icon. When provided, it replaces the default
   * state glyph (the row's `state` still drives the icon color).
   */
  icon?: React.ReactNode;
  /** Optional trailing slot rendered on the right edge of the row. */
  trailing?: React.ReactNode;
  /** @internal Additional CSS class. */
  UNSAFE_className?: string;
}

const STATE_GLYPH: Record<TraceState, React.ReactNode> = {
  // 16px via the "small" size token on each (Spinner is resized to match in CSS
  // — its smallest built-in size is 24px and it doesn't accept a style/className
  // override).
  processing: <Spinner size="small" color="brand" variant="generic" />,
  success: <CheckCircleFillIcon size="small" />,
  failure: <ExclamationCircleFillIcon />,
};

// Screen readers otherwise get nothing from this row but the label text — the
// glyph is the only thing conveying whether that step is done, in progress,
// or failed, and it's `aria-hidden`. This text is read out ahead of the label
// so the state isn't color/icon-only.
//
// Exported (rather than kept as a private constant) so a non-English banner
// (cashi-mx, bodega) can override individual states without retyping the
// ones it doesn't need to change — see `stateLabels` on both
// `ProcessingTrace.ActivityList` and `ProcessingTrace.ActivityItem`.
export const DEFAULT_TRACE_STATE_LABELS: Record<TraceState, string> = {
  processing: 'In progress:',
  success: 'Completed:',
  failure: 'Failed:',
};

// Lets `ActivityList` hand its `stateLabels` override down to every child
// `ActivityItem` without forcing the consumer to repeat the prop on each row.
// An item-level `stateLabels` prop (for a one-off row) still wins over this.
const ActivityStateLabelsContext = React.createContext<Record<TraceState, string>>(
  DEFAULT_TRACE_STATE_LABELS,
);

export const ProcessingTraceActivityItem: React.FunctionComponent<
  ProcessingTraceActivityItemProps
> = (props) => {
  const {state, label, meta, icon, trailing, stateLabels, UNSAFE_className} = props;

  // Item-level override > whatever the parent `ActivityList` provided via
  // context > the built-in English defaults.
  const inheritedLabels = React.useContext(ActivityStateLabelsContext);
  const stateText = stateLabels?.[state] ?? inheritedLabels[state];

  return (
    <li
      className={cx(
        'ld-processingtrace-activity',
        `ld-processingtrace-activity--${state}`,
        UNSAFE_className,
      )}
    >
      <span className="ld-processingtrace-activity-glyph" aria-hidden="true">
        {icon ?? STATE_GLYPH[state]}
      </span>
      <span className="ld-processingtrace-activity-text">
        <Body size="small">
          <VisuallyHidden>{stateText} </VisuallyHidden>
          {label}
        </Body>
        {meta != null ? (
          <Caption color="subtle">{meta}</Caption>
        ) : null}
      </span>
      {trailing != null ? (
        <span className="ld-processingtrace-activity-trailing">{trailing}</span>
      ) : null}
    </li>
  );
};

ProcessingTraceActivityItem.displayName = 'ProcessingTrace.ActivityItem';

/* ============================================================
   ProcessingTraceActivityList — compact activity log card
   ============================================================ */

export interface ProcessingTraceActivityListProps {
  /** Overall state. When omitted, no header status pill is rendered. */
  state?: TraceState;
  /** Override the status pill label. */
  statusLabel?: React.ReactNode;
  /** Header label. @default "Activity" */
  label?: React.ReactNode;
  /** Optional leading icon. */
  icon?: React.ReactNode;
  /**
   * Overrides the visually-hidden per-row state announcement text (e.g.
   * "In progress:") for non-English banners. Merged over
   * `DEFAULT_TRACE_STATE_LABELS` and passed down to every child
   * `ProcessingTrace.ActivityItem` — no need to repeat it on each row.
   */
  stateLabels?: Partial<Record<TraceState, string>>;
  /** One or more `<ProcessingTrace.ActivityItem>` children. */
  children: React.ReactNode;
  /** Uncontrolled initial open state. @default true */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Callback fired when the card open state changes. */
  onOpenChange?: (open: boolean) => void;
  /**
   * When `false`, the card has no chevron and the body is always visible.
   * @default true
   */
  collapsible?: boolean;
  /**
   * Optional max-height for the scrollable list body (e.g. `"200px"`). When
   * set, the list overflows with a scrollbar when content exceeds the height.
   */
  maxHeight?: string;
  /** @internal Additional CSS class. */
  UNSAFE_className?: string;
}

/**
 * Activity list card. A simpler sibling of `Timeline` — no spine, no nested
 * body content, just a tight `[glyph] [text]` grid.
 */
export const ProcessingTraceActivityList: React.FunctionComponent<
  ProcessingTraceActivityListProps
> = (props) => {
  const {
    state,
    statusLabel,
    label = 'Activity',
    icon,
    stateLabels,
    children,
    defaultOpen = true,
    open,
    onOpenChange,
    collapsible = true,
    maxHeight,
    UNSAFE_className,
  } = props;

  // Merge once per render rather than re-spreading in the provider value on
  // every render — a plain object identity change would otherwise blow past
  // any child relying on reference equality.
  const mergedStateLabels = React.useMemo(
    () => ({...DEFAULT_TRACE_STATE_LABELS, ...stateLabels}),
    [stateLabels],
  );

  // The scrollbar stays hidden until the list is actively being scrolled (or
  // hovered/focused), then fades back out shortly after scrolling stops.
  const [isScrolling, setIsScrolling] = React.useState(false);
  const scrollIdleTimeout = React.useRef<ReturnType<typeof setTimeout>>();

  const handleScroll = React.useCallback(() => {
    setIsScrolling(true);
    if (scrollIdleTimeout.current) clearTimeout(scrollIdleTimeout.current);
    scrollIdleTimeout.current = setTimeout(() => setIsScrolling(false), 800);
  }, []);

  React.useEffect(() => {
    return () => {
      if (scrollIdleTimeout.current) clearTimeout(scrollIdleTimeout.current);
    };
  }, []);

  return (
    <TraceRow
      state={state}
      statusLabel={statusLabel}
      label={label}
      icon={icon}
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      collapsible={collapsible}
      UNSAFE_className={cx('ld-processingtrace-activitylist', UNSAFE_className)}
    >
      <ul
        className={cx(
          'ld-processingtrace-activitylist-list',
          maxHeight && 'ld-processingtrace-activitylist-list--scrollable',
          isScrolling && 'ld-processingtrace-activitylist-list--scrolling',
        )}
        style={maxHeight ? {maxHeight, overflowY: 'auto', overflowX: 'hidden'} : undefined}
        onScroll={maxHeight ? handleScroll : undefined}
      >
        <ActivityStateLabelsContext.Provider value={mergedStateLabels}>
          {children}
        </ActivityStateLabelsContext.Provider>
      </ul>
    </TraceRow>
  );
};

ProcessingTraceActivityList.displayName = 'ProcessingTrace.ActivityList';
