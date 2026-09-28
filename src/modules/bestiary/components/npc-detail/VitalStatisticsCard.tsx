"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FieldError, Input } from "@/core/ui";
import { VitalStatsSchema, type VitalStats } from "../../schemas";
import { saveButtonLabel, useNpcSheet } from "../../sheet/NpcSheetContext";
import { useEffectiveSheet } from "../../sheet/useEffectiveSheet";
import { EditableCard } from "./EditableCard";
import { HpChangeModal } from "./HpChangeModal";
import { ModifiedValue } from "./ModifiedValue";
import { StaminaChangeModal } from "./StaminaChangeModal";
import {
  ActionsRow,
  Field,
  FieldGrid,
  ReadLabel,
  ReadRow,
  ReadValue,
} from "./SharedCardFields.styles";
import { DamageButton } from "./VitalStatisticsCard.styles";

const VITAL_LABELS: Record<keyof VitalStats, string> = {
  stun: "Stun",
  stamina: "Stamina",
  recovery: "Recovery",
  hp: "Health Points",
  vigor: "Vigor",
};

const VITAL_KEYS = Object.keys(VITAL_LABELS) as (keyof VitalStats)[];

export function VitalStatisticsCard() {
  const { details, combat } = useNpcSheet();
  const { vitalStats } = details;
  const effective = useEffectiveSheet();
  const [isHpModalOpen, setIsHpModalOpen] = useState(false);
  const [isStaminaModalOpen, setIsStaminaModalOpen] = useState(false);

  // Only instances (encounter NPCs) have current HP/Stamina and can take
  // damage; a bestiary template shows plain max values.
  const current: Partial<Record<keyof VitalStats, number>> = combat
    ? { hp: combat.currentHp, stamina: combat.currentStamina }
    : {};
  const openModal: Partial<Record<keyof VitalStats, () => void>> = combat
    ? {
        hp: () => setIsHpModalOpen(true),
        stamina: () => setIsStaminaModalOpen(true),
      }
    : {};

  return (
    <>
      <EditableCard
        title="Vital Statistics"
        view={
          <FieldGrid>
            {VITAL_KEYS.map((key) => {
              const currentValue = current[key];
              const onOpen = openModal[key];
              return (
                <ReadRow key={key}>
                  <ReadLabel>{VITAL_LABELS[key]}</ReadLabel>
                  <ReadValue>
                    <ModifiedValue sources={effective.vitalSources(key)}>
                      {currentValue !== undefined
                        ? `${currentValue} / ${effective.vitalStats[key]}`
                        : effective.vitalStats[key]}
                    </ModifiedValue>
                    {onOpen && (
                      <DamageButton
                        type="button"
                        aria-label={`Apply damage to ${VITAL_LABELS[key]}`}
                        onClick={onOpen}
                      >
                        +
                      </DamageButton>
                    )}
                  </ReadValue>
                </ReadRow>
              );
            })}
          </FieldGrid>
        }
        renderEdit={({ cancel }) => (
          <VitalStatisticsForm vitalStats={vitalStats} onCancel={cancel} />
        )}
      />
      {isHpModalOpen && (
        <HpChangeModal onClose={() => setIsHpModalOpen(false)} />
      )}
      {isStaminaModalOpen && (
        <StaminaChangeModal onClose={() => setIsStaminaModalOpen(false)} />
      )}
    </>
  );
}

type VitalStatisticsFormProps = {
  vitalStats: VitalStats;
  onCancel: () => void;
};

function VitalStatisticsForm({
  vitalStats,
  onCancel,
}: VitalStatisticsFormProps) {
  const sheet = useNpcSheet();
  const [serverError, setServerError] = useState<string | undefined>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VitalStats>({
    resolver: zodResolver(VitalStatsSchema),
    defaultValues: vitalStats,
  });

  const onSubmit = handleSubmit(async (data) => {
    // Edits max values; the server clamps current HP/Stamina to the new max.
    const result = await sheet.save({ details: { vitalStats: data } });
    if (result?.error) {
      setServerError(result.error);
      return;
    }
    onCancel();
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGrid>
        {VITAL_KEYS.map((key) => (
          <Field key={key}>
            <label htmlFor={`vital-${key}`}>{VITAL_LABELS[key]}</label>
            <Input
              id={`vital-${key}`}
              type="number"
              min={0}
              aria-invalid={Boolean(errors[key])}
              {...register(key, { valueAsNumber: true })}
            />
            {errors[key] && <FieldError>{errors[key]?.message}</FieldError>}
          </Field>
        ))}
      </FieldGrid>
      {serverError && <FieldError>{serverError}</FieldError>}
      <ActionsRow>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : saveButtonLabel(sheet)}
        </Button>
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
      </ActionsRow>
    </form>
  );
}
