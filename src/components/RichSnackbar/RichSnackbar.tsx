// @refresh reset

/**
 * @module RichSnackbar
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
 * For prop API + usage notes, read `RichSnackbar.md` in this folder
 * or run `npm run ld-kit -- show RichSnackbar`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {useA11yAnnouncement} from '../A11yAnnouncement';
import {CloseIcon} from '../Icons';
import './RichSnackbar.css';

// ── Inlined useWCPRichSnackbar hook ───────────────────────────────────────────

export type RichSnackbarColor = 'primary' | 'secondary' | 'inverse' | 'brand';
export type RichSnackbarContentVariant = 'left-regular' | 'left-bold' | 'center-regular' | 'center-bold';

export interface RichSnackbarState {
  id: string;
  open: boolean;
  color: RichSnackbarColor;
  contentVariant: RichSnackbarContentVariant;
  leadingSlot?: React.ReactNode;
  message: string | React.ReactNode;
  /** Plain-text override for the AT announcement. Required when message is a ReactNode. */
  a11yAnnouncement?: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
  position?: 'bottom-left' | 'bottom-center' | 'bottom-right';
}

export interface RichSnackbarOptions {
  color?: RichSnackbarColor;
  contentVariant?: RichSnackbarContentVariant;
  leadingSlot?: React.ReactNode;
  message: string | React.ReactNode;
  /** Plain-text override for the AT announcement. Required when message is a ReactNode. */
  a11yAnnouncement?: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
  position?: 'bottom-left' | 'bottom-center' | 'bottom-right';
}

let _state: RichSnackbarState | null = null;
let _listeners: Array<(s: RichSnackbarState | null) => void> = [];
const _notify = () => _listeners.forEach((l) => l(_state));

export const subscribeWCPRichSnackbar = (listener: (s: RichSnackbarState | null) => void) => {
  _listeners.push(listener);
  return () => { _listeners = _listeners.filter((l) => l !== listener); };
};

export const wcpRichSnackbar = (options: RichSnackbarOptions): string => {
  const id = Math.random().toString(36).substring(2, 9);
  _state = {
    id, open: true,
    color: options.color ?? 'primary',
    contentVariant: options.contentVariant ?? 'left-regular',
    leadingSlot: options.leadingSlot,
    message: options.message,
    a11yAnnouncement: options.a11yAnnouncement,
    actionLabel: options.actionLabel,
    onAction: options.onAction,
    duration: options.duration ?? 4000,
    position: options.position ?? 'bottom-center',
  };
  _notify();
  return id;
};

export const dismissWCPRichSnackbar = () => {
  if (_state) {
    _state = {..._state, open: false};
    _notify();
    setTimeout(() => { _state = null; _notify(); }, 200);
  }
};

export const useWCPRichSnackbar = () => {
  const [current, setCurrent] = React.useState<RichSnackbarState | null>(_state);
  React.useEffect(() => subscribeWCPRichSnackbar(setCurrent), []);
  const show = React.useCallback((options: RichSnackbarOptions) => wcpRichSnackbar(options), []);
  const dismiss = React.useCallback(() => dismissWCPRichSnackbar(), []);
  return {snackbar: current, show, dismiss};
};

// ── Component ─────────────────────────────────────────────────────────────────

export interface RichSnackbarProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  open?: boolean;
  color?: RichSnackbarColor;
  contentVariant?: RichSnackbarContentVariant;
  leadingSlot?: React.ReactNode;
  message: string | React.ReactNode;
  /**
   * Plain-text string announced to screen readers via the shared
   * `A11yAnnouncementProvider` live region when the snackbar opens.
   * Required when `message` is a ReactNode (non-string). When omitted and
   * `message` is a string, the message text is used automatically.
   * If `actionLabel` is provided it is appended: "Message text. Action label."
   */
  a11yAnnouncement?: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
  duration?: number;
  position?: 'bottom-left' | 'bottom-center' | 'bottom-right';
  inline?: boolean;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

const POSITION_CLASS: Record<string, string> = {
  'bottom-left': 'ld-wcp-richsnackbar-bottomLeft',
  'bottom-center': 'ld-wcp-richsnackbar-bottomCenter',
  'bottom-right': 'ld-wcp-richsnackbar-bottomRight',
};

