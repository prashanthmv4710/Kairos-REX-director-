'use client';
// @refresh reset

/**
 * @module TablePagination
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
 * For prop API + usage notes, read `TablePagination.md` in this folder
 * or run `npm run ld-kit -- show TablePagination`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps, type CommonProps, useStableId} from '../../common/helpers';
import {Body} from '../../components/Text/Text';
import {Select} from '../../components/Select/Select';
import {TextField} from '../../components/TextField/TextField';
import {VisuallyHidden} from '../../components/VisuallyHidden';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../components/Pagination/Pagination';

// ---------------------------------------------------------------------------
// Page-window helper
// ---------------------------------------------------------------------------

const DOTS = 'dots' as const;
type PageToken = number | typeof DOTS;

/**
 * Builds the windowed list of page tokens shown in the numbered control.
 *
 * Mirrors the PX spec: short ranges render every page; long ranges show a
 * leading or trailing run of pages with a single ellipsis and the boundary
 * page (e.g. `1 2 3 4 5 … 10`, `1 … 6 7 8 9 10`, `1 … 4 5 6 … 10`).
 */
export function getPaginationRange(page: number, pageCount: number): PageToken[] {
  if (pageCount <= 7) {
    return Array.from({length: pageCount}, (_, i) => i + 1);
  }

  if (page <= 4) {
    return [1, 2, 3, 4, 5, DOTS, pageCount];
  }

  if (page >= pageCount - 3) {
    return [1, DOTS, pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
  }

  return [1, DOTS, page - 1, page, page + 1, DOTS, pageCount];
}

function clampPage(value: number, pageCount: number): number {
  if (Number.isNaN(value)) return 1;
  return Math.min(Math.max(Math.round(value), 1), Math.max(pageCount, 1));
}

// ---------------------------------------------------------------------------
// TablePagination
// ---------------------------------------------------------------------------

export interface TablePaginationProps extends CommonProps {
  /**
   * The current page, 1-based.
   */
  page: number;
  /**
   * The total number of pages.
   */
  pageCount: number;
  /**
   * The number of rows shown per page.
   */
  pageSize: number;
  /**
   * The total number of rows across all pages — drives the range readout.
   */
  totalItems: number;
  /**
   * The selectable page sizes shown in the "Items per page" select.
   *
   * @default [10, 25, 50, 100]
   */
  pageSizeOptions?: number[];
  /**
   * The callback fired when the user requests a different page.
   */
  onPageChange: (page: number) => void;
  /**
   * The callback fired when the user changes the page size.
   */
  onPageSizeChange: (pageSize: number) => void;
  /**
   * The label shown beside the page-size select.
   *
   * @default "Items per page"
   */
  itemsPerPageLabel?: string;
  /**
   * Hide the left-hand items-per-page + range cluster.
   *
   * @default false
   */
  hidePageSize?: boolean;
  /**
   * Hide the right-hand "Page N of M" jump field.
   *
   * @default false
   */
  hidePageJump?: boolean;
  /**
   * Accessible label for the pagination navigation landmark.
   * Pass a unique value when multiple TablePagination instances share a page.
   * @default "Table pagination"
   */
  navigationLabel?: string;
}

/**
 * Table Pagination is the footer pattern that sits below a Data Table or any
 * paged result set. It composes Select (items per page), Pagination (numbered
 * navigation), and a label-less Text Field (jump to page) into the standard
 * PX layout: page-size + range on the left, page navigation on the right.
 */
export const TablePagination: React.FunctionComponent<TablePaginationProps> = (props) => {
  const {
    className,
    page,
    pageCount,
    pageSize,
    totalItems,
    pageSizeOptions = [10, 25, 50, 100],
    onPageChange,
    onPageSizeChange,
    itemsPerPageLabel = 'Items per page',
    hidePageSize = false,
    hidePageJump = false,
    navigationLabel = 'Table pagination',
    ...rest
  } = applyCommonProps(props);

  const styleId = useStableId();
  const safePage = clampPage(page, pageCount);

  // The jump field is a free-text buffer that only commits on Enter/blur so the
  // user can clear and retype without the table jumping on every keystroke.
  const [pageDraft, setPageDraft] = React.useState(String(safePage));
  React.useEffect(() => {
    setPageDraft(String(safePage));
  }, [safePage]);

  const commitPageDraft = React.useCallback(() => {
    const next = clampPage(parseInt(pageDraft, 10), pageCount);
    setPageDraft(String(next));
    if (next !== safePage) onPageChange(next);
  }, [pageDraft, pageCount, safePage, onPageChange]);

  const goToPage = (next: number) => {
    const clamped = clampPage(next, pageCount);
    if (clamped !== safePage) onPageChange(clamped);
  };

  const rangeStart = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const rangeEnd = Math.min(safePage * pageSize, totalItems);

  const isFirst = safePage <= 1;
  const isLast = safePage >= pageCount;

  const pages = getPaginationRange(safePage, pageCount);

  // The Select and Text Field carry visually-hidden labels for accessibility;
  // the visible text labels sit beside them per the spec. Neutralize the form
  // label margins so the controls align on the row's center line.
  const scopedCss = `
    .ld-tablepagination .ld-select-label,
    .ld-tablepagination .ld-textfield-label { margin-bottom: 0; }
    /* The Pagination nav declares container-type: inline-size, which collapses
       its width to ~0 inside this flex row and makes the page links overlap.
       Reset containment so the nav sizes to its content. */
    .ld-tablepagination .ld-pagination-nav {
      margin: 0;
      width: auto;
      flex-shrink: 0;
      container-type: normal;
      justify-content: flex-start;
    }
    .ld-tablepagination .ld-pagination-content { gap: 6px; flex-wrap: nowrap; }
    /* Match the items-per-page Select to the 32px xsmall jump field. */
    .ld-tablepagination .ld-select-small .ld-select-value {
      padding-top: 0.375rem;
      padding-bottom: 0.375rem;
    }
    /* Re-center the caret after shrinking the field — its fixed top offset was
       tuned for the taller 40px small size. */
    .ld-tablepagination .ld-select-small .ld-select-trailingIcon {
      top: 50%;
      transform: translateY(-50%);
    }
    /* Prev/next are icon-only in the PX table footer — keep the accessible
       label for screen readers, hide the visible "Previous"/"Next" text. */
    .ld-tablepagination .ld-pagination-prev-next { padding: 0; min-width: 36px; }
    .ld-tablepagination .ld-pagination-prev-next > span { display: none; }
    /* Active page is a circular outline rather than a boxed chip. */
    .ld-tablepagination .ld-pagination-link--active {
      border-radius: 9999px;
      border-color: var(--ld-semantic-color-text, #2e2f32);
      background: transparent;
    }
    .ld-tablepagination .ld-pagination-link--active:hover {
      background: var(--ld-semantic-color-fill-hovered, #f1f1f2);
    }
  `;

  return (
    <div
      className={cx('ld-tablepagination', className)}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        rowGap: 12,
        width: '100%',
        minWidth: 0,
      }}
      {...rest}
    >
      <style id={styleId}>{scopedCss}</style>

      {!hidePageSize && (
        <div style={{display: 'flex', alignItems: 'center', gap: 12, minWidth: 0}}>
          <Body as="span" size="small" weight="alt" style={{whiteSpace: 'nowrap'}}>
            {itemsPerPageLabel}
          </Body>

          <div style={{width: 88}}>
            <Select
              label={<VisuallyHidden>{itemsPerPageLabel}</VisuallyHidden>}
              size="small"
              value={String(pageSize)}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>

          <Body as="span" size="small" color="subtle" style={{whiteSpace: 'nowrap'}}>
            {rangeStart.toLocaleString()}&ndash;{rangeEnd.toLocaleString()} of{' '}
            {totalItems.toLocaleString()}
          </Body>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          minWidth: 0,
          flexWrap: 'wrap',
          marginLeft: 'auto',
        }}
      >
        <Pagination navigationLabel={navigationLabel}>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={isFirst}
                UNSAFE_style={isFirst ? {pointerEvents: 'none', opacity: 0.4} : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  if (!isFirst) goToPage(safePage - 1);
                }}
              />
            </PaginationItem>

            {pages.map((token, index) =>
              token === DOTS ? (
                <PaginationItem key={`dots-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={token}>
                  <PaginationLink
                    href="#"
                    isActive={token === safePage}
                    aria-label={`Go to page ${token}`}
                    onClick={(event) => {
                      event.preventDefault();
                      goToPage(token);
                    }}
                  >
                    {token}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={isLast}
                UNSAFE_style={isLast ? {pointerEvents: 'none', opacity: 0.4} : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  if (!isLast) goToPage(safePage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        {!hidePageJump && (
          <div style={{display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0}}>
            <Body as="span" size="small" weight="alt" style={{whiteSpace: 'nowrap'}}>
              Page
            </Body>

            <div style={{width: 56}}>
              <TextField
                label={<VisuallyHidden>Go to page</VisuallyHidden>}
                size="xsmall"
                value={pageDraft}
                onChange={(event) => setPageDraft(event.target.value.replace(/[^0-9]/g, ''))}
                textFieldProps={{
                  inputMode: 'numeric',
                  style: {textAlign: 'center'},
                  onBlur: commitPageDraft,
                  onKeyDown: (event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      commitPageDraft();
                    }
                  },
                }}
              />
            </div>

            <Body as="span" size="small" color="subtle" style={{whiteSpace: 'nowrap'}}>
              of {pageCount.toLocaleString()}
            </Body>
          </div>
        )}
      </div>
    </div>
  );
};

TablePagination.displayName = 'TablePagination';
