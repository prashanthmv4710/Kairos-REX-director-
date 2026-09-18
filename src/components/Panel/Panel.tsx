'use client';
// @refresh reset

/**
 * @module Panel
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
 * For prop API + usage notes, read `Panel.md` in this folder
 * or run `npm run ld-kit -- show Panel`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {useStableId, invariant, applyCommonProps} from '../../common/helpers';
import {
  CloseIcon,
} from '../Icons';
import {IconButton, IconButtonButtonProps} from '../IconButton';
import {SsrBoundary} from '../SsrBoundary';
import { useCSSTransition, useOnKeyDown, usePointerOutside } from '../../hooks/hooks';
import { Overlay, OverlayProps, OverlayScrim } from '../Overlay';
import './Panel.css';

// ---------------------------------------------------------------------------
// PanelPortal (inlined sub-component)
// ---------------------------------------------------------------------------

export type PanelCloseButtonProps = Omit<
  IconButtonButtonProps,
  | 'UNSAFE_className'
  | 'UNSAFE_style'
  | 'a11yLabel'
  | 'children'
  | 'disabled'
  | 'size'
> &
  Partial<Pick<IconButtonButtonProps, 'a11yLabel'>>;

export type PanelCloseEvent =
  | React.MouseEvent<HTMLButtonElement, MouseEvent>
  | KeyboardEvent
  | MouseEvent
  | PointerEvent
  | TouchEvent;

export type PanelPosition = 'left' | 'right';

export type PanelSize = 'large' | 'medium' | 'small';

export interface PanelPortalProps
  extends Omit<OverlayProps, 'title'> {
  /**
   * The actions for the panel.
   */
  actions?: React.ReactNode;
  /**
   * The content for the panel.
   */
  children: React.ReactNode;
  /**
   * The props spread to the panel's close button.
   */
  closeButtonProps?: PanelCloseButtonProps;
  /**
   * If the Panel is open.
   */
  isOpen: boolean;
  /**
   * The callback fired when the panel requests to close.
   */
  onClose: (event: PanelCloseEvent) => void;
  /**
   * The callback fired when the panel transition has ended.
   */
  onClosed?: () => void;
  /**
   * Whether the dimming scrim renders behind the panel. Set to `false` for a
   * non-modal panel meant to sit alongside content the person is still meant
   * to see and interact with (e.g. a live-editing config panel next to the
   * preview it controls) rather than block it. Click-outside-to-close and
   * Escape-to-close both keep working regardless — `usePointerOutside`
   * handles that independently of the scrim.
   *
   * @default true
   */
  hasScrim?: boolean;
  /**
   * The position for the panel.
   *
   * @default "left"
   */
  position?: PanelPosition;
  /**
   * The size for the panel.
   *
   * @default "small"
   */
  size?: PanelSize;
  /**
   * The title for the panel.
   */
  title: React.ReactNode;
}

/**
 * @private
 */
export const PanelPortal: React.FunctionComponent<PanelPortalProps> = (
  props
) => {
  const {
    actions,
    children,
    closeButtonProps,
    onClose,
    onClosed,
    hasScrim = true,
    isOpen,
    position = 'left',
    size = 'small',
    title,
    ...rest
  } = applyCommonProps(props);

  invariant(!!title, 'Required property `title` not provided.');

  const {onClick: closeButtonOnClick, ...closeButtonRest} = closeButtonProps || {};

  const overlayRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const titleId = useStableId();
  const triggerRef = React.useRef<Element | null>(null);

  // Capture the trigger before any effects move focus away.
  // useLayoutEffect fires synchronously after DOM mutations, before useEffect.
  React.useLayoutEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement;
    }
  }, [isOpen]);

  const handleClose = React.useCallback((event: PanelCloseEvent) => {
    onClose(event);
    // Return focus to the element that opened the panel
    requestAnimationFrame(() => {
      (triggerRef.current as HTMLElement | null)?.focus();
    });
  }, [onClose]);

  usePointerOutside(panelRef, handleClose);
  useOnKeyDown(['Esc', 'Escape'], handleClose);

  // Lock body scroll while open
  React.useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  // When the content area overflows, expose it to keyboard/AT users
  React.useEffect(() => {
    if (!isOpen) return;
    const el = contentRef.current;
    if (!el) return;

    const sync = () => {
      const scrollable = el.scrollHeight > el.clientHeight;
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

  const {shouldMount} = useCSSTransition({
    classNames:{
      enter: 'ld-panel-panelportal-transitionEnter',
      enterActive: 'ld-panel-panelportal-transitionEnterActive',
      exit: 'ld-panel-panelportal-transitionExit',
      exitActive: 'ld-panel-panelportal-transitionExitActive',
    },
    in: isOpen,
    mountOnEnter: true,
    nodeRef: overlayRef,
    onExited: () => onClosed?.(),
    timeout: 300
  });

  // Move focus to dialog title after the slide-in transition completes (300 ms)
  React.useLayoutEffect(() => {
    if (!shouldMount) return;
    const handle = setTimeout(() => {
      (document.getElementById(titleId) as HTMLElement | null)?.focus();
    }, 310);
    return () => clearTimeout(handle);
  }, [shouldMount, titleId]);

  return shouldMount && (
      <Overlay ref={overlayRef} {...rest}>
        <div
          className={cx('ld-panel-panelportal-container', position === 'left' && 'ld-panel-panelportal-left', position === 'right' && 'ld-panel-panelportal-right')}
        >
          <div
            aria-labelledby={titleId}
            aria-modal="true"
            className={cx('ld-panel-panelportal-panel', size === 'small' && 'ld-panel-panelportal-small', size === 'medium' && 'ld-panel-panelportal-medium', size === 'large' && 'ld-panel-panelportal-large')}
            ref={panelRef}
            role="dialog"
          >
            <div className={'ld-panel-panelportal-header'}>
              <IconButton
                a11yLabel={typeof title === 'string' ? `Close ${title} dialog` : 'Close dialog'}
                {...closeButtonRest}
                onClick={(event) => {
                  closeButtonOnClick?.(event);
                  handleClose(event);
                }}
                size={"medium"}
              >
                <CloseIcon />
              </IconButton>

              <h2 className={'ld-panel-panelportal-title'} id={titleId} tabIndex={-1}>
                {title}
              </h2>
            </div>

            <div className={'ld-panel-panelportal-content'} ref={contentRef}>
              <div className={'ld-panel-panelportal-contentInner'}>{children}</div>
            </div>

            {actions && <div className={'ld-panel-panelportal-actionContent'}>{actions}</div>}
          </div>
        </div>
        {hasScrim && <OverlayScrim className={'ld-panel-panelportal-scrim'} />}
      </Overlay>
  );
};

export type PanelProps = PanelPortalProps;

/**
 * Panels provide supplemental information or form inputs that relate to the primary canvas.
 */
export const Panel: React.FunctionComponent<PanelProps> = (props) => {
  const {isOpen, onClosed, ...rest} = props;

  const [isTransitioning, setIsTransitioning] = React.useState(isOpen);
  const previousIsOpen = React.useRef(isOpen);

  /**
   * This hook delays `isOpen` property changes such that the
   * `Panel` component can transition in and out.
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
      <PanelPortal
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

Panel.displayName = 'Panel';
