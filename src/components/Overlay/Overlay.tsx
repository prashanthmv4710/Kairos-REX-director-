// @refresh reset

/**
 * @module Overlay
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
 * For prop API + usage notes, read `Overlay.md` in this folder
 * or run `npm run ld-kit -- show Overlay`.
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {cx} from '../../common/cx';
import {FocusTrap} from '../FocusTrap';
import './Overlay.css';

// ---------------------------------------------------------------------------
// Overlay.service (inlined sub-component)
// ---------------------------------------------------------------------------

/**
 * Create and attach element to the body to be used for portal.
 *
 * @private
 *
 * {@link https://www.jayfreestone.com/writing/react-portals-with-hooks}
 *
 * @returns {React.Ref} A ref to the portal element
 */
export const usePortal = () => {
  const portalRef = React.useRef<HTMLElement | null>(null);

  const container = document.body;

  if (!portalRef.current) {
    portalRef.current = document.createElement('div');
  }

  React.useEffect(() => {
    container.appendChild(portalRef.current as Node);

    return () => {
      if (!portalRef.current) {
        return;
      }

      // NOTE: IE 11 needs removeChild
      container.removeChild(portalRef.current);
    };
  }, [container, portalRef]);

  return portalRef;
};
// ---------------------------------------------------------------------------
// OverlayScrim (inlined sub-component)
// ---------------------------------------------------------------------------

export type OverlayScrimProps = React.ComponentPropsWithoutRef<'div'>;

/**
 * @private
 */
export const OverlayScrim: React.FunctionComponent<OverlayScrimProps> = (
  props
) => {
  const {className, ...rest} = props;

  return <div className={cx('ld-overlay-overlayscrim-scrim', className)} {...rest} />;
};

export type OverlayProps = React.ComponentPropsWithRef<'div'>;

/**
 * @private
 */
export const Overlay = React.forwardRef<HTMLDivElement, OverlayProps>(
  (props, ref) => {
    const {children, ...rest} = props;

    const overlayPortal = usePortal();

    return ReactDOM.createPortal(
      <div ref={ref} {...rest}>
        <FocusTrap UNSAFE_className={'ld-overlay-trap'}>{children}</FocusTrap>
      </div>,
      overlayPortal.current as Element
    );
  }
);
