// @refresh reset

/**
 * @module Nudge
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
 * For prop API + usage notes, read `Nudge.md` in this folder
 * or run `npm run ld-kit -- show Nudge`.
 */

import * as React from 'react';
import {announce} from '../../common/announce';
import {IconButton, IconButtonButtonProps} from '../IconButton';

import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {
  CloseIcon,
} from '../Icons';
// ---------------------------------------------------------------------------
// NudgeCloseButton (inlined sub-component)
// ---------------------------------------------------------------------------

export type NudgeCloseButtonProps = Omit<
  IconButtonButtonProps,
  'UNSAFE_className' | 'UNSAFE_style' | 'a11yLabel' | 'children' | 'size'
> &
  Partial<Pick<IconButtonButtonProps, 'a11yLabel'>>;

/**
 * @private
 */
export const NudgeCloseButton: React.FunctionComponent<
  NudgeCloseButtonProps
> = (props) => {
  const {className, ...rest} = applyCommonProps(props);

  return (
    <IconButton
      UNSAFE_className={cx('ld-nudge-nudgeclosebutton-closeButton', className)}
      a11yLabel="Close"
      size={"medium"}
      {...rest}
    >
      <CloseIcon />
    </IconButton>
  );
};

import {Body} from '../Text';
import './Nudge.css';
export interface NudgeProps
  extends Omit<
      React.ComponentPropsWithoutRef<'div'>,
      'className' | 'style' | 'title'
    > {
  /**
   * The actions for the nudge.
   */
  actions?: React.ReactNode;
  /**
   * The content for the nudge.
   */
  children: React.ReactNode;
  /**
   * The props spread to the nudge's close button.
   */
  closeButtonProps?: NudgeCloseButtonProps;
  /**
   * Accessible label for the leading icon slot. Pass when the icon is
   * meaningful and not described by adjacent text (e.g. a warning icon
   * that conveys urgency). Omit or leave empty for decorative icons.
   */
  leadingIconLabel?: string;
  /**
   * The leading content for the nudge.
   */
  leading?: React.ReactNode;
  /**
   * The callback fired when the nudge requests to close.
   */
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * The title for the nudge.
   */
  title: React.ReactNode;
  /**
   * Heading level rendered for the title. Use when the nudge title should
   * participate in the page's document outline (e.g. `'h2'`, `'h3'`).
   * Defaults to a styled `<span>` (no heading semantics).
   * @default 'span'
   */
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
}

/**
 * Nudges are used to remind or provide instructions for the next-step in a process. The information they provide should not be required for a user to complete a task.
 * *
 */
export const Nudge: React.FunctionComponent<NudgeProps> = (props) => {
  const {
    actions,
    closeButtonProps = {},
    children,
    className,
    leading,
    leadingIconLabel,
    onClose,
    title,
    titleAs = 'span',
    ...rest
  } = applyCommonProps(props);

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    const titleText = typeof title === 'string' ? title : 'Nudge';
    announce(`${titleText} dismissed`);
    closeButtonProps?.onClick?.(event);
    onClose?.(event);
  };

  return (
    <div
      className={cx('ld-nudge-nudge', onClose && 'ld-nudge-hasCloseButton', !actions && !children && 'ld-nudge-hasNoContent', className)}
      {...rest}
    >
      <div className={'ld-nudge-wrapperOuter'}>
        {leading && (
          <div
            className={'ld-nudge-leading'}
            {...(leadingIconLabel
              ? {'aria-label': leadingIconLabel, role: 'img'}
              : {'aria-hidden': true})}
          >
            {leading}
          </div>
        )}

        <div className={'ld-nudge-wrapperInner'}>
          <Body as={titleAs} size={"large"} weight={"alt"}>
            {title}
          </Body>

          {children && (
            <Body
              UNSAFE_className={'ld-nudge-content'}
              size={"small"}
            >
              {children}
            </Body>
          )}

          {actions && <div className={'ld-nudge-actionContent'}>{actions}</div>}
        </div>
      </div>

      {onClose && (
        <NudgeCloseButton
          a11yLabel={
            closeButtonProps?.a11yLabel ??
            (typeof title === 'string' ? `Close ${title}` : 'Close')
          }
          {...closeButtonProps}
          onClick={handleClose}
        />
      )}

    </div>
  );
};

Nudge.displayName = 'Nudge';
