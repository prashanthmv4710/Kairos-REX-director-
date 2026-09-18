'use client';
// @refresh reset

/**
 * @module Icons
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
 * For prop API + usage notes, read `Icons.md` in this folder
 * or run `npm run ld-kit -- show Icons`.
 */

import type {CSSProperties} from 'react';
import {useThemeIconPrefix} from '../../utils/Theming';

export {LD_ICON_CODEPOINTS} from '../../fonts/ld/LDIcons';

type IconSize = 'small' | 'medium' | 'large';

const SIZES: Record<IconSize, string> = {small: '1rem', medium: '1.5rem', large: '2rem'};
const ALIGNS: Record<IconSize, string> = {small: '-0.175em', medium: '-0.25em', large: '-0.325em'};

type IconProps = {
  size?: IconSize;
  /**
   * Accessible label for icons that convey meaning on their own.
   * Mutually exclusive with `decorative`.
   */
  a11yLabel?: string;
  /**
   * Marks the icon as purely decorative — it will be `aria-hidden` from
   * assistive tech. Use this when the icon sits next to a text label that
   * already describes the affordance (e.g., a Button with a leading icon).
   * Mutually exclusive with `a11yLabel`.
   */
  decorative?: boolean;
  style?: CSSProperties;
  className?: string;
  title?: string;
};

function ArrowSelectSvg({size = '1em'}: {size?: string}) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path fill="currentColor" d="M14.293 14.804a1 1 0 0 1 1.102-.213l14 6a1.002 1.002 0 0 1-.079 1.869l-5.525 1.842-1.842 5.525a1.002 1.002 0 0 1-1.869.078l-6-14a1.001 1.001 0 0 1 .213-1.101Zm6.59 11.892 1.168-3.502a1 1 0 0 1 .633-.633l3.502-1.168-9.282-3.978 3.979 9.281ZM23 1.488a7 7 0 0 1 7 7v10h-2v-10a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5V19a5 5 0 0 0 5 5h6v2H9a7 7 0 0 1-7-7V8.488a7 7 0 0 1 7-7h14Z"/>
    </svg>
  );
}

function StopSvg({size = '1em'}: {size?: string}) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path fill="currentColor" d="M22 8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h12Z" />
    </svg>
  );
}

export function Icon({name, size, a11yLabel, decorative, style, className, title}: IconProps & {name: string}) {
  const sizeStyle = size && !style?.fontSize ? {fontSize: SIZES[size], verticalAlign: ALIGNS[size]} : {};
  const iconSize = style?.fontSize ?? style?.width ?? style?.height ?? sizeStyle.fontSize;
  const fontSize = typeof iconSize === 'number' ? `${iconSize}px` : iconSize;
  // `decorative` and `a11yLabel` both lead to valid a11y. A labeled icon
  // is exposed as `role="img"`; a decorative or unlabeled icon is hidden.
  // Passing `decorative` alongside `a11yLabel` is nonsensical — the label wins.
  const a11y = a11yLabel
    ? {'aria-label': a11yLabel, role: 'img' as const}
    : {'aria-hidden': true as const};
  if (name === 'ArrowSelect') {
    return (
      <span
        {...a11y}
        className={className}
        title={title}
        style={{display: 'inline-flex', verticalAlign: sizeStyle.verticalAlign, ...style}}
      >
        <ArrowSelectSvg size={fontSize} />
      </span>
    );
  }
  const prefix = useThemeIconPrefix();
  const mergedStyle: CSSProperties = {
    ...(fontSize ? {fontSize} : {}),
    ...(sizeStyle.verticalAlign ? {verticalAlign: sizeStyle.verticalAlign} : {}),
    ...style,
  };
  return (
    <i {...a11y} className={`${prefix} ${prefix}-${name}${className ? ` ${className}` : ''}`} title={title} style={mergedStyle} />
  );
}

// Existing wrappers
export const SearchIcon = (props: IconProps) => <Icon name="Search" {...props} />;
export const ChevronUpIcon = (props: IconProps) => <Icon name="ChevronUp" {...props} />;
export const SettingsIcon = (props: IconProps) => <Icon name="Gear" {...props} />;
export const StarIcon = (props: IconProps) => <Icon name="Star" {...props} />;
/** @alpha New export — added for RatingDisplay; surface may evolve. */
export const StarFillIcon = (props: IconProps) => <Icon name="StarFill" {...props} />;
export const CheckIcon = (props: IconProps) => <Icon name="Check" {...props} />;
export const PlusIcon = (props: IconProps) => <Icon name="Plus" {...props} />;
export const InfoIcon = (props: IconProps) => <Icon name="InfoCircle" {...props} />;
export const AlertTriangleIcon = (props: IconProps) => <Icon name="Warning" {...props} />;
export const XIcon = (props: IconProps) => <Icon name="Close" {...props} />;

