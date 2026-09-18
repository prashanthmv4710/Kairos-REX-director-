import * as React from 'react';
import { PieChart } from './PieChart';
import type { PieChartProps } from './PieChart';

export type DonutChartProps = Omit<PieChartProps, 'innerRatio'> & {
  /** Inner radius ratio (hole size). Defaults to 0.62 to match PX. */
  innerRatio?: number;
};

/** Donut chart — a PieChart preset with a hole and optional center content. */
export function DonutChart({ innerRatio = 0.62, ...props }: DonutChartProps) {
  return <PieChart innerRatio={innerRatio} {...props} />;
}
