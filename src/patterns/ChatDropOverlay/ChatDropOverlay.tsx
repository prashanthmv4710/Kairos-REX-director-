'use client';
// @refresh reset

/**
 * @module ChatDropOverlay
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
 * For prop API + usage notes, read `ChatDropOverlay.md` in this folder
 * or run `npm run ld-kit -- show ChatDropOverlay`.
 */

import * as React from 'react';

import {Body, Caption} from '../../components/Text/Text';
import './ChatDropOverlay.css';

// ---------------------------------------------------------------------------
// PaperclipGlyph — inline SVG so the icon renders across every LD theme
// (the LD and WCP icon fonts do not ship a Paperclip glyph; only AX/PX do).
// ---------------------------------------------------------------------------
function PaperclipGlyph({size = 32}: {size?: number}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.5 11.5 12 20a5.25 5.25 0 1 1-7.42-7.43l8.5-8.5a3.5 3.5 0 1 1 4.95 4.95l-8.5 8.5a1.75 1.75 0 1 1-2.47-2.47L14.75 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// usePrefersReducedMotion — kept local so this pattern has no dependency on
// AgentFrameworkPage's copy of the hook.
// ---------------------------------------------------------------------------
function usePrefersReducedMotion(): boolean {
  return React.useMemo(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );
}

export interface UseChatDropOverlayOptions {
  /** Called with the dropped files when the user releases inside the region. */
  onFiles?: (files: File[]) => void;
  /** Disable drop detection entirely (e.g., when the region is offscreen). */
  disabled?: boolean;
}

export interface UseChatDropOverlayResult {
  /** True while a native drag containing files is hovering the region. */
  isDragging: boolean;
  /**
   * Callback ref to attach to the container element. Uses a callback (not a
   * plain `useRef`) so listeners re-bind if the underlying DOM node is
   * remounted — which happens when a chat pane is a JSX const reused across
   * conditional branches of its parent surface.
   */
  ref: (el: HTMLElement | null) => void;
}

/**
 * Attach OS drag-and-drop listeners to a container element and expose a stable
 * `isDragging` boolean. Only engages when the drag payload contains files —
 * text selections, DOM drags, etc. are ignored so the overlay never appears for
 * intra-page drags.
 *
 * A `dragenter` counter is used so the overlay stays visible while the pointer
 * moves between child elements (each child boundary fires an enter + leave pair
 * whose net effect on the counter is zero).
 *
 * Usage: `const {isDragging, ref} = useChatDropOverlay({onFiles});` then apply
 * `ref` to the container: `<div ref={ref}>`.
 */
export function useChatDropOverlay(
  {onFiles, disabled = false}: UseChatDropOverlayOptions = {},
): UseChatDropOverlayResult {
  const [isDragging, setIsDragging] = React.useState(false);
  const [element, setElement] = React.useState<HTMLElement | null>(null);
  // Ref, not state — the enter counter must not trigger re-renders.
  const enterCount = React.useRef(0);

  // Keep the latest `onFiles` in a ref so we can register listeners once.
  const onFilesRef = React.useRef(onFiles);
  React.useEffect(() => {
    onFilesRef.current = onFiles;
  }, [onFiles]);

  React.useEffect(() => {
    if (!element || disabled) return;

    const hasFiles = (e: DragEvent) => {
      const types = e.dataTransfer?.types;
      if (!types) return false;
      // `types` is a DOMStringList in some browsers; iterate defensively.
      for (let i = 0; i < types.length; i++) {
        if (types[i] === 'Files') return true;
      }
      return false;
    };

    const reset = () => {
      enterCount.current = 0;
      setIsDragging(false);
    };

    const onDragEnter = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      enterCount.current += 1;
      if (enterCount.current === 1) setIsDragging(true);
    };

    const onDragOver = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      // Required so the browser lets us receive `drop`.
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    };

    const onDragLeave = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      enterCount.current = Math.max(0, enterCount.current - 1);
      if (enterCount.current === 0) setIsDragging(false);
    };

    const onDrop = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      const files = e.dataTransfer?.files
        ? Array.from(e.dataTransfer.files)
        : [];
      reset();
      if (files.length > 0) onFilesRef.current?.(files);
    };

    // ESC / drag cancellation fires `dragend` on the source, not the target —
    // window-level `blur` and `dragend` are defensive resets so a cancelled
    // drag doesn't leave the overlay stuck.
    element.addEventListener('dragenter', onDragEnter);
    element.addEventListener('dragover', onDragOver);
    element.addEventListener('dragleave', onDragLeave);
    element.addEventListener('drop', onDrop);
    window.addEventListener('dragend', reset);
    window.addEventListener('blur', reset);

    return () => {
      element.removeEventListener('dragenter', onDragEnter);
      element.removeEventListener('dragover', onDragOver);
      element.removeEventListener('dragleave', onDragLeave);
      element.removeEventListener('drop', onDrop);
      window.removeEventListener('dragend', reset);
      window.removeEventListener('blur', reset);
    };
  }, [element, disabled]);

  return {isDragging, ref: setElement};
}

export interface ChatDropOverlayProps {
  /** Whether the overlay should be rendered visible. */
  visible: boolean;
}

/**
 * The "Drop files anywhere" hover state that appears over a chat pane while a
 * user drags an external file across it. Purely decorative — the parent owns
 * the drop handler via `useChatDropOverlay`.
 *
 * Mount as the last child of the chat-pane container (which must be
 * `position: relative`); the overlay fills its parent and stays behind modal
 * scrims. `pointer-events: none` so it never intercepts drag events itself.
 */
export function ChatDropOverlay({visible}: ChatDropOverlayProps) {
  const reduceMotion = usePrefersReducedMotion();
  return (
    <div
      aria-hidden
      className={`ld-chatdropoverlay${visible ? ' ld-chatdropoverlay-visible' : ''}${
        reduceMotion ? ' ld-chatdropoverlay-reduceMotion' : ''
      }`}
    >
      <span
        className="ld-chatdropoverlay-icon"
        style={{color: 'var(--ld-semantic-color-icon-default, #2e2f33)'}}
      >
        <PaperclipGlyph size={32} />
      </span>
      <Body as="p" size="medium" weight="alt" UNSAFE_style={{margin: 0}}>
        Drop files anywhere
      </Body>
      <Caption color="subtle" UNSAFE_style={{textAlign: 'center', maxWidth: 260}}>
        Images, Videos, Office Documents, PDFs, Code/Text are supported
      </Caption>
    </div>
  );
}
