'use client';
// @refresh reset

/**
 * @module RichTextEditor
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
 * For prop API + usage notes, read `RichTextEditor.md` in this folder
 * or run `npm run ld-kit -- show RichTextEditor`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {useStableId, debounce, applyCommonProps} from '../../common/helpers';
import {VisuallyHidden} from '../VisuallyHidden';
import {FormHelperText, FormLabel} from '../Form';
import {WarningIcon} from '../Icons';
import './RichTextEditor.css';

export type RichTextEditorSize = 'large' | 'small';

/**
 * The formatting controls that can appear in the toolbar.
 */
export type RichTextEditorToolbarItem =
  | 'blockStyle'
  | 'bulletList'
  | 'numberList'
  | 'bold'
  | 'italic'
  | 'code';

const DEFAULT_TOOLBAR: RichTextEditorToolbarItem[] = [
  'blockStyle',
  'bulletList',
  'numberList',
  'bold',
  'italic',
  'code',
];

const BLOCK_STYLES: Array<{label: string; value: string}> = [
  {label: 'Normal', value: 'p'},
  {label: 'Heading 1', value: 'h1'},
  {label: 'Heading 2', value: 'h2'},
  {label: 'Heading 3', value: 'h3'},
];

export interface RichTextEditorProps
  extends Omit<
    React.ComponentPropsWithoutRef<'div'>,
    'className' | 'onChange' | 'style' | 'defaultValue'
  > {
  /**
   * The accessible description of the editor that indicates the involvement of an AI agent.
   *
   * @default "AI Generated"
   */
  a11yMagicLabel?: string;
  /**
   * If the editor is disabled.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * The props spread to the contenteditable region.
   *
   * @default {}
   */
  editorProps?: React.HTMLAttributes<HTMLDivElement>;
  /**
   * The error for the editor. Takes precedence over `warning` and `helperText`.
   */
  error?: React.ReactNode;
  /**
   * The helper text for the editor.
   */
  helperText?: React.ReactNode;
  /**
   * The id for the editor.
   */
  id?: string;
  /**
   * If the editor should use visual styles that indicate the involvement of an AI agent.
   *
   * @default false
   */
  isMagic?: boolean;
  /**
   * The label for the editor.
   */
  label: React.ReactNode;
  /**
   * The maximum length for the editor (includes character counter). Counts plain text characters.
   */
  maxLength?: number;
  /**
   * The max length accessible announcement for the editor.
   *
   * @default `${maxLength - length} characters left.`
   */
  maxLengthA11yAnnouncement?: string;
  /**
   * The callback fired when the editor content changes. Receives the current HTML string.
   */
  onChange?: (html: string) => void;
  /**
   * The placeholder shown when the editor is empty.
   */
  placeholder?: string;
  /**
   * If the editor is read only.
   *
   * @default false
   */
  readOnly?: boolean;
  /**
   * The size for the editor.
   *
   * @default "large"
   */
  size?: RichTextEditorSize;
  /**
   * The formatting controls shown in the toolbar.
   *
   * @default ['blockStyle', 'bulletList', 'numberList', 'bold', 'italic', 'code']
   */
  toolbar?: RichTextEditorToolbarItem[];
  /**
   * The initial HTML value for the editor.
   *
   * @default ""
   */
  value?: string;
  /**
   * The warning for the editor. Shown when `error` is not set.
   */
  warning?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Toolbar glyphs
// ---------------------------------------------------------------------------

const BulletListGlyph = () => (
  <svg aria-hidden focusable="false" height="16" viewBox="0 0 16 16" width="16">
    <circle cx="2.25" cy="4" fill="currentColor" r="1.25" />
    <circle cx="2.25" cy="8" fill="currentColor" r="1.25" />
    <circle cx="2.25" cy="12" fill="currentColor" r="1.25" />
    <rect fill="currentColor" height="1.5" rx="0.75" width="9" x="5.5" y="3.25" />
    <rect fill="currentColor" height="1.5" rx="0.75" width="9" x="5.5" y="7.25" />
    <rect fill="currentColor" height="1.5" rx="0.75" width="9" x="5.5" y="11.25" />
  </svg>
);

const NumberListGlyph = () => (
  <svg aria-hidden focusable="false" height="16" viewBox="0 0 16 16" width="16">
    <text fill="currentColor" fontSize="5" fontWeight="700" x="0.5" y="5.5">1</text>
    <text fill="currentColor" fontSize="5" fontWeight="700" x="0.5" y="9.75">2</text>
    <text fill="currentColor" fontSize="5" fontWeight="700" x="0.5" y="14">3</text>
    <rect fill="currentColor" height="1.5" rx="0.75" width="9" x="5.5" y="3.25" />
    <rect fill="currentColor" height="1.5" rx="0.75" width="9" x="5.5" y="7.25" />
    <rect fill="currentColor" height="1.5" rx="0.75" width="9" x="5.5" y="11.25" />
  </svg>
);

const CodeGlyph = () => (
  <svg aria-hidden focusable="false" height="16" viewBox="0 0 16 16" width="16">
    <path
      d="M5.75 4.25 2 8l3.75 3.75M10.25 4.25 14 8l-3.75 3.75"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);

interface ToolbarButtonProps {
  active?: boolean;
  disabled?: boolean;
  label: string;
  onCommand: () => void;
  children: React.ReactNode;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({active, disabled, label, onCommand, children}) => (
  <button
    aria-label={label}
    aria-pressed={active}
    className={cx('ld-rte-toolbarButton', active && 'ld-rte-toolbarButton-active')}
    disabled={disabled}
    // Prevent the button from stealing selection/focus from the editor.
    onMouseDown={(event) => event.preventDefault()}
    onClick={onCommand}
    tabIndex={-1}
    type="button"
  >
    {children}
  </button>
);

// ---------------------------------------------------------------------------
// RichTextEditor
// ---------------------------------------------------------------------------

/**
 * Rich Text Editors allow for the input of formatted, multi-line text with a
 * toolbar for inline and block-level styling.
 *
 * {@link https://digitaltoolkit.livingdesign.walmart.com/ Guidelines}
 */
export const RichTextEditor = React.forwardRef<HTMLDivElement, RichTextEditorProps>(
  (props, ref) => {
    const {
      a11yMagicLabel = 'AI Generated',
      className,
      disabled = false,
      editorProps,
      error,
      helperText,
      id: initialId,
      isMagic = false,
      label,
      maxLength,
      maxLengthA11yAnnouncement,
      onChange,
      placeholder,
      readOnly = false,
      size = 'large',
      toolbar = DEFAULT_TOOLBAR,
      value = '',
      warning,
      ...rest
    } = applyCommonProps(props);

    const id = useStableId(initialId);
    const labelId = useStableId();
    const magicLabelId = useStableId();
    const helperId = useStableId();

    const editorRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => editorRef.current as HTMLDivElement);

    const [textLength, setTextLength] = React.useState(0);
    const [isEmpty, setIsEmpty] = React.useState(true);
    const [blockStyle, setBlockStyle] = React.useState('p');
    const [activeFormats, setActiveFormats] = React.useState<Record<string, boolean>>({});
    const [screenReaderMessage, setScreenReaderMessage] = React.useState('');

    const setDelayedScreenReaderMessage = React.useMemo(
      () => debounce(setScreenReaderMessage, 1500),
      []
    );

    const editable = !disabled && !readOnly;

    // Seed the editor with the initial value once.
    React.useEffect(() => {
      const el = editorRef.current;
      if (!el) {
        return;
      }
      if (el.innerHTML !== value) {
        el.innerHTML = value;
      }
      setTextLength(el.textContent?.length ?? 0);
      setIsEmpty(!el.textContent?.length);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const syncActiveState = React.useCallback(() => {
      if (typeof document === 'undefined') {
        return;
      }
      try {
        setActiveFormats({
          bold: document.queryCommandState('bold'),
          italic: document.queryCommandState('italic'),
          bulletList: document.queryCommandState('insertUnorderedList'),
          numberList: document.queryCommandState('insertOrderedList'),
        });
        const block = (document.queryCommandValue('formatBlock') || 'p').toString().toLowerCase();
        setBlockStyle(BLOCK_STYLES.some((item) => item.value === block) ? block : 'p');
      } catch {
        // queryCommand* can throw in unsupported environments — ignore.
      }
    }, []);

    const handleInput = React.useCallback(() => {
      const el = editorRef.current;
      if (!el) {
        return;
      }
      const length = el.textContent?.length ?? 0;
      setTextLength(length);
      setIsEmpty(!length);
      syncActiveState();
      onChange?.(el.innerHTML);

      if (maxLength) {
        setDelayedScreenReaderMessage(
          maxLengthA11yAnnouncement ?? `${maxLength - length} characters left.`
        );
      }
    }, [maxLength, maxLengthA11yAnnouncement, onChange, setDelayedScreenReaderMessage, syncActiveState]);

    const exec = React.useCallback(
      (command: string, commandValue?: string) => {
        if (!editable) {
          return;
        }
        editorRef.current?.focus();
        try {
          document.execCommand(command, false, commandValue);
        } catch {
          // execCommand is unavailable in some environments — ignore.
        }
        handleInput();
      },
      [editable, handleInput]
    );

    const hasError = !!error && !disabled && !readOnly;
    const hasWarning = !hasError && !!warning && !disabled && !readOnly;
    const helperContent = hasError ? error : hasWarning ? warning : helperText;
    const hasHelperContent = !!(helperContent || maxLength);

    const ariaDescribedBy =
      [isMagic ? magicLabelId : null, hasHelperContent ? helperId : null]
        .filter(Boolean)
        .join(' ') || undefined;

    const showItem = (item: RichTextEditorToolbarItem) => toolbar.includes(item);

    return (
      <div
        className={cx(
          'ld-rte-root',
          disabled && 'ld-rte-disabled',
          hasError && 'ld-rte-error',
          hasWarning && 'ld-rte-warning',
          readOnly && 'ld-rte-readOnly',
          isMagic && 'ld-rte-isMagic',
          size === 'large' && 'ld-rte-large',
          size === 'small' && 'ld-rte-small',
          className
        )}
        {...rest}
      >
        <FormLabel
          className={'ld-rte-label'}
          disabled={disabled}
          htmlFor={id}
          id={labelId}
          isMagic={isMagic}
          size={size}
        >
          {label}
        </FormLabel>

        <div className={'ld-rte-container'}>
          {toolbar.length > 0 && (
            <div aria-label="Formatting" className={'ld-rte-toolbar'} role="toolbar">
              {showItem('blockStyle') && (
                <div className={'ld-rte-selectWrapper'}>
                  <select
                    aria-label="Text style"
                    className={'ld-rte-select'}
                    disabled={!editable}
                    onChange={(event) => exec('formatBlock', event.target.value)}
                    tabIndex={-1}
                    value={blockStyle}
                  >
                    {BLOCK_STYLES.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <svg
                    aria-hidden
                    className={'ld-rte-selectCaret'}
                    focusable="false"
                    height="16"
                    viewBox="0 0 16 16"
                    width="16"
                  >
                    <path d="M4 6l4 4 4-4" fill="currentColor" />
                  </svg>
                </div>
              )}

              {(showItem('bulletList') || showItem('numberList')) && (
                <span aria-hidden className={'ld-rte-toolbarDivider'} />
              )}

              {showItem('bulletList') && (
                <ToolbarButton
                  active={activeFormats.bulletList}
                  disabled={!editable}
                  label="Bulleted list"
                  onCommand={() => exec('insertUnorderedList')}
                >
                  <BulletListGlyph />
                </ToolbarButton>
              )}
              {showItem('numberList') && (
                <ToolbarButton
                  active={activeFormats.numberList}
                  disabled={!editable}
                  label="Numbered list"
                  onCommand={() => exec('insertOrderedList')}
                >
                  <NumberListGlyph />
                </ToolbarButton>
              )}

              {showItem('bold') && (
                <ToolbarButton
                  active={activeFormats.bold}
                  disabled={!editable}
                  label="Bold"
                  onCommand={() => exec('bold')}
                >
                  <span className={'ld-rte-glyphBold'}>B</span>
                </ToolbarButton>
              )}
              {showItem('italic') && (
                <ToolbarButton
                  active={activeFormats.italic}
                  disabled={!editable}
                  label="Italic"
                  onCommand={() => exec('italic')}
                >
                  <span className={'ld-rte-glyphItalic'}>I</span>
                </ToolbarButton>
              )}
              {showItem('code') && (
                <ToolbarButton
                  disabled={!editable}
                  label="Code"
                  onCommand={() => exec('formatBlock', 'pre')}
                >
                  <CodeGlyph />
                </ToolbarButton>
              )}
            </div>
          )}

          <div
            aria-describedby={ariaDescribedBy}
            aria-labelledby={labelId}
            aria-multiline="true"
            contentEditable={editable}
            data-placeholder={placeholder}
            id={id}
            onBlur={syncActiveState}
            onInput={handleInput}
            onKeyUp={syncActiveState}
            onMouseUp={syncActiveState}
            ref={editorRef}
            role="textbox"
            suppressContentEditableWarning
            {...editorProps}
            className={cx('ld-rte-value', isEmpty && 'ld-rte-empty', editorProps?.className)}
          />
        </div>

        <div id={helperId}>
          {hasHelperContent && (
            <div className={'ld-rte-helperTextContainer'}>
              <FormHelperText disabled={disabled} hasError={hasError}>
                {hasWarning && (
                  <>
                    <VisuallyHidden>Warning: </VisuallyHidden>
                    <WarningIcon className={'ld-rte-warningIcon'} size="small" />
                  </>
                )}
                {helperContent}
              </FormHelperText>

              {maxLength && (
                <span aria-hidden className={'ld-rte-maxLength'}>
                  {textLength} / {maxLength}
                </span>
              )}
            </div>
          )}

          {/* NOTE: `aria-live` lives outside `FormHelperText` — it is known to
          have screen reader issues when added dynamically. */}
          <VisuallyHidden aria-atomic aria-live="polite">
            {screenReaderMessage}
          </VisuallyHidden>
          {isMagic && (
            <VisuallyHidden aria-hidden id={magicLabelId}>{`${a11yMagicLabel},`}</VisuallyHidden>
          )}
        </div>
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';
