"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, FieldError, Input } from "@/core/ui";
import { buildDefaultNpcDetails } from "../../npc-defaults";
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
import type { Creature } from "../../types";
import { computeSkillBase } from "../../utils";
import { DiceRollModal } from "./DiceRollModal";
import { EditableCard } from "./EditableCard";
import { saveNpcDetailsPatch } from "./saveNpcDetailsPatch";
import {
  ActionsRow,
  Field,
  ReadLabel,
  ReadRow,
  ReadValue,
} from "./SharedCardFields.styles";
import {
  DiceButton,
  GroupHeading,
  SearchInputWrapper,
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

function filterGroups(query: string) {
  const normalized = query.trim().toLowerCase();
  return SKILL_GROUPS.map((group) => ({
    ...group,
    skills: group.skills.filter((skill) =>
      skill.toLowerCase().includes(normalized),
    ),
  })).filter((group) => group.skills.length > 0);
}

type SkillsCardProps = {
  creature: Creature;
};

export function SkillsCard({ creature }: SkillsCardProps) {
  const [query, setQuery] = useState("");
  const [rolling, setRolling] = useState<{
    skill: SkillName;
    base: number;
  } | null>(null);
  const defaults = buildDefaultNpcDetails();
  const coreStats = creature.details?.coreStats ?? defaults.coreStats;
  const skills = creature.details?.skills ?? defaults.skills;
  const visibleGroups = filterGroups(query);

  return (
    <>
      <EditableCard
        title="Skills"
        view={
          <div>
            <SearchInputWrapper>
              <Input
                type="search"
                placeholder="Search skills..."
                aria-label="Search skills"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </SearchInputWrapper>
            {visibleGroups.map((group) => (
              <div key={group.stat}>
                <GroupHeading>{STAT_LABELS[group.stat]}</GroupHeading>
                {group.skills.map((skill) => (
                  <ReadRow key={skill}>
                    <ReadLabel>{skill}</ReadLabel>
                    <ReadValue>
                      +{computeSkillBase(coreStats, skills, skill)}
                      <DiceButton
                        type="button"
                        aria-label={`Roll ${skill}`}
                        onClick={() =>
                          setRolling({
                            skill,
                            base: computeSkillBase(coreStats, skills, skill),
                          })
                        }
                      >
                        &#127922;
                      </DiceButton>
                    </ReadValue>
                  </ReadRow>
                ))}
              </div>
            ))}
          </div>
        }
        renderEdit={({ cancel }) => (
          <SkillsForm
            creature={creature}
            skills={skills}
            query={query}
            onQueryChange={setQuery}
            onCancel={cancel}
          />
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
  creature: Creature;
  skills: Partial<Record<SkillName, number>>;
  query: string;
  onQueryChange: (value: string) => void;
  onCancel: () => void;
};

function SkillsForm({
  creature,
  skills,
  query,
  onQueryChange,
  onCancel,
}: SkillsFormProps) {
  const [serverError, setServerError] = useState<string | undefined>();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Record<SkillName, number | undefined>>({
    defaultValues: skills as Record<SkillName, number | undefined>,
  });
  const visibleGroups = filterGroups(query);

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
    const result = await saveNpcDetailsPatch(creature, { skills: patchSkills });
    if (result?.error) {
      setServerError(result.error);
      return;
    }
    onCancel();
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <SearchInputWrapper>
        <Input
          type="search"
          placeholder="Search skills..."
          aria-label="Search skills"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </SearchInputWrapper>
      {visibleGroups.map((group) => (
        <div key={group.stat}>
          <GroupHeading>{STAT_LABELS[group.stat]}</GroupHeading>
          {group.skills.map((skill) => (
            <Field key={skill}>
              <label htmlFor={`skill-${skill}`}>{skill}</label>
              <Input
                id={`skill-${skill}`}
                type="number"
                placeholder="Untrained"
                {...register(skill, {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              />
            </Field>
          ))}
        </div>
      ))}
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
