import * as React from 'react';
import {useStableId} from './helpers';

type IconProps = {
  size?: 'small' | 'medium' | 'large';
  a11yLabel?: string;
  className?: string;
  style?: React.CSSProperties;
} & React.SVGProps<SVGSVGElement>;

const SIZES: Record<string, string> = {small: '1rem', medium: '1.5rem', large: '2rem'};
const ALIGNS: Record<string, string> = {small: '-0.175em', medium: '-0.25em', large: '-0.325em'};

function makeIcon(paths: React.ReactNode, displayName: string): React.FC<IconProps> {
  const Icon: React.FC<IconProps> = ({size = 'small', a11yLabel, className, style, ...rest}) => {
    const a11y = a11yLabel
      ? {'aria-label': a11yLabel, role: 'img' as const}
      : {'aria-hidden': true as const, role: 'presentation' as const};
    return (
      <svg
        className={className}
        fill="currentColor"
        height="1em"
        style={{fontSize: SIZES[size], verticalAlign: ALIGNS[size], ...style}}
        viewBox="0 0 16 16"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
        {...a11y}
        {...rest}
      >
        {paths}
      </svg>
    );
  };
  Icon.displayName = displayName;
  return Icon;
}

function makeIcon32(paths: React.ReactNode, displayName: string): React.FC<IconProps> {
  const Icon: React.FC<IconProps> = ({size = 'small', a11yLabel, className, style, ...rest}) => {
    const a11y = a11yLabel
      ? {'aria-label': a11yLabel, role: 'img' as const}
      : {'aria-hidden': true as const, role: 'presentation' as const};
    return (
      <svg
        className={className}
        fill="currentColor"
        height="1em"
        style={{fontSize: SIZES[size], verticalAlign: ALIGNS[size], ...style}}
        viewBox="0 0 32 32"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
        {...a11y}
        {...rest}
      >
        {paths}
      </svg>
    );
  };
  Icon.displayName = displayName;
  return Icon;
}

// SVG-only icons with no font equivalent

export const HourglassIcon = makeIcon32(
  <path fillRule="evenodd" d="M6 3.014C6 2.454 6.454 2 7.014 2h17.948a1.014 1.014 0 0 1 0 2.029h-.983v4.979L17.173 16l6.806 6.992v4.979h1.006a1.014 1.014 0 1 1 0 2.029H7.038a1.014 1.014 0 1 1 0-2.029h.96v-4.979L14.804 16 7.998 9.008V4.029h-.984C6.454 4.029 6 3.575 6 3.014ZM21.982 8V4.052H9.996V8h11.986Zm-10.193 2 4.2 4.315 4.2-4.315h-8.4Zm4.223 13.913 3.972 4.035h1.998v-4.105l-5.993-6.158-5.993 6.158v4.105h2.043l3.973-4.035Z" clipRule="evenodd" />,
  'HourglassIcon'
);

export const ShieldCheckIcon = makeIcon32(
  <>
    <path d="m23.848 12.341-10 10a1.198 1.198 0 0 1-1.696 0l-4-4 1.696-1.695L13 19.796l9.152-9.15 1.696 1.695Z" />
    <path fillRule="evenodd" d="M15.293 3.294a1.003 1.003 0 0 1 1.414 0l.006.006.035.033.152.143c.138.125.347.308.62.53a19.467 19.467 0 0 0 2.363 1.632c2.03 1.195 4.854 2.363 8.117 2.363a1 1 0 0 1 1 1c0 6.037-1.512 12.978-6.36 17.018a13.783 13.783 0 0 1-4.449 2.492c-.61.203-1.121.325-1.488.395a7.827 7.827 0 0 1-.562.086l-.037.003-.012.002h-.184l-.011-.002-.038-.003a7.827 7.827 0 0 1-.563-.086c-.366-.07-.878-.192-1.487-.395a13.784 13.784 0 0 1-4.45-2.492C6.095 23.299 3 18.247 3 9.001a1 1 0 0 1 1-1c3.263 0 6.086-1.168 8.117-2.363a19.467 19.467 0 0 0 2.363-1.633c.273-.22.482-.404.62-.529.068-.062.12-.111.152-.143l.035-.033.006-.006Zm.445 2.264a21.36 21.36 0 0 1-2.605 1.805c-2.016 1.186-4.823 2.39-8.121 2.601.205 8.12 2.995 12.323 5.629 14.518a11.789 11.789 0 0 0 3.8 2.133c.516.171.941.27 1.23.326.145.027.257.043.327.053h.004c.07-.01.182-.026.326-.053.29-.055.715-.155 1.23-.326a11.789 11.789 0 0 0 3.801-2.133c3.927-3.273 5.468-8.97 5.625-14.518-3.296-.212-6.102-1.416-8.117-2.601a21.384 21.384 0 0 1-2.605-1.805c-.095-.077-.18-.156-.262-.225-.082.07-.167.148-.262.225Z" clipRule="evenodd" />
  </>,
  'ShieldCheckIcon'
);

