"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FieldError, Input } from "@/core/ui";
import { buildDefaultNpcDetails } from "../../npc-defaults";
import { VitalStatsSchema, type VitalStats } from "../../schemas";
import type { Creature } from "../../types";
import { EditableCard } from "./EditableCard";
import { HpChangeModal } from "./HpChangeModal";
import { saveNpcDetailsPatch } from "./saveNpcDetailsPatch";
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

const DAMAGEABLE_VITALS: (keyof VitalStats)[] = ["hp", "stamina"];

type VitalStatisticsCardProps = {
  creature: Creature;
};

export function VitalStatisticsCard({ creature }: VitalStatisticsCardProps) {
  const vitalStats =
    creature.details?.vitalStats ?? buildDefaultNpcDetails().vitalStats;
  const keys = Object.keys(VITAL_LABELS) as (keyof VitalStats)[];
  const [isHpModalOpen, setIsHpModalOpen] = useState(false);

  return (
    <>
      <EditableCard
        title="Vital Statistics"
        view={
          <FieldGrid>
            {keys.map((key) => (
              <ReadRow key={key}>
                <ReadLabel>{VITAL_LABELS[key]}</ReadLabel>
                <ReadValue>
                  {vitalStats[key]}
                  {DAMAGEABLE_VITALS.includes(key) && (
                    <DamageButton
                      type="button"
                      aria-label={`Apply damage to ${VITAL_LABELS[key]}`}
                      onClick={
                        key === "hp" ? () => setIsHpModalOpen(true) : undefined
                      }
                    >
                      +
                    </DamageButton>
                  )}
                </ReadValue>
              </ReadRow>
            ))}
          </FieldGrid>
        }
        renderEdit={({ cancel }) => (
          <VitalStatisticsForm
            creature={creature}
            vitalStats={vitalStats}
            onCancel={cancel}
          />
        )}
      />
      {isHpModalOpen && (
        <HpChangeModal
          creature={creature}
          vitalStats={vitalStats}
          onClose={() => setIsHpModalOpen(false)}
        />
      )}
    </>
  );
}

type VitalStatisticsFormProps = {
  creature: Creature;
  vitalStats: VitalStats;
  onCancel: () => void;
};

function VitalStatisticsForm({
  creature,
  vitalStats,
  onCancel,
}: VitalStatisticsFormProps) {
  const [serverError, setServerError] = useState<string | undefined>();
  const keys = Object.keys(VITAL_LABELS) as (keyof VitalStats)[];
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VitalStats>({
    resolver: zodResolver(VitalStatsSchema),
    defaultValues: vitalStats,
  });

  const onSubmit = handleSubmit(async (data) => {
    const result = await saveNpcDetailsPatch(creature, { vitalStats: data });
    if (result?.error) {
      setServerError(result.error);
      return;
    }
    onCancel();
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGrid>
        {keys.map((key) => (
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
          {isSubmitting
            ? "Saving..."
            : creature.source === "core"
              ? "Save as New NPC"
              : "Save"}
        </Button>
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
      </ActionsRow>
    </form>
  );
}
