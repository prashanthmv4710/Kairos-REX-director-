import * as React from 'react';

export interface ScaledChartProps {
  /** Nominal design width — must match the child Recharts chart's `width`. */
  refWidth: number;
  /** Nominal design height — must match the child Recharts chart's `height`. */
  refHeight: number;
  children: React.ReactNode;
}

/**
 * Renders a fixed-size Recharts chart and CSS-scales it to fill the container
 * width, so strokes, fonts, and dots all scale together with the chart — the way
 * an SVG with `viewBox="0 0 800 320"` displayed at `width:100%` would. A CSS
 * `transform: scale(containerWidth / refWidth)` is mathematically identical to
 * that viewBox scaling, so the chart keeps consistent proportions (2.5px strokes,
 * 12px labels, r5 dots at the reference width) at every container width instead
 * of rendering at literal pixel sizes the way a ResponsiveContainer would.
 *
 * The child must be a Recharts chart with explicit `width={refWidth}` and
 * `height={refHeight}` (not a ResponsiveContainer).
 */
export function ScaledChart({ refWidth, refHeight, children }: ScaledChartProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(refWidth);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(el.getBoundingClientRect().width || refWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [refWidth]);

  const scale = width / refWidth;

  return (
    <div ref={ref} style={{ width: '100%', height: refHeight * scale, overflow: 'visible' }}>
      <div
        style={{
          width: refWidth,
          height: refHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  );
}
