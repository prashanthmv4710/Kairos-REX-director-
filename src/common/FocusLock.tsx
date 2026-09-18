import * as React from 'react';

export interface FocusLockProps {
  children: React.ReactNode;
  disabled?: boolean;
  returnFocus?: boolean;
  onDeactivation?: () => void;
  [key: string]: unknown;
}

export const FocusLock: React.FC<FocusLockProps> = ({
  children,
  disabled = false,
  returnFocus = false,
  onDeactivation,
  ...rest
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const previouslyFocused = React.useRef<Element | null>(null);

  React.useEffect(() => {
    if (disabled) return;
    previouslyFocused.current = document.activeElement;
    const el = containerRef.current;
    if (!el) return;

    const focusables = el.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'
    );
    if (focusables.length > 0) focusables[0].focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    el.addEventListener('keydown', handleKeyDown);

    return () => {
      el.removeEventListener('keydown', handleKeyDown);
      onDeactivation?.();
      if (returnFocus && previouslyFocused.current instanceof HTMLElement) {
        previouslyFocused.current.focus();
      }
    };
  }, [disabled, returnFocus, onDeactivation]);

  return <div ref={containerRef} {...rest}>{children}</div>;
};

FocusLock.displayName = 'FocusLock';
