/**
 * Structured violation types and simplified ↔ technical message mapping.
 *
 * Each scan rule produces a `Violation` with both a plain-language
 * `simplified` message (default for designers/PMs) and the original
 * `technical` message (expandable for developers). The `fix` field gives
 * an actionable suggestion suitable for agent prompts.
 */

import type {SourceLocation} from './fiber-source';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

// Axe-core rule IDs are arbitrary strings. The legacy hand-rolled rules are
// kept for reference but the type is now open so axe rule IDs map cleanly.
export type ViolationRule = string;

export type ViolationSeverity = 'error' | 'warning';

export interface Violation {
  /** Identifies which scan rule produced this violation. */
  rule: ViolationRule;
  /** Error = must fix before ship. Warning = should fix, non-blocking. */
  severity: ViolationSeverity;
  /**
   * The actual DOM element (for highlighting). Optional: session-log entries
   * deliberately drop it once a violation outlives its page (see
   * scan/session-log-store.ts) to avoid pinning a detached subtree in memory
   * for the life of the tab. Consumers should re-resolve by `selector` when
   * absent (see A11yHighlighter.resolveTarget).
   */
  element?: Element;
  /** CSS-selector-like string for re-querying / display. */
  selector: string;
  /** Human-friendly message for non-developers. */
  simplified: string;
  /** Developer-facing message with technical detail. */
  technical: string;
  /** Suggested fix action, suitable for agent prompts. */
  fix: string;
  /** Resolved JSX source location (dev only; null when unavailable). */
  source?: SourceLocation | null;
  /**
   * True when the offending element lives inside a `data-ld-a11y-demo`
   * subtree — an intentional demo defect. Demo violations are surfaced in the
   * panel for show-and-tell but excluded from the live count, FAB badge,
   * session log, route tracker, dev-server report, and fix requests.
   */
  demo?: boolean;
}

// ---------------------------------------------------------------------------
// Severity classification
// ---------------------------------------------------------------------------

const SEVERITY_MAP: Record<ViolationRule, ViolationSeverity> = {
  'missing-h1': 'error',
  'multiple-h1': 'error',
  'missing-main': 'error',
  'multiple-main': 'error',
  'heading-order': 'warning',
  'img-missing-alt': 'error',
  'img-whitespace-alt': 'error',
  'missing-accessible-name': 'error',
  'nested-interactive': 'error',
  'role-button-no-keyboard': 'error',
  'duplicate-id': 'warning',
  'form-control-no-label': 'error',
  'single-select-group': 'warning',
  'roving-tabindex': 'warning',
};

export function severityFor(rule: ViolationRule): ViolationSeverity {
  return SEVERITY_MAP[rule];
}

// ---------------------------------------------------------------------------
// Message builders — one per rule
// ---------------------------------------------------------------------------

export function missingH1(): Omit<Violation, 'element'> {
  return {
    rule: 'missing-h1',
    severity: 'error',
    selector: 'html',
    simplified: 'This page is missing a main heading. Screen readers use it to identify the page.',
    technical: 'No <h1> on the page. Wrap your page in <Page title="…"> — it renders the single required h1.',
    fix: 'Wrap the page content in <Page title="Your Page Title"> which renders the required <h1>.',
  };
}

export function multipleH1(count: number): Omit<Violation, 'element'> {
  return {
    rule: 'multiple-h1',
    severity: 'error',
    selector: 'h1',
    simplified: `This page has ${count} main headings — it should have exactly one.`,
    technical: `Found ${count} <h1> elements. Expected exactly 1. Page wrappers render the single h1 for you — remove any hand-written or duplicate <h1>.`,
    fix: 'Remove duplicate <h1> elements. The <Page> component renders the single required h1 automatically.',
  };
}

export function missingMain(): Omit<Violation, 'element'> {
  return {
    rule: 'missing-main',
    severity: 'error',
    selector: 'html',
    simplified: 'This page is missing a main content area. Assistive tools need it to skip navigation.',
    technical: 'No <main> landmark. Use <Page> as the root of your page — it renders the <main> for you.',
    fix: 'Wrap the page content in <Page> which renders the required <main> landmark.',
  };
}

export function multipleMain(count: number): Omit<Violation, 'element'> {
  return {
    rule: 'multiple-main',
    severity: 'error',
    selector: 'main',
    simplified: `This page has ${count} main content areas — it should have exactly one.`,
    technical: `Found ${count} <main> landmarks. Expected exactly 1.`,
    fix: 'Remove duplicate <main> landmarks. Use a single <Page> component as the root.',
  };
}

