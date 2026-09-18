'use client';
// @refresh reset

/**
 * @module AlertDialog
 *
 * # CRITICAL AGENT DIRECTIVE - HARD STOP
 * 
 * This file is read-only output. Treat it as immutable.
 * 
 * - NEVER edit this file directly.
 * - NEVER apply "quick fixes" in this file.
 * - NEVER reformat, refactor, or rewrite content in place.
 * - NEVER treat this file as the source of truth.
 * 
 * If behavior must change, modify the upstream source of this content (the canonical source), not this copy.
 * 
 * Any direct edits in this file are invalid and must be rejected.
 *
 * For prop API + usage notes, read `AlertDialog.md` in this folder
 * or run `npm run ld-kit -- show AlertDialog`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import type {CommonProps} from '../../common/helpers';
import {Modal} from '../Modal';
import type {ModalSize, ModalCloseEvent} from '../Modal';

import './AlertDialog.css';

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

interface AlertDialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AlertDialogCtx = React.createContext<AlertDialogContextValue | null>(null);

function useAlertDialogCtx() {
  const ctx = React.useContext(AlertDialogCtx);
  if (!ctx) throw new Error('AlertDialog compound components must be used within <AlertDialog>');
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Root                                                               */
/* ------------------------------------------------------------------ */

export interface AlertDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function AlertDialog({open: controlledOpen, defaultOpen = false, onOpenChange, children}: AlertDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isOpen = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;

  const handleChange = React.useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [controlledOpen, onOpenChange],
  );

  return (
    <AlertDialogCtx.Provider value={{open: isOpen, onOpenChange: handleChange}}>
      {children}
    </AlertDialogCtx.Provider>
  );
}
AlertDialog.displayName = 'AlertDialog';

/* ------------------------------------------------------------------ */
/*  Trigger                                                            */
/* ------------------------------------------------------------------ */

export interface AlertDialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, CommonProps {
  asChild?: boolean;
}

const AlertDialogTrigger = React.forwardRef<HTMLButtonElement, AlertDialogTriggerProps>(
  ({onClick, children, asChild, UNSAFE_className, UNSAFE_style, ...props}, ref) => {
    const {onOpenChange} = useAlertDialogCtx();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      onOpenChange(true);
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        ref,
        onClick: handleClick,
      });
    }

    return (
      <button
        ref={ref}
        type="button"
        className={UNSAFE_className}
        style={UNSAFE_style}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  },
);
AlertDialogTrigger.displayName = 'AlertDialogTrigger';

/* ------------------------------------------------------------------ */
/*  Content — wraps Modal, disabling Escape & outside-click close      */
/* ------------------------------------------------------------------ */

export interface AlertDialogContentProps extends CommonProps {
  /**
   * The body content for the alert dialog.
   */
  children: React.ReactNode;
  /**
   * The title for the alert dialog.
   */
  title: React.ReactNode;
  /**
   * The actions (buttons) rendered in the footer area.
   */
  actions?: React.ReactNode;
  /**
   * The size for the alert dialog. Matches Modal's size prop.
   *
   * @default "small"
   */
  size?: ModalSize;
}

