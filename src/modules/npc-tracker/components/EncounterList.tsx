"use client";

import { startTransition, useState } from "react";
import { Button } from "@/core/ui";
import type { Creature } from "@/modules/bestiary/client";
import type { Note } from "@/generated/prisma/client";
import { createEncounter } from "../actions";
import type { EncounterWithDetails } from "../types";
import { EncounterRow } from "./EncounterRow";
import { Header, ListWrapper } from "./EncounterList.styles";

type EncounterListProps = {
  campaignId: string;
  sessionId: string;
  encounters: EncounterWithDetails[];
  creatureCatalog: Creature[];
  availableNotes: Note[];
};

export function EncounterList({
  campaignId,
  sessionId,
  encounters,
  creatureCatalog,
  availableNotes,
}: EncounterListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [prevEncounters, setPrevEncounters] = useState(encounters);

  if (encounters !== prevEncounters) {
    if (encounters.length > prevEncounters.length) {
      const newest = encounters[encounters.length - 1];
      if (newest) {
        setExpandedId(newest.id);
      }
    }
    setPrevEncounters(encounters);
  }

  return (
    <div>
      <Header>
        <h2>Encounters</h2>
        <Button
          type="button"
          onClick={() => {
            startTransition(() => {
              createEncounter(campaignId, sessionId);
            });
          }}
        >
          + Add Encounter
        </Button>
      </Header>
      <ListWrapper>
        {encounters.length === 0 && <p>No encounters yet.</p>}
        {encounters.map((encounter) => (
          <EncounterRow
            key={encounter.id}
            encounter={encounter}
            campaignId={campaignId}
            sessionId={sessionId}
            creatureCatalog={creatureCatalog}
            availableNotes={availableNotes}
            isExpanded={expandedId === encounter.id}
            onToggle={() =>
              setExpandedId((current) =>
                current === encounter.id ? null : encounter.id,
              )
            }
          />
        ))}
      </ListWrapper>
    </div>
  );
}
