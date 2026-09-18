// @refresh reset

/**
 * @module Container
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
 * For prop API + usage notes, read `Container.md` in this folder
 * or run `npm run ld-kit -- show Container`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import './Container.css';
export interface ContainerProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  /**
   * The content for the container.
   */
  children: React.ReactNode;
}

/**
 * Container is a utility component that sets a maximum width for layouts.
 * *
 */
export const Container: React.FunctionComponent<ContainerProps> = (props) => {
  const {children, className, ...rest} = applyCommonProps(props);

  return (
    <div className={cx('ld-container-container', className)} {...rest}>
      {children}
    </div>
  );
};

Container.displayName = 'Container';
