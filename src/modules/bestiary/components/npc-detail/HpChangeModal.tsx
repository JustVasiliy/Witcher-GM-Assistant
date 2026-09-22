"use client";

import { useId, useState, type FormEvent } from "react";
import {
  Button,
  FieldError,
  Input,
  Modal,
  Tabs,
  type TabItem,
} from "@/core/ui";
import type { ArmorLocations, VitalStats } from "../../schemas";
import type { Creature } from "../../types";
import { ARMOR_LABELS, DEFAULT_ARMOR } from "./ArmorCard";
import {
  applyPenetration,
  calculateDamage,
  LOCATION_DAMAGE_MODIFIERS,
  type LocationDamageResult,
} from "./hp-damage-calculator";
import { saveNpcDetailsPatch } from "./saveNpcDetailsPatch";
import { ActionsRow, Field } from "./SharedCardFields.styles";
import {
  CheckboxRow,
  LocationButton,
  LocationGrid,
  LocationSp,
  PreviewBox,
  PreviewFormula,
  PreviewLabel,
  PreviewRow,
  TotalRow,
  TotalValue,
} from "./HpChangeModal.styles";

const LOCATION_KEYS = Object.keys(ARMOR_LABELS) as (keyof ArmorLocations)[];

const TABS: TabItem[] = [
  { id: "damage", label: "Damage" },
  { id: "recovery", label: "Recovery" },
];

function submitLabel(
  isSubmitting: boolean,
  isCore: boolean,
  submittingLabel: string,
  coreLabel: string,
  defaultLabel: string,
) {
  if (isSubmitting) return submittingLabel;
  return isCore ? coreLabel : defaultLabel;
}

type HpChangeModalProps = {
  creature: Creature;
  vitalStats: VitalStats;
  onClose: () => void;
};

export function HpChangeModal({
  creature,
  vitalStats,
  onClose,
}: HpChangeModalProps) {
  const [activeTab, setActiveTab] = useState("damage");

  return (
    <Modal title={`HP: ${vitalStats.hp}`} onClose={onClose}>
      <Tabs items={TABS} activeId={activeTab} onChange={setActiveTab} />
      {activeTab === "damage" ? (
        <DamageTab
          creature={creature}
          vitalStats={vitalStats}
          onClose={onClose}
        />
      ) : (
        <RecoveryTab
          creature={creature}
          vitalStats={vitalStats}
          onClose={onClose}
        />
      )}
    </Modal>
  );
}

type TabProps = {
  creature: Creature;
  vitalStats: VitalStats;
  onClose: () => void;
};

