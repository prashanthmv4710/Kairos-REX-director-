import * as React from 'react';

type TransitionState =
  | 'unmounted'
  | 'exited'
  | 'entering'
  | 'entered'
  | 'exiting';

export interface UseCSSTransitionOptions {
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

const isDomEnvironment =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined';

const useIsomorphicLayoutEffect = isDomEnvironment
  ? React.useLayoutEffect
  : React.useEffect;

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

  const pendingEnterRef = React.useRef(false);

  function performEnter() {
    const node = nodeRef.current;
    if (!node) return;

    callbacksRef.current.onEnter?.();

    if (classNames.enter) {
      node.classList.add(classNames.enter);
    }

    // Force reflow before activating enter transition class.
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

    // Force reflow before activating exit transition class.
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
