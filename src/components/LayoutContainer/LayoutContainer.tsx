'use client';
// @refresh reset

/**
 * @module LayoutContainer
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
 * For prop API + usage notes, read `LayoutContainer.md` in this folder
 * or run `npm run ld-kit -- show LayoutContainer`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {getPositionStyle, CalculatePositionFn, debounce} from '../../common/helpers';
import './LayoutContainer.css';

// Inlined from hooks to avoid transitive @livingdesign/tokens dependency
const isDomEnvironment =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined';

const useIsomorphicLayoutEffect = isDomEnvironment
  ? React.useLayoutEffect
  : React.useEffect;

const useDebouncedWindowResize = (
  onResize: (...args: unknown[]) => void
) =>
  React.useEffect(() => {
    const listener = debounce(onResize, 250);
    window.addEventListener('resize', listener);
    return () => {
      window.removeEventListener('resize', listener);
      listener.cancel();
    };
  }, [onResize]);

export interface LayoutContainerProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'content'> {
  /**
   * The position calculator for the layout container.
   */
  calculatePosition: CalculatePositionFn;
  /**
   * The referrer for the layout container.
   */
  content: React.ReactNode;
  /**
   * The trigger for the layout container.
   */
  trigger: React.ReactNode;
  /**
   * The trigger ref for the layout container.
   */
  triggerRef: React.RefObject<HTMLElement>;
}

/**
 * A layout container positioning manager for components with a trigger and
 * content (Callout, Menu, Popover, etc.)
 *
 * @private
 */
export const LayoutContainer: React.FunctionComponent<LayoutContainerProps> = (
  props
) => {
  const {calculatePosition, className, content, trigger, triggerRef, ...rest} =
    props;

  const contentRef = React.useRef<HTMLDivElement>(null);
  const [positionStyle, setPositionStyle] = React.useState<
    React.CSSProperties | undefined
  >(undefined);

  const doSetPositionStyle = React.useCallback(() => {
    setPositionStyle(
      content
        ? getPositionStyle({
            calculatePosition,
            referrerRef: contentRef,
            targetRef: triggerRef,
          })
        : undefined
    );
  }, [calculatePosition, content, triggerRef]);

  useIsomorphicLayoutEffect(doSetPositionStyle, [doSetPositionStyle]);

  // Recalculate position when the content element resizes (e.g. when
  // CSSTransition mounts its children asynchronously after the initial render).
  React.useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const observer = new ResizeObserver(doSetPositionStyle);
    observer.observe(el);
    return () => observer.disconnect();
  }, [doSetPositionStyle]);

  useDebouncedWindowResize(doSetPositionStyle);

  return (
    <div className={cx('ld-layoutcontainer-layoutContainer', className)} {...rest}>
      {trigger}

      <div className={'ld-layoutcontainer-content'} ref={contentRef} style={positionStyle}>
        {content}
      </div>
    </div>
  );
};
