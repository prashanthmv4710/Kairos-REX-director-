// @refresh reset

/**
 * @module ListAction
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
 * For prop API + usage notes, read `ListAction.md` in this folder
 * or run `npm run ld-kit -- show ListAction`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/ui/ListAction.tsx
 *
 * AX List Action — `List` + `ListItem` for action queues. Each item supports:
 * - eyebrow (boolean) / title / text
 * - optional leading custom slot
 * - trailing icon / link / select-checkbox
 * - up to 3 `Attribute` rows
 * - tag (preset or custom), alert slot, footer-action slot
 * - sidekickAssigned — brands the item with Sidekick styling
 * - insight — renders an IntelligentInsight chip
 * - messaging — renders an Alert
 * - button — renders a full-width action button
 * - optional bottom divider
 *
 * Adaptations:
 * - CSS module → plain `.css` with `ax-list-action-*` BEM classes.
 * - `core/Checkbox` requires `a11yLabelledBy` (or `label`) + `onChange` event,
 *   not `aria-label` + `onCheckedChange`. The trailing checkbox now uses
 *   `label` (visually-hidden via the source's existing layout — the wrapper
 *   prevents the label text from being shown).
 *   Indeterminate is dropped — `core/Checkbox` exposes `indeterminate` as
 *   a separate prop, but the source's `boolean | 'indeterminate'` callback
 *   shape is downgraded to plain `boolean`.
 * - Trailing icon defaults to `core/Icons.ChevronRightIcon`.
 * - `core/LinkButton` is used for the trailing link.
 * - `core/Divider` is decorative by default (no `decorative` prop).
 */
import * as React from 'react';

import {cx} from '../../common/cx';
import {Alert, type AlertVariant} from '../../components/Alert/Alert';
import {Button} from '../../components/Button/Button';
import {Checkbox} from '../../components/Checkbox/Checkbox';
import {Divider} from '../../components/Divider/Divider';
import {ChevronRightIcon} from '../../components/Icons';
import {SidekickLogoIcon} from '../../common/icons';
import {LinkButton} from '../../components/LinkButton/LinkButton';
import {Tag, type TagColor} from '../../components/Tag/Tag';
import {Attribute} from '../../components/Attribute';
import {IntelligentInsight} from '../IntelligentInsight/IntelligentInsight';

import './ListAction.css';

export type ListActionTagPreset = 'unassigned' | 'assigned' | 'complete';

export interface ListActionTagCustom {
  variant: 'primary' | 'secondary' | 'tertiary';
  color?: TagColor;
  label: string;
}

const TAG_PRESET_MAP: Record<
  ListActionTagPreset,
  {label: string; color: TagColor}
> = {
  unassigned: {label: 'Unassigned', color: 'gray'},
  assigned: {label: 'Assigned', color: 'blue'},
  complete: {label: 'Complete', color: 'green'},
};

export type ListActionLeading = 'empty' | 'custom';
export type ListActionTrailing = 'icon' | 'link' | 'select';

export interface ListActionListProps
  extends Omit<React.HTMLAttributes<HTMLUListElement>, 'role'> {
  children: React.ReactNode;
}

export const ListActionList = React.forwardRef<
  HTMLUListElement,
  ListActionListProps
>(({children, className, ...rest}, ref) => (
  <ul
    ref={ref}
    role="list"
    className={cx('ax-list-action', className)}
    {...rest}
  >
    {children}
  </ul>
));
ListActionList.displayName = 'ListActionList';

export interface ListActionItemProps {
  /** Show the eyebrow label above the title. */
  eyebrow?: boolean;
  /** Text for the eyebrow. Only rendered when `eyebrow` is true. */
  eyebrowLabel?: string;
  title: string;
  text?: string;

  /** Brands the item with Sidekick styling when true. */
  sidekickAssigned?: boolean;

  /** @default 'empty' */
  leading?: ListActionLeading;
  leadingContent?: React.ReactNode;

  /** @default 'empty' */
  trailing?: ListActionTrailing;
  /** Falls back to ChevronRightIcon. */
  trailingIcon?: React.ReactNode;
  trailingLink?: {text: string; href?: string; onClick?: () => void};
  trailingChecked?: boolean;
  onTrailingCheckedChange?: (checked: boolean) => void;

  /** Up to 3 Attribute small rows. */
  attributes?: Array<{
    label: string;
    icon?: React.ReactNode;
    /** Appends a secondary label with an arrow separator. */
    additionalLabel?: boolean;
    /** Secondary label text rendered when `additionalLabel` is true. */
    label2?: string;
  }>;

  /** Show the IntelligentInsight chip. */
  insight?: boolean;
  /** Label for the IntelligentInsight chip. @default 'Data-based intelligence to support action.' */
  insightLabel?: string;

  /** Show an Alert message. */
  messaging?: boolean;
  /** Variant for the Alert. @default 'info' */
  messagingVariant?: AlertVariant;
  /** Text content for the Alert. */
  messagingText?: string;

  /** Show a full-width action button. */
  button?: boolean;
  /** Label for the action button. @default 'Action' */
  buttonLabel?: string;
  /** Fires when the action button is clicked. */
  onButtonClick?: React.MouseEventHandler<HTMLButtonElement>;

  /** Renders a Divider at the bottom of the item. */
  divider?: boolean;

  footerAction?: React.ReactNode;
  alert?: React.ReactNode;

  tag?: ListActionTagPreset | ListActionTagCustom;

  className?: string;
}