export function headingOrderSkip(
  currentTag: string,
  prevLevel: number,
  selector: string,
): Omit<Violation, 'element'> {
  return {
    rule: 'heading-order',
    severity: 'warning',
    selector,
    simplified: `A heading level was skipped. Headings should go in order so the page outline makes sense.`,
    technical: `Heading level skip: <${currentTag}> follows <h${prevLevel}>. Headings must not skip levels — use h${prevLevel + 1} instead. Element: ${selector}.`,
    fix: `Change <${currentTag}> to <h${prevLevel + 1}> to maintain sequential heading order.`,
  };
}

export function imgMissingAlt(selector: string, src: string): Omit<Violation, 'element'> {
  return {
    rule: 'img-missing-alt',
    severity: 'error',
    selector,
    simplified: 'This image needs a description so screen readers can announce what it shows.',
    technical: `<img> without alt attribute: ${selector} (src=${src}). Use <Image src alt="…"> or <Image src unsafeDecorative={{reason}} />.`,
    fix: `Add an alt attribute describing the image, or use unsafeDecorative={{ reason: "..." }} if purely decorative.`,
  };
}

export function imgWhitespaceAlt(selector: string): Omit<Violation, 'element'> {
  return {
    rule: 'img-whitespace-alt',
    severity: 'error',
    selector,
    simplified: 'This image has a blank description — it needs a real one or should be marked as decorative.',
    technical: `<img alt=" "> has whitespace-only alt (a silent label): ${selector}. Use a meaningful alt, or alt="" for decorative images.`,
    fix: 'Provide a meaningful alt text, or use alt="" (empty string) for decorative images.',
  };
}

export function missingAccessibleName(
  tag: string,
  selector: string,
): Omit<Violation, 'element'> {
  return {
    rule: 'missing-accessible-name',
    severity: 'error',
    selector,
    simplified: `This ${tag === 'button' ? 'button' : 'link'} has no label — assistive tools can't announce what it does.`,
    technical: `${tag} with no accessible name: ${selector}. Add text, aria-label, or wrap in IconButton with a11yLabel.`,
    fix: `Add visible text content, an aria-label attribute, or wrap icon-only ${tag}s in <IconButton a11yLabel="...">`,
  };
}

export function nestedInteractive(
  outerSelector: string,
  innerSelector: string,
): Omit<Violation, 'element'> {
  return {
    rule: 'nested-interactive',
    severity: 'error',
    selector: outerSelector,
    simplified: 'A clickable element is inside another clickable element — this breaks keyboard navigation.',
    technical: `Interactive element nested inside another: ${outerSelector} contains ${innerSelector}. This is invalid HTML and breaks keyboard/AT behavior. Flatten the structure.`,
    fix: 'Flatten the structure so interactive elements are not nested inside each other.',
  };
}

export function roleButtonNoKeyboard(selector: string): Omit<Violation, 'element'> {
  return {
    rule: 'role-button-no-keyboard',
    severity: 'error',
    selector,
    simplified: `This element acts like a button but can't be reached with a keyboard.`,
    technical: `Element with role="button" is not keyboard-focusable: ${selector}. Use <Button> or <IconButton>. Raw role="button" on a div requires tabIndex={0} + keyboard handlers.`,
    fix: 'Replace with <Button> or <IconButton>, or add tabIndex={0} and keyboard event handlers.',
  };
}

export function duplicateId(id: string, count: number): Omit<Violation, 'element'> {
  return {
    rule: 'duplicate-id',
    severity: 'warning',
    selector: `[id="${id}"]`,
    simplified: `The identifier "${id}" is used ${count} times — each should be unique for labels and references to work.`,
    technical: `Duplicate id="${id}" found ${count} times. Duplicate IDs break aria-labelledby, aria-describedby, and <label for>. Use stable unique IDs (useStableId helper).`,
    fix: `Make each id unique. Use the useStableId() hook to generate stable unique IDs.`,
  };
}

