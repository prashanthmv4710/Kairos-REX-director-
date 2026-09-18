'use client';
// @refresh reset

/**
 * @module BottomSheet
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
 * For prop API + usage notes, read `BottomSheet.md` in this folder
 * or run `npm run ld-kit -- show BottomSheet`.
 */

import * as React from 'react';
import {useStableId, applyCommonProps} from '../../common/helpers';
import {
  CloseIcon,
} from '../Icons';
import {IconButton, IconButtonButtonProps} from '../IconButton';
import {SsrBoundary} from '../SsrBoundary';
import { Overlay, OverlayProps, OverlayScrim } from '../Overlay';
import { useCSSTransition, useOnKeyDown, usePointerOutside } from '../../hooks/hooks';
import './BottomSheet.css';

// ---------------------------------------------------------------------------
// BottomSheetPortal (inlined sub-component)
// ---------------------------------------------------------------------------

export type BottomSheetCloseButtonProps = Omit<
  IconButtonButtonProps,
  | 'UNSAFE_className'
  | 'UNSAFE_style'
  | 'a11yLabel'
  | 'children'
  | 'disabled'
  | 'size'
> &
  Partial<Pick<IconButtonButtonProps, 'a11yLabel'>>;

export type BottomSheetCloseEvent =
  | React.MouseEvent<HTMLButtonElement, MouseEvent>
  | KeyboardEvent
  | MouseEvent
  | PointerEvent
  | TouchEvent;

export interface BottomSheetPortalProps
  extends Omit<OverlayProps, 'title'> {
  /**
   * The actions for the bottom sheet.
   */
  actions?: React.ReactNode;
  /**
   * The props spread to the bottom sheet's close button.
   */
  closeButtonProps?: BottomSheetCloseButtonProps;
  /**
   * The content for the bottom sheet.
   */
  children: React.ReactNode;
  /**
   * If the bottom sheet is open.
   *
   * @default false
   */
  isOpen?: boolean;
  /**
   * The callback fired when the bottom sheet requests to close.
   */
  onClose: (event: BottomSheetCloseEvent) => void;
  /**
   * The callback fired when the bottom sheet transition has ended.
   */
  onClosed?: () => void;
  /**
   * The title for the bottom sheet.
   */
  title: React.ReactNode;
}

/**
 * @private
 */
export const BottomSheetPortal: React.FunctionComponent<
  BottomSheetPortalProps
