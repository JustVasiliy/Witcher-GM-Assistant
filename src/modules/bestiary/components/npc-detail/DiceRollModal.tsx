"use client";

import { useId, useState, type FormEvent } from "react";
import { Button, Input, Modal } from "@/core/ui";
import { ActionsRow, Field } from "./SharedCardFields.styles";
import { RollExpression, RollTotal } from "./DiceRollModal.styles";

type DiceRollModalProps = {
  label: string;
  base: number;
  onClose: () => void;
};

export function DiceRollModal({ label, base, onClose }: DiceRollModalProps) {
  const [rollResult, setRollResult] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const difficultyId = useId();

  const rollValue = Number(rollResult);
  const total =
    rollResult !== "" && !Number.isNaN(rollValue) ? base + rollValue : base;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onClose();
  }

  return (
    <Modal title={`Roll ${label}`} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <RollExpression>
          <span>{base} +</span>
          <Input
            type="number"
            aria-label="Roll result"
            value={rollResult}
            onChange={(event) => setRollResult(event.target.value)}
            autoFocus
          />
        </RollExpression>
        <RollTotal>
          Total: <strong>{total}</strong>
        </RollTotal>
        <Field>
          <label htmlFor={difficultyId}>Difficulty</label>
          <Input
            id={difficultyId}
            type="number"
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
          />
        </Field>
        <ActionsRow>
          <Button type="submit">Submit</Button>
        </ActionsRow>
      </form>
    </Modal>
  );
}
