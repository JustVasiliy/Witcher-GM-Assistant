"use client";

import { useId, useMemo, useState, useTransition } from "react";
import { Field, FieldError, Input, Modal } from "@/core/ui";
import type { Creature } from "@/modules/bestiary/client";
import { addNpcToEncounter } from "../actions";
import { AddNpcSchema, MAX_NPC_QUANTITY } from "../schemas";
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
  const [quantityInput, setQuantityInput] = useState("1");
  const [isPending, startTransition] = useTransition();
  const quantityId = useId();
  const quantityResult = AddNpcSchema.shape.quantity.safeParse(
    Number(quantityInput),
  );

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
    if (isPending) {
      return;
    }
    if (!quantityResult.success) {
      setError(quantityResult.error.issues[0]?.message);
      return;
    }
    const quantity = quantityResult.data;
    startTransition(async () => {
      const result = await addNpcToEncounter(
        encounterId,
        campaignId,
        sessionId,
        creature.source === "core" ? "CORE" : "CUSTOM",
        creature.id,
        quantity,
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
        <Field>
          <label htmlFor={quantityId}>Quantity</label>
          <Input
            id={quantityId}
            type="number"
            min={1}
            max={MAX_NPC_QUANTITY}
            value={quantityInput}
            aria-invalid={!quantityResult.success}
            onChange={(event) => {
              setQuantityInput(event.target.value);
              setError(undefined);
            }}
          />
        </Field>
      </SearchField>
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
            disabled={isPending}
            onClick={() => handleSelect(creature)}
          >
            {creature.name}
          </ResultRow>
        ))}
      </ResultList>
    </Modal>
  );
}
