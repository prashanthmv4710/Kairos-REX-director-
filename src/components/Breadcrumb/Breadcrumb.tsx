// @refresh reset

/**
 * @module Breadcrumb
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
 * For prop API + usage notes, read `Breadcrumb.md` in this folder
 * or run `npm run ld-kit -- show Breadcrumb`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {invariant, applyCommonProps, getTarget} from '../../common/helpers';
import './Breadcrumb.css';
// ---------------------------------------------------------------------------
// BreadcrumbItem (inlined sub-component)
// ---------------------------------------------------------------------------

export interface BreadcrumbItemProps
  extends Omit<React.ComponentPropsWithRef<'a'>, 'className' | 'style'> {
  /**
   * The content for the breadcrumb item.
   */
  children: React.ReactNode;
  /**
   * The href for the breadcrumb item.
   */
  href: string;
  /**
   * If the breadcrumb item represents the current location.
   *
   * @default false
   */
  isCurrent?: boolean;
  /**
   * The callback fired when the breadcrumb item is clicked.
   */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  /**
   * The target for the breadcrumb item.
   */
  target?: string;
}

/**
 * Breadcrumb Items
 * *
 */
export const BreadcrumbItem = React.forwardRef<
  HTMLAnchorElement,
  BreadcrumbItemProps
>((props, ref) => {
  const {
    children,
    className,
    isCurrent = false,
    target,
    ...rest
  } = applyCommonProps(props);

  return (
    <a
      className={cx('ld-breadcrumb-breadcrumbitem-breadcrumbItem', isCurrent && 'ld-breadcrumb-breadcrumbitem-current', className)}
      itemProp="item"
      ref={ref}
      // "location" represents the current location within an environment or context;
      // @see {@breadcrumbItem https://tink.uk/using-the-aria-current-attribute/}
      {...(isCurrent && {'aria-current': 'location'})}
      {...getTarget(target)}
      {...rest}
    >
      <span itemProp="name">{children}</span>
    </a>
  );
});

BreadcrumbItem.displayName = 'BreadcrumbItem';

export interface BreadcrumbProps
  extends Omit<React.ComponentPropsWithoutRef<'nav'>, 'className' | 'style'> {
  /**
   * The accessible label for the breadcrumb.
   *
   * @default "breadcrumb"
   */
  a11yLabel?: string;
  /**
   * The content for the breadcrumb.
   */
  children: React.ReactNode;
}

/**
 * Breadcrumbs provide a secondary navigation pattern to help a user navigate back through levels of a hierarchy. Breadcrumbs show users their current location relative to the information architecture and enable them to quickly move up to a parent level or previous step.
 * *
 */
export const Breadcrumb: React.FunctionComponent<BreadcrumbProps> = (props) => {
  const {
    a11yLabel = 'breadcrumb',
    children,
    className,
    ...rest
  } = applyCommonProps(props);

  const validChildren = React.Children.toArray(children).filter(React.isValidElement);
  const breadcrumbItemsCount = React.Children.count(validChildren);
  const hasBreadcrumbItems = breadcrumbItemsCount > 0;
  if (!hasBreadcrumbItems) {
    return null;
  }

  return (
    <nav aria-label={a11yLabel} className={className} {...rest}>
      <ol className={'ld-breadcrumb-breadcrumb'}>
        {React.Children.map(validChildren, (child, index) => (
          <li className={'ld-breadcrumb-item'}>
            {child}

            {index < breadcrumbItemsCount - 1 && (
              <span aria-hidden className={'ld-breadcrumb-separator'}>
                /
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

Breadcrumb.displayName = 'Breadcrumb';
