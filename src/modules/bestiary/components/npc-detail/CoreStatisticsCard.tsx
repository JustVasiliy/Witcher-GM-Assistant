"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FieldError, Input } from "@/core/ui";
import { buildDefaultNpcDetails } from "../../npc-defaults";
import { CoreStatsSchema, STAT_KEYS, type CoreStats } from "../../schemas";
import type { Creature } from "../../types";
import { EditableCard } from "./EditableCard";
import { saveNpcDetailsPatch } from "./saveNpcDetailsPatch";
import {
  ActionsRow,
  Field,
  FieldGrid,
  ReadLabel,
  ReadRow,
  ReadValue,
} from "./SharedCardFields.styles";

const STAT_LABELS: Record<(typeof STAT_KEYS)[number], string> = {
  INT: "Intelligence",
  REF: "Reflexes",
  DEX: "Dexterity",
  BODY: "Body",
  SPD: "Speed",
  EMP: "Empathy",
  CRA: "Craft",
  WILL: "Willpower",
  LUCK: "Luck",
};

type CoreStatisticsCardProps = {
  creature: Creature;
};

export function CoreStatisticsCard({ creature }: CoreStatisticsCardProps) {
  const coreStats =
    creature.details?.coreStats ?? buildDefaultNpcDetails().coreStats;

  return (
    <EditableCard
      title="Core Statistics"
      view={
        <FieldGrid>
          {STAT_KEYS.map((key) => (
            <ReadRow key={key}>
              <ReadLabel>{STAT_LABELS[key]}</ReadLabel>
              <ReadValue>{coreStats[key]}</ReadValue>
            </ReadRow>
          ))}
        </FieldGrid>
      }
      renderEdit={({ cancel }) => (
        <CoreStatisticsForm
          creature={creature}
          coreStats={coreStats}
          onCancel={cancel}
        />
      )}
    />
  );
}

type CoreStatisticsFormProps = {
  creature: Creature;
  coreStats: CoreStats;
  onCancel: () => void;
};

function CoreStatisticsForm({
  creature,
  coreStats,
  onCancel,
}: CoreStatisticsFormProps) {
  const [serverError, setServerError] = useState<string | undefined>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CoreStats>({
    resolver: zodResolver(CoreStatsSchema),
    defaultValues: coreStats,
  });

  const onSubmit = handleSubmit(async (data) => {
    const result = await saveNpcDetailsPatch(creature, { coreStats: data });
    if (result?.error) {
      setServerError(result.error);
      return;
    }
    onCancel();
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGrid>
        {STAT_KEYS.map((key) => (
          <Field key={key}>
            <label htmlFor={`core-stat-${key}`}>{STAT_LABELS[key]}</label>
            <Input
              id={`core-stat-${key}`}
              type="number"
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
