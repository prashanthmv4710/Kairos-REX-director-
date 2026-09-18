import * as React from 'react';
import { Cell, Pie, PieChart as RcPieChart, ResponsiveContainer } from 'recharts';
import './DataViz.css';
import { ChartLegend, LegendItem } from './ChartLegend';
import { categoryColor } from './chartTokens';

export interface PieDatum {
  label: string;
  value: number;
  /** 0-based palette index. Defaults to slice position. */
  colorIndex?: number;
}

export interface PieChartProps {
  data: PieDatum[];
  /** Diameter of the chart in px. */
  size?: number;
  /** Inner radius ratio (0 = pie, >0 = donut). 0.62 matches the PX donut. */
  innerRatio?: number;
  /** Center content for donut charts. */
  centerValue?: React.ReactNode;
  centerLabel?: React.ReactNode;
  showLegend?: boolean;
  /** Show each slice's percentage in the legend. */
  showLegendValues?: boolean;
  ariaLabel?: string;
}

/**
 * Pie / donut chart built with Recharts. Pass `innerRatio` > 0 (and optional
 * center content) to render a donut; DonutChart is a thin preset wrapper.
 */
export function PieChart({
  data,
  size = 220,
  innerRatio = 0,
  centerValue,
  centerLabel,
  showLegend = true,
  showLegendValues = true,
  ariaLabel,
}: PieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const outerR = size / 2;
  const innerR = outerR * innerRatio;

  const slices = data.map((d, i) => ({
    ...d,
    colorIndex: d.colorIndex ?? i,
    pct: (d.value / total) * 100,
  }));

  const legendItems: LegendItem[] = slices.map((s) => ({
    label: s.label,
    colorIndex: s.colorIndex,
    value: showLegendValues ? `${Math.round(s.pct)}%` : undefined,
  }));

  const resolvedLabel =
    ariaLabel ??
    `${innerR > 0 ? 'Donut' : 'Pie'} chart: ${slices
      .map((s) => `${s.label} ${Math.round(s.pct)}%`)
      .join(', ')}.`;

  return (
    <div className="ld-dataviz ld-dataviz--row">
      <div className="ld-dataviz__pie-wrap" style={{ width: size, height: size }}>
        <ResponsiveContainer width={size} height={size}>
          <RcPieChart role="img" aria-label={resolvedLabel}>
            <Pie
              data={slices}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={outerR}
              innerRadius={innerR}
              startAngle={90}
              endAngle={-270}
              stroke="none"
              isAnimationActive={false}
            >
              {slices.map((s, i) => (
                <Cell key={i} fill={categoryColor(s.colorIndex).fill} />
              ))}
            </Pie>
          </RcPieChart>
        </ResponsiveContainer>
        {(centerValue || centerLabel) && (
          <div className="ld-dataviz__pie-center" aria-hidden="true">
            {centerValue && <span className="ld-dataviz__pie-center-value">{centerValue}</span>}
            {centerLabel && <span className="ld-dataviz__pie-center-label">{centerLabel}</span>}
          </div>
        )}
      </div>
      {showLegend && <ChartLegend items={legendItems} orientation="column" />}
    </div>
  );
}