function renderLeading(props: ListActionItemProps) {
  const {leading = 'empty', leadingContent} = props;
  if (leading === 'custom') {
    return <div className="ax-list-action__item-leading-custom">{leadingContent}</div>;
  }
  return null;
}

function renderTrailing(props: ListActionItemProps, selectA11yLabelledBy: string) {
  const {trailing, trailingIcon, trailingLink} = props;

  switch (trailing) {
    case 'icon':
      return (
        <div className="ax-list-action__item-trailing-icon">
          <span className="ax-list-action__item-trailing-icon-inner">
            {trailingIcon ?? <ChevronRightIcon size="medium" />}
          </span>
        </div>
      );
    case 'link':
      if (!trailingLink) return null;
      return (
        <div className="ax-list-action__item-trailing-link">
          <LinkButton size="small" onClick={trailingLink.onClick}>
            {trailingLink.text}
          </LinkButton>
        </div>
      );
    case 'select':
      return (
        <div className="ax-list-action__item-trailing-select">
          <Checkbox
            checked={!!props.trailingChecked}
            a11yLabelledBy={selectA11yLabelledBy}
            onChange={(e) => props.onTrailingCheckedChange?.(e.target.checked)}
          />
        </div>
      );
    default:
      return null;
  }
}

export const ListActionItem = React.forwardRef<HTMLLIElement, ListActionItemProps>(
  (props, ref) => {
    const titleId = React.useId();

    const {
      eyebrow,
      eyebrowLabel,
      title,
      text,
      sidekickAssigned,
      attributes,
      insight,
      insightLabel = 'Data-based intelligence to support action.',
      messaging,
      messagingVariant = 'info',
      messagingText = 'Alert message',
      button,
      buttonLabel = 'Action',
      onButtonClick,
      divider,
      footerAction,
      alert,
      tag,
      className,
    } = props;

    const hasExtras =
      (attributes && attributes.length > 0) ||
      !!insight ||
      !!messaging ||
      !!button ||
      !!alert ||
      !!footerAction;

    return (
      <li
        ref={ref}
        role="listitem"
        className={cx(
          'ax-list-action__item',
          sidekickAssigned && 'ax-list-action__item--sidekick',
          className,
        )}
      >
        <div className="ax-list-action__item-row">
          {renderLeading(props)}

          <div className="ax-list-action__item-content-wrapper">
            <div className="ax-list-action__item-content">
              <div className="ax-list-action__item-content-text">
                {eyebrow ? (
                  <p className="ax-list-action__item-eyebrow">{eyebrowLabel}</p>
                ) : null}
                {sidekickAssigned ? (
                  <div className="ax-list-action__item-title-sidekick">
                    <span className="ax-list-action__item-sidekick-logo">
                      <SidekickLogoIcon size={16} />
                    </span>
                    <p id={titleId} className="ax-list-action__item-title ax-list-action__item-title--sidekick">{title}</p>
                  </div>
                ) : (
                  <p id={titleId} className="ax-list-action__item-title">{title}</p>
                )}
                {text ? <p className="ax-list-action__item-text">{text}</p> : null}
              </div>
              {tag
                ? (() => {
                    if (typeof tag === 'string') {
                      const {label, color} = TAG_PRESET_MAP[tag];
                      return (
                        <div className="ax-list-action__item-tag">
                          <Tag variant="tertiary" color={color}>
                            {label}
                          </Tag>
                        </div>
                      );
                    }
                    return (
                      <div className="ax-list-action__item-tag">
                        <Tag variant={tag.variant} color={tag.color}>
                          {tag.label}
                        </Tag>
                      </div>
                    );
                  })()
                : null}
            </div>

            {hasExtras ? (
              <div className="ax-list-action__item-extras">
                {attributes && attributes.length > 0 ? (
                  <div className="ax-list-action__item-attributes">
                    {attributes.slice(0, 3).map((attr, i) => (
                      <Attribute
                        key={i}
                        size="small"
                        label={attr.label}
                        icon={attr.icon}
                        additionalLabel={attr.additionalLabel}
                        label2={attr.label2}
                      />
                    ))}
                  </div>
                ) : null}
                {insight ? (
                  <div className="ax-list-action__item-insight">
                    <IntelligentInsight label={insightLabel} />
                  </div>
                ) : null}
                {/* New `messaging` API takes priority; the legacy `alert` ReactNode
                    slot is the fallback so only one alert section ever renders. */}
                {messaging ? (
                  <div className="ax-list-action__item-alert">
                    <Alert variant={messagingVariant}>{messagingText}</Alert>
                  </div>
                ) : alert ? (
                  <div className="ax-list-action__item-alert">{alert}</div>
                ) : null}
                {/* New `button` API takes priority; legacy `footerAction` is the fallback. */}
                {button ? (
                  <div className="ax-list-action__item-footer-action">
                    <Button variant="primary" size="small" isFullWidth onClick={onButtonClick}>
                      {buttonLabel}
                    </Button>
                  </div>
                ) : footerAction ? (
                  <div className="ax-list-action__item-footer-action">{footerAction}</div>
                ) : null}
              </div>
            ) : null}
          </div>

          {renderTrailing(props, titleId)}
        </div>
        {divider ? (
          <div className="ax-list-action__item-divider">
            <Divider />
          </div>
        ) : null}
      </li>
    );
  },
);
ListActionItem.displayName = 'ListActionItem';

export const ListAction = ListActionList;

ListAction.displayName = 'ListAction';
