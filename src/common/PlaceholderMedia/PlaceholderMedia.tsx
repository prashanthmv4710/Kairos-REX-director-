import * as React from 'react';

import {cx} from '../cx';

import './PlaceholderMedia.css';

export type PlaceholderMediaShape = 'rect' | 'circle';

export interface PlaceholderMediaProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Shape of the placeholder. Use `circle` for avatars and round icon slots;
   * use `rect` for product images, hero media, and everything else.
   * @default 'rect'
   */
  shape?: PlaceholderMediaShape;
  /**
   * Width in pixels. Ignored when the host sets a width via CSS/className.
   */
  width?: number | string;
  /**
   * Height in pixels. Ignored when the host sets a height via CSS/className.
   */
  height?: number | string;
  /**
   * Optional aspect ratio hint used when no explicit height is provided.
   * Accepts CSS aspect-ratio values, e.g. `"1 / 1"`, `"4 / 3"`, `"16 / 9"`.
   * Only applied on the rect shape.
   */
  aspectRatio?: string;
  /**
   * Optional small label rendered inside the placeholder (e.g. `"Marty"`,
   * `"Hero image"`). Kept short so it doesn't overflow.
   */
  label?: string;
}

/**
 * PlaceholderMedia renders a neutral gray square or circle in place of any
 * external image, illustration, or Lottie animation. Every component ported
 * from the AX and PX starter kits swaps `<img>` tags and image-file imports
 * for this component so nothing gets pulled into `src/media/` or `public/`.
 *
 * Uses the ld-kit neutral grays from `src/themes/base.css` so the placeholder
 * adapts to the active theme.
 */
export const PlaceholderMedia = React.forwardRef<
  HTMLDivElement,
  PlaceholderMediaProps
>(function PlaceholderMedia(
  {
    shape = 'rect',
    width,
    height,
    aspectRatio,
    label,
    className,
    style,
    ...rest
  },
  ref,
) {
  const inlineStyle: React.CSSProperties = {
    width,
    height,
    aspectRatio: shape === 'rect' ? aspectRatio : undefined,
    ...style,
  };

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label ?? 'Placeholder media'}
      className={cx(
        'ld-placeholder-media',
        shape === 'circle' && 'ld-placeholder-media--circle',
        className,
      )}
      style={inlineStyle}
      {...rest}
    >
      {label ? <span className="ld-placeholder-media__label">{label}</span> : null}
    </div>
  );
});
