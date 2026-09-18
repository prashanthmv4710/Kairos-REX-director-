// @refresh reset

/**
 * @module QueueCard
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
 * For prop API + usage notes, read `QueueCard.md` in this folder
 * or run `npm run ld-kit -- show QueueCard`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps, invariant} from '../../common/helpers';
import {TimerView, TimerViewVariant} from '../../components/TimerView';
import './QueueCard.css';

export interface QueueCardProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  image?: string;
  description?: string;
  price: string;
  originalPrice?: string;
  timeDisplay?: string;
  endTime?: Date | number | string;
  timerVariant?: TimerViewVariant;
  timerLabel?: string;
  productImageAlt?: string;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

export const QueueCard: React.FunctionComponent<QueueCardProps> = (props) => {
  const {image, description, price, originalPrice, timeDisplay = '57mins', endTime, timerVariant = 'waiting', timerLabel, productImageAlt, className, ...rest} = applyCommonProps(props);
  const defaultLabel = timerVariant === 'waiting' ? 'estimated wait' : 'left to buy';
  const label = timerLabel ?? defaultLabel;
  invariant(
    !image || !!(productImageAlt || description),
    '`QueueCard` accessibility violation. When `image` is provided, either `productImageAlt` or `description` must be set so the image has a meaningful alt.',
  );
  const imgAlt = productImageAlt || description || '';

  return (
    <div className={cx('ld-wcp-queuecard-card', className)} {...rest}>
      <div className="ld-wcp-queuecard-content">
        <div className="ld-wcp-queuecard-timerRow">
          <TimerView timeDisplay={timeDisplay} endTime={endTime} variant={timerVariant} size="small" />
          <span className="ld-wcp-queuecard-timerLabel">{label}</span>
        </div>
        <div className="ld-wcp-queuecard-productRow">
          {image ? (
            <img src={image} alt={imgAlt} className="ld-wcp-queuecard-productImage" />
          ) : (
            <div className="ld-wcp-queuecard-productPlaceholder" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                <path d="M3 16l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
          <div className="ld-wcp-queuecard-descriptionBlock">
            {description && <span className="ld-wcp-queuecard-description">{description}</span>}
          </div>
          <div className="ld-wcp-queuecard-pricing">
            <span className="ld-wcp-queuecard-price">{price}</span>
            {originalPrice && <span className="ld-wcp-queuecard-originalPrice">{originalPrice}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
QueueCard.displayName = 'QueueCard';
