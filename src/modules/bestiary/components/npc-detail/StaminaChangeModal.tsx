"use client";

import { useId, useState, type FormEvent } from "react";
import { Button, FieldError, Input, Modal } from "@/core/ui";
import { useNpcCombat, useNpcSheet } from "../../sheet/NpcSheetContext";
import { applyStaminaDelta, parseStaminaDelta } from "./stamina-change";
import { ActionsRow, Field } from "./SharedCardFields.styles";

const QUICK_DELTAS = [-3, -1];

type StaminaChangeModalProps = {
  onClose: () => void;
};

export function StaminaChangeModal({ onClose }: StaminaChangeModalProps) {
  const sheet = useNpcSheet();
  const { currentStamina } = useNpcCombat();
  const maxStamina = sheet.details.vitalStats.stamina;
  const [valueInput, setValueInput] = useState("");
  const [serverError, setServerError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const valueId = useId();

  const parsedDelta = parseStaminaDelta(valueInput);
  const isValueValid = parsedDelta !== null;

  async function applyDelta(delta: number) {
    setIsSubmitting(true);
    setServerError(undefined);

    const result = await sheet.save({
      combat: {
        currentStamina: applyStaminaDelta(currentStamina, delta, maxStamina),
      },
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
    <Modal
      title={`Stamina: ${currentStamina} / ${maxStamina}`}
      onClose={onClose}
    >
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
