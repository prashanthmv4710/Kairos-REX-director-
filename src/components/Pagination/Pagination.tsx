'use client';
// @refresh reset

/**
 * @module Pagination
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
 * For prop API + usage notes, read `Pagination.md` in this folder
 * or run `npm run ld-kit -- show Pagination`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps, type CommonProps} from '../../common/helpers';
import './Pagination.css';

// ---------------------------------------------------------------------------
// Inline SVG Icons
// ---------------------------------------------------------------------------

const ChevronLeft: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const MoreHorizontal: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="6" cy="12" r="1.5" />
    <circle cx="18" cy="12" r="1.5" />
  </svg>
);

// ---------------------------------------------------------------------------
// Pagination (nav wrapper)
// ---------------------------------------------------------------------------

export interface PaginationProps extends CommonProps {
  children?: React.ReactNode;
  /**
   * Accessible label for the navigation landmark.
   * When multiple Pagination components appear on a page, pass a unique label
   * (e.g. "Search results pagination") so landmarks are distinguishable.
   * @default "Pagination"
   */
  navigationLabel?: string;
}

export const Pagination: React.FunctionComponent<PaginationProps> = (props) => {
  const {className, children, navigationLabel = 'Pagination', ...rest} = applyCommonProps(props) as PaginationProps & {className?: string};

  return (
    <nav
      role="navigation"
      aria-label={navigationLabel}
      className={cx('ld-pagination-nav', className)}
      {...rest}
    >
      {children}
    </nav>
  );
};

Pagination.displayName = 'Pagination';

// ---------------------------------------------------------------------------
// PaginationContent (ul)
// ---------------------------------------------------------------------------

export interface PaginationContentProps extends CommonProps {
  children?: React.ReactNode;
}

export const PaginationContent: React.FunctionComponent<PaginationContentProps> = (props) => {
  const {className, children, ...rest} = applyCommonProps(props);

  return (
    <ul className={cx('ld-pagination-content', className)} {...rest}>
      {children}
    </ul>
  );
};

PaginationContent.displayName = 'PaginationContent';

// ---------------------------------------------------------------------------
// PaginationItem (li)
// ---------------------------------------------------------------------------

export interface PaginationItemProps extends CommonProps {
  children?: React.ReactNode;
}

export const PaginationItem: React.FunctionComponent<PaginationItemProps> = (props) => {
  const {className, children, ...rest} = applyCommonProps(props);

  return (
    <li className={cx('ld-pagination-item', className)} {...rest}>
      {children}
    </li>
  );
};

PaginationItem.displayName = 'PaginationItem';

// ---------------------------------------------------------------------------
// PaginationLink (a)
// ---------------------------------------------------------------------------

export interface PaginationLinkProps extends CommonProps {
  isActive?: boolean;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  children?: React.ReactNode;
}

export const PaginationLink: React.FunctionComponent<PaginationLinkProps> = (props) => {
  const {className, isActive, children, ...rest} = applyCommonProps(props);

  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      className={cx(
        'ld-pagination-link',
        isActive && 'ld-pagination-link--active',
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
};

PaginationLink.displayName = 'PaginationLink';

// ---------------------------------------------------------------------------
// PaginationPrevious
// ---------------------------------------------------------------------------

export interface PaginationPreviousProps extends CommonProps {
  href?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export const PaginationPrevious: React.FunctionComponent<PaginationPreviousProps> = (props) => {
  const {className, ...rest} = applyCommonProps(props);

  return (
    <PaginationLink
      aria-label="Go to previous page"
      UNSAFE_className={cx('ld-pagination-prev-next', className)}
      {...rest}
    >
      <ChevronLeft />
      <span>Previous</span>
    </PaginationLink>
  );
};

PaginationPrevious.displayName = 'PaginationPrevious';

// ---------------------------------------------------------------------------
// PaginationNext
// ---------------------------------------------------------------------------

export interface PaginationNextProps extends CommonProps {
  href?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export const PaginationNext: React.FunctionComponent<PaginationNextProps> = (props) => {
  const {className, ...rest} = applyCommonProps(props);

  return (
    <PaginationLink
      aria-label="Go to next page"
      UNSAFE_className={cx('ld-pagination-prev-next', className)}
      {...rest}
    >
      <span>Next</span>
      <ChevronRight />
    </PaginationLink>
  );
};

PaginationNext.displayName = 'PaginationNext';

// ---------------------------------------------------------------------------
// PaginationEllipsis
// ---------------------------------------------------------------------------

export interface PaginationEllipsisProps extends CommonProps {
  children?: React.ReactNode;
}

export const PaginationEllipsis: React.FunctionComponent<PaginationEllipsisProps> = (props) => {
  const {className, ...rest} = applyCommonProps(props);

  return (
    <span
      aria-hidden
      className={cx('ld-pagination-ellipsis', className)}
      {...rest}
    >
      <MoreHorizontal />
      <span className="ld-pagination-sr-only">More pages</span>
    </span>
  );
};

PaginationEllipsis.displayName = 'PaginationEllipsis';
