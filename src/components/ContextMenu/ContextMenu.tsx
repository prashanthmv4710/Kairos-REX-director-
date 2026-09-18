'use client';
// @refresh reset

/**
 * @module ContextMenu
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
 * For prop API + usage notes, read `ContextMenu.md` in this folder
 * or run `npm run ld-kit -- show ContextMenu`.
 */

import * as React from 'react';
import {
  SelectDropdown,
  SelectDropdownTrigger,
  SelectDropdownContent,
  SelectDropdownItem,
  SelectDropdownCheckboxItem,
  SelectDropdownRadioItem,
  SelectDropdownLabel,
  SelectDropdownSeparator,
  SelectDropdownShortcut,
  SelectDropdownSub,
  SelectDropdownSubContent,
  SelectDropdownSubTrigger,
  SelectDropdownRadioGroup,
} from '../SelectDropdown';
import type {
  SelectDropdownProps,
  SelectDropdownContentProps,
  SelectDropdownItemProps,
  SelectDropdownCheckboxItemProps,
  SelectDropdownRadioItemProps,
  SelectDropdownRadioGroupProps,
  SelectDropdownLabelProps,
  SelectDropdownSubTriggerProps,
  SelectDropdownSubContentProps,
  SelectDropdownTriggerProps,
  SelectDropdownShortcutProps,
} from '../SelectDropdown';
import './ContextMenu.css';
import './ContextMenu.css';

/* ------------------------------------------------------------------ */
/*  ContextMenu - wraps SelectDropdown with trigger="context-menu"       */
/* ------------------------------------------------------------------ */

type ContextMenuProps = Omit<SelectDropdownProps, 'trigger'>;

function ContextMenu(props: ContextMenuProps) {
  return <SelectDropdown trigger="context-menu" {...props} />;
}

ContextMenu.displayName = 'ContextMenu';

/* ------------------------------------------------------------------ */
/*  Re-export all sub-components with ContextMenu* names               */
/* ------------------------------------------------------------------ */

const ContextMenuTrigger = React.forwardRef<
  HTMLButtonElement | HTMLDivElement,
  SelectDropdownTriggerProps
>(function ContextMenuTriggerInner(props, ref) {
  return <SelectDropdownTrigger ref={ref} {...props} />;
});
ContextMenuTrigger.displayName = 'ContextMenuTrigger';

const ContextMenuContent = React.forwardRef<HTMLDivElement, SelectDropdownContentProps>(
  function ContextMenuContentInner(props, ref) {
    return <SelectDropdownContent ref={ref} {...props} />;
  },
);
ContextMenuContent.displayName = 'ContextMenuContent';

const ContextMenuItem = React.forwardRef<HTMLDivElement, SelectDropdownItemProps>(
  function ContextMenuItemInner(props, ref) {
    return <SelectDropdownItem ref={ref} {...props} />;
  },
);
ContextMenuItem.displayName = 'ContextMenuItem';

const ContextMenuCheckboxItem = React.forwardRef<HTMLDivElement, SelectDropdownCheckboxItemProps>(
  function ContextMenuCheckboxItemInner(props, ref) {
    return <SelectDropdownCheckboxItem ref={ref} {...props} />;
  },
);
ContextMenuCheckboxItem.displayName = 'ContextMenuCheckboxItem';

const ContextMenuRadioItem = React.forwardRef<HTMLDivElement, SelectDropdownRadioItemProps>(
  function ContextMenuRadioItemInner(props, ref) {
    return <SelectDropdownRadioItem ref={ref} {...props} />;
  },
);
ContextMenuRadioItem.displayName = 'ContextMenuRadioItem';

const ContextMenuLabel = React.forwardRef<HTMLDivElement, SelectDropdownLabelProps>(
  function ContextMenuLabelInner(props, ref) {
    return <SelectDropdownLabel ref={ref} {...props} />;
  },
);
ContextMenuLabel.displayName = 'ContextMenuLabel';

const ContextMenuSeparator = React.forwardRef<
  HTMLDivElement,
  { [key: string]: unknown }
>(function ContextMenuSeparatorInner(props, ref) {
  return <SelectDropdownSeparator ref={ref} {...props} />;
});
ContextMenuSeparator.displayName = 'ContextMenuSeparator';

function ContextMenuShortcutInner(props: SelectDropdownShortcutProps) {
  return <SelectDropdownShortcut {...props} />;
}
ContextMenuShortcutInner.displayName = 'ContextMenuShortcut';
const ContextMenuShortcut = ContextMenuShortcutInner;

function ContextMenuSubInner({ children }: { children: React.ReactNode }) {
  return <SelectDropdownSub>{children}</SelectDropdownSub>;
}
ContextMenuSubInner.displayName = 'ContextMenuSub';
const ContextMenuSub = ContextMenuSubInner;

const ContextMenuSubContent = React.forwardRef<HTMLDivElement, SelectDropdownSubContentProps>(
  function ContextMenuSubContentInner(props, ref) {
    return <SelectDropdownSubContent ref={ref} {...props} />;
  },
);
ContextMenuSubContent.displayName = 'ContextMenuSubContent';

const ContextMenuSubTrigger = React.forwardRef<HTMLDivElement, SelectDropdownSubTriggerProps>(
  function ContextMenuSubTriggerInner(props, ref) {
    return <SelectDropdownSubTrigger ref={ref} {...props} />;
  },
);
ContextMenuSubTrigger.displayName = 'ContextMenuSubTrigger';

const ContextMenuRadioGroup = React.forwardRef<HTMLDivElement, SelectDropdownRadioGroupProps>(
  function ContextMenuRadioGroupInner(props, ref) {
    return <SelectDropdownRadioGroup ref={ref} {...props} />;
  },
);
ContextMenuRadioGroup.displayName = 'ContextMenuRadioGroup';

/* ------------------------------------------------------------------ */
/*  Exports                                                            */
/* ------------------------------------------------------------------ */

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};

export type {
  ContextMenuProps,
};
