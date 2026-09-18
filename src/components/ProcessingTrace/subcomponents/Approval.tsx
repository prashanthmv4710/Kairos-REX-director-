'use client';

import * as React from 'react';

import {cx} from '../../../common/cx';
import {Button} from '../../Button/Button';
import {Body, Caption} from '../../Text/Text';
import {Menu, MenuItem} from '../../Menu/Menu';
import {ChevronDownIcon} from '../../Icons/Icons';

import './Approval.css';

export interface ApprovalMenuItem {
  /** Unique key for the item. */
  key: string;
  /** Item label shown in the menu. */
  label: React.ReactNode;
  /** Optional secondary description. */
  description?: React.ReactNode;
  /** Disable the item. @default false */
  disabled?: boolean;
}

const DEFAULT_MENU_ITEMS: ReadonlyArray<ApprovalMenuItem> = [
  {key: 'once', label: 'Allow once'},
  {key: 'always', label: 'Always allow'},
  {key: 'session', label: 'Allow for this session'},
];

export interface ProcessingTraceApprovalProps {
  /** Headline question (e.g. "Allow agent to run the following command?"). */
  title: React.ReactNode;
  /** Optional command / payload shown in a mono pre block. */
  command?: React.ReactNode;
  /** Optional secondary detail rendered between the title and the command. */
  description?: React.ReactNode;
  /** Label for the primary allow button. @default "Allow" */
  allowLabel?: React.ReactNode;
  /** Label for the skip button. @default "Skip" */
  skipLabel?: React.ReactNode;
  /** Fires when the primary "Allow" button is clicked. */
  onAllow?: () => void;
  /** Fires when the "Skip" button is clicked. */
  onSkip?: () => void;
  /**
   * Fires when an item from the split-button menu is selected. Receives the
   * `key` of the chosen `ApprovalMenuItem`.
   */
  onAllowOption?: (key: string) => void;
  /**
   * Items displayed in the split-button overflow menu. When omitted, the
   * defaults (`Allow once`, `Always allow`, `Allow for this session`) are used.
   */
  menuItems?: ReadonlyArray<ApprovalMenuItem>;
  /** Hide the chevron split-button menu trigger. @default false */
  hideAllowMenu?: boolean;
  /** @internal Additional CSS class. */
  UNSAFE_className?: string;
}

/**
 * Approval prompt — a primary "Allow" button paired with a chevron that opens a
 * dropdown of allow-scope options, plus a secondary "Skip" button. Used when
 * the agent needs explicit user consent before running a destructive or
 * elevated action.
 */
export const ProcessingTraceApproval: React.FunctionComponent<
  ProcessingTraceApprovalProps
> = (props) => {
  const {
    title,
    command,
    description,
    allowLabel = 'Allow',
    skipLabel = 'Skip',
    onAllow,
    onSkip,
    onAllowOption,
    menuItems = DEFAULT_MENU_ITEMS,
    hideAllowMenu = false,
    UNSAFE_className,
  } = props;

  const [menuOpen, setMenuOpen] = React.useState(false);
  const chevronRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div className={cx('ld-processingtrace-approval', UNSAFE_className)}>
      <div className="ld-processingtrace-approval-body">
        <Body size="medium" weight="alt">
          {title}
        </Body>
        {description != null ? (
          <Caption color="subtle">{description}</Caption>
        ) : null}
        {command != null ? (
          <pre className="ld-processingtrace-approval-command">{command}</pre>
        ) : null}
      </div>
      <div className="ld-processingtrace-approval-actions">
        <div className="ld-processingtrace-approval-split">
          <Button
            variant="primary"
            size="small"
            onClick={onAllow}
            UNSAFE_className="ld-processingtrace-approval-allow"
          >
            {allowLabel}
          </Button>
          {!hideAllowMenu ? (
            <Menu
              isOpen={menuOpen}
              onOpen={() => setMenuOpen(true)}
              onClose={() => setMenuOpen(false)}
              position="bottomRight"
              triggerRef={chevronRef as React.RefObject<HTMLElement>}
              trigger={
                <Button
                  ref={chevronRef}
                  variant="primary"
                  size="small"
                  aria-label="More allow options"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  UNSAFE_className="ld-processingtrace-approval-chevron"
                >
                  <ChevronDownIcon aria-hidden="true" />
                </Button>
              }
            >
              {menuItems.map((item) => (
                <MenuItem
                  key={item.key}
                  disabled={item.disabled}
                  onClick={() => {
                    onAllowOption?.(item.key);
                    setMenuOpen(false);
                  }}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          ) : null}
        </div>
        <Button variant="secondary" size="small" onClick={onSkip}>
          {skipLabel}
        </Button>
      </div>
    </div>
  );
};

ProcessingTraceApproval.displayName = 'ProcessingTrace.Approval';
