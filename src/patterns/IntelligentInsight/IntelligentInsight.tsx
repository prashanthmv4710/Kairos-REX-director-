// @refresh reset

/**
 * @module IntelligentInsight
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
 * For prop API + usage notes, read `IntelligentInsight.md` in this folder
 * or run `npm run ld-kit -- show IntelligentInsight`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/ui/IntelligentInsight.tsx
 *
 * AX Intelligent Insight — card-shaped surface that pairs the Sidekick AI
 * brand mark with a short insight label and an optional full-width action
 * button.
 *
 * Changes from the source:
 * - CSS module → plain `.css` with `ax-intelligent-insight-*` BEM classes.
 * - The source imports `SidekickLogoIcon` from `icons-custom/`. That icon
 *   isn't exported from ld-kit (it's private to `agents/SidekickAgent`),
 *   so the same magic-gradient SVG is inlined here.
 * - Uses `core/Button` (variant=secondary, `isFullWidth`).
 * - `UNSAFE_*` dropped in favour of plain `className` / `style`.
 */
import * as React from 'react';

import {cx} from '../../common/cx';
import {Button} from '../../components/Button/Button';
import {Icon} from '../../components/Icons';
import {SidekickLogoIcon} from '../../common/icons';

import './IntelligentInsight.css';

export interface IntelligentInsightProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  /** Eyebrow/insight text shown next to the Sidekick logo. */
  label: string;
  /** Optional recommendation title. When present, the card uses the expanded recommendation layout. */
  title?: string;
  /** Optional body copy shown under the title. */
  description?: string;
  /** Attribute rows shown under the description. */
  attributes?: IntelligentInsightAttribute[];
  /** Show the full-width action button below the label. @default false */
  showButton?: boolean;
  /** Label for the action button. @default 'Button label' */
  buttonLabel?: string;
  /** Fires when the action button is clicked. */
  onButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export type IntelligentInsightAttributeIcon =
  | 'target'
  | 'users'
  | 'calendar'
  | 'clock'
  | 'associate';

export interface IntelligentInsightAttribute {
  /** Kit icon name shortcut or a custom React node. */
  icon?: IntelligentInsightAttributeIcon | React.ReactNode;
  /** Attribute text. Use rich text to bold the leading value when needed. */
  label: React.ReactNode;
}

const ATTRIBUTE_ICON_NAMES: Record<IntelligentInsightAttributeIcon, string> = {
  target: 'Targeting',
  users: 'Users',
  calendar: 'Calendar',
  clock: 'Clock',
  associate: 'Associate',
};

function AttributeIcon({icon}: {icon?: IntelligentInsightAttribute['icon']}) {
  if (!icon) return <Icon name="InfoCircle" size="small" />;
  if (typeof icon === 'string') {
    return <Icon name={ATTRIBUTE_ICON_NAMES[icon as IntelligentInsightAttributeIcon]} size="medium" />;
  }
  return <>{icon}</>;
}

export const IntelligentInsight = React.forwardRef<
  HTMLDivElement,
  IntelligentInsightProps
>(
  (
    {
      label,
      title,
      description,
      attributes,
      showButton = false,
      buttonLabel = 'Button label',
      onButtonClick,
      className,
      ...rest
    },
    ref,
  ) => {
    const expanded = Boolean(title || description || attributes?.length);

    return (
      <div
        ref={ref}
        className={cx(
          'ax-intelligent-insight',
          expanded && 'ax-intelligent-insight--expanded',
          className,
        )}
        {...rest}
      >
        <div className="ax-intelligent-insight__icon-text-row">
          <div className="ax-intelligent-insight__icon-wrapper">
            <SidekickLogoIcon size={expanded ? 24 : 16} />
          </div>
          <p className="ax-intelligent-insight__label">{label}</p>
        </div>

        {title ? <h3 className="ax-intelligent-insight__title">{title}</h3> : null}
        {description ? (
          <p className="ax-intelligent-insight__description">{description}</p>
        ) : null}

        {attributes?.length ? (
          <div className="ax-intelligent-insight__attributes">
            {attributes.slice(0, 4).map((attribute, index) => (
              <div key={index} className="ax-intelligent-insight__attribute-row">
                <span className="ax-intelligent-insight__attribute-icon">
                  <AttributeIcon icon={attribute.icon} />
                </span>
                <span className="ax-intelligent-insight__attribute-label">
                  {attribute.label}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {showButton ? (
          <div className="ax-intelligent-insight__button-container">
            <Button
              variant={expanded ? 'primary' : 'secondary'}
              size={expanded ? 'large' : 'small'}
              isFullWidth
              onClick={onButtonClick}
            >
              {buttonLabel}
            </Button>
          </div>
        ) : null}
      </div>
    );
  },
);

IntelligentInsight.displayName = 'IntelligentInsight';

