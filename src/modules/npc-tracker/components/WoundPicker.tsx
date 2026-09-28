"use client";

import { woundsBySeverity } from "../critical-wounds/catalog";
import type { WoundSeverity } from "../critical-wounds/types";
import {
  BackButton,
  EntryDescription,
  EntryHeader,
  EntryRoll,
  PickerEntry,
  PickerList,
} from "./WoundPicker.styles";

type WoundPickerProps = {
  severity: WoundSeverity;
  disabled: boolean;
  onBack: () => void;
  onPick: (woundKey: string) => void;
};

export function WoundPicker({
  severity,
  disabled,
  onBack,
  onPick,
}: WoundPickerProps) {
  return (
    <div>
      <BackButton
        type="button"
        aria-label="Back to severity selection"
        onClick={onBack}
      >
        &larr;
      </BackButton>
      <PickerList>
        {woundsBySeverity(severity).map((definition) => (
          <li key={definition.key}>
            <PickerEntry
              type="button"
              disabled={disabled}
              onClick={() => onPick(definition.key)}
            >
              <EntryHeader>
                <EntryRoll>{definition.roll}</EntryRoll>
                {definition.name}
              </EntryHeader>
              <EntryDescription>{definition.description}</EntryDescription>
            </PickerEntry>
          </li>
        ))}
      </PickerList>
    </div>
  );
}
