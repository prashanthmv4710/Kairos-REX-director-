// @refresh reset

/**
 * @module DataTable
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
 * For prop API + usage notes, read `DataTable.md` in this folder
 * or run `npm run ld-kit -- show DataTable`.
 */

import * as React from 'react';
import {useA11yAnnouncement} from '../A11yAnnouncement';
import {Button} from '../Button';
import type {ButtonButtonProps} from '../Button';
import {Checkbox} from '../Checkbox';
import type {CheckboxA11yProps} from '../Checkbox';
import {FocusTrap} from '../FocusTrap';
import {FormHelperText} from '../Form';
import {LinkButton} from '../LinkButton';
import type {LinkButtonButtonProps} from '../LinkButton';
import {Body, Caption} from '../Text';

import {cx} from '../../common/cx';
import {applyCommonProps, useStableId, invariant, mergeRefs, debounce} from '../../common/helpers';
import type {CommonProps, MergeRefsItem} from '../../common/helpers';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ErrorTextIcon,
  EditIcon,
  SaveIcon,
  SelectedIcon,
} from '../Icons';
import {VisuallyHidden} from '../VisuallyHidden';
import './DataTable.css';

function useOnKeyDown(keys: string[], callback: (event: KeyboardEvent) => void) {
  const savedCallback = React.useRef(callback);
  React.useEffect(() => { savedCallback.current = callback; });

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (keys.includes(e.key)) savedCallback.current(e); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function useDataTableDebouncedWindowResize(
  onResize: (...args: unknown[]) => void
) {
  React.useEffect(() => {
    const listener = debounce(onResize, 250);
    window.addEventListener('resize', listener);
    return () => {
      window.removeEventListener('resize', listener);
      listener.cancel();
    };
  }, [onResize]);
}
// ---------------------------------------------------------------------------
// DataTableBody (inlined sub-component)
// ---------------------------------------------------------------------------

export interface DataTableBodyProps
  extends Omit<React.ComponentPropsWithoutRef<'tbody'>, 'className' | 'style'> {
  /**
   * The content for the data table body.
   */
  children: React.ReactNode;
}

/**
 * Data Table Body
 * *
 */
export const DataTableBody: React.FunctionComponent<DataTableBodyProps> = (
  props
) => {
  const rest = applyCommonProps(props);

  return <tbody {...rest} />;
};

// ---------------------------------------------------------------------------
// DataTableBulkActions (inlined sub-component)
// ---------------------------------------------------------------------------

export type DataTableBulkActionsButtonProps = Omit<
  LinkButtonButtonProps,
  'children' | 'size' | 'variant'
> &
  Partial<Pick<LinkButtonButtonProps, 'children'>>;

export interface DataTableBulkActionsProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  /**
   * The accessibility label for the data table bulk actions.
   *
   * @default "Table actions"
   */
  a11yLabel?: string;
  /**
   * The action content for the data table bulk actions.
   */
  actionContent?: React.ReactNode;
  /**
   * The selected row count for the data table bulk actions.
   *
   * @default 0
   */
  count?: number;
  /**
   * The count label for the data table bulk actions.
   */
  countLabel?: string;
  /**
   * The props to spread to the data table bulk actions' clear selected button.
   */
  onClearSelectedButtonProps?: DataTableBulkActionsButtonProps;
  /**
   * The callback fired when the data table bulk actions requests to clear selected.
   */
  onClearSelected?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  /**
   * The callback fired when the data table bulk actions requests to select all.
   */
  onSelectAll?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  /**
   * The props to spread to the data table bulk actions' select all button.
   */
  selectAllButtonProps?: DataTableBulkActionsButtonProps;
}

/**
 * Data Table Bulk Actions is a set of actions that can be taken on selected Data Table Rows.
 * *
 */
export const DataTableBulkActions: React.FunctionComponent<
  DataTableBulkActionsProps
> = (props) => {
  const {
    a11yLabel = 'Table actions',
    actionContent,
    onClearSelectedButtonProps,
    count = 0,
    countLabel = `${count} ${count === 1 ? 'row' : 'rows'} selected`,
    onClearSelected,
    onSelectAll,
    selectAllButtonProps,
    className,
    ...rest
  } = applyCommonProps(props);

  const {announcePolite} = useA11yAnnouncement();
  const previousCount = React.useRef(count);

  React.useEffect(() => {
    if (previousCount.current !== count) {
      previousCount.current = count;

      announcePolite(countLabel);
    }
  }, [count, announcePolite, countLabel]);

  return (
    <div
      aria-label={a11yLabel}
      className={cx('ld-datatable-datatablebulkactions-dataTableBulkActions', className)}
      role="region"
      {...rest}
    >
      <div className={'ld-datatable-datatablebulkactions-content'}>
        <SelectedIcon className={'ld-datatable-datatablebulkactions-icon'} size={"medium"} />

        <Body
          UNSAFE_className={'ld-datatable-datatablebulkactions-textLabel'}
          weight={"alt"}
        >
          {countLabel}
        </Body>

        <div className={'ld-datatable-datatablebulkactions-selectActionsContainer'}>
          {onSelectAll && (
            <LinkButton
              children="Select all"
              {...selectAllButtonProps}
              onClick={(event) => {
                selectAllButtonProps?.onClick?.(event);

                onSelectAll(event);
              }}
            />
          )}

          <LinkButton
            children="Clear selected"
            {...onClearSelectedButtonProps}
            onClick={(event) => {
              onClearSelectedButtonProps?.onClick?.(event);

              onClearSelected?.(event);
            }}
          />
        </div>
      </div>

      {actionContent && (
        <div className={'ld-datatable-datatablebulkactions-actionContent'}>{actionContent}</div>
      )}
    </div>
  );
};

