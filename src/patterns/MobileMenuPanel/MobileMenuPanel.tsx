// @refresh reset

/**
 * @module MobileMenuPanel
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
 * For prop API + usage notes, read `MobileMenuPanel.md` in this folder
 * or run `npm run ld-kit -- show MobileMenuPanel`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/walmart/MobileMenuPanel.tsx
 *
 * AX Mobile Menu Panel — full-height left-anchored mobile drawer with a
 * dark action header, a left section selector, and a scrollable
 * right-side link list.
 *
 * Adaptation: data is now passed in via the `sections` and
 * `actionTiles` props instead of being hard-coded. Icons are consumer-
 * supplied so we can drop the AX-specific icon imports
 * (`SidekickLogoIcon`, `Barcode`, `Box`, `Building`, etc.). External-link
 * arrow inlined.
 */
import * as React from 'react';

import {MegaNavActionButton} from '../MegaNavActionButton';
import {ClockIn, ClockOut} from '../../components/ClockStatus';
import type {ClockState} from '../../components/ClockStatus';
import {cx} from '../../common/cx';
import {Icon} from '../../components/Icons';

import './MobileMenuPanel.css';

export interface MobileMenuLink {
  label: string;
  external?: boolean;
  onClick?: () => void;
}

export interface MobileMenuSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  title: string;
  links: MobileMenuLink[];
}

