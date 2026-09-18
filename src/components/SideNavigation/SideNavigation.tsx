// @refresh reset

/**
 * @module SideNavigation
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
 * For prop API + usage notes, read `SideNavigation.md` in this folder
 * or run `npm run ld-kit -- show SideNavigation`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps, getTarget} from '../../common/helpers';
import './SideNavigation.css';
// ---------------------------------------------------------------------------
// SideNavigationItem (inlined sub-component)
// ---------------------------------------------------------------------------

export interface SideNavigationItemProps
  extends Omit<React.ComponentPropsWithRef<'a'>, 'className' | 'style'> {
  /**
   * The content for the side navigation item.
   */
  children?: React.ReactNode;
  /**
   * The href for the navigation item.
   */
  href: string;
  /**
   * If the navigation item represents the current page.
   *
   * @default false
   */
  isCurrent?: boolean;
  /**
   * The leading content for the navigation item.
   */
  leading?: React.ReactNode;
  /**
   * The callback fired when the side navigation item is clicked.
   */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  /**
   * The target for the side navigation item.
   */
  target?: string;
}

/**
 * Side Navigation Item
 *
 * {@link https://digitaltoolkit.livingdesign.walmart.com/components/side-navigation/ Guidelines}
 * {@link https://digitaltoolkit.livingdesign.walmart.com/develop/react/components/side-navigation/ React documentation}
 *
 */
export const SideNavigationItem = React.forwardRef<
  HTMLAnchorElement,
  SideNavigationItemProps
>((props, ref) => {
  const {
    className,
    children,
    leading,
    isCurrent = false,
    target,
    ...rest
  } = applyCommonProps(props);

  return (
    <a
      className={cx('ld-sidenavigation-sidenavigationitem-sideNavigationItem', isCurrent && 'ld-sidenavigation-sidenavigationitem-isCurrent', className)}
      ref={ref}
      {...(isCurrent && {'aria-current': 'page'})}
      {...getTarget(target)}
      {...rest}
    >
      {leading && <span className={'ld-sidenavigation-sidenavigationitem-leading'}>{leading}</span>}

      {children}
    </a>
  );
});

SideNavigationItem.displayName = 'SideNavigationItem';

export interface SideNavigationProps
  extends Omit<React.ComponentPropsWithoutRef<'nav'>, 'className' | 'style'> {
  /**
   * The content for the side navigation.
   */
  children?: React.ReactNode;
}

/**
 * Side Navigation provides a list of primary links that navigate users to a URL. Links should be grouped together in sections based on related content or categories. A section title can precede a list of links.
 *
 * {@link https://digitaltoolkit.livingdesign.walmart.com/components/side-navigation/ Guidelines}
 * {@link https://digitaltoolkit.livingdesign.walmart.com/develop/react/components/side-navigation/ React documentation}
 *
 */
export const SideNavigation: React.FunctionComponent<SideNavigationProps> = (
  props
) => {
  const {children, className, ...rest} = applyCommonProps(props);

  return (
    <nav className={cx('ld-sidenavigation-sideNavigation', className)} {...rest}>
      <ul className={'ld-sidenavigation-list'}>
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) {
            return null;
          }
          return <li key={index}>{child}</li>;
        })}
      </ul>
    </nav>
  );
};

SideNavigation.displayName = 'SideNavigation';
