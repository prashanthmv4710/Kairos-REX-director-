// @refresh reset

/**
 * @module RichMediaSheet
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
 * For prop API + usage notes, read `RichMediaSheet.md` in this folder
 * or run `npm run ld-kit -- show RichMediaSheet`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {FocusTrap} from '../FocusTrap';
import './RichMediaSheet.css';

export type RichMediaSheetHeaderVariant = 'title' | 'title-subtitle' | 'logo-left' | 'logo-center' | 'inverse' | 'none';
export type RichMediaSheetSurfaceVariant = 'default' | 'brand' | 'brand-bold' | 'media';

export interface RichMediaSheetProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style' | 'title'> {
  isOpen: boolean;
  onClose: () => void;
  /** @default 'title' */
  headerVariant?: RichMediaSheetHeaderVariant;
  title?: string;
  subtitle?: string;
  logoSlot?: React.ReactNode;
  /** @default 'default' */
  surfaceVariant?: RichMediaSheetSurfaceVariant;
  children: React.ReactNode;
  actions?: React.ReactNode;
  showFooterDivider?: boolean;
  /** @default 'content' */
  adjustHeight?: 'fixed' | 'content';
  ariaLabel?: string;
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
}

function XIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M11.7803 13.0788L18 19.2985L19.0607 18.2378L12.841 12.0181L19.0607 5.79845L18 4.73779L11.7803 10.9575L5.56066 4.73779L4.5 5.79845L10.7197 12.0181L4.5 18.2378L5.56066 19.2985L11.7803 13.0788Z" fill="currentColor" />
    </svg>
  );
}

function CloseBtn({onClose, inverse, label}: {onClose: () => void; inverse?: boolean; label: string}) {
  return (
    <button
      type="button"
      onClick={onClose}
      className={cx('ld-wcp-richmediasheet-closeButton', inverse && 'ld-wcp-richmediasheet-closeButtonInverse')}
      aria-label={label}
    >
      <XIcon />
    </button>
  );
}

function DragHandle({inverse}: {inverse?: boolean}) {
  return <div className={cx('ld-wcp-richmediasheet-grabber', inverse && 'ld-wcp-richmediasheet-grabberInverse')} />;
}

function SheetHeader({variant, title, subtitle, logoSlot, onClose, forceInverse = false, titleId, closeLabel}: {variant: RichMediaSheetHeaderVariant; title?: string; subtitle?: string; logoSlot?: React.ReactNode; onClose: () => void; forceInverse?: boolean; titleId?: string; closeLabel: string}) {
  if (variant === 'none') {
    return (
      <div className="ld-wcp-richmediasheet-headerNone">
        <DragHandle inverse={forceInverse} />
        <div className="ld-wcp-richmediasheet-headerNoneRow">
          <CloseBtn onClose={onClose} inverse={forceInverse} label={closeLabel} />
        </div>
      </div>
    );
  }

  if (variant === 'inverse') {
    return (
      <div className="ld-wcp-richmediasheet-headerInverse">
        <DragHandle inverse />
        <div className="ld-wcp-richmediasheet-headerRow">
          <div className="ld-wcp-richmediasheet-headerTitleFrame">
            <h2 id={titleId} tabIndex={-1} className={cx('ld-wcp-richmediasheet-headerTitle', 'ld-wcp-richmediasheet-headerTitleInverse')}>{title}</h2>
          </div>
          <CloseBtn onClose={onClose} inverse label={closeLabel} />
        </div>
        <div className="ld-wcp-richmediasheet-headerDividerInverse" />
      </div>
    );
  }

  if (variant === 'title-subtitle') {
    return (
      <div className="ld-wcp-richmediasheet-header">
        <DragHandle inverse={forceInverse} />
        <div className="ld-wcp-richmediasheet-headerRow">
          <div className="ld-wcp-richmediasheet-headerTitleFrame">
            <h2 id={titleId} tabIndex={-1} className={cx('ld-wcp-richmediasheet-headerTitle', forceInverse && 'ld-wcp-richmediasheet-headerTitleBoldSurface')}>{title}</h2>
            {subtitle && <p className={cx('ld-wcp-richmediasheet-headerSubtitle', forceInverse && 'ld-wcp-richmediasheet-headerSubtitleBoldSurface')}>{subtitle}</p>}
          </div>
          <CloseBtn onClose={onClose} inverse={forceInverse} label={closeLabel} />
        </div>
        <div className={forceInverse ? 'ld-wcp-richmediasheet-headerDividerInverse' : 'ld-wcp-richmediasheet-headerDivider'} />
      </div>
    );
  }

  if (variant === 'logo-left') {
    return (
      <div className="ld-wcp-richmediasheet-header">
        <DragHandle inverse={forceInverse} />
        <div className="ld-wcp-richmediasheet-headerRow">
          <div className="ld-wcp-richmediasheet-headerLogoLeft">{logoSlot}</div>
          <CloseBtn onClose={onClose} inverse={forceInverse} label={closeLabel} />
        </div>
      </div>
    );
  }

  if (variant === 'logo-center') {
    return (
      <div className="ld-wcp-richmediasheet-header">
        <DragHandle inverse={forceInverse} />
        <div className="ld-wcp-richmediasheet-headerRow">
          <div className="ld-wcp-richmediasheet-headerLogoCenter">{logoSlot}</div>
          <CloseBtn onClose={onClose} inverse={forceInverse} label={closeLabel} />
        </div>
      </div>
    );
  }

  // Default: 'title'
  return (
    <div className="ld-wcp-richmediasheet-header">
      <DragHandle inverse={forceInverse} />
      <div className="ld-wcp-richmediasheet-headerRow">
        <div className="ld-wcp-richmediasheet-headerTitleFrame">
          <h2 id={titleId} tabIndex={-1} className={cx('ld-wcp-richmediasheet-headerTitle', forceInverse && 'ld-wcp-richmediasheet-headerTitleBoldSurface')}>{title}</h2>
        </div>
        <CloseBtn onClose={onClose} inverse={forceInverse} label={closeLabel} />
      </div>
    </div>
  );
}

