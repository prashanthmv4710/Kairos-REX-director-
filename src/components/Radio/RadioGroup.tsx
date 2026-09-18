'use client';

import * as React from 'react';

import {cx} from '../../common/cx';
import {Radio, type RadioProps} from './Radio';

import './RadioGroup.css';

interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  disabled: boolean;
  required: boolean;
  onValueChange: (value: string) => void;
}

const RadioGroupCtx = React.createContext<RadioGroupContextValue | null>(null);

export function useRadioGroupContext(): RadioGroupContextValue | null {
  return React.useContext(RadioGroupCtx);
}

export interface RadioGroupProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'defaultValue' | 'onChange'
  > {
  /** Controlled selected value. */
  value?: string;
  /** Uncontrolled initial selected value. */
  defaultValue?: string;
  /** Fires whenever the selected value changes. */
  onValueChange?: (value: string) => void;
  /** Disables every item in the group. @default false */
  disabled?: boolean;
  /** Marks the group as required for form validation. @default false */
  required?: boolean;
  /** Shared `name` attribute. Auto-generated when omitted. */
  name?: string;
  /** Layout direction. @default 'vertical' */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * RadioGroup
 *
 * Controlled context wrapper around `core/Radio`. Use with `RadioGroupItem`
 * children for declarative usage, or with raw `<Radio>` elements when you
 * need to wire `name` / `checked` / `onChange` yourself.
 */
export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onValueChange,
      disabled = false,
      required = false,
      name: providedName,
      orientation = 'vertical',
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = React.useState<string | undefined>(
      defaultValue,
    );
    const currentValue = isControlled ? controlledValue : internalValue;

    const generatedNameRef = React.useRef<string | undefined>(undefined);
    if (!generatedNameRef.current) {
      generatedNameRef.current = `ld-radio-group-${Math.random()
        .toString(36)
        .slice(2, 10)}`;
    }
    const name = providedName ?? generatedNameRef.current;

    const handleValueChange = React.useCallback(
      (val: string) => {
        if (!isControlled) setInternalValue(val);
        onValueChange?.(val);
      },
      [isControlled, onValueChange],
    );

    const ctxValue = React.useMemo<RadioGroupContextValue>(
      () => ({
        name,
        value: currentValue,
        disabled,
        required,
        onValueChange: handleValueChange,
      }),
      [name, currentValue, disabled, required, handleValueChange],
    );

    return (
      <RadioGroupCtx.Provider value={ctxValue}>
        <div
          ref={ref}
          role="radiogroup"
          aria-orientation={orientation}
          aria-required={required || undefined}
          aria-disabled={disabled || undefined}
          className={cx(
            'ld-radio-group',
            `ld-radio-group--${orientation}`,
            className,
          )}
          {...rest}
        >
          {children}
        </div>
      </RadioGroupCtx.Provider>
    );
  },
);

RadioGroup.displayName = 'RadioGroup';

// ─── Item adapter ───────────────────────────────────────────────────────────

type RadioGroupItemBaseProps = Omit<
  RadioProps,
  'name' | 'checked' | 'onChange' | 'value'
>;

export type RadioGroupItemProps = RadioGroupItemBaseProps & {
  /** The value this item represents. */
  value: string;
};

export const RadioGroupItem = React.forwardRef<
  HTMLInputElement,
  RadioGroupItemProps
>((props, ref) => {
  const ctx = useRadioGroupContext();
  if (!ctx) {
    throw new Error('RadioGroupItem must be rendered inside a <RadioGroup>.');
  }

  const {value, disabled: itemDisabled, ...rest} = props;
  const isDisabled = ctx.disabled || itemDisabled === true;

  return (
    <Radio
      ref={ref}
      {...(rest as RadioProps)}
      name={ctx.name}
      value={value}
      checked={ctx.value === value}
      disabled={isDisabled}
      onChange={(e) => {
        if (e.target.checked) ctx.onValueChange(value);
      }}
    />
  );
});

RadioGroupItem.displayName = 'RadioGroupItem';
