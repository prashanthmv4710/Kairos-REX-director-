/**
 * usePopoverThreshold — decides when the proactive violation popover shows.
 *
 * The FAB badge always shows the live count silently; the popover is
 * assertive, so it's throttled: it fires at most once per "climb above
 * POPOVER_THRESHOLD" crossing, and re-arms once the count drops back below.
 */

import * as React from 'react';
import type {Violation} from '../violation-messages';

// "You've accumulated a lot" nudge threshold — not every new issue, just once
// the total reaches this many.
export const POPOVER_THRESHOLD = 10;

/**
 * Pure decision: has the count dropped low enough to re-arm (and hide an
 * already-open popover)? Extracted from the hook below so this — the actual
 * threshold logic — is unit-testable without a React renderer.
 */
export function shouldRearm(violationCount: number): boolean {
  return violationCount < POPOVER_THRESHOLD;
}

/**
 * Pure decision: should the popover fire for this scan tick? Fires at most
 * once per "climb above POPOVER_THRESHOLD" crossing — `armed` is true once
 * it has already fired for the current crossing, and is reset by
 * `shouldRearm` becoming true.
 */
export function shouldShowPopover(params: {
  violationCount: number;
  hasFreshViolations: boolean;
  armed: boolean;
}): boolean {
  return (
    params.hasFreshViolations
    && params.violationCount >= POPOVER_THRESHOLD
    && !params.armed
  );
}

export interface PopoverThreshold {
  showPopover: boolean;
  setShowPopover: React.Dispatch<React.SetStateAction<boolean>>;
}

export function usePopoverThreshold(
  violationCount: number,
  newViolations: Violation[],
): PopoverThreshold {
  const [showPopover, setShowPopover] = React.useState(false);
  const armedRef = React.useRef(false);

  // Re-arm once the count drops back below the threshold, and hide an
  // already-open popover — otherwise it can keep displaying violations that
  // have since been fixed until the user manually dismisses it.
  React.useEffect(() => {
    if (shouldRearm(violationCount)) {
      armedRef.current = false;
      setShowPopover(false);
    }
  }, [violationCount]);

  // Fire at most once per crossing, only when new violations just appeared.
  React.useEffect(() => {
    if (shouldShowPopover({violationCount, hasFreshViolations: newViolations.length > 0, armed: armedRef.current})) {
      armedRef.current = true;
      setShowPopover(true);
    }
  }, [newViolations, violationCount]);

  return {showPopover, setShowPopover};
}