DataTableBulkActions.displayName = 'DataTableBulkActions';

// ---------------------------------------------------------------------------
// DataTableCell (inlined sub-component)
// ---------------------------------------------------------------------------

export type DataTableCellVariant = 'alphanumeric' | 'numeric';

export interface DataTableCellProps
  extends Omit<
      React.ComponentPropsWithoutRef<'td'>,
      'align' | 'className' | 'style'
    > {
  /**
   * The text label for the cell.
   */
  children: React.ReactNode;
  /**
   * The variant for the DataTableCell
   *
   * @default "alphanumeric"
   */
  variant?: DataTableCellVariant;
}

/**
 * Data Table Cell
 * *
 */
export const DataTableCell: React.FunctionComponent<DataTableCellProps> = (
  props
) => {
  const {
    className,
    variant = 'alphanumeric',
    ...rest
  } = applyCommonProps(props);

  return (
    <td
      className={cx('ld-datatable-datatablecell-dataTableCell', variant === 'alphanumeric' && 'ld-datatable-datatablecell-alphanumeric', variant === 'numeric' && 'ld-datatable-datatablecell-numeric', className)}
      {...rest}
    />
  );
};

DataTableCell.displayName = 'DataTableCell';

// ---------------------------------------------------------------------------
// DataTableCellActions (inlined sub-component)
// ---------------------------------------------------------------------------

export interface DataTableCellActionsProps
  extends Omit<
      React.ComponentPropsWithoutRef<'td'>,
      'align' | 'className' | 'style'
    > {
  /**
   * The content for the data table cell actions.
   */
  children: React.ReactNode;
}

/**
 * Data Table Cell Actions is a container for interactive elements that perform actions on a selected cell.
 * *
 */
export const DataTableCellActions: React.FunctionComponent<
  DataTableCellActionsProps
> = (props) => {
  const {children, className, ...rest} = applyCommonProps(props);

  return (
    <td
      className={cx('ld-datatable-datatablecellactions-dataTableCellActions', className)}
      {...rest}
    >
      <span className={'ld-datatable-datatablecellactions-content'}>{children}</span>
    </td>
  );
};

DataTableCellActions.displayName = 'DataTableCellActions';

// ---------------------------------------------------------------------------
// DataTableCellBulkEditTextArea (inlined sub-component)
// ---------------------------------------------------------------------------

export type DataTableCellBulkEditTextAreaVariant = 'alphanumeric' | 'numeric';

export interface DataTableCellBulkEditTextAreaProps
  extends Omit<React.ComponentPropsWithoutRef<'td'>, 'onChange'> {
  /**
   * The accessible label reference IDs for the data table cell bulk edit text area.
   */
  a11yTextAreaLabelledBy: string;
  /**
   * The helper text displayed when the data table cell bulk edit text area is in the `isEdited` state.
   *
   * @default "Edited"
   */
  editedHelperTextLabel?: string;
  /**
   * The error for the data table cell bulk edit text area.
   */
  error?: React.ReactNode;
  /**
   * If the data table cell bulk edit text area has been edited.
   *
   * @default false
   */
  isEdited?: boolean;
  /**
   * The callback fired when the data table cell bulk edit text area requests to change.
   */
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /**
   * The props spread to the data table cell bulk edit text area's text area.
   */
  textAreaProps?: React.ComponentPropsWithRef<'textarea'>;
  /**
   * The value for the data table cell bulk edit text area.
   *
   * @default ""
   */
  value?: string;
  /**
   * The variant for the data table cell bulk edit text area.
   *
   * @default "alphanumeric"
   */
  variant?: DataTableCellBulkEditTextAreaVariant;
}

/**
 * Data Table Cell Bulk Edit Text Area is a cell with a value that can be edited.
 * *
 */
export const DataTableCellBulkEditTextArea = React.forwardRef<
  HTMLTextAreaElement,
  DataTableCellBulkEditTextAreaProps
>((props, ref) => {
  const {
    a11yTextAreaLabelledBy,
    className,
    editedHelperTextLabel = 'Edited',
    error,
    isEdited = false,
    onChange,
    textAreaProps,
    value = '',
    variant = 'alphanumeric',
    ...rest
  } = applyCommonProps(props);

  invariant(
    !!a11yTextAreaLabelledBy,
    '`DataTableCellBulkEditTextArea` accessibility violation. `DataTableCellBulkEditTextArea` requires an `a11yTextAreaLabelledBy`.'
  );

  return (
    <td
      className={cx('ld-datatable-datatablecellbulkedittextarea-cell', error && 'ld-datatable-datatablecellbulkedittextarea-hasError', isEdited && 'ld-datatable-datatablecellbulkedittextarea-isEdited', variant === 'alphanumeric' && 'ld-datatable-datatablecellbulkedittextarea-alphanumeric', variant === 'numeric' && 'ld-datatable-datatablecellbulkedittextarea-numeric', className)}
      {...rest}
    >
      <DataTableCellBulkEditTextAreaTextArea
        a11yTextAreaLabelledBy={a11yTextAreaLabelledBy}
        error={error}
        isEdited={isEdited}
        editedHelperTextLabel={editedHelperTextLabel}
        onChange={onChange}
        ref={ref}
        textAreaProps={textAreaProps}
        value={value}
      />
    </td>
  );
});

DataTableCellBulkEditTextArea.displayName = 'DataTableCellBulkEditTextArea';

// ---------------------------------------------------------------------------
// DataTableCellBulkEditTextAreaHelperText (inlined sub-component)
// ---------------------------------------------------------------------------

