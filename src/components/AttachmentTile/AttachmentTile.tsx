'use client';
// @refresh reset

/**
 * @module AttachmentTile
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
 * For prop API + usage notes, read `AttachmentTile.md` in this folder
 * or run `npm run ld-kit -- show AttachmentTile`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps, CommonProps, useStableId} from '../../common/helpers';
import {IconButton, IconButtonButtonProps} from '../IconButton';
import {CloseIcon, Icon} from '../Icons';
import {ProgressIndicator} from '../ProgressIndicator';
import {Spinner} from '../Spinner';
import {SpotIcon} from '../SpotIcon/SpotIcon';
import {Tooltip} from '../Tooltip';
import {VisuallyHidden} from '../VisuallyHidden';
import './AttachmentTile.css';

// ---------------------------------------------------------------------------
// AttachmentTileCloseButton (inlined sub-component)
// ---------------------------------------------------------------------------

export interface AttachmentTileCloseButtonProps
  extends Omit<
    IconButtonButtonProps,
    'children' | 'a11yLabel' | 'size' | 'color' | 'variant'
  > {}

/**
 * @private
 */
export const AttachmentTileCloseButton = React.forwardRef<
  HTMLButtonElement,
  AttachmentTileCloseButtonProps
>((props, ref) => {
  const {className, ...rest} = applyCommonProps(props);
  const a11yLabel = (rest['aria-label'] as string | undefined) ?? 'Remove attachment';

  return (
    <IconButton
      UNSAFE_className={cx('ld-attachmenttile-close', className)}
      a11yLabel={a11yLabel}
      color="secondary"
      ref={ref}
      size="xsmall"
      variant="round"
      {...rest}
    >
      <CloseIcon size="small" className={'ld-attachmenttile-closeIcon'} />
    </IconButton>
  );
});

AttachmentTileCloseButton.displayName = 'AttachmentTileCloseButton';

/**
 * Attachment Tile variant:
 * - `icon` → a leading pictogram/icon with a title and description (≈176×64).
 * - `image` → a compact, 1:1 image thumbnail with no text (64px tall tile).
 */
export type AttachmentTileVariant = 'icon' | 'image';

export interface AttachmentTileProps
  extends CommonProps,
    Omit<
      React.ComponentPropsWithoutRef<'div'>,
      'className' | 'style' | 'title'
    > {
  /**
   * The props spread to the tile's close (remove) button.
   */
  closeButtonProps?: AttachmentTileCloseButtonProps;
  /**
   * The description shown under the title. Only rendered for the `icon`
   * variant.
   */
  description?: React.ReactNode;
  /**
   * If the tile is disabled.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * The image (thumbnail) content for the `image` variant — typically an
   * `<img>`. Sized and rounded by the tile.
   */
  image?: React.ReactNode;
  /**
   * The leading content for the `icon` variant — typically a `SpotIcon` or a
    * file-type pictogram. Defaults to the library placeholder icon in a green,
    * square `SpotIcon`.
   */
  leading?: React.ReactNode;
  /**
   * A URL (or object URL) for an image thumbnail shown in the leading slot of
   * the `icon` variant. When provided, the thumbnail is displayed at 48×48px
   * with `object-fit: cover` instead of the `leading` SpotIcon. Consumers
   * typically create this via `URL.createObjectURL(file)` for image files
   * dropped onto the composer.
   *
   * Only used with `variant="icon"`.
   */
  thumbnailSrc?: string;
  /**
   * The callback fired when the tile's close (remove) button is clicked.
   */
  onRemove?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * The accessible label for the close (remove) button.
   *
   * @default "Remove attachment"
   */
  removeLabel?: string;
  /**
   * When `true`, the close (remove) button and its tooltip are not rendered.
   * Use for sent or read-only tiles that should not be dismissible — the tile
   * retains its normal visual appearance without any remove affordance.
   *
   * @default false
   */
  nonDismissible?: boolean;
  /**
   * The title for the `icon` variant.
   */
  title?: React.ReactNode;
  /**
   * When `true`, shows a brand Spinner in the leading 48×48 slot, replacing
   * the SpotIcon/thumbnail. Use for indeterminate loading (no known progress).
   * The tile dimensions stay stable while this prop is `true`.
   *
   * Takes priority only when `uploadProgress` is not set. Only applies to the
   * `icon` variant.
   *
   * @default false
   */
  loading?: boolean;

  /**
   * A 0–100 upload progress value. When defined, the normal SpotIcon/thumbnail
   * stays visible and a ProgressIndicator (info variant) appears at the bottom
   * of the tile. Must be a real progress value — do not pass simulated values
   * as if they represent actual upload state.
   *
   * Takes priority over `loading`. Only applies to the `icon` variant.
   */
  uploadProgress?: number;

  /**
   * The variant for the tile.
   *
   * @default "icon"
   */
  variant?: AttachmentTileVariant;
}

