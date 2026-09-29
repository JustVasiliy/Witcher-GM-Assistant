"use client";

import { useId, useState, type FormEvent } from "react";
import { Button, Input, Modal } from "@/core/ui";
import { useRollHistoryStore, type RollSide } from "@/modules/roll-history";
import type { SkillName } from "../../schemas";
import { useEffectiveSheet } from "../../sheet/useEffectiveSheet";
import { ActionsRow, Field } from "./SharedCardFields.styles";
import {
  RollExpression,
  RollModifiers,
  RollTotal,
} from "./DiceRollModal.styles";
import { SideSelectModal } from "./SideSelectModal";

type DiceRollModalProps = {
  label: string;
  skill: SkillName;
  base: number;
  onClose: () => void;
};

export function DiceRollModal({
  label,
  skill,
  base,
  onClose,
}: DiceRollModalProps) {
  const [side, setSide] = useState<RollSide | null>(null);

  if (!side) {
    return <SideSelectModal onSelect={setSide} onClose={onClose} />;
  }

  return (
    <RollForm
      label={label}
      skill={skill}
      base={base}
      side={side}
      onClose={onClose}
    />
  );
}

type RollFormProps = {
  label: string;
  skill: SkillName;
  base: number;
  side: RollSide;
  onClose: () => void;
};

function RollForm({ label, skill, base, side, onClose }: RollFormProps) {
  const addRoll = useRollHistoryStore((state) => state.addRoll);
  const [rollResult, setRollResult] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const difficultyId = useId();

  const sideModifiers = useEffectiveSheet().rollModifiers(skill, side);
  const rollBase = base + sideModifiers.total;

  const rollValue = Number(rollResult);
  const total =
    rollResult !== "" && !Number.isNaN(rollValue)
      ? rollBase + rollValue
      : rollBase;

  const difficultyValue = Number(difficulty);
  const isDifficultyValid = difficulty !== "" && !Number.isNaN(difficultyValue);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isDifficultyValid) {
      return;
    }
    addRoll({
      label,
      skill,
      side,
      total,
      difficulty: difficultyValue,
    });
    onClose();
  }

  return (
    <Modal title={`Roll ${label}`} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <RollExpression>
          <span>{rollBase} +</span>
          <Input
            type="number"
            aria-label="Roll result"
            value={rollResult}
            onChange={(event) => setRollResult(event.target.value)}
            autoFocus
          />
        </RollExpression>
        {sideModifiers.sources.length > 0 && (
          <RollModifiers aria-label="Roll modifiers">
            {sideModifiers.sources.map((source, index) => (
              <li key={`${index}-${source}`}>{source}</li>
            ))}
          </RollModifiers>
        )}
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