export type DataTableCellBulkEditTextAreaHelperTextVariant = 'edited' | 'error';
export interface DataTableCellBulkEditTextAreaHelperTextProps {
  /**
   * The content for the data table cell bulk edit text area helper text.
   */
  children: React.ReactNode;
  /**
   * The id for the data table cell bulk edit text area helper text.
   */
  id: string;
  /**
   * The variant for the data table cell bulk edit text area helper text.
   */
  variant: DataTableCellBulkEditTextAreaHelperTextVariant;
}

/**
 * @private
 */
export const DataTableCellBulkEditTextAreaHelperText: React.FunctionComponent<
  DataTableCellBulkEditTextAreaHelperTextProps
> = (props) => {
  const {children, variant, ...rest} = props;

  return (
    <Caption
      UNSAFE_className={cx('ld-datatable-datatablecellbulkedittextareahelpertext-helperText', variant === 'edited' && 'ld-datatable-datatablecellbulkedittextareahelpertext-isEdited', variant === 'error' && 'ld-datatable-datatablecellbulkedittextareahelpertext-hasError')}
      {...rest}
    >
      {variant === 'error' && (
        <>
          <VisuallyHidden>Error: </VisuallyHidden>
          <ErrorTextIcon
            className={'ld-datatable-datatablecellbulkedittextareahelpertext-icon'}
            size={"small"}
          />
        </>
      )}
      {children}
    </Caption>
  );
};

// ---------------------------------------------------------------------------
// DataTableCellBulkEditTextAreaTextArea (inlined sub-component)
// ---------------------------------------------------------------------------

export interface DataTableCellBulkEditTextAreaTextAreaProps
  extends Omit<React.ComponentPropsWithRef<'div'>, 'onChange'> {
  /**
   * The accessible label reference IDs for the data table cell bulk edit text area's text area.
   */
  a11yTextAreaLabelledBy: string;
  /**
   * The helper text displayed when the data table cell bulk edit text area is in the `isEdited` state.
   */
  editedHelperTextLabel: string;
  /**
   * The error for the data table cell bulk edit text area text area.
   */
  error?: React.ReactNode;
  /**
   * If the data table cell bulk edit text area has been edited.
   */
  isEdited: boolean;
  /**
   * The callback fired when the data table cell bulk edit text area text area requests to change.
   */
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /**
   * The props spread to the data table cell bulk edit text area text area's textarea element.
   */
  textAreaProps?: React.ComponentPropsWithoutRef<'textarea'>;
  /**
   * The value for the data table cell bulk edit text area text area.
   */
  value: string;
}

/**
 * A `textarea` that expands with its contents.
 *
 * {@link https://css-tricks.com/auto-growing-inputs-textareas/#comment-1755308}
 *
 * @private
 */
export const DataTableCellBulkEditTextAreaTextArea = React.forwardRef<
  HTMLTextAreaElement,
  DataTableCellBulkEditTextAreaTextAreaProps
>((props, ref) => {
  const {
    a11yTextAreaLabelledBy,
    className,
    editedHelperTextLabel,
    error,
    isEdited,
    onChange,
    textAreaProps,
    value,
    ...rest
  } = props;

  const helperTextId = useStableId();
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const {setTextAreaHeights} =
    useDataTableCellBulkEditTextAreaLayout(textAreaRef);

  return (
    <div
      className={cx('ld-datatable-datatablecellbulkedittextareatextarea-container', (error || isEdited) && 'ld-datatable-datatablecellbulkedittextareatextarea-hasHelperText', className)}
      {...rest}
    >
      <textarea
        aria-describedby={error ? helperTextId : undefined}
        aria-labelledby={`${
          isEdited ? `${helperTextId} ` : ''
        }${a11yTextAreaLabelledBy}`}
        onChange={(event) => {
          onChange(event);
          setTextAreaHeights();
        }}
        rows={1}
        value={value}
        {...textAreaProps}
        className={cx('ld-datatable-datatablecellbulkedittextareatextarea-textarea', textAreaProps?.className)}
        ref={mergeRefs(ref, textAreaRef)}
      />
      {(error || isEdited) && (
        <DataTableCellBulkEditTextAreaHelperText
          aria-hidden={isEdited && !error}
          id={helperTextId}
          variant={error ? 'error' : 'edited'}
        >
          {error || editedHelperTextLabel}
        </DataTableCellBulkEditTextAreaHelperText>
      )}
    </div>
  );
});

// ---------------------------------------------------------------------------
// DataTableCellInlineEditTextArea (inlined sub-component)
// ---------------------------------------------------------------------------

export type DataTableCellInlineEditTextAreaVariant = 'alphanumeric' | 'numeric';

