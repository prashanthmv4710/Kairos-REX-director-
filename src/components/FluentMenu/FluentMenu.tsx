'use client';
// @refresh reset

/**
 * @module FluentMenu
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
 * For prop API + usage notes, read `FluentMenu.md` in this folder
 * or run `npm run ld-kit -- show FluentMenu`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {useStableId, applyCommonProps, CalculatePositionFn, getPositionStyle, debounce} from '../../common/helpers';
import {CSSTransition} from '../../common/CSSTransition';
import './FluentMenu.css';

// Inlined from LayoutContainer for portable positioning
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

// ---------------------------------------------------------------------------
// FluentMenu Context
// ---------------------------------------------------------------------------

interface FluentMenuContextValue {
  isOpen: boolean;
  menuId: string;
  triggerId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  menuRef: React.RefObject<HTMLDivElement>;
  onOpen: () => void;
  onClose: () => void;
}

const FluentMenuContext = React.createContext<FluentMenuContextValue>({
  isOpen: false,
  menuId: '',
  triggerId: '',
  triggerRef: {current: null},
  menuRef: {current: null},
  onOpen: () => {},
  onClose: () => {},
});

// ---------------------------------------------------------------------------
// useOnClick / useOnClickOutside (inlined)
// ---------------------------------------------------------------------------

const useOnClick = (
  onClick: (event: PointerEvent | MouseEvent | TouchEvent) => void,
  dependencies: ReadonlyArray<unknown> = [],
  useCapture = false
) =>
  React.useEffect(() => {
    if (window.PointerEvent) {
      document.addEventListener('pointerdown', onClick, useCapture);
    } else {
      document.addEventListener('mousedown', onClick, useCapture);
      document.addEventListener('touchstart', onClick, useCapture);
    }
    return () => {
      if (window.PointerEvent) {
        document.removeEventListener('pointerdown', onClick, useCapture);
      } else {
        document.removeEventListener('mousedown', onClick, useCapture);
        document.removeEventListener('touchstart', onClick, useCapture);
      }
    };
  }, [onClick, ...dependencies, useCapture]);

const useOnClickOutside = (
  ref: React.RefObject<HTMLElement | null> | React.RefObject<HTMLElement | null>[],
  onClick: (event: PointerEvent | MouseEvent | TouchEvent) => void,
  useCapture = false
) => {
  const listener = (event: PointerEvent | MouseEvent | TouchEvent) => {
    const elementRef = Array.isArray(ref) ? ref : [ref];
    if (elementRef.some((r) => r.current?.contains(event.target as Node))) return;
    onClick(event);
  };
  useOnClick(listener, [ref, listener], useCapture);
};

// ---------------------------------------------------------------------------
// useMenuFocus
// ---------------------------------------------------------------------------

function useMenuFocus(
  itemCount: number,
  isOpen: boolean,
  menuRef: React.RefObject<HTMLElement | null>,
  triggerRef: React.RefObject<HTMLElement | null>
) {
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const prevFocusedIndex = React.useRef(focusedIndex);
  const prevIsOpen = React.useRef(isOpen);

  React.useEffect(() => {
    if (isOpen === prevIsOpen.current) return;
    prevIsOpen.current = isOpen;
    if (isOpen && focusedIndex >= 0) {
      const items = menuRef.current?.querySelectorAll('[role="menuitem"]');
      (items?.[focusedIndex] as HTMLElement)?.focus();
    } else if (!isOpen) {
      triggerRef.current?.focus();
    }
  }, [focusedIndex, isOpen, menuRef, triggerRef]);

  React.useEffect(() => {
    if (!isOpen || focusedIndex === prevFocusedIndex.current) return;
    prevFocusedIndex.current = focusedIndex;
    const items = menuRef.current?.querySelectorAll('[role="menuitem"]');
    (items?.[focusedIndex] as HTMLElement)?.focus();
  }, [focusedIndex, isOpen, menuRef]);

  const lastIndex = itemCount - 1;
  const focusFirst = React.useCallback(() => setFocusedIndex(0), []);
  const focusLast = React.useCallback(() => setFocusedIndex(lastIndex), [lastIndex]);
  const focusNext = React.useCallback(() => {
    setFocusedIndex((i) => (i + 1 > lastIndex ? 0 : i + 1));
  }, [lastIndex]);
  const focusPrev = React.useCallback(() => {
    setFocusedIndex((i) => (i - 1 < 0 ? lastIndex : i - 1));
  }, [lastIndex]);
  const focusNone = React.useCallback(() => setFocusedIndex(-1), []);

  return {focusFirst, focusLast, focusNext, focusPrev, focusNone, focusedIndex};
}

// ---------------------------------------------------------------------------
// FluentMenu (root)
// ---------------------------------------------------------------------------

export interface FluentMenuProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const FluentMenu: React.FunctionComponent<FluentMenuProps> = (props) => {
  const {children, open: controlledOpen, onOpenChange} = props;

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const menuId = useStableId();
  const triggerId = useStableId();
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const onOpen = React.useCallback(() => {
    if (!isControlled) setUncontrolledOpen(true);
    onOpenChange?.(true);
  }, [isControlled, onOpenChange]);

  const onClose = React.useCallback(() => {
    if (!isControlled) setUncontrolledOpen(false);
    onOpenChange?.(false);
  }, [isControlled, onOpenChange]);

  const ctxValue = React.useMemo(
    () => ({isOpen, menuId, triggerId, triggerRef, menuRef, onOpen, onClose}),
    [isOpen, menuId, triggerId, onOpen, onClose]
  );

  return (
    <FluentMenuContext.Provider value={ctxValue}>
      <div className="ld-fluentmenu-root">
        {children}
      </div>
    </FluentMenuContext.Provider>
  );
};

FluentMenu.displayName = 'FluentMenu';

// ---------------------------------------------------------------------------
// FluentMenuTrigger
// ---------------------------------------------------------------------------

export interface FluentMenuTriggerProps {
  children: React.ReactElement;
}

export const FluentMenuTrigger: React.FunctionComponent<FluentMenuTriggerProps> = (props) => {
  const {children} = props;
  const {isOpen, menuId, triggerId, triggerRef, onOpen, onClose} =
    React.useContext(FluentMenuContext);
  const {focusFirst, focusLast, focusNone} = useFluentMenuFocusFromContext();

  return React.cloneElement(children, {
    'aria-controls': isOpen ? menuId : undefined,
    'aria-expanded': isOpen,
    'aria-haspopup': true,
    id: triggerId,
    ref: triggerRef,
    onClick(event: React.MouseEvent<HTMLElement>) {
      ((children.props as Record<string, unknown>).onClick as ((e: React.MouseEvent<HTMLElement>) => void) | undefined)?.(event);
      if (isOpen) {
        onClose();
      } else {
        focusNone();
        onOpen();
      }
    },
    onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
      ((children.props as Record<string, unknown>).onKeyDown as ((e: React.KeyboardEvent<HTMLElement>) => void) | undefined)?.(event);
      const {key} = event;
      if (key === 'ArrowDown' || key === 'Enter' || key === ' ') {
        event.preventDefault();
        onOpen();
        focusFirst();
      } else if (key === 'ArrowUp') {
        event.preventDefault();
        onOpen();
        focusLast();
      }
    },
  } as Record<string, unknown>);
};

FluentMenuTrigger.displayName = 'FluentMenuTrigger';

// A helper hook that gets the menuFocus utilities from the context
function useFluentMenuFocusFromContext() {
  // We store these on a ref inside the context, but since we only need
  // the callbacks we can just return stable functions via a local hook.
  // These get connected in FluentMenuList where we know the item count.
  const ref = React.useRef({
    focusFirst: () => {},
    focusLast: () => {},
    focusNext: () => {},
    focusPrev: () => {},
    focusNone: () => {},
    focusedIndex: -1,
  });
  return ref.current;
}

// We use a separate context for menu focus to avoid re-rendering the whole tree
const FluentMenuFocusContext = React.createContext<ReturnType<typeof useMenuFocus>>({
  focusFirst: () => {},
  focusLast: () => {},
  focusNext: () => {},
  focusPrev: () => {},
  focusNone: () => {},
  focusedIndex: -1,
});

// ---------------------------------------------------------------------------
// FluentMenuList
// ---------------------------------------------------------------------------

export interface FluentMenuListProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  children: React.ReactNode;
}

const calculatePosition: CalculatePositionFn = ({targetHeight}) => ({
  left: 0,
  top: targetHeight + 4,
});

export const FluentMenuList: React.FunctionComponent<FluentMenuListProps> = (props) => {
  const {children, className, ...rest} = applyCommonProps(props);
  const {isOpen, menuId, triggerId, triggerRef, menuRef, onClose} =
    React.useContext(FluentMenuContext);

  const itemCount = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && (child.type as {displayName?: string}).displayName !== 'FluentMenuDivider'
  ).length;

  const menuFocus = useMenuFocus(itemCount, isOpen, menuRef as React.RefObject<HTMLElement | null>, triggerRef);

  useOnClickOutside([menuRef, triggerRef], () => {
    if (isOpen) onClose();
  });

  // Escape closes
  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Positioning logic (inlined from LayoutContainer)
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [positionStyle, setPositionStyle] = React.useState<React.CSSProperties | undefined>(undefined);

  const doSetPositionStyle = React.useCallback(() => {
    setPositionStyle(
      isOpen
        ? getPositionStyle({
            calculatePosition,
            referrerRef: contentRef,
            targetRef: triggerRef as React.RefObject<HTMLElement>,
          })
        : undefined
    );
  }, [calculatePosition, isOpen, triggerRef]);

  useIsomorphicLayoutEffect(doSetPositionStyle, [doSetPositionStyle]);

  React.useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const observer = new ResizeObserver(doSetPositionStyle);
    observer.observe(el);
    return () => observer.disconnect();
  }, [doSetPositionStyle]);

  useDebouncedWindowResize(doSetPositionStyle);

  // Map children — inject onClick to close menu, set tabIndex
  let menuItemIndex = 0;
  const mappedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    if ((child.type as {displayName?: string}).displayName === 'FluentMenuDivider') return child;

    const idx = menuItemIndex++;
    return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
      onClick(event: React.MouseEvent<HTMLElement>) {
        ((child.props as Record<string, unknown>).onClick as ((e: React.MouseEvent<HTMLElement>) => void) | undefined)?.(event);
        onClose();
      },
      tabIndex: idx === menuFocus.focusedIndex ? 0 : -1,
    });
  });

  return (
    <div className="ld-fluentmenu-layoutContainer">
      <div className="ld-fluentmenu-content" ref={contentRef} style={positionStyle}>
        <CSSTransition
          classNames={{
            enter: 'ld-fluentmenu-enter',
            enterActive: 'ld-fluentmenu-enterActive',
            exit: 'ld-fluentmenu-exit',
            exitActive: 'ld-fluentmenu-exitActive',
          }}
          in={isOpen}
          mountOnEnter
          nodeRef={menuRef as React.RefObject<HTMLElement | null>}
          timeout={100}
          unmountOnExit
        >
          <div
            aria-labelledby={triggerId}
            className={cx('ld-fluentmenu-list', className)}
            id={menuId}
            onKeyDown={(event) => {
              const {key} = event;
              if (key === 'ArrowDown') {
                event.preventDefault();
                menuFocus.focusNext();
              } else if (key === 'ArrowUp') {
                event.preventDefault();
                menuFocus.focusPrev();
              } else if (key === 'Home') {
                event.preventDefault();
                menuFocus.focusFirst();
              } else if (key === 'End') {
                event.preventDefault();
                menuFocus.focusLast();
              }
            }}
            ref={menuRef}
            role="menu"
            {...rest}
          >
            {mappedChildren}
          </div>
        </CSSTransition>
      </div>
    </div>
  );
};

FluentMenuList.displayName = 'FluentMenuList';

// ---------------------------------------------------------------------------
// FluentMenuItem
// ---------------------------------------------------------------------------

export interface FluentMenuItemProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'className' | 'style'> {
  children: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const FluentMenuItem = React.forwardRef<HTMLButtonElement, FluentMenuItemProps>(
  (props, ref) => {
    const {children, className, disabled, icon, ...rest} = applyCommonProps(props);

    return (
      <button
        className={cx('ld-fluentmenu-item', className)}
        disabled={disabled}
        ref={ref}
        role="menuitem"
        type="button"
        {...rest}
      >
        {icon && <span className="ld-fluentmenu-itemIcon">{icon}</span>}
        {children}
      </button>
    );
  }
);

FluentMenuItem.displayName = 'FluentMenuItem';

// ---------------------------------------------------------------------------
// FluentMenuDivider
// ---------------------------------------------------------------------------

export const FluentMenuDivider: React.FunctionComponent<
  Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'>
> = (props) => {
  const {className, ...rest} = applyCommonProps(props);
  return <div className={cx('ld-fluentmenu-divider', className)} role="separator" {...rest} />;
};

FluentMenuDivider.displayName = 'FluentMenuDivider';
