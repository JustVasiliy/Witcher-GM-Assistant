"use client";

import { startTransition, useMemo, useState } from "react";
import { FieldError, Input, Modal } from "@/core/ui";
import type { Note } from "@/generated/prisma/client";
import { attachNoteToEncounter } from "../actions";
import {
  EmptyResult,
  ResultList,
  ResultRow,
  SearchField,
} from "./PickerModal.styles";

type AttachNoteModalProps = {
  encounterId: string;
  campaignId: string;
  sessionId: string;
  availableNotes: Note[];
  onClose: () => void;
};

export function AttachNoteModal({
  encounterId,
  campaignId,
  sessionId,
  availableNotes,
  onClose,
}: AttachNoteModalProps) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | undefined>();

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return availableNotes
      .filter(
        (note) => !normalized || note.title.toLowerCase().includes(normalized),
      )
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [availableNotes, query]);

  function handleSelect(note: Note) {
    startTransition(async () => {
      const result = await attachNoteToEncounter(
        encounterId,
        campaignId,
        sessionId,
        note.id,
      );
      if (result?.error) {
        setError(result.error);
        return;
      }
      onClose();
    });
  }

  return (
    <Modal title="Attach Note" onClose={onClose}>
      {error && <FieldError>{error}</FieldError>}
      <SearchField>
        <Input
          type="search"
          placeholder="Search notes..."
          aria-label="Search notes"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoFocus
        />
      </SearchField>
      <ResultList>
        {filtered.length === 0 && <EmptyResult>No notes found.</EmptyResult>}
        {filtered.map((note) => (
          <ResultRow
            key={note.id}
            type="button"
            onClick={() => handleSelect(note)}
          >
            {note.title}
          </ResultRow>
        ))}
      </ResultList>
    </Modal>
  );
}
