'use client';
// @refresh reset

/**
 * @module Sources
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
 * For prop API + usage notes, read `Sources.md` in this folder
 * or run `npm run ld-kit -- show Sources`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {Body} from '../Text/Text';
import {Icon} from '../Icons';
import './Sources.css';

/** A single cited source backing an agent response. */
export interface SourceCitation {
  /** The display title — usually the domain, e.g. "Philips.co.uk". */
  title: React.ReactNode;
  /** A short snippet describing the cited page. Truncated to one line. */
  description?: React.ReactNode;
  /** The source URL. When set, the row is a link that opens in a new tab. */
  href?: string;
  /** A favicon image URL shown as the leading thumbnail. */
  faviconUrl?: string;
  /**
   * A custom leading node — overrides `faviconUrl`. Falls back to a globe glyph
   * when neither is provided.
   */
  favicon?: React.ReactNode;
}

export interface SourcesProps
  extends Omit<React.ComponentPropsWithoutRef<'ol'>, 'className' | 'style'> {
  /** The cited sources, rendered top to bottom. */
  sources: SourceCitation[];
}

/** The leading thumbnail for a source — custom node, favicon image, or globe. */
function SourceFavicon({source}: {source: SourceCitation}) {
  if (source.favicon) {
    return <span className="ld-sources-favicon">{source.favicon}</span>;
  }
  if (source.faviconUrl) {
    return (
      <span className="ld-sources-favicon">
        <img src={source.faviconUrl} alt="" width={24} height={24} />
      </span>
    );
  }
  return (
    <span className="ld-sources-favicon ld-sources-favicon--fallback">
      <Icon name="Globe" decorative />
    </span>
  );
}

/** The inner content of a source row — favicon plus title and snippet. */
function SourceBody({source}: {source: SourceCitation}) {
  return (
    <>
      <SourceFavicon source={source} />
      <span className="ld-sources-text">
        <Body as="span" size="small" weight="alt" UNSAFE_className="ld-sources-title">
          {source.title}
        </Body>
        {source.description ? (
          <Body as="span" size="small" color="subtle" UNSAFE_className="ld-sources-desc">
            {source.description}
          </Body>
        ) : null}
      </span>
    </>
  );
}

/**
 * Sources renders the list of cited references backing an agent response — each
 * a favicon, a bold domain title, and a one-line snippet. It's the expandable
 * payload behind a response's "Sources" toggle; pair it with a ButtonToggle pill
 * that shows or hides it.
 *
 * Rows with an `href` are links that open in a new tab; rows without one are
 * static.
 */
export const Sources = React.forwardRef<HTMLOListElement, SourcesProps>(
  (props, ref) => {
    const {className, sources, ...rest} = applyCommonProps(props);

    return (
      <ol ref={ref} className={cx('ld-sources', className)} {...rest}>
        {sources.map((source, i) => (
          <li key={i} className="ld-sources-item">
            {source.href ? (
              <a
                className="ld-sources-link"
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SourceBody source={source} />
              </a>
            ) : (
              <div className="ld-sources-link ld-sources-link--static">
                <SourceBody source={source} />
              </div>
            )}
          </li>
        ))}
      </ol>
    );
  }
);

Sources.displayName = 'Sources';
