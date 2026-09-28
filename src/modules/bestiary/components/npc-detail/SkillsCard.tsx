"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, FieldError, Input } from "@/core/ui";
import {
  BODY_SKILLS,
  CRA_SKILLS,
  DEX_SKILLS,
  EMP_SKILLS,
  INT_SKILLS,
  REF_SKILLS,
  WILL_SKILLS,
  type SkillName,
} from "../../schemas";
import { saveButtonLabel, useNpcSheet } from "../../sheet/NpcSheetContext";
import { computeSkillBase } from "../../utils";
import { DiceRollModal } from "./DiceRollModal";
import { EditableCard } from "./EditableCard";
import {
  ActionsRow,
  ReadLabel,
  ReadRow,
  ReadValue,
} from "./SharedCardFields.styles";
import {
  DiceButton,
  GroupHeading,
  SkillGroupsGrid,
  SkillGroupsList,
  SkillGroupTile,
  SkillInputRow,
  SkillInputWrapper,
} from "./SkillsCard.styles";

const STAT_LABELS: Record<string, string> = {
  INT: "Intelligence",
  REF: "Reflexes",
  DEX: "Dexterity",
  BODY: "Body",
  EMP: "Empathy",
  CRA: "Craft",
  WILL: "Willpower",
};

const SKILL_GROUPS: { stat: string; skills: readonly SkillName[] }[] = [
  { stat: "INT", skills: INT_SKILLS },
  { stat: "REF", skills: REF_SKILLS },
  { stat: "DEX", skills: DEX_SKILLS },
  { stat: "BODY", skills: BODY_SKILLS },
  { stat: "EMP", skills: EMP_SKILLS },
  { stat: "CRA", skills: CRA_SKILLS },
  { stat: "WILL", skills: WILL_SKILLS },
];

export function SkillsCard() {
  const [rolling, setRolling] = useState<{
    skill: SkillName;
    base: number;
  } | null>(null);
  const { coreStats, skills } = useNpcSheet().details;

  return (
    <>
      <EditableCard
        title="Skills"
        view={
          <SkillGroupsGrid>
            <SkillGroupsList>
              {SKILL_GROUPS.map((group) => (
                <SkillGroupTile key={group.stat}>
                  <GroupHeading>{STAT_LABELS[group.stat]}</GroupHeading>
                  {group.skills.map((skill) => {
                    const base = computeSkillBase(coreStats, skills, skill);
                    return (
                      <ReadRow key={skill}>
                        <ReadLabel>{skill}</ReadLabel>
                        <ReadValue>
                          +{base}
                          <DiceButton
                            type="button"
                            aria-label={`Roll ${skill}`}
                            onClick={() => setRolling({ skill, base })}
                          >
                            &#127922;
                          </DiceButton>
                        </ReadValue>
                      </ReadRow>
                    );
                  })}
                </SkillGroupTile>
              ))}
            </SkillGroupsList>
          </SkillGroupsGrid>
        }
        renderEdit={({ cancel }) => (
          <SkillsForm skills={skills} onCancel={cancel} />
        )}
      />
      {rolling && (
        <DiceRollModal
          label={rolling.skill}
          skill={rolling.skill}
          base={rolling.base}
          onClose={() => setRolling(null)}
        />
      )}
    </>
  );
}

type SkillsFormProps = {
  skills: Partial<Record<SkillName, number>>;
  onCancel: () => void;
};

function SkillsForm({ skills, onCancel }: SkillsFormProps) {
  const sheet = useNpcSheet();
  const [serverError, setServerError] = useState<string | undefined>();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Record<SkillName, number | undefined>>({
    defaultValues: skills as Record<SkillName, number | undefined>,
  });

  const onSubmit = handleSubmit(async (data) => {
    const patchSkills: Partial<Record<SkillName, number>> = {};
    for (const group of SKILL_GROUPS) {
      for (const skill of group.skills) {
        const value = data[skill];
        if (value !== undefined && !Number.isNaN(value)) {
          patchSkills[skill] = value;
        }
      }
    }
    const result = await sheet.save({ details: { skills: patchSkills } });
    if (result?.error) {
      setServerError(result.error);
      return;
    }
    onCancel();
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <SkillGroupsGrid>
        <SkillGroupsList>
          {SKILL_GROUPS.map((group) => (
            <SkillGroupTile key={group.stat}>
              <GroupHeading>{STAT_LABELS[group.stat]}</GroupHeading>
              {group.skills.map((skill) => (
                <SkillInputRow key={skill}>
                  <label htmlFor={`skill-${skill}`}>{skill}</label>
                  <SkillInputWrapper>
                    <Input
                      id={`skill-${skill}`}
                      type="number"
                      placeholder="—"
                      {...register(skill, {
                        setValueAs: (value) =>
                          value === "" ? undefined : Number(value),
                      })}
                    />
                  </SkillInputWrapper>
                </SkillInputRow>
              ))}
            </SkillGroupTile>
          ))}
        </SkillGroupsList>
      </SkillGroupsGrid>
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
