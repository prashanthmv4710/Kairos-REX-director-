// @refresh reset

/**
 * @module Collapsible
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
 * For prop API + usage notes, read `Collapsible.md` in this folder
 * or run `npm run ld-kit -- show Collapsible`.
 */

/**
 * @source PX
 * @ported-from notes/LD-PX-Starter-Kit - V2/client/components/ui/collapsible.tsx
 *
 * Headless expand/collapse primitive used by PX FAQ and filter patterns.
 * Pure React context, no external deps. Visual styling is the consumer's
 * responsibility — this component only manages open/closed state and
 * exposes it via `data-state` for theming hooks.
 */
import * as React from 'react';

interface CollapsibleContextValue {
  open: boolean;
  toggle: () => void;
  disabled: boolean;
}

const CollapsibleCtx = React.createContext<CollapsibleContextValue | null>(
  null,
);

function useCollapsible(): CollapsibleContextValue {
  const ctx = React.useContext(CollapsibleCtx);
  if (!ctx) {
    throw new Error('Collapsible.* must be used within <Collapsible>');
  }
  return ctx;
}

export interface CollapsibleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Called when open state changes (controlled or uncontrolled). */
  onOpenChange?: (open: boolean) => void;
  /** Disable toggling. @default false */
  disabled?: boolean;
}

export const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  function Collapsible(
    {
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      disabled = false,
      children,
      ...props
    },
    ref,
  ) {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : internalOpen;

    const toggle = React.useCallback(() => {
      if (disabled) return;
      const next = !isOpen;
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    }, [disabled, isOpen, isControlled, onOpenChange]);

    return (
      <CollapsibleCtx.Provider value={{open: isOpen, toggle, disabled}}>
        <div
          ref={ref}
          data-state={isOpen ? 'open' : 'closed'}
          data-disabled={disabled || undefined}
          {...props}
        >
          {children}
        </div>
      </CollapsibleCtx.Provider>
    );
  },
);

export interface CollapsibleTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Reserved for API compatibility with the kit source. Slot/asChild
   * behavior is not supported in this port — render a <button> child if
   * you need custom triggers.
   */
  asChild?: boolean;
}

export const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  CollapsibleTriggerProps
>(function CollapsibleTrigger(
  {onClick, children, asChild: _asChild, ...props},
  ref,
) {
  const {open, toggle, disabled} = useCollapsible();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    toggle();
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={open}
      disabled={disabled}
      data-state={open ? 'open' : 'closed'}
      data-disabled={disabled || undefined}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});

export const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function CollapsibleContent({children, style, ...props}, ref) {
  const {open} = useCollapsible();

  if (!open) return null;

  return (
    <div
      ref={ref}
      data-state={open ? 'open' : 'closed'}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
});

Collapsible.displayName = 'Collapsible';
CollapsibleTrigger.displayName = 'CollapsibleTrigger';
CollapsibleContent.displayName = 'CollapsibleContent';
