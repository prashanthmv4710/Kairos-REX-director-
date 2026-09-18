// @refresh reset

/**
 * @module List
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
 * For prop API + usage notes, read `List.md` in this folder
 * or run `npm run ld-kit -- show List`.
 */

import * as React from 'react';
import {Body} from '../Text';

import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
// ---------------------------------------------------------------------------
// ListItem (inlined sub-component)
// ---------------------------------------------------------------------------

export interface ListItemProps
  extends Omit<
      React.ComponentPropsWithoutRef<'span'>,
      'className' | 'style' | 'title' | 'onClick'
    > {
  /**
   * The text label for the list item.
   */
  children: React.ReactNode;
  /**
   * The leading content for the list item.
   */
  leading?: React.ReactNode;
  /**
   * The title for the list item.
   */
  title?: React.ReactNode;
  /**
   * The trailing content for the list item.
   */
  trailing?: React.ReactNode;
  /**
   * When provided, the entire row renders as a `<button>` making the whole
   * item the touch / click target. Use for navigable rows (e.g. chevron
   * trailing). The accessible name is derived from the row's text content.
   */
  onClick?: () => void;
  /**
   * `id` applied to the description (children) container. Pass this id as
   * `aria-describedby` on trailing controls (Switch, Checkbox) so assistive
   * technology reads the supporting text alongside the control label.
   */
  descriptionId?: string;
}

/**
 * List Items
 * *
 */
export const ListItem: React.FunctionComponent<ListItemProps> = (props) => {
  const {children, className, descriptionId, leading, onClick, title, trailing, ...rest} = applyCommonProps(props);

  const inner = (
    <>
      {leading && <span className={'ld-list-listitem-leading'}>{leading}</span>}

      <div className={'ld-list-listitem-container'}>
        {title && (
          <Body
            UNSAFE_className={'ld-list-listitem-title'}
            size={"large"}
            weight={"alt"}
          >
            {title}
          </Body>
        )}

        <Body
          UNSAFE_className={'ld-list-listitem-textLabel'}
          size={"medium"}
          {...(descriptionId ? {id: descriptionId} : {})}
        >
          {children}
        </Body>
      </div>

      {trailing && <span className={'ld-list-listitem-trailing'}>{trailing}</span>}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className={cx('ld-list-listitem-listItem', 'ld-list-listitem-listItem--button', className)}
        onClick={onClick}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {inner}
      </button>
    );
  }

  return (
    <span className={cx('ld-list-listitem-listItem', className)} {...rest}>
      {inner}
    </span>
  );
};

import {Divider} from '../Divider';
import './List.css';

export interface ListProps
  extends Omit<React.ComponentPropsWithoutRef<'ul'>, 'className' | 'style'> {
  /**
   * The content for the list.
   */
  children: React.ReactNode;
}

/**
 * Lists are continuous, vertical indexes of related information.
 * *
 */
export const List: React.FunctionComponent<ListProps> = (props) => {
  const {children, className, ...rest} = applyCommonProps(props);

  const validChildren = React.Children.toArray(children).filter((child) =>
    React.isValidElement(child)
  );

  const childrenCount = React.Children.count(validChildren);

  return (
    <ul className={cx('ld-list-list', className)} {...rest}>
      {React.Children.map(validChildren, (child, index) => (
        <li hidden={child.props.hidden}>
          {child}

          {index < childrenCount - 1 && (
            <div className={'ld-list-divider'}>
              <Divider />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};
