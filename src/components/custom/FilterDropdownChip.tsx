import * as React from 'react';
import { FilterChip } from '../FilterChip';
import { Checkbox } from '../Checkbox';
import { Body } from '../Text';
import { LinkButton } from '../LinkButton';
import {
  SelectDropdown,
  SelectDropdownTrigger,
  SelectDropdownContent,
  SelectDropdownRadioGroup,
  SelectDropdownRadioItem,
} from '../SelectDropdown';

export interface FilterDropdownChipOption {
  value: string;
  label: string;
}

// Beyond this many options the list scrolls instead of growing the popover
// indefinitely. ~40px is one checkbox/radio row (label + padding).
const MAX_VISIBLE_OPTIONS = 10;
const OPTION_ROW_HEIGHT = 40;

function scrollableListStyle(optionCount: number): React.CSSProperties | undefined {
  if (optionCount <= MAX_VISIBLE_OPTIONS) return undefined;
  return { maxHeight: MAX_VISIBLE_OPTIONS * OPTION_ROW_HEIGHT, overflowY: 'auto' };
}

interface FilterDropdownChipBaseProps {
  label: string;
  options: FilterDropdownChipOption[];
  align?: 'start' | 'center' | 'end';
}

interface FilterDropdownChipSingleProps extends FilterDropdownChipBaseProps {
  multiple?: false;
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
}

interface FilterDropdownChipMultiProps extends FilterDropdownChipBaseProps {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
  /** Sentinel option value (e.g. "all") excluded from the checkbox list — an empty selection means "all". */
  defaultValue?: string;
}

type FilterDropdownChipProps = FilterDropdownChipSingleProps | FilterDropdownChipMultiProps;

/**
 * Compact pill filter trigger matching the Figma "[PX] Filter Button Group"
 * anatomy: a bordered pill with a label + chevron that opens an options
 * popover. Composes the generated `FilterChip` (visual pill + chevron) as the
 * `SelectDropdown` trigger.
 *
 * Single-select (default): `SelectDropdownRadioGroup` / `SelectDropdownRadioItem`
 * provide real single-select semantics (menuitemradio items in a menu — not a
 * visible always-on radiogroup, so this does not fall under the
 * ChipGroup/Chip single-select a11y prohibition). Picking an option closes
 * the menu.
 *
 * Multi-select (`multiple`): a real `Checkbox` component per option lets the
 * user toggle several values at once; the menu stays open between picks so
 * multiple options can be selected in one pass. The sentinel "all" option
 * (`defaultValue`) is omitted from the checkbox list — an empty selection
 * already means "all".
 */
export function FilterDropdownChip(props: FilterDropdownChipProps) {
  const { label, options, align = 'start' } = props;
  const [open, setOpen] = React.useState(false);

  if (props.multiple) {
    const { value, onChange, defaultValue = 'all' } = props;
    const selectedValues = value;
    const isActive = selectedValues.length > 0;
    const selectedLabels = options
      .filter((option) => selectedValues.includes(option.value))
      .map((option) => option.label);
    const chipLabel =
      selectedLabels.length === 0
        ? label
        : selectedLabels.length === 1
        ? `${label}: ${selectedLabels[0]}`
        : `${label} (${selectedLabels.length})`;
    const selectableOptions = options.filter((option) => option.value !== defaultValue);

    return (
      <SelectDropdown open={open} onOpenChange={setOpen}>
        <SelectDropdownTrigger asChild>
          <FilterChip isMultiSelect isOpen={open} selected={isActive} aria-label={`${label} filter`}>
            {chipLabel}
          </FilterChip>
        </SelectDropdownTrigger>
        <SelectDropdownContent align={align}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--ld-primitive-scale-space-100)',
              padding: 'var(--ld-primitive-scale-space-100) var(--ld-primitive-scale-space-200)',
              borderBottom: '1px solid var(--ld-semantic-color-separator, #e3e4e5)',
            }}
          >
            <Body as="span" size="small" color="subtle">{selectedValues.length} selected</Body>
            <LinkButton size="small" disabled={selectedValues.length === 0} onClick={() => onChange([])}>
              Clear all
            </LinkButton>
          </div>
          <div
            style={{
              // The first row's own top padding (space-100, 8px) already
              // creates some separation from the header's border; add
              // another 8px on top of that so the gap reads as intentional
              // rather than incidental.
              paddingTop: 'var(--ld-primitive-scale-space-100)',
              ...scrollableListStyle(selectableOptions.length),
            }}
          >
            {selectableOptions.map((option) => (
              <div
                key={option.value}
                style={{
                  padding: 'var(--ld-primitive-scale-space-100) var(--ld-primitive-scale-space-200)',
                }}
              >
                <Checkbox
                  label={option.label}
                  checked={selectedValues.includes(option.value)}
                  onChange={(event) => {
                    const checked = event.target.checked;
                    const next = checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter((v) => v !== option.value);
                    onChange(next);
                  }}
                />
              </div>
            ))}
          </div>
        </SelectDropdownContent>
      </SelectDropdown>
    );
  }

  const { value, onChange, defaultValue = 'all' } = props;
  const selectedOption = options.find((option) => option.value === value);
  const isActive = value !== defaultValue;
  const chipLabel = isActive && selectedOption ? `${label}: ${selectedOption.label}` : label;

  return (
    <SelectDropdown open={open} onOpenChange={setOpen}>
      <SelectDropdownTrigger asChild>
        <FilterChip isMultiSelect isOpen={open} selected={isActive} aria-label={`${label} filter`}>
          {chipLabel}
        </FilterChip>
      </SelectDropdownTrigger>
      <SelectDropdownContent align={align}>
        <div style={scrollableListStyle(options.length)}>
          <SelectDropdownRadioGroup
            value={value}
            onValueChange={(next) => {
              onChange(next);
              setOpen(false);
            }}
          >
            {options.map((option) => (
              <SelectDropdownRadioItem key={option.value} value={option.value}>
                {option.label}
              </SelectDropdownRadioItem>
            ))}
          </SelectDropdownRadioGroup>
        </div>
      </SelectDropdownContent>
    </SelectDropdown>
  );
}