> = (props) => {
  const {
    actions,
    closeButtonProps,
    children,
    isOpen = false,
    onClose,
    onClosed,
    title,
    ...rest
  } = applyCommonProps(props);

  const overlayRef = React.useRef<HTMLDivElement>(null);
  const bottomSheetRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const titleId = useStableId();

  // When the content area overflows (becomes scrollable), add keyboard access
  // attributes so AT and keyboard-only users can scroll it.
  // ResizeObserver fires post-layout — reading scrollHeight/clientHeight inside
  // its callback does NOT trigger an additional reflow.
  // Only one observer on the outer div: its resize already reflects inner
  // content changes because the container height is constrained by CSS max-height.
  // Guard on `isOpen` so we don't attach when the sheet is closed/unmounted.
  React.useEffect(() => {
    if (!isOpen) return;
    const el = contentRef.current;
    if (!el) return;

    const sync = () => {
      const scrollable = el.scrollHeight > el.clientHeight;
      // Bail early if state hasn't changed — avoids unnecessary DOM mutations.
      const already = el.hasAttribute('tabindex');
      if (scrollable === already) return;
      if (scrollable) {
        el.tabIndex = 0;
        el.setAttribute('role', 'region');
        el.setAttribute('aria-label', 'Scrollable content');
      } else {
        el.removeAttribute('tabindex');
        el.removeAttribute('role');
        el.removeAttribute('aria-label');
      }
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);

    return () => ro.disconnect();
  }, [isOpen]);

  usePointerOutside(bottomSheetRef, onClose);
  useOnKeyDown(['Esc', 'Escape'], onClose);

  React.useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let removeListeners: (() => void) | undefined;

    const id = setTimeout(() => {
      const dialog = bottomSheetRef.current;
      if (!dialog) return;

      // Move focus to heading on open
      const heading = dialog.querySelector('h1,h2,h3,h4,h5,h6') as HTMLElement | null;
      if (heading) {
        heading.tabIndex = -1;
        heading.classList.add('ld-bottomsheet-programmatic-heading');
        heading.focus();
      } else {
        (dialog.querySelector('button') as HTMLElement | null)?.focus();
      }

      const getFocusables = () =>
        Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])',
          ),
        );

      const handleKeyDown = (e: KeyboardEvent) => {
        if (!dialog.contains(document.activeElement)) return;
        if (e.key === ' ') {
          const active = document.activeElement as HTMLElement;
          if (!active.matches('button,input,select,textarea')) e.preventDefault();
          return;
        }
        if (e.key !== 'Tab') return;
        const focusables = getFocusables();
        if (focusables.length === 0) return;
        // Stop FocusTrap (inside Overlay) from also handling Tab — its stale snapshot
        // would cause it to double-fire and skip the last focusable on every cycle.
        e.stopPropagation();
        e.preventDefault();
        const idx = focusables.indexOf(document.activeElement as HTMLElement);
        const next = e.shiftKey
          ? focusables[idx <= 0 ? focusables.length - 1 : idx - 1]
          : focusables[idx >= focusables.length - 1 ? 0 : idx + 1];
        next.focus();
      };

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
  }, [isOpen]);

  const {shouldMount} = useCSSTransition({
    classNames: {
      enter: 'ld-bottomsheet-bottomsheetportal-transitionEnter',
      enterActive: 'ld-bottomsheet-bottomsheetportal-transitionEnterActive',
      exit: 'ld-bottomsheet-bottomsheetportal-transitionExit',
      exitActive: 'ld-bottomsheet-bottomsheetportal-transitionExitActive',
    },
    in: isOpen,
    mountOnEnter: true,
    nodeRef: overlayRef,
    onExited: () => onClosed?.(),
    timeout: 900
  });

  return shouldMount && (
    <Overlay ref={overlayRef} {...rest}>
      <div className={'ld-bottomsheet-bottomsheetportal-container'}>
        <div
          aria-modal="true"
          className={'ld-bottomsheet-bottomsheetportal-bottomSheet'}
          ref={bottomSheetRef}
          role="dialog"
          {...(title && {'aria-labelledby': titleId})}
        >
          <div className={'ld-bottomsheet-bottomsheetportal-header'}>
            <IconButton
              a11yLabel={typeof title === 'string' ? `Close ${title} dialog` : 'Close dialog'}
              {...closeButtonProps}
              onClick={(event) => {
                closeButtonProps?.onClick?.(event);
                onClose(event);
              }}
              size={"medium"}
            >
              <CloseIcon />
            </IconButton>

            <h2 className={'ld-bottomsheet-bottomsheetportal-title'} id={titleId}>
              {title}
            </h2>
          </div>
          <div className={'ld-bottomsheet-bottomsheetportal-content'} ref={contentRef}>
            <div className={'ld-bottomsheet-bottomsheetportal-contentInner'}>{children}</div>
          </div>

          {actions && <div className={'ld-bottomsheet-bottomsheetportal-actionContent'}>{actions}</div>}
        </div>
      </div>
      <OverlayScrim className={'ld-bottomsheet-bottomsheetportal-scrim'} />
    </Overlay>
  );
};

export type BottomSheetProps = BottomSheetPortalProps;

/**
 * Bottom Sheets are surfaces anchored to the bottom of the screen that contain supplementary content.
 * *
 */
export const BottomSheet: React.FunctionComponent<BottomSheetProps> = (
  props
) => {
  const {isOpen, onClosed, ...rest} = props;

  const [isTransitioning, setIsTransitioning] = React.useState(isOpen);
  const previousIsOpen = React.useRef(isOpen);

  /**
   * This hook delays `isOpen` property changes such that the
   * `BottomSheetPortal` component can transition in and out.
   */


    React.useEffect(() => {
    if (previousIsOpen.current === isOpen) {
      return;
    }

    previousIsOpen.current = isOpen;

    const handle = setTimeout(() => {
      setIsTransitioning(true);
    }, 0);

    return () => clearTimeout(handle);
  }, [isOpen]);

  if (!isOpen && !isTransitioning) {
    return null;
  }

  return (
    <SsrBoundary>
      <BottomSheetPortal
        isOpen={isOpen && isTransitioning}
        onClosed={() => {
          setIsTransitioning(false);
          onClosed?.();
        }}
        {...rest}
      />
    </SsrBoundary>
  );
};

BottomSheet.displayName = 'BottomSheet';
