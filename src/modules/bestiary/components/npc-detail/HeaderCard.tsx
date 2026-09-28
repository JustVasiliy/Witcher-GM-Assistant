"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FieldError, Input } from "@/core/ui";
import {
  HeaderSchema,
  THREAT_COMPLEXITIES,
  THREAT_DIFFICULTIES,
  type HeaderInput,
} from "../../schemas";
import { saveButtonLabel, useNpcSheet } from "../../sheet/NpcSheetContext";
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

export function HeaderCard() {
  const { name, details } = useNpcSheet();
  const { threatRating, bounty } = details;

  return (
    <EditableCard
      title="Header"
      view={
        <HeaderGrid>
          <ReadRow>
            <ReadLabel>Name</ReadLabel>
            <ReadValue>{name}</ReadValue>
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
      renderEdit={({ cancel }) => <HeaderForm onCancel={cancel} />}
    />
  );
}

type HeaderFormProps = {
  onCancel: () => void;
};

function HeaderForm({ onCancel }: HeaderFormProps) {
  const sheet = useNpcSheet();
  const [serverError, setServerError] = useState<string | undefined>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<HeaderInput>({
    resolver: zodResolver(HeaderSchema),
    defaultValues: {
      name: sheet.name,
      threatRating: sheet.details.threatRating ?? {
        difficulty: "EASY",
        complexity: "SIMPLE",
      },
      bounty: sheet.details.bounty ?? 0,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const result = await sheet.save({
      name: data.name,
      details: { threatRating: data.threatRating, bounty: data.bounty },
    });
    if (result?.error) {
      setServerError(result.error);
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
          {isSubmitting ? "Saving..." : saveButtonLabel(sheet)}
        </Button>
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
      </ActionsRow>
    </form>
  );
}
