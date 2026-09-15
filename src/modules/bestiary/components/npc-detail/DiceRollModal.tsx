"use client";

import { useId, useState, type FormEvent } from "react";
import { Button, Input, Modal } from "@/core/ui";
import { ActionsRow, Field } from "./SharedCardFields.styles";
import { RollExpression, RollTotal } from "./DiceRollModal.styles";
import { SideSelectModal } from "./SideSelectModal";

export type RollSide = "attacking" | "defending";

type DiceRollModalProps = {
  label: string;
  base: number;
  onClose: () => void;
};

export function DiceRollModal({ label, base, onClose }: DiceRollModalProps) {
  const [side, setSide] = useState<RollSide | null>(null);

  if (!side) {
    return <SideSelectModal onSelect={setSide} onClose={onClose} />;
  }

  return <RollForm label={label} base={base} side={side} onClose={onClose} />;
}

type RollFormProps = {
  label: string;
  base: number;
  side: RollSide;
  onClose: () => void;
};

function RollForm({ label, base, side, onClose }: RollFormProps) {
  const [rollResult, setRollResult] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const difficultyId = useId();

  const rollValue = Number(rollResult);
  const total =
    rollResult !== "" && !Number.isNaN(rollValue) ? base + rollValue : base;

  const difficultyValue = Number(difficulty);
  const isDifficultyValid =
    difficulty !== "" && !Number.isNaN(difficultyValue);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isDifficultyValid) {
      return;
    }
    const success =
      side === "attacking"
        ? total > difficultyValue
        : total >= difficultyValue;
    console.log(
      `${label} roll: total ${total} vs difficulty ${difficultyValue} (${side}) -> ${success ? "Success" : "Failure"}`,
    );
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
          <Button type="submit" disabled={!isDifficultyValid}>
            Submit
          </Button>
        </ActionsRow>
      </form>
    </Modal>
  );
}
