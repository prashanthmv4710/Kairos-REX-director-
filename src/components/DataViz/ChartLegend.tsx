import * as React from 'react';
import './DataViz.css';
import { categoryColor } from './chartTokens';

export interface LegendItem {
  /** Visible label, e.g. "Category". */
  label: string;
  /** 0-based palette index. */
  colorIndex: number;
  /** Optional leading value, e.g. "10%". */
  value?: string;
  /** Override the swatch color (otherwise derived from colorIndex). */
  color?: string;
  /** Render the swatch as a line (with optional dash) instead of a dot. */
  variant?: 'dot' | 'line';
  dashed?: boolean;
}

export interface ChartLegendProps {
  items: LegendItem[];
  /** "row" wraps horizontally (top legends); "column" stacks (side legends). */
  orientation?: 'row' | 'column';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Shared legend for every DataViz chart. Each item shows a colored swatch
 * (dot or line) followed by an optional value and a label.
 */
export function ChartLegend({ items, orientation = 'row', className, style }: ChartLegendProps) {
  return (
    <ul
      className={['ld-dataviz-legend', `ld-dataviz-legend--${orientation}`, className]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {items.map((item, i) => {
        const swatchColor = item.color ?? categoryColor(item.colorIndex).fill;
        return (
          <li key={`${item.label}-${i}`} className="ld-dataviz-legend__item">
            {item.variant === 'line' ? (
              <span
                aria-hidden="true"
                className="ld-dataviz-legend__line"
                style={{
                  borderTopColor: swatchColor,
                  borderTopStyle: item.dashed ? 'dashed' : 'solid',
                }}
              />
            ) : (
              <span
                aria-hidden="true"
                className="ld-dataviz-legend__dot"
                style={{ backgroundColor: swatchColor }}
              />
            )}
            {item.value && (
              <span className="ld-dataviz-legend__value">{item.value}</span>
            )}
            <span className="ld-dataviz-legend__label">{item.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
