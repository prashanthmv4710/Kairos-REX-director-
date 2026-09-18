// @refresh reset

/**
 * @module IntelligentRecommendation
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
 * For prop API + usage notes, read `IntelligentRecommendation.md` in this folder
 * or run `npm run ld-kit -- show IntelligentRecommendation`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/ui/IntelligentRecommendation.tsx
 *
 * AX Intelligent Recommendation — flexible AI recommendation card with
 * eyebrow, title/description, attribute rows, optional content slot,
 * optional error alert, none/single/dual/triple button arrangement, and a
 * collapsible sources section.
 *
 * Changes from the source:
 * - CSS module → plain `.css` with `ax-intelligent-recommendation-*` BEM
 *   classes.
 * - The MagicFill gradient SVG is inlined and uses LD `--ld-semantic-color-text-magic-*`
 *   tokens (matching `agents/SidekickAgent`'s gradient) so it picks up the
 *   theme rather than the source's hardcoded blue/cyan stops.
 * - Alert action threads through `core/Alert.actionButtonProps` (the
 *   source uses an `action` JSX prop that ld-kit's Alert doesn't expose).
 * - Uses `core/Button`, `core/LinkButton`, `core/Divider`, `core/Icons`
 *   chevrons. External-link icon inlined inline (no equivalent in
 *   `core/Icons`).
 * - `UNSAFE_*` dropped in favour of plain `className` / `style`.
 */
import * as React from 'react';

import {cx} from '../../common/cx';
import {useStableId} from '../../common/helpers';
import {Alert} from '../../components/Alert/Alert';
import {Button} from '../../components/Button/Button';
import {Divider} from '../../components/Divider/Divider';
import {ChevronDownIcon, ChevronUpIcon} from '../../components/Icons';
import {LinkButton} from '../../components/LinkButton/LinkButton';

import './IntelligentRecommendation.css';

export interface IntelligentRecommendationAttribute {
  /** 16x16 icon element shown to the left of the label. */
  icon: React.ReactNode;
  /** Attribute label text. */
  label: string;
}

export interface IntelligentRecommendationSourceLink {
  label: string;
  /** If provided, renders as `<a>`; otherwise as a plain link button. */
  href?: string;
  onClick?: () => void;
}

export type IntelligentRecommendationButtonType =
  | 'none'
  | 'single'
  | 'dual'
  | 'triple';

export interface IntelligentRecommendationProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
  /** Bold eyebrow next to the MagicFill icon. @default 'Recommendation' */
  eyebrow?: string;
  /** Show the lighter secondary eyebrow label. @default false */
  showLightEyebrow?: boolean;
  lightEyebrowText?: string;

  /** Recommendation title. Truncated after 2 lines. */
  title: string;
  /** Show the description body text. @default false */
  showDescription?: boolean;
  description?: string;

  /** Up to 4 attribute rows. */
  attributes?: IntelligentRecommendationAttribute[];

  /** Children rendered inside a white surface panel below attributes. */
  children?: React.ReactNode;

  /** Show the error-variant alert below the content slot. @default false */
  showAlert?: boolean;
  alertMessage?: string;
  alertActionLabel?: string;
  onAlertAction?: () => void;

  /** Button arrangement variant. @default 'none' */
  buttonType?: IntelligentRecommendationButtonType;
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  tertiaryLabel?: string;
  onTertiary?: () => void;

  /** Show the collapsible sources section below the buttons. @default false */
  showSources?: boolean;
  sourceDescription?: string;
  sourceLinks?: IntelligentRecommendationSourceLink[];
}

