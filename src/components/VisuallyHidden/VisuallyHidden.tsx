// @refresh reset

/**
 * @module VisuallyHidden
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
 * For prop API + usage notes, read `VisuallyHidden.md` in this folder
 * or run `npm run ld-kit -- show VisuallyHidden`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {PolymorphicElementWithoutRef} from '../../common/types';
import './VisuallyHidden.css';
interface VisuallyHiddenBaseProps
  extends Omit<
      React.ComponentPropsWithoutRef<React.ElementType>,
      'className' | 'style'
    > {
  /**
   * The content for the visually hidden.
   */
  children: React.ReactNode;
  /**
   * Whether the element should become visible on focus for the visually hidden.
   *
   * @default false;
   */
  isFocusable?: boolean;
}

export type VisuallyHiddenProps<T extends React.ElementType> =
  PolymorphicElementWithoutRef<T, VisuallyHiddenBaseProps>;

/**
 * Visually Hidden is a utility component that makes content available for screen readers only.
 *
 * {@link https://digitaltoolkit.livingdesign.walmart.com/develop/react/utilities/visually-hidden/ React documentation}
 *
 */
function VisuallyHiddenRender<T extends React.ElementType = 'span'>(
  props: VisuallyHiddenProps<T>,
  ref: React.Ref<Element>,
) {
  const {
    as: Component = 'span',
    className,
    isFocusable = false,
    ...rest
  } = applyCommonProps(props);

  return (
    <Component
      ref={ref}
      className={cx('ld-visuallyhidden-visuallyHidden', isFocusable && 'ld-visuallyhidden-visuallyHiddenFocusable', className)}
      {...(rest as React.ComponentPropsWithoutRef<T>)}
    />
  );
}

// `forwardRef` can't infer a generic render function's own type parameter, so
// the render fn is passed through untyped here and the resulting component is
// cast back to the polymorphic signature below.
export const VisuallyHidden = React.forwardRef(VisuallyHiddenRender as never) as {
  <T extends React.ElementType = 'span'>(
    props: VisuallyHiddenProps<T> & {ref?: React.Ref<Element>}
  ): JSX.Element;
  displayName?: string;
};

VisuallyHidden.displayName = 'VisuallyHidden';
