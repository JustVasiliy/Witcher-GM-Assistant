"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FieldError, Input } from "@/core/ui";
import {
  forkCoreCreature,
  updateCustomNpcDetails,
  updateCustomNpcName,
} from "../../actions";
import {
  HeaderSchema,
  THREAT_COMPLEXITIES,
  THREAT_DIFFICULTIES,
  type HeaderInput,
} from "../../schemas";
import type { Creature } from "../../types";
import { EditableCard } from "./EditableCard";
import {
  ActionsRow,
  Field,
  FieldGrid,
  ReadLabel,
  ReadRow,
  ReadValue,
} from "./SharedCardFields.styles";
import { HeaderGrid, NoWrapValue, Select } from "./HeaderCard.styles";

type HeaderCardProps = {
  creature: Creature;
};

export function HeaderCard({ creature }: HeaderCardProps) {
  const isCore = creature.source === "core";
  const threatRating = creature.details?.threatRating;
  const bounty = creature.details?.bounty;

  return (
    <EditableCard
      title="Header"
      view={
        <HeaderGrid>
          <ReadRow>
            <ReadLabel>Name</ReadLabel>
            <ReadValue>{creature.name}</ReadValue>
          </ReadRow>
          <ReadRow>
            <ReadLabel>Threat</ReadLabel>
            <NoWrapValue>
              {threatRating
                ? `${threatRating.difficulty} / ${threatRating.complexity}`
                : "—"}
            </NoWrapValue>
          </ReadRow>
          <ReadRow>
            <ReadLabel>Bounty</ReadLabel>
            <NoWrapValue>
              {bounty !== undefined ? `${bounty} Crowns` : "—"}
            </NoWrapValue>
          </ReadRow>
        </HeaderGrid>
      }
      renderEdit={({ cancel }) => (
        <HeaderForm creature={creature} isCore={isCore} onCancel={cancel} />
      )}
    />
  );
}

type HeaderFormProps = {
  creature: Creature;
  isCore: boolean;
  onCancel: () => void;
};

function HeaderForm({ creature, isCore, onCancel }: HeaderFormProps) {
  const [serverError, setServerError] = useState<string | undefined>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<HeaderInput>({
    resolver: zodResolver(HeaderSchema),
    defaultValues: {
      name: creature.name,
      threatRating: creature.details?.threatRating ?? {
        difficulty: "EASY",
        complexity: "SIMPLE",
      },
      bounty: creature.details?.bounty ?? 0,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    if (isCore) {
      const result = await forkCoreCreature(
        creature.id,
        { threatRating: data.threatRating, bounty: data.bounty },
        data.name,
      );
      if (result?.error) {
        setServerError(result.error);
      }
      return;
    }

    const [nameResult, detailsResult] = await Promise.all([
      updateCustomNpcName(creature.id, data.name),
      updateCustomNpcDetails(creature.id, {
        threatRating: data.threatRating,
        bounty: data.bounty,
      }),
    ]);
    const error = nameResult?.error ?? detailsResult?.error;
    if (error) {
      setServerError(error);
      return;
    }
    onCancel();
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGrid>
        <Field>
          <label htmlFor="header-name">Name</label>
          <Input
            id="header-name"
            type="text"
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>
        <Field>
          <label htmlFor="header-difficulty">Threat difficulty</label>
          <Select
            id="header-difficulty"
            {...register("threatRating.difficulty")}
          >
            {THREAT_DIFFICULTIES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
        </Field>
        <Field>
          <label htmlFor="header-complexity">Threat complexity</label>
          <Select
            id="header-complexity"
            {...register("threatRating.complexity")}
          >
            {THREAT_COMPLEXITIES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
        </Field>
        <Field>
          <label htmlFor="header-bounty">Bounty (Crowns)</label>
          <Input
            id="header-bounty"
            type="number"
            min={0}
            aria-invalid={Boolean(errors.bounty)}
            {...register("bounty", { valueAsNumber: true })}
          />
          {errors.bounty && <FieldError>{errors.bounty.message}</FieldError>}
        </Field>
      </FieldGrid>
      {serverError && <FieldError>{serverError}</FieldError>}
      <ActionsRow>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isCore ? "Save as New NPC" : "Save"}
        </Button>
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
      </ActionsRow>
    </form>
  );
}
