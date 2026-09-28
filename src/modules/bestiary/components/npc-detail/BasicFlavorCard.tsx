"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, FieldError, Input } from "@/core/ui";
import type { Flavor } from "../../schemas";
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

const BasicFlavorSchema = z.object({
  height: z
    .string()
    .trim()
    .max(40, "Height must be 40 characters or fewer.")
    .optional(),
  weight: z
    .string()
    .trim()
    .max(40, "Weight must be 40 characters or fewer.")
    .optional(),
  environment: z
    .string()
    .trim()
    .max(200, "Environment must be 200 characters or fewer.")
    .optional(),
  intelligenceDescription: z
    .string()
    .trim()
    .max(300, "Intelligence description must be 300 characters or fewer.")
    .optional(),
  organization: z
    .string()
    .trim()
    .max(200, "Organization must be 200 characters or fewer.")
    .optional(),
});
type BasicFlavorInput = z.infer<typeof BasicFlavorSchema>;

const BASIC_FLAVOR_LABELS: Record<keyof BasicFlavorInput, string> = {
  height: "Height",
  weight: "Weight",
  environment: "Environment",
  intelligenceDescription: "Intelligence",
  organization: "Organization",
};

export function BasicFlavorCard() {
  const { flavor } = useNpcSheet().details;
  const keys = Object.keys(BASIC_FLAVOR_LABELS) as (keyof BasicFlavorInput)[];

  return (
    <EditableCard
      title="Flavor"
      view={
        <FieldGrid>
          {keys.map((key) => (
            <ReadRow key={key}>
              <ReadLabel>{BASIC_FLAVOR_LABELS[key]}</ReadLabel>
              <ReadValue>{flavor?.[key] ?? "—"}</ReadValue>
            </ReadRow>
          ))}
        </FieldGrid>
      }
      renderEdit={({ cancel }) => (
        <BasicFlavorForm flavor={flavor} onCancel={cancel} />
      )}
    />
  );
}

type BasicFlavorFormProps = {
  flavor: Flavor | undefined;
  onCancel: () => void;
};

function BasicFlavorForm({ flavor, onCancel }: BasicFlavorFormProps) {
  const sheet = useNpcSheet();
  const [serverError, setServerError] = useState<string | undefined>();
  const keys = Object.keys(BASIC_FLAVOR_LABELS) as (keyof BasicFlavorInput)[];
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BasicFlavorInput>({
    resolver: zodResolver(BasicFlavorSchema),
    defaultValues: {
      height: flavor?.height ?? "",
      weight: flavor?.weight ?? "",
      environment: flavor?.environment ?? "",
      intelligenceDescription: flavor?.intelligenceDescription ?? "",
      organization: flavor?.organization ?? "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const result = await sheet.save({
      details: { flavor: { ...flavor, ...data } },
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
        {keys.map((key) => (
          <Field key={key}>
            <label htmlFor={`flavor-${key}`}>{BASIC_FLAVOR_LABELS[key]}</label>
            <Input
              id={`flavor-${key}`}
              type="text"
              aria-invalid={Boolean(errors[key])}
              {...register(key)}
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