export interface MobileMenuActionTile {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const DEFAULT_UTILITY_LINKS: MobileMenuLink[] = [
  {label: 'GIF', external: true},
  {label: 'Sign out'},
];

export interface MobileMenuPanelProps {
  isOpen: boolean;
  onClose: () => void;
  sections: MobileMenuSection[];
  /** Top-bar action tiles (e.g. Sidekick / Scan / Notes). */
  actionTiles?: MobileMenuActionTile[];
  /** Persistent footer link list. */
  footerLinks?: MobileMenuLink[];
  /** Bottom links in the left section rail. Defaults to GIF and Sign out. */
  utilityLinks?: MobileMenuLink[];
  /** Optional clock label rendered above the action tiles. */
  clockLabel?: string;
  /** Clock status icon rendered with the label. @default 'clocked-in' */
  clockState?: ClockState;
  onClockClick?: () => void;
  /** Initially-active section id. Defaults to `sections[0].id`. */
  defaultSectionId?: string;
  /** Render in-flow for documentation previews instead of as a fixed overlay. */
  isInlinePreview?: boolean;
  /** Render as an absolute overlay inside the nearest positioned ancestor. */
  isContainedOverlay?: boolean;
  className?: string;
}

export const MobileMenuPanel: React.FC<MobileMenuPanelProps> = ({
  isOpen,
  onClose,
  sections,
  actionTiles,
  footerLinks,
  utilityLinks = DEFAULT_UTILITY_LINKS,
  clockLabel,
  clockState = 'clocked-in',
  onClockClick,
  defaultSectionId,
  isInlinePreview = false,
  isContainedOverlay = false,
  className,
}) => {
  const [activeId, setActiveId] = React.useState(
    defaultSectionId ?? sections[0]?.id ?? '',
  );
  const current = sections.find((s) => s.id === activeId) ?? sections[0];

  React.useEffect(() => {
    if (isInlinePreview || isContainedOverlay) return;
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isContainedOverlay, isInlinePreview, isOpen]);

  React.useEffect(() => {
    if (isInlinePreview) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isInlinePreview, isOpen, onClose]);

  if (!current) return null;

  return (
    <>
      {isInlinePreview ? null : (
        <div
          className={cx(
            'ax-mobile-menu-panel__backdrop',
            isOpen && 'ax-mobile-menu-panel__backdrop--open',
            isContainedOverlay && 'ax-mobile-menu-panel__backdrop--contained',
          )}
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={cx(
          'ax-mobile-menu-panel',
          isOpen && 'ax-mobile-menu-panel--open',
          isInlinePreview && 'ax-mobile-menu-panel--inline-preview',
          isContainedOverlay && 'ax-mobile-menu-panel--contained',
          className,
        )}
        aria-label="Main menu"
        aria-hidden={isInlinePreview ? false : !isOpen}
        {...(!isOpen && !isInlinePreview ? {inert: ''} : {})}
      >
        <div className="ax-mobile-menu-panel__top-bar">
          {clockLabel ? (
            <button
              type="button"
              className="ax-mobile-menu-panel__time-clock"
              onClick={onClockClick}
            >
              <span className="ax-mobile-menu-panel__time-clock-icon" aria-hidden>
                {clockState === 'clocked-in' ? <ClockIn /> : <ClockOut />}
              </span>
              <span className="ax-mobile-menu-panel__time-clock-label">
                {clockLabel}
              </span>
            </button>
          ) : null}
          {actionTiles && actionTiles.length ? (
            <div className="ax-mobile-menu-panel__action-tiles">
              {actionTiles.map((tile) => (
                <MegaNavActionButton
                  key={tile.id}
                  icon={tile.icon}
                  label={tile.label}
                  onClick={tile.onClick}
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className="ax-mobile-menu-panel__body">
          <nav
            className="ax-mobile-menu-panel__left-col"
            aria-label="Menu sections"
          >
            <div className="ax-mobile-menu-panel__nav-tiles">
              {sections.map((section) => {
                const isActive = activeId === section.id;
                return (
                  <button
                    key={section.id}
                    type="button"
                    className={cx(
                      'ax-mobile-menu-panel__nav-tile',
                      isActive && 'ax-mobile-menu-panel__nav-tile--active',
                    )}
                    onClick={() => setActiveId(section.id)}
                    aria-pressed={isActive}
                    aria-label={section.title}
                  >
                    <span
                      className={cx(
                        'ax-mobile-menu-panel__nav-tile-icon-box',
                        isActive &&
                          'ax-mobile-menu-panel__nav-tile-icon-box--active',
                      )}
                      aria-hidden
                    >
                      {section.icon}
                    </span>
                    <span className="ax-mobile-menu-panel__nav-tile-label">
                      {section.label.split('\n').map((line, i) => (
                        <span
                          key={`${section.id}-line-${i}`}
                          style={{display: 'block'}}
                        >
                          {line}
                        </span>
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>

            {utilityLinks.length ? (
              <div className="ax-mobile-menu-panel__left-col-footer">
                {utilityLinks.map((link) => (
                  <button
                    key={link.label}
                    type="button"
                    className={cx(
                      'ax-mobile-menu-panel__left-col-link',
                      link.external && 'ax-mobile-menu-panel__left-col-link--external',
                    )}
                    onClick={() => {
                      link.onClick?.();
                      onClose();
                    }}
                  >
                    <span className="ax-mobile-menu-panel__left-col-link-label">
                      {link.label}
                    </span>
                    {link.external ? (
                      <Icon name="LinkExternal" decorative size="small" />
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
          </nav>

          <div className="ax-mobile-menu-panel__right-col">
            <div className="ax-mobile-menu-panel__right-scroll">
              <h2 className="ax-mobile-menu-panel__section-title">
                {current.title}
              </h2>
              <nav aria-label={current.title}>
                {current.links.map((link) => (
                  <button
                    key={link.label}
                    type="button"
                    className={cx(
                      'ax-mobile-menu-panel__link-row',
                      link.external && 'ax-mobile-menu-panel__link-row--external',
                    )}
                    onClick={() => {
                      link.onClick?.();
                      onClose();
                    }}
                  >
                    <span className="ax-mobile-menu-panel__link-row-label">
                      {link.label}
                    </span>
                    {link.external ? (
                      <span className="ax-mobile-menu-panel__link-row-external">
                        <Icon name="LinkExternal" a11yLabel="Opens externally" size="small" />
                      </span>
                    ) : null}
                  </button>
                ))}
              </nav>
            </div>

            {footerLinks && footerLinks.length ? (
              <div className="ax-mobile-menu-panel__persistent-footer">
                {footerLinks.map((link) => (
                  <button
                    key={link.label}
                    type="button"
                    className={cx(
                      'ax-mobile-menu-panel__link-row',
                      link.external && 'ax-mobile-menu-panel__link-row--external',
                    )}
                    onClick={() => {
                      link.onClick?.();
                      onClose();
                    }}
                  >
                    <span className="ax-mobile-menu-panel__link-row-label">
                      {link.label}
                    </span>
                    {link.external ? (
                      <span className="ax-mobile-menu-panel__link-row-external">
                        <Icon name="LinkExternal" a11yLabel="Opens externally" size="small" />
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </aside>
    </>
  );
};

MobileMenuPanel.displayName = 'MobileMenuPanel';

