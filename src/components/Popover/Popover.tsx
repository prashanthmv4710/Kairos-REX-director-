'use client';
// @refresh reset

/**
 * @module Popover
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
 * For prop API + usage notes, read `Popover.md` in this folder
 * or run `npm run ld-kit -- show Popover`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {useStableId, applyCommonProps, getPositionStyle, CalculatePositionFn, usePointerOutside, useOnKeyDown} from '../../common/helpers';
import {VisuallyHidden} from '../VisuallyHidden';
import {IconButton} from '../IconButton/IconButton';
import {XIcon} from '../Icons/Icons';
import './Popover.css';
// ---------------------------------------------------------------------------
// BasePopover (inlined sub-component)
// ---------------------------------------------------------------------------

export type PopoverNubbin =
  | 'bottomCenter'
  | 'bottomLeft'
  | 'bottomRight'
  | 'left'
  | 'right'
  | 'topCenter'
  | 'topLeft'
  | 'topRight';

export interface BasePopoverProps
  extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * The content for the base popover.
   */
  children: React.ReactNode;
  /**
   * The nubbin for the base popover.
   */
  nubbin?: PopoverNubbin;
}

/**
 * @private
 */
export const BasePopover: React.FunctionComponent<BasePopoverProps> = (
  props
) => {
  const {children, className, nubbin, ...rest} = props;

  return (
    <div
      className={cx('ld-popover-basepopover-popover', nubbin && 'ld-popover-basepopover-nubbin', nubbin === 'bottomCenter' && 'ld-popover-basepopover-bottomCenter', nubbin === 'bottomLeft' && 'ld-popover-basepopover-bottomLeft', nubbin === 'bottomRight' && 'ld-popover-basepopover-bottomRight', nubbin === 'left' && 'ld-popover-basepopover-left', nubbin === 'right' && 'ld-popover-basepopover-right', nubbin === 'topCenter' && 'ld-popover-basepopover-topCenter', nubbin === 'topLeft' && 'ld-popover-basepopover-topLeft', nubbin === 'topRight' && 'ld-popover-basepopover-topRight', className)}
      {...rest}
    >
      <div className={'ld-popover-basepopover-content'}>{children}</div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// PopoverFocusGuard (inlined sub-component)
// ---------------------------------------------------------------------------

/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
interface PopoverFocusGuardProps extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * The accessibility label for the popover focus guard's content.
   */
  a11yContentLabel: string;
  /**
   * The content for the focus guard.
   */
  children: React.ReactNode;
  /**
   * ID to apply to the visually-hidden heading so the dialog surface can
   * reference it via aria-labelledby.
   */
  labelId: string;
  /**
   * The callback fired when the focus guard is focused.
   */
  onGuard: (event: React.FocusEvent<HTMLDivElement>) => void;
}

/**
 * @private
 */
export const PopoverFocusGuard: React.FunctionComponent<
  PopoverFocusGuardProps
> = (props) => {
  const {a11yContentLabel, children, labelId, onGuard, ...rest} = props;

  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const focusableNodes = ref.current?.querySelectorAll<HTMLElement>(
      // @see {@link https://github.com/theKashey/focus-lock/blob/125a50bc53fdc2cbb7705327790ecff4f3289ba1/src/utils/tabbables.ts#L4-L24}
      // [data-popover-close] excluded — close button should not receive auto-focus
      'a[href]:not([data-popover-close]), button:enabled:not([data-popover-close]), input:enabled:not([type=hidden]), select:enabled, textarea:enabled, [tabindex]:not([data-popover-close]), [autofocus]'
    );

    // NOTE: first and last node are focus guards, second node will be the first focusable item.
    const handle = setTimeout(() => focusableNodes?.[1].focus(), 0);

    return () => clearTimeout(handle);
  }, []);

  return (
    <div ref={ref} style={{position: 'relative'}} {...rest}>
      <div tabIndex={0} onFocus={onGuard} />
      <h2 className={'ld-popover-popoverfocusguard-a11yContentLabel'} id={labelId} tabIndex={-1}>
        <VisuallyHidden>{a11yContentLabel}</VisuallyHidden>
      </h2>
      {children}
      <div tabIndex={0} onFocus={onGuard} />
    </div>
  );
};

