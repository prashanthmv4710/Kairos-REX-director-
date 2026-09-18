'use client';
// @refresh reset

/**
 * @module LineClamp
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
 * For prop API + usage notes, read `LineClamp.md` in this folder
 * or run `npm run ld-kit -- show LineClamp`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import './LineClamp.css';
// ---------------------------------------------------------------------------
// LineClamp.service (inlined sub-component)
// ---------------------------------------------------------------------------

// TODO: add coverage for the "istanbul ignore next" lines

/*
 * The baseline ratio for Walmart's common brand fonts are hardcoded here to
 * avoid the added cost of the calculation.
 *
 * NOTE: It was discovered that this baseline ratio is slightly different between browsers.
 * A spike ticket was created to investigate the impact of calculating baseline ratio at
 * runtime: https://jira.walmart.com/browse/LD-3532
 */
export const BOGLE_BASELINE_RATIO = 0.21739130434782605;
export const EVERYDAY_SANS_BASELINE_RATIO = 0.19999999999999996;

export type FontFamilyName = 'Bogle' | 'EverydaySans';

const fontBaselineMap: Record<FontFamilyName, number> = {
  EverydaySans: EVERYDAY_SANS_BASELINE_RATIO,
  Bogle: BOGLE_BASELINE_RATIO,
};

const isFontFamilyName = (fontFamily: string): fontFamily is FontFamilyName => {
  return Object.keys(fontBaselineMap).includes(fontFamily);
};

const getRelativeLineHeight = (lineHeight: string, fontSize: string) => {
  return parseFloat(lineHeight) / parseFloat(fontSize);
};
const calculateBaselineRatio = (target: Element): number => {
  // Large numbers help improve accuracy.
  const TEST_FONT_SIZE = 2000;

  const style = window.getComputedStyle(target);
  const elem = document.body;

  // The container is a little defensive.
  const container = document.createElement('div');
  container.style.display = 'block';
  container.style.position = 'absolute';
  container.style.bottom = '0';
  container.style.right = '0';
  container.style.width = '0px';
  container.style.height = '0px';
  container.style.margin = '0';
  container.style.padding = '0';
  container.style.visibility = 'hidden';
  container.style.overflow = 'hidden';
  container.style.font = style.font;

  const small = document.createElement('span');
  const large = document.createElement('span');

  small.style.fontSize = '0px';
  large.style.fontSize = `${TEST_FONT_SIZE}px`;

  small.innerHTML = 'X';
  large.innerHTML = 'X';

  container.appendChild(small);
  container.appendChild(large);

  // Put the element in the DOM for a split second.
  elem.appendChild(container);
  const smallRect = small.getBoundingClientRect();
  const largeRect = large.getBoundingClientRect();
  elem.removeChild(container);

  // Calculate where the baseline was, percentage-wise.
  const baselinePosition = smallRect.top - largeRect.top;
  const {height} = largeRect;

  return 1 - baselinePosition / height;
};

const getBaselineRatio = (fontFamily: string, target: Element) => {
  if (isFontFamilyName(fontFamily)) {
    return fontBaselineMap[fontFamily];
  }

  // If font is not included in the map, calculate baseline ratio dynamically
  return calculateBaselineRatio(target);
};

export const useDescenderPadding = (
  targetRef: React.RefObject<HTMLSpanElement>
) => {
  const [descenderPadding, setDescenderPadding] = React.useState(0);

  React.useEffect(() => {
    if (!targetRef.current) {
      return;
    }

    const {fontFamily, fontSize, lineHeight} = window.getComputedStyle(
      targetRef.current
    );
    /*
     * `getRelativeLineHeight` returns NaN if computedStyle.lineHeight is not defined. In
     * those cases, fall back to 1 as a default.
     */
    const relativeLineHeight = getRelativeLineHeight(lineHeight, fontSize) || 1;
    const baselineRatio = getBaselineRatio(fontFamily, targetRef.current);

    setDescenderPadding(
      Math.max(0, 1 - relativeLineHeight + baselineRatio) / 2
    );
  }, [targetRef]);

  return descenderPadding;
};

export interface LineClampProps
  extends Omit<React.ComponentPropsWithoutRef<'span'>, 'className' | 'style'> {
  /**
   * The content for the line clamp.
   */
  children: React.ReactNode;
  /**
   * The number of visible lines.
   *
   * @default 2
   */
  lines?: number;
}

/**
 * Line Clamp is a utility component that limits the number of visible lines of text.
 * *
 */
export const LineClamp: React.FunctionComponent<LineClampProps> = (props) => {
  const {className, lines = 2, ...rest} = applyCommonProps(props);

  const ref = React.useRef<HTMLSpanElement>(null);

  const descenderPadding = useDescenderPadding(ref);

  return (
    <span
      className={cx(className, 'ld-lineclamp-lineClamp')}
      ref={ref}
      style={{
        WebkitLineClamp: lines,
        paddingBottom: `${descenderPadding}em`,
        marginBottom: `-${descenderPadding}em`,
      }}
      {...rest}
    />
  );
};

LineClamp.displayName = 'LineClamp';
