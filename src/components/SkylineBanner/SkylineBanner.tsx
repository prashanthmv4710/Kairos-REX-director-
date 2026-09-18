// @refresh reset

/**
 * @module SkylineBanner
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
 * For prop API + usage notes, read `SkylineBanner.md` in this folder
 * or run `npm run ld-kit -- show SkylineBanner`.
 */

import * as React from 'react';
import './SkylineBanner.css';
interface SkylineBannerProps {
  logoSrc?: string;
  logoAlt?: string;
  headline: string;
  subtext: string;
  imageSrc: string;
  imageAlt: string;
}

export function SkylineBanner({
  logoSrc,
  logoAlt,
  headline,
  subtext,
  imageSrc,
  imageAlt,
}: SkylineBannerProps) {
  return (
    <div className="ld-wcp-skyline-banner-root">
      {/* Left column: logo + text */}
      <div className="ld-wcp-skyline-banner-left">
        {logoSrc ? (
          <img
            src={logoSrc}
            alt={logoAlt || ""}
            className="ld-wcp-skyline-banner-logo"
          />
        ) : (
          <div
            aria-hidden="true"
            className="ld-wcp-skyline-banner-logo-placeholder"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
              <path d="M3 16l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
        <div className="ld-wcp-skyline-banner-text-col">
          <span className="ld-wcp-skyline-banner-headline">
            {headline}
          </span>
          <span className="ld-wcp-skyline-banner-subtext">
            {subtext}
          </span>
        </div>
      </div>

      {/* Right column: sponsored label + product image */}
      <div className="ld-wcp-skyline-banner-right">
        <div className="ld-wcp-skyline-banner-sponsored-row">
          <span className="ld-wcp-skyline-banner-sponsored-label">
            Sponsored
          </span>
          <button
            aria-label="Ad info"
            className="ld-wcp-skyline-banner-info-btn"
          >
            {/* Inline circled 'i' info icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="ld-wcp-skyline-banner-info-icon"
            >
              <circle
                cx="8"
                cy="8"
                r="7"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <rect
                x="7.25"
                y="7"
                width="1.5"
                height="5"
                rx="0.75"
                fill="currentColor"
              />
              <rect
                x="7.25"
                y="4.5"
                width="1.5"
                height="1.5"
                rx="0.75"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <img
          src={imageSrc}
          alt={imageAlt}
          className="ld-wcp-skyline-banner-product-image"
        />
      </div>
    </div>
  );
}
SkylineBanner.displayName = 'SkylineBanner';
