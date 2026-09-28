"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FieldError, Input } from "@/core/ui";
import { AttackSchema, SKILL_NAMES, type Attack } from "../../schemas";
import { saveButtonLabel, useNpcSheet } from "../../sheet/NpcSheetContext";
import { computeSkillBase } from "../../utils";
import { DiceRollModal } from "./DiceRollModal";
import { EditableListCard } from "./EditableListCard";
import { Field } from "./SharedCardFields.styles";
import { AttackRowGrid } from "./AttacksCard.styles";

const EMPTY_ATTACK: Attack = { name: "", skill: "Melee", damage: "", rof: 1 };

export function AttacksCard() {
  const sheet = useNpcSheet();
  const { attacks, coreStats, skills } = sheet.details;
  const [rolling, setRolling] = useState<{
    label: string;
    skill: string;
    base: number;
  } | null>(null);

  return (
    <>
      <EditableListCard<Attack>
        title="Attacks"
        items={attacks}
        emptyItem={EMPTY_ATTACK}
        itemSchema={AttackSchema}
        addLabel="+ Add Attack"
        saveLabel={saveButtonLabel(sheet)}
        renderView={(attack) => (
          <AttackRowGrid>
            <span>{attack.name}</span>
            <span>{attack.skill}</span>
            <span>{attack.damage}</span>
            <span>{attack.effect ?? "—"}</span>
            <span>{attack.rof}</span>
            <span>+{computeSkillBase(coreStats, skills, attack.skill)}</span>
            <button
              type="button"
              aria-label={`Roll ${attack.name}`}
              onClick={() =>
                setRolling({
                  label: attack.name || attack.skill,
                  skill: attack.skill,
                  base: computeSkillBase(coreStats, skills, attack.skill),
                })
              }
            >
              &#127922;
            </button>
          </AttackRowGrid>
        )}
        renderEditRow={(index) => <AttackFields index={index} />}
        onSave={(items) => sheet.save({ details: { attacks: items } })}
      />
      {rolling && (
        <DiceRollModal
          label={rolling.label}
          skill={rolling.skill}
          base={rolling.base}
          onClose={() => setRolling(null)}
        />
      )}
    </>
  );
}

type AttackFieldsProps = {
  index: number;
};

function AttackFields({ index }: AttackFieldsProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<{ items: Attack[] }>();
  const rowErrors = errors.items?.[index];

  return (
    <AttackRowGrid>
      <Field>
        <label htmlFor={`attack-${index}-name`}>Name</label>
        <Input
          id={`attack-${index}-name`}
          type="text"
          {...register(`items.${index}.name`)}
        />
        {rowErrors?.name && <FieldError>{rowErrors.name.message}</FieldError>}
      </Field>
      <Field>
        <label htmlFor={`attack-${index}-skill`}>Skill</label>
        <select
          id={`attack-${index}-skill`}
          {...register(`items.${index}.skill`)}
        >
          {SKILL_NAMES.map((skill) => (
            <option key={skill} value={skill}>
              {skill}
            </option>
          ))}
        </select>
      </Field>
      <Field>
        <label htmlFor={`attack-${index}-damage`}>Damage</label>
        <Input
          id={`attack-${index}-damage`}
          type="text"
          {...register(`items.${index}.damage`)}
        />
        {rowErrors?.damage && (
          <FieldError>{rowErrors.damage.message}</FieldError>
        )}
      </Field>
      <Field>
        <label htmlFor={`attack-${index}-effect`}>Effect</label>
        <Input
          id={`attack-${index}-effect`}
          type="text"
          {...register(`items.${index}.effect`)}
        />
      </Field>
      <Field>
        <label htmlFor={`attack-${index}-rof`}>RoF</label>
        <Input
          id={`attack-${index}-rof`}
          type="number"
          min={1}
          {...register(`items.${index}.rof`, { valueAsNumber: true })}
        />
        {rowErrors?.rof && <FieldError>{rowErrors.rof.message}</FieldError>}
      </Field>
    </AttackRowGrid>
  );
}
