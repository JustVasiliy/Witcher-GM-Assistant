"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FieldError, Input } from "@/core/ui";
import { ArmorLocationsSchema, type ArmorLocations } from "../../schemas";
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

export const ARMOR_LABELS: Record<keyof ArmorLocations, string> = {
  head: "Head",
  torso: "Torso",
  rightHand: "Right Hand",
  leftHand: "Left Hand",
  rightLeg: "Right Leg",
  leftLeg: "Left Leg",
};

export const DEFAULT_ARMOR: ArmorLocations = {
  head: 0,
  torso: 0,
  rightHand: 0,
  leftHand: 0,
  rightLeg: 0,
  leftLeg: 0,
};

export function ArmorCard() {
  const armor = useNpcSheet().details.armor ?? DEFAULT_ARMOR;
  const keys = Object.keys(ARMOR_LABELS) as (keyof ArmorLocations)[];

  return (
    <EditableCard
      title="Armor"
      view={
        <FieldGrid>
          {keys.map((key) => (
            <ReadRow key={key}>
              <ReadLabel>{ARMOR_LABELS[key]}</ReadLabel>
              <ReadValue>{armor[key]}</ReadValue>
            </ReadRow>
          ))}
        </FieldGrid>
      }
      renderEdit={({ cancel }) => <ArmorForm armor={armor} onCancel={cancel} />}
    />
  );
}

type ArmorFormProps = {
  armor: ArmorLocations;
  onCancel: () => void;
};

function ArmorForm({ armor, onCancel }: ArmorFormProps) {
  const sheet = useNpcSheet();
  const [serverError, setServerError] = useState<string | undefined>();
  const keys = Object.keys(ARMOR_LABELS) as (keyof ArmorLocations)[];
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ArmorLocations>({
    resolver: zodResolver(ArmorLocationsSchema),
    defaultValues: armor,
  });

  const onSubmit = handleSubmit(async (data) => {
    const result = await sheet.save({ details: { armor: data } });
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
            <label htmlFor={`armor-${key}`}>{ARMOR_LABELS[key]}</label>
            <Input
              id={`armor-${key}`}
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