export interface DataTableCellInlineEditTextAreaProps
  extends Omit<React.ComponentPropsWithoutRef<'td'>, 'onChange'> {
  /**
   * The accessibility label for the data table cell inline edit text area's dialog.
   */
  a11yDialogLabel: string;
  /**
   * The accessibility label for the data table cell inline edit text area is editable and not saved.
   *
   * @default ", Edit Cell"
   */
  a11yEditableLabel?: string;
  /**
   * The accessibility label for the data table cell inline edit text area is saved.
   *
   * @default "Save Successful, "
   */
  a11ySavedLabel?: string;
  /**
   * The accessibility label for the data table cell inline edit text area's text area.
   */
  a11yTextAreaLabel: string;
  /**
   * The props spread to the data table cell inline edit text area's cancel button.
   */
  cancelButtonProps?: Omit<LinkButtonButtonProps, 'size'>;
  /**
   * The error for the data table cell inline edit text area's text area.
   */
  error?: React.ReactNode;
  /**
   * If the data table cell inline edit text area is open.
   *
   * @default false
   */
  isOpen?: boolean;
  /**
   * If the data table cell inline edit text area is saved.
   *
   * @default false
   */
  isSaved?: boolean;
  /**
   * The callback fired when the data table cell inline edit text area requests to cancel.
   */
  onCancel: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | KeyboardEvent
  ) => void;
  /**
   * The callback fired when the data table cell inline edit text area requests to change.
   */
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /**
   * The callback fired when the data table cell inline edit text area requests to open.
   */
  onOpen: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  /**
   * The callback fired when the data table cell inline edit text area requests to save.
   */
  onSave: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  /**
   * The props spread to the data table cell inline edit text area's save button.
   */
  saveButtonProps?: Omit<ButtonButtonProps, 'size' | 'variant'>;
  /**
   * The props spread to the data table cell inline edit text area's text area.
   */
  textAreaProps?: React.ComponentPropsWithRef<'textarea'>;
  /**
   * The props spread to the data table cell inline edit text area's trigger button.
   */
  triggerButtonProps?: React.ComponentPropsWithoutRef<'button'>;
  /**
   * The value for the data table cell inline edit text area's text area.
   */
  value: string;
  /**
   * The variant for the data table cell inlne edit text area.
   *
   * @default "alphanumeric"
   */
  variant?: DataTableCellInlineEditTextAreaVariant;
}

/**
 * Data Table Cell Inline Edit Text Area is a cell with a value that can be edited in a dialog.
 * *
 */
export const DataTableCellInlineEditTextArea: React.FunctionComponent<
  DataTableCellInlineEditTextAreaProps
> = (props) => {
  const {
    a11yDialogLabel,
    a11yEditableLabel = ', Edit Cell',
    a11ySavedLabel = 'Save Successful, ',
    a11yTextAreaLabel,
    cancelButtonProps,
    className,
    error,
    isOpen = false,
    isSaved = false,
    onCancel,
    onChange,
    onOpen,
    onSave,
    saveButtonProps,
    textAreaProps,
    triggerButtonProps,
    value,
    variant = 'alphanumeric',
    ...rest
  } = applyCommonProps(props);

  return (
    <td
      className={cx('ld-datatable-datatablecellinlineedittextarea-cell', error && 'ld-datatable-datatablecellinlineedittextarea-hasError', variant === 'alphanumeric' && 'ld-datatable-datatablecellinlineedittextarea-alphanumeric', variant === 'numeric' && 'ld-datatable-datatablecellinlineedittextarea-numeric', className)}
      {...rest}
    >
      <button
        type="button"
        {...triggerButtonProps}
        className={cx('ld-datatable-datatablecellinlineedittextarea-container', triggerButtonProps?.className)}
        disabled={isOpen}
        onClick={(event) => {
          triggerButtonProps?.onClick?.(event);

          onOpen(event);
        }}
      >
        <span className={'ld-datatable-datatablecellinlineedittextarea-containerContent'}>
          {isSaved && <VisuallyHidden>{a11ySavedLabel}</VisuallyHidden>}

          <span className={'ld-datatable-datatablecellinlineedittextarea-textLabel'}>{value}</span>

          {!isSaved && <VisuallyHidden>{a11yEditableLabel}</VisuallyHidden>}

          <span className={'ld-datatable-datatablecellinlineedittextarea-indicator'}>
            {isSaved && (
              <SaveIcon
                className={'ld-datatable-datatablecellinlineedittextarea-indicatorSaveIcon'}
                size={"small"}
              />
            )}

            <EditIcon
              className={'ld-datatable-datatablecellinlineedittextarea-indicatorEditIcon'}
              size={"small"}
            />
          </span>
        </span>

        {error && (
          <span className={'ld-datatable-datatablecellinlineedittextarea-helperText'}>
            <VisuallyHidden>Error: </VisuallyHidden>
            <ErrorTextIcon
              className={'ld-datatable-datatablecellinlineedittextarea-helperTextIcon'}
              size={"small"}
            />

            {error}
          </span>
        )}
      </button>

      {isOpen && (
        <DataTableCellInlineEditTextAreaDialog
          a11yLabel={a11yDialogLabel}
          cancelButtonProps={cancelButtonProps}
          onCancel={onCancel}
          onSave={onSave}
          saveButtonProps={saveButtonProps}
        >
          <DataTableCellInlineEditTextAreaDialogTextArea
            a11yTextAreaLabel={a11yTextAreaLabel}
            error={error}
            onChange={onChange}
            textAreaProps={textAreaProps}
            value={value}
            variant={variant}
          />
        </DataTableCellInlineEditTextAreaDialog>
      )}
    </td>
  );
};

DataTableCellInlineEditTextArea.displayName = 'DataTableCellInlineEditTextArea';

// ---------------------------------------------------------------------------
// DataTableCellInlineEditTextAreaDialog (inlined sub-component)
// ---------------------------------------------------------------------------

export interface DataTableCellInlineEditTextAreaDialogProps
  extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * The accessibility label for the data table cell inlne edit text area dialog.
   */
  a11yLabel: string;
  /**
   * The props spread to the data table cell inline edit text area dialog's cancel button.
   */
  cancelButtonProps?: Omit<LinkButtonButtonProps, 'size'>;
  /**
   * The content for the data table cell inline edit text area dialog.
   */
  children: React.ReactNode;
  /**
   * The callback fired when the data table cell inline edit text area dialog requests to cancel.
   */
  onCancel: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | KeyboardEvent
  ) => void;
  /**
   * The callback fired when the data table cell inline edit text area dialog requests to save.
   */
  onSave: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  /**
   * The props spread to the data table cell inline edit text area dialog's save button.
   */
  saveButtonProps?: Omit<ButtonButtonProps, 'size' | 'variant'>;
}

/**
 * @private
 */
