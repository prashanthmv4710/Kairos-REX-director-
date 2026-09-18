// @refresh reset

/**
 * @module UploadImage
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
 * For prop API + usage notes, read `UploadImage.md` in this folder
 * or run `npm run ld-kit -- show UploadImage`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps, useStableId} from '../../common/helpers';
import {CloseIcon, ExclamationCircleIcon} from '../Icons';
import {useAnnounce} from '../A11yAnnouncement';
import './UploadImage.css';

const MAX_IMAGES = 5;

export interface UploadedImage {
  id: string;
  src: string;
  file: File;
}

export interface UploadImageProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style' | 'onChange'> {
  images?: UploadedImage[];
  onChange?: (images: UploadedImage[]) => void;
  /** @default 5 */
  maxImages?: number;
  invalid?: boolean;
  errorMessage?: string;
  photoTip?: string;
  label?: string;
  subLabel?: string;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

export const UploadImage: React.FunctionComponent<UploadImageProps> = (props) => {
  const {
    images = [],
    onChange,
    maxImages = MAX_IMAGES,
    invalid = false,
    errorMessage = "Invalid file type. Choose a file that's a PNG, GIF, JPG, JPEG, HEIC or TIFF.",
    photoTip = 'show us a clear photo of the item, highlighting any notable details.',
    label = 'Show us what it looks like',
    subLabel = 'Add up to 5 photos, 5MB max each.',
    className,
    ...rest
  } = applyCommonProps(props);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const addBtnRef = React.useRef<HTMLButtonElement>(null);
  // Map of image id → remove button element
  const removeBtnRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
  const labelId = useStableId();
  const photoTipId = useStableId();
  const dragDepth = React.useRef(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const announce = useAnnounce();

  const isEmpty = images.length === 0;
  const canAddMore = images.length < maxImages;
  const remainingSlots = Math.max(0, maxImages - images.length);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const newImages: UploadedImage[] = [];
    for (const file of files) {
      if (images.length + newImages.length >= maxImages) break;
      const src = URL.createObjectURL(file);
      newImages.push({id: `${Date.now()}-${file.name}`, src, file});
    }
    const next = [...images, ...newImages];
    onChange?.(next);
    // Focus management runs after React re-renders the new tiles
    requestAnimationFrame(() => {
      if (next.length >= maxImages) {
        // Add button disappears — move to the last image's remove button
        const lastId = next[next.length - 1].id;
        removeBtnRefs.current.get(lastId)?.focus();
      } else {
        // Add button is still present — return focus to it
        addBtnRef.current?.focus();
      }
    });
    setTimeout(() => {
      const added = newImages.length;
      const total = next.length;
      announce.polite(
        added === 1
          ? `${newImages[0].file.name} added. ${total} of ${maxImages} photos uploaded.`
          : `${added} photos added. ${total} of ${maxImages} photos uploaded.`
      );
    }, 100);
    e.target.value = '';
  }

  function handleRemove(id: string) {
    const removedIdx = images.findIndex((img) => img.id === id);
    const removed = images[removedIdx];
    const next = images.filter((img) => img.id !== id);
    onChange?.(next);

    // Determine where focus should land after the DOM updates
    requestAnimationFrame(() => {
      if (next.length === 0) {
        // All removed — focus the wide add button
        addBtnRef.current?.focus();
      } else if (removedIdx < next.length) {
        // There's an image at the same index — focus its remove button
        removeBtnRefs.current.get(next[removedIdx].id)?.focus();
      } else {
        // Removed the last image — focus the new last remove button
        removeBtnRefs.current.get(next[next.length - 1].id)?.focus();
      }
    });

    setTimeout(() => {
      announce.polite(
        removed
          ? `${removed.file.name} removed. ${next.length} of ${maxImages} photos uploaded.`
          : `Photo removed. ${next.length} of ${maxImages} photos uploaded.`
      );
    }, 100);
  }

  function openFilePicker() {
    inputRef.current?.click();
  }

  function handleDragEnter(e: React.DragEvent<HTMLButtonElement>) {
    e.preventDefault();
    dragDepth.current += 1;
    if (dragDepth.current === 1) setIsDragging(true);
  }

  function handleDragOver(e: React.DragEvent<HTMLButtonElement>) {
    e.preventDefault();
  }

  function handleDragLeave(e: React.DragEvent<HTMLButtonElement>) {
    e.preventDefault();
    dragDepth.current -= 1;
    if (dragDepth.current === 0) setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent<HTMLButtonElement>) {
    e.preventDefault();
    dragDepth.current = 0;
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;
    const newImages: UploadedImage[] = [];
    for (const file of files) {
      if (images.length + newImages.length >= maxImages) break;
      const src = URL.createObjectURL(file);
      newImages.push({id: `${Date.now()}-${file.name}`, src, file});
    }
    const next = [...images, ...newImages];
    onChange?.(next);
    setTimeout(() => {
      const added = newImages.length;
      announce.polite(
        added === 1
          ? `${newImages[0].file.name} added. ${next.length} of ${maxImages} photos uploaded.`
          : `${added} photos added. ${next.length} of ${maxImages} photos uploaded.`
      );
    }, 100);
  }

  const addButtonLabel = `Add image. ${remainingSlots} of ${maxImages} remaining`;

  const dragHandlers = {
    onDragEnter: handleDragEnter,
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
  };

  return (
    <div
      className={cx('ld-wcp-uploadimage-root', className)}
      role="group"
      aria-labelledby={labelId}
      {...rest}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/gif,image/jpg,image/jpeg,image/heic,image/tiff,.heic,.tiff"
        multiple
        className="ld-wcp-uploadimage-hiddenInput"
        onChange={handleFileChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      <div className="ld-wcp-uploadimage-header">
        <span id={labelId} className="ld-wcp-uploadimage-labelBold">{label}</span>{' '}
        <span className="ld-wcp-uploadimage-labelNormal">{subLabel}</span>
      </div>

      {invalid && (
        <div className="ld-wcp-uploadimage-errorAlert" role="alert">
          <div className="ld-wcp-uploadimage-errorTab" aria-hidden="true" />
          <div className="ld-wcp-uploadimage-errorContent">
            <ExclamationCircleIcon size="small" className="ld-wcp-uploadimage-errorIcon" a11yLabel="Error" />
            <span className="ld-wcp-uploadimage-errorMessage">{errorMessage}</span>
          </div>
        </div>
      )}

      {isEmpty ? (
        <button
          ref={addBtnRef}
          type="button"
          className={cx('ld-wcp-uploadimage-wideTile', isDragging && 'ld-wcp-uploadimage-wideTile-dragging')}
          onClick={openFilePicker}
          aria-label={addButtonLabel}
          aria-describedby={photoTipId}
          {...dragHandlers}
        >
          <i className="ld ld-Plus" aria-hidden="true" style={{fontSize: '32px'}} />
        </button>
      ) : (
        <div className="ld-wcp-uploadimage-tilesRow">
          {images.map((img, idx) => {
            const imgLabel = img.file?.name || `Photo ${idx + 1} of ${images.length}`;
            return (
              <div key={img.id} className="ld-wcp-uploadimage-uploadedTile">
                <img src={img.src} alt={imgLabel} className="ld-wcp-uploadimage-uploadedImg" />
                <button
                  ref={(el) => {
                    if (el) removeBtnRefs.current.set(img.id, el);
                    else removeBtnRefs.current.delete(img.id);
                  }}
                  type="button"
                  className="ld-wcp-uploadimage-removeBtn"
                  onClick={() => handleRemove(img.id)}
                  aria-label={`Remove ${imgLabel}`}
                >
                  <CloseIcon size="small" decorative />
                </button>
              </div>
            );
          })}
          {canAddMore &&
            Array.from({length: remainingSlots}).map((_, i) => (
              <button
                key={`empty-${i}`}
                ref={i === 0 ? addBtnRef : undefined}
                type="button"
                className={cx(
                  'ld-wcp-uploadimage-squareTile',
                  i > 0 && 'ld-wcp-uploadimage-squareTileGhost',
                  i === 0 && isDragging && 'ld-wcp-uploadimage-squareTile-dragging',
                )}
                onClick={i === 0 ? openFilePicker : undefined}
                aria-label={i === 0 ? addButtonLabel : undefined}
                aria-describedby={i === 0 ? photoTipId : undefined}
                aria-hidden={i > 0 ? 'true' : undefined}
                disabled={i > 0}
                tabIndex={i === 0 ? 0 : -1}
                {...(i === 0 ? dragHandlers : {})}
              >
                <i className="ld ld-Plus" aria-hidden="true" style={{fontSize: '32px'}} />
              </button>
            ))}
        </div>
      )}

      <p id={photoTipId} className="ld-wcp-uploadimage-photoTip">
        <strong className="ld-wcp-uploadimage-photoTipBold">Photo tip:</strong>{' '}
        {photoTip}
      </p>
    </div>
  );
};

UploadImage.displayName = 'UploadImage';
