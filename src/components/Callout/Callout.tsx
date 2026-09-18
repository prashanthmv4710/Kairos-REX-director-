'use client';
// @refresh reset

/**
 * @module Callout
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
 * For prop API + usage notes, read `Callout.md` in this folder
 * or run `npm run ld-kit -- show Callout`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {useStableId, invariant, applyCommonProps, getPositionStyle, CalculatePositionFn} from '../../common/helpers';
import {VisuallyHidden} from '../VisuallyHidden';
import {CSSTransition} from '../../common/CSSTransition';
import {useCSSTransition} from '../../hooks/hooks';
import './Callout.css';

// ---------------------------------------------------------------------------
// BaseCallout (inlined sub-component)
// ---------------------------------------------------------------------------

export type BaseCalloutPosition =
  | 'bottomCenter'
  | 'bottomLeft'
  | 'bottomRight'
  | 'left'
  | 'right'
  | 'topCenter'
  | 'topLeft'
  | 'topRight';

export interface BaseCalloutOwnProps {
  /**
   * Custom actions rendered, right-aligned, in the callout's footer (e.g.
   * links, secondary buttons, or a primary "Next" button for a touring
   * experience). When provided, these replace the default close button, so
   * include your own dismiss affordance if one is still needed.
   */
  actions?: React.ReactNode;
  /**
   * The props spread to the callout's close button.
   *
   * @note Ignored when `actions` is provided.
   */
  closeButtonProps?: CalloutCloseButtonProps;
  /**
   * The callback fired when the callout requests to close.
   */
  onClose: (event: React.MouseEvent) => void;
  /**
   * An optional step indicator (e.g. `"1/3"`) rendered left-aligned in the
   * callout's footer. Useful for multi-step tours.
   */
  stepIndicator?: React.ReactNode;
}

export interface BaseCalloutProps
  extends React.ComponentPropsWithoutRef<'div'>,
    BaseCalloutOwnProps {
  /**
   * The position for the callout in relation to its target.
   */
  position: BaseCalloutPosition;
}

/**
 * @private
 */
