// @refresh reset

/**
 * @module MagicBox
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
 * For prop API + usage notes, read `MagicBox.md` in this folder
 * or run `npm run ld-kit -- show MagicBox`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import './MagicBox.css';
export type MagicBoxBorderRadius = '25' | '50' | '100' | '200' | 'round';
export type MagicBoxState = 'idle' | 'loading' | 'active';

const MAGIC_BOX_RADIUS_PX: Record<MagicBoxBorderRadius, number> = {
  '25': 2,
  '50': 4,
  '100': 8,
  '200': 16,
  round: 999,
};

export interface MagicBoxProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  /**
   * Whether to render the animated magic border.
   *
   * @default true
   */
  active?: boolean;
  /**
   * The border radius for the Magic Box.
   *
   * @default "100"
   */
  borderRadius?: MagicBoxBorderRadius;
  /**
   * The content for the magic box.
   */
  children: React.ReactNode;
  /**
   * The height for the Magic Box.
   */
  height?: React.CSSProperties['height'];
  /**
   * The animation state for the magic effect.
   *
   * @default "loading"
   */
  state?: MagicBoxState;
  /**
   * The width for the Magic Box.
   */
  width?: React.CSSProperties['width'];
}

/**
 * Magic Boxes highlight the content being emphasized or agentically updated by AI.
 * *
 */
export const MagicBox: React.FunctionComponent<MagicBoxProps> = (props) => {
  const {
    active = true,
    borderRadius = '100',
    children,
    className,
    height,
    state = 'loading',
    style,
    width,
    ...rest
  } = applyCommonProps(props);
  const instanceId = React.useId().replace(/:/g, '');
  const borderRadiusPx = MAGIC_BOX_RADIUS_PX[borderRadius];
  const gradientId = (size: 's' | 'm' | 'l' | 'xl') => `ld-magicbox-gradient-${size}-${instanceId}`;

  /*
   * The `round` variant needs `rx === ry === min(width, height) / 2` on the
   * SVG rect for a true capsule. SVG independently clamps rx → width/2 and
   * ry → height/2, so passing the large literal 999 produces an ellipse on
   * wide-flat boxes (the four corner arcs meet in the middle). Measure the
   * actual rendered box on mount + resize and use the smaller half-dimension
   * as the corner radius. Non-round variants keep the static token-derived
   * pixel value so they don't pay the measurement cost.
   */
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [pillRadiusPx, setPillRadiusPx] = React.useState<number>(borderRadiusPx);

  React.useLayoutEffect(() => {
    if (!active || borderRadius !== 'round') return;
    const node = containerRef.current;
    if (!node) return;
    const update = () => {
      const r = node.getBoundingClientRect();
      const next = Math.max(0, Math.min(r.width, r.height) / 2);
      setPillRadiusPx(next);
    };
    update();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(update);
    ro.observe(node);
    return () => ro.disconnect();
  }, [active, borderRadius]);

  const effectiveRx = borderRadius === 'round' ? pillRadiusPx : borderRadiusPx;

  if (!active) {
    return <>{children}</>;
  }

  return (
    <div
      ref={containerRef}
      className={cx(
        'ld-magicbox-magicBox',
        state === 'idle' && 'ld-magicbox-stateIdle',
        state === 'loading' && 'ld-magicbox-stateLoading',
        state === 'active' && 'ld-magicbox-stateActive',
        borderRadius === '25' && 'ld-magicbox-borderRadius25',
        borderRadius === '50' && 'ld-magicbox-borderRadius50',
        borderRadius === '100' && 'ld-magicbox-borderRadius100',
        borderRadius === '200' && 'ld-magicbox-borderRadius200',
        borderRadius === 'round' && 'ld-magicbox-borderRadiusRound',
        className
      )}
      style={{
        ...style,
        height,
        width,
      }}
      {...rest}
    >
      <div aria-hidden="true" className={'ld-magicbox-magicGlowContainer'}>
        <svg className={'ld-magicbox-magicGlowSvg ld-magicbox-magicBoxGradientContainer1'}>
            <defs>
              <linearGradient id={gradientId('s')} x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="var(--ld-semantic-color-border-magic-start, #0053E2)" />
                <stop offset="50%" stopColor="var(--ld-semantic-color-border-magic-middle, #3D90EC)" />
                <stop offset="100%" stopColor="var(--ld-semantic-color-border-magic-stop, #79CDF6)" />
              </linearGradient>
            </defs>
            <rect
              fill="none"
              height="calc(100% - 2px)"
              pathLength="1"
              rx={effectiveRx}
              ry={effectiveRx}
              stroke={`url(#${gradientId('s')})`}
              strokeWidth="2"
              width="calc(100% - 2px)"
              x="1"
              y="1"
            />
          </svg>
          <svg className={'ld-magicbox-magicGlowSvg ld-magicbox-magicBoxGradientContainer2'}>
            <defs>
              <linearGradient id={gradientId('m')} x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="var(--ld-semantic-color-border-magic-start, #0053E2)" />
                <stop offset="50%" stopColor="var(--ld-semantic-color-border-magic-middle, #3D90EC)" />
                <stop offset="100%" stopColor="var(--ld-semantic-color-border-magic-stop, #79CDF6)" />
              </linearGradient>
            </defs>
            <rect
              fill="none"
              height="calc(100% - 2px)"
              pathLength="1"
              rx={effectiveRx}
              ry={effectiveRx}
              stroke={`url(#${gradientId('m')})`}
              strokeWidth="2"
              width="calc(100% - 2px)"
              x="1"
              y="1"
            />
          </svg>
          <svg className={'ld-magicbox-magicGlowSvg ld-magicbox-magicBoxGradientContainer3'}>
            <defs>
              <linearGradient id={gradientId('l')} x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="var(--ld-semantic-color-border-magic-start, #0053E2)" />
                <stop offset="50%" stopColor="var(--ld-semantic-color-border-magic-middle, #3D90EC)" />
                <stop offset="100%" stopColor="var(--ld-semantic-color-border-magic-stop, #79CDF6)" />
              </linearGradient>
            </defs>
            <rect
              fill="none"
              height="calc(100% - 2px)"
              pathLength="1"
              rx={effectiveRx}
              ry={effectiveRx}
              stroke={`url(#${gradientId('l')})`}
              strokeWidth="2"
              width="calc(100% - 2px)"
              x="1"
              y="1"
            />
          </svg>
          <svg className={'ld-magicbox-magicGlowSvg ld-magicbox-magicBoxGradientContainer4'}>
            <defs>
              <linearGradient id={gradientId('xl')} x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="var(--ld-semantic-color-border-magic-start, #0053E2)" />
                <stop offset="50%" stopColor="var(--ld-semantic-color-border-magic-middle, #3D90EC)" />
                <stop offset="100%" stopColor="var(--ld-semantic-color-border-magic-stop, #79CDF6)" />
              </linearGradient>
            </defs>
            <rect
              fill="none"
              height="calc(100% - 2px)"
              pathLength="1"
              rx={effectiveRx}
              ry={effectiveRx}
              stroke={`url(#${gradientId('xl')})`}
              strokeWidth="2"
              width="calc(100% - 2px)"
              x="1"
              y="1"
            />
          </svg>
      </div>
      <div className={cx('ld-magicbox-magicBoxContentWrapper')}>
        {children}
      </div>
    </div>
  );
};

MagicBox.displayName = 'MagicBox';
