// @refresh reset

/**
 * @module SearchFilterBar
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
 * For prop API + usage notes, read `SearchFilterBar.md` in this folder
 * or run `npm run ld-kit -- show SearchFilterBar`.
 */

import * as React from 'react';
import {useState} from 'react';
import {FilterChip} from '../../components/FilterChip';
import './SearchFilterBar.css';

interface SearchFilterBarProps {
  chips: readonly string[];
}

export function SearchFilterBar({ chips }: SearchFilterBarProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortOpen, setSortOpen] = useState(false);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="ld-wcp-search-filter-bar-root">
      {/* All Filters — uses the LD "Sliders" glyph internally */}
      <FilterChip isAllFilters showCount count={activeFilters.length}>
        All Filters
      </FilterChip>

      {/* Sort — multi-select variant renders the LD chevron glyph */}
      <FilterChip
        isMultiSelect
        isOpen={sortOpen}
        selected={sortOpen}
        onSelectedChange={setSortOpen}
      >
        Sort
      </FilterChip>

      {/* Dynamic filter chips */}
      {chips.map((chip) => (
        <FilterChip
          key={chip}
          selected={activeFilters.includes(chip)}
          onSelectedChange={() => toggleFilter(chip)}
        >
          {chip}
        </FilterChip>
      ))}
    </div>
  );
}
SearchFilterBar.displayName = 'SearchFilterBar';
