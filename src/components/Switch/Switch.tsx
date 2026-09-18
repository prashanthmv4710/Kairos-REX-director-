// @refresh reset

/**
 * @module Switch
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
 * For prop API + usage notes, read `Switch.md` in this folder
 * or run `npm run ld-kit -- show Switch`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {invariant, applyCommonProps} from '../../common/helpers';
import {emit} from '../../common/helpers';
import './Switch.css';

export type SwitchSize = 'small' | 'medium';

interface SwitchBaseProps
  extends Omit<
      React.ComponentPropsWithoutRef<'button'>,
      'className' | 'onChange' | 'style'
    > {
  /** @default false */
  disabled?: boolean;
  /** @default false */
  isOn?: boolean;
  /**
   * Visual size. `medium` (default) is 48×24px. `small` is 40×20px.
   * @default 'medium'
   */
  size?: SwitchSize;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface SwitchA11yProps extends SwitchBaseProps {
  a11yLabelledBy: string;
  label?: never;
}

export interface SwitchLabelProps extends SwitchBaseProps {
  label: React.ReactNode;
  a11yLabelledBy?: never;
}

export type SwitchProps = SwitchA11yProps | SwitchLabelProps;

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (props, ref) => {
    const {
      a11yLabelledBy,
      className,
      isOn = false,
      disabled = false,
      label,
      onClick,
      size = 'medium',
      ...rest
    } = applyCommonProps(props);

    const labelCount = (label ? 1 : 0) + (a11yLabelledBy ? 1 : 0) === 1;
    invariant(
      labelCount,
      '`Switch` accessibility violation. `Switch` requires a `label` OR an `a11yLabelledBy`.'
    );

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      emit('ui:switch:toggle', {isOn: !isOn});
      onClick?.(e);
    };

    return (
      <button
        aria-checked={isOn}
        className={cx(
          'ld-switch-pill',
          size === 'small' && 'ld-switch-small',
          isOn && 'ld-switch-on',
          className,
        )}
        disabled={disabled}
        onClick={handleClick}
        ref={ref}
        role="switch"
        type="button"
        {...(a11yLabelledBy && {'aria-labelledby': a11yLabelledBy})}
        {...rest}
      >
        <span
          className={cx(
            'ld-switch-indicator',
            size === 'small' && 'ld-switch-indicator-small',
            isOn && 'ld-switch-on',
          )}
        />
        {label && (
          <span className={cx('ld-switch-label', isOn && 'ld-switch-on')}>
            {label}
          </span>
        )}
      </button>
    );
  }
);

Switch.displayName = 'Switch';