/**
 * Attachment Tiles represent an attached file or image as a compact chip. The
 * `icon` variant pairs a leading pictogram with a title and description; the
 * `image` variant shows a square thumbnail. By default a trailing close button
 * is revealed on hover or keyboard focus — wire it with `onRemove`. Set
 * `nonDismissible={true}` for sent or read-only tiles that should show no
 * remove affordance; the tile retains its normal visual appearance. Disabled
 * tiles suppress the close button but apply the full disabled treatment (greyed
 * text/icon). Tiles also respond to hover, focus, and pressed input.
 */
export const AttachmentTile = React.forwardRef<
  HTMLDivElement,
  AttachmentTileProps
>((props, ref) => {
  const {
    className,
    closeButtonProps,
    description,
    disabled = false,
    image,
    leading,
    loading = false,
    onRemove,
    removeLabel,
    nonDismissible = false,
    thumbnailSrc,
    title,
    uploadProgress,
    variant = 'icon',
    ...rest
  } = applyCommonProps(props);

  // Fold the file name into the remove control's accessible name so that, with
  // several attachments, each "Remove" button is uniquely identifiable
  // ("Remove Q3-report.pdf"). An explicit removeLabel still wins.
  const titleText = typeof title === 'string' ? title : undefined;
  const resolvedRemoveLabel = removeLabel ?? (titleText ? `Remove ${titleText}` : 'Remove attachment');

  // Keep a handle on the tile so we can move focus to a neighbouring tile's
  // remove button before this tile unmounts (otherwise focus falls to <body>).
  const tileRef = React.useRef<HTMLDivElement | null>(null);
  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      tileRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [ref],
  );

  // Fallback leading content: consumer's `leading` node, or the default SpotIcon.
  // When `thumbnailSrc` is set the leading span shows an <img> instead and this
  // value is not used — see the JSX below.
  const resolvedLeading = leading ?? (
    <SpotIcon shape="square" color="green" size="small">
      <Icon name="Image" decorative />
    </SpotIcon>
  );

  // Loading state derivation.
  // `uploadProgress` takes priority — if a real value exists, show the
  // determinate bar and keep the SpotIcon/thumbnail visible.
  // `loading` (indeterminate) shows the brand Spinner in the leading slot,
  // hiding the SpotIcon/thumbnail until the upload begins.
  // Show the progress overlay only while upload is in progress (< 100).
  // At 100 the overlay is hidden and the leading slot returns to its resting
  // state — SpotIcon for non-image files, sharp thumbnail for image files.
  // Clamp to [0, 100] so a consumer passing a negative or >100 value (e.g.
  // from a rounding error in streamed upload events) never produces an
  // out-of-range aria-valuenow on the progressbar role.
  const clampedProgress = uploadProgress !== undefined
    ? Math.max(0, Math.min(100, uploadProgress))
    : undefined;
  const isDeterminate = clampedProgress !== undefined && clampedProgress < 100;
  const isIndeterminate = loading && !isDeterminate;

  // Stable ID used to link the ProgressIndicator's accessible label to a
  // VisuallyHidden span containing the filename. useStableId must be called
  // unconditionally; the id is only attached to the DOM when isDeterminate.
  const progressLabelId = useStableId();

  // ── Icon-variant leading slot ─────────────────────────────────────────────
  // When indeterminate: Spinner (aria-hidden removed so its role/label is
  // announced). When loaded: SpotIcon or thumbnail (aria-hidden to suppress
  // decorative content from AT).
  const iconLeadingContent = isIndeterminate
    ? <Spinner variant="generic" color="dark" size="small" a11yLabel="Loading attachment…" />
    : thumbnailSrc
    ? <img src={thumbnailSrc} alt="" />
    : resolvedLeading;

  const hasIconLeading = isIndeterminate || Boolean(thumbnailSrc) || Boolean(resolvedLeading);

  const iconLeadingSlot = variant === 'icon' && hasIconLeading ? (
    <span
      className={cx(
        'ld-attachmenttile-leading',
        !isIndeterminate && thumbnailSrc ? 'ld-attachmenttile-leading--thumb' : undefined,
        // --progress makes the leading a containing block for the absolute track.
        isDeterminate ? 'ld-attachmenttile-leading--progress' : undefined,
      )}
      // Remove aria-hidden when the ProgressIndicator or Spinner is inside so
      // AT can read role="progressbar" / role="img". For resting state, the
      // SpotIcon/thumbnail is decorative and the span stays aria-hidden.
      aria-hidden={!isIndeterminate && !isDeterminate ? true : undefined}
    >
      {iconLeadingContent}
      {isDeterminate && (
        <div className="ld-attachmenttile-progress">
          {/* VisuallyHidden provides the accessible label via aria-labelledby.
              The percentage in valueLabel feeds aria-valuetext, e.g. "45%, Info".
              The visible label row is hidden by CSS. `aria-hidden` keeps this
              pure name-source span out of browse-mode traversal — the
              id-reference still resolves it for naming regardless. */}
          <VisuallyHidden id={progressLabelId} aria-hidden="true" className="ld-a11y-nameSource">
            {titleText ?? 'Upload progress'}
          </VisuallyHidden>
          <ProgressIndicator
            variant="info"
            value={clampedProgress ?? 0}
            valueLabel={`${Math.round(clampedProgress ?? 0)}%`}
            a11yLabelledBy={progressLabelId}
          />
        </div>
      )}
    </span>
  ) : null;

  // ── Icon-variant text slot ────────────────────────────────────────────────
  // The visible title/description are two separate lines (CSS-truncated), and
  // the title used to carry its own tabIndex + Tooltip aria-describedby. That
  // read as three disjointed announcements (title, its truncated-text tooltip
  // echo, then description) for no benefit — a screen-reader user never needs
  // to *tab into* the tile's text to get the full name; they just need to
  // hear it once, in full, as part of reading the tile. So the visual spans
  // are now aria-hidden and a single VisuallyHidden `<p>` carries the combined
  // "title, description" string as the tile's one accessible text node.
  const descriptionText = typeof description === 'string' ? description : undefined;
  const canConsolidateText = Boolean(titleText) && (description == null || descriptionText !== undefined);
  const combinedA11yText = [titleText, descriptionText].filter(Boolean).join(', ');

  const textSlot = variant === 'icon' && (title || description) ? (
    <span className={'ld-attachmenttile-text'}>
      {title && (
        titleText ? (
          <Tooltip content={titleText} position="above">
            {/* No tabIndex: `tabindex="0"` + `aria-hidden="true"` is an invalid,
                mutually-exclusive combination (axe: aria-hidden-focus) — a
                focusable-but-AT-hidden element is a silent focus black hole.
                The consolidated VisuallyHidden sibling below already announces
                the full filename, so this span only needs to exist for sighted
                users; keeping truncated text keyboard-reachable (WCAG 2.1.1)
                needs its own follow-up (e.g. moving the Tooltip onto the
                tile's own focusable control), not a tabIndex here. */}
            <span
              aria-hidden={canConsolidateText || undefined}
              className={'ld-attachmenttile-title'}
            >{title}</span>
          </Tooltip>
        ) : (
          <span className={'ld-attachmenttile-title'}>{title}</span>
        )
      )}
      {description && (
        <span aria-hidden={canConsolidateText || undefined} className={'ld-attachmenttile-description'}>{description}</span>
      )}
      {canConsolidateText && (
        <VisuallyHidden as="p">{combinedA11yText}</VisuallyHidden>
      )}
    </span>
  ) : null;

  return (
    <div
      className={cx(
        'ld-attachmenttile-tile',
        variant === 'icon' && 'ld-attachmenttile-icon',
        variant === 'image' && 'ld-attachmenttile-image',
        disabled && 'ld-attachmenttile-disabled',
        className
      )}
      ref={setRefs}
      {...rest}
    >
      <div className="ld-attachmenttile-surface">
        {variant === 'image'
          ? image && <span className={'ld-attachmenttile-imageSlot'}>{image}</span>
          : (
              <>
                {iconLeadingSlot}
                {textSlot}
              </>
            )
        }
      </div>

      {!nonDismissible && (
        <Tooltip content="Remove file" position="above" relationship="description">
          <AttachmentTileCloseButton
            aria-label={resolvedRemoveLabel}
            disabled={disabled}
            {...closeButtonProps}
            onClick={(event) => {
              closeButtonProps?.onClick?.(event);

              // Move focus to a neighbouring tile's remove button before this tile
              // is unmounted by the consumer, so focus isn't stranded on <body>.
              const el = tileRef.current;
              const tiles = el
                ? Array.from(
                    el.parentElement?.querySelectorAll<HTMLElement>('.ld-attachmenttile-tile') ?? [],
                  )
                : [];
              const i = el ? tiles.indexOf(el) : -1;
              const sibling = i >= 0 ? tiles[i + 1] ?? tiles[i - 1] ?? null : null;
              const target = sibling?.querySelector<HTMLElement>('.ld-attachmenttile-close');

              onRemove?.(event);

              if (target) requestAnimationFrame(() => target.focus());
            }}
          />
        </Tooltip>
      )}
    </div>
  );
});

AttachmentTile.displayName = 'AttachmentTile';
