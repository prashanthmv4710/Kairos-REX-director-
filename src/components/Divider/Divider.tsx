// @refresh reset

/**
 * @module Divider
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
 * For prop API + usage notes, read `Divider.md` in this folder
 * or run `npm run ld-kit -- show Divider`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {invariant, applyCommonProps} from '../../common/helpers';
import './Divider.css';
export interface DividerProps
  extends Omit<React.ComponentPropsWithoutRef<'hr'>, 'className' | 'style'> {
  /** The divider direction. */
  orientation?: 'horizontal' | 'vertical';
  /**
   * The title for the divider.
   *
   * If the divider is used as decoration, this property should be omitted.
   */
  title?: string;
}

/**
 * Dividers create visual breaks in content.
 * *
 */
export const Divider: React.FunctionComponent<DividerProps> = (props) => {
  const {
    'aria-label': ariaLabel,
    className,
    orientation = 'horizontal',
    title,
    ...rest
  } = applyCommonProps(props);

  // Convert boolean strings to pure booleans. !bool can have unintended side-effects.
  // `ariaHidden` should default to `true` unless overridden.
  const ariaHidden = !(
    rest['aria-hidden'] === 'false' || rest['aria-hidden'] === false
  );

  invariant(
    !!(ariaHidden || ariaLabel !== undefined || title !== undefined),
    '`Divider` accessibility violation. `Divider` requires an accessible label if `aria-hidden` is false.'
  );

  return (
    <hr
      aria-hidden={ariaHidden}
      aria-orientation={orientation}
      className={cx('ld-divider-divider', orientation === 'vertical' && 'ld-divider-divider--vertical', className)}
      {...(title && {title})}
      {...rest}
    />
  );
};

Divider.displayName = 'Divider';