export function formControlNoLabel(selector: string): Omit<Violation, 'element'> {
  return {
    rule: 'form-control-no-label',
    severity: 'error',
    selector,
    simplified: `This form field has no label — users won't know what to type here.`,
    technical: `Form control without label: ${selector}. Wrap with <FormField> / <TextField> / <Select> — they wire label ↔ input for you.`,
    fix: 'Wrap with <FormField>, <TextField>, or <Select> which automatically connect label to input.',
  };
}

export function singleSelectGroup(
  selector: string,
  buttonCount: number,
  activeCount: number,
): Omit<Violation, 'element'> {
  return {
    rule: 'single-select-group',
    severity: 'warning',
    selector,
    simplified: `This group of ${buttonCount} options doesn't support keyboard arrow-key navigation between choices.`,
    technical: `Single-select button group without keyboard-group semantics: ${selector} contains ${buttonCount} toggle buttons with ${activeCount} active. That gives ${buttonCount} tab stops and no arrow-key navigation between options. For one-of-many UIs use <SegmentedControl> (preferred), <Radio> inside <FormGroup>, or <TabNavigation> — not <ChipGroup>+<Chip>. <ChipGroup>+<Chip> is for multi-select filter chips where each chip toggles independently.`,
    fix: 'Replace with <SegmentedControl>, <Radio> inside <FormGroup>, or <TabNavigation> for single-select patterns.',
  };
}

export function rovingTabindex(
  role: string,
  selector: string,
  focusableCount: number,
): Omit<Violation, 'element'> {
  return {
    rule: 'roving-tabindex',
    severity: 'warning',
    selector,
    simplified: `This group has ${focusableCount} items that are all individually tabbable — keyboard users expect one tab stop with arrow keys to move between items.`,
    technical: `<${role}> at ${selector} has ${focusableCount} focusable items — missing roving tabindex. Exactly one item should have tabindex=0; the rest tabindex=-1. Tab enters/exits the group as a single stop; arrow keys move focus between items.`,
    fix: 'Implement roving tabindex: set tabindex=0 on the active item and tabindex=-1 on all others. Arrow keys should move focus between items.',
  };
}

// ---------------------------------------------------------------------------
// Copy formatting
// ---------------------------------------------------------------------------

export function formatViolationForCopy(v: Violation): string {
  return `[${v.severity.toUpperCase()}] ${v.technical}\nFix: ${v.fix}`;
}

export function formatAllForCopy(violations: Violation[]): string {
  const header = `LD A11Y — ${violations.length} accessibility violation(s) at ${window.location?.href ?? ''}`;
  const body = violations
    .map((v, i) => `  ${i + 1}. [${v.severity.toUpperCase()}] ${v.technical}\n     Fix: ${v.fix}`)
    .join('\n');
  const hint =
    'HOW TO INSPECT (agent / headless):\n' +
    '  • cat .ld-a11y-report.json                      — latest violation snapshot (project root)\n' +
    '  • curl http://localhost:PORT/__ld_a11y_report   — live violation snapshot (use dev-server port)\n' +
    '  • tail the `npm run dev` stdout                 — violations are logged with a red [LD A11Y] banner';
  return `${header}\n${body}\n\n${hint}`;
}

// ---------------------------------------------------------------------------
// Fix request — serializable payload for the /__ld_a11y_fix endpoint
// ---------------------------------------------------------------------------

/** JSON-safe subset of Violation (no DOM element reference). */
export interface SerializableViolation {
  rule: ViolationRule;
  severity: ViolationSeverity;
  selector: string;
  technical: string;
  fix: string;
  /** "src/foo.tsx:42" when resolvable, else empty string. */
  source?: string;
}

export function toSerializable(v: Violation): SerializableViolation {
  return {
    rule: v.rule,
    severity: v.severity,
    selector: v.selector,
    technical: v.technical,
    fix: v.fix,
    source: v.source ? `${v.source.file}:${v.source.line}` : '',
  };
}

export interface FixRequestPayload {
  timestamp: string;
  url: string;
  violations: SerializableViolation[];
}

/** Build the POST payload for a single violation fix request. */
export function buildFixRequest(v: Violation): FixRequestPayload {
  return {
    timestamp: new Date().toISOString(),
    url: window.location?.href ?? '',
    violations: [toSerializable(v)],
  };
}

/** Build the POST payload for a batch fix request. */
export function buildFixAllRequest(vs: Violation[]): FixRequestPayload {
  return {
    timestamp: new Date().toISOString(),
    url: window.location?.href ?? '',
    violations: vs.map(toSerializable),
  };
}