function MagicFillIcon() {
  const gradientId = useStableId();
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="ax-intelligent-recommendation__magic-icon"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--ld-semantic-color-text-magic-start, #0053E2)" />
          <stop offset="50%" stopColor="var(--ld-semantic-color-text-magic-middle, #3D90EC)" />
          <stop offset="100%" stopColor="var(--ld-semantic-color-text-magic-stop, #79CDF6)" />
        </linearGradient>
      </defs>
      <path
        d="M11.146 2.792 12.333 2.333 12.77 1.167C12.792 1.063 12.896 1 13 1c.083 0 .188.063.208.167L13.667 2.333 14.833 2.792C14.937 2.812 15 2.917 15 3c0 .104-.063.208-.167.229L13.667 3.667 13.208 4.854C13.188 4.937 13.083 5 13 5c-.104 0-.208-.063-.229-.146L12.333 3.667 11.146 3.229C11.063 3.208 11 3.104 11 3c0-.083.063-.188.146-.208Z"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M1.283 8.529 1.819 8.309 2.071 8.183h.031L4.874 6.895 6.165 4.099l.126-.251.252-.534C6.606 3.126 6.795 3 6.984 3c.189 0 .378.126.472.314l.252.534.094.251.032.031L8.886 6.895 11.69 8.183l.252.126.535.251A.5.5 0 0 1 13 9c0 .188-.126.377-.315.471l-.535.22-.252.126-2.804 1.288-1.291 2.764v.031l-.126.251-.22.534A.501.501 0 0 1 6.984 15a.501.501 0 0 1-.441-.314l-.252-.534-.126-.251v-.031L4.874 11.106 2.102 9.817H2.071L1.819 9.691l-.535-.22A.502.502 0 0 1 1 9c0-.188.094-.377.283-.471Z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="ax-intelligent-recommendation__source-link-icon"
    >
      <path
        d="M9.5 1.5h5v5M14 2 7.5 8.5M12.5 9v4.5h-10v-10H7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export const IntelligentRecommendation = React.forwardRef<
  HTMLDivElement,
  IntelligentRecommendationProps
>(
  (
    {
      eyebrow = 'Recommendation',
      showLightEyebrow = false,
      lightEyebrowText,
      title,
      showDescription = false,
      description,
      attributes,
      children,
      showAlert = false,
      alertMessage,
      alertActionLabel,
      onAlertAction,
      buttonType = 'none',
      primaryLabel = 'Primary',
      onPrimary,
      secondaryLabel = 'Alternate',
      onSecondary,
      tertiaryLabel = 'Tertiary',
      onTertiary,
      showSources = false,
      sourceDescription,
      sourceLinks,
      className,
      ...rest
    },
    ref,
  ) => {
    const [sourcesExpanded, setSourcesExpanded] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cx('ax-intelligent-recommendation', className)}
        {...rest}
      >
        <div className="ax-intelligent-recommendation__eyebrow-section">
          <div className="ax-intelligent-recommendation__icon-label-row">
            <div className="ax-intelligent-recommendation__icon-wrapper">
              <MagicFillIcon />
            </div>
            <p className="ax-intelligent-recommendation__eyebrow-text">{eyebrow}</p>
            {showLightEyebrow && lightEyebrowText ? (
              <p className="ax-intelligent-recommendation__light-eyebrow">
                {lightEyebrowText}
              </p>
            ) : null}
          </div>

          <div className="ax-intelligent-recommendation__title-desc-section">
            <p className="ax-intelligent-recommendation__title">{title}</p>
            {showDescription && description ? (
              <p className="ax-intelligent-recommendation__description">{description}</p>
            ) : null}
          </div>
        </div>

        {attributes && attributes.length > 0 ? (
          <div className="ax-intelligent-recommendation__attributes">
            {attributes.slice(0, 4).map((attr, idx) => (
              <div
                key={idx}
                className="ax-intelligent-recommendation__attribute-row"
              >
                <div className="ax-intelligent-recommendation__attribute-inner">
                  <div className="ax-intelligent-recommendation__attribute-icon-wrapper">
                    <span className="ax-intelligent-recommendation__attribute-icon">
                      {attr.icon}
                    </span>
                  </div>
                  <p className="ax-intelligent-recommendation__attribute-label">
                    {attr.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {children != null ? (
          <div className="ax-intelligent-recommendation__content-slot">
            {children}
          </div>
        ) : null}

        {showAlert ? (
          <div className="ax-intelligent-recommendation__alert-wrapper">
            <Alert
              variant="error"
              actionButtonProps={
                alertActionLabel
                  ? {children: alertActionLabel, onClick: onAlertAction}
                  : undefined
              }
            >
              {alertMessage}
            </Alert>
          </div>
        ) : null}

        {buttonType === 'single' ? (
          <div className="ax-intelligent-recommendation__button-single">
            <Button
              variant="primary"
              size="medium"
              isFullWidth
              onClick={onPrimary}
            >
              {primaryLabel}
            </Button>
          </div>
        ) : null}

        {buttonType === 'dual' ? (
          <div className="ax-intelligent-recommendation__button-dual-row">
            <Button
              variant="secondary"
              size="medium"
              isFullWidth
              onClick={onSecondary}
            >
              {secondaryLabel}
            </Button>
            <Button
              variant="primary"
              size="medium"
              isFullWidth
              onClick={onPrimary}
            >
              {primaryLabel}
            </Button>
          </div>
        ) : null}

        {buttonType === 'triple' ? (
          <div className="ax-intelligent-recommendation__button-triple-group">
            <div className="ax-intelligent-recommendation__button-triple-row">
              <Button
                variant="secondary"
                size="medium"
                isFullWidth
                onClick={onSecondary}
              >
                {secondaryLabel}
              </Button>
              <Button
                variant="primary"
                size="medium"
                isFullWidth
                onClick={onPrimary}
              >
                {primaryLabel}
              </Button>
            </div>
            <div className="ax-intelligent-recommendation__button-triple-tertiary">
              <LinkButton size="medium" onClick={onTertiary}>
                {tertiaryLabel}
              </LinkButton>
            </div>
          </div>
        ) : null}

        {showSources ? (
          <div className="ax-intelligent-recommendation__sources">
            <Divider />
            <LinkButton
              onClick={() => setSourcesExpanded((prev) => !prev)}
              aria-expanded={sourcesExpanded}
            >
              {sourcesExpanded ? 'Hide sources' : 'Show sources'}
            </LinkButton>

            {sourcesExpanded ? (
              <div className="ax-intelligent-recommendation__sources-content">
                {sourceDescription ? (
                  <p className="ax-intelligent-recommendation__source-description">
                    {sourceDescription}
                  </p>
                ) : null}
                {sourceLinks?.map((link, idx) =>
                  link.href ? (
                    <LinkButton
                      key={idx}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={link.onClick}
                      trailing={<ExternalLinkIcon />}
                    >
                      {link.label}
                    </LinkButton>
                  ) : (
                    <LinkButton
                      key={idx}
                      onClick={link.onClick}
                      trailing={<ExternalLinkIcon />}
                    >
                      {link.label}
                    </LinkButton>
                  ),
                )}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  },
);

IntelligentRecommendation.displayName = 'IntelligentRecommendation';

