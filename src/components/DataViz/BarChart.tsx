import * as React from 'react';
import { Bar, CartesianGrid, LabelList, BarChart as RcBarChart, XAxis, YAxis } from 'recharts';
import './DataViz.css';
import { ChartLegend, LegendItem } from './ChartLegend';
import { ScaledChart } from './ScaledChart';
import { CHART_GRID_COLOR, CHART_TEXT_SUBTLE, categoryColor } from './chartTokens';
import { niceTicks } from './chartUtils';

export interface BarSeries {
  label: string;
  /** One value per category label. */
  data: number[];
  /** 0-based palette index. Defaults to series position. */
  colorIndex?: number;
}

export interface BarChartProps {
  series: BarSeries[];
  /** Category labels (one per data index). */
  labels: string[];
  orientation?: 'vertical' | 'horizontal';
  width?: number;
  height?: number;
  showLegend?: boolean;
  /** Show the stack total (as %) at the end of each bar. */
  showPercentLabels?: boolean;
  tickCount?: number;
  ariaLabel?: string;
}

const TICK_STYLE = { fill: CHART_TEXT_SUBTLE, fontSize: 12 } as const;

/**
 * Stacked bar chart, vertical or horizontal, built with Recharts. The stack
 * total is rendered as a percentage at the end of each bar.
 */
export function BarChart({
  series,
  labels,
  orientation = 'vertical',
  width,
  height,
  showLegend = true,
  showPercentLabels = true,
  tickCount = 8,
  ariaLabel,
}: BarChartProps) {
  const isVertical = orientation === 'vertical';

  // Stack total per category and the % of the largest stack.
  const totals = labels.map((_, j) => series.reduce((sum, s) => sum + (s.data[j] ?? 0), 0));
  const maxTotal = Math.max(...totals, 1);

  const data = labels.map((label, j) => {
    const row: Record<string, number | string> = {
      x: label,
      pctLabel: `${Math.round((totals[j] / maxTotal) * 100)}%`,
    };
    series.forEach((s, i) => {
      row[`s${i}`] = s.data[j] ?? 0;
    });
    return row;
  });

  const legendItems: LegendItem[] = series.map((s, i) => ({
    label: s.label,
    colorIndex: s.colorIndex ?? i,
  }));

  const resolvedLabel =
    ariaLabel ?? `Stacked bar chart of ${series.map((s) => s.label).join(', ')}.`;

  const lastSeriesIndex = series.length - 1;
  const resolvedWidth = width ?? 800;
  const resolvedHeight = height ?? (isVertical ? 340 : 8 + 8 + labels.length * 36);

  return (
    <div className="ld-dataviz" role="img" aria-label={resolvedLabel}>
      {showLegend && <ChartLegend items={legendItems} orientation="row" />}
      <ScaledChart refWidth={resolvedWidth} refHeight={resolvedHeight}>
        <RcBarChart
          data={data}
          width={resolvedWidth}
          height={resolvedHeight}
          layout={isVertical ? 'horizontal' : 'vertical'}
          margin={
            isVertical
              ? { top: showPercentLabels ? 24 : 12, right: 16, bottom: 4, left: 0 }
              : { top: 8, right: showPercentLabels ? 40 : 16, bottom: 0, left: 8 }
          }
        >
          {isVertical ? (
            <>
              <CartesianGrid stroke={CHART_GRID_COLOR} horizontal vertical={false} />
              <XAxis dataKey="x" type="category" tick={TICK_STYLE} tickLine={false} axisLine={false} interval={0} />
              <YAxis
                type="number"
                domain={[0, maxTotal]}
                ticks={niceTicks(0, maxTotal, tickCount)}
                tickFormatter={(v) => `${Math.round(v)}`}
                tick={TICK_STYLE}
                tickLine={false}
                axisLine={false}
                width={44}
              />
            </>
          ) : (
            <>
              <XAxis type="number" hide domain={[0, maxTotal]} />
              <YAxis dataKey="x" type="category" tick={TICK_STYLE} tickLine={false} axisLine={false} width={56} interval={0} />
            </>
          )}

          {series.map((s, i) => {
            const c = categoryColor(s.colorIndex ?? i);
            return (
              <Bar
                key={i}
                dataKey={`s${i}`}
                stackId="stack"
                fill={c.fill}
                maxBarSize={isVertical ? 56 : 24}
                isAnimationActive={false}
              >
                {showPercentLabels && i === lastSeriesIndex && (
                  <LabelList
                    dataKey="pctLabel"
                    position={isVertical ? 'top' : 'right'}
                    fill={CHART_TEXT_SUBTLE}
                    fontSize={12}
                  />
                )}
              </Bar>
            );
          })}
        </RcBarChart>
      </ScaledChart>
    </div>
  );
}
