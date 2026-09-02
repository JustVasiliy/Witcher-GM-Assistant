"use client";

import {
  CREATURE_TYPES,
  TYPE_FILTER_LABELS,
  type CreatureType,
} from "../types";
import {
  ClearButton,
  Count,
  Option,
  OptionLabel,
  OptionList,
  Panel,
  PanelHeader,
  Title,
} from "./TypeFilter.styles";

type TypeFilterProps = {
  selected: Set<CreatureType>;
  counts: Record<CreatureType, number>;
  onChange: (next: Set<CreatureType>) => void;
};

export function TypeFilter({ selected, counts, onChange }: TypeFilterProps) {
  function toggle(type: CreatureType) {
    const next = new Set(selected);
    if (next.has(type)) {
      next.delete(type);
    } else {
      next.add(type);
    }
    onChange(next);
  }

  return (
    <Panel>
      <PanelHeader>
        <Title>Filters</Title>
        <ClearButton
          type="button"
          disabled={selected.size === 0}
          onClick={() => onChange(new Set())}
        >
          Clear all
        </ClearButton>
      </PanelHeader>
      <OptionList>
        {CREATURE_TYPES.map((type) => (
          <Option key={type}>
            <input
              type="checkbox"
              id={`type-${type}`}
              checked={selected.has(type)}
              onChange={() => toggle(type)}
            />
            <OptionLabel htmlFor={`type-${type}`}>
              {TYPE_FILTER_LABELS[type]}
              <Count>{counts[type]}</Count>
            </OptionLabel>
          </Option>
        ))}
      </OptionList>
    </Panel>
  );
}
