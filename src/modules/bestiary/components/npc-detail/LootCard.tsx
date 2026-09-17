"use client";

import { useFormContext } from "react-hook-form";
import { FieldError, Input } from "@/core/ui";
import { LootItemSchema, type LootItem } from "../../schemas";
import type { Creature } from "../../types";
import { EditableListCard } from "./EditableListCard";
import { saveNpcDetailsPatch } from "./saveNpcDetailsPatch";
import { Field } from "./SharedCardFields.styles";
import { LootRowGrid } from "./LootCard.styles";

const EMPTY_LOOT_ITEM: LootItem = { name: "", quantity: "" };

type LootCardProps = {
  creature: Creature;
};

export function LootCard({ creature }: LootCardProps) {
  const loot = creature.details?.loot ?? [];

  return (
    <EditableListCard<LootItem>
      title="Loot"
      items={loot}
      emptyItem={EMPTY_LOOT_ITEM}
      itemSchema={LootItemSchema}
      addLabel="+ Add Loot"
      saveLabel={creature.source === "core" ? "Save as New NPC" : "Save"}
      renderView={(item) => (
        <LootRowGrid>
          <span>{item.name}</span>
          <span>{item.quantity}</span>
        </LootRowGrid>
      )}
      renderEditRow={(index) => <LootFields index={index} />}
      onSave={(items) => saveNpcDetailsPatch(creature, { loot: items })}
    />
  );
}

type LootFieldsProps = {
  index: number;
};

function LootFields({ index }: LootFieldsProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<{ items: LootItem[] }>();
  const rowErrors = errors.items?.[index];

  return (
    <LootRowGrid>
      <Field>
        <label htmlFor={`loot-${index}-name`}>Item</label>
        <Input
          id={`loot-${index}-name`}
          type="text"
          {...register(`items.${index}.name`)}
        />
        {rowErrors?.name && <FieldError>{rowErrors.name.message}</FieldError>}
      </Field>
      <Field>
        <label htmlFor={`loot-${index}-quantity`}>Quantity</label>
        <Input
          id={`loot-${index}-quantity`}
          type="text"
          placeholder="e.g. 1d6/2"
          {...register(`items.${index}.quantity`)}
        />
        {rowErrors?.quantity && (
          <FieldError>{rowErrors.quantity.message}</FieldError>
        )}
      </Field>
    </LootRowGrid>
  );
}
