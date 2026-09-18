'use client';

import * as React from 'react';
// Breakpoint values inlined from @livingdesign/tokens to avoid external dependency
const scaleBreakpointMedium = '37.5rem';
const scaleBreakpointLarge = '56.25rem';
const scaleBreakpointXlarge = '75rem';
const scaleBreakpointXxlarge = '120rem';
import {useDefaultBreakpoint} from '../components/DefaultBreakpoint/DefaultBreakpoint';
import {debounce, remToPxValue} from '../common/helpers';

// ---------------------------------------------------------------------------
// useDebouncedWindowResize
// ---------------------------------------------------------------------------
export const useDebouncedWindowResize = (
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
// useBreakpoints
// ---------------------------------------------------------------------------
export const useBreakpoints = () => {
  const [isAboveMedium, setIsAboveMedium] = React.useState(false);
  const [isAboveLarge, setIsAboveLarge] = React.useState(false);
  const [isAboveXLarge, setIsAboveXLarge] = React.useState(false);
  const [isAboveXxLarge, setIsAboveXxLarge] = React.useState(false);

  const defaultBreakpoint = useDefaultBreakpoint();

  const ssrReturnValue = React.useMemo(() => {
    return {
      isAboveSmall: true,
      isAboveMedium:
        defaultBreakpoint === 'medium' ||
        defaultBreakpoint === 'large' ||
        defaultBreakpoint === 'xlarge' ||
        defaultBreakpoint === 'xxlarge',
      isAboveLarge:
        defaultBreakpoint === 'large' ||
        defaultBreakpoint === 'xlarge' ||
        defaultBreakpoint === 'xxlarge',
      isAboveXLarge:
        defaultBreakpoint === 'xlarge' || defaultBreakpoint === 'xxlarge',
      isAboveXxLarge: defaultBreakpoint === 'xxlarge',
    };
  }, [defaultBreakpoint]);

  const updateBreakpointsState = React.useCallback(() => {
    const width = window?.visualViewport?.width;
    if (!width) {
      return;
    }
    setIsAboveMedium(width > remToPxValue(scaleBreakpointMedium));
    setIsAboveLarge(width > remToPxValue(scaleBreakpointLarge));
    setIsAboveXLarge(width > remToPxValue(scaleBreakpointXlarge));
    setIsAboveXxLarge(width > remToPxValue(scaleBreakpointXxlarge));
  }, []);

  React.useEffect(() => {
    updateBreakpointsState();
  }, [updateBreakpointsState]);

  useDebouncedWindowResize(updateBreakpointsState);

  return typeof window !== 'undefined'
    ? {
        isAboveSmall: true,
        isAboveMedium,
        isAboveLarge,
        isAboveXLarge,
        isAboveXxLarge,
      }
    : ssrReturnValue;
};

// ---------------------------------------------------------------------------
// useIsomorphicLayoutEffect
// ---------------------------------------------------------------------------
export const isDomEnvironment =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined';

export const useIsomorphicLayoutEffect = isDomEnvironment
  ? React.useLayoutEffect
  : React.useEffect;

// ---------------------------------------------------------------------------
// useMenuFocus
// ---------------------------------------------------------------------------
export const useMenuFocus = (
  children: React.ReactNode,
  isOpen: boolean,
  menuRef: React.RefObject<HTMLElement>,
  triggerRef: React.RefObject<HTMLElement>
) => {
  const [focusedItemIndex, setFocusedItemIndex] = React.useState(0);
  const previousFocusedItemIndex = React.useRef(focusedItemIndex);
  const previousIsOpen = React.useRef(isOpen);
  const lastIndex = React.Children.count(children) - 1;

  React.useEffect(() => {
    if (isOpen === previousIsOpen.current) {
      return;
    }
    previousIsOpen.current = isOpen;

    if (isOpen && focusedItemIndex !== -1) {
      const child = menuRef.current?.children[focusedItemIndex] as HTMLElement | undefined;
      child?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [focusedItemIndex, isOpen, menuRef, previousIsOpen, triggerRef]);

  React.useEffect(() => {
    if (!isOpen || focusedItemIndex === previousFocusedItemIndex.current) {
      return;
    }
    previousFocusedItemIndex.current = focusedItemIndex;
    const child = menuRef.current?.children[focusedItemIndex] as HTMLElement | undefined;
    child?.focus();
  }, [focusedItemIndex, isOpen, menuRef, previousFocusedItemIndex]);

  const focusNoItem = React.useCallback(() => setFocusedItemIndex(-1), []);
  const focusFirstItem = React.useCallback(() => setFocusedItemIndex(0), []);
  const focusLastItem = React.useCallback(() => setFocusedItemIndex(lastIndex), [lastIndex]);
  const focusNextItem = React.useCallback(() => {
    setFocusedItemIndex((index) => (index + 1 > lastIndex ? 0 : index + 1));
  }, [lastIndex]);
  const focusPreviousItem = React.useCallback(() => {
    setFocusedItemIndex((index) => (index - 1 < 0 ? lastIndex : index - 1));
  }, [lastIndex]);

  const menuFocus = React.useRef({
    focusFirstItem,
    focusedItemIndex,
    focusLastItem,
    focusNextItem,
    focusPreviousItem,
    focusNoItem,
  });

  return menuFocus.current;
};

// ---------------------------------------------------------------------------
// useOnClick
// ---------------------------------------------------------------------------
export const useOnClick = (
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

// ---------------------------------------------------------------------------
// useOnClickInside
// ---------------------------------------------------------------------------
export const useOnClickInside: (
  ref: React.RefObject<HTMLElement> | React.RefObject<HTMLElement>[],
  onClick: (event: PointerEvent | MouseEvent | TouchEvent) => void,
  useCapture?: boolean
) => void = (ref, onClick, useCapture = false) => {
  const listener = (event: PointerEvent | MouseEvent | TouchEvent) => {
    const elementRef = Array.isArray(ref) ? ref : [ref];
    if (
      elementRef.some((ref2) =>
        ref2.current?.contains(event.target as Node)
      ) === false
    ) {
      return;
    }
    onClick(event);
  };
  useOnClick(listener, [ref, listener], useCapture);
};

// ---------------------------------------------------------------------------
// useOnClickOutside
// ---------------------------------------------------------------------------
export const useOnClickOutside = (
  ref: React.RefObject<HTMLElement> | React.RefObject<HTMLElement>[],
  onClick: (event: PointerEvent | MouseEvent | TouchEvent) => void,
  useCapture = false
) => {
  const listener = (event: PointerEvent | MouseEvent | TouchEvent) => {
    const elementRef = Array.isArray(ref) ? ref : [ref];
    if (
      elementRef.some((ref2) => ref2.current?.contains(event.target as Node))
    ) {
      return;
    }
    onClick(event);
  };
  useOnClick(listener, [ref, listener], useCapture);
};

// ---------------------------------------------------------------------------
// useEventListener (private)
// ---------------------------------------------------------------------------

// MediaQueryList Event based useEventListener interface
function useEventListener<K extends keyof MediaQueryListEventMap>(
  eventName: K,
  handler: (event: MediaQueryListEventMap[K]) => void,
  element: React.RefObject<MediaQueryList>,
  options?: boolean | AddEventListenerOptions
): void;

// Window Event based useEventListener interface
function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: undefined,
  options?: boolean | AddEventListenerOptions
): void;

// Element Event based useEventListener interface
function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLDivElement,
>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: React.RefObject<T>,
  options?: boolean | AddEventListenerOptions
): void;

function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: React.RefObject<Document>,
  options?: boolean | AddEventListenerOptions
): void;

function useEventListener<
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap,
  KM extends keyof MediaQueryListEventMap,
  T extends HTMLElement | MediaQueryList | void = void,
>(
  eventName: KW | KH | KM,
  handler: (
    event:
      | WindowEventMap[KW]
      | HTMLElementEventMap[KH]
      | MediaQueryListEventMap[KM]
      | Event
  ) => void,
  element?: React.RefObject<T>,
  options?: boolean | AddEventListenerOptions
) {
  // Create a ref that stores handler
  const savedHandler = React.useRef(handler);

  useIsomorphicLayoutEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  React.useEffect(() => {
    // Define the listening target
    const targetElement: T | Window = element?.current ?? window;

    if (!(targetElement && targetElement.addEventListener)) return;

    // Create event listener that calls handler function stored in ref
    const listener: typeof handler = (event) => savedHandler.current(event);

    targetElement.addEventListener(eventName, listener, options);

    // Remove event listener on cleanup

    return () => {
      targetElement.removeEventListener(eventName, listener, options);
    };
  }, [eventName, element, options]);
}

// ---------------------------------------------------------------------------
// useOnClickOutside
// ---------------------------------------------------------------------------
export const usePointerOutside = (
  ref: React.RefObject<HTMLElement> | React.RefObject<HTMLElement>[],
  listener: (event: PointerEvent) => void,
  type: 'pointerdown' | 'pointerup' = 'pointerup'
): void => {
  useEventListener(type, (event) => {
    const elementRef = Array.isArray(ref) ? ref : [ref];
    if (
      elementRef.some((ref2) => ref2.current?.contains(event.target as Node))
    ) {
      return;
    }
    listener(event);
  });
};

// ---------------------------------------------------------------------------
// useOnKeyDown
// ---------------------------------------------------------------------------
export const useOnKeyDown = (
  keys: string[],
  onKeyDown?: (event: KeyboardEvent) => void
) =>
  React.useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (keys.includes(event.key) && typeof onKeyDown === 'function') {
        onKeyDown(event);
      }
    };

    document.addEventListener('keydown', listener);

    return () => document.removeEventListener('keydown', listener);
  }, [keys, onKeyDown]);