const SURFACE_CLASS: Record<string, string> = {
  default: 'ld-wcp-richmediasheet-surfaceDefault',
  brand: 'ld-wcp-richmediasheet-surfaceBrand',
  'brand-bold': 'ld-wcp-richmediasheet-surfaceBrandBold',
  media: 'ld-wcp-richmediasheet-surfaceMedia',
};

const FOOTER_CLASS: Record<string, string> = {
  default: 'ld-wcp-richmediasheet-footerDefault',
  brand: 'ld-wcp-richmediasheet-footerBrand',
  'brand-bold': 'ld-wcp-richmediasheet-footerBrandBold',
  media: 'ld-wcp-richmediasheet-footerMedia',
};

export const RichMediaSheet: React.FunctionComponent<RichMediaSheetProps> = (props) => {
  const {
    isOpen, onClose, headerVariant = 'title', title, subtitle, logoSlot,
    surfaceVariant = 'default', children, actions, showFooterDivider,
    adjustHeight = 'content', ariaLabel, className, ...rest
  } = applyCommonProps(props);

  const titleId = React.useId();
  const triggerRef = React.useRef<Element | null>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const sheetRef = React.useRef<HTMLDivElement>(null);

  // Capture the trigger before any useEffect (including FocusTrap) moves focus away.
  // useLayoutEffect fires synchronously after DOM mutations, before useEffect.
  React.useLayoutEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement;
    }
  }, [isOpen]);

  // Move focus to the dialog title on open; fall back to first focusable (e.g. close button)
  // for variants without a title heading (logo-left, logo-center, none).
  React.useLayoutEffect(() => {
    if (!isOpen) return;
    const handle = setTimeout(() => {
      const titleEl = document.getElementById(titleId) as HTMLElement | null;
      if (titleEl) {
        titleEl.focus();
      } else {
        const firstFocusable = sheetRef.current?.querySelector<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      }
    }, 0);
    return () => clearTimeout(handle);
  }, [isOpen, titleId]);

  const handleClose = React.useCallback(() => {
    onClose();
    // Return focus to the element that opened the sheet
    requestAnimationFrame(() => {
      (triggerRef.current as HTMLElement | null)?.focus();
    });
  }, [onClose]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Lock body scroll while open
  React.useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  // When the content area overflows, expose it to keyboard/AT users
  React.useEffect(() => {
    if (!isOpen) return;
    const el = contentRef.current;
    if (!el) return;

    const sync = () => {
      const scrollable = el.scrollHeight > el.clientHeight;
      const already = el.hasAttribute('tabindex');
      if (scrollable === already) return;
      if (scrollable) {
        el.tabIndex = 0;
        el.setAttribute('role', 'region');
        el.setAttribute('aria-label', 'Scrollable content');
      } else {
        el.removeAttribute('tabindex');
        el.removeAttribute('role');
        el.removeAttribute('aria-label');
      }
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isOpen]);

  if (!isOpen) return null;

  const showFooter = actions != null;
  const showDivider = showFooterDivider ?? showFooter;
  const isBoldSurface = surfaceVariant === 'brand-bold';
  const closeLabel = title ? `Close ${title} dialog` : 'Close dialog';

  return (
    <>
      <div className="ld-wcp-richmediasheet-overlay" onClick={handleClose} />
      <FocusTrap hasFocusReturn={false}>
        <div
          className={cx(
            'ld-wcp-richmediasheet-sheet',
            adjustHeight === 'fixed' ? 'ld-wcp-richmediasheet-sheetFixed' : 'ld-wcp-richmediasheet-sheetContent',
            SURFACE_CLASS[surfaceVariant],
            className
          )}
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-label={!title ? ariaLabel : undefined}
          {...rest}
        >
          <SheetHeader
            variant={headerVariant}
            title={title}
            subtitle={subtitle}
            logoSlot={logoSlot}
            onClose={handleClose}
            forceInverse={isBoldSurface}
            titleId={title ? titleId : undefined}
            closeLabel={closeLabel}
          />
          <div
            className={cx('ld-wcp-richmediasheet-contentArea', adjustHeight === 'fixed' && 'ld-wcp-richmediasheet-contentAreaFixed')}
            ref={contentRef}
          >
            {children}
          </div>
          {showFooter && (
            <div className={cx('ld-wcp-richmediasheet-footer', FOOTER_CLASS[surfaceVariant])}>
              {showDivider && <div className="ld-wcp-richmediasheet-footerDivider" />}
              <div className="ld-wcp-richmediasheet-footerActions">{actions}</div>
            </div>
          )}
        </div>
      </FocusTrap>
    </>
  );
};

RichMediaSheet.displayName = 'RichMediaSheet';