const AlertDialogContent: React.FunctionComponent<AlertDialogContentProps> = (props) => {
  const {children, title, actions, size = 'small', UNSAFE_className, UNSAFE_style} = props;
  const {open} = useAlertDialogCtx();
  const innerRef = React.useRef<HTMLDivElement>(null);

  const noop = React.useCallback((_event: ModalCloseEvent) => {}, []);

  React.useEffect(() => {
    if (!open) return;

    // Lock body scroll while dialog is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let removeListeners: (() => void) | undefined;

    // Modal mounts its portal after a setTimeout(0); schedule after that.
    const id = setTimeout(() => {
      const el = innerRef.current;
      if (!el) return;
      const dialog = el.closest('[role="dialog"]') as HTMLElement | null;
      if (!dialog) return;

      // Move focus to heading (tabIndex=-1) or first button
      const heading = dialog.querySelector('h1,h2,h3,h4,h5,h6') as HTMLElement | null;
      if (heading) {
        heading.tabIndex = -1;
        heading.classList.add('ld-alert-dialog-programmatic-heading');
        heading.focus();
      } else {
        (dialog.querySelector('button') as HTMLElement | null)?.focus();
      }

      // Focus trap — exclude the modal header (close button refuses programmatic focus
      // when inside Overlay's FocusTrap). AlertDialog per WAI-ARIA APG cycles only
      // through the action buttons (content + footer area).
      const getFocusables = () =>
        Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])',
          ),
        ).filter(el => !el.closest('.ld-modal-modalportal-header'));

      const handleKeyDown = (e: KeyboardEvent) => {
        if (!dialog.contains(document.activeElement)) return;
        // Prevent background scroll when Space is pressed on a non-interactive element (e.g. heading)
        if (e.key === ' ') {
          const active = document.activeElement as HTMLElement;
          const isInteractive = active.matches('button,input,select,textarea');
          if (!isInteractive) e.preventDefault();
          return;
        }
        if (e.key !== 'Tab') return;
        const focusables = getFocusables();
        if (focusables.length === 0) { heading?.focus(); return; }
        e.preventDefault();
        const idx = focusables.indexOf(document.activeElement as HTMLElement);
        const next = e.shiftKey
          ? focusables[idx <= 0 ? focusables.length - 1 : idx - 1]
          : focusables[idx >= focusables.length - 1 ? 0 : idx + 1];
        next.focus();
      };

      // If focus escapes the dialog (e.g. scrim click moves focus to body),
      // snap it back. Uses focusout + setTimeout(0) to wait until the browser
      // has settled focus before checking — this also works when relatedTarget is null.
      let focusReturnTimer: ReturnType<typeof setTimeout>;
      const handleFocusOut = (e: FocusEvent) => {
        if (dialog.contains(e.relatedTarget as Node)) return;
        focusReturnTimer = setTimeout(() => {
          if (!dialog.contains(document.activeElement)) {
            if (heading) { heading.focus(); } else { getFocusables()[0]?.focus(); }
          }
        }, 0);
      };

      document.addEventListener('keydown', handleKeyDown, true);
      dialog.addEventListener('focusout', handleFocusOut);
      removeListeners = () => {
        document.removeEventListener('keydown', handleKeyDown, true);
        dialog.removeEventListener('focusout', handleFocusOut);
        clearTimeout(focusReturnTimer);
      };
    }, 50);

    return () => {
      clearTimeout(id);
      removeListeners?.();
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <Modal
      isOpen={open}
      onClose={noop}
      title={title}
      size={size}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...{UNSAFE_className: cx('ld-alert-dialog-modal', UNSAFE_className), UNSAFE_style} as any}
      actions={actions}
    >
      <div ref={innerRef}>{children}</div>
    </Modal>
  );
};
AlertDialogContent.displayName = 'AlertDialogContent';

/* ------------------------------------------------------------------ */
/*  Action                                                             */
/* ------------------------------------------------------------------ */

export interface AlertDialogActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, CommonProps {
  variant?: 'primary' | 'destructive';
}

const AlertDialogAction = React.forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  ({children, variant = 'primary', UNSAFE_className, UNSAFE_style, onClick, ...props}, ref) => {
    const {onOpenChange} = useAlertDialogCtx();

    return (
      <button
        ref={ref}
        type="button"
        className={cx(
          'ld-alert-dialog-btn',
          'ld-alert-dialog-action',
          variant === 'destructive' && 'ld-alert-dialog-action--destructive',
          UNSAFE_className,
        )}
        style={UNSAFE_style}
        onClick={(e) => {
          onClick?.(e);
          onOpenChange(false);
        }}
        {...props}
      >
        {children}
      </button>
    );
  },
);
AlertDialogAction.displayName = 'AlertDialogAction';

/* ------------------------------------------------------------------ */
/*  Cancel                                                             */
/* ------------------------------------------------------------------ */

export interface AlertDialogCancelProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, CommonProps {}

const AlertDialogCancel = React.forwardRef<HTMLButtonElement, AlertDialogCancelProps>(
  ({children, UNSAFE_className, UNSAFE_style, onClick, ...props}, ref) => {
    const {onOpenChange} = useAlertDialogCtx();

    return (
      <button
        ref={ref}
        type="button"
        className={cx('ld-alert-dialog-btn', 'ld-alert-dialog-cancel', UNSAFE_className)}
        style={UNSAFE_style}
        onClick={(e) => {
          onClick?.(e);
          onOpenChange(false);
        }}
        {...props}
      >
        {children}
      </button>
    );
  },
);
AlertDialogCancel.displayName = 'AlertDialogCancel';

/* ------------------------------------------------------------------ */
/*  Exports                                                            */
/* ------------------------------------------------------------------ */

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
};
