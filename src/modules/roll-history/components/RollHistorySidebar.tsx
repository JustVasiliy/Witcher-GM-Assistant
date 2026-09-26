"use client";

import { useEffect, useState } from "react";
import { formatRollMessage } from "../formatRollMessage";
import { selectUserEntries, useRollHistoryStore } from "../store";
import {
  Aside,
  EmptyState,
  EntryItem,
  EntryList,
  Panel,
  PanelContent,
  PanelHeading,
  ToggleButton,
} from "./RollHistorySidebar.styles";

type RollHistorySidebarProps = {
  userId: string;
};

export function RollHistorySidebar({ userId }: RollHistorySidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const setUser = useRollHistoryStore((state) => state.setUser);
  const entries = useRollHistoryStore(selectUserEntries(userId));

  useEffect(() => {
    setUser(userId);
  }, [setUser, userId]);

  return (
    <Aside>
      <ToggleButton
        type="button"
        aria-label={isOpen ? "Close roll history" : "Open roll history"}
        onClick={() => setIsOpen((open) => !open)}
      >
        &#127922;
      </ToggleButton>
      <Panel $isOpen={isOpen} inert={!isOpen}>
        <PanelContent>
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
        </PanelContent>
      </Panel>
    </Aside>
  );
}