export const DataTableCellInlineEditTextAreaDialog: React.FunctionComponent<
  DataTableCellInlineEditTextAreaDialogProps
> = (props) => {
  const {
    a11yLabel,
    cancelButtonProps,
    children,
    className,
    onCancel,
    onChange,
    onSave,
    saveButtonProps,
    ...rest
  } = props;

  useOnKeyDown(['Escape'], onCancel);

  return (
    <FocusTrap>
      <div
        aria-label={a11yLabel}
        className={cx('ld-datatable-datatablecellinlineedittextareadialog-dialog', className)}
        role="dialog"
        {...rest}
      >
        {children}

        <div className={'ld-datatable-datatablecellinlineedittextareadialog-actionContent'}>
          <LinkButton
            children="Cancel"
            {...cancelButtonProps}
            onClick={(event) => {
              cancelButtonProps?.onClick?.(event);

              onCancel(event);
            }}
            size={
              "small"
            }
          />

          <Button
            children="Save"
            {...saveButtonProps}
            onClick={(event) => {
              saveButtonProps?.onClick?.(event);

              onSave(event);
            }}
            size={
              "small"
            }
            variant={
              "primary"
            }
          />
        </div>
      </div>
    </FocusTrap>
  );
};

// ---------------------------------------------------------------------------
// DataTableCellInlineEditTextAreaDialogTextArea (inlined sub-component)
// ---------------------------------------------------------------------------

export type DataTableCellInlineEditTextAreaDialogTextAreaVariant =
  | 'alphanumeric'
  | 'numeric';

export interface DataTableCellInlineEditTextAreaDialogTextAreaProps
  extends Omit<React.ComponentPropsWithRef<'div'>, 'onChange'> {
  /**
   * The accessibility label for the data table cell inline edit text area dialog text area's text area.
   */
  a11yTextAreaLabel: string;
  /**
   * The error for the data table cell inline edit text area dialog text area.
   */
  error?: React.ReactNode;
  /**
   * The callback fired when the data table cell inline edit text area dialog text area requests to change.
   */
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /**
   * The props spread to the data table cell inline edit text area dialog text area's textarea element.
   */
  textAreaProps?: React.ComponentPropsWithoutRef<'textarea'>;
  /**
   * The value for the data table cell inline edit text area dialog text area.
   */
  value: string;
  /**
   * The variant for the data table cell inline edit text area dialog text area.
   *
   * @default "alphanumeric"
   */
  variant?: DataTableCellInlineEditTextAreaDialogTextAreaVariant;
}

/**
 * A `textarea` that expands with its contents.
 *
 * {@link https://css-tricks.com/auto-growing-inputs-textareas/#comment-1755308}
 *
 * @private
 */
export const DataTableCellInlineEditTextAreaDialogTextArea = React.forwardRef<
  HTMLTextAreaElement,
  DataTableCellInlineEditTextAreaDialogTextAreaProps
>((props, ref) => {
  const {
    a11yTextAreaLabel,
    className,
    error,
    onChange,
    textAreaProps,
    value,
    variant = 'alphanumeric',
    ...rest
  } = props;

  const helperTextId = useStableId();
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const [height, setHeight] = React.useState(textAreaRef.current?.scrollHeight);

  React.useEffect(() => {
    setHeight(textAreaRef.current?.scrollHeight);
  }, [setHeight, textAreaRef, value]);

  return (
    <div
      className={cx('ld-datatable-datatablecellinlineedittextareadialogtextarea-container', error && 'ld-datatable-datatablecellinlineedittextareadialogtextarea-hasError', variant === 'alphanumeric' && 'ld-datatable-datatablecellinlineedittextareadialogtextarea-alphanumeric', variant === 'numeric' && 'ld-datatable-datatablecellinlineedittextareadialogtextarea-numeric', className)}
      {...rest}
    >
      <textarea
        aria-describedby={error ? helperTextId : undefined}
        aria-label={a11yTextAreaLabel}
        onChange={onChange}
        rows={1}
        value={value}
        {...textAreaProps}
        className={cx('ld-datatable-datatablecellinlineedittextareadialogtextarea-textarea', textAreaProps?.className)}
        ref={mergeRefs(ref, textAreaRef)}
        style={{
          ...textAreaProps?.style,
          height,
        }}
      />

      {error && (
        <FormHelperText
          UNSAFE_className={'ld-datatable-datatablecellinlineedittextareadialogtextarea-helperText'}
          hasError
          id={helperTextId}
        >
          {error}
        </FormHelperText>
      )}
    </div>
  );
});

// ---------------------------------------------------------------------------
// DataTableCellSelect (inlined sub-component)
// ---------------------------------------------------------------------------

export interface DataTableCellSelectProps
  extends Omit<
      React.ComponentPropsWithoutRef<'td'>,
      'className' | 'onChange' | 'style'
    > {
  /**
   * The accessibility label reference IDs for the data table cell select.
   */
  a11yLabelledBy: string;
  /**
   * The props spread to the data table cell select's input element.
   *
   * @default {}
   */
  checkboxProps?: CheckboxA11yProps['checkboxProps'];
  /**
   * If the data table cell select is checked.
   *
   * @default false
   */
  checked?: CheckboxA11yProps['checked'];
  /**
   * If the data table cell select is disabled.
   *
   * @default false
   */
  disabled?: CheckboxA11yProps['disabled'];
  /**
   * The name for the data table cell select.
   */
  name?: CheckboxA11yProps['name'];
  /**
   * The callback fired when the data table cell select requests to change.
   */
  onChange: CheckboxA11yProps['onChange'];
  /**
   * The value for the data table cell select.
   */
  value?: CheckboxA11yProps['value'];
}

/**
 * Data Table Cell Select contains a checkbox to select/deselect the containing row.
 * *
 */
