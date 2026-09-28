"use client";

import { useFormContext } from "react-hook-form";
import { FieldError, Input } from "@/core/ui";
import { AbilitySchema, type Ability } from "../../schemas";
import { saveButtonLabel, useNpcSheet } from "../../sheet/NpcSheetContext";
import { EditableListCard } from "./EditableListCard";
import { Field } from "./SharedCardFields.styles";
import { AbilityRow, AbilityRowGrid } from "./AbilitiesCard.styles";

const EMPTY_ABILITY: Ability = { name: "", description: "" };

export function AbilitiesCard() {
  const sheet = useNpcSheet();
  const { abilities } = sheet.details;

  return (
    <EditableListCard<Ability>
      title="Abilities"
      items={abilities}
      emptyItem={EMPTY_ABILITY}
      itemSchema={AbilitySchema}
      addLabel="+ Add Ability"
      saveLabel={saveButtonLabel(sheet)}
      renderView={(ability) => (
        <AbilityRow>
          <strong>{ability.name}</strong>
          <p>{ability.description}</p>
        </AbilityRow>
      )}
      renderEditRow={(index) => <AbilityFields index={index} />}
      onSave={(items) => sheet.save({ details: { abilities: items } })}
    />
  );
}

type AbilityFieldsProps = {
  index: number;
};

function AbilityFields({ index }: AbilityFieldsProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<{ items: Ability[] }>();
  const rowErrors = errors.items?.[index];

  return (
    <AbilityRowGrid>
      <Field>
        <label htmlFor={`ability-${index}-name`}>Name</label>
        <Input
          id={`ability-${index}-name`}
          type="text"
          {...register(`items.${index}.name`)}
        />
        {rowErrors?.name && <FieldError>{rowErrors.name.message}</FieldError>}
      </Field>
      <Field>
        <label htmlFor={`ability-${index}-description`}>Description</label>
        <textarea
          id={`ability-${index}-description`}
          {...register(`items.${index}.description`)}
        />
        {rowErrors?.description && (
          <FieldError>{rowErrors.description.message}</FieldError>
        )}
      </Field>
    </AbilityRowGrid>
  );
}