// ---------------------------------------------------------------------------
// PopoverLayoutManager.service (inlined sub-component)
// ---------------------------------------------------------------------------

export const getPopoverPositionStyle = ({
  popoverRef,
  position,
  triggerRef,
}: {
  popoverRef: React.RefObject<HTMLDivElement>;
  position: PopoverPosition;
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
      let top: number;

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

      if (position.startsWith('bottom')) {
        top = targetHeight;
      } else if (position.startsWith('top')) {
        top = -1 * referrerHeight;
      } else {
        top = (targetHeight - referrerHeight) / 2;
      }

      return {left, top};
    },
    referrerRef: popoverRef,
    targetRef: triggerRef,
  });

// ---------------------------------------------------------------------------
// PopoverLayoutManager (inlined sub-component)
// ---------------------------------------------------------------------------

export type PopoverPosition =
  | 'bottomCenter'
  | 'bottomLeft'
  | 'bottomRight'
  | 'left'
  | 'right'
  | 'topCenter'
  | 'topLeft'
  | 'topRight';

export interface PopoverLayoutManagerProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'content'> {
  /**
   * The accessibility label for the popover's content.
   *
   * @default "Start of expanded content"
   */
  a11yContentLabel?: string;
  /**
   * The props spread to the base popover's element.
   *
   * @default {}
   */
  basePopoverProps?: React.DetailedHTMLProps<
    React.ComponentPropsWithoutRef<'div'>,
    HTMLDivElement
  >;
  /**
   * The content for the popover.
   */
  content: React.ReactNode;
  /**
   * If the popover has a nubbin.
   *
   * @default false
   */
  hasNubbin?: boolean;
  /**
   * The callback fired when the popover requests to close.
   */
  onClose: (
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FocusEvent<HTMLDivElement>
      | PointerEvent
      | MouseEvent
      | TouchEvent
      | KeyboardEvent
  ) => void;
  /**
   * The position for the popover.
   *
   * @default "bottomCenter"
   */
  position?: PopoverPosition;
  /**
   * The trigger ref for the popover.
   */
  triggerRef: React.RefObject<HTMLElement>;
}

/**
 * @private
 */
export const PopoverLayoutManager: React.FunctionComponent<
  PopoverLayoutManagerProps
