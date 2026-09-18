// @refresh reset

/**
 * @module HighlightText
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
 * For prop API + usage notes, read `HighlightText.md` in this folder
 * or run `npm run ld-kit -- show HighlightText`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/ui/HighlightText.tsx
 *
 * AX Highlight Text — small utility that renders a string with a query match
 * highlighted. Convention: the matching portion renders normal-weight and the
 * surrounding portions render bold (matches the Walmart typeahead pattern,
 * where the typed query is plain and the prefix/suffix complete the
 * suggestion).
 *
 * Changes from the source:
 * - Source defaulted to Tailwind classes (`font-bold`, `font-normal`); this
 *   port uses BEM-style classes (`ax-highlight-text__bold` /
 *   `ax-highlight-text__match`) so it works without a Tailwind layer.
 * - Consumers can still override either class via `boldClassName` /
 *   `matchClassName`.
 */
import * as React from 'react';

import './HighlightText.css';

export interface HighlightTextProps {
  /** The full text to display. */
  text: string;
  /** The search query to highlight within the text. Case-insensitive. */
  query: string;
  /**
   * Class applied to the non-matching (bold) segments.
   * @default 'ax-highlight-text__bold'
   */
  boldClassName?: string;
  /**
   * Class applied to the matching (normal-weight) segment.
   * @default 'ax-highlight-text__match'
   */
  matchClassName?: string;
}

export function HighlightText({
  text,
  query,
  boldClassName = 'ax-highlight-text__bold',
  matchClassName = 'ax-highlight-text__match',
}: HighlightTextProps) {
  if (!query) {
    return <span className={boldClassName}>{text}</span>;
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) {
    return <span className={boldClassName}>{text}</span>;
  }

  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);

  return (
    <>
      {before && <span className={boldClassName}>{before}</span>}
      <span className={matchClassName}>{match}</span>
      {after && <span className={boldClassName}>{after}</span>}
    </>
  );
}

HighlightText.displayName = 'HighlightText';

