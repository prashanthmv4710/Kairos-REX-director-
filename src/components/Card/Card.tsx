'use client';
// @refresh reset

/**
 * @module Card
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
 * For prop API + usage notes, read `Card.md` in this folder
 * or run `npm run ld-kit -- show Card`.
 */

import * as React from 'react';
import {Heading} from '../Text';

import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import './Card.css';
// ---------------------------------------------------------------------------
// CardActions (inlined sub-component)
// ---------------------------------------------------------------------------

export interface CardActionsProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  /**
   * The content for the card actions.
   */
  children: React.ReactNode;
}

/**
 * Card Actions
 * *
 */
export const CardActions: React.FunctionComponent<CardActionsProps> = (
  props
) => {
  const {children, className, ...rest} = applyCommonProps(props);

  const size = React.useContext(CardSizeContext);

  return (
    <div
      className={cx('ld-card-cardactions-cardActions', size === 'large' && 'ld-card-cardactions-large', size === 'small' && 'ld-card-cardactions-small', className)}
      {...rest}
    >
      <div className={cx('ld-card-cardactions-cardActionsSeparator', className)} />
      {children}
    </div>
  );
};

CardActions.displayName = 'CardActions';

// ---------------------------------------------------------------------------
// CardContent (inlined sub-component)
// ---------------------------------------------------------------------------

export interface CardContentProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  /**
   * The content for the card content.
   */
  children: React.ReactNode;
}

/**
 * Card Content
 * *
 */
export const CardContent: React.FunctionComponent<CardContentProps> = (
  props
) => {
  const {children, className, ...rest} = applyCommonProps(props);

  const size = React.useContext(CardSizeContext);

  return (
    <div
      className={cx(size === 'large' && 'ld-card-cardcontent-large', size === 'small' && 'ld-card-cardcontent-small', className)}
      {...rest}
    >
      {children}
    </div>
  );
};

CardContent.displayName = 'CardContent';

// ---------------------------------------------------------------------------
// CardHeader (inlined sub-component)
// ---------------------------------------------------------------------------

export interface CardHeaderProps
  extends Omit<
      React.ComponentPropsWithoutRef<'div'>,
      'className' | 'style' | 'title'
    > {
  /**
   * The leading icon for the card header.
   */
  leadingIcon?: React.ReactNode;
  /**
   * The title for the card header.
   */
  title: React.ReactNode;
  /**
   * The heading level rendered for the title.
   *
   * Defaults to `h2`. Override when the card lives inside a section that
   * already has an `h2` — e.g. set `headingLevel="h3"` in a two-column
   * layout where the page `h2` is the section label.
   *
   * @default "h2"
   */
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /**
   * The trailing content for the card header.
   */
  trailing?: React.ReactNode;
}

/**
 * Card Header
 * *
 */
export const CardHeader: React.FunctionComponent<CardHeaderProps> = (props) => {
  const {className, headingLevel = 'h2', leadingIcon, title, trailing, ...rest} = applyCommonProps(props);

  const size = React.useContext(CardSizeContext);

  return (
    <div
      className={cx('ld-card-cardheader-container', size === 'large' && 'ld-card-cardheader-large', size === 'small' && 'ld-card-cardheader-small', className)}
      {...rest}
    >
      {leadingIcon && <span className={'ld-card-cardheader-leadingIcon'}>{leadingIcon}</span>}

      <Heading
        as={headingLevel}
        UNSAFE_className={'ld-card-cardheader-title'}
        size={"small"}
      >
        {title}
      </Heading>

      {trailing && <span className={'ld-card-cardheader-trailing'}>{trailing}</span>}
    </div>
  );
};

CardHeader.displayName = 'CardHeader';

// ---------------------------------------------------------------------------
// CardMedia (inlined sub-component)
// ---------------------------------------------------------------------------

export interface CardMediaProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  /**
   * The content for the card media.
   */
  children: React.ReactNode;
}

/**
 * Card Media
 * *
 */
export const CardMedia: React.FunctionComponent<CardMediaProps> = (props) => {
  const transformedProps = applyCommonProps(props);

  return <div {...transformedProps} />;
};

CardMedia.displayName = 'CardMedia';

// ---------------------------------------------------------------------------
// CardSizeContext (inlined sub-component)
// ---------------------------------------------------------------------------

export type CardSize = 'large' | 'small';

export const CardSizeContext = React.createContext<CardSize>('small');

// CardSize is already exported above

export interface CardProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  /**
   * The content for the card.
   */
  children: React.ReactNode;
  /**
   * The size for the card.
   *
   * @default "small"
   */
  size?: CardSize;
}

/**
 * Cards organize and present similar content that users can scan quickly and interact with. They contain text, images, icons and buttons placed with hierarchy. They may be placed as a series or feed of similar content.
 * *
 */
export const Card: React.FunctionComponent<CardProps> = (props) => {
  const {
    children,
    className,
    size = 'small',
    ...rest
  } = applyCommonProps(props);

  return (
    <CardSizeContext.Provider value={size}>
      <div className={cx('ld-card-card', className)} {...rest}>
        {children}
      </div>
    </CardSizeContext.Provider>
  );
};

Card.displayName = 'Card';
