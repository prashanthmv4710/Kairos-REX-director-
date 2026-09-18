import * as React from 'react';
import { Area, CartesianGrid, AreaChart as RcAreaChart, XAxis, YAxis } from 'recharts';
import './DataViz.css';
import { ChartLegend, LegendItem } from './ChartLegend';
import { ScaledChart } from './ScaledChart';
import { CHART_GRID_COLOR, CHART_TEXT_SUBTLE, categoryColor } from './chartTokens';
import { niceTicks } from './chartUtils';

export interface AreaSeries {
  label: string;
  data: number[];
  /** 0-based palette index. Defaults to series position. */
  colorIndex?: number;
}

export interface AreaChartProps {
  series: AreaSeries[];
  xLabels: string[];
  width?: number;
  height?: number;
  /** Smooth (monotone) curves vs sharp polylines. */
  smooth?: boolean;
  /** Show the right-hand axis (percent style in PX specs). */
  showRightAxis?: boolean;
  showLegend?: boolean;
  /** Number of horizontal gridline / tick rows. */
  tickCount?: number;
  formatLeft?: (v: number) => string;
  formatRight?: (v: number) => string;
  ariaLabel?: string;
}

const TICK_STYLE = { fill: CHART_TEXT_SUBTLE, fontSize: 12 } as const;

/** Multi-series area chart with gradient fills and dual Y axes, built with Recharts. */
export function AreaChart({
  series,
  xLabels,
  width = 800,
  height = 320,
  smooth = true,
  showRightAxis = false,
  showLegend = true,
  tickCount = 6,
  formatLeft = (v) => `${Math.round(v)}`,
  formatRight = (v) => `${Math.round(v)}%`,
  ariaLabel,
}: AreaChartProps) {
  const gid = React.useId();

  // Evenly spaced tick values across the data range (shared niceTicks helper).
  const allValues = series.flatMap((s) => s.data);
  const min = Math.min(0, ...allValues);
  const max = Math.max(...allValues, 1);
  const ticks = niceTicks(min, max, tickCount);

  // Adapt {series[], xLabels[]} → Recharts row format keyed by series index.
  const data = xLabels.map((label, j) => {
    const row: Record<string, number | string> = { x: label };
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
    ariaLabel ?? `Area chart comparing ${series.map((s) => s.label).join(', ')}.`;

  return (
    <div className="ld-dataviz" role="img" aria-label={resolvedLabel}>
      {showLegend && <ChartLegend items={legendItems} orientation="row" />}
      <ScaledChart refWidth={width} refHeight={height}>
        <RcAreaChart data={data} width={width} height={height} margin={{ top: 12, right: showRightAxis ? 8 : 16, bottom: 4, left: 0 }}>
          <defs>
            {series.map((s, i) => {
              const c = categoryColor(s.colorIndex ?? i);
              return (
                <linearGradient key={i} id={`${gid}-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c.fill} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={c.fill} stopOpacity={0.04} />
                </linearGradient>
              );
            })}
          </defs>

          {/* Solid horizontal gridlines + dashed vertical gridlines, matching the custom chart. */}
          <CartesianGrid stroke={CHART_GRID_COLOR} horizontal vertical={false} />
          <CartesianGrid stroke={CHART_GRID_COLOR} horizontal={false} vertical strokeDasharray="2 3" />

          <XAxis
            dataKey="x"
            tick={TICK_STYLE}
            tickLine={false}
            axisLine={false}
            interval={0}
          />
          <YAxis
            yAxisId="left"
            domain={[min, max]}
            ticks={ticks}
            tick={TICK_STYLE}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatLeft}
            width={44}
          />
          {showRightAxis && (
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[min, max]}
              ticks={ticks}
              tick={TICK_STYLE}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatRight}
              width={44}
            />
          )}

          {series.map((s, i) => {
            const c = categoryColor(s.colorIndex ?? i);
            return (
              <Area
                key={i}
                yAxisId="left"
                type={smooth ? 'monotone' : 'linear'}
                dataKey={`s${i}`}
                stroke={c.fill}
                strokeWidth={2.5}
                strokeLinejoin="round"
                fill={`url(#${gid}-grad-${i})`}
                fillOpacity={1}
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
            );
          })}

          {/* Recharts only draws an axis's ticks when a series references it.
              This invisible series binds the right (%) axis so its ticks render. */}
          {showRightAxis && (
            <Area
              yAxisId="right"
              dataKey="s0"
              stroke="none"
              fill="none"
              dot={false}
              activeDot={false}
              legendType="none"
              isAnimationActive={false}
            />
          )}
        </RcAreaChart>
      </ScaledChart>
    </div>
  );
}