export const DataTableCellSelect = React.forwardRef<
  HTMLInputElement,
  DataTableCellSelectProps
>((props, ref) => {
  const {
    a11yLabelledBy,
    checkboxProps = {},
    checked = false,
    className,
    disabled = false,
    name,
    onChange,
    value,
    ...rest
  } = applyCommonProps(props);

  invariant(
    !!a11yLabelledBy,
    '`DataTableCellSelect` accessibility violation. `DataTableCellSelect` requires an `a11yLabelledBy`.'
  );

  return (
    <td className={cx('ld-datatable-datatablecellselect-cellSelect', className)} {...rest}>
      <Checkbox
        a11yLabelledBy={a11yLabelledBy}
        checkboxProps={checkboxProps}
        checked={checked}
        disabled={disabled}
        name={name}
        onChange={onChange}
        value={value}
        ref={ref}
      />
    </td>
  );
});

DataTableCellSelect.displayName = 'DataTableCellSelect';

// ---------------------------------------------------------------------------
// DataTableCellStatus (inlined sub-component)
// ---------------------------------------------------------------------------

export interface DataTableCellStatusProps
  extends Omit<
      React.ComponentPropsWithoutRef<'td'>,
      'align' | 'className' | 'style'
    > {
  /**
   * The tag(s) for the cell.
   */
  children: React.ReactNode;
}

/**
 * Data Table Cell Status displays a Tag with status information for the containing row.
 * *
 */
export const DataTableCellStatus: React.FunctionComponent<
  DataTableCellStatusProps
> = (props) => {
  const {className, ...rest} = applyCommonProps(props);

  return (
    <td
      className={cx('ld-datatable-datatablecellstatus-dataTableCellStatus', className)}
      {...rest}
    />
  );
};

DataTableCellStatus.displayName = 'DataTableCellStatus';

// ---------------------------------------------------------------------------
// DataTableHead (inlined sub-component)
// ---------------------------------------------------------------------------

export interface DataTableHeadProps
  extends Omit<React.ComponentPropsWithoutRef<'tbody'>, 'className' | 'style'> {
  /**
   * The content for the head.
   */
  children: React.ReactNode;
}

/**
 * Data Table Head is the container for a row of Data Table Headers.
 * *
 */
export const DataTableHead: React.FunctionComponent<DataTableHeadProps> = (
  props
) => {
  const appliedProps = applyCommonProps(props);

  const ref = React.useRef<HTMLTableSectionElement>(null);

  return (
    <DataTableHeadLayoutProvider headRef={ref}>
      <thead ref={ref} {...appliedProps} />
    </DataTableHeadLayoutProvider>
  );
};

// ---------------------------------------------------------------------------
// DataTableHeader (inlined sub-component)
// ---------------------------------------------------------------------------

export type DataTableHeaderAlignment = 'left' | 'right';

export type DataTableHeaderSort = 'ascending' | 'descending' | 'none';

export interface DataTableHeaderProps
  extends Omit<
      React.ComponentPropsWithoutRef<'th'>,
      'align' | 'className' | 'style'
    > {
  /**
   * The text alignment of the header's text label.
   *
   * @default "left"
   */
  alignment?: DataTableHeaderAlignment;
  /**
   * The text label for the header.
   */
  children: string;
  /**
   * The callback fired when the header requests to sort.
   */
  onSort?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  /**
   * The sort order for the header's column.
   *
   * @default "none"
   */
  sort?: DataTableHeaderSort;
  /**
   * The accessible announcement triggered on sort for the data table header.
   *
   * @default `Sorted ${props.children} by ${props.sort}.`
   */
  sortChangeA11yAnnouncement?: string;
  /**
   * The width of the column.
   */
  width?: number | string;
}

/**
 * Data Table Cell Header
 * *
 */
export const DataTableHeader = (
  props: DataTableHeaderProps
): React.ReactElement | null => {
  const {
    alignment = 'left',
    children,
    className,
    onSort,
    sort = 'none',
    sortChangeA11yAnnouncement,
    ...rest
  } = applyCommonProps(props);

  const {announcePolite} = useA11yAnnouncement();
  const previousSort = React.useRef(sort);

  React.useEffect(() => {
    if (previousSort.current !== sort) {
      previousSort.current = sort;

      announcePolite(
        sortChangeA11yAnnouncement ?? `Sorted ${children} by ${sort}.`
      );
    }
  }, [children, sort, sortChangeA11yAnnouncement, announcePolite]);

  return (
    <th
      className={cx('ld-datatable-datatableheader-tableHeader', alignment === 'left' && 'ld-datatable-datatableheader-left', alignment === 'right' && 'ld-datatable-datatableheader-right', className)}
      scope="col"
      {...(onSort && {'aria-sort': sort})}
      {...rest}
    >
      {onSort ? (
        <DataTableHeaderButton
          alignment={alignment}
          className={cx('ld-datatable-datatableheader-dataTableHeader')}
          onClick={onSort}
          sort={sort}
        >
          {children}
        </DataTableHeaderButton>
      ) : (
        <span className={'ld-datatable-datatableheader-dataTableHeader'}>{children}</span>
      )}
    </th>
  );
};

// ---------------------------------------------------------------------------
// DataTableHeaderButton (inlined sub-component)
// ---------------------------------------------------------------------------

export type DataTableHeaderButtonAlignment = 'left' | 'right';

export type DataTableHeaderButtonSort = 'ascending' | 'descending' | 'none';

export interface DataTableHeaderButtonProps
  extends React.ComponentPropsWithoutRef<'button'> {
  /**
   * The text alignment of the header's text label.
   */
  alignment: DataTableHeaderButtonAlignment;
  /**
   * The text label for the data table header button.
   */
  children: React.ReactNode;
  /**
   * The sort order for the header's column.
   */
  sort: DataTableHeaderButtonSort;
}

