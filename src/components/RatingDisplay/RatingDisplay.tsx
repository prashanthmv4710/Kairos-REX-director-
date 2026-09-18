// @refresh reset

/**
 * @module RatingDisplay
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
 * For prop API + usage notes, read `RatingDisplay.md` in this folder
 * or run `npm run ld-kit -- show RatingDisplay`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {StarFillIcon, StarIcon} from '../Icons/Icons';
import './RatingDisplay.css';

export type RatingDisplaySize = 'small' | 'medium';
export type RatingDisplayColor = 'default' | 'inverse';

export interface RatingDisplayProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  value?: number;
  size?: RatingDisplaySize;
  color?: RatingDisplayColor;
  count?: string;
  linkText?: string;
  linkHref?: string;
  onLinkClick?: (e: React.MouseEvent) => void;
  text?: string;
  'aria-label'?: string;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

export const RatingDisplay: React.FunctionComponent<RatingDisplayProps> = (props) => {
  const {value = 0, size = 'small', color = 'default', count, linkText, linkHref, onLinkClick, text, 'aria-label': ariaLabel, className, ...rest} = applyCommonProps(props);
  const isInverse = color === 'inverse';
  const hasContent = count || linkText || text;
  const clamped = Math.max(0, Math.min(5, value));
  const wholeStars = Math.floor(clamped);
  // Round the announced value to one decimal so it matches the number of
  // rendered whole stars without misleading screen-reader users. A value
  // of 4.7 still renders 4 filled stars; the aria-label says "4.7 out of 5"
  // which is honest, but we anchor the integer prefix to wholeStars.
  const announcedValue = Number.isInteger(clamped) ? clamped : clamped.toFixed(1);

  return (
    <div
      className={cx(
        'ld-wcp-ratingdisplay-wrapper',
        size === 'small' && 'ld-wcp-ratingdisplay-wrapperSmall',
        size === 'medium' && 'ld-wcp-ratingdisplay-wrapperMedium',
        isInverse && 'ld-wcp-ratingdisplay-wrapperInverse',
        className,
      )}
      {...rest}
    >
      <span
        className="ld-wcp-ratingdisplay-stars"
        role="img"
        aria-label={ariaLabel || `Rating: ${announcedValue} out of 5 stars`}
      >
        {Array.from({length: 5}, (_, i) =>
          i < wholeStars ? (
            <StarFillIcon key={i} decorative className="ld-wcp-ratingdisplay-starFilled" />
          ) : (
            <StarIcon key={i} decorative className="ld-wcp-ratingdisplay-starEmpty" />
          ),
        )}
      </span>
      {hasContent && (
        <div className="ld-wcp-ratingdisplay-content">
          {(count || linkText) && (
            <span className="ld-wcp-ratingdisplay-leftGroup">
              {count && <span className="ld-wcp-ratingdisplay-count">{count}</span>}
              {linkText && (
                // No aria-label — the link's text content is its accessible
                // name; an aria-label that mirrors the text causes duplicate
                // announcements on some screen readers.
                <a href={linkHref ?? '#'} className="ld-wcp-ratingdisplay-link" onClick={onLinkClick}>
                  {linkText}
                </a>
              )}
            </span>
          )}
          {(count || linkText) && text && (
            <span className="ld-wcp-ratingdisplay-pipe" aria-hidden="true">|</span>
          )}
          {text && <span className="ld-wcp-ratingdisplay-text">{text}</span>}
        </div>
      )}
    </div>
  );
};
RatingDisplay.displayName = 'RatingDisplay';
