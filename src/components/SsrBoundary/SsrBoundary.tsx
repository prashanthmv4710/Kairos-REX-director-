// @refresh reset

/**
 * @module SsrBoundary
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
 * For prop API + usage notes, read `SsrBoundary.md` in this folder
 * or run `npm run ld-kit -- show SsrBoundary`.
 */

import * as React from 'react';

export type SsrBoundaryProps = React.ComponentPropsWithoutRef<'div'>;

const isDomEnvironment =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined';

/**
 * @private
 *
 * Boundary to prevent rendering of nested components during SSR. (This is necessary for
 * components that access DOM elements, e.g., component adds a portal element to the DOM.)
 */
export const SsrBoundary: React.FunctionComponent<SsrBoundaryProps> = (
  props
) => {
  const {children} = props;

  // For an explanation of this eslint-disable, see: https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-useless-fragment.md#allowexpressions
  return isDomEnvironment ? <>{children}</> : null;
};
