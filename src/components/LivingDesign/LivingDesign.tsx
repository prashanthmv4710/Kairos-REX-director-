'use client';
// @refresh reset

/**
 * @module LivingDesign
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
 * For prop API + usage notes, read `LivingDesign.md` in this folder
 * or run `npm run ld-kit -- show LivingDesign`.
 */

import * as React from 'react';
import {invariant} from '../../common/helpers';
// ---------------------------------------------------------------------------
// LivingDesignContext (inlined sub-component)
// ---------------------------------------------------------------------------

/**
 * @private
 */
export const LivingDesignContext = React.createContext<
  Readonly<{defaultBreakpoint: DefaultBreakpoint; isRegistered: boolean}>
>({defaultBreakpoint: 'small', isRegistered: false});

// ---------------------------------------------------------------------------
// LivingDesignSSRProvider (inlined sub-component)
// ---------------------------------------------------------------------------

interface LivingDesignSSRProviderProps {
  /**
   * The content for the SSR provider.
   */
  children: React.ReactNode;
}

/**
 * @private
 *
 * @react-aria package provides implementation for conditional rendering of SSRProvider for different react versions:
 * @see {@link https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/ssr/src/SSRProvider.tsx#L86}
 */
export const LivingDesignSSRProvider: React.FunctionComponent<
  LivingDesignSSRProviderProps
> = (props) => {
  const {children} = props;

  // React 18+ has useId built-in, no SSRProvider needed
  return <>{children}</>;
};

import {A11yAnnouncementProvider} from '../A11yAnnouncement';
import {
  DefaultBreakpoint,
  DefaultBreakpointProvider,
} from '../DefaultBreakpoint';
import {SnackbarProvider} from '../Snackbar';
export interface LivingDesignProviderProps {
  /**
   * The content for the living design provider.
   */
  children?: React.ReactNode;
  /**
   * The default breakpoint used in SSR for the living design provider.
   *
   * @default "small"
   */
  defaultBreakpoint?: DefaultBreakpoint;
}

/**
 * Living Design Provider is a utility component that contains all the required React providers.
 * *
 */
export const LivingDesignProvider: React.FunctionComponent<
  LivingDesignProviderProps
> = (props) => {
  const {children, defaultBreakpoint = 'small'} = props;

  const {isRegistered} = React.useContext(LivingDesignContext);
  invariant(
    !isRegistered,
    'Multiple LivingDesignProviders detected. Only register one LivingDesignProvider per application.'
  );

  const contextValue = React.useRef({defaultBreakpoint, isRegistered: true});

  return (
    <LivingDesignContext.Provider value={contextValue.current}>
      <LivingDesignSSRProvider>
        <A11yAnnouncementProvider>
          <DefaultBreakpointProvider defaultBreakpoint={defaultBreakpoint}>
            <SnackbarProvider>{children}</SnackbarProvider>
          </DefaultBreakpointProvider>
        </A11yAnnouncementProvider>
      </LivingDesignSSRProvider>
    </LivingDesignContext.Provider>
  );
};
