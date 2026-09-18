// @refresh reset

/**
 * @module UploadFile
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
 * For prop API + usage notes, read `UploadFile.md` in this folder
 * or run `npm run ld-kit -- show UploadFile`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {Spinner} from '../Spinner/Spinner';
import './UploadFile.css';

const DEFAULT_MAX_FILES = 10;
const DEFAULT_ACCEPT =
  '.xls,.xlsx,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv';

export type UploadedFileStatus = 'uploading' | 'success' | 'error';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status?: UploadedFileStatus;
  errorText?: string;
  file?: File;
}

export interface UploadFileProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style' | 'onChange'> {
  files?: UploadedFile[];
  onChange?: (files: UploadedFile[]) => void;
  onCancel?: (id: string) => void;
  onRemove?: (id: string) => void;
  /** @default 10 */
  maxFiles?: number;
  /** File picker accept string. @default ".xls,.xlsx,.csv,..." */
  accept?: string;
  /** Helper text shown under the prompt. @default "XLS, CSV | 5 MB max per file" */
  helperText?: string;
  /** Browse button label. @default "Browse" */
  browseLabel?: string;
  /** Prompt text shown next to the Browse button. @default "Drag and drop files, or" */
  promptText?: string;
  /** Prompt shown while a file is being dragged over the zone. @default "Drop your file(s) here" */
  dragPromptText?: string;
  invalid?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const UploadFile: React.FunctionComponent<UploadFileProps> = (props) => {
  const {
    files = [],
    onChange,
    onCancel,
    onRemove,
    maxFiles = DEFAULT_MAX_FILES,
    accept = DEFAULT_ACCEPT,
    helperText = 'XLS, CSV | 5 MB max per file',
    browseLabel = 'Browse',
    promptText = 'Drag and drop files, or',
    dragPromptText = 'Drop your file(s) here',
    invalid = false,
    errorMessage,
    disabled = false,
    className,
    ...rest
  } = applyCommonProps(props);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const dragDepth = React.useRef(0);

  function pickFiles() {
    if (disabled) return;
    inputRef.current?.click();
  }

  function addFiles(fileList: FileList | File[]) {
    const incoming = Array.from(fileList);
    if (!incoming.length) return;
    const next: UploadedFile[] = [];
    for (const f of incoming) {
      if (files.length + next.length >= maxFiles) break;
      next.push({
        id: `${Date.now()}-${f.name}-${Math.random().toString(36).slice(2, 6)}`,
        name: f.name,
        size: f.size,
        file: f,
        status: 'success',
      });
    }
    onChange?.([...files, ...next]);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = '';
  }

  function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
    if (disabled) return;
    e.preventDefault();
    dragDepth.current += 1;
    if (dragDepth.current === 1) setIsDragging(true);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    if (disabled) return;
    e.preventDefault();
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    dragDepth.current -= 1;
    if (dragDepth.current === 0) setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    if (disabled) return;
    e.preventDefault();
    dragDepth.current = 0;
    setIsDragging(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  }

  function handleCancel(id: string) {
    if (onCancel) onCancel(id);
    else onChange?.(files.filter((f) => f.id !== id));
  }

  function handleRemove(id: string) {
    if (onRemove) onRemove(id);
    else onChange?.(files.filter((f) => f.id !== id));
  }

  return (
    <div className={cx('ld-wcp-uploadfile-root', className)} {...rest}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="ld-wcp-uploadfile-hiddenInput"
        onChange={handleFileChange}
        disabled={disabled}
        aria-hidden="true"
        tabIndex={-1}
      />

      {invalid && errorMessage && (
        <div className="ld-wcp-uploadfile-errorAlert" role="alert">
          <div className="ld-wcp-uploadfile-errorTab" aria-hidden="true" />
          <div className="ld-wcp-uploadfile-errorContent">
            <i
              className="ld ld-ExclamationCircleFill ld-wcp-uploadfile-errorIcon"
              role="img"
              aria-label="Error"
            />
            <span className="ld-wcp-uploadfile-errorMessage">{errorMessage}</span>
          </div>
        </div>
      )}

      <div
        className={cx(
          'ld-wcp-uploadfile-dropzone',
          isDragging && 'ld-wcp-uploadfile-dropzone-dragging',
          disabled && 'ld-wcp-uploadfile-dropzone-disabled',
          invalid && 'ld-wcp-uploadfile-dropzone-invalid',
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <i className="ld ld-CloudUpload ld-wcp-uploadfile-cloudIcon" aria-hidden="true" />
        {isDragging ? (
          <span className="ld-wcp-uploadfile-dropPrompt">{dragPromptText}</span>
        ) : (
          <>
            <div className="ld-wcp-uploadfile-prompt">
              <span className="ld-wcp-uploadfile-promptText">{promptText}</span>
              <button
                type="button"
                className="ld-wcp-uploadfile-browseBtn"
                onClick={pickFiles}
                disabled={disabled}
                aria-label={`${promptText} ${browseLabel}. ${helperText}`}
              >
                {browseLabel}
              </button>
            </div>
            <span className="ld-wcp-uploadfile-helperText">{helperText}</span>
          </>
        )}
      </div>

      {files.length > 0 && (
        <ul className="ld-wcp-uploadfile-list">
          {files.map((file) => {
            const status = file.status ?? 'success';
            const isError = status === 'error';
            const isUploading = status === 'uploading';
            return (
              <li key={file.id} className="ld-wcp-uploadfile-row">
                <span className="ld-wcp-uploadfile-fileLeading">
                  {isError ? (
                    <i
                      className="ld ld-ExclamationCircleFill ld-wcp-uploadfile-fileErrorIcon"
                      role="img"
                      aria-label={`Error: ${file.name}`}
                    />
                  ) : (
                    <i className="ld ld-Note ld-wcp-uploadfile-fileIcon" aria-hidden="true" />
                  )}
                  <span
                    className={cx(
                      'ld-wcp-uploadfile-fileName',
                      isError && 'ld-wcp-uploadfile-fileName-error',
                    )}
                  >
                    {file.name}
                  </span>
                  <span
                    className={cx(
                      'ld-wcp-uploadfile-fileSize',
                      isError && 'ld-wcp-uploadfile-fileSize-error',
                    )}
                  >
                    {formatSize(file.size)}
                  </span>
                </span>
                <span className="ld-wcp-uploadfile-fileTrailing">
                  {isUploading && (
                    <>
                      <Spinner size="small" a11yLabel={`Uploading ${file.name}`} />
                      <button
                        type="button"
                        className="ld-wcp-uploadfile-cancelBtn"
                        onClick={() => handleCancel(file.id)}
                        aria-label={`Cancel upload of ${file.name}`}
                      >
                        <i className="ld ld-CloseCircleFill" aria-hidden="true" />
                      </button>
                    </>
                  )}
                  {status === 'success' && (
                    <>
                      <i
                        className="ld ld-CheckCircleFill ld-wcp-uploadfile-successIcon"
                        role="img"
                        aria-label={`Uploaded successfully: ${file.name}`}
                      />
                      <button
                        type="button"
                        className="ld-wcp-uploadfile-removeBtn"
                        onClick={() => handleRemove(file.id)}
                        aria-label={`Remove ${file.name}`}
                      >
                        <i className="ld ld-Trash" aria-hidden="true" />
                      </button>
                    </>
                  )}
                  {isError && (
                    <span className="ld-wcp-uploadfile-errorTag">
                      {file.errorText || 'Unsupported file type'}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

UploadFile.displayName = 'UploadFile';
