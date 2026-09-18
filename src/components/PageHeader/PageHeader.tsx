// @refresh reset

/**
 * @module PageHeader
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
 * For prop API + usage notes, read `PageHeader.md` in this folder
 * or run `npm run ld-kit -- show PageHeader`.
 */

/**
 * @source PX
 * @ported-from notes/LD-PX-Starter-Kit - V2/client/components/ui/PageHeader.tsx
 *
 * Page header block: section eyebrow + h1 + description.
 *
 * Layout/style notes from the source:
 * - Full-bleed background that extends to the viewport edges, regardless of
 *   the parent's max-width. The negative margin trick (`margin-left: calc(-50vw + 50%)`)
 *   keeps the surface alignable inside a centered content container.
 * - At narrow widths (≤ ~900px) the block stacks vertically.
 *
 * No external deps. Uses LD semantic color tokens with hex fallbacks.
 */
import * as React from 'react';

import {cx} from '../../common/cx';
import './PageHeader.css';

export type PageHeaderHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface PageHeaderProps
  extends Omit<
    React.ComponentPropsWithoutRef<'div'>,
    'className' | 'style' | 'title'
  > {
  /** Small eyebrow label rendered above the title. */
  section: string;
  /** Main heading text. */
  title: string;
  /**
   * Heading level used for the title. Default is 1 because PageHeader is
   * typically the top of a route. Drop to 2+ when nesting inside a page that
   * already has an h1 so the document outline stays single-h1.
   * @default 1
   */
  headingLevel?: PageHeaderHeadingLevel;
  /** Supporting description rendered to the right of the title on wide screens. */
  description?: string;
  /** Escape hatch for additional CSS classes. */
  UNSAFE_className?: string;
  /** Escape hatch for inline styles. */
  UNSAFE_style?: React.CSSProperties;
}

export const PageHeader: React.FunctionComponent<PageHeaderProps> = ({
  section,
  title,
  headingLevel = 1,
  description,
  UNSAFE_className,
  UNSAFE_style,
  ...rest
}) => {
  const HeadingTag = `h${headingLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  return (
    <div className={cx('ld-page-header', UNSAFE_className)} style={UNSAFE_style} {...rest}>
      <div className="ld-page-header__title-block">
        <div className="ld-page-header__section-label">{section}</div>
        <HeadingTag className="ld-page-header__title">{title}</HeadingTag>
      </div>
      {description ? <p className="ld-page-header__description">{description}</p> : null}
    </div>
  );
};

PageHeader.displayName = 'PageHeader';
