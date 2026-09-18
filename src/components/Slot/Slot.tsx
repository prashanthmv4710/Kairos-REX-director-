// @refresh reset

/**
 * @module Slot
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
 * For prop API + usage notes, read `Slot.md` in this folder
 * or run `npm run ld-kit -- show Slot`.
 */

/**
 * @source PX
 * @ported-from notes/LD-PX-Starter-Kit - V2/client/components/ui/slot.tsx
 *
 * Standalone Slot replacement for `@radix-ui/react-slot`. Renders its
 * single child element with all Slot props merged onto it. Used by other
 * PX primitives (Trigger components, Form labels) that support the
 * `asChild` pattern.
 *
 * Self-contained — no external deps.
 */
import * as React from 'react';

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (value: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

function mergeProps(
  slotProps: Record<string, unknown>,
  childProps: Record<string, unknown>,
): Record<string, unknown> {
  const merged: Record<string, unknown> = {...slotProps};

  for (const key of Object.keys(childProps)) {
    const slotVal = slotProps[key];
    const childVal = childProps[key];

    if (key === 'style') {
      merged[key] = {
        ...(slotVal as React.CSSProperties | undefined),
        ...(childVal as React.CSSProperties | undefined),
      };
    } else if (key === 'className') {
      merged[key] = [slotVal, childVal].filter(Boolean).join(' ');
    } else if (/^on[A-Z]/.test(key)) {
      if (typeof slotVal === 'function' && typeof childVal === 'function') {
        merged[key] = (...args: unknown[]) => {
          (childVal as (...a: unknown[]) => void)(...args);
          (slotVal as (...a: unknown[]) => void)(...args);
        };
      } else {
        merged[key] = childVal || slotVal;
      }
    } else {
      merged[key] = childVal !== undefined ? childVal : slotVal;
    }
  }

  return merged;
}

export const Slot = React.forwardRef<HTMLElement, SlotProps>(function Slot(
  {children, ...slotProps},
  forwardedRef,
) {
  const child = React.Children.only(children) as React.ReactElement<
    Record<string, unknown>
  >;

  if (!React.isValidElement(child)) {
    return null;
  }

  const childRef = (
    child as unknown as {ref?: React.Ref<HTMLElement>}
  ).ref;
  const mergedRef = mergeRefs(forwardedRef, childRef);
  const mergedAllProps = mergeProps(
    slotProps as Record<string, unknown>,
    child.props as Record<string, unknown>,
  );

  return React.cloneElement(child, {
    ...mergedAllProps,
    ref: mergedRef,
  } as React.Attributes & Record<string, unknown>);
});

Slot.displayName = 'Slot';
