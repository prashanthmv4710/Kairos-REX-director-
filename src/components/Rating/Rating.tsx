// @refresh reset

/**
 * @module Rating
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
 * For prop API + usage notes, read `Rating.md` in this folder
 * or run `npm run ld-kit -- show Rating`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps, invariant} from '../../common/helpers';
import {emit} from '../../common/helpers';
import {announce} from '../../common/announce';
import {StarFillIcon, StarIcon as StarOutlineIcon} from '../Icons/Icons';
import './Rating.css';

export type RatingSize = 'small' | 'medium';

export interface RatingProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style' | 'onChange'> {
  value?: number;
  /** @default 0 */
  defaultValue?: number;
  onChange?: (value: number) => void;
  /** @default 'medium' */
  size?: RatingSize;
  /** @default false */
  disabled?: boolean;
  'aria-label'?: string;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

const LABELS: Record<number, string> = {
  0: 'Unrated',
  1: 'Very poor',
  2: 'Poor',
  3: 'Fair',
  4: 'Good',
  5: 'Excellent',
};

/**
 * Single star glyph. Filled state uses the LD `StarFill` icon colored by
 * `--ld-semantic-color-rating-fill`; empty/unfilled uses the outlined `Star`
 * icon colored by `--ld-semantic-color-rating-border`. Both are font glyphs,
 * so no inline SVG path duplication and no raw hex colors.
 */
function StarMark({filled, hovered}: {filled: boolean; hovered: boolean}) {
  const isHighlighted = filled || hovered;
  return isHighlighted ? (
    <StarFillIcon decorative className="ld-wcp-rating-star-filled" />
  ) : (
    <StarOutlineIcon decorative className="ld-wcp-rating-star-empty" />
  );
}

export const Rating = React.forwardRef<HTMLDivElement, RatingProps>((props, ref) => {
  const {value: controlledValue, defaultValue = 0, onChange, size = 'medium', disabled = false, 'aria-label': ariaLabelProp, className, ...rest} = applyCommonProps(props);

  invariant(
    ariaLabelProp === undefined || (typeof ariaLabelProp === 'string' && ariaLabelProp.trim().length > 0),
    '`Rating` accessibility violation. If `aria-label` is provided it must be a non-empty string. Omit it to use the default "Star rating" label.',
  );

  const ariaLabel = ariaLabelProp && ariaLabelProp.trim().length > 0 ? ariaLabelProp : 'Star rating';

  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const value = isControlled ? controlledValue! : internalValue;
  // Hover and keyboard-focus produce the same visual preview but only the
  // explicit click/Enter/Space commits a new `value`. Both are tracked here
  // so sighted mouse and sighted keyboard users get identical affordances.
  const [hoverValue, setHoverValue] = React.useState(0);
  const [focusValue, setFocusValue] = React.useState(0);
  const previewValue = hoverValue > 0 ? hoverValue : focusValue;
  const displayValue = previewValue > 0 ? previewValue : value;

  // Roving tabindex: per WAI-ARIA radiogroup authoring practice, only the
  // selected radio (or the first radio if nothing is selected) sits in the
  // Tab sequence. Arrow keys move focus and selection inside the group.
  const buttonRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const activeStar = value > 0 ? value : 1;

  const commit = (next: number) => {
    if (!isControlled) setInternalValue(next);
    emit('ui:rating:change', {value: next, previous: value});
    onChange?.(next);
    announce(`${next} star${next !== 1 ? 's' : ''}, ${LABELS[next] ?? ''}`, {priority: 'polite'});
  };

  const handleClick = (star: number) => {
    if (disabled) return;
    commit(star);
  };

  const focusStar = (star: number) => {
    const idx = Math.max(1, Math.min(5, star)) - 1;
    buttonRefs.current[idx]?.focus();
  };

  const handleMouseEnter = (star: number) => { if (!disabled) setHoverValue(star); };
  const handleMouseLeave = () => { setHoverValue(0); };

  const handleKeyDown = (e: React.KeyboardEvent, star: number) => {
    if (disabled) return;
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleClick(star);
        return;
      case 'ArrowRight':
      case 'ArrowDown': {
        e.preventDefault();
        const next = star >= 5 ? 1 : star + 1;
        commit(next);
        focusStar(next);
        return;
      }
      case 'ArrowLeft':
      case 'ArrowUp': {
        e.preventDefault();
        const next = star <= 1 ? 5 : star - 1;
        commit(next);
        focusStar(next);
        return;
      }
      case 'Home':
        e.preventDefault();
        commit(1);
        focusStar(1);
        return;
      case 'End':
        e.preventDefault();
        commit(5);
        focusStar(5);
        return;
      default:
        return;
    }
  };

  return (
    <div
      ref={ref}
      className={cx('ld-wcp-rating-rating', `ld-wcp-rating-${size}`, disabled && 'ld-wcp-rating-disabled', className)}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      <div role="radiogroup" aria-label={ariaLabel} aria-disabled={disabled} className="ld-wcp-rating-stars">
        {Array.from({length: 5}, (_, i) => {
          const star = i + 1;
          const filled = star <= value;
          const previewing = previewValue > 0 && star <= previewValue;
          const isSelected = star === value;
          const isTabStop = star === activeStar;
          const meaning = LABELS[star] ?? `${star} stars`;
          return (
            <button
              key={star}
              ref={(el) => { buttonRefs.current[i] = el; }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              // Include the meaning ("Good", "Excellent", …) so screen-reader
              // users hear the rating's intent, not just the star count.
              aria-label={`${star} star${star !== 1 ? 's' : ''}, ${meaning}`}
              disabled={disabled}
              tabIndex={disabled ? -1 : (isTabStop ? 0 : -1)}
              onClick={() => handleClick(star)}
              onMouseEnter={() => handleMouseEnter(star)}
              onFocus={() => { if (!disabled) setFocusValue(star); }}
              onBlur={() => setFocusValue(0)}
              onKeyDown={(e) => handleKeyDown(e, star)}
              className="ld-wcp-rating-starBtn"
            >
              <StarMark filled={filled} hovered={previewing} />
            </button>
          );
        })}
      </div>
      {/* Visible label tracks the sighted hover/focus preview; hidden from
          AT to avoid duplicate announcements. */}
      <span aria-hidden="true" className="ld-wcp-rating-label">
        {LABELS[displayValue] ?? LABELS[0]}
      </span>
    </div>
  );
});

Rating.displayName = 'Rating';
