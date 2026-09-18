import * as React from 'react';
import { CartesianGrid, Line, LineChart as RcLineChart, XAxis, YAxis } from 'recharts';
import './DataViz.css';
import { ChartLegend, LegendItem } from './ChartLegend';
import { ScaledChart } from './ScaledChart';
import { CHART_GRID_COLOR, CHART_TEXT_SUBTLE, categoryColor } from './chartTokens';
import { niceTicks } from './chartUtils';

export interface LineSeries {
  label: string;
  data: number[];
  /** Render with a dashed stroke. */
  dashed?: boolean;
  /** 0-based palette index. Defaults to series position. */
  colorIndex?: number;
  /** Show a filled dot at the final data point. */
  endDot?: boolean;
}

export interface LineChartProps {
  series: LineSeries[];
  xLabels: string[];
  width?: number;
  height?: number;
  /** "sharp" = straight segments, "smooth" = curved. */
  curve?: 'sharp' | 'smooth';
  showLegend?: boolean;
  tickCount?: number;
  formatLeft?: (v: number) => string;
  ariaLabel?: string;
}

const TICK_STYLE = { fill: CHART_TEXT_SUBTLE, fontSize: 12 } as const;

/** Multi-series line chart with solid/dashed strokes and sharp/smooth curves, built with Recharts. */
export function LineChart({
  series,
  xLabels,
  width = 800,
  height = 320,
  curve = 'sharp',
  showLegend = true,
  tickCount = 8,
  formatLeft = (v) => `${Math.round(v)}`,
  ariaLabel,
}: LineChartProps) {
  const data = xLabels.map((label, j) => {
    const row: Record<string, number | string> = { x: label };
    series.forEach((s, i) => {
      row[`s${i}`] = s.data[j] ?? 0;
    });
    return row;
  });

  const lastIndex = xLabels.length - 1;

  // Evenly spaced tick values across the data range.
  const allValues = series.flatMap((s) => s.data);
  const min = Math.min(0, ...allValues);
  const max = Math.max(...allValues, 1);
  const ticks = niceTicks(min, max, tickCount);

  const legendItems: LegendItem[] = series.map((s, i) => ({
    label: s.label,
    colorIndex: s.colorIndex ?? i,
    variant: 'line',
    dashed: s.dashed,
  }));

  const resolvedLabel =
    ariaLabel ?? `Line chart comparing ${series.map((s) => s.label).join(', ')}.`;

  return (
    <div className="ld-dataviz" role="img" aria-label={resolvedLabel}>
      {showLegend && (
        <ChartLegend items={legendItems} orientation="row" className="ld-dataviz-legend--end" />
      )}
      <ScaledChart refWidth={width} refHeight={height}>
        <RcLineChart data={data} width={width} height={height} margin={{ top: 12, right: 16, bottom: 4, left: 0 }}>
          <CartesianGrid stroke={CHART_GRID_COLOR} horizontal vertical={false} />
          <XAxis dataKey="x" tick={TICK_STYLE} tickLine={false} axisLine={false} interval={0} />
          <YAxis
            domain={[min, max]}
            ticks={ticks}
            tick={TICK_STYLE}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatLeft}
            width={44}
          />

          {series.map((s, i) => {
            const c = categoryColor(s.colorIndex ?? i);
            // Reproduce `endDot`: a filled circle only at the final data point.
            const endDot = s.endDot
              ? (props: { cx?: number; cy?: number; index?: number }) => {
                  if (props.index !== lastIndex || props.cx == null || props.cy == null) {
                    return <g key={props.index} />;
                  }
                  return (
                    <circle
                      key={props.index}
                      cx={props.cx}
                      cy={props.cy}
                      r={5}
                      fill={c.fill}
                      stroke="#ffffff"
                      strokeWidth={1.5}
                    />
                  );
                }
              : false;
            return (
              <Line
                key={i}
                type={curve === 'smooth' ? 'monotone' : 'linear'}
                dataKey={`s${i}`}
                stroke={c.fill}
                strokeWidth={2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeDasharray={s.dashed ? '3 4' : undefined}
                dot={endDot}
                activeDot={false}
                isAnimationActive={false}
              />
            );
          })}
        </RcLineChart>
      </ScaledChart>
    </div>
  );
}