> = (props) => {
  const {
    a11yContentLabel = 'Start of expanded content',
    basePopoverProps = {},
    className,
    content,
    hasNubbin = false,
    onClose,
    position = 'bottomCenter',
    triggerRef,
    ...rest
  } = props;

  const [popoverStyle, setPopoverStyle] = React.useState<React.CSSProperties>({
    // NOTE: hide the popover until it has been mounted and positioned
    visibility: 'hidden',
  });
  const surfaceRef = React.useRef<HTMLDivElement>(null);
  const labelId = useStableId();

  const onCloseWithFocusReturn = React.useCallback(
    (event: React.FocusEvent<HTMLDivElement> | KeyboardEvent) => {
      triggerRef.current?.focus();

      onClose(event);
    },
    [triggerRef, onClose]
  );

  usePointerOutside([surfaceRef, triggerRef], onClose);
  useOnKeyDown(['Esc', 'Escape'], onCloseWithFocusReturn);

  React.useEffect(() => {
    const positionStyle = getPopoverPositionStyle({
      popoverRef: surfaceRef,
      position,
      triggerRef,
    });

    setPopoverStyle(positionStyle);
  }, [surfaceRef, position, triggerRef]);

  React.useEffect(() => {
    const onResize = () => {
      const positionStyle = getPopoverPositionStyle({
        popoverRef: surfaceRef,
        position,
        triggerRef,
      });

      setPopoverStyle(positionStyle);
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [surfaceRef, position, triggerRef]);

  const nubbin: PopoverNubbin = {
    bottomCenter: 'topCenter' as const,
    bottomLeft: 'topRight' as const,
    bottomRight: 'topLeft' as const,
    left: 'right' as const,
    right: 'left' as const,
    topCenter: 'bottomCenter' as const,
    topLeft: 'bottomRight' as const,
    topRight: 'bottomLeft' as const,
  }[position];

  return (
    <div
      aria-labelledby={labelId}
      aria-modal="true"
      className={cx('ld-popover-popoverlayoutmanager-layoutManager', position === 'bottomCenter' && 'ld-popover-popoverlayoutmanager-bottomCenter', position === 'bottomLeft' && 'ld-popover-popoverlayoutmanager-bottomLeft', position === 'bottomRight' && 'ld-popover-popoverlayoutmanager-bottomRight', position === 'left' && 'ld-popover-popoverlayoutmanager-left', position === 'right' && 'ld-popover-popoverlayoutmanager-right', position === 'topCenter' && 'ld-popover-popoverlayoutmanager-topCenter', position === 'topLeft' && 'ld-popover-popoverlayoutmanager-topLeft', position === 'topRight' && 'ld-popover-popoverlayoutmanager-topRight', hasNubbin && 'ld-popover-popoverlayoutmanager-hasNubbin', className)}
      ref={surfaceRef}
      role="dialog"
      style={popoverStyle}
      {...rest}
    >
      <PopoverFocusGuard
        a11yContentLabel={a11yContentLabel}
        labelId={labelId}
        onGuard={onCloseWithFocusReturn}
      >
        <BasePopover {...(hasNubbin && {nubbin})} {...basePopoverProps}>
          {content}
          <IconButton
            a11yLabel="Close dialog"
            UNSAFE_className="ld-popover-closeButton"
            data-popover-close
            size="xsmall"
            variant="ghost"
            onClick={() => {
              triggerRef.current?.focus();
              onClose(new KeyboardEvent('keydown'));
            }}
          >
            <XIcon />
          </IconButton>
        </BasePopover>
      </PopoverFocusGuard>
    </div>
  );
};

// PopoverPosition is defined above in this file

export interface PopoverProps
  extends PopoverLayoutManagerProps,
    Omit<
      React.ComponentPropsWithoutRef<'div'>,
      'className' | 'content' | 'style'
    > {
  /**
   * The trigger for the popover.
   */
  children: React.ReactElement;
  /**
   * If the popover is open.
   *
   * @default false
   */
  isOpen?: boolean;
}

/**
 * Popovers are overlays that display contextual content on demand.
 * *
 */
export const Popover: React.FunctionComponent<PopoverProps> = (props) => {
  const {
    a11yContentLabel,
    basePopoverProps,
    children,
    className,
    content,
    hasNubbin,
    isOpen = false,
    onClose,
    position,
    triggerRef,
    ...rest
  } = applyCommonProps(props);

  const child = React.Children.only(children);

  const surfaceId = useStableId();

  return (
    <div className={cx('ld-popover-popover', className)} {...rest}>
      {React.cloneElement(child, {
        'aria-controls': surfaceId,
        'aria-expanded': isOpen,
        'aria-haspopup': 'dialog',
      })}

      <div id={surfaceId}>
        {isOpen && (
          <PopoverLayoutManager
            a11yContentLabel={a11yContentLabel}
            basePopoverProps={basePopoverProps}
            content={content}
            hasNubbin={hasNubbin}
            onClose={onClose}
            position={position}
            triggerRef={triggerRef}
          />
        )}
      </div>
    </div>
  );
};

Popover.displayName = 'Popover';
