// @refresh reset

/**
 * @module Section
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
 * For prop API + usage notes, read `Section.md` in this folder
 * or run `npm run ld-kit -- show Section`.
 */

/**
 * @source PX
 * @ported-from notes/LD-PX-Starter-Kit - V2/client/components/ui/Section.tsx
 *
 * PX section-shell layout helper. Renders a `<section>` with three
 * possible levels (`primary`, `secondary`, `tertiary`), an optional
 * collapsible header, an optional divider, and an actions slot.
 *
 * Changes from the source:
 * - CSS Modules → plain `.css` with `.px-section*` class prefixes.
 * - The kit's `ChevronDown` SVG and `Divider` are remapped to ld-kit's
 *   `ChevronDownIcon` and `Divider` from `core` (per migration rules:
 *   no new icon files, no kit-local icon copies).
 * - `UNSAFE_className` / `UNSAFE_style` props preserved for parity with
 *   the rest of ld-kit's escape-hatch convention.
 */
import * as React from 'react';

import {cx} from '../../common/cx';
import {Divider} from '../Divider';
import {ChevronDownIcon} from '../Icons';

import './Section.css';

type SectionLevel = 'primary' | 'secondary' | 'tertiary';

export interface SectionProps
  extends Omit<
    React.ComponentPropsWithoutRef<'section'>,
    'className' | 'style' | 'title'
  > {
  /** Optional heading text. */
  title?: string;
  /** Optional subtitle below the title. */
  description?: string | React.ReactNode;
  /** Section content. */
  children: React.ReactNode;
  /** Show a divider between header and content. @default false */
  divider?: boolean;
  /** Optional action buttons rendered in the header row. */
  actions?: React.ReactNode;
  /** Whether the section can be collapsed. @default false */
  collapsible?: boolean;
  /** Initial open state when collapsible. @default true */
  defaultOpen?: boolean;
  /** Escape hatch for additional CSS classes. */
  UNSAFE_className?: string;
  /** Escape hatch for inline styles. */
  UNSAFE_style?: React.CSSProperties;
}

interface SectionBaseProps extends SectionProps {
  level: SectionLevel;
}

const SectionBase = React.forwardRef<HTMLElement, SectionBaseProps>(
  function SectionBase(
    {
      level,
      title,
      description,
      children,
      divider = false,
      actions,
      collapsible = false,
      defaultOpen = true,
      UNSAFE_className,
      UNSAFE_style,
      ...props
    },
    ref,
  ) {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);

    const className = cx(
      'px-section',
      `px-section--${level}`,
      UNSAFE_className,
    );

    const hasHeader = Boolean(title || description || actions);

    return (
      <section
        ref={ref}
        className={className}
        style={UNSAFE_style}
        {...props}
      >
        {hasHeader && (
          <div className="px-section__header">
            <div className="px-section__header-content">
              {title && (
                <div className="px-section__title-row">
                  {collapsible ? (
                    <button
                      type="button"
                      className="px-section__collapse-button"
                      aria-expanded={isOpen}
                      onClick={() => setIsOpen((prev) => !prev)}
                    >
                      <span
                        className={cx(
                          'px-section__title',
                          `px-section__title--${level}`,
                        )}
                      >
                        {title}
                      </span>
                      <ChevronDownIcon
                        size="small"
                        decorative
                        className={cx(
                          'px-section__chevron',
                          !isOpen && 'px-section__chevron--collapsed',
                        )}
                      />
                    </button>
                  ) : (
                    <span
                      className={cx(
                        'px-section__title',
                        `px-section__title--${level}`,
                      )}
                    >
                      {title}
                    </span>
                  )}
                  {actions && (
                    <div className="px-section__actions">{actions}</div>
                  )}
                </div>
              )}
              {description && (
                <div className="px-section__description">{description}</div>
              )}
            </div>
          </div>
        )}

        {divider && hasHeader && <Divider />}

        <div
          className={cx(
            'px-section__body',
            collapsible && !isOpen && 'px-section__body--collapsed',
          )}
        >
          {children}
        </div>
      </section>
    );
  },
);

/** Top-level page section: prominent heading, generous padding, strong elevation. */
export const PrimarySection = React.forwardRef<HTMLElement, SectionProps>(
  function PrimarySection(props, ref) {
    return <SectionBase ref={ref} level="primary" {...props} />;
  },
);

/** Sub-section: medium heading, moderate padding, subtle elevation. */
export const SecondarySection = React.forwardRef<HTMLElement, SectionProps>(
  function SecondarySection(props, ref) {
    return <SectionBase ref={ref} level="secondary" {...props} />;
  },
);

/** Nested grouping: compact heading, minimal padding, flat styling. */
export const TertiarySection = React.forwardRef<HTMLElement, SectionProps>(
  function TertiarySection(props, ref) {
    return <SectionBase ref={ref} level="tertiary" {...props} />;
  },
);

PrimarySection.displayName = 'PrimarySection';
SecondarySection.displayName = 'SecondarySection';
TertiarySection.displayName = 'TertiarySection';
