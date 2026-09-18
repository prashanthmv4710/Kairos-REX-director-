// ---------------------------------------------------------------------------
// Data Visualization — chart helpers
// ---------------------------------------------------------------------------

/** Generate `count` evenly spaced axis tick values between min and max. */
export function niceTicks(min: number, max: number, count: number): number[] {
  if (count <= 1) return [min];
  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, i) => min + i * step);
}
