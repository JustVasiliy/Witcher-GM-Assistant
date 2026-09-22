"use client";

import { startTransition, useMemo, useState } from "react";
import { FieldError, Input, Modal } from "@/core/ui";
import type { Creature } from "@/modules/bestiary/client";
import { addNpcToEncounter } from "../actions";
import {
  EmptyResult,
  ResultList,
  ResultRow,
  SearchField,
} from "./PickerModal.styles";

type AddNpcModalProps = {
  encounterId: string;
  campaignId: string;
  sessionId: string;
  creatureCatalog: Creature[];
  onClose: () => void;
};

export function AddNpcModal({
  encounterId,
  campaignId,
  sessionId,
  creatureCatalog,
  onClose,
}: AddNpcModalProps) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | undefined>();

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return creatureCatalog
      .filter(
        (creature) =>
          !normalized || creature.name.toLowerCase().includes(normalized),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [creatureCatalog, query]);

  function handleSelect(creature: Creature) {
    startTransition(async () => {
      const result = await addNpcToEncounter(
        encounterId,
        campaignId,
        sessionId,
        creature.source === "core" ? "CORE" : "CUSTOM",
        creature.id,
      );
      if (result?.error) {
        setError(result.error);
        return;
      }
      onClose();
    });
  }

  return (
    <Modal title="Add NPC" onClose={onClose}>
      {error && <FieldError>{error}</FieldError>}
      <SearchField>
        <Input
          type="search"
          placeholder="Search creatures..."
          aria-label="Search creatures"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoFocus
        />
      </SearchField>
      <ResultList>
        {filtered.length === 0 && (
          <EmptyResult>No creatures found.</EmptyResult>
        )}
        {filtered.map((creature) => (
          <ResultRow
            key={`${creature.source}-${creature.id}`}
            type="button"
            onClick={() => handleSelect(creature)}
          >
            {creature.name}
          </ResultRow>
        ))}
      </ResultList>
    </Modal>
  );
}
