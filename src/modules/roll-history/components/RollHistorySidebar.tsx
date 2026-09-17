"use client";

import { useState } from "react";
import { formatRollMessage } from "../formatRollMessage";
import { useRollHistoryStore } from "../store";
import {
  Aside,
  EmptyState,
  EntryItem,
  EntryList,
  Panel,
  PanelHeading,
  ToggleButton,
} from "./RollHistorySidebar.styles";

export function RollHistorySidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const entries = useRollHistoryStore((state) => state.entries);

  return (
    <Aside>
      <ToggleButton
        type="button"
        aria-label={isOpen ? "Close roll history" : "Open roll history"}
        onClick={() => setIsOpen((open) => !open)}
      >
        &#127922;
      </ToggleButton>
      {isOpen && (
        <Panel>
          <PanelHeading>Roll History</PanelHeading>
          {entries.length === 0 ? (
            <EmptyState>No rolls yet.</EmptyState>
          ) : (
            <EntryList>
              {entries.map((entry) => (
                <EntryItem key={entry.id} $success={entry.success}>
                  {formatRollMessage(entry)}
                </EntryItem>
              ))}
            </EntryList>
          )}
        </Panel>
      )}
    </Aside>
  );
}