/**
 * @private
 */
export const DataTableHeaderButton = React.forwardRef<
  HTMLButtonElement,
  DataTableHeaderButtonProps
>((props, ref) => {
  const {alignment, children, className, sort, ...rest} = props;

  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const icon =
    sort === 'descending' ? (
      <ArrowDownIcon size={"small"} className={'ld-datatable-datatableheaderbutton-icon'} />
    ) : (
      <ArrowUpIcon size={"small"} className={'ld-datatable-datatableheaderbutton-icon'} />
    );

  useDataTableHeadLayout(buttonRef);

  return (
    <button
      className={cx('ld-datatable-datatableheaderbutton-button', alignment === 'left' && 'ld-datatable-datatableheaderbutton-left', alignment === 'right' && 'ld-datatable-datatableheaderbutton-right', (sort === 'ascending' || sort === 'descending') && 'ld-datatable-datatableheaderbutton-sorted', className)}
      ref={mergeRefs(ref, buttonRef)}
      type="button"
      {...rest}
    >
      {alignment === 'right' && icon}

      {children}

      {alignment === 'left' && icon}
    </button>
  );
});

// ---------------------------------------------------------------------------
// DataTableHeaderSelect (inlined sub-component)
// ---------------------------------------------------------------------------

export interface DataTableHeaderSelectProps
  extends Omit<
      React.ComponentPropsWithoutRef<'td'>,
      'className' | 'onChange' | 'style'
    > {
  /**
   * The accessibility label for the data table header select.
   *
   * @default "Toggle all rows"
   */
  a11yCheckboxLabel?: string;
  /**
   * The props spread to the data table header select's input element.
   *
   * @default {}
   */
  checkboxProps?: CheckboxA11yProps['checkboxProps'];
  /**
   * If the data table header select is checked.
   *
   * @default false
   */
  checked?: CheckboxA11yProps['checked'];
  /**
   * If the data table header select is disabled.
   *
   * @default false
   */
  disabled?: CheckboxA11yProps['disabled'];
  /**
   * If the data table header select is indeterminate.
   *
   * @default false
   */
  indeterminate?: CheckboxA11yProps['indeterminate'];
  /**
   * The name for the data table header select.
   */
  name?: CheckboxA11yProps['name'];
  /**
   * The callback fired when the data table header select requests to change.
   */
  onChange: CheckboxA11yProps['onChange'];
  /**
   * The value for the data table header select.
   */
  value?: CheckboxA11yProps['value'];
}

/**
 * Data Table Header Select contains a checkbox to select/deselect Data Table Rows in bulk.
 * *
 */
export const DataTableHeaderSelect = React.forwardRef<
  HTMLInputElement,
  DataTableHeaderSelectProps
>((props, ref) => {
  const {
    a11yCheckboxLabel = 'Toggle all rows',
    checkboxProps = {},
    checked = false,
    className,
    disabled = false,
    indeterminate = false,
    name,
    onChange,
    value,
    ...rest
  } = applyCommonProps(props);

  const id = useStableId();

  return (
    /*
     * The root component of DataTableHeaderSelect is a 'td' because the screen reader experience
     * on DataTable is more confusing when DataTableHeaderSelect is a 'th'.
     * For more details see https://jira.walmart.com/browse/LD-2633?focusedCommentId=20102819&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-20102819
     */
    <td className={cx('ld-datatable-datatableheaderselect-headerSelect', className)} {...rest}>
      <Checkbox
        a11yLabelledBy={id}
        checkboxProps={checkboxProps}
        checked={checked}
        disabled={disabled}
        indeterminate={indeterminate}
        name={name}
        onChange={onChange}
        value={value}
        ref={ref}
        UNSAFE_className={'ld-datatable-datatableheaderselect-checkbox'}
      />
      <VisuallyHidden id={id} aria-hidden="true" className="ld-a11y-nameSource">{a11yCheckboxLabel}</VisuallyHidden>
    </td>
  );
});

DataTableHeaderSelect.displayName = 'DataTableHeaderSelect';

// ---------------------------------------------------------------------------
// DataTableHeadLayoutContext (inlined sub-component)
// ---------------------------------------------------------------------------

/**
 * @private
 */
export interface DataTableHeadLayoutContextValue {
  registerButtonRef: (
    ref: React.MutableRefObject<HTMLButtonElement | null>
  ) => void;
}

/**
 * @private
 */
export const DataTableHeadLayoutContext =
  React.createContext<DataTableHeadLayoutContextValue>(
    {} as unknown as DataTableHeadLayoutContextValue
  );

// ---------------------------------------------------------------------------
// DataTableHeadLayoutProvider (inlined sub-component)
// ---------------------------------------------------------------------------

/**
 * @private
 */
export interface DataTableHeadLayoutProviderProps {
  /**
   * The content for the provider.
   */
  children: React.ReactNode;
  /**
   * The ref object for the provider's head element.
   */
  headRef: React.MutableRefObject<HTMLTableSectionElement | null>;
}

/**
 * @private
 */
export const DataTableHeadLayoutProvider: React.FunctionComponent<
  DataTableHeadLayoutProviderProps