const COLOR_CLASS: Record<RichSnackbarColor, string> = {
  primary: 'ld-wcp-richsnackbar-primary',
  secondary: 'ld-wcp-richsnackbar-secondary',
  inverse: 'ld-wcp-richsnackbar-inverse',
  brand: 'ld-wcp-richsnackbar-brand',
};

export const RichSnackbar: React.FunctionComponent<RichSnackbarProps> = (props) => {
  const {
    open = true, color = 'primary', contentVariant = 'left-regular',
    leadingSlot, message, a11yAnnouncement, actionLabel, onAction, onClose,
    duration = 4000, position = 'bottom-center', inline: isInline = false,
    className, ...rest
  } = applyCommonProps(props);

  const {announcePolite} = useA11yAnnouncement();
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-dismiss timer
  React.useEffect(() => {
    if (open && duration !== Infinity && onClose) {
      timerRef.current = setTimeout(() => onClose(), duration);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [open, duration, onClose]);

  // Announce via the shared live region instead of an inline aria-live.
  // Inline aria-live regions multiply across every RichSnackbar instance;
  // routing through A11yAnnouncementProvider ensures a single live region.
  React.useEffect(() => {
    if (!open) return;
    const text = a11yAnnouncement ?? (typeof message === 'string' ? message : undefined);
    if (!text) return;
    const announcement = actionLabel ? `${text}. ${actionLabel}.` : text;
    announcePolite(announcement);
  }, [open, a11yAnnouncement, message, actionLabel, announcePolite]);

  // Keep hooks above this guard (React rules of hooks)
  if (!open && !isInline) return null;

  const isBold = contentVariant === 'left-bold' || contentVariant === 'center-bold';
  const isCenter = contentVariant === 'center-regular' || contentVariant === 'center-bold';

  const handleActionClick = () => { onAction?.(); onClose?.(); };

  return (
    <div
      className={cx(
        'ld-wcp-richsnackbar-snackbar',
        COLOR_CLASS[color],
        isInline ? 'ld-wcp-richsnackbar-inlineMode' : (POSITION_CLASS[position] ?? 'ld-wcp-richsnackbar-bottomCenter'),
        (open || isInline) && 'ld-wcp-richsnackbar-open',
        className
      )}
      {...rest}
    >
      <div className={cx('ld-wcp-richsnackbar-copy', isCenter && 'ld-wcp-richsnackbar-copyCenter')}>
        {leadingSlot && <div className="ld-wcp-richsnackbar-leading">{leadingSlot}</div>}
        <div className={cx('ld-wcp-richsnackbar-message', isBold && 'ld-wcp-richsnackbar-messageBold')}>{message}</div>
      </div>
      {(actionLabel || onClose) && (
        <div className="ld-wcp-richsnackbar-trailing">
          <div className="ld-wcp-richsnackbar-trailingActions">
            {actionLabel && (
              <div className="ld-wcp-richsnackbar-actionWrapper">
                <button type="button" className="ld-wcp-richsnackbar-actionBtn" onClick={handleActionClick}>{actionLabel}</button>
              </div>
            )}
            {onClose && (
              <div className="ld-wcp-richsnackbar-closeWrapper">
                <button type="button" className="ld-wcp-richsnackbar-closeBtn" onClick={onClose} aria-label="Close notification">
                  <CloseIcon size="small" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

RichSnackbar.displayName = 'RichSnackbar';

// ── Container ─────────────────────────────────────────────────────────────────

export const RichSnackbarContainer: React.FunctionComponent = () => {
  const {snackbar} = useWCPRichSnackbar();
  if (!snackbar) return null;
  return (
    <RichSnackbar
      open={snackbar.open}
      color={snackbar.color}
      contentVariant={snackbar.contentVariant}
      leadingSlot={snackbar.leadingSlot}
      message={snackbar.message}
      a11yAnnouncement={snackbar.a11yAnnouncement}
      actionLabel={snackbar.actionLabel}
      onAction={snackbar.onAction}
      onClose={dismissWCPRichSnackbar}
      duration={snackbar.duration}
      position={snackbar.position}
    />
  );
};

RichSnackbarContainer.displayName = 'RichSnackbarContainer';
