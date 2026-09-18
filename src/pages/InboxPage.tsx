import * as React from 'react';
import { Page } from '../components/Page';
import { Container } from '../components/Container';
import { Heading, Body, Caption } from '../components/Text';
import { Grid, GridColumn } from '../components/Grid';
import { SelectCard } from '../components/SelectCard';
import {
  DataTable,
  DataTableHead,
  DataTableHeader,
  DataTableBody,
  DataTableRow,
  DataTableCell,
  DataTableCellStatus,
  DataTableCellActions,
  DataTableCellSelect,
  DataTableHeaderSelect,
  DataTableBulkActions,
} from '../components/DataTable';
import { Tag } from '../components/Tag';
import { Button } from '../components/Button';
import { LinkButton } from '../components/LinkButton';
import { Label } from '../components/Label';
import { SegmentedControl } from '../components/SegmentedControl';
import { Card } from '../components/Card';
import { Icon } from '../components/Icons';
import { IconButton } from '../components/IconButton';
import { Tooltip } from '../components/Tooltip';
import { Modal } from '../components/Modal';
import { TextArea } from '../components/TextArea';
import { SpinButton } from '../components/SpinButton';
import { LineClamp } from '../components/LineClamp';
import { VisuallyHidden } from '../components/VisuallyHidden';
import { SearchField } from '../components/SearchField';
import { FilterDropdownChip } from '../components/custom/FilterDropdownChip';
import { ArticleThumbnail } from '../components/custom/ArticleThumbnail';
import { TablePagination } from '../patterns/TablePagination';
import { useSnackbar } from '../components/Snackbar';
import { useAnnounce } from '../components/A11yAnnouncement';
import {
  getAllArticleRows,
  decideArticleRow,
  updateArticleRowQty,
  formatDateTime,
  formatDate,
  type InboxSection,
  type RexArticleRow,
} from '../data/rexData';
import './InboxPage.css';

const PAGE_SIZE_OPTIONS = [5, 10, 25];
const DEFAULT_PAGE_SIZE = 10;

type SortOption = 'newest' | 'oldest';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest submitted' },
  { value: 'oldest', label: 'Oldest submitted' },
];

// Placeholder for the logged-in director — there's no auth/session in this
// prototype, so "My projects" filters against this fixed name instead of a
// real identity.
const CURRENT_DIRECTOR = 'Robert Chen';

const SECTION_COPY: Record<InboxSection, { label: string; description: string }> = {
  pending: { label: 'Pending', description: 'Awaiting a decision' },
  rejected: { label: 'Rejected', description: 'Reviewed and denied' },
  cancelled: { label: 'Cancelled', description: 'Reviewed and cancelled' },
};

function getUniqueValues(rows: RexArticleRow[], selector: (row: RexArticleRow) => string): string[] {
  const values = new Set<string>();
  rows.forEach((row) => values.add(selector(row)));
  return Array.from(values).sort();
}

function buildFilterOptions(allLabel: string, values: string[]) {
  return [{ value: 'all', label: allLabel }, ...values.map((value) => ({ value, label: value }))];
}

function sortRows(rows: RexArticleRow[], sort: SortOption): RexArticleRow[] {
  const copy = [...rows];
  copy.sort((a, b) => {
    const aDate = new Date(a.submittedAt).getTime();
    const bDate = new Date(b.submittedAt).getTime();
    return sort === 'oldest' ? aDate - bDate : bDate - aDate;
  });
  return copy;
}

// Column widths for the frozen Article column + sticky select/actions rails.
const SELECT_COL_WIDTH = 52;
const ACTIONS_COL_WIDTH = 150;
const ARTICLE_COL_WIDTH = 260;
const PROJECT_ID_COL_WIDTH = 160;
const DEPARTMENT_COL_WIDTH = 200;
const STORE_COL_WIDTH = 220;
const QTY_COL_WIDTH = 110;
const FINALIZED_QTY_COL_WIDTH = 160;
const DELIVERY_TYPE_COL_WIDTH = 160;
const DATE_COL_WIDTH = 150;
const PEOPLE_COL_WIDTH = 170;
const REASON_COL_WIDTH = 260;
const DECISION_REASON_COL_WIDTH = 260;

