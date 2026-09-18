// @refresh reset

/**
 * @module Image
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
 * For prop API + usage notes, read `Image.md` in this folder
 * or run `npm run ld-kit -- show Image`.
 */

import * as React from 'react';

import {invariant, applyCommonProps} from '../../common/helpers';
import './Image.css';

interface ImageBaseProps
  extends Omit<JSX.IntrinsicElements['img'], 'alt' | 'className' | 'style'> {
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
  /**
   * The image source URL.
   */
  src: string;
}

export interface ImageWithAltProps extends ImageBaseProps {
  /**
   * A short, meaningful description of the image for screen readers.
   *
   * Required unless the image is purely decorative, in which case use
   * `unsafeDecorative` instead.
   *
   * Placeholder values ("...", "", "image", "photo") are rejected at runtime.
   */
  alt: string;
  unsafeDecorative?: never;
}

export interface ImageDecorativeProps extends ImageBaseProps {
  alt?: never;
  /**
   * Explicit opt-out. Marks the image as purely decorative so screen readers
   * ignore it. Requires a non-empty `reason` string explaining why the image
   * carries no meaning. Prefer `alt` — only reach for this for pure visual
   * flourish, and ASK THE USER before using it.
   */
  unsafeDecorative: {reason: string};
}

export type ImageProps = ImageWithAltProps | ImageDecorativeProps;

const REJECTED_ALTS = new Set(['', '...', 'image', 'photo', 'picture']);

/**
 * Accessibility-enforced `<img>` wrapper.
 *
 * Requires EITHER a meaningful `alt` OR an explicit `unsafeDecorative={{reason}}`
 * opt-out. Placeholder alts like `"..."`, `""`, or `"image"` are rejected at
 * runtime — screen reader users are left with an uninformative label otherwise.
 */
export function Image(props: ImageProps): JSX.Element {
  const {alt, unsafeDecorative, src, ...rest} = applyCommonProps(
    props as ImageProps & {className?: string; style?: React.CSSProperties},
  );

  const hasAlt = typeof alt === 'string' && !REJECTED_ALTS.has(alt.trim().toLowerCase());
  const isDecorative = !!unsafeDecorative;

  invariant(
    hasAlt || isDecorative,
    '`Image` accessibility violation. Provide a meaningful `alt` describing what the image conveys, OR pass `unsafeDecorative={{ reason: "…" }}` for purely decorative imagery. Placeholder alts ("", "...", "image", "photo") are rejected.',
  );
  invariant(
    !isDecorative ||
      (typeof unsafeDecorative!.reason === 'string' &&
        unsafeDecorative!.reason.trim().length >= 4),
    '`Image.unsafeDecorative.reason` must be a non-empty justification string (≥4 characters). Describe why this image carries no meaning.',
  );

  if (isDecorative) {
    if (import.meta.env.MODE !== 'production') {
      console.info(
        `[ld a11y opt-out] Image decorative — ${unsafeDecorative!.reason} (src=${src})`,
      );
    }
    return <img src={src} alt="" aria-hidden="true" {...rest} />;
  }

  return <img src={src} alt={alt as string} {...rest} />;
}

Image.displayName = 'Image';
