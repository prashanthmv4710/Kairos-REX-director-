// @refresh reset

/**
 * @module MagicFill
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
 * For prop API + usage notes, read `MagicFill.md` in this folder
 * or run `npm run ld-kit -- show MagicFill`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps, CommonProps} from '../../common/helpers';
import './MagicFill.css';

export type MagicFillBorderRadius = '25' | '50' | '100' | '200' | 'round';

export interface MagicFillProps
  extends CommonProps,
    Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  /**
   * The border radius for the Magic Fill.
   *
   * @default "100"
   */
  borderRadius?: MagicFillBorderRadius;
  /**
   * The content for the magic fill.
   */
  children: React.ReactNode;
  /**
   * The height for the Magic Fill.
   */
  height?: React.CSSProperties['height'];
  /**
   * The width for the Magic Fill.
   */
  width?: React.CSSProperties['width'];
}

/**
 * MagicFill applies a solid diagonal gradient treatment to AI/agent-branded
 * surfaces. The gradient's contrasting text color varies by Agent theme (it's
 * white for customer/partner's dark fill, dark for developer/associate's
 * light-accent fill) via --ld-semantic-color-text-inverse. This
 * only reaches plain-text children through CSS inheritance — Body/Heading/
 * Caption children always set their own explicit color, so pass
 * `style={{color: 'var(--ld-semantic-color-text-inverse, #ffffff)'}}`
 * on them directly rather than a fixed `color="inverse"`.
 */
export const MagicFill: React.FunctionComponent<MagicFillProps> = (props) => {
  const {
    borderRadius = '100',
    children,
    className,
    height,
    style,
    width,
    ...rest
  } = applyCommonProps(props);

  return (
    <div
      className={cx(
        'ld-magicfill-magicFill',
        borderRadius === '25' && 'ld-magicfill-borderRadius25',
        borderRadius === '50' && 'ld-magicfill-borderRadius50',
        borderRadius === '100' && 'ld-magicfill-borderRadius100',
        borderRadius === '200' && 'ld-magicfill-borderRadius200',
        borderRadius === 'round' && 'ld-magicfill-borderRadiusRound',
        className
      )}
      style={{
        ...style,
        height,
        width,
      }}
      {...rest}
    >
      <div className={cx('ld-magicfill-magicFillContentWrapper')}>
        {children}
      </div>
    </div>
  );
};

MagicFill.displayName = 'MagicFill';