// ---------------------------------------------------------------------------
// useCSSTransition
// ---------------------------------------------------------------------------
  
type TransitionState =
  | 'unmounted'
  | 'exited'
  | 'entering'
  | 'entered'
  | 'exiting';
  
interface UseCSSTransitionOptions {
  in: boolean;
  timeout: number | {enter: number; exit: number};
  classNames: {
    enter?: string;
    enterActive?: string;
    exit?: string;
    exitActive?: string;
  };
  nodeRef: React.RefObject<Element>;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
  onEnter?: () => void;
  onEntering?: () => void;
  onEntered?: () => void;
  onExit?: () => void;
  onExiting?: () => void;
  onExited?: () => void;
}
  
export function useCSSTransition(options: UseCSSTransitionOptions): {
  shouldMount: boolean;
} {
  const {
    in: inProp,
    timeout,
    classNames,
    nodeRef,
    mountOnEnter = false,
    unmountOnExit = false,
  } = options;

  const enterTimeout = typeof timeout === 'number' ? timeout : timeout.enter;
  const exitTimeout = typeof timeout === 'number' ? timeout : timeout.exit;

  const callbacksRef = React.useRef(options);
  callbacksRef.current = options;

  const getInitialState = (): TransitionState => {
    if (inProp) return 'entered';
    if (mountOnEnter || unmountOnExit) return 'unmounted';
    return 'exited';
  };

  const [state, setState] = React.useState<TransitionState>(getInitialState);
  const prevInRef = React.useRef(inProp);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const rafRef = React.useRef<number | null>(null);

  const clearRaf = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  // When transitioning from unmounted, we need the node in the DOM before
  // applying enter classes. This ref signals that the component should render
  // (shouldMount=true) in the current cycle so the nodeRef is populated by the
  // time the post-mount layout effect runs.
  const pendingEnterRef = React.useRef(false);

  function performEnter() {
    const node = nodeRef.current;
    if (!node) return;

    callbacksRef.current.onEnter?.();

    if (classNames.enter) {
      node.classList.add(classNames.enter);
    }

    // Force reflow so the browser registers the enter class before enterActive
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    (node as HTMLElement).scrollTop;

    setState('entering');
    callbacksRef.current.onEntering?.();

    if (classNames.enterActive) {
      node.classList.add(classNames.enterActive);
    }

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      if (classNames.enter) node.classList.remove(classNames.enter);
      if (classNames.enterActive) node.classList.remove(classNames.enterActive);
      setState('entered');
      callbacksRef.current.onEntered?.();
    }, enterTimeout);
  }

  function performExit() {
    const node = nodeRef.current;
    if (!node) return;

    callbacksRef.current.onExit?.();

    if (classNames.exit) {
      node.classList.add(classNames.exit);
    }

    // Force reflow so the browser registers the exit class before exitActive
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    (node as HTMLElement).scrollTop;

    setState('exiting');
    callbacksRef.current.onExiting?.();

    if (classNames.exitActive) {
      node.classList.add(classNames.exitActive);
    }

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      if (classNames.exit) node.classList.remove(classNames.exit);
      if (classNames.exitActive) node.classList.remove(classNames.exitActive);
      setState('exited');
      callbacksRef.current.onExited?.();
      if (unmountOnExit) {
        setState('unmounted');
      }
    }, exitTimeout);
  }

  // Detect in-prop changes during render (not in an effect) so shouldMount
  // can be true in the SAME render pass, avoiding a deferred re-render that
  // causes useEffect consumers to see an unmounted nodeRef.
  if (inProp && !prevInRef.current && state === 'unmounted') {
    pendingEnterRef.current = true;
    setState('exited');
  }

  useIsomorphicLayoutEffect(() => {
    const prevIn = prevInRef.current;
    prevInRef.current = inProp;

    if (inProp && !prevIn) {
      clearTimer();
      clearRaf();

      if (pendingEnterRef.current) {
        pendingEnterRef.current = false;
        const node = nodeRef.current;
        if (node && !node.isConnected) {
          // The node exists but is not yet in the document (e.g. inside a
          // portal whose container is attached via useEffect). Defer to
          // requestAnimationFrame so portal containers are mounted and the
          // browser can compute styles before we apply transition classes.
          rafRef.current = requestAnimationFrame(() => {
            rafRef.current = null;
            performEnter();
          });
          return;
        }
        performEnter();
        return;
      }

      if (state !== 'unmounted') {
        performEnter();
      }
    } else if (!inProp && prevIn) {
      clearTimer();
      clearRaf();
      performExit();
    }
  });

  useIsomorphicLayoutEffect(() => {
    return () => {
      clearTimer();
      clearRaf();
    };
  }, []);

  return {shouldMount: state !== 'unmounted'};
}
