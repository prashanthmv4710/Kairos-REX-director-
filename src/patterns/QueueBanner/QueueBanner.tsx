// @refresh reset

/**
 * @module QueueBanner
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
 * For prop API + usage notes, read `QueueBanner.md` in this folder
 * or run `npm run ld-kit -- show QueueBanner`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {ExclamationCircleIcon, CloseIcon, ChevronRightIcon} from '../../components/Icons';
import {TimerView, TimerViewVariant} from '../../components/TimerView';
import './QueueBanner.css';

export type QueueBannerVariant = 'lineJoined' | 'warning' | 'checkout' | 'error';

const TIMER_VARIANT_MAP: Record<string, TimerViewVariant> = {
  lineJoined: 'waiting',
  warning: 'warning',
  checkout: 'warning',
  error: 'expiring',
};

export interface QueueBannerProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  variant: QueueBannerVariant;
  timeDisplay?: string;
  endTime?: Date | number | string;
  message?: string;
  snackbarText?: string;
  productImage?: string;
  onView?: () => void;
  onLeave?: () => void;
  onClose?: () => void;
  onAction?: () => void;
  inline?: boolean;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

export const QueueBanner: React.FunctionComponent<QueueBannerProps> = (props) => {
  const {variant, timeDisplay, endTime, message, snackbarText, productImage, onView, onLeave, onClose, onAction, inline, className, ...rest} = applyCommonProps(props);
  const [snackbarVisible, setSnackbarVisible] = React.useState(!!snackbarText);
  const timerVariant = TIMER_VARIANT_MAP[variant] || 'waiting';

  if (variant === 'error') {
    return (
      <div className={cx('ld-wcp-queuebanner-errorBanner', className)} {...rest}>
        <span className="ld-wcp-queuebanner-errorIcon"><ExclamationCircleIcon size="medium" /></span>
        <span className="ld-wcp-queuebanner-errorMessage">{message || 'Something went wrong'}</span>
      </div>
    );
  }

  if (variant === 'checkout') {
    return (
      <div className={cx('ld-wcp-queuebanner-checkoutBanner', className)} {...rest}>
        <div className="ld-wcp-queuebanner-checkoutContent">
          <div className="ld-wcp-queuebanner-checkoutInfo">
            {(timeDisplay || endTime) && <TimerView timeDisplay={timeDisplay} endTime={endTime} variant={timerVariant} size="small" />}
            {message && <span className="ld-wcp-queuebanner-checkoutMessage">{message}</span>}
          </div>
          {onClose && (
            <button type="button" className="ld-wcp-queuebanner-checkoutCloseBtn" onClick={onClose} aria-label="Close">
              <CloseIcon size="small" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // lineJoined / warning
  return (
    <div className={cx('ld-wcp-queuebanner-wrapper', className)} {...rest}>
      {snackbarVisible && snackbarText && (
        <div className="ld-wcp-queuebanner-snackbar">
          <div className="ld-wcp-queuebanner-snackbarContent">
            <span className="ld-wcp-queuebanner-snackbarText">{snackbarText}</span>
          </div>
          <div className="ld-wcp-queuebanner-snackbarActions">
            {onView && <button type="button" className="ld-wcp-queuebanner-snackbarActionBtn" onClick={onView}>View</button>}
            <button type="button" className="ld-wcp-queuebanner-snackbarCloseBtn" onClick={() => setSnackbarVisible(false)} aria-label="Close">
              <CloseIcon size="small" />
            </button>
          </div>
        </div>
      )}
      <div className="ld-wcp-queuebanner-bannerContainer">
        <div className="ld-wcp-queuebanner-bannerBar">
          <div className="ld-wcp-queuebanner-barContents">
            <div className="ld-wcp-queuebanner-infoGroup">
              {productImage ? (
                <img src={productImage} alt="" className="ld-wcp-queuebanner-productThumb" />
              ) : (
                <div className="ld-wcp-queuebanner-productPlaceholder" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                    <path d="M3 16l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
              {(timeDisplay || endTime) && <TimerView timeDisplay={timeDisplay} endTime={endTime} variant={timerVariant} size="small" />}
              {message && <span className="ld-wcp-queuebanner-reservationText">{message}</span>}
            </div>
            <div className="ld-wcp-queuebanner-actionGroup">
              <div className="ld-wcp-queuebanner-linkGroup">
                {onView && <button type="button" className="ld-wcp-queuebanner-linkBtn" onClick={onView}>View</button>}
                {onView && onLeave && <span className="ld-wcp-queuebanner-divider" />}
                {onLeave && <button type="button" className="ld-wcp-queuebanner-linkBtn" onClick={onLeave}>Leave</button>}
              </div>
              {onAction && (
                <button type="button" className="ld-wcp-queuebanner-chevronBtn" onClick={onAction} aria-label="Go">
                  <ChevronRightIcon size="small" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
QueueBanner.displayName = 'QueueBanner';
