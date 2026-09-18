// @refresh reset

/**
 * @module ToggleGroup
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
 * For prop API + usage notes, read `ToggleGroup.md` in this folder
 * or run `npm run ld-kit -- show ToggleGroup`.
 */

/**
 * @source PX
 * ToggleGroup – Living Design 3.5
 * Grouped toggle buttons with single or multiple selection modes.
 * Uses shared Toggle CSS tokens via ld-toggle-root classes.
 */
import * as React from 'react';
import '../Toggle/Toggle.css';
import './ToggleGroup.css';

export type ToggleGroupVariant = 'default' | 'outline';
export type ToggleGroupSize = 'small' | 'medium' | 'large';

/* ── Shared group context (variant / size) ── */

interface GroupContextValue {
  variant: ToggleGroupVariant;
  size: ToggleGroupSize;
}

const GroupCtx = React.createContext<GroupContextValue>({variant: 'default', size: 'medium'});

/* ── Single mode context ── */

interface SingleCtxValue {
  _mode: 'single';
  value: string;
  onItemClick: (val: string) => void;
}

const SingleCtx = React.createContext<SingleCtxValue | null>(null);

/* ── Multiple mode context ── */

interface MultipleCtxValue {
  _mode: 'multiple';
  value: string[];
  onItemClick: (val: string) => void;
}

const MultipleCtx = React.createContext<MultipleCtxValue | null>(null);

/* ── Size normalizer ── */

function resolveSize(size: string | null | undefined): ToggleGroupSize {
  switch (size) {
    case 'sm':
    case 'small':
      return 'small';
    case 'lg':
    case 'large':
      return 'large';
    default:
      return 'medium';
  }
}

/* ── Root ── */

type ToggleGroupSingleProps = {
  type: 'single';
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

type ToggleGroupMultipleProps = {
  type: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

type ToggleGroupBaseProps = {
  variant?: ToggleGroupVariant;
  size?: ToggleGroupSize | 'sm' | 'lg';
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

export type ToggleGroupProps = ToggleGroupBaseProps &
  (ToggleGroupSingleProps | ToggleGroupMultipleProps);

export const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({variant = 'default', size = 'medium', UNSAFE_className, UNSAFE_style, children, ...props}, ref) => {
    const resolvedSize = resolveSize(size);
    const groupCtxValue = React.useMemo(
      () => ({variant, size: resolvedSize}),
      [variant, resolvedSize],
    );

    const className = ['px-toggle-group', UNSAFE_className].filter(Boolean).join(' ');

    if (props.type === 'single') {
      return (
        <ToggleGroupSingle
          ref={ref}
          groupCtxValue={groupCtxValue}
          className={className}
          style={UNSAFE_style}
          {...(props as ToggleGroupSingleProps & React.HTMLAttributes<HTMLDivElement>)}
        >
          {children}
        </ToggleGroupSingle>
      );
    }

    return (
      <ToggleGroupMultiple
        ref={ref}
        groupCtxValue={groupCtxValue}
        className={className}
        style={UNSAFE_style}
        {...(props as ToggleGroupMultipleProps & React.HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </ToggleGroupMultiple>
    );
  },
);
ToggleGroup.displayName = 'ToggleGroup';

/* ── Single ── */

interface ToggleGroupSingleInternalProps
  extends ToggleGroupSingleProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  groupCtxValue: GroupContextValue;
}

const ToggleGroupSingle = React.forwardRef<HTMLDivElement, ToggleGroupSingleInternalProps>(
  (
    {
      value: controlledValue,
      defaultValue = '',
      onValueChange,
      groupCtxValue,
      children,
      type: _,
      ...props
    },
    ref,
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const current = isControlled ? (controlledValue ?? '') : internalValue;

    const onItemClick = React.useCallback(
      (val: string) => {
        // Single mode: no deselect — clicking active item is a no-op
        if (current === val) return;
        if (!isControlled) setInternalValue(val);
        onValueChange?.(val);
      },
      [current, isControlled, onValueChange],
    );

    const singleCtxValue = React.useMemo(
      () => ({_mode: 'single' as const, value: current, onItemClick}),
      [current, onItemClick],
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const radios = Array.from(
        e.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]:not([disabled])')
      );
      const idx = radios.findIndex((r) => r === document.activeElement);
      if (idx === -1) return;
      let next = idx;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        next = (idx + 1) % radios.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        next = (idx - 1 + radios.length) % radios.length;
      } else {
        return;
      }
      e.preventDefault();
      radios[next]?.focus();
      radios[next]?.click();
    };

    return (
      <GroupCtx.Provider value={groupCtxValue}>
        <SingleCtx.Provider value={singleCtxValue}>
          <div ref={ref} role="radiogroup" onKeyDown={handleKeyDown} {...props}>
            {children}
          </div>
        </SingleCtx.Provider>
      </GroupCtx.Provider>
    );
  },
);

/* ── Multiple ── */

interface ToggleGroupMultipleInternalProps
  extends ToggleGroupMultipleProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  groupCtxValue: GroupContextValue;
}

