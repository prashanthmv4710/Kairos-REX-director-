// @refresh reset

/**
 * @module Link
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
 * For prop API + usage notes, read `Link.md` in this folder
 * or run `npm run ld-kit -- show Link`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {getTarget, applyCommonProps} from '../../common/helpers';
import './Link.css';
export type LinkColor = 'default' | 'subtle' | 'white' | 'info';

export interface LinkProps
  extends Omit<React.ComponentPropsWithRef<'a'>, 'className' | 'style'> {
  /**
   * The content for the link.
   */
  children: React.ReactNode;
  /**
   * The color for the link.
   *
   * @default "default"
   */
  color?: LinkColor;
  /**
   * The href for the link.
   */
  href: string;
  /**
   * The callback fired when the link is clicked.
   */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  /**
   * The target for the link.
   */
  target?: string;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

/**
 * Links are navigational elements.
 * *
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => {
    const {
      children,
      color = 'default',
      className,
      target,
      ...rest
    } = applyCommonProps(props);

    return (
      <a
        className={cx(
          'ld-link-link',
          color === 'subtle' && 'ld-link-subtle',
          color === 'white' && 'ld-link-white',
          color === 'info' && 'ld-link-info',
          className
        )}
        ref={ref}
        {...getTarget(target)}
        {...rest}
      >
        {children}
      </a>
    );
  }
);

Link.displayName = 'Link';