export const BaseCallout = React.forwardRef<HTMLDivElement, BaseCalloutProps>(
  (props, ref) => {
    const {
      actions,
      children,
      className,
      closeButtonProps,
      onClose,
      position,
      stepIndicator,
      ...rest
    } = props;

    return (
      <div
        className={cx('ld-callout-basecallout-baseCallout', position === 'bottomCenter' && 'ld-callout-basecallout-bottomCenter', position === 'bottomLeft' && 'ld-callout-basecallout-bottomLeft', position === 'bottomRight' && 'ld-callout-basecallout-bottomRight', position === 'left' && 'ld-callout-basecallout-left', position === 'right' && 'ld-callout-basecallout-right', position === 'topCenter' && 'ld-callout-basecallout-topCenter', position === 'topLeft' && 'ld-callout-basecallout-topLeft', position === 'topRight' && 'ld-callout-basecallout-topRight', className)}
        ref={ref}
        {...rest}
      >
        <div className={'ld-callout-basecallout-content'}>
          <div className={'ld-callout-basecallout-label'}>{children}</div>

          <div className={'ld-callout-basecallout-footer'}>
            {stepIndicator != null && (
              <span className={'ld-callout-basecallout-stepIndicator'}>
                {stepIndicator}
              </span>
            )}

            <div className={'ld-callout-basecallout-actions'}>
              {actions ?? (
                <CalloutCloseButton
                  children="Close"
                  {...closeButtonProps}
                  onClick={(event) => {
                    closeButtonProps?.onClick?.(event);

                    onClose(event);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

// ---------------------------------------------------------------------------
// CalloutCloseButton (inlined sub-component)
// ---------------------------------------------------------------------------

export type CalloutCloseButtonProps = React.ComponentPropsWithoutRef<'button'>;

/**
 * @private
 */
export const CalloutCloseButton = React.forwardRef<
  HTMLButtonElement,
  CalloutCloseButtonProps
>((props, ref) => {
  const {className, ...rest} = props;

  return (
    <button
      className={cx('ld-callout-calloutclosebutton-closeButton', className)}
      ref={ref}
      type="button"
      {...rest}
    />
  );
});

// ---------------------------------------------------------------------------
// CalloutLink (inlined sub-component)
// ---------------------------------------------------------------------------

export type CalloutLinkProps = React.ComponentPropsWithoutRef<'button'>;

/**
 * A text-link styled action for use within a `Callout`'s `actions` slot, e.g.
 * a "Skip", "Back", or "Learn more" affordance in a touring experience.
 */
export const CalloutLink = React.forwardRef<
  HTMLButtonElement,
  CalloutLinkProps
>((props, ref) => {
  const {className, ...rest} = props;

  return (
    <button
      className={cx('ld-callout-calloutlink-link', className)}
      ref={ref}
      type="button"
      {...rest}
    />
  );
});

CalloutLink.displayName = 'CalloutLink';

// ---------------------------------------------------------------------------
// CalloutLayoutManager.service (inlined sub-component)
// ---------------------------------------------------------------------------

export const getCalloutPositionStyle = ({
  position,
  referrerRef,
  triggerRef,
}: {
  position: BaseCalloutPosition;
  referrerRef: React.RefObject<HTMLElement>;
  triggerRef: React.RefObject<HTMLElement>;
}) =>
  getPositionStyle({
    calculatePosition({
      referrerHeight,
      referrerWidth,
      targetHeight,
      targetWidth,
    }) {
      let left: number;

      if (position === 'left') {
        left = -1 * referrerWidth;
      } else if (position === 'right') {
        left = targetWidth;
      } else if (position === 'bottomLeft' || position === 'topLeft') {
        left = targetWidth / 2 - referrerWidth + 24;
      } else if (position === 'bottomRight' || position === 'topRight') {
        left = targetWidth / 2 - 24;
      } else {
        left = (targetWidth - referrerWidth) / 2;
      }

      let top: number;

      if (position.startsWith('bottom')) {
        top = targetHeight;
      } else if (position.startsWith('top')) {
        top = -1 * referrerHeight;
      } else {
        top = (targetHeight - referrerHeight) / 2;
      }

      return {left, top};
    },
    referrerRef,
    targetRef: triggerRef,
  });

// ---------------------------------------------------------------------------
// CalloutLayoutManager (inlined sub-component)
// ---------------------------------------------------------------------------

export interface CalloutLayoutContainerProps
  extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * The position for the callout in relation to its target.
   */
  position: BaseCalloutPosition;
  /**
   * The trigger ref for the callout.
   */
  triggerRef: React.RefObject<HTMLElement>;
}

/**
 * @private
 */
export const CalloutLayoutManager: React.FunctionComponent<
  CalloutLayoutContainerProps
> = (props) => {
  const {className, position, triggerRef, ...rest} = props;

  const [rootStyle, setRootStyle] = React.useState<React.CSSProperties>({
    // NOTE: hide the callout until it has been mounted and positioned
    visibility: 'hidden',
  });
  const referrerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = referrerRef.current;
    if (!el) return;

    function recalculate() {
      setRootStyle(
        getCalloutPositionStyle({
          position,
          referrerRef,
          triggerRef,
        })
      );
    }

    recalculate();

    const observer = new ResizeObserver(recalculate);
    observer.observe(el);

    return () => observer.disconnect();
  }, [position, triggerRef]);

  return (
    <div
      className={cx('ld-callout-calloutlayoutmanager-layoutManager', position === 'bottomCenter' && 'ld-callout-calloutlayoutmanager-bottom', position === 'bottomLeft' && 'ld-callout-calloutlayoutmanager-bottom', position === 'bottomRight' && 'ld-callout-calloutlayoutmanager-bottom', position === 'left' && 'ld-callout-calloutlayoutmanager-left', position === 'right' && 'ld-callout-calloutlayoutmanager-right', position === 'topCenter' && 'ld-callout-calloutlayoutmanager-top', position === 'topLeft' && 'ld-callout-calloutlayoutmanager-top', position === 'topRight' && 'ld-callout-calloutlayoutmanager-top', className)}
      ref={referrerRef}
      style={rootStyle}
      {...rest}
    />
  );
};

export type CalloutPosition = BaseCalloutPosition;

export interface CalloutProps
  extends Omit<React.ComponentPropsWithoutRef<'span'>, 'className' | 'style'>,
    BaseCalloutOwnProps {
  /**
   * The accessibility label describing the content of the callout.
   *
   * @note This property is required so callout announces with context for
   * screen reader users. Ensure `a11yContentLabel` accurately describes the
   * callout's content in relation to its target.
   */
  a11yContentLabel: string;
  /**
   * The content for the callout.
   */
  children: React.ReactNode;
  /**
   * If the callout is open.
   *
   * @default false
   */
  isOpen?: boolean;
  /**
   * The position for the callout.
   *
   * @default "bottomCenter"
   */
  position?: CalloutPosition;
  /**
   * Escape-hatch class name applied to the callout's root element.
   */
  UNSAFE_className?: string;
  /**
   * Escape-hatch inline styles applied to the callout box. Use to size the
   * callout per use case — e.g. `{minWidth: 328}` for a wider touring
   * experience. The callout width is dynamic and defined by use case.
   */
  UNSAFE_style?: React.CSSProperties;
  /**
   * The trigger for the callout.
   */
  trigger: React.ReactElement;
  /**
   * The trigger ref for the callout.
   */
  triggerRef: React.RefObject<HTMLElement>;
}

/**
 * Callouts are overlays that display onboarding or coaching content.
 * *
 */
export const Callout: React.FunctionComponent<CalloutProps> = (props) => {
  const {
    a11yContentLabel,
    actions,
    children,
    className,
    closeButtonProps,
    isOpen = false,
    onClose,
    position = 'bottomCenter',
    stepIndicator,
    style,
    trigger,
    triggerRef,
    ...rest
  } = applyCommonProps(props);

  invariant(
    !!a11yContentLabel.trim(),
    '`Callout` accessibility violation. `Callout` requires an `a11yContentLabel`.'
  );

  const contentId = useStableId();
  const previousIsOpen = React.useRef(isOpen);
  const ref = React.useRef<HTMLDivElement>(null);
  const labelRef = React.useRef<HTMLElement>(null);
  const triggerId = useStableId(trigger.props.id);

  // Return focus to trigger when callout closes.
  React.useEffect(() => {
    if (!isOpen && previousIsOpen.current) {
      triggerRef.current?.focus();
    }

    previousIsOpen.current = isOpen;
  }, [isOpen, previousIsOpen, triggerRef]);

  // Move focus to the visually-hidden step label whenever the callout opens
  // or advances to a new step (a11yContentLabel changes while open).
  // This ensures screen readers announce the updated step context immediately.
  React.useEffect(() => {
    if (!isOpen) return;
    const id = setTimeout(() => labelRef.current?.focus(), 50);
    return () => clearTimeout(id);
  }, [isOpen, a11yContentLabel]);

  const {shouldMount} = useCSSTransition({
    classNames: {
      enter: 'ld-callout-enter',
      enterActive: 'ld-callout-enterActive',
      exit: 'ld-callout-exit',
      exitActive: 'ld-callout-exitActive',
    },
    in: isOpen,
    mountOnEnter: true,
    nodeRef: ref,
    timeout: 200,
    unmountOnExit: true,
  });

  return (
    <span
      className={cx('ld-callout-callout', position === 'bottomCenter' && 'ld-callout-bottomCenter', position === 'bottomLeft' && 'ld-callout-bottomLeft', position === 'bottomRight' && 'ld-callout-bottomRight', position === 'left' && 'ld-callout-left', position === 'right' && 'ld-callout-right', position === 'topCenter' && 'ld-callout-topCenter', position === 'topLeft' && 'ld-callout-topLeft', position === 'topRight' && 'ld-callout-topRight', className)}
      {...rest}
    >
      {React.cloneElement(trigger, {
        'aria-labelledby': isOpen ? `${triggerId} ${contentId}` : undefined,

        /**
         * @note Emitting `id` when Callout is server-side rendered causes
         * problems with client-side hydration when `id`s to not match. Passing
         * `child.props.id` when the callout is closed gets around the issue.
         *
         * @see {@link https://reactjs.org/docs/react-dom.html#hydrate}
         * @see {@link https://jira.walmart.com/browse/LD-2066}
         */
        id: isOpen ? triggerId : trigger.props.id,
        onClick(event: React.MouseEvent) {
          if (isOpen) {
            onClose(event);
          }

          trigger.props?.onClick?.(event);
        },
      })}

      {shouldMount && 
        <CalloutLayoutManager position={position} triggerRef={triggerRef}>
          <BaseCallout
            actions={actions}
            closeButtonProps={{
              'aria-label': `Close ${a11yContentLabel}`,
              ...closeButtonProps,
            }}
            onClose={onClose}
            ref={ref}
            position={position}
            stepIndicator={stepIndicator}
            style={style}
          >
            <VisuallyHidden ref={labelRef} tabIndex={-1} className="ld-callout-step-label">
              {a11yContentLabel}
            </VisuallyHidden>

            <span id={contentId}>{children}</span>
          </BaseCallout>
        </CalloutLayoutManager>}
    </span>
  );
};

Callout.displayName = 'Callout';
