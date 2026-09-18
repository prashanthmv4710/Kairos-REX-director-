// @refresh reset

/**
 * @module SearchResults
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
 * For prop API + usage notes, read `SearchResults.md` in this folder
 * or run `npm run ld-kit -- show SearchResults`.
 */

import * as React from 'react';
import {SearchResultsHeader} from '../SearchResultsHeader';
import {SearchFilterBar} from '../SearchFilterBar';
import {ProductCardGrid} from '../ProductCardGrid';
import {ProductCardList} from '../ProductCardList';
import {type FlagVariant} from '../../components/Flag';

export interface SearchResultProduct {
  id?: string;
  image: string;
  name: string;
  price: string;
  cents?: string;
  unitPrice?: string;
  flag?: string;
  flagVariant?: FlagVariant;
  wasPrice?: string;
  rating?: number;
  ratingCount?: string;
  pickup?: string;
  ebt?: boolean;
}

export interface SearchResultsProps {
  /** Initial query string shown in the search field. */
  query: string;
  /** Called as the user edits the query in the header SearchBar. */
  onQueryChange?: (value: string) => void;
  /** Filter chip labels rendered into the filter bar. */
  filters: readonly string[];
  /** Products to render in the result list/grid. */
  products: readonly SearchResultProduct[];
  /** Layout — list (default) or grid. */
  layout?: 'list' | 'grid';
  /** Called when a result's Add to cart is clicked. */
  onAddToCart?: (product: SearchResultProduct, index: number) => void;
}

/**
 * SearchResults — composed search results page section.
 *
 * Renders the search header, filter bar, and the result list/grid as one unit.
 * Filter-chip state is internal; products and filters come from props.
 */
export function SearchResults({
  query,
  onQueryChange,
  filters,
  products,
  layout = 'list',
  onAddToCart,
}: SearchResultsProps) {
  const [searchValue, setSearchValue] = React.useState(query);
  const handleQueryChange = (next: string) => {
    setSearchValue(next);
    onQueryChange?.(next);
  };
  const handleAdd = (p: SearchResultProduct, i: number) => () => onAddToCart?.(p, i);

  return (
    <div>
      <SearchResultsHeader
        query={searchValue}
        onQueryChange={handleQueryChange}
        onClear={() => handleQueryChange('')}
      />
      <SearchFilterBar chips={filters} />
      {layout === 'list' ? (
        <div style={{borderTop: '1px solid var(--ld-semantic-color-separator, #e0e0e0)'}}>
          {products.map((p, i) => (
            <div
              key={p.id ?? i}
              style={{borderBottom: '1px solid var(--ld-semantic-color-separator, #e0e0e0)'}}
            >
              <ProductCardList
                {...p}
                cents={p.cents ?? ''}
                rating={p.rating ?? 0}
                ratingCount={p.ratingCount ?? ''}
                onAddToCart={handleAdd(p, i)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          {products.map((p, i) => (
            <ProductCardGrid
              key={p.id ?? i}
              {...p}
              cents={p.cents ?? ''}
              rating={p.rating ?? 0}
              ratingCount={p.ratingCount ?? ''}
              onAddToCart={handleAdd(p, i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

SearchResults.displayName = 'SearchResults';
