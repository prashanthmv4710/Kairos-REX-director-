// @refresh reset

/**
 * @module ListAssociate
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
 * For prop API + usage notes, read `ListAssociate.md` in this folder
 * or run `npm run ld-kit -- show ListAssociate`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/ui/ListAssociate.tsx
 *
 * AX List Associate — `List` + `ListItem` for associate / scheduling lists.
 * Shares the same skeleton as `ListAction` plus a Monitoring section
 * (label + ProgressIndicator + assigned-goal rows) and an associate-specific
 * set of tag presets.
 */
import * as React from 'react';

import {cx} from '../../common/cx';
import {Alert, type AlertVariant} from '../../components/Alert/Alert';
import {Avatar} from '../../components/Avatar/Avatar';
import {Button} from '../../components/Button/Button';
import {ProgressIndicator, type ProgressIndicatorVariant} from '../../components/ProgressIndicator/ProgressIndicator';
import {Checkbox} from '../../components/Checkbox/Checkbox';
import {Divider} from '../../components/Divider/Divider';
import {ChevronRightIcon} from '../../components/Icons';
import {LinkButton} from '../../components/LinkButton/LinkButton';
import {Tag, type TagColor} from '../../components/Tag/Tag';
import {Attribute} from '../../components/Attribute';
import {IntelligentInsight} from '../IntelligentInsight/IntelligentInsight';

import './ListAssociate.css';

export type ListAssociateTagPreset =
  | 'absent'
  | 'tardy'
  | 'unavailable'
  | 'removed'
  | 'do-not-disturb'
  | 'meal'
  | 'ppto'
  | 'not-scheduled';

export interface ListAssociateTagCustom {
  variant: 'primary' | 'secondary' | 'tertiary';
  color?: TagColor;
  label: string;
}

const TAG_PRESET_MAP: Record<
  ListAssociateTagPreset,
  {label: string; color: TagColor}
> = {
  absent: {label: 'Absent', color: 'red'},
  tardy: {label: 'Tardy', color: 'spark'},
  unavailable: {label: 'Unavailable', color: 'gray'},
  removed: {label: 'Removed', color: 'gray'},
  'do-not-disturb': {label: 'Do not disturb', color: 'spark'},
  meal: {label: 'Meal', color: 'blue'},
  ppto: {label: 'PPTO', color: 'gray'},
  'not-scheduled': {label: 'Not scheduled', color: 'gray'},
};

export type ListAssociateLeading = 'empty' | 'custom';
export type ListAssociateTrailing = 'icon' | 'link' | 'select';

export interface ListAssociateAssignedGoal {
  title?: string;
  /** Individual action labels rendered inline with comma separators. */
  actions?: string[];
}

export interface ListAssociateListProps
  extends Omit<React.HTMLAttributes<HTMLUListElement>, 'role'> {
  children: React.ReactNode;
}

export const ListAssociateList = React.forwardRef<
  HTMLUListElement,
  ListAssociateListProps
>(({children, className, ...rest}, ref) => (
  <ul
    ref={ref}
    role="list"
    className={cx('ax-list-associate', className)}
    {...rest}
  >
    {children}
  </ul>
));
ListAssociateList.displayName = 'ListAssociateList';

export interface ListAssociateItemProps {
  eyebrow?: string;
  title: string;
  text?: string;

  /** Associate name — used for Avatar initials fallback and a11y label. */
  avatarName?: string;
  /** Optional image URL for the Avatar. */
  avatarSrc?: string;

  leading?: ListAssociateLeading;
  leadingContent?: React.ReactNode;

  trailing?: ListAssociateTrailing;
  trailingIcon?: React.ReactNode;
  trailingLink?: {text: string; href?: string; onClick?: () => void};
  trailingChecked?: boolean;
  onTrailingCheckedChange?: (checked: boolean) => void;

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
  alert?: boolean;
  /** Variant for the Alert. @default 'info' */
  alertVariant?: AlertVariant;
  /** Text content for the Alert. */
  alertText?: string;

  /** Show a full-width action button. */
  button?: boolean;
  /** Label for the action button. @default 'Action' */
  buttonLabel?: string;
  /** Fires when the action button is clicked. */
  onButtonClick?: React.MouseEventHandler<HTMLButtonElement>;

  /**
   * Show the Content / Monitoring-Active section — a ProgressIndicator
   * with an optional list of assigned goal rows.
   */
  content?: boolean;
  /** Section heading. @default 'Progress status' */
  contentLabel?: string;
  /** ProgressIndicator variant. @default 'info' */
  contentProgressVariant?: ProgressIndicatorVariant;
  /** Progress value 0–100. @default 0 */
  contentProgressValue?: number;
  /** ProgressIndicator label (required when content is true). */
  contentProgressLabel?: string;
  /** ProgressIndicator value label (required when content is true). */
  contentProgressValueLabel?: string;
  /** Assigned goal rows shown below the ProgressIndicator. */
  contentGoals?: ListAssociateAssignedGoal[];

  divider?: boolean;
  footerAction?: React.ReactNode;

  tag?: ListAssociateTagPreset | ListAssociateTagCustom;
  className?: string;
}

function AssignedGoal({
  title = 'Goal name',
  actions = ['[Action]', '[Action]', '[Action]'],
}: ListAssociateAssignedGoal) {
  return (
    <div className="ax-list-associate__assigned-goal">
      <p className="ax-list-associate__assigned-goal-title">{title}</p>
      <div className="ax-list-associate__assigned-goal-actions">
        {actions.map((action, i) => (
          <span key={i} className="ax-list-associate__assigned-goal-action">
            {action}{i < actions.length - 1 ? ',' : ''}
          </span>
        ))}
      </div>
    </div>
  );
}

