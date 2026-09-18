/**
 * focusFirstError — shared form-error focus utility.
 *
 * After a failed form submission, moves keyboard focus to the first errored
 * field in DOM order (top→bottom, left→right), or falls back to a global
 * alert container when no field errors exist.
 *
 * ## Living Design caveat — LD TextField does NOT set `aria-invalid`
 *
 * LD's TextField, TextArea, and Select components do NOT set
 * `aria-invalid="true"` on the underlying `<input>`. Error state is
 * expressed as the CSS class `ld-textfield-error` on the wrapper `<div>`.
 * This utility handles that via the CSS-class query in Strategy 2.
 * Never query `[aria-invalid="true"]` alone when the form uses LD inputs —
 * it returns null and focus falls through to `alertRef`.
 *
 * ## Usage
 *
 * ### TextFields only (most common)
 * ```tsx
 * const formRef  = React.useRef<HTMLFormElement>(null);
 * const alertRef = React.useRef<HTMLDivElement>(null);
 *
 * function handleSubmit(e: React.FormEvent) {
 *   e.preventDefault();
 *   const errs = validate(fields);
 *   setErrors(errs);
 *   if (Object.keys(errs).length > 0) {
 *     focusFirstError(formRef, alertRef, new Set(Object.keys(errs)));
 *     return;
 *   }
 *   submit();
 * }
 * ```
 *
 * ### Mixed forms (TextField + Checkbox/Radio/Switch)
 * LD Checkbox/Radio/Switch have no `error` prop and produce no
 * `ld-textfield-error` class, so the CSS query misses them. Pass
 * `directRef` when a non-TextField control is the only error:
 * ```tsx
 * const checkboxRef = React.useRef<HTMLInputElement>(null);
 * <Checkbox ref={checkboxRef} ... />   // attach directly, not via checkboxProps
 *
 * const hasTextFieldError = TEXT_FIELD_KEYS.some((k) => k in errs);
 * const checkboxOnlyError = !hasTextFieldError && Boolean(errs.terms);
 * focusFirstError(formRef, alertRef, new Set(Object.keys(errs)),
 *   checkboxOnlyError ? checkboxRef : undefined);
 * ```
 *
 * ### Global alert wrapper (always keep in DOM)
 * ```tsx
 * <div ref={alertRef} tabIndex={-1} aria-live="polite" style={{ outline: 'none' }}>
 *   {globalError && <Alert variant="error">{globalError}</Alert>}
 * </div>
 * ```
 * Keep the wrapper in the DOM unconditionally — conditionally mounting it
 * creates a timing hazard where requestAnimationFrame fires before the
 * container exists.
 *
 * ### Never disable Submit
 * Disabling the Submit button blocks keyboard users from triggering
 * validation. Keep Submit always enabled; let the form run; move focus to
 * errors. Never gate submission on `Object.keys(errors).length === 0`.
 */
/**
 * Scroll `el` into view respecting `prefers-reduced-motion`, then focus it
 * without triggering a second (instant) scroll from the browser's built-in
 * focus scroll behaviour.
 *
 * Calling `el.focus()` after `el.scrollIntoView({ behavior: 'smooth' })`
 * cancels the smooth animation — the browser performs its own instant scroll
 * to bring the element into view as part of focusing. `preventScroll: true`
 * suppresses that second scroll, so the smooth animation plays uninterrupted.
 * When the user prefers reduced motion, `scrollIntoView` uses `auto` (instant)
 * and `preventScroll` is not needed, but it is harmless.
 */
function revealAndFocus(el: HTMLElement): void {
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
  el.focus({ preventScroll: true });
}

export function focusFirstError(
  formRef: React.RefObject<HTMLFormElement | HTMLDivElement>,
  alertRef: React.RefObject<HTMLElement>,
  errorFields: Set<string>,
  /**
   * Optional: a ref to focus directly, bypassing the DOM query.
   * Use this for Checkbox/Radio/Switch controls that have no `error` prop
   * and produce no `ld-textfield-error` CSS class.
   * Attach the ref directly on the component (`<Checkbox ref={...}>`) —
   * not via `checkboxProps`/`radioProps` which are typed as
   * `ComponentPropsWithoutRef<"input">` and exclude `ref`.
   */
  directRef?: React.RefObject<HTMLElement>,
): void {
  // Defer until after React's re-render so error classes/attrs are in the DOM.
  requestAnimationFrame(() => {
    const root = formRef.current;
    if (!root) return;

    if (errorFields.size > 0) {
      // Strategy 1 — directRef (reliable for any component type)
      if (directRef?.current) {
        revealAndFocus(directRef.current);
        return;
      }

      // Strategy 2 — CSS class + aria-invalid DOM query (multi-field LD forms).
      //
      // Query priority (in order):
      //   .ld-textfield-error input    → LD TextField (no aria-invalid on input)
      //   .ld-textarea-error textarea  → LD TextArea (same pattern)
      //   [aria-invalid="true"]        → standard HTML inputs / non-LD components
      //   [data-error="true"]          → custom components opting in to this convention
      //
      // querySelector returns the first match in DOM order (top→bottom), which
      // naturally satisfies the reading-order requirement (AC-1 / AC-3).
      const firstErrField = root.querySelector<HTMLElement>(
        '.ld-textfield-error input, .ld-textarea-error textarea, [aria-invalid="true"], [data-error="true"]',
      );

      if (firstErrField) {
        revealAndFocus(firstErrField);
        return;
      }
    }

    // AC-2 — no inline errors (or errorFields is empty): focus the global alert.
    if (alertRef.current) {
      revealAndFocus(alertRef.current);
    }
  });
}