export const SparkIcon = makeIcon32(
  <path d="M10.887.645A2.2 2.2 0 0 1 14.643 2.2c0 .532-.534 6.187-.72 6.752a1.553 1.553 0 0 1-2.96 0c-.187-.565-.72-6.22-.72-6.752a2.2 2.2 0 0 1 .644-1.555ZM3.323 6.196a2.2 2.2 0 1 0-2.2 3.81c.46.266 5.624 2.632 6.207 2.753a1.552 1.552 0 0 0 1.48-2.562c-.396-.447-5.026-3.735-5.487-4.001Zm20.437 3.807c-.459.267-5.622 2.633-6.206 2.753a1.556 1.556 0 0 1-1.876-1.684c.035-.328.174-.636.396-.88.396-.444 5.026-3.733 5.487-3.999a2.2 2.2 0 0 1 2.2 3.81Zm-6.206 5.24c.583.121 5.746 2.487 6.207 2.754A2.202 2.202 0 0 1 24.567 21a2.2 2.2 0 0 1-3.004.805c-.461-.266-5.092-3.554-5.487-4a1.552 1.552 0 0 1 1.478-2.563Zm-5.111 2.722a1.561 1.561 0 0 0-1.48 1.081c-.186.565-.72 6.22-.72 6.752a2.2 2.2 0 1 0 4.4 0c0-.532-.533-6.187-.72-6.752a1.56 1.56 0 0 0-1.48-1.081Zm-11.318.03c.46-.268 5.623-2.634 6.207-2.754a1.556 1.556 0 0 1 1.876 1.685 1.553 1.553 0 0 1-.396.879c-.396.445-5.026 3.734-5.487 4a2.2 2.2 0 1 1-2.2-3.81Z" />,
  'SparkIcon'
);

