"use client";

import { useId, useState, type FormEvent } from "react";
import { Button, FieldError, Input, Modal } from "@/core/ui";
import type { VitalStats } from "../../schemas";
import type { Creature } from "../../types";
import { saveNpcDetailsPatch } from "./saveNpcDetailsPatch";
import { applyStaminaDelta, parseStaminaDelta } from "./stamina-change";
import { ActionsRow, Field } from "./SharedCardFields.styles";

const QUICK_DELTAS = [-3, -1];

type StaminaChangeModalProps = {
  creature: Creature;
  vitalStats: VitalStats;
  onClose: () => void;
};

export function StaminaChangeModal({
  creature,
  vitalStats,
  onClose,
}: StaminaChangeModalProps) {
  const [valueInput, setValueInput] = useState("");
  const [serverError, setServerError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const valueId = useId();

  const parsedDelta = parseStaminaDelta(valueInput);
  const isValueValid = parsedDelta !== null;

  async function applyDelta(delta: number) {
    setIsSubmitting(true);
    setServerError(undefined);

    const nextStamina = applyStaminaDelta(vitalStats.stamina, delta);
    const result = await saveNpcDetailsPatch(creature, {
      vitalStats: { ...vitalStats, stamina: nextStamina },
    });

    setIsSubmitting(false);
    if (result?.error) {
      setServerError(result.error);
      return;
    }
    onClose();
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (parsedDelta === null) return;
    void applyDelta(parsedDelta);
  }

  return (
    <Modal title={`Stamina: ${vitalStats.stamina}`} onClose={onClose}>
      <ActionsRow>
        {QUICK_DELTAS.map((delta) => (
          <Button
            key={delta}
            type="button"
            disabled={isSubmitting}
            onClick={() => void applyDelta(delta)}
          >
            {delta} Stamina
          </Button>
        ))}
      </ActionsRow>

      <form onSubmit={handleSubmit} noValidate>
        <Field>
          <label htmlFor={valueId}>Value</label>
          <Input
            id={valueId}
            type="text"
            placeholder="-1, +2, ..."
            value={valueInput}
            onChange={(event) => setValueInput(event.target.value)}
            autoFocus
          />
        </Field>

        {serverError && <FieldError>{serverError}</FieldError>}

        <ActionsRow>
          <Button type="submit" disabled={isSubmitting || !isValueValid}>
            {isSubmitting ? "Applying..." : "Apply"}
          </Button>
        </ActionsRow>
      </form>
    </Modal>
  );
}
