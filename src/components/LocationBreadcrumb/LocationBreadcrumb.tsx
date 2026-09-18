// @refresh reset

/**
 * @module LocationBreadcrumb
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
 * For prop API + usage notes, read `LocationBreadcrumb.md` in this folder
 * or run `npm run ld-kit -- show LocationBreadcrumb`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/walmart/LocationBreadcrumb.tsx
 *
 * AX Location Breadcrumb — hierarchical location path with a trailing item
 * count. Composes `core/Breadcrumb`.
 *
 * Adaptation: `core/Breadcrumb.BreadcrumbItem` requires `href: string`. The
 * source supports onClick-only crumbs, so we synthesize `href="#"` and let
 * the user's `onClick` `preventDefault` if needed.
 */
import * as React from 'react';

import {cx} from '../../common/cx';
import {Breadcrumb, BreadcrumbItem} from '../Breadcrumb/Breadcrumb';
import {Skeleton} from '../Skeleton/Skeleton';

import './LocationBreadcrumb.css';

export interface LocationBreadcrumbCrumb {
  label: string;
  /** If provided, renders as a clickable link. */
  href?: string;
  /** If provided (and no href), renders as a clickable link with `href="#"` and `preventDefault`. */
  onClick?: () => void;
}

export interface LocationBreadcrumbProps {
  crumbs: LocationBreadcrumbCrumb[];
  /** Pass `undefined` to hide. */
  count?: number;
  /** Trailing label appended after the count number. @default 'count' */
  countLabel?: string;
  countLoading?: boolean;
  /** @default 'Location breadcrumb' */
  'aria-label'?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function LocationBreadcrumb({
  crumbs,
  count,
  countLabel = 'count',
  countLoading = false,
  'aria-label': ariaLabel = 'Location breadcrumb',
  className,
  style,
}: LocationBreadcrumbProps) {
  return (
    <div className={cx('ax-location-breadcrumb', className)} style={style}>
      <Breadcrumb a11yLabel={ariaLabel}>
        {crumbs.map((crumb, i) => {
          const isCurrent = i === crumbs.length - 1;

          if (isCurrent) {
            return (
              <BreadcrumbItem key={i} href={crumb.href ?? '#'} isCurrent>
                {crumb.label}
              </BreadcrumbItem>
            );
          }

          if (crumb.href) {
            return (
              <BreadcrumbItem key={i} href={crumb.href}>
                {crumb.label}
              </BreadcrumbItem>
            );
          }

          if (crumb.onClick) {
            return (
              <BreadcrumbItem
                key={i}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  crumb.onClick?.();
                }}
              >
                {crumb.label}
              </BreadcrumbItem>
            );
          }

          return (
            <BreadcrumbItem key={i} href="#" isCurrent>
              {crumb.label}
            </BreadcrumbItem>
          );
        })}
      </Breadcrumb>

      {count !== undefined ? (
        <p className="ax-location-breadcrumb__count">
          {countLoading ? (
            /* role="img" gives the skeleton an accessible label so AT users who
               navigate to this area while data is loading hear "Loading count"
               rather than silence. aria-live is intentionally omitted — live
               regions should be owned by the app shell via the shared utility,
               not embedded in a leaf component. */
            <span className="ax-location-breadcrumb__count-loading" role="img" aria-label="Loading count">
              <Skeleton variant="rounded" width="3rem" height="1rem" />
            </span>
          ) : (
            <>
              <span className="ax-location-breadcrumb__count-number">{count}</span>{' '}
              <span className="ax-location-breadcrumb__count-label">{countLabel}</span>
            </>
          )}
        </p>
      ) : null}
    </div>
  );
}


LocationBreadcrumb.displayName = 'LocationBreadcrumb';
