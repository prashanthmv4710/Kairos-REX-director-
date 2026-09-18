'use client';
// @refresh reset

/**
 * @module DefaultBreakpoint
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
 * For prop API + usage notes, read `DefaultBreakpoint.md` in this folder
 * or run `npm run ld-kit -- show DefaultBreakpoint`.
 */

import * as React from 'react';

export type DefaultBreakpoint =
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | 'xxlarge';

const DefaultBreakpointContext =
  React.createContext<DefaultBreakpoint>('small');

export interface DefaultBreakpointProviderProps {
  /**
   * The content for the default breakpoint provider.
   */
  children: React.ReactNode;
  /**
   * default breakpoint used in SSR for the default breakpoint provider.
   */
  defaultBreakpoint: DefaultBreakpoint;
}

/**
 * @private
 */
export const DefaultBreakpointProvider: React.FunctionComponent<
  DefaultBreakpointProviderProps
> = (props) => {
  const {children, defaultBreakpoint} = props;

  const contextValue = React.useRef(defaultBreakpoint);

  return (
    <DefaultBreakpointContext.Provider value={contextValue.current}>
      {children}
    </DefaultBreakpointContext.Provider>
  );
};

/**
 * @private
 */
export const useDefaultBreakpoint = () =>
  React.useContext(DefaultBreakpointContext);
