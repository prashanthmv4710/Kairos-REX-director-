/**
 * Singleton aria-live announcer.
 *
 * A single visually-hidden `role="status"` element is lazily created and
 * appended to `<body>`. All components share it so there is never more than
 * one live region in the DOM.
 *
 * Usage:
 *   announce('Saved to favorites: Weekly list');   // polite, 500 ms delay
 *   announce('Error', { delay: 0, priority: 'assertive' });
 *   cancelAnnounce();  // cancel a pending announcement (e.g. on blur)
 */

let _el: HTMLElement | null = null;
let _timer: ReturnType<typeof setTimeout> | null = null;

function getEl(): HTMLElement {
  if (!_el || !document.body.contains(_el)) {
    _el = document.createElement('div');
    _el.setAttribute('role', 'status');
    _el.setAttribute('aria-live', 'polite');
    _el.setAttribute('aria-atomic', 'true');
    _el.style.cssText =
      'position:absolute;width:1px;height:1px;padding:0;margin:-1px;' +
      'overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
    document.body.appendChild(_el);
  }
  return _el;
}

export interface AnnounceOptions {
  /** Milliseconds to wait before updating the live region. @default 500 */
  delay?: number;
  /** @default 'polite' */
  priority?: 'polite' | 'assertive';
}

export function announce(message: string, options: AnnounceOptions = {}): void {
  const {delay = 500, priority = 'polite'} = options;

  if (_timer) clearTimeout(_timer);

  _timer = setTimeout(() => {
    const el = getEl();
    el.setAttribute('aria-live', priority);
    // Clear first so the same text re-announces if shown twice in a row.
    el.textContent = '';
    requestAnimationFrame(() => {
      el.textContent = message;
    });
  }, delay);
}

export function cancelAnnounce(): void {
  if (_timer) {
    clearTimeout(_timer);
    _timer = null;
  }
}

/** Named alias — polite live region announcement (same as the default). */
export function announcePolite(message: string, options?: Omit<AnnounceOptions, 'priority'>): void {
  announce(message, {...options, priority: 'polite'});
}

/** Named alias — assertive live region announcement (interrupts current speech). */
export function announceAssertive(message: string, options?: Omit<AnnounceOptions, 'priority'>): void {
  announce(message, {...options, priority: 'assertive'});
}
