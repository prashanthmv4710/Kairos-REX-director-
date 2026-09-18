import * as React from 'react';

type TransitionPhase = 'idle' | 'enter' | 'enterActive' | 'exit' | 'exitActive';

export interface CSSTransitionProps {
  children: React.ReactElement;
  classNames: {
    enter: string;
    enterActive: string;
    exit: string;
    exitActive: string;
  };
  in?: boolean;
  mountOnEnter?: boolean;
  nodeRef: React.RefObject<HTMLElement | null>;
  onEntered?: () => void;
  onEntering?: () => void;
  onExit?: () => void;
  onExited?: () => void;
  onExiting?: () => void;
  timeout: number | { enter: number; exit: number };
  unmountOnExit?: boolean;
}

export function CSSTransition({
  children,
  classNames,
  in: isOpen = false,
  mountOnEnter = false,
  nodeRef,
  onEntered,
  onEntering,
  onExit,
  onExited,
  onExiting,
  timeout,
  unmountOnExit = false,
}: CSSTransitionProps) {
  const enterMs = typeof timeout === 'number' ? timeout : timeout.enter;
  const exitMs = typeof timeout === 'number' ? timeout : timeout.exit;
  const [isMounted, setIsMounted] = React.useState(isOpen);
  const [phase, setPhase] = React.useState<TransitionPhase>('idle');

  React.useEffect(() => {
    if (isOpen) {
      if (!isMounted) {
        setIsMounted(true);
        setPhase('enter');
      }
      return;
    }
    if (isMounted) {
      setPhase('exit');
    }
  }, [isOpen, isMounted]);

  React.useEffect(() => {
    if (!isMounted) return;
    let frameId: number | undefined;
    let timerId: ReturnType<typeof setTimeout> | undefined;

    if (phase === 'enter') {
      frameId = requestAnimationFrame(() => setPhase('enterActive'));
    } else if (phase === 'enterActive') {
      onEntering?.();
      timerId = setTimeout(() => { onEntered?.(); setPhase('idle'); }, enterMs);
    } else if (phase === 'exit') {
      onExit?.();
      frameId = requestAnimationFrame(() => setPhase('exitActive'));
    } else if (phase === 'exitActive') {
      onExiting?.();
      timerId = setTimeout(() => {
        setPhase('idle');
        if (unmountOnExit) setIsMounted(false);
        onExited?.();
      }, exitMs);
    }

    return () => {
      if (frameId !== undefined) cancelAnimationFrame(frameId);
      if (timerId !== undefined) clearTimeout(timerId);
    };
  }, [isMounted, onEntered, onEntering, onExit, onExited, onExiting, phase, enterMs, exitMs, unmountOnExit]);

  if (!isMounted && (mountOnEnter || unmountOnExit)) return null;

  let transitionClassName = '';
  if (phase === 'enter') transitionClassName = classNames.enter;
  else if (phase === 'enterActive') transitionClassName = classNames.enterActive;
  else if (phase === 'exit') transitionClassName = classNames.exit;
  else if (phase === 'exitActive') transitionClassName = classNames.exitActive;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return React.cloneElement(children, {
    className: [(children.props as any).className, transitionClassName].filter(Boolean).join(' '),
    ref: nodeRef,
  } as any);
}