const ToggleGroupMultiple = React.forwardRef<HTMLDivElement, ToggleGroupMultipleInternalProps>(
  (
    {
      value: controlledValue,
      defaultValue = [],
      onValueChange,
      groupCtxValue,
      children,
      type: _,
      ...props
    },
    ref,
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const current = isControlled ? (controlledValue ?? []) : internalValue;

    const onItemClick = React.useCallback(
      (val: string) => {
        const next = current.includes(val)
          ? current.filter((v) => v !== val)
          : [...current, val];
        if (!isControlled) setInternalValue(next);
        onValueChange?.(next);
      },
      [current, isControlled, onValueChange],
    );

    const multiCtxValue = React.useMemo(
      () => ({_mode: 'multiple' as const, value: current, onItemClick}),
      [current, onItemClick],
    );

    return (
      <GroupCtx.Provider value={groupCtxValue}>
        <MultipleCtx.Provider value={multiCtxValue}>
          <div ref={ref} role="group" {...props}>
            {children}
          </div>
        </MultipleCtx.Provider>
      </GroupCtx.Provider>
    );
  },
);

/* ── Item ── */

export interface ToggleGroupItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style'> {
  value: string;
  variant?: ToggleGroupVariant;
  size?: ToggleGroupSize | 'sm' | 'lg';
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

export const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({value, variant, size, disabled, UNSAFE_className, UNSAFE_style, children, onClick, ...props}, ref) => {
    const groupCtx = React.useContext(GroupCtx);
    const singleCtx = React.useContext(SingleCtx);
    const multiCtx = React.useContext(MultipleCtx);

    const resolvedVariant = variant ?? groupCtx.variant;
    const resolvedSize = resolveSize(size ?? groupCtx.size);

    // Use _mode flag for deterministic single vs multiple detection
    const isMultiple = multiCtx?._mode === 'multiple';
    const isPressed = singleCtx?._mode === 'single'
      ? singleCtx.value === value
      : (multiCtx?.value.includes(value) ?? false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (singleCtx?._mode === 'single') {
        singleCtx.onItemClick(value);
      } else if (multiCtx?._mode === 'multiple') {
        multiCtx.onItemClick(value);
      }
      onClick?.(e);
    };

    const isTextOnly = typeof children === 'string' || typeof children === 'number';
    const className = [
      'ld-toggle-root',
      `ld-toggle-root--variant-${resolvedVariant}`,
      `ld-toggle-root--size-${resolvedSize}`,
      'ld-toggle-root--shape-square',
      isTextOnly && 'ld-toggle-root--text',
      UNSAFE_className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type="button"
        role={isMultiple ? 'checkbox' : singleCtx?._mode === 'single' ? 'radio' : undefined}
        aria-checked={isMultiple || singleCtx?._mode === 'single' ? isPressed : undefined}
        aria-pressed={isMultiple || singleCtx?._mode === 'single' ? undefined : isPressed}
        tabIndex={singleCtx?._mode === 'single' ? (isPressed ? 0 : -1) : undefined}
        data-state={isPressed ? 'on' : 'off'}
        disabled={disabled}
        className={className}
        style={UNSAFE_style}
        onClick={handleClick}
        {...props}
      >
        <span className="ld-toggle-content">{children}</span>
      </button>
    );
  },
);
ToggleGroupItem.displayName = 'ToggleGroupItem';
