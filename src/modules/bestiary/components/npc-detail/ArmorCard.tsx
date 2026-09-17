"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FieldError, Input } from "@/core/ui";
import { ArmorLocationsSchema, type ArmorLocations } from "../../schemas";
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

const ARMOR_LABELS: Record<keyof ArmorLocations, string> = {
  head: "Head",
  torso: "Torso",
  rightHand: "Right Hand",
  leftHand: "Left Hand",
  rightLeg: "Right Leg",
  leftLeg: "Left Leg",
};

const DEFAULT_ARMOR: ArmorLocations = {
  head: 0,
  torso: 0,
  rightHand: 0,
  leftHand: 0,
  rightLeg: 0,
  leftLeg: 0,
};

type ArmorCardProps = {
  creature: Creature;
};

export function ArmorCard({ creature }: ArmorCardProps) {
  const armor = creature.details?.armor ?? DEFAULT_ARMOR;
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
      renderEdit={({ cancel }) => (
        <ArmorForm creature={creature} armor={armor} onCancel={cancel} />
      )}
    />
  );
}

type ArmorFormProps = {
  creature: Creature;
  armor: ArmorLocations;
  onCancel: () => void;
};

function ArmorForm({ creature, armor, onCancel }: ArmorFormProps) {
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
    const result = await saveNpcDetailsPatch(creature, { armor: data });
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