> = (props) => {
  const {children, headRef} = props;
  const buttonRefs = React.useRef<
    React.MutableRefObject<HTMLButtonElement | null>[]
  >([]);
  const providerValueRef = React.useRef<DataTableHeadLayoutContextValue>({
    registerButtonRef(ref) {
      buttonRefs.current.push(ref);
    },
  });

  const setButtonHeights = React.useCallback(() => {
    if (!headRef.current) {
      return;
    }

    buttonRefs.current.forEach(({current: el}) => {
      if (el) {
        el.style.height = '';
      }
    });

    const headElHeight = `calc(${headRef.current?.offsetHeight}px - ${"0.0625rem"})`;

    buttonRefs.current.forEach(({current: el}) => {
      if (el) {
        el.style.height = headElHeight;
      }
    });
  }, [buttonRefs, headRef]);

  // Set buttons' heights on initial render:
  React.useEffect(setButtonHeights, [setButtonHeights]);

  // Set buttons' heights when the window is resized:
  useDataTableDebouncedWindowResize(setButtonHeights);

  return (
    <DataTableHeadLayoutContext.Provider value={providerValueRef.current}>
      {children}
    </DataTableHeadLayoutContext.Provider>
  );
};

// ---------------------------------------------------------------------------
// DataTableRowLayoutContext (inlined sub-component)
// ---------------------------------------------------------------------------

/**
 * @private
 */
export interface DataTableRowLayoutContextValue {
  registerTextAreaRef: (
    ref: React.MutableRefObject<HTMLTextAreaElement | null>
  ) => void;
  setTextAreaHeights: () => void;
}

/**
 * @private
 */
export const DataTableRowLayoutContext =
  React.createContext<DataTableRowLayoutContextValue>(
    {} as unknown as DataTableRowLayoutContextValue
  );

// ---------------------------------------------------------------------------
// DataTableRowLayoutProvider (inlined sub-component)
// ---------------------------------------------------------------------------

/**
 * @private
 */
export interface DataTableRowLayoutProviderProps {
  /**
   * The content for the provider.
   */
  children: React.ReactNode;
}

/**
 * @private
 */
export const DataTableRowLayoutProvider: React.FunctionComponent<
  DataTableRowLayoutProviderProps
> = (props) => {
  const {children} = props;

  const textAreaRefs = React.useRef<
    React.MutableRefObject<HTMLTextAreaElement | null>[]
  >([]);

  const setTextAreaHeights = React.useCallback(() => {
    textAreaRefs.current.forEach(({current: el}) => {
      if (el) {
        el.style.height = '';
      }
    });

    const textAreaHeight = textAreaRefs.current.reduce((acc, {current: el}) => {
      if (!el) {
        return acc;
      }
      const currentScrollHeight = el.scrollHeight;
      return currentScrollHeight > acc ? currentScrollHeight : acc;
    }, 0);

    textAreaRefs.current.forEach(({current: el}) => {
      if (el) {
        el.style.height = `${textAreaHeight}px`;
      }
    });
  }, []);

  // Set text areas' heights on initial render:
  React.useEffect(setTextAreaHeights, [setTextAreaHeights]);

  // Set text areas' heights when the window is resized:
  useDataTableDebouncedWindowResize(setTextAreaHeights);

  const providerValueRef = React.useRef<DataTableRowLayoutContextValue>({
    registerTextAreaRef(ref) {
      textAreaRefs.current.push(ref);
    },
    setTextAreaHeights,
  });

  return (
    <DataTableRowLayoutContext.Provider value={providerValueRef.current}>
      {children}
    </DataTableRowLayoutContext.Provider>
  );
};

// ---------------------------------------------------------------------------
// useDataTableCellBulkEditTextAreaLayout (inlined sub-component)
// ---------------------------------------------------------------------------

/**
 * @private
 */
export const useDataTableCellBulkEditTextAreaLayout = (
  ref: React.MutableRefObject<HTMLTextAreaElement | null>
) => {
  const {registerTextAreaRef, setTextAreaHeights} = React.useContext(
    DataTableRowLayoutContext
  );

  React.useEffect(() => {
    registerTextAreaRef(ref);
  }, [ref, registerTextAreaRef]);

  return {setTextAreaHeights};
};

// ---------------------------------------------------------------------------
// useDataTableHeadLayout (inlined sub-component)
// ---------------------------------------------------------------------------

/**
 * @private
 */
export const useDataTableHeadLayout = (
  ref: React.MutableRefObject<HTMLButtonElement | null>
) => {
  const {registerButtonRef} = React.useContext(DataTableHeadLayoutContext);

  React.useEffect(() => {
    registerButtonRef(ref);
  }, [ref, registerButtonRef]);
};

// ---------------------------------------------------------------------------
// DataTableRow (inlined sub-component)
// ---------------------------------------------------------------------------

export interface DataTableRowProps
  extends Omit<React.ComponentPropsWithoutRef<'tr'>, 'className' | 'style'> {
  /**
   * The content for the row.
   */
  children: React.ReactNode;
  /**
   * If the row is selected.
   *
   * @default false
   */
  selected?: boolean;
}

/**
 * Data Table Row
 * *
 */
export const DataTableRow: React.FunctionComponent<DataTableRowProps> = (
  props
) => {
  const {
    className,
    selected = false,
    ...rest
  } = applyCommonProps(props);

  return (
    <DataTableRowLayoutProvider>
      <tr
        className={cx('ld-datatable-datatablerow-dataTableRow', selected && 'ld-datatable-datatablerow-selected', className)}
        {...rest}
      />
    </DataTableRowLayoutProvider>
  );
};

export interface DataTableProps
  extends Omit<React.ComponentPropsWithoutRef<'table'>, 'className' | 'style'>,
    CommonProps {
  /**
   * The content for the data table.
   */
  children: React.ReactNode;
}

/**
 * Data Tables display a set of related information in rows and columns.
 * *
 */
export const DataTable: React.FunctionComponent<DataTableProps> = (props) => {
  const {className, ...rest} = applyCommonProps(props);

  return (
    <table className={cx('ld-datatable-dataTable', className)} {...rest} />
  );
};
