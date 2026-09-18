// @refresh reset

/**
 * @module MwebFooter
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
 * For prop API + usage notes, read `MwebFooter.md` in this folder
 * or run `npm run ld-kit -- show MwebFooter`.
 */

import * as React from 'react';
import { Button } from '../../components/Button';
import './MwebFooter.css';

const PrivacyIcon = () => (
  <svg width="28" height="12" viewBox="0 0 28 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="ld-wcp-mweb-footer-privacy-icon">
    <g clipPath="url(#clip0_mweb_footer_privacy)">
      <rect width="28" height="12" rx="6" fill="white" />
      <path d="M16 0H28V12H12.5L16 0Z" fill="#002E99" />
      <path d="M23.8525 3.14749C23.6561 2.9511 23.3363 2.95058 23.1394 3.14749L20.9999 5.28692L18.8604 3.14749C18.664 2.9511 18.3442 2.95058 18.1473 3.14749C18.0526 3.24216 18.0027 3.36443 18.0002 3.48957C17.9967 3.62398 18.0456 3.75895 18.1473 3.86063L20.2867 6.00006L18.1473 8.13949C18.0488 8.23799 18 8.36757 18.0009 8.49758C18.0005 8.62612 18.0498 8.75513 18.1473 8.85263C18.3437 9.04903 18.6635 9.04955 18.8604 8.85263L20.9999 6.7132L23.1394 8.85263C23.3357 9.04903 23.6556 9.04955 23.8525 8.85263C24.0494 8.65572 24.0489 8.33588 23.8525 8.13949L21.713 6.00006L23.8525 3.86063C24.0494 3.66372 24.0489 3.34388 23.8525 3.14749Z" fill="white" />
      <path fillRule="evenodd" clipRule="evenodd" d="M11.0622 3.23732C11.272 3.41687 11.2965 3.7325 11.1169 3.9423L7.03881 8.70756C6.94932 8.81214 6.82067 8.87519 6.68318 8.88187C6.5457 8.88855 6.41155 8.83825 6.31234 8.74284L4.15341 6.66647C3.95437 6.47505 3.9482 6.15853 4.13962 5.95949C4.33104 5.76046 4.64756 5.75429 4.8466 5.94571L6.6236 7.65476L10.3572 3.29209C10.5367 3.08229 10.8524 3.05777 11.0622 3.23732Z" fill="#002E99" />
    </g>
    <rect x="0.5" y="0.5" width="27" height="11" rx="5.5" stroke="white" />
    <defs>
      <clipPath id="clip0_mweb_footer_privacy">
        <rect width="28" height="12" rx="6" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const footerLinks = [
  'All Departments',
  'Store Directory',
  'Careers',
  'Our Company',
  'Sell on Walmart.com',
  'Help',
  'Product Recalls',
  'Accessibility',
  'Tax Exempt Program',
  'Get the Walmart App',
  'Safety Data Sheet',
  'Terms of Use',
  'Privacy Notice',
  'California Supply Chain Act',
  'Customer Privacy Center',
  'Notice at Collection',
  'AdChoices',
  'Consumer Health Data Privacy Notices',
  'Brand Shop Directory',
  'Pharmacy',
  'Walmart Business',
  '#IYWYK',
  'Delete Account',
];

interface MwebFooterProps {
  /** When true, renders in-flow for use inside patterns/docs pages */
  contained?: boolean;
  /** Accessible name for the footer nav landmark. Override when multiple footers appear on one page. */
  navigationLabel?: string;
}

export function MwebFooter({ contained = false, navigationLabel = 'Footer navigation' }: MwebFooterProps) {
  return (
    <footer
      className="ld-wcp-mweb-footer-root"
      style={contained ? undefined : { display: 'none' }}
    >
      {/* Feedback Section */}
      <div className="ld-wcp-mweb-footer-feedback">
        <p className="ld-wcp-mweb-footer-feedback-text">
          We'd love to hear what you think!
        </p>
        <Button variant="secondary" size="medium">Give feedback</Button>
      </div>

      {/* Stacked Links */}
      <nav
        aria-label={navigationLabel}
        className="ld-wcp-mweb-footer-nav"
      >
        {footerLinks.map((label) => (
          <a key={label} href="#" className="ld-wcp-mweb-footer-link">
            {label}
          </a>
        ))}

        {/* Privacy Choices with icon */}
        <a
          href="#"
          className="ld-wcp-mweb-footer-privacy-link"
        >
          <PrivacyIcon />
          <span>Your Privacy Choices</span>
        </a>
      </nav>

      <p className="ld-wcp-mweb-footer-copyright">
        &copy;{new Date().getFullYear()} Walmart. All rights reserved.
      </p>
    </footer>
  );
}
MwebFooter.displayName = 'MwebFooter';
