// @refresh reset

/**
 * @module ContentCard
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
 * For prop API + usage notes, read `ContentCard.md` in this folder
 * or run `npm run ld-kit -- show ContentCard`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {Link} from '../Link';
import './ContentCard.css';

export type ContentCardVariant = 'vertical' | 'horizontal' | 'background';

export interface ContentCardProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  /** Hero/background image URL */
  imageSrc: string;
  /** Alt text for the image */
  imageAlt: string;
  /** Small top text for brand/category context (e.g. "Ray-Ban, Oakley, Costa & more") */
  eyebrow?: string;
  /** Primary text */
  headline: string;
  /** Secondary descriptive line */
  subtext?: string;
  /** CTA button/link text ("Shop now", "Learn more", "Get started") */
  ctaLabel?: string;
  /** CTA link destination. When provided, the CTA renders as a `<Link>`. */
  ctaHref?: string;
  /** Click handler for the entire card */
  onClick?: () => void;
  /** Layout variant */
  variant?: ContentCardVariant;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

/**
 * ContentCard — Marketing/promotional content card used in homepage grids.
 *
 * Supports three layout variants:
 * - `vertical` (default): image on top, text below
 * - `horizontal`: image on the left, text on the right
 * - `background`: full-bleed background image with overlaid text
 */
export function ContentCard(props: ContentCardProps) {
  const {
    imageSrc,
    imageAlt,
    eyebrow,
    headline,
    subtext,
    ctaLabel,
    ctaHref,
    onClick,
    variant = 'vertical',
    className,
    ...rest
  } = applyCommonProps(props);

  const Tag = onClick ? 'button' : 'div';
  const isClickable = !!onClick;

  const renderCta = (linkColor: 'default' | 'white') => {
    if (!ctaLabel) return null;
    // Inside a clickable button wrapper, an anchor would nest interactives,
    // so the CTA stays as a styled span and the wrapper button handles nav.
    if (ctaHref && !onClick) {
      return (
        <Link
          href={ctaHref}
          color={linkColor}
          UNSAFE_className="ld-content-card-cta-link"
        >
          {ctaLabel}
        </Link>
      );
    }
    return <span className="ld-content-card-cta">{ctaLabel}</span>;
  };

  return (
    <Tag
      className={cx(
        'ld-content-card-root',
        `ld-content-card-${variant}`,
        isClickable ? 'ld-content-card-clickable' : undefined,
        className,
      )}
      onClick={isClickable ? onClick : undefined}
      {...(Tag === 'button' ? {type: 'button' as const} : {})}
      {...(rest as any)}
    >
      {variant === 'background' ? (
        <>
          <img
            src={imageSrc}
            alt={imageAlt}
            className="ld-content-card-bg-image"
            aria-hidden="true"
          />
          <div className="ld-content-card-bg-overlay" />
          <div className="ld-content-card-bg-content">
            {eyebrow && (
              <p className="ld-content-card-eyebrow">{eyebrow}</p>
            )}
            <p className="ld-content-card-headline">{headline}</p>
            {subtext && (
              <p className="ld-content-card-subtext">{subtext}</p>
            )}
            {renderCta('white')}
          </div>
        </>
      ) : (
        <>
          <div className="ld-content-card-image-wrapper">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="ld-content-card-image"
            />
          </div>
          <div className="ld-content-card-body">
            {eyebrow && (
              <p className="ld-content-card-eyebrow">{eyebrow}</p>
            )}
            <p className="ld-content-card-headline">{headline}</p>
            {subtext && (
              <p className="ld-content-card-subtext">{subtext}</p>
            )}
            {renderCta('default')}
          </div>
        </>
      )}
    </Tag>
  );
}
ContentCard.displayName = 'ContentCard';
