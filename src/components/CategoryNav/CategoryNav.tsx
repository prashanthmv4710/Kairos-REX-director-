// @refresh reset

/**
 * @module CategoryNav
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
 * For prop API + usage notes, read `CategoryNav.md` in this folder
 * or run `npm run ld-kit -- show CategoryNav`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {ChevronDownIcon} from '../Icons/Icons';
import './CategoryNav.css';

export interface CategoryNavItem {
  /** Display label */
  label: string;
  /** Link destination */
  href?: string;
  /** Optional icon element */
  icon?: React.ReactNode;
  /** Render with bold weight (used for Departments, Services, More) */
  bold?: boolean;
  /** Render a trailing chevron-down to signal a dropdown menu */
  chevron?: boolean;
  /** Push this item to the right edge of the nav strip (typically `More`). */
  pushRight?: boolean;
}

export interface CategoryNavProps
  extends Omit<React.ComponentPropsWithoutRef<'nav'>, 'className' | 'style'> {
  /** All navigation items displayed in a single flat row */
  items?: CategoryNavItem[];
  /** Currently active item label */
  activeItem?: string;
  /**
   * Label of the currently expanded chevron item. Pass the label returned by
   * `onItemClick` to open the corresponding dropdown; pass `undefined` to
   * collapse all. Only meaningful for items with `chevron: true`.
   */
  expandedItem?: string;
  /** Click handler for nav items */
  onItemClick?: (label: string) => void;
  /** Click handler for the mobile browse button (replaces Departments/Services) */
  onBrowseClick?: () => void;
  /** Href for the mobile browse button */
  browseHref?: string;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

const DEFAULT_ITEMS: CategoryNavItem[] = [
  { label: 'Departments', href: '#', bold: true, chevron: true },
  { label: 'Services', href: '#', bold: true, chevron: true },
  { label: 'Get it Fast', href: '#' },
  { label: 'Rollbacks & More', href: '#' },
  { label: 'Pharmacy', href: '#' },
  { label: 'New Arrivals', href: '#' },
  { label: 'Dinner Made Easy', href: '#' },
  { label: 'Walmart+', href: '#' },
  { label: 'More', href: '#', bold: true, chevron: true, pushRight: true },
];

function GridIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1" />
      <rect x="11" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1" />
      <rect x="1.5" y="11" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1" />
      <rect x="11" y="11" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/**
 * CategoryNav — Horizontal category/department navigation strip.
 *
 * Sits below the main header on the Walmart homepage. Renders pill-shaped
 * chips on a light-blue surface. On mobile, the bold items (Departments,
 * Services, More) are hidden and replaced by a single grid-icon browse button.
 *
 * **Accessibility — `aria-label`:** The `<nav>` defaults to
 * `aria-label="Category navigation"`. Always override this with a label that
 * describes the specific surface (e.g. `aria-label="Department navigation"` or
 * `aria-label="Grocery categories"`). Every landmark on a page must have a
 * unique label so screen reader users can distinguish them in the landmark list.
 */
export function CategoryNav(props: CategoryNavProps) {
  const {
    items = DEFAULT_ITEMS,
    activeItem,
    expandedItem,
    onItemClick,
    onBrowseClick,
    browseHref = '#',
    className,
    ...rest
  } = applyCommonProps(props);

  const handleItemClick = (label: string, e: React.MouseEvent) => {
    if (onItemClick) {
      e.preventDefault();
      onItemClick(label);
    }
  };

  const handleBrowseClick = (e: React.MouseEvent) => {
    if (onBrowseClick) {
      e.preventDefault();
      onBrowseClick();
    }
  };

  return (
    <nav
      aria-label="Category navigation"
      className={cx('ld-category-nav-root', className)}
      {...(rest as any)}
    >
      <a
        href={browseHref}
        className="ld-category-nav-browse"
        aria-label="Browse all departments"
        onClick={handleBrowseClick}
      >
        <GridIcon />
      </a>

      {/* role="list" prevents Safari from stripping list semantics when display:contents is applied */}
      <ul role="list" className="ld-category-nav-list">
        {items.map((item) => {
          const itemClass = cx(
            'ld-category-nav-item',
            item.bold ? 'ld-category-nav-item-bold' : undefined,
            item.pushRight ? 'ld-category-nav-item-push-right' : undefined,
            activeItem === item.label ? 'ld-category-nav-item-active' : undefined,
          );
          const iconSlot = item.icon && (
            <span className="ld-category-nav-item-icon" aria-hidden="true">{item.icon}</span>
          );

          return (
            <li key={item.label} className="ld-category-nav-list-item">
              {item.chevron ? (
                <button
                  type="button"
                  className={itemClass}
                  aria-expanded={expandedItem === item.label}
                  aria-current={activeItem === item.label ? 'page' : undefined}
                  onClick={(e) => handleItemClick(item.label, e as any)}
                >
                  {iconSlot}
                  {item.label}
                  <ChevronDownIcon
                    decorative
                    className="ld-category-nav-item-chevron"
                    style={{fontSize: 14, marginLeft: 4}}
                  />
                </button>
              ) : (
                <a
                  href={item.href || '#'}
                  className={itemClass}
                  aria-current={activeItem === item.label ? 'page' : undefined}
                  onClick={(e) => handleItemClick(item.label, e)}
                >
                  {iconSlot}
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
CategoryNav.displayName = 'CategoryNav';