export function InboxPage() {
  const { addSnack } = useSnackbar();
  const announce = useAnnounce();
  const [, forceUpdate] = React.useReducer((n: number) => n + 1, 0);

  const [section, setSection] = React.useState<InboxSection>('pending');
  const [search, setSearch] = React.useState('');
  const [store, setStore] = React.useState<string[]>([]);
  const [projectId, setProjectId] = React.useState<string[]>([]);
  const [department, setDepartment] = React.useState<string[]>([]);
  const [director, setDirector] = React.useState<string[]>([]);
  const [srDirector, setSrDirector] = React.useState<string[]>([]);
  const [sort, setSort] = React.useState<SortOption>('newest');
  // No real auth/session in this prototype, so "My projects" is stubbed to a
  // fixed director rather than a logged-in identity — swap for the real
  // current-user check once auth lands.
  const [projectScope, setProjectScope] = React.useState<'all' | 'mine'>('all');
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const [rejectTargets, setRejectTargets] = React.useState<RexArticleRow[] | null>(null);
  const [rejectReason, setRejectReason] = React.useState('');
  const [rejectReasonError, setRejectReasonError] = React.useState<string | undefined>(undefined);
  const [cancelTargets, setCancelTargets] = React.useState<RexArticleRow[] | null>(null);
  const [cancelReason, setCancelReason] = React.useState('');
  const [cancelReasonError, setCancelReasonError] = React.useState<string | undefined>(undefined);
  const [bulkApproveTargets, setBulkApproveTargets] = React.useState<RexArticleRow[] | null>(null);
  const [bulkApproveQty, setBulkApproveQty] = React.useState(0);

  const allRows = getAllArticleRows();
  const counts = React.useMemo(
    () => ({
      pending: allRows.filter((r) => r.decision === 'pending').length,
      rejected: allRows.filter((r) => r.decision === 'rejected').length,
      cancelled: allRows.filter((r) => r.decision === 'cancelled').length,
    }),
    [allRows]
  );

  const sectionRows = React.useMemo(() => allRows.filter((r) => r.decision === section), [allRows, section]);
  const stores = React.useMemo(() => getUniqueValues(sectionRows, (r) => r.storeName), [sectionRows]);
  const projectIds = React.useMemo(() => getUniqueValues(sectionRows, (r) => r.projectId), [sectionRows]);
  const departments = React.useMemo(() => getUniqueValues(sectionRows, (r) => r.departmentName), [sectionRows]);
  const directors = React.useMemo(() => getUniqueValues(sectionRows, (r) => r.director), [sectionRows]);
  const srDirectors = React.useMemo(() => getUniqueValues(sectionRows, (r) => r.srDirector), [sectionRows]);

  const filteredRows = React.useMemo(() => {
    let results = sectionRows.filter((row) => row.storeName.toLowerCase().includes(search.trim().toLowerCase()));
    if (projectScope === 'mine') {
      results = results.filter((row) => row.director === CURRENT_DIRECTOR);
    }
    if (store.length > 0) {
      results = results.filter((row) => store.includes(row.storeName));
    }
    if (projectId.length > 0) {
      results = results.filter((row) => projectId.includes(row.projectId));
    }
    if (department.length > 0) {
      results = results.filter((row) => department.includes(row.departmentName));
    }
    if (director.length > 0) {
      results = results.filter((row) => director.includes(row.director));
    }
    if (srDirector.length > 0) {
      results = results.filter((row) => srDirector.includes(row.srDirector));
    }
    return sortRows(results, sort);
  }, [sectionRows, search, projectScope, store, projectId, department, director, srDirector, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const clampedPage = Math.min(page, pageCount);
  const pageItems = filteredRows.slice((clampedPage - 1) * pageSize, clampedPage * pageSize);

  React.useEffect(() => {
    setPage(1);
    setSelectedIds(new Set());
  }, [section, search, projectScope, store, projectId, department, director, srDirector, sort]);

  // Clear selection whenever the visible page changes so bulk actions never
  // silently apply to rows that have scrolled off-page.
  React.useEffect(() => {
    setSelectedIds(new Set());
  }, [clampedPage, pageSize]);

  React.useEffect(() => {
    announce.polite(`${filteredRows.length} ${SECTION_COPY[section].label.toLowerCase()} article${filteredRows.length === 1 ? '' : 's'} found`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredRows.length, section]);

  function changeSection(next: InboxSection) {
    setSection(next);
    setStore([]);
    setProjectId([]);
    setDepartment([]);
    setDirector([]);
    setSrDirector([]);
    setSearch('');
  }

  function decide(rowId: string, decision: RexArticleRow['decision'], reason?: string, silent = false) {
    const row = allRows.find((r) => r.rowId === rowId);
    const article = decideArticleRow(rowId, decision, reason);
    if (!article) return;
    forceUpdate();
    if (!silent) {
      const verb = decision === 'accepted' ? 'accepted' : decision === 'rejected' ? 'rejected' : 'cancelled';
      const name = row?.articleName ?? 'Article';
      announce.polite(`${name} ${verb}.`);
      addSnack({ message: `${name} ${verb}.` });
    }
  }

  function updateQty(rowId: string, newQty: number) {
    updateArticleRowQty(rowId, newQty);
    forceUpdate();
  }

  function openRejectModal(row: RexArticleRow) {
    setRejectReason('');
    setRejectReasonError(undefined);
    setRejectTargets([row]);
  }

  function closeRejectModal() {
    setRejectTargets(null);
    setRejectReason('');
    setRejectReasonError(undefined);
  }

  function submitReject() {
    if (!rejectReason.trim()) {
      setRejectReasonError('Enter a reason for rejecting this article.');
      return;
    }
    if (rejectTargets) {
      const reason = rejectReason.trim();
      if (rejectTargets.length === 1) {
        decide(rejectTargets[0].rowId, 'rejected', reason);
      } else {
        rejectTargets.forEach((row) => decide(row.rowId, 'rejected', reason, true));
        const message = `${rejectTargets.length} articles rejected.`;
        announce.polite(message);
        addSnack({ message });
        clearSelected();
      }
    }
    closeRejectModal();
  }

  function openCancelModal(row: RexArticleRow) {
    setCancelReason('');
    setCancelReasonError(undefined);
    setCancelTargets([row]);
  }

  function closeCancelModal() {
    setCancelTargets(null);
    setCancelReason('');
    setCancelReasonError(undefined);
  }

  function submitCancel() {
    if (!cancelReason.trim()) {
      setCancelReasonError('Enter a reason for cancelling this article.');
      return;
    }
    if (cancelTargets) {
      const reason = cancelReason.trim();
      if (cancelTargets.length === 1) {
        decide(cancelTargets[0].rowId, 'cancelled', reason);
      } else {
        cancelTargets.forEach((row) => decide(row.rowId, 'cancelled', reason, true));
        const message = `${cancelTargets.length} articles cancelled.`;
        announce.polite(message);
        addSnack({ message });
        clearSelected();
      }
    }
    closeCancelModal();
  }

  function toggleSelected(rowId: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(rowId);
      else next.delete(rowId);
      return next;
    });
  }

  function selectAll() {
    setSelectedIds(new Set(pageItems.map((r) => r.rowId)));
  }

  function clearSelected() {
    setSelectedIds(new Set());
  }

  function bulkAccept() {
    const selectedRows = allRows.filter((r) => selectedIds.has(r.rowId));
    if (selectedRows.length === 0) return;
    selectedRows.forEach((row) => decide(row.rowId, 'accepted', undefined, true));
    const message = `${selectedRows.length} article${selectedRows.length === 1 ? '' : 's'} accepted.`;
    announce.polite(message);
    addSnack({ message });
    clearSelected();
  }

  function openBulkApproveModal() {
    const selectedRows = allRows.filter((r) => selectedIds.has(r.rowId));
    if (selectedRows.length === 0) return;
    // Default to the highest requested quantity across the selection so the
    // suggested value never undershoots any single article's ask.
    const defaultQty = Math.max(...selectedRows.map((r) => r.requestedQty));
    setBulkApproveQty(defaultQty);
    setBulkApproveTargets(selectedRows);
  }

  function closeBulkApproveModal() {
    setBulkApproveTargets(null);
  }

  function submitBulkApprove() {
    if (!bulkApproveTargets) return;
    bulkApproveTargets.forEach((row) => {
      updateArticleRowQty(row.rowId, bulkApproveQty);
      decideArticleRow(row.rowId, 'accepted');
    });
    const message = `${bulkApproveTargets.length} article${bulkApproveTargets.length === 1 ? '' : 's'} approved with a final quantity of ${bulkApproveQty}.`;
    forceUpdate();
    announce.polite(message);
    addSnack({ message });
    clearSelected();
    closeBulkApproveModal();
  }

  function bulkReject() {
    const selectedRows = allRows.filter((r) => selectedIds.has(r.rowId));
    if (selectedRows.length === 0) return;
    setRejectReason('');
    setRejectReasonError(undefined);
    setRejectTargets(selectedRows);
  }

  const isPending = section === 'pending';
  const articleLeftOffset = isPending ? SELECT_COL_WIDTH : 0;
  const actionsRightOffset = 0;
  // Status sits immediately to the left of Actions, frozen as one unit on
  // the right edge — when there's no Actions column (Rejected/Cancelled),
  // Status alone anchors the right edge.
  const statusRightOffset = isPending ? ACTIONS_COL_WIDTH : 0;

  // Background + hover-repaint + frozen-edge shadow for every sticky cell
  // below live in InboxPage.css (`.rex-inbox-sticky` and friends) — CSS
  // classes, not inline styles, so `tr:hover .rex-inbox-sticky` can repaint
  // them to match the rest of the hovered row. Only the per-state dynamic
  // positioning (left/right offsets, width) stays inline here.
  const stickyLeftHeaderStyle: React.CSSProperties = {
    position: 'sticky',
    left: articleLeftOffset,
    zIndex: 3,
    minWidth: ARTICLE_COL_WIDTH,
    whiteSpace: 'nowrap',
  };
  const stickyLeftCellStyle: React.CSSProperties = {
    position: 'sticky',
    left: articleLeftOffset,
    zIndex: 2,
    minWidth: ARTICLE_COL_WIDTH,
  };
  const stickySelectHeaderStyle: React.CSSProperties = {
    position: 'sticky',
    left: 0,
    zIndex: 3,
    textAlign: 'center',
    verticalAlign: 'middle',
  };
  const stickySelectCellStyle: React.CSSProperties = {
    position: 'sticky',
    left: 0,
    zIndex: 2,
    textAlign: 'center',
    verticalAlign: 'middle',
  };
  const stickyStatusHeaderStyle: React.CSSProperties = {
    position: 'sticky',
    right: statusRightOffset,
    zIndex: 3,
    width: '1%',
    whiteSpace: 'nowrap',
  };
  const stickyStatusCellStyle: React.CSSProperties = {
    position: 'sticky',
    right: statusRightOffset,
    zIndex: 2,
    width: '1%',
    whiteSpace: 'nowrap',
  };
  const stickyActionsHeaderStyle: React.CSSProperties = {
    position: 'sticky',
    right: actionsRightOffset,
    zIndex: 3,
    width: ACTIONS_COL_WIDTH,
    minWidth: ACTIONS_COL_WIDTH,
    whiteSpace: 'nowrap',
  };
  const stickyActionsCellStyle: React.CSSProperties = {
    position: 'sticky',
    right: actionsRightOffset,
    zIndex: 2,
    width: ACTIONS_COL_WIDTH,
    minWidth: ACTIONS_COL_WIDTH,
  };
  const wrapHeaderStyle = (width: number): React.CSSProperties => ({ minWidth: width, whiteSpace: 'nowrap' });
  const wrapColStyle = (width: number): React.CSSProperties => ({ minWidth: width });

  return (
    <Page title="Order reviews — REX Director" titleVisuallyHidden>
      <Container>
        <div style={{ margin: '24px 0 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <Heading as="h2" size="large">Order reviews</Heading>
          <style>{`
            /* Match the Figma "[PX] Segmented control" reference
               (node 12511:354944): a true pill (fully rounded ends, not the
               8px-radius rounded-rect this component ships with by default),
               a neutral divider border on the resting segment instead of
               brand blue, and regular (not bold) label weight on both
               segments — the library's own CSS otherwise already matches
               (activated-subtle blue fill + border-activated ring on the
               selected segment), so only these three properties need
               overriding. */
            .order-reviews-segmented .ld-segmented-control-segment {
              border-color: var(--ld-semantic-color-border, #2e2f32) !important;
            }
            .order-reviews-segmented .ld-segmented-control-segment--active {
              font-weight: var(--ld-semantic-font-body-small-weight-default, 400) !important;
              border-color: var(--ld-semantic-color-border-activated, #0053e2) !important;
            }
            .order-reviews-segmented .ld-segmented-control-segment--left {
              border-top-left-radius: var(--ld-primitive-scale-borderradius-round, 1000px) !important;
              border-bottom-left-radius: var(--ld-primitive-scale-borderradius-round, 1000px) !important;
            }
            .order-reviews-segmented .ld-segmented-control-segment--right {
              border-top-right-radius: var(--ld-primitive-scale-borderradius-round, 1000px) !important;
              border-bottom-right-radius: var(--ld-primitive-scale-borderradius-round, 1000px) !important;
            }
          `}</style>
          <SegmentedControl
            aria-label="Project scope"
            items={[
              { value: 'all', label: 'All' },
              { value: 'mine', label: 'My projects' },
            ]}
            value={projectScope}
            onChange={(next) => setProjectScope(next as 'all' | 'mine')}
            UNSAFE_className="order-reviews-segmented"
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <style>{`
            /* KPI-tile look for the inbox section picker, matching the Figma
               "Kairos Warehouse Metrics/Selected/Active" reference
               (node 8673:6989): rounded 16px metric card, bold neutral title,
               large value, subtle caption. Resting = plain card; selected =
               light-blue tint + primary-blue 2px border + elevation-100
               shadow, exactly as in that component's Active variant.

               No visible radio dot — the native radio input stays in the DOM
               (visually hidden, not display:none) so keyboard + screen
               reader selection still works; we hide only the decorative
               circle graphic.

               NOTE: SelectCard's own UNSAFE_className prop clobbers its
               internal classList (a quirk of that generated component's prop
               spread order — passing UNSAFE_className silently drops
               ld-select-card-container / ld-select-card-checked entirely).
               So selection styling is driven off our own wrapper div's
               "is-selected" class instead, via descendant selectors. */
            .inbox-section-card-wrap .ld-select-card-content-wrapper {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: var(--ld-primitive-scale-space-100, 0.5rem) !important;
            }
            .inbox-section-card-wrap .ld-select-card-control {
              min-width: 0 !important;
              margin-top: 0 !important;
              gap: 0 !important;
            }
            .inbox-section-card-wrap .ld-radio-radioInput {
              display: none !important;
            }
            /* The native radio input is kept in the DOM (not display:none) for
               keyboard/screen-reader support, but it's absolutely positioned
               and 24x24 — with its own decorative circle (above) hidden, the
               browser's default focus outline was rendering as a bare
               rectangle floating just left of the title. We supply a nicer
               focus indicator on the whole card via :focus-within below, so
               suppress this one. */
            .inbox-section-card-wrap .ld-radio-input {
              outline: none !important;
            }
            .inbox-section-card-wrap .ld-select-card-children {
              text-align: left !important;
              gap: 0 !important;
            }
            .inbox-section-card-wrap .ld-select-card-label-text {
              font-size: var(--ld-semantic-font-body-medium-size, 1rem) !important;
              line-height: var(--ld-semantic-font-body-medium-line-height, 1.5rem) !important;
              font-weight: var(--ld-semantic-font-body-medium-weight-alt, 700) !important;
              color: var(--ld-semantic-color-text, #2e2f32) !important;
            }
            .inbox-section-card-wrap .ld-select-card-container {
              border: 1px solid var(--ld-semantic-color-separator, #d6d8db) !important;
              border-radius: 1rem !important;
              box-shadow: none !important;
              background: var(--ld-semantic-color-surface) !important;
            }
            .inbox-section-card-wrap.is-selected .ld-select-card-container {
              border: 2px solid var(--ld-semantic-color-border-activated, #0053e2) !important;
              background: var(--ld-semantic-color-surface-activated, #f0f5ff) !important;
              box-shadow: var(--ld-semantic-elevation-100, 0 1px 2px 1px rgba(0, 0, 0, 0.15), 0 -1px 2px rgba(0, 0, 0, 0.1)) !important;
            }
            .inbox-section-card-wrap:focus-within {
              outline: 2px solid var(--ld-semantic-color-border-activated, #0053e2);
              outline-offset: 2px;
            }
          `}</style>
          <Grid hasGutter>
            {(Object.keys(SECTION_COPY) as InboxSection[]).map((key) => (
              <GridColumn key={key} sm={12} md={4} lg={4}>
                <div className={`inbox-section-card-wrap${section === key ? ' is-selected' : ''}`}>
                <SelectCard
                  singleSelect
                  name="inbox-section"
                  value={key}
                  checked={section === key}
                  onChange={() => changeSection(key)}
                  label={SECTION_COPY[key].label}
                >
                  <Heading as="div" size="large">{counts[key]}</Heading>
                  <Body as="p" size="small" color="subtle">{SECTION_COPY[key].description}</Body>
                </SelectCard>
                </div>
              </GridColumn>
            ))}
          </Grid>
        </div>

        <div style={{ marginBottom: 48 }}>
          <Card>
            <style>{`
              .inbox-search-fill .ax-search-field {
                max-width: none !important;
              }
            `}</style>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
                gap: 'var(--ld-primitive-scale-space-100)',
                padding: 'var(--ld-primitive-scale-space-200)',
                borderBottom: '1px solid var(--ld-semantic-color-separator)',
              }}
            >
              <div className="inbox-search-fill" style={{ flex: '1 1 375px', minWidth: 260 }}>
                <SearchField
                  value={search}
                  onChange={setSearch}
                  onClear={() => setSearch('')}
                  placeholder="Search by store"
                  size="xsmall"
                  cornerStyle="rounded"
                  showMic={false}
                  showBarcode={false}
                />
              </div>
              <FilterDropdownChip
                multiple
                label="Store"
                options={buildFilterOptions('All stores', stores)}
                value={store}
                onChange={setStore}
              />
              <FilterDropdownChip
                multiple
                label="Project ID"
                options={buildFilterOptions('All project IDs', projectIds)}
                value={projectId}
                onChange={setProjectId}
              />
              <FilterDropdownChip
                multiple
                label="Department"
                options={buildFilterOptions('All departments', departments)}
                value={department}
                onChange={setDepartment}
              />
              <FilterDropdownChip
                multiple
                label="Director"
                options={buildFilterOptions('All directors', directors)}
                value={director}
                onChange={setDirector}
              />
              <FilterDropdownChip
                multiple
                label="Sr. Director"
                options={buildFilterOptions('All sr. directors', srDirectors)}
                value={srDirector}
                onChange={setSrDirector}
              />
              <FilterDropdownChip
                label="Sort by"
                options={SORT_OPTIONS}
                value={sort}
                onChange={(next) => setSort(next as SortOption)}
                defaultValue="newest"
                align="end"
              />
            </div>

            {isPending && selectedIds.size > 0 ? (
              <>
                <style>{`
                  /* Bulk action bar restyled to match the Figma "[PX] Bulk Action
                     Bar" reference (node 10873:64742): a dark inverse-fill bar
                     with white text/icons/links, holding two white pill
                     buttons (Reject / Approve) on the right. Scoped to this
                     wrapper via descendant selectors — same safe pattern as the
                     section-picker cards, avoiding UNSAFE_className on a
                     generated component. */
                  .inbox-bulk-bar-wrap .ld-datatable-datatablebulkactions-dataTableBulkActions {
                    background: var(--ld-semantic-color-fill-inverse, #2e2f32) !important;
                    box-shadow: var(--ld-semantic-elevation-200) !important;
                    border-radius: 0 !important;
                  }
                  .inbox-bulk-bar-wrap .ld-datatable-datatablebulkactions-icon {
                    color: var(--ld-semantic-color-icon-inverse, #ffffff) !important;
                    fill: var(--ld-semantic-color-icon-inverse, #ffffff) !important;
                  }
                  .inbox-bulk-bar-wrap .ld-datatable-datatablebulkactions-textLabel {
                    color: var(--ld-semantic-color-text-inverse, #ffffff) !important;
                  }
                  .inbox-bulk-bar-wrap .ld-datatable-datatablebulkactions-selectActionsContainer a,
                  .inbox-bulk-bar-wrap .ld-datatable-datatablebulkactions-selectActionsContainer button {
                    color: var(--ld-semantic-color-link-text-accent-white, #ffffff) !important;
                  }
                `}</style>
                <div className="inbox-bulk-bar-wrap">
                  <DataTableBulkActions
                    count={selectedIds.size}
                    a11yLabel="Selected articles bulk actions"
                    onSelectAll={selectAll}
                    onClearSelected={clearSelected}
                    actionContent={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <LinkButton color="white" size="small" onClick={openBulkApproveModal}>
                          Edit qty and approve
                        </LinkButton>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <Button variant="tertiary" size="small" leading={<Icon name="Close" decorative />} onClick={bulkReject}>
                            Reject
                          </Button>
                          <Button variant="secondary" size="small" leading={<Icon name="Check" decorative />} onClick={bulkAccept}>
                            Approve
                          </Button>
                        </div>
                      </div>
                    }
                  />
                </div>
              </>
            ) : null}

            <div style={{ overflowX: 'auto' }}>
              <DataTable aria-label={`${SECTION_COPY[section].label} articles`} UNSAFE_className="rex-inbox-table">
                <DataTableHead>
                  <DataTableRow>
                    {isPending && (
                      <DataTableHeaderSelect
                        a11yCheckboxLabel="Select all articles on this page"
                        checked={pageItems.length > 0 && selectedIds.size === pageItems.length}
                        indeterminate={selectedIds.size > 0 && selectedIds.size < pageItems.length}
                        onChange={(e) => (e.target.checked ? selectAll() : clearSelected())}
                        {...({ UNSAFE_style: stickySelectHeaderStyle, UNSAFE_className: 'rex-inbox-sticky' } as object)}
                      />
                    )}
                    <DataTableHeader {...({ UNSAFE_style: stickyLeftHeaderStyle, UNSAFE_className: 'rex-inbox-sticky rex-inbox-sticky-article' } as object)}>Article ID</DataTableHeader>
                    <DataTableHeader {...({ UNSAFE_style: wrapHeaderStyle(PROJECT_ID_COL_WIDTH) } as object)}>Project ID</DataTableHeader>
                    <DataTableHeader {...({ UNSAFE_style: wrapHeaderStyle(STORE_COL_WIDTH) } as object)}>Store</DataTableHeader>
                    <DataTableHeader {...({ UNSAFE_style: wrapHeaderStyle(DEPARTMENT_COL_WIDTH) } as object)}>Department</DataTableHeader>
                    <DataTableHeader alignment="right" {...({ UNSAFE_style: wrapHeaderStyle(QTY_COL_WIDTH) } as object)}>Requested qty</DataTableHeader>
                    <DataTableHeader alignment="right" {...({ UNSAFE_style: wrapHeaderStyle(FINALIZED_QTY_COL_WIDTH) } as object)}>Finalized qty</DataTableHeader>
                    <DataTableHeader {...({ UNSAFE_style: wrapHeaderStyle(DELIVERY_TYPE_COL_WIDTH) } as object)}>Delivery type</DataTableHeader>
                    <DataTableHeader {...({ UNSAFE_style: wrapHeaderStyle(DATE_COL_WIDTH) } as object)}>Delivery date</DataTableHeader>
                    <DataTableHeader {...({ UNSAFE_style: wrapHeaderStyle(DATE_COL_WIDTH) } as object)}>Tentative SAP date</DataTableHeader>
                    {!isPending && (
                      <>
                        <DataTableHeader {...({ UNSAFE_style: wrapHeaderStyle(DATE_COL_WIDTH) } as object)}>Possession date</DataTableHeader>
                        <DataTableHeader {...({ UNSAFE_style: wrapHeaderStyle(DATE_COL_WIDTH) } as object)}>Grand opening date</DataTableHeader>
                      </>
                    )}
                    <DataTableHeader {...({ UNSAFE_style: wrapHeaderStyle(PEOPLE_COL_WIDTH) } as object)}>Submitted by</DataTableHeader>
                    <DataTableHeader {...({ UNSAFE_style: wrapHeaderStyle(PEOPLE_COL_WIDTH) } as object)}>Director</DataTableHeader>
                    <DataTableHeader {...({ UNSAFE_style: wrapHeaderStyle(PEOPLE_COL_WIDTH) } as object)}>Sr. Director</DataTableHeader>
                    <DataTableHeader {...({ UNSAFE_style: wrapHeaderStyle(REASON_COL_WIDTH) } as object)}>Reason</DataTableHeader>
                    {!isPending && (
                      <DataTableHeader {...({ UNSAFE_style: wrapHeaderStyle(DECISION_REASON_COL_WIDTH) } as object)}>
                        {section === 'rejected' ? 'Rejection reason' : 'Cancellation reason'}
                      </DataTableHeader>
                    )}
                    {/* Every row in the Pending section is, by definition, pending — the
                        column would just repeat the section you're already looking at. */}
                    {!isPending && <DataTableHeader {...({ UNSAFE_style: stickyStatusHeaderStyle, UNSAFE_className: 'rex-inbox-sticky rex-inbox-sticky-end' } as object)}>Status</DataTableHeader>}
                    {isPending && <DataTableHeader {...({ UNSAFE_style: stickyActionsHeaderStyle, UNSAFE_className: 'rex-inbox-sticky rex-inbox-sticky-end' } as object)}>Actions</DataTableHeader>}
                  </DataTableRow>
                </DataTableHead>
                <DataTableBody>
                  {pageItems.map((row) => {
                    const decided = row.decision !== 'pending';
                    return (
                      <DataTableRow key={row.rowId}>
                        {isPending && (
                          <DataTableCellSelect
                            a11yLabelledBy={`article-name-${row.rowId}`}
                            checked={selectedIds.has(row.rowId)}
                            onChange={(e) => toggleSelected(row.rowId, e.target.checked)}
                            {...({ UNSAFE_style: stickySelectCellStyle, UNSAFE_className: 'rex-inbox-sticky' } as object)}
                          />
                        )}
                        <DataTableCell {...({ UNSAFE_style: stickyLeftCellStyle, UNSAFE_className: 'rex-inbox-sticky rex-inbox-sticky-article' } as object)}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ld-primitive-scale-space-150, 12px)' }}>
                            <ArticleThumbnail
                              articleId={row.articleNumber}
                              articleName={row.articleName}
                              imageUrl={row.imageUrl}
                              imageAlt={row.imageAlt}
                            />
                            <div style={{ minWidth: 0 }}>
                              <Body as="p" size="small" weight="alt" id={`article-name-${row.rowId}`}>#{row.articleNumber}</Body>
                              <LineClamp lines={1}>
                                <Caption as="p" color="subtle">{row.articleName}</Caption>
                              </LineClamp>
                            </div>
                          </div>
                        </DataTableCell>
                        <DataTableCell {...({ UNSAFE_style: wrapColStyle(PROJECT_ID_COL_WIDTH) } as object)}>{row.projectId}</DataTableCell>
                        <DataTableCell {...({ UNSAFE_style: wrapColStyle(STORE_COL_WIDTH) } as object)}>
                          <LineClamp lines={2}>{row.storeName}</LineClamp>
                        </DataTableCell>
                        <DataTableCell {...({ UNSAFE_style: wrapColStyle(DEPARTMENT_COL_WIDTH) } as object)}>
                          <LineClamp lines={2}>
                            <Body as="p" size="small">{row.departmentNumber} - {row.departmentName}</Body>
                          </LineClamp>
                        </DataTableCell>
                        <DataTableCell variant="numeric">{row.requestedQty}</DataTableCell>
                        <DataTableCell variant="numeric" {...({ UNSAFE_style: wrapColStyle(FINALIZED_QTY_COL_WIDTH) } as object)}>
                          {isPending && row.decision === 'pending' ? (
                            (() => {
                              const rowMaxQty = row.asIsQty * 10 || 1000;
                              const finalizedQtyLabelId = `finalized-qty-label-${row.rowId}`;
                              return (
                                <>
                                  <VisuallyHidden id={finalizedQtyLabelId}>Finalized quantity for {row.articleName}</VisuallyHidden>
                                  <div className="rex-finalized-qty-spinbutton">
                                    <IconButton
                                      a11yLabel={`Decrease finalized quantity for ${row.articleName}`}
                                      size="small"
                                      variant="round"
                                      onClick={() => updateQty(row.rowId, Math.max(0, row.newQty - 1))}
                                    >
                                      <Icon name="Minus" decorative />
                                    </IconButton>
                                    <SpinButton
                                      a11yLabelledBy={finalizedQtyLabelId}
                                      value={row.newQty}
                                      onChange={(value) => updateQty(row.rowId, value)}
                                      min={0}
                                      max={rowMaxQty}
                                    />
                                    <IconButton
                                      a11yLabel={`Increase finalized quantity for ${row.articleName}`}
                                      size="small"
                                      variant="round"
                                      onClick={() => updateQty(row.rowId, Math.min(rowMaxQty, row.newQty + 1))}
                                    >
                                      <Icon name="Plus" decorative />
                                    </IconButton>
                                  </div>
                                </>
                              );
                            })()
                          ) : (
                            row.newQty
                          )}
                        </DataTableCell>
                        <DataTableCell {...({ UNSAFE_style: wrapColStyle(DELIVERY_TYPE_COL_WIDTH) } as object)}>
                          <LineClamp lines={1}>{row.deliveryType}</LineClamp>
                        </DataTableCell>
                        <DataTableCell>{formatDate(row.deliveryDate)}</DataTableCell>
                        <DataTableCell>{formatDate(row.tentativeSapSubmissionDate)}</DataTableCell>
                        {!isPending && (
                          <>
                            <DataTableCell>{formatDate(row.possessionDate)}</DataTableCell>
                            <DataTableCell>{formatDate(row.grandOpeningDate)}</DataTableCell>
                          </>
                        )}
                        <DataTableCell {...({ UNSAFE_style: wrapColStyle(PEOPLE_COL_WIDTH) } as object)}>
                          {row.submittedBy}
                          <Caption as="p" color="subtle">{formatDateTime(row.submittedAt)}</Caption>
                        </DataTableCell>
                        <DataTableCell {...({ UNSAFE_style: wrapColStyle(PEOPLE_COL_WIDTH) } as object)}>{row.director}</DataTableCell>
                        <DataTableCell {...({ UNSAFE_style: wrapColStyle(PEOPLE_COL_WIDTH) } as object)}>{row.srDirector}</DataTableCell>
                        <DataTableCell {...({ UNSAFE_style: wrapColStyle(REASON_COL_WIDTH) } as object)}>
                          <LineClamp>{row.reason}</LineClamp>
                        </DataTableCell>
                        {!isPending && (
                          <DataTableCell {...({ UNSAFE_style: wrapColStyle(DECISION_REASON_COL_WIDTH) } as object)}>
                            <LineClamp>{row.decisionReason || '—'}</LineClamp>
                          </DataTableCell>
                        )}
                        {/* Pending section: every row is pending — no need to repeat it per row. */}
                        {!isPending && (
                          <DataTableCellStatus {...({ UNSAFE_style: stickyStatusCellStyle, UNSAFE_className: 'rex-inbox-sticky rex-inbox-sticky-end' } as object)}>
                            {row.decision === 'rejected' ? (
                              <Tag variant="tertiary" color="negative" leading={<Icon name="Close" decorative />}>Rejected</Tag>
                            ) : (
                              <Tag variant="tertiary" color="neutral" leading={<Icon name="Ban" decorative />}>Cancelled</Tag>
                            )}
                          </DataTableCellStatus>
                        )}
                        {isPending && (
                          <DataTableCellActions {...({ UNSAFE_style: stickyActionsCellStyle, UNSAFE_className: 'rex-inbox-sticky rex-inbox-sticky-end' } as object)}>
                            <div style={{ display: 'flex', gap: 8, whiteSpace: 'nowrap' }}>
                              <Tooltip content="Accept">
                                <IconButton
                                  a11yLabel={`Accept ${row.articleName}`}
                                  variant="ghost"
                                  size="small"
                                  onClick={() => decide(row.rowId, 'accepted')}
                                  disabled={decided && row.decision === 'accepted'}
                                >
                                  <Icon name="Check" decorative />
                                </IconButton>
                              </Tooltip>
                              <Tooltip content="Reject">
                                <IconButton
                                  a11yLabel={`Reject ${row.articleName}`}
                                  variant="ghost"
                                  size="small"
                                  onClick={() => openRejectModal(row)}
                                  disabled={decided && row.decision === 'rejected'}
                                >
                                  <Icon name="Close" decorative />
                                </IconButton>
                              </Tooltip>
                              <Tooltip content="Cancel">
                                <IconButton
                                  a11yLabel={`Cancel ${row.articleName}`}
                                  variant="ghost"
                                  size="small"
                                  onClick={() => openCancelModal(row)}
                                  disabled={decided && row.decision === 'cancelled'}
                                >
                                  <Icon name="Ban" decorative />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </DataTableCellActions>
                        )}
                      </DataTableRow>
                    );
                  })}
                  {pageItems.length === 0 && (
                    <DataTableRow>
                      <DataTableCell {...({ colSpan: isPending ? 15 : 17 } as object)}>
                        <div style={{ padding: 'var(--ld-primitive-scale-space-400) 0', textAlign: 'center' }}>
                          <Body as="p" size="small" color="subtle">No {SECTION_COPY[section].label.toLowerCase()} articles found.</Body>
                        </div>
                      </DataTableCell>
                    </DataTableRow>
                  )}
                </DataTableBody>
              </DataTable>
            </div>

            <div
              style={{
                padding: 'var(--ld-primitive-scale-space-200)',
                borderTop: '1px solid var(--ld-semantic-color-separator)',
              }}
            >
              <TablePagination
                page={clampedPage}
                pageCount={pageCount}
                pageSize={pageSize}
                totalItems={filteredRows.length}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                onPageChange={setPage}
                onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
                navigationLabel={`${SECTION_COPY[section].label} articles pagination`}
              />
            </div>
          </Card>
        </div>
      </Container>

      <Modal
        isOpen={rejectTargets !== null}
        onClose={closeRejectModal}
        title={
          rejectTargets && rejectTargets.length > 1
            ? `Reject ${rejectTargets.length} articles`
            : rejectTargets
            ? `Reject ${rejectTargets[0].articleName}`
            : 'Reject article'
        }
        actions={
          <>
            <Button variant="tertiary" onClick={closeRejectModal}>Cancel</Button>
            <Button variant="destructive" onClick={submitReject}>
              {rejectTargets && rejectTargets.length > 1 ? 'Reject articles' : 'Reject article'}
            </Button>
          </>
        }
      >
        <TextArea
          label="Reason for rejection"
          value={rejectReason}
          onChange={(e) => {
            setRejectReason(e.target.value);
            if (rejectReasonError) setRejectReasonError(undefined);
          }}
          error={rejectReasonError}
          helperText="This reason will be recorded against the article."
        />
      </Modal>

      <Modal
        isOpen={cancelTargets !== null}
        onClose={closeCancelModal}
        title={
          cancelTargets && cancelTargets.length > 1
            ? `Cancel ${cancelTargets.length} articles`
            : cancelTargets
            ? `Cancel ${cancelTargets[0].articleName}`
            : 'Cancel article'
        }
        actions={
          <>
            <Button variant="tertiary" onClick={closeCancelModal}>Dismiss</Button>
            <Button variant="destructive" onClick={submitCancel}>
              {cancelTargets && cancelTargets.length > 1 ? 'Cancel articles' : 'Cancel article'}
            </Button>
          </>
        }
      >
        <TextArea
          label="Reason for cancellation"
          value={cancelReason}
          onChange={(e) => {
            setCancelReason(e.target.value);
            if (cancelReasonError) setCancelReasonError(undefined);
          }}
          error={cancelReasonError}
          helperText="This reason will be recorded against the article."
        />
      </Modal>

      <Modal
        isOpen={bulkApproveTargets !== null}
        onClose={closeBulkApproveModal}
        size="medium"
        title={bulkApproveTargets ? `Approve ${bulkApproveTargets.length} article${bulkApproveTargets.length === 1 ? '' : 's'}` : 'Approve articles'}
        actions={
          <>
            <Button variant="tertiary" onClick={closeBulkApproveModal}>Cancel</Button>
            <Button variant="primary" onClick={submitBulkApprove}>
              Approve {bulkApproveTargets?.length ?? 0} article{bulkApproveTargets && bulkApproveTargets.length === 1 ? '' : 's'}
            </Button>
          </>
        }
      >
        <Body as="p" UNSAFE_style={{ marginBottom: 16 }}>
          {bulkApproveTargets?.length ?? 0} article{bulkApproveTargets && bulkApproveTargets.length === 1 ? '' : 's'} selected. Set the final quantity to apply to all of them.
        </Body>
        <Label id="bulk-finalized-qty-label" style={{ display: 'block', marginBottom: 8 }}>Finalized qty</Label>
        <div className="rex-finalized-qty-spinbutton">
          <IconButton
            a11yLabel="Decrease finalized quantity"
            size="small"
            variant="round"
            onClick={() => setBulkApproveQty((q) => Math.max(0, q - 1))}
          >
            <Icon name="Minus" decorative />
          </IconButton>
          <SpinButton
            a11yLabelledBy="bulk-finalized-qty-label"
            value={bulkApproveQty}
            onChange={setBulkApproveQty}
            min={0}
            max={Math.max(...(bulkApproveTargets?.map((r) => r.asIsQty * 10) ?? [1000]), 1000)}
          />
          <IconButton
            a11yLabel="Increase finalized quantity"
            size="small"
            variant="round"
            onClick={() => setBulkApproveQty((q) => Math.min(Math.max(...(bulkApproveTargets?.map((r) => r.asIsQty * 10) ?? [1000]), 1000), q + 1))}
          >
            <Icon name="Plus" decorative />
          </IconButton>
        </div>
      </Modal>
    </Page>
  );
}
