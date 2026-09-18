'use client';
// @refresh reset

/**
 * @module TabNavigation
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
 * For prop API + usage notes, read `TabNavigation.md` in this folder
 * or run `npm run ld-kit -- show TabNavigation`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps, getTarget} from '../../common/helpers';
import {WithIconProps} from '../../common/types';
import './TabNavigation.css';

// ---------------------------------------------------------------------------
// Context — passes pattern from TabNavigation down to TabNavigationItem
// ---------------------------------------------------------------------------

type TabNavigationPattern = 'tablist' | 'navigation';

const TabNavigationContext = React.createContext<{pattern: TabNavigationPattern}>({
  pattern: 'tablist',
});

// ---------------------------------------------------------------------------
// TabNavigationItem
// ---------------------------------------------------------------------------

export interface TabNavigationItemProps
  extends Omit<React.ComponentPropsWithRef<'a'>, 'className' | 'style'> {
  /**
   * The content for the tab navigation item.
   */
  children: React.ReactNode;
  /**
   * The href for the tab navigation item.
   * Required in `"navigation"` pattern. Ignored in `"tablist"` pattern.
   */
  href?: string;
  /**
   * If the tab navigation item represents the current page / selected tab.
   *
   * @default false
   */
  isCurrent?: boolean;
  /**
   * The leading icon for tab navigation item.
   */
  leadingIcon?: React.ReactNode;
  /**
   * The callback fired when the tab navigation item is clicked.
   */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /**
   * The target for the tab navigation item. Only applies in `"navigation"` pattern.
   */
  target?: string;
  /**
   * The trailing content for the tab navigation item.
   */
  trailing?: React.ReactNode;
}

export const TabNavigationItem = React.forwardRef<
  HTMLElement,
  TabNavigationItemProps
>((props, ref) => {
  const {pattern} = React.useContext(TabNavigationContext);

  const {
    className,
    children,
    href,
    isCurrent = false,
    leadingIcon: initialLeadingIcon,
    target,
    trailing,
    onClick,
    ...rest
  } = applyCommonProps(props);

  const leadingIcon = React.isValidElement<WithIconProps>(initialLeadingIcon)
    ? React.cloneElement(initialLeadingIcon, {size: 'small'})
    : initialLeadingIcon;

  const inner = (
    <>
      {leadingIcon && (
        <span className="ld-tabnavigation-tabnavigationitem-leadingIcon">{leadingIcon}</span>
      )}
      <span className="ld-tabnavigation-tabnavigationitem-label">{children}</span>
      {trailing && (
        <span className="ld-tabnavigation-tabnavigationitem-trailing">{trailing}</span>
      )}
    </>
  );

  const itemClass = cx(
    'ld-tabnavigation-tabnavigationitem-tabNavigationItem',
    isCurrent && 'ld-tabnavigation-tabnavigationitem-isCurrent',
    className,
  );

  if (pattern === 'navigation') {
    const resolvedHref = href ?? '#';
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // When no real href is supplied the anchor defaults to "#", which
      // scrolls the page to the top. Prevent that automatically so
      // consumers don't have to remember to call e.preventDefault() themselves.
      if (resolvedHref === '#') {
        e.preventDefault();
      }
      onClick?.(e);
    };
    return (
      <a
        className={itemClass}
        href={resolvedHref}
        ref={ref as React.Ref<HTMLAnchorElement>}
        aria-current={isCurrent ? 'page' : undefined}
        onClick={handleClick}
        {...getTarget(target)}
        {...rest}
      >
        {inner}
      </a>
    );
  }

  // tablist pattern — render as button with role="tab"
  return (
    <button
      className={itemClass}
      ref={ref as React.Ref<HTMLButtonElement>}
      role="tab"
      type="button"
      aria-selected={isCurrent}
      // Roving tabindex: only the selected tab is in the tab sequence.
      // Arrow keys move focus between tabs.
      tabIndex={isCurrent ? 0 : -1}
      onClick={onClick}
      {...(rest as unknown as React.ComponentPropsWithoutRef<'button'>)}
    >
      {inner}
    </button>
  );
});

TabNavigationItem.displayName = 'TabNavigationItem';

// ---------------------------------------------------------------------------
// TabNavigation
// ---------------------------------------------------------------------------

export interface TabNavigationProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  /**
   * The tab items.
   */
  children: React.ReactNode;
  /**
   * The ARIA pattern to use.
   *
   * - `"navigation"` (default) — `<nav>` + `<ul>/<li>` + `<a aria-current="page">`.
   *   Use when each tab navigates to a distinct URL or route.
   *   Keyboard: Tab key moves through each link sequentially.
   *
   * - `"tablist"` — `role="tablist"` + `role="tab"` + `aria-selected`.
   *   Use when tabs reveal in-page content panels without a full page navigation.
   *   Keyboard: arrow keys move between tabs. Tabs render as `<button>` elements.
   *
   * @default "navigation"
   */
  pattern?: TabNavigationPattern;
  /**
   * Accessible label for the tab group / nav landmark.
   * Required — at minimum one of `aria-label` or `aria-labelledby` must be provided.
   */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

export const TabNavigation: React.FunctionComponent<TabNavigationProps> = (
  props
) => {
  const {
    children,
    className,
    pattern = 'navigation',
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    UNSAFE_className,
    UNSAFE_style,
    ...rest
  } = applyCommonProps(props);

  if (!ariaLabel && !ariaLabelledBy) {
    console.warn(
      '`TabNavigation` accessibility warning: provide an `aria-label` or `aria-labelledby` to identify this landmark for screen readers.'
    );
  }

  const containerRef = React.useRef<HTMLElement>(null);

  // Arrow-key navigation for tablist pattern (roving tabindex + auto-select).
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (pattern !== 'tablist') return;
    const tabs = Array.from(
      containerRef.current?.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])') ?? []
    );
    const currentIndex = tabs.findIndex((t) => t === document.activeElement);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % tabs.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    tabs[nextIndex]?.focus();
    // Keep the newly focused tab inside the scrollable carousel track —
    // relying on browser default scroll-into-view can clip it sideways.
    tabs[nextIndex]?.scrollIntoView({block: 'nearest', inline: 'nearest'});
    // Automatic activation — click the tab so the consumer's onClick fires.
    tabs[nextIndex]?.click();
  };

  const wrapperClass = cx('ld-tabnavigation-tabNavigation', UNSAFE_className, className);

  if (pattern === 'navigation') {
    return (
      <TabNavigationContext.Provider value={{pattern}}>
        <nav
          ref={containerRef as React.Ref<HTMLElement>}
          className={wrapperClass}
          style={UNSAFE_style}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          {...(rest as React.ComponentPropsWithoutRef<'nav'>)}
        >
          <ul className="ld-tabnavigation-list">
            {React.Children.map(children, (child, index) => {
              if (!React.isValidElement(child)) return null;
              return (
                <li className="ld-tabnavigation-tabNavigationItemContainer" key={index}>
                  {child}
                </li>
              );
            })}
          </ul>
        </nav>
      </TabNavigationContext.Provider>
    );
  }

  // tablist pattern
  return (
    <TabNavigationContext.Provider value={{pattern}}>
      <div
        ref={containerRef as React.Ref<HTMLDivElement>}
        role="tablist"
        className={cx(wrapperClass, 'ld-tabnavigation-tablist')}
        style={UNSAFE_style}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        onKeyDown={handleKeyDown}
        {...(rest as React.ComponentPropsWithoutRef<'div'>)}
      >
        {children}
      </div>
    </TabNavigationContext.Provider>
  );
};

TabNavigation.displayName = 'TabNavigation';