function DamageTab({ creature, vitalStats, onClose }: TabProps) {
  const armor = creature.details?.armor ?? DEFAULT_ARMOR;
  const [selected, setSelected] = useState<Set<keyof ArmorLocations>>(
    new Set(),
  );
  const [damageInput, setDamageInput] = useState("");
  const [hasResistance, setHasResistance] = useState(false);
  const [serverError, setServerError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const damageValue = Number(damageInput);
  const isDamageValid =
    damageInput !== "" && Number.isInteger(damageValue) && damageValue >= 0;

  const selectedLocations = LOCATION_KEYS.filter((key) => selected.has(key));
  const { results, totalHpDamage } = isDamageValid
    ? calculateDamage(damageValue, armor, selectedLocations, hasResistance)
    : { results: [], totalHpDamage: 0 };

  function toggleLocation(key: keyof ArmorLocations) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isDamageValid || selectedLocations.length === 0) return;

    setIsSubmitting(true);
    setServerError(undefined);

    const nextArmor = applyPenetration(armor, results);
    const nextHp = Math.max(0, vitalStats.hp - totalHpDamage);

    const result = await saveNpcDetailsPatch(creature, {
      vitalStats: { ...vitalStats, hp: nextHp },
      armor: nextArmor,
    });

    setIsSubmitting(false);
    if (result?.error) {
      setServerError(result.error);
      return;
    }
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <LocationGrid>
        {LOCATION_KEYS.map((key) => (
          <LocationButton
            key={key}
            type="button"
            $active={selected.has(key)}
            aria-pressed={selected.has(key)}
            onClick={() => toggleLocation(key)}
          >
            {ARMOR_LABELS[key]}
            <LocationSp>SP: {armor[key]}</LocationSp>
          </LocationButton>
        ))}
      </LocationGrid>

      <Field>
        <label htmlFor="hp-damage-amount">Damage</label>
        <Input
          id="hp-damage-amount"
          type="number"
          min={0}
          value={damageInput}
          onChange={(event) => setDamageInput(event.target.value)}
          autoFocus
        />
      </Field>

      <CheckboxRow>
        <input
          type="checkbox"
          checked={hasResistance}
          onChange={(event) => setHasResistance(event.target.checked)}
        />
        Has damage resistance
      </CheckboxRow>

      {results.length > 0 && (
        <PreviewBox>
          {results.map((result) => (
            <PreviewRow key={result.location}>
              <PreviewLabel>{ARMOR_LABELS[result.location]}</PreviewLabel>
              <PreviewFormula>
                {result.armorAbsorbs
                  ? "Armor Absorbs"
                  : formatFormula(damageValue, result, hasResistance)}
              </PreviewFormula>
            </PreviewRow>
          ))}
          <TotalRow>
            <span>Total HP damage</span>
            <TotalValue>{totalHpDamage}</TotalValue>
          </TotalRow>
        </PreviewBox>
      )}

      {serverError && <FieldError>{serverError}</FieldError>}

      <ActionsRow>
        <Button
          type="submit"
          disabled={
            isSubmitting || !isDamageValid || selectedLocations.length === 0
          }
        >
          {submitLabel(
            isSubmitting,
            creature.source === "core",
            "Applying...",
            "Apply as New NPC",
            "Apply damage",
          )}
        </Button>
      </ActionsRow>
    </form>
  );
}

function formatFormula(
  damage: number,
  result: LocationDamageResult,
  hasResistance: boolean,
) {
  const effective = damage - result.sp;
  const modifier = LOCATION_DAMAGE_MODIFIERS[result.location];
  const base = `${damage} - ${result.sp} = ${effective} × ${modifier}`;
  const penetrationNote = result.penetrates ? " (SP − 1)" : "";
  if (hasResistance) {
    return `${base} ÷ 2 = ${result.hpDamage}${penetrationNote}`;
  }
  return `${base} = ${result.hpDamage}${penetrationNote}`;
}

function RecoveryTab({ creature, vitalStats, onClose }: TabProps) {
  const [pointsInput, setPointsInput] = useState("");
  const [serverError, setServerError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pointsId = useId();

  const pointsValue = Number(pointsInput);
  const isPointsValid =
    pointsInput !== "" && Number.isInteger(pointsValue) && pointsValue > 0;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isPointsValid) return;

    setIsSubmitting(true);
    setServerError(undefined);

    const nextHp = vitalStats.hp + pointsValue;
    const result = await saveNpcDetailsPatch(creature, {
      vitalStats: { ...vitalStats, hp: nextHp },
    });

    setIsSubmitting(false);
    if (result?.error) {
      setServerError(result.error);
      return;
    }
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Field>
        <label htmlFor={pointsId}>Points</label>
        <Input
          id={pointsId}
          type="number"
          min={1}
          value={pointsInput}
          onChange={(event) => setPointsInput(event.target.value)}
          autoFocus
        />
      </Field>

      {serverError && <FieldError>{serverError}</FieldError>}

      <ActionsRow>
        <Button type="submit" disabled={isSubmitting || !isPointsValid}>
          {submitLabel(
            isSubmitting,
            creature.source === "core",
            "Restoring...",
            "Restore as New NPC",
            "Restore",
          )}
        </Button>
      </ActionsRow>
    </form>
  );
}
