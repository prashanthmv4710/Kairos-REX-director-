'use client';
// @refresh reset

/**
 * @module SectionHeader
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
 * For prop API + usage notes, read `SectionHeader.md` in this folder
 * or run `npm run ld-kit -- show SectionHeader`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {Divider} from '../Divider/Divider';
import {ChevronUpIcon, ChevronDownIcon} from '../Icons/Icons';
import {LinkButton} from '../LinkButton/LinkButton';
import './SectionHeader.css';

export type SectionHeaderSize = 'large' | 'small';
export type SectionHeaderTrailing = 'none' | 'link' | 'chevron';

export interface SectionHeaderProps {
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
  /**
   * The size of the section header. Controls the title typography.
   * - `large` uses heading/medium (20px Bold)
   * - `small` uses heading/small (18px Bold)
   *
   * @default "large"
   */
  size?: SectionHeaderSize;
  /**
   * The title text of the section header.
   */
  title: string;
  /**
   * Heading level rendered for the title. Defaults to `h2`, which is correct
   * for most page sections. Use `h3`–`h6` when nested inside another heading,
   * or `h1` only when this is the primary page title. Rendering a real heading
   * keeps the title in the document outline for assistive technology.
   *
   * @default "h2"
   */
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /**
   * An optional numeric count displayed next to the title in parentheses, e.g. (5).
   */
  count?: number;
  /**
   * An optional description rendered below the title row.
   */
  description?: string;
  /**
   * The trailing affordance type.
   * - `none` — no trailing content
   * - `link` — renders a LinkButton; requires `trailingLabel` and `onTrailingClick`
   * - `chevron` — renders a chevron toggle for expand/collapse; use with `expanded` and `onExpandChange`
   *
   * @default "none"
   */
  trailing?: SectionHeaderTrailing;
  /**
   * The label for the trailing LinkButton. Only used when `trailing="link"`.
   */
  trailingLabel?: string;
  /**
   * Callback for the trailing LinkButton click. Only used when `trailing="link"`.
   */
  onTrailingClick?: () => void;
  /**
   * Whether the section is expanded. Only used when `trailing="chevron"`.
   *
   * @default true
   */
  expanded?: boolean;
  /**
   * Callback fired when the user toggles the chevron. Only used when `trailing="chevron"`.
   */
  onExpandChange?: (expanded: boolean) => void;
  /**
   * Whether to render a Divider below the section header.
   *
   * @default true
   */
  divider?: boolean;
}

/**
 * SectionHeader — AX section header with title, optional count, description,
 * and configurable trailing (link button or expand/collapse chevron).
 *
 * Two sizes: `large` (heading/medium, 20px) and `small` (heading/small, 18px).
 */
export function SectionHeader({
  UNSAFE_className,
  UNSAFE_style,
  size = 'large',
  title,
  headingLevel = 'h2',
  count,
  description,
  trailing = 'none',
  trailingLabel = 'Button label',
  onTrailingClick,
  expanded = true,
  onExpandChange,
  divider = true,
}: SectionHeaderProps) {
  const isChevron = trailing === 'chevron';
  const isLink = trailing === 'link';
  const Heading = headingLevel;

  return (
    <div
      className={cx('ld-section-header', `ld-section-header--${size}`, UNSAFE_className)}
      style={UNSAFE_style}
    >
      {/* Content row with 16px horizontal padding */}
      <div className="ld-section-header__content">
        <div className="ld-section-header__inner">
          {/* Title row: title+count + trailing */}
          <div className="ld-section-header__title-row">
            {/* Title and count */}
            <div className="ld-section-header__title-group">
              <Heading className="ld-section-header__title">{title}</Heading>
              {count !== undefined && (
                <span className="ld-section-header__count">({count})</span>
              )}
            </div>

            {/* Trailing */}
            {isLink && (
              <LinkButton
                size="small"
                onClick={onTrailingClick}
                aria-label={`${trailingLabel}: ${title}`}
              >
                {trailingLabel}
              </LinkButton>
            )}
            {isChevron && (
              <button
                type="button"
                className="ld-section-header__chevron-btn"
                aria-expanded={expanded}
                aria-label={title}
                onClick={() => onExpandChange?.(!expanded)}
              >
                {expanded
                  ? <ChevronUpIcon size="medium" decorative />
                  : <ChevronDownIcon size="medium" decorative />}
              </button>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="ld-section-header__description">{description}</p>
          )}
        </div>
      </div>

      {/* Bottom padding */}
      <div className="ld-section-header__bottom-pad" />

      {/* Divider */}
      {divider && <Divider />}
    </div>
  );
}

SectionHeader.displayName = 'SectionHeader';
