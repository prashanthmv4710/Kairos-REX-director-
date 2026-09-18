// @refresh reset

/**
 * @module BasicBanner
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
 * For prop API + usage notes, read `BasicBanner.md` in this folder
 * or run `npm run ld-kit -- show BasicBanner`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {VisuallyHidden} from '../VisuallyHidden';
import './BasicBanner.css';

export type BasicBannerVariant = 'default' | 'brand' | 'inverse';

export interface BasicBannerProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  /** Icon element to display on the left. Defaults to the Walmart placeholder icon. */
  icon?: React.ReactNode;
  /**
   * Visually hidden text that describes the icon to screen readers.
   * Rendered as a hidden text node before the visible label so it contributes
   * to the button's computed accessible name — e.g. `"Walmart+ membership"`.
   * The icon slot is always `aria-hidden`; this text is the SR description.
   *
   * When omitted, the icon is purely decorative and SR reads only `text`.
   */
  iconLabel?: string;
  /** Main text content */
  text?: string;
  /** Visual variant: default (blue-subtle), brand (Walmart blue), inverse (dark) */
  variant?: BasicBannerVariant;
  /** Optional click handler — renders as button when provided */
  onClick?: () => void;
  /**
   * Accessible label for the banner button. Only meaningful when `onClick` is
   * provided (button mode).
   *
   * **Warning:** `aria-label` on the button replaces the entire computed name,
   * including any `iconLabel` text. If you provide both, you must include the
   * icon description in your `aria-label` string yourself, e.g.
   * `aria-label="Walmart+ membership, Join Walmart+ and start a free trial"`.
   *
   * In most cases you do NOT need this — omit it and let `iconLabel` + `text`
   * compute the accessible name automatically.
   */
  'aria-label'?: string;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

