import type {Violation} from '../violation-messages';
import type {FixStatus} from '../useA11yScan';
import type {Bounds} from './geometry';
import type {ScanHistory} from './PanelFooter';

export interface A11yLogPanelProps {
  violations: Violation[];
  /**
   * Intentional demo defects (inside `data-ld-a11y-demo`). Rendered read-only
   * in a separate section — never counted in the tabs/FAB, never fixable.
   */
  demoViolations?: Violation[];
  /** All distinct violations seen this session (accumulated across pages). */
  sessionViolations?: Violation[];
  /** Clear the accumulated session log. */
  onClearSessionLog?: () => void;
  resolvedCount: number;
  /** Cross-route running tally shown in the footer. */
  history?: ScanHistory;
  onClose: () => void;
  onHoverViolation: (violation: Violation | null, violationNumber: number | null) => void;
  /** Request an agent fix for a single violation. */
  onRequestFix?: (violation: Violation) => Promise<FixStatus>;
  /** Request an agent fix for all violations. */
  onRequestFixAll?: () => Promise<FixStatus>;
  /** Signatures of violations with a pending fix request. */
  pendingFixes?: Set<string>;
  /** Called when the panel starts or stops being dragged/resized. */
  onDragStateChange?: (isDragging: boolean) => void;
  /**
   * Optional containment bounds (width/height of the framed embed). When set,
   * the panel positions itself with `position: absolute` inside the frame and
   * derives its default size/position and drag/resize clamps from these bounds
   * instead of `window`. Used only by the inert demo on the docs page. When
   * omitted (the production global scanner), behavior is unchanged.
   */
  bounds?: Bounds;
}
