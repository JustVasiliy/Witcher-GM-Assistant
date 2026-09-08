"use client";

import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { FieldError, Input } from "@/core/ui";
import type { Creature } from "../../types";
import { EditableListCard } from "./EditableListCard";
import { saveNpcDetailsPatch } from "./saveNpcDetailsPatch";
import { Field } from "./SharedCardFields.styles";

const WeaknessItemSchema = z
  .string()
  .trim()
  .min(1, "Weakness cannot be empty.");

type WeaknessesCardProps = {
  creature: Creature;
};

export function WeaknessesCard({ creature }: WeaknessesCardProps) {
  const weaknesses = creature.details?.weaknesses ?? [];

  return (
    <EditableListCard<string>
      title="Weaknesses"
      items={weaknesses}
      emptyItem=""
      itemSchema={WeaknessItemSchema}
      addLabel="+ Add Weakness"
      saveLabel={creature.source === "core" ? "Save as New NPC" : "Save"}
      renderView={(weakness) => <span>{weakness}</span>}
      renderEditRow={(index) => <WeaknessField index={index} />}
      onSave={(items) => saveNpcDetailsPatch(creature, { weaknesses: items })}
    />
  );
}

type WeaknessFieldProps = {
  index: number;
};

function WeaknessField({ index }: WeaknessFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<{ items: string[] }>();
  const rowError = errors.items?.[index];

  return (
    <Field>
      <label htmlFor={`weakness-${index}`}>Weakness</label>
      <Input
        id={`weakness-${index}`}
        type="text"
        {...register(`items.${index}`)}
      />
      {rowError?.message && <FieldError>{rowError.message}</FieldError>}
    </Field>
  );
}
