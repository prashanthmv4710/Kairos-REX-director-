import * as React from 'react';
import { Icon } from '../Icons';
import { IconButton } from '../IconButton';
import { Image } from '../Image';
import { Modal } from '../Modal';
import { Body } from '../Text';

/**
 * Article thumbnail — a fixed 36x36 rounded frame used next to the article
 * ID/name in the REX inbox table. Mirrors the "Article" column treatment in
 * the RPM Rejected Reprocess app: rows without a resolved photo show a
 * generic image placeholder icon; rows with one render a clickable thumbnail
 * that opens a larger preview in a Modal.
 */

export interface ArticleThumbnailProps {
  articleId: string;
  articleName: string;
  imageUrl?: string;
  imageAlt?: string;
}

const FRAME_STYLE: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 6,
  background: 'var(--ld-semantic-color-fill-accent-blue-subtle)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  flexShrink: 0,
};

export function ArticleThumbnail({ articleId, articleName, imageUrl, imageAlt }: ArticleThumbnailProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!imageUrl) {
    return (
      <div style={FRAME_STYLE}>
        <Icon name="Image" decorative style={{ color: 'var(--ld-semantic-color-text-accent-blue)' }} />
      </div>
    );
  }

  const alt = imageAlt ?? articleName;

  return (
    <>
      <IconButton
        a11yLabel={`View larger image of ${articleName}`}
        variant="ghost"
        size="small"
        onClick={() => setIsOpen(true)}
        UNSAFE_style={{ ...FRAME_STYLE, padding: 0 }}
      >
        <Image src={imageUrl} alt={alt} UNSAFE_style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </IconButton>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={articleId} size="medium">
        <Body as="p" size="small" color="subtle" UNSAFE_style={{ marginBottom: 'var(--ld-primitive-scale-space-200)' }}>
          {articleName}
        </Body>
        <div style={{ width: '100%', aspectRatio: '1 / 1', overflow: 'hidden', borderRadius: 8 }}>
          <Image src={imageUrl} alt={alt} UNSAFE_style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </Modal>
    </>
  );
}