// Migrated from common/icons.tsx
export const CloseIcon = (props: IconProps) => <Icon name="Close" {...props} />;
export const ChevronDownIcon = (props: IconProps) => <Icon name="ChevronDown" {...props} />;
export const ChevronRightIcon = (props: IconProps) => <Icon name="ChevronRight" {...props} />;
export const ChevronLeftIcon = (props: IconProps) => <Icon name="ChevronLeft" {...props} />;
export const ExclamationCircleIcon = (props: IconProps) => <Icon name="ExclamationCircle" {...props} />;
export const ExclamationCircleFillIcon = (props: IconProps) => <Icon name="ExclamationCircleFill" {...props} />;
export const InfoCircleIcon = (props: IconProps) => <Icon name="InfoCircle" {...props} />;
export const CheckCircleIcon = (props: IconProps) => <Icon name="CheckCircle" {...props} />;
export const CheckCircleFillIcon = (props: IconProps) => <Icon name="CheckCircleFill" {...props} />;
export const WarningIcon = (props: IconProps) => <Icon name="Warning" {...props} />;
export const CaretDownIcon = (props: IconProps) => <Icon name="CaretDown" {...props} />;
export const ArrowUpIcon = (props: IconProps) => <Icon name="ArrowUp" {...props} />;
export const VoiceSearchIcon = (props: IconProps) => <Icon name="VoiceSearch" {...props} />;
export const ArrowDownIcon = (props: IconProps) => <Icon name="ArrowDown" {...props} />;
export const CalendarIcon = (props: IconProps) => <Icon name="Calendar" {...props} />;
export const EditIcon = (props: IconProps) => <Icon name="Pencil" {...props} />;
export const SelectedIcon = (props: IconProps) => <Icon name="Check" {...props} />;
export const GiftIcon = (props: IconProps) => <Icon name="Gift" {...props} />;
export const DollarIcon = (props: IconProps) => <Icon name="Dollar" {...props} />;
export const TagIcon = (props: IconProps) => <Icon name="Tag" {...props} />;
export const LockIcon = (props: IconProps) => <Icon name="Lock" {...props} />;
export const FlashIcon = (props: IconProps) => <Icon name="Flash" {...props} />;
export const FlashFillIcon = (props: IconProps) => <Icon name="FlashFill" {...props} />;
export const AerialDroneIcon = (props: IconProps) => <Icon name="AerialDrone" {...props} />;
export const CartIcon = (props: IconProps) => <Icon name="Cart" {...props} />;
export const UsersFillIcon = (props: IconProps) => <Icon name="Users" {...props} />;
export const CheckCircleIcon2 = (props: IconProps) => <Icon name="CheckCircle" {...props} />;
export const ErrorTextIcon = ExclamationCircleFillIcon;
export const SaveIcon = CheckCircleIcon;
/** Horizontal three-dot "more" / overflow glyph. */
export const MoreIcon = (props: IconProps) => <Icon name="More" {...props} />;
/** Vertical three-dot "more" / overflow glyph. */
export const MoreVerticalIcon = (props: IconProps) => <Icon name="MoreAlt" {...props} />;
export const TrashIcon = (props: IconProps) => <Icon name="Trash" {...props} />;
export const ArrowSelectIcon = (props: IconProps) => <Icon name="ArrowSelect" {...props} />;
export function StopIcon({size, a11yLabel, decorative, style, className, title}: IconProps) {
  const sizeStyle = size && !style?.fontSize ? {fontSize: SIZES[size], verticalAlign: ALIGNS[size]} : {};
  const iconSize = style?.fontSize ?? style?.width ?? style?.height ?? sizeStyle.fontSize;
  const fontSize = typeof iconSize === 'number' ? `${iconSize}px` : iconSize ?? '1em';
  const a11y = a11yLabel
    ? {'aria-label': a11yLabel, role: 'img' as const}
    : {'aria-hidden': true as const};

  return (
    <span
      {...a11y}
      className={className}
      title={title}
      style={{display: 'inline-flex', verticalAlign: sizeStyle.verticalAlign, ...style}}
    >
      <StopSvg size={fontSize} />
    </span>
  );
}

// WCP social media icons
export const XWCPIcon = (props: IconProps) => <Icon name="X" {...props} />;
export const YoutubeWCPIcon = (props: IconProps) => <Icon name="Youtube" {...props} />;
export const TiktokWCPIcon = (props: IconProps) => <Icon name="Tiktok" {...props} />;
export const PinterestWCPIcon = (props: IconProps) => <Icon name="Pinterest" {...props} />;