export const WPlusIcon: React.FC<IconProps> = ({size = 'small', a11yLabel, className, style, ...rest}) => {
  const a11y = a11yLabel
    ? {'aria-label': a11yLabel, role: 'img' as const}
    : {'aria-hidden': true as const, role: 'presentation' as const};
  return (
    <svg
      className={className}
      fill="none"
      height="1em"
      style={{fontSize: SIZES[size], verticalAlign: ALIGNS[size], ...style}}
      viewBox="0 0 32 32"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...a11y}
      {...rest}
    >
      <g transform="scale(2)">
        <path fillRule="evenodd" clipRule="evenodd" d="M0 3.62329H1.30939L1.88821 6.5773L2.1601 8.13549L2.25468 7.6536L2.59745 6.1194L3.18414 3.62329H4.48287L5.02956 6.18341C5.12556 6.65809 5.20735 7.06048 5.27806 7.47196L5.37624 8.10616L5.49723 7.4601L5.76293 6.1354L6.28828 3.62329H7.53367L5.99227 9.43155C5.01089 9.64489 4.63487 9.25288 4.49887 8.62885L4.10152 6.81543C4.01085 6.37986 3.9344 6.03081 3.87217 5.64817L3.7895 5.03402C3.70594 5.47671 3.6295 5.8305 3.53883 6.20997L2.74412 9.43155C1.84168 9.61156 1.46847 9.38979 1.26287 8.76041L0 3.62329Z" fill="#0071DC" />
        <path fillRule="evenodd" clipRule="evenodd" d="M10.0473 4.36638C10.2883 4.36638 10.4902 4.4978 10.5653 4.65823L10.5966 4.7824L10.6473 6.05979L11.9273 6.10779C12.138 6.11579 12.3434 6.35314 12.3434 6.65182C12.3434 6.89289 12.2119 7.09301 12.0515 7.16751L11.9273 7.19851L10.642 7.24651L10.5939 8.5239C10.5886 8.73191 10.3486 8.93992 10.0499 8.93992C9.80885 8.93992 9.60702 8.80679 9.53184 8.64704L9.50057 8.5239L9.45256 7.24384L8.16984 7.19851C7.95916 7.19051 7.75382 6.95316 7.75382 6.65448C7.75382 6.4134 7.88524 6.21329 8.04567 6.13879L8.16984 6.10779L9.45523 6.05712L9.50057 4.7824C9.50857 4.57172 9.74858 4.36638 10.0473 4.36638Z" fill="#0071DC" />
        <path fillRule="evenodd" clipRule="evenodd" d="M10.0454 9.95183C10.2352 9.95183 10.4046 10.0286 10.4716 10.1413L10.5014 10.2318L10.7361 12.8613C10.7601 13.12 10.4321 13.336 10.0454 13.336C9.72536 13.336 9.44794 13.1786 9.37516 12.9826L9.35734 12.8613L9.58935 10.2318C9.60535 10.0745 9.81069 9.95183 10.0454 9.95183Z" fill="#FFC220" />
        <path fillRule="evenodd" clipRule="evenodd" d="M13.3052 8.0036L13.4004 8.01821L15.8031 9.13026C16.0378 9.24227 16.0618 9.63162 15.8698 9.9623C15.7098 10.2379 15.4424 10.4042 15.2311 10.3671L15.1124 10.3197L12.9443 8.80492C12.8217 8.70358 12.811 8.47424 12.9283 8.27156C13.0222 8.10942 13.1724 8.00872 13.3052 8.0036Z" fill="#FFC220" />
        <path fillRule="evenodd" clipRule="evenodd" d="M15.0597 2.92299C15.2784 2.77898 15.6224 2.94966 15.8171 3.28301C15.9749 3.55857 15.9864 3.87303 15.8484 4.03656L15.7478 4.11504L13.345 5.22709C13.2036 5.29643 12.9903 5.17642 12.873 4.97375C12.777 4.80947 12.7578 4.62813 12.8235 4.51301L12.889 4.44039L15.0597 2.92299Z" fill="#FFC220" />
        <path fillRule="evenodd" clipRule="evenodd" d="M10.045 0C10.3672 0 10.6487 0.150007 10.7197 0.349707L10.7357 0.474688L10.501 3.10414C10.493 3.26948 10.2824 3.38415 10.045 3.38415C9.85727 3.38415 9.68659 3.30393 9.61901 3.19266L9.58899 3.10414L9.35698 0.474688C9.33031 0.210676 9.66099 0 10.045 0Z" fill="#FFC220" />
      </g>
    </svg>
  );
};
WPlusIcon.displayName = 'WPlusIcon';

export interface SidekickLogoIconProps {
  size?: number;
}

/**
 * Sidekick AI brand mark — the magic-gradient lightning bolt.
 * SVG-only; cannot be a font icon because the gradient is part of the brand.
 * Gradient IDs are stable-unique per instance via `useStableId`.
 */
export const SidekickLogoIcon: React.FC<SidekickLogoIconProps> = ({size = 16}) => {
  const gradientId = useStableId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          x2="24"
          y1="0"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="var(--ld-semantic-color-text-magic-start, #0053E2)" />
          <stop offset="50%" stopColor="var(--ld-semantic-color-text-magic-middle, #3D90EC)" />
          <stop offset="100%" stopColor="var(--ld-semantic-color-text-magic-stop, #79CDF6)" />
        </linearGradient>
      </defs>
      <path
        d="M7.41376 22.9792C6.05479 21.6202 6.05479 19.4169 7.41376 18.0579L17.2564 8.21533L18.7327 9.69172C20.6353 11.5943 20.6353 14.679 18.7327 16.5815L12.3351 22.9792C10.9761 24.3382 8.77274 24.3382 7.41376 22.9792Z"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M5.26677 14.3067C3.3642 12.4042 3.3642 9.31949 5.26677 7.41692L11.6645 1.01923C13.0234 -0.339745 15.2268 -0.339744 16.5857 1.01923C17.9447 2.37821 17.9447 4.58155 16.5857 5.94053L6.74316 15.7831L5.26677 14.3067Z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
};
SidekickLogoIcon.displayName = 'SidekickLogoIcon';