/** Walmart "PICK icon" placeholder SVG */
function WalmartPlaceholderIcon() {
  return (
    <svg
      className="ld-wcp-basic-banner-icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M21 21V3H1.5V1.5H22.5V22.5H1.5V3H3V21H21Z" fill="currentColor" />
      <path d="M16.5178 4.497V8.13536L18.3268 6.243H19.0918L17.175 8.24818L19.1728 10.5H18.3628L16.5178 8.44629V10.5H15.8248V4.497H16.5178Z" fill="currentColor" />
      <path d="M14.88 6.513V7.224C14.73 7.074 14.55 6.957 14.34 6.873C14.136 6.789 13.914 6.747 13.674 6.747C13.398 6.747 13.143 6.81 12.909 6.936C12.675 7.062 12.489 7.245 12.351 7.485C12.213 7.725 12.144 8.022 12.144 8.376C12.144 8.73 12.213 9.027 12.351 9.267C12.489 9.501 12.675 9.681 12.909 9.807C13.143 9.927 13.398 9.987 13.674 9.987C13.944 9.987 14.178 9.948 14.376 9.87C14.574 9.792 14.742 9.693 14.88 9.573V10.203C14.796 10.281 14.652 10.365 14.448 10.455C14.244 10.545 13.974 10.59 13.638 10.59C13.248 10.59 12.885 10.503 12.549 10.329C12.213 10.155 11.946 9.903 11.748 9.573C11.55 9.243 11.451 8.844 11.451 8.376C11.451 7.902 11.55 7.5 11.748 7.17C11.946 6.84 12.213 6.588 12.549 6.414C12.885 6.24 13.248 6.153 13.638 6.153C13.956 6.153 14.214 6.192 14.412 6.27C14.616 6.348 14.772 6.429 14.88 6.513Z" fill="currentColor" />
      <path d="M10.5592 10.5V6.243H9.86625V10.5H10.5592Z" fill="currentColor" />
      <path d="M9.88425 5.397C9.96825 5.475 10.0763 5.514 10.2083 5.514C10.3403 5.514 10.4482 5.475 10.5322 5.397C10.6222 5.313 10.6672 5.208 10.6672 5.082C10.6672 4.962 10.6222 4.863 10.5322 4.785C10.4482 4.707 10.3403 4.668 10.2083 4.668C10.0763 4.668 9.96825 4.707 9.88425 4.785C9.80025 4.863 9.75825 4.962 9.75825 5.082C9.75825 5.208 9.80025 5.313 9.88425 5.397Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M5.157 10.5V4.758H6.84C7.494 4.758 8.004 4.905 8.37 5.199C8.742 5.493 8.928 5.931 8.928 6.513C8.928 7.077 8.742 7.515 8.37 7.827C8.004 8.139 7.494 8.295 6.84 8.295H5.886V10.5H5.157ZM6.777 5.37H5.886V7.692H6.777C7.293 7.692 7.659 7.59 7.875 7.386C8.091 7.176 8.199 6.891 8.199 6.531C8.199 6.159 8.091 5.874 7.875 5.676C7.659 5.472 7.293 5.37 6.777 5.37Z" fill="currentColor" />
      <path d="M16.2631 15.4879C16.2772 15.4499 16.2922 15.4122 16.3081 15.375C16.4341 15.075 16.6231 14.835 16.8751 14.655C17.1271 14.475 17.4361 14.385 17.8021 14.385C18.2221 14.385 18.5611 14.517 18.8191 14.781C19.0831 15.045 19.2151 15.45 19.2151 15.996V18.75H18.5221V16.077C18.5221 15.675 18.4351 15.393 18.2611 15.231C18.0871 15.069 17.8501 14.988 17.5501 14.988C17.1841 14.988 16.8781 15.132 16.6321 15.42C16.3921 15.708 16.2721 16.122 16.2721 16.662V18.75H15.5701V14.493H16.2631V15.4879Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M12.5634 18.831C12.1614 18.831 11.8014 18.735 11.4834 18.543C11.1714 18.351 10.9254 18.087 10.7454 17.751C10.5654 17.415 10.4754 17.037 10.4754 16.617C10.4754 16.185 10.5654 15.804 10.7454 15.474C10.9254 15.138 11.1714 14.874 11.4834 14.682C11.8014 14.484 12.1614 14.385 12.5634 14.385C12.9774 14.385 13.3404 14.484 13.6524 14.682C13.9704 14.874 14.2194 15.138 14.3994 15.474C14.5794 15.804 14.6694 16.185 14.6694 16.617C14.6694 17.037 14.5794 17.415 14.3994 17.751C14.2194 18.087 13.9704 18.351 13.6524 18.543C13.3404 18.735 12.9774 18.831 12.5634 18.831ZM12.5634 18.255C12.8634 18.255 13.1184 18.183 13.3284 18.039C13.5384 17.895 13.7004 17.7 13.8144 17.454C13.9284 17.208 13.9854 16.929 13.9854 16.617C13.9854 16.299 13.9284 16.017 13.8144 15.771C13.7064 15.525 13.5474 15.33 13.3374 15.186C13.1274 15.042 12.8694 14.97 12.5634 14.97C12.2694 14.97 12.0174 15.042 11.8074 15.186C11.5974 15.33 11.4354 15.525 11.3214 15.771C11.2134 16.017 11.1594 16.299 11.1594 16.617C11.1594 16.929 11.2164 17.208 11.3304 17.454C11.4444 17.7 11.6064 17.895 11.8164 18.039C12.0264 18.183 12.2754 18.255 12.5634 18.255Z" fill="currentColor" />
      <path d="M9.81745 15.474V14.763C9.70945 14.679 9.55345 14.598 9.34945 14.52C9.15145 14.442 8.89345 14.403 8.57545 14.403C8.18545 14.403 7.82245 14.49 7.48645 14.664C7.15045 14.838 6.88345 15.09 6.68545 15.42C6.48745 15.75 6.38845 16.152 6.38845 16.626C6.38845 17.094 6.48745 17.493 6.68545 17.823C6.88345 18.153 7.15045 18.405 7.48645 18.579C7.82245 18.753 8.18545 18.84 8.57545 18.84C8.91145 18.84 9.18145 18.795 9.38545 18.705C9.58945 18.615 9.73345 18.531 9.81745 18.453V17.823C9.67945 17.943 9.51145 18.042 9.31345 18.12C9.11545 18.198 8.88145 18.237 8.61145 18.237C8.33545 18.237 8.08045 18.177 7.84645 18.057C7.61245 17.931 7.42645 17.751 7.28845 17.517C7.15045 17.277 7.08145 16.98 7.08145 16.626C7.08145 16.272 7.15045 15.975 7.28845 15.735C7.42645 15.495 7.61245 15.312 7.84645 15.186C8.08045 15.06 8.33545 14.997 8.61145 14.997C8.85145 14.997 9.07345 15.039 9.27745 15.123C9.48745 15.207 9.66745 15.324 9.81745 15.474Z" fill="currentColor" />
      <path d="M5.49675 14.493V18.75H4.80375V14.493H5.49675Z" fill="currentColor" />
      <path d="M5.14575 13.764C5.01375 13.764 4.90575 13.725 4.82175 13.647C4.73775 13.563 4.69575 13.458 4.69575 13.332C4.69575 13.212 4.73775 13.113 4.82175 13.035C4.90575 12.957 5.01375 12.918 5.14575 12.918C5.27775 12.918 5.38575 12.957 5.46975 13.035C5.55975 13.113 5.60475 13.212 5.60475 13.332C5.60475 13.458 5.55975 13.563 5.46975 13.647C5.38575 13.725 5.27775 13.764 5.14575 13.764Z" fill="currentColor" />
    </svg>
  );
}

export const BasicBanner: React.FunctionComponent<BasicBannerProps> = (props) => {
  const {
    icon,
    iconLabel,
    text = 'Declarative title or body',
    variant = 'default',
    onClick,
    className,
    ...rest
  } = applyCommonProps(props);

  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      className={cx(
        'ld-wcp-basic-banner-root',
        `ld-wcp-basic-banner-${variant}`,
        onClick ? 'ld-wcp-basic-banner-clickable' : undefined,
        className,
      )}
      onClick={onClick}
      {...(Tag === 'button' ? {type: 'button' as const} : {})}
      {...(rest as any)}
    >
      <span className="ld-wcp-basic-banner-icon-slot" aria-hidden="true">
        {icon ?? <WalmartPlaceholderIcon />}
      </span>
      {iconLabel && <VisuallyHidden>{iconLabel}</VisuallyHidden>}
      <span className="ld-wcp-basic-banner-text">{text}</span>
    </Tag>
  );
};

BasicBanner.displayName = 'BasicBanner';
