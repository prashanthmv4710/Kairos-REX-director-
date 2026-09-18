import * as React from 'react';
import {cx} from './cx';

let _idCounter = 0;
export function useStableId(providedId?: string): string {
  const [id] = React.useState(() => providedId || `ld-id-${++_idCounter}`);
  return providedId || id;
}

export function invariant(condition: boolean, message: string): void {
  if (condition) return;
  const error = `LD: ${message}`;
  if (import.meta.env.MODE === 'production') {
    console.error(error);
  } else {
    throw new Error(error);
  }
}

export function getTarget(target?: string): { rel?: string; target?: string } {
  if (target === '') return {};
  if (target === '_blank') return { target, rel: 'noopener noreferrer' };
  return { target };
}

export function onAnchorKeyDown(anchorProps: {
  href?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLAnchorElement>;
}) {
  const { href, onClick, onKeyDown } = anchorProps;
  return (event: React.KeyboardEvent<HTMLAnchorElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.key !== ' ') return;
    onClick?.(event as unknown as React.MouseEvent<HTMLAnchorElement>);
    if (event.defaultPrevented || !href) return;
    location.assign(href);
  };
}

export type MergeRefsItem<T> = React.MutableRefObject<T> | React.ForwardedRef<T> | null;
export function mergeRefs<T extends HTMLElement>(...refs: Array<MergeRefsItem<T>>): React.RefCallback<T> {
  return (instance: T | null) =>
    refs.forEach((ref) => {
      if (typeof ref === 'function') ref(instance);
      else if (typeof ref === 'object' && ref) ref.current = instance;
    });
}

export function remToPxValue(remValue: string): number {
  const defaultFontSize =
    (typeof window !== 'undefined' &&
      parseFloat(window.getComputedStyle(document.documentElement).fontSize)) ||
    16;
  return parseFloat(remValue) * defaultFontSize;
}

export function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  timeout: number
) {
  let timerID: ReturnType<typeof setTimeout>;
  const cancel = () => { clearTimeout(timerID); };
  const debounced = (...args: T) => {
    clearTimeout(timerID);
    timerID = setTimeout(() => { fn(...args); }, timeout);
  };
  debounced.cancel = cancel;
  return debounced;
}

export function setStyleProperty(node: HTMLElement, property: string, value: string) {
  node.style.setProperty(property, value);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function applyCommonProps<T>(props: T): T & { className?: string; style?: React.CSSProperties } {
  const result: any = {};
  for (const [key, value] of Object.entries(props as any)) {
    if (key === 'UNSAFE_className') result.className = value;
    else if (key === 'UNSAFE_style') result.style = value;
    else if (key !== 'className' && key !== 'style') result[key] = value;
  }
  return result;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** @deprecated Use applyCommonProps instead */
export const _applyCommonProps = applyCommonProps;

export type CalculatePositionFn = (dimensions: {
  referrerHeight: number;
  referrerWidth: number;
  targetHeight: number;
  targetWidth: number;
}) => { left: number; top: number };

export function getPositionStyle(opts: {
  calculatePosition: CalculatePositionFn;
  referrerRef: React.RefObject<HTMLElement>;
  targetRef: React.RefObject<HTMLElement>;
}) {
  const referrerDOMRect = opts.referrerRef.current?.getBoundingClientRect() || { height: 0, width: 0 };
  const targetDOMRect = opts.targetRef.current?.getBoundingClientRect() || { height: 0, width: 0 };
  const { left, top } = opts.calculatePosition({
    referrerHeight: referrerDOMRect.height,
    referrerWidth: referrerDOMRect.width,
    targetHeight: targetDOMRect.height,
    targetWidth: targetDOMRect.width,
  });
  return { transform: `translate3d(${left}px, ${top}px, 0)` };
}

// --- CommonProps type used by some LD components ---
export interface CommonProps {
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

// --- Portable overlay hooks ---

/* eslint-disable @typescript-eslint/no-explicit-any */

export function useLockBodyScroll(): [(el: HTMLElement | null) => void] {
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);
  return [() => {}];
}

export function usePointerOutside(
  ref: React.RefObject<HTMLElement | null> | React.RefObject<HTMLElement | null>[],
  callback: (...args: any[]) => void
): void {
  React.useEffect(() => {
    const handler = (event: MouseEvent) => {
      const refs = Array.isArray(ref) ? ref : [ref];
      const isOutside = refs.every(r => r.current && !r.current.contains(event.target as Node));
      if (isOutside) callback(event);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, callback]);
}

export function useOnKeyDown(
  keys: string[],
  callback: (...args: any[]) => void
): void {
  React.useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (keys.includes(event.key)) callback(event);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [keys, callback]);
}

export function ariaHideOutside(
  _elements: HTMLElement[],
  _container: HTMLElement
): () => void {
  return () => {};
}

/* eslint-enable @typescript-eslint/no-explicit-any */

// CSSTransition is in ../common/CSSTransition.tsx — import from there directly

// ── DevTools event emitter ────────────────────────────────────────
// Lightweight emit that dispatches a CustomEvent for the DevToolsPanel.
// The full Store.tsx emit also calls internal subscribers; this is the
// portable subset that just broadcasts on the window so generated
// components can participate without importing helpers/Store.

const GENLD_EVENT = 'ld-kit-event';

export function emit(topic: string, payload?: unknown): void {
  window.dispatchEvent(
    new CustomEvent(GENLD_EVENT, {detail: {topic, payload}}),
  );
}