function renderLeading(props: ListAssociateItemProps, titleId: string) {
  const {avatarName, avatarSrc, leading = 'empty', leadingContent} = props;

  // Avatar is always rendered by default; fall back to custom slot only when
  // leading='custom' is explicitly set.
  if (leading === 'custom') {
    return (
      <div className="ax-list-associate__item-leading-custom">{leadingContent}</div>
    );
  }

  return (
    <div className="ax-list-associate__item-leading-avatar">
      <Avatar
        a11yLabelledBy={titleId}
        name={avatarName}
        image={avatarSrc ? {src: avatarSrc} : undefined}
        size="medium"
        shape="circular"
      />
    </div>
  );
}

function renderTrailing(props: ListAssociateItemProps, titleId: string) {
  const {trailing, trailingIcon, trailingLink} = props;

  switch (trailing) {
    case 'icon':
      return (
        <div className="ax-list-associate__item-trailing-icon">
          <span className="ax-list-associate__item-trailing-icon-inner">
            {trailingIcon ?? <ChevronRightIcon size="medium" />}
          </span>
        </div>
      );
    case 'link':
      if (!trailingLink) return null;
      return (
        <div className="ax-list-associate__item-trailing-link">
          <LinkButton size="small" onClick={trailingLink.onClick}>
            {trailingLink.text}
          </LinkButton>
        </div>
      );
    case 'select':
      return (
        <div className="ax-list-associate__item-trailing-select">
          <Checkbox
            checked={!!props.trailingChecked}
            a11yLabelledBy={titleId}
            onChange={(e) => props.onTrailingCheckedChange?.(e.target.checked)}
          />
        </div>
      );
    default:
      return null;
  }
}

export const ListAssociateItem = React.forwardRef<
  HTMLLIElement,
  ListAssociateItemProps
>((props, ref) => {
  const titleId = React.useId();

  const {
    eyebrow,
    title,
    text,
    attributes,
    insight,
    insightLabel = 'Data-based intelligence to support action.',
    alert,
    alertVariant = 'info',
    alertText = 'Alert message',
    button,
    buttonLabel = 'Action',
    onButtonClick,
    content,
    contentLabel,
    contentProgressVariant = 'info',
    contentProgressValue = 0,
    contentProgressLabel,
    contentProgressValueLabel = '',
    contentGoals,
    divider,
    footerAction,
    tag,
    className,
  } = props;

  const hasExtras =
    (attributes && attributes.length > 0) ||
    !!insight ||
    !!alert ||
    !!button ||
    !!content ||
    !!footerAction;

  return (
    <li ref={ref} role="listitem" className={cx('ax-list-associate__item', className)}>
      <div className="ax-list-associate__item-row">
        {renderLeading(props, titleId)}

        <div className="ax-list-associate__item-content-wrapper">
          <div className="ax-list-associate__item-content">
            <div className="ax-list-associate__item-content-text">
              {eyebrow ? (
                <p className="ax-list-associate__item-eyebrow">{eyebrow}</p>
              ) : null}
              <p id={titleId} className="ax-list-associate__item-title">{title}</p>
              {text ? <p className="ax-list-associate__item-text">{text}</p> : null}
            </div>
            {tag
              ? (() => {
                  if (typeof tag === 'string') {
                    const {label, color} = TAG_PRESET_MAP[tag];
                    return (
                      <div className="ax-list-associate__item-tag">
                        <Tag variant="tertiary" color={color}>
                          {label}
                        </Tag>
                      </div>
                    );
                  }
                  return (
                    <div className="ax-list-associate__item-tag">
                      <Tag variant={tag.variant} color={tag.color}>
                        {tag.label}
                      </Tag>
                    </div>
                  );
                })()
              : null}
          </div>

          {hasExtras ? (
            <div className="ax-list-associate__item-extras">
              {attributes && attributes.length > 0 ? (
                <div className="ax-list-associate__item-attributes">
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
                <div className="ax-list-associate__item-insight">
                  <IntelligentInsight label={insightLabel} />
                </div>
              ) : null}

              {content ? (
                <div className="ax-list-associate__item-monitoring">
                  {/* Progress title + indicator grouped tightly (gap-8px) */}
                  <div className="ax-list-associate__item-monitoring-progress">
                    <p className="ax-list-associate__item-monitoring-label">
                      {contentLabel}
                    </p>
                    <ProgressIndicator
                      variant={contentProgressVariant}
                      value={contentProgressValue}
                      label={contentProgressLabel ?? contentLabel}
                      valueLabel={contentProgressValueLabel}
                    />
                  </div>
                  {contentGoals && contentGoals.length > 0 ? (
                    <div className="ax-list-associate__assigned-goal-list">
                      {contentGoals.map((goal, i) => (
                        <AssignedGoal key={i} {...goal} />
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {alert ? (
                <div className="ax-list-associate__item-alert">
                  <Alert variant={alertVariant}>{alertText}</Alert>
                </div>
              ) : null}
              {button ? (
                <div className="ax-list-associate__item-footer-action">
                  <Button variant="primary" size="small" isFullWidth onClick={onButtonClick}>
                    {buttonLabel}
                  </Button>
                </div>
              ) : null}
              {footerAction ? (
                <div className="ax-list-associate__item-footer-action">
                  {footerAction}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {renderTrailing(props, titleId)}
      </div>

      {divider ? (
        <div className="ax-list-associate__item-divider">
          <Divider />
        </div>
      ) : null}
    </li>
  );
});
ListAssociateItem.displayName = 'ListAssociateItem';

export const ListAssociate = ListAssociateList;

ListAssociate.displayName = 'ListAssociate';
