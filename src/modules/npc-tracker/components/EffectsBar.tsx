"use client";

import { useState } from "react";
import { FieldError } from "@/core/ui";
import { SheetCard, type ArmorLocations } from "@/modules/bestiary/client";
import { EFFECTS } from "../effects/catalog";
import type { EffectListAction } from "../effects/effect-list";
import { isBodyLocation } from "../effects/fire";
import {
  EFFECT_KEYS,
  type ActiveEffect,
  type EffectKey,
} from "../effects/types";
import { EffectCardModal } from "./EffectCardModal";
import { EffectButton, EffectGrid, EffectIcon } from "./EffectsBar.styles";
import { FireModal } from "./FireModal";

type EffectsBarProps = {
  effects: ActiveEffect[];
  armor: ArmorLocations;
  error?: string;
  onAction: (action: EffectListAction) => void;
};

/**
 * Left-click: apply (inactive) or open details (active); Fire always opens
 * its window. Right-click an active effect: remove it at once.
 */
export function EffectsBar({
  effects,
  armor,
  error,
  onAction,
}: EffectsBarProps) {
  const [openKey, setOpenKey] = useState<EffectKey | null>(null);
  const activeByKey = new Map(
    effects.map((effect) => [effect.effectKey, effect]),
  );
  const openDefinition =
    openKey && openKey !== "FIRE" && activeByKey.has(openKey)
      ? EFFECTS[openKey]
      : null;
  const burning = (activeByKey.get("FIRE")?.burningLocations ?? []).filter(
    isBodyLocation,
  );

  return (
    <SheetCard title="Effects">
      <EffectGrid>
        {EFFECT_KEYS.map((key) => {
          const definition = EFFECTS[key];
          const active = activeByKey.get(key);
          const label =
            key === "FIRE" && active
              ? `${definition.name} (${active.burningLocations.length})`
              : definition.name;
          return (
            <EffectButton
              key={key}
              type="button"
              $active={Boolean(active)}
              aria-pressed={Boolean(active)}
              title={
                active
                  ? "Click for details · Right-click to remove"
                  : "Click to apply"
              }
              onClick={() => {
                if (key === "FIRE" || active) {
                  setOpenKey(key);
                } else {
                  onAction({ type: "activate", key });
                }
              }}
              onContextMenu={(event) => {
                event.preventDefault();
                if (active) onAction({ type: "remove", key });
              }}
            >
              <EffectIcon aria-hidden="true">{definition.icon}</EffectIcon>
              <span>{label}</span>
            </EffectButton>
          );
        })}
      </EffectGrid>
      {!openKey && error && <FieldError>{error}</FieldError>}
      {openDefinition && (
        <EffectCardModal
          definition={openDefinition}
          error={error}
          onRemove={() => {
            onAction({ type: "remove", key: openDefinition.key });
            setOpenKey(null);
          }}
          onClose={() => setOpenKey(null)}
        />
      )}
      {openKey === "FIRE" && (
        <FireModal
          burning={burning}
          armor={armor}
          error={error}
          onSetLocations={(locations) =>
            onAction({ type: "setFireLocations", locations })
          }
          onClose={() => setOpenKey(null)}
        />
      )}
    </SheetCard>
  );
}
