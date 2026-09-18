// @refresh reset

/**
 * @module SearchResultsHeader
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
 * For prop API + usage notes, read `SearchResultsHeader.md` in this folder
 * or run `npm run ld-kit -- show SearchResultsHeader`.
 */

import * as React from 'react';
import {SearchBar} from '../../components/SearchBar';
import {ChevronLeftIcon} from '../../components/Icons';
import './SearchResultsHeader.css';

interface SearchResultsHeaderProps {
  /** Current query string shown in the search field. */
  query: string;
  /** Called as the user edits the query. When provided the field is controlled. */
  onQueryChange?: (value: string) => void;
  /** Called when the clear (×) button is pressed. */
  onClear?: () => void;
  /** Called when the back button is pressed. */
  onBack?: () => void;
  /** Placeholder shown when the field is empty. */
  placeholder?: string;
}

export function SearchResultsHeader({
  query,
  onQueryChange,
  onClear,
  onBack,
  placeholder = 'Search everything at Walmart online and in store',
}: SearchResultsHeaderProps) {
  // Controlled when onQueryChange is provided; otherwise keep an internal echo
  // that stays in sync with the query prop so externally-driven usages (e.g.
  // component-communication demos) still display and remain editable.
  const [internal, setInternal] = React.useState(query);
  React.useEffect(() => {
    if (!onQueryChange) setInternal(query);
  }, [query, onQueryChange]);

  const value = onQueryChange ? query : internal;
  const handleChange = (next: string) => {
    if (onQueryChange) onQueryChange(next);
    else setInternal(next);
  };

  return (
    <div className="ld-wcp-search-results-header-root">
      <div className="ld-wcp-search-results-header-inner">
        {/* Back button */}
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="ld-wcp-search-results-header-back-btn"
        >
          <ChevronLeftIcon size="medium" />
        </button>

        {/* Search — same SearchBar component used everywhere else */}
        <SearchBar
          value={value}
          onChange={handleChange}
          onClear={onClear}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
SearchResultsHeader.displayName = 'SearchResultsHeader';
