'use client';
// @refresh reset

/**
 * @module Accordion
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
 * For prop API + usage notes, read `Accordion.md` in this folder
 * or run `npm run ld-kit -- show Accordion`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {useStableId, applyCommonProps, setStyleProperty} from '../../common/helpers';
import {useCSSTransition} from '../../common/useCSSTransition';
import './Accordion.css';

// ---------------------------------------------------------------------------
// Accordion Context
// ---------------------------------------------------------------------------

interface AccordionContextValue {
  openItems: Set<string | number>;
  toggleItem: (value: string | number) => void;
}

const AccordionContext = React.createContext<AccordionContextValue>({
  openItems: new Set(),
  toggleItem: () => {},
});

// ---------------------------------------------------------------------------
// AccordionItem Context
// ---------------------------------------------------------------------------

interface AccordionItemContextValue {
  open: boolean;
  value: string | number;
  headerId: string;
  panelId: string;
}

const AccordionItemContext = React.createContext<AccordionItemContextValue>({
  open: false,
  value: '',
  headerId: '',
  panelId: '',
});

// ---------------------------------------------------------------------------
// Accordion
// ---------------------------------------------------------------------------

export interface AccordionProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  children: React.ReactNode;
  collapsible?: boolean;
  defaultOpenItems?: Array<string | number>;
  multiple?: boolean;
  onToggle?: (openItems: Array<string | number>) => void;
  openItems?: Array<string | number>;
}

export const Accordion: React.FunctionComponent<AccordionProps> = (props) => {
  const {
    children,
    className,
    collapsible = true,
    defaultOpenItems,
    multiple = false,
    onToggle,
    openItems: controlledOpenItems,
    ...rest
  } = applyCommonProps(props);

  const [uncontrolledOpenItems, setUncontrolledOpenItems] = React.useState<Set<string | number>>(
    () => new Set(defaultOpenItems || [])
  );

  const isControlled = controlledOpenItems !== undefined;
  const openItems = isControlled
    ? new Set(controlledOpenItems)
    : uncontrolledOpenItems;

  const toggleItem = React.useCallback(
    (value: string | number) => {
      const next = new Set(openItems);

      if (next.has(value)) {
        if (collapsible || next.size > 1) {
          next.delete(value);
        }
      } else {
        if (multiple) {
          next.add(value);
        } else {
          next.clear();
          next.add(value);
        }
      }

      if (!isControlled) {
        setUncontrolledOpenItems(next);
      }
      onToggle?.(Array.from(next));
    },
    [openItems, collapsible, multiple, isControlled, onToggle]
  );

  const ctxValue = React.useMemo(
    () => ({openItems, toggleItem}),
    [openItems, toggleItem]
  );

  return (
    <AccordionContext.Provider value={ctxValue}>
      <div className={cx('ld-accordion-root', className)} {...rest}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

Accordion.displayName = 'Accordion';

// ---------------------------------------------------------------------------
// AccordionItem
// ---------------------------------------------------------------------------

export interface AccordionItemProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style' | 'value'> {
  children: React.ReactNode;
  value: string | number;
}

export const AccordionItem: React.FunctionComponent<AccordionItemProps> = (props) => {
  const {children, className, value, ...rest} = applyCommonProps(props);
  const {openItems} = React.useContext(AccordionContext);
  const headerId = useStableId();
  const panelId = useStableId();

  const ctxValue = React.useMemo(
    () => ({open: openItems.has(value), value, headerId, panelId}),
    [openItems, value, headerId, panelId]
  );

  return (
    <AccordionItemContext.Provider value={ctxValue}>
      <div className={cx('ld-accordion-item', className)} {...rest}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

AccordionItem.displayName = 'AccordionItem';

// ---------------------------------------------------------------------------
// AccordionHeader
// ---------------------------------------------------------------------------

export interface AccordionHeaderProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'className' | 'style'> {
  children: React.ReactNode;
}

export const AccordionHeader: React.FunctionComponent<AccordionHeaderProps> = (props) => {
  const {children, className, onKeyDown: propOnKeyDown, ...rest} = applyCommonProps(props);
  const {toggleItem} = React.useContext(AccordionContext);
  const {open, value, headerId, panelId} = React.useContext(AccordionItemContext);

  // WAI-ARIA Accordion pattern: ArrowDown/Up move between headers, Home/End
  // jump to first/last. Implemented via querying sibling accordion headers
  // in the document — avoids threading a shared array ref through context.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    propOnKeyDown?.(e);
    if (e.defaultPrevented) return;
    const key = e.key;
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) return;
    const current = e.currentTarget;
    const accordion = current.closest('.ld-accordion-root');
    if (!accordion) return;
    const headers = Array.from(
      accordion.querySelectorAll<HTMLButtonElement>('.ld-accordion-header'),
    );
    if (headers.length === 0) return;
    const idx = headers.indexOf(current);
    let target: HTMLButtonElement | undefined;
    if (key === 'ArrowDown') target = headers[(idx + 1) % headers.length];
    else if (key === 'ArrowUp') target = headers[(idx - 1 + headers.length) % headers.length];
    else if (key === 'Home') target = headers[0];
    else if (key === 'End') target = headers[headers.length - 1];
    if (target) {
      e.preventDefault();
      target.focus();
    }
  };

  return (
    <div className="ld-accordion-headerWrapper">
      <button
        aria-controls={panelId}
        aria-expanded={open}
        className={cx('ld-accordion-header', open && 'ld-accordion-headerOpen', className)}
        id={headerId}
        onClick={() => toggleItem(value)}
        onKeyDown={handleKeyDown}
        type="button"
        {...rest}
      >
        <span className="ld-accordion-headerContent">{children}</span>
        <span
          aria-hidden="true"
          className={cx('ld-accordion-chevron', open && 'ld-accordion-chevronOpen')}
        >
          <svg fill="currentColor" height="1em" viewBox="0 0 20 20" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.646 4.646a.5.5 0 0 1 .708 0l5 5a.5.5 0 0 1 0 .708l-5 5a.5.5 0 0 1-.708-.708L12.293 10 7.646 5.354a.5.5 0 0 1 0-.708Z" />
          </svg>
        </span>
      </button>
    </div>
  );
};

AccordionHeader.displayName = 'AccordionHeader';

// ---------------------------------------------------------------------------
// AccordionPanel
// ---------------------------------------------------------------------------

export interface AccordionPanelProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  children: React.ReactNode;
}

export const AccordionPanel: React.FunctionComponent<AccordionPanelProps> = (props) => {
  const {children, className, ...rest} = applyCommonProps(props);
  const {open, headerId, panelId} = React.useContext(AccordionItemContext);

  const ref = React.useRef<HTMLDivElement>(null);

  const clearNodeStyleHeight = React.useCallback(() => {
    const node = ref.current;
    if (node) setStyleProperty(node, 'height', '');
  }, []);

  const setNodeStyleHeight = React.useCallback(() => {
    const node = ref.current;
    if (node) setStyleProperty(node, 'height', `${node.scrollHeight}px`);
  }, []);

  const {shouldMount} = useCSSTransition({
    classNames: {
      enter: 'ld-accordion-panelEnter',
      enterActive: 'ld-accordion-panelEnterActive',
      exit: 'ld-accordion-panelExit',
      exitActive: 'ld-accordion-panelExitActive',
    },
    onEntering: setNodeStyleHeight,
    onEntered: clearNodeStyleHeight,
    onExit: setNodeStyleHeight,
    onExiting: clearNodeStyleHeight,
    in: open,
    mountOnEnter: true,
    nodeRef: ref as React.RefObject<Element>,
    timeout: {enter: 150, exit: 120},
    unmountOnExit: true,
  });

  return (
    shouldMount ? (
      <div
        role="region"
        aria-labelledby={headerId}
        className={cx('ld-accordion-panel', className)}
        id={panelId}
        ref={ref}
        {...rest}
      >
        <div className="ld-accordion-panelContent">{children}</div>
      </div>
    ) : null
  );
};

AccordionPanel.displayName = 'AccordionPanel';
