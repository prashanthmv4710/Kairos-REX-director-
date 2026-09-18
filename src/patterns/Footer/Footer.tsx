// @refresh reset

/**
 * @module Footer
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
 * For prop API + usage notes, read `Footer.md` in this folder
 * or run `npm run ld-kit -- show Footer`.
 */

import * as React from 'react';
import {useViewport} from '../../utils/Layout';
import {DesktopFooter} from '../DesktopFooter';
import {MwebFooter} from '../MwebFooter';

export interface FooterProps {
  /**
   * Force a specific variant. By default the wrapper picks based on viewport
   * (mobile → mweb, large+ → desktop). Useful for previews and doc pages.
   */
  variant?: 'auto' | 'desktop' | 'mweb';
}

/**
 * Drop-in site footer. Picks the appropriate layout based on viewport
 * (mobile-web vs desktop). Override with `variant` for previews.
 */
export function Footer({variant = 'auto'}: FooterProps) {
  const {isAtLeastLarge} = useViewport();

  if (variant === 'desktop') return <DesktopFooter />;
  if (variant === 'mweb') return <MwebFooter contained />;

  return isAtLeastLarge ? <DesktopFooter /> : <MwebFooter contained />;
}

Footer.displayName = 'Footer';
