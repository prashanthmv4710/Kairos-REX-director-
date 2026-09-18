// @refresh reset

/**
 * @module ListGoal
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
 * For prop API + usage notes, read `ListGoal.md` in this folder
 * or run `npm run ld-kit -- show ListGoal`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/ui/ListGoal.tsx
 *
 * AX List Goal — list item representing a goal with optional progress
 * indicator, content slot, AI insight, and alert.
 *
 * Adaptations:
 * - `<img>` illustration → `PlaceholderMedia` (no external image deps).
 * - `SidekickLogoIcon` is private to `agents/SidekickAgent`; the same magic
 *   gradient is inlined here.
 * - `core/Alert` accepts `actionButtonProps`, not an `action` JSX node, so
 *   the alert action is threaded through that.
 * - `core/IconButton` has `variant="round" | "full"`; the source's
 *   `variant="ghost"` is mapped to `round`.
 */
import * as React from 'react';

import {cx} from '../../common/cx';
import {Alert} from '../../components/Alert/Alert';
import {Divider} from '../../components/Divider/Divider';
import {IconButton} from '../../components/IconButton/IconButton';
import {ChevronRightIcon} from '../../components/Icons';
import {SidekickLogoIcon} from '../../common/icons';
import {PlaceholderMedia} from '../../common/PlaceholderMedia/PlaceholderMedia';
import {ProgressIndicator} from '../../components/ProgressIndicator/ProgressIndicator';
import {Tag, type TagColor} from '../../components/Tag/Tag';
import {IntelligentInsight} from '../IntelligentInsight';

import './ListGoal.css';

export interface ListGoalProps {
  goalName: string;

  /** @default false */
  sidekick?: boolean;

  /** @default true */
  statusTag?: boolean;
  /** @default 'tertiary' */
  tagVariant?: 'primary' | 'secondary' | 'tertiary';
  /** @default 'warning' */
  tagColor?: TagColor;
  /** @default 'In progress' */
  tagLabel?: string;

  /** @default true */
  navigation?: boolean;
  onNavigate?: () => void;

  /** @default true */
  progressBar?: boolean;
  progressTitle?: string;
  /** @default 50 */
  progressValue?: number;
  /** @default 'Label' */
  progressLabel?: string;
  /** @default 'Value label' */
  progressValueLabel?: string;

  /** @default false */
  content?: boolean;
  children?: React.ReactNode;

  /** @default true */
  insight?: boolean;
  insightLabel?: string;

  /** @default false */
  alert?: boolean;
  alertMessage?: string;
  alertAction?: string;
  onAlertAction?: () => void;

  /** @default true */
  divider?: boolean;

  className?: string;
  style?: React.CSSProperties;
}

export const ListGoal = React.forwardRef<HTMLElement, ListGoalProps>(
  (
    {
      goalName,
      sidekick = false,
      statusTag = true,
      tagLabel = 'In progress',
      tagVariant = 'tertiary',
      tagColor = 'warning',
      progressTitle,
      progressBar = true,
      progressValue = 50,
      progressLabel = 'Label',
      progressValueLabel = 'Value label',
      content = false,
      children,
      insight = true,
      insightLabel = 'Data-based intelligence to support action.',
      alert = false,
      alertMessage = 'Alert message',
      alertAction = 'Action button',
      onAlertAction,
      navigation = true,
      onNavigate,
      divider = true,
      className,
      style,
    },
    ref,
  ) => {
    return (
      <article
        ref={ref}
        className={cx('ax-list-goal', className)}
        style={style}
      >
        <div className="ax-list-goal__top-row">
          <PlaceholderMedia className="ax-list-goal__illustration" shape="circle" width={40} height={40} style={{border: 'none'}} />
          <div className="ax-list-goal__content-container">
            <div className="ax-list-goal__name-row">
              {sidekick ? (
                <div className="ax-list-goal__ai-name-wrapper">
                  <div className="ax-list-goal__logo-container">
                    <SidekickLogoIcon size={16} />
                  </div>
                  <span className="ax-list-goal__goal-name ax-list-goal__goal-name--brand">
                    {goalName}
                  </span>
                </div>
              ) : (
                <span className="ax-list-goal__goal-name">{goalName}</span>
              )}

              {statusTag ? (
                <Tag variant={tagVariant} color={tagColor}>
                  {tagLabel}
                </Tag>
              ) : null}
            </div>

            {progressTitle || progressBar ? (
              <div className="ax-list-goal__progress-section">
                {progressTitle ? (
                  <p className="ax-list-goal__progress-title">{progressTitle}</p>
                ) : null}
                {progressBar ? (
                  <ProgressIndicator
                    variant="info"
                    value={progressValue}
                    label={progressLabel}
                    valueLabel={progressValueLabel}
                  />
                ) : null}
              </div>
            ) : null}

            {content && children ? (
              <div className="ax-list-goal__content-slot">{children}</div>
            ) : null}

            {insight && insightLabel ? (
              <div className="ax-list-goal__insight-wrapper">
                <IntelligentInsight label={insightLabel} />
              </div>
            ) : null}

            {alert && alertMessage ? (
              <div className="ax-list-goal__alert-wrapper">
                <Alert
                  variant="warning"
                  actionButtonProps={
                    alertAction
                      ? {children: alertAction, onClick: onAlertAction}
                      : undefined
                  }
                >
                  {alertMessage}
                </Alert>
              </div>
            ) : null}
          </div>

          <div
            className={cx(
              'ax-list-goal__chevron-container',
              !navigation && 'ax-list-goal__chevron-container--hidden',
            )}
          >
            <IconButton
              variant="round"
              size="medium"
              a11yLabel="Navigate to goal"
              onClick={onNavigate}
              tabIndex={navigation ? undefined : -1}
            >
              <ChevronRightIcon size="medium" />
            </IconButton>
          </div>
        </div>

        {divider ? <Divider /> : null}
      </article>
    );
  },
);

ListGoal.displayName = 'ListGoal';

