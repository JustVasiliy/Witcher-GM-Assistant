"use client";

import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { FieldError, Input } from "@/core/ui";
import { saveButtonLabel, useNpcSheet } from "../../sheet/NpcSheetContext";
import { EditableListCard } from "./EditableListCard";
import { Field, ReadValue } from "./SharedCardFields.styles";

const WeaknessItemSchema = z
  .string()
  .trim()
  .min(1, "Weakness cannot be empty.");

export function WeaknessesCard() {
  const sheet = useNpcSheet();
  const { weaknesses } = sheet.details;

  return (
    <EditableListCard<string>
      title="Weaknesses"
      items={weaknesses}
      emptyItem=""
      itemSchema={WeaknessItemSchema}
      addLabel="+ Add Weakness"
      saveLabel={saveButtonLabel(sheet)}
      renderView={(weakness) => <ReadValue>{weakness}</ReadValue>}
      renderEditRow={(index) => <WeaknessField index={index} />}
      onSave={(items) => sheet.save({ details: { weaknesses: items } })}
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
