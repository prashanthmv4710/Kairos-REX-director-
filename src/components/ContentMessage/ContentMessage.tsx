// @refresh reset

/**
 * @module ContentMessage
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
 * For prop API + usage notes, read `ContentMessage.md` in this folder
 * or run `npm run ld-kit -- show ContentMessage`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {Body, Heading} from '../Text';
import './ContentMessage.css';

export type ContentMessageSize = 'small' | 'large';

export interface ContentMessageProps
  extends Omit<
      React.ComponentPropsWithoutRef<'div'>,
      'className' | 'style' | 'title'
    > {
  /**
   * The actions for the content message.
   */
  actions?: React.ReactNode;
  /**
   * The content for the content message.
   */
  children: React.ReactNode;
  /**
   * The media for the content message.
   */
  media?: React.ReactNode;
  /**
   * The title for the content message.
   */
  title: React.ReactNode;
  /**
   * The size for the ContentMessage.
   *
   * @default "small"
   */
  size?: ContentMessageSize;
}

/**
 * Content Messages provide a familiar layout with descriptive content and suggested actions for various scenarios.
 * *
 */
export const ContentMessage: React.FunctionComponent<ContentMessageProps> = (
  props
) => {
  const {
    actions,
    children,
    media,
    size = 'small',
    title,
    ...rest
  } = applyCommonProps(props);

  const headingSize = React.useMemo(
    () =>
      size === 'small'
        ? "medium"
        : "large",
    [size]
  );

  return (
    <div
      className={cx('ld-contentmessage-contentMessage', size === 'small' && 'ld-contentmessage-small', size === 'large' && 'ld-contentmessage-large')}
      {...rest}
    >
      {media && <div className={'ld-contentmessage-media'}>{media}</div>}

      <Heading
        as="h2"
        size={headingSize}
        weight={"default"}
        UNSAFE_className={'ld-contentmessage-title'}
      >
        {title}
      </Heading>

      <Body
        as="div"
        size={"medium"}
        UNSAFE_className={'ld-contentmessage-textLabel'}
      >
        {children}
      </Body>

      {actions && <div className={'ld-contentmessage-actions'}>{actions}</div>}
    </div>
  );
};
