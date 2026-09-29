"use client";

import { startTransition, useOptimistic, useState } from "react";
import { Button } from "@/core/ui";
import {
  buildDefaultNpcDetails,
  DEFAULT_ARMOR,
  NpcSheetProvider,
  NpcStatBlock,
  parseNpcDetails,
  type NpcSheet,
} from "@/modules/bestiary/client";
import {
  activateEffect,
  removeCriticalWound,
  removeEffect,
  removeNpcFromEncounter,
  setCriticalWoundState,
  setFireLocations,
  updateEncounterNpc,
} from "../actions";
import { woundsToModifiers } from "../critical-wounds/modifiers";
import {
  applyWoundListAction,
  type WoundListAction,
} from "../critical-wounds/wound-list";
import {
  applyEffectListAction,
  type EffectListAction,
} from "../effects/effect-list";
import { effectsToModifiers } from "../effects/modifiers";
import type { ActiveEffect } from "../effects/types";
import type { EncounterNpcWithWounds } from "../types";
import { CriticalWoundsModal } from "./CriticalWoundsModal";
import { EffectsBar } from "./EffectsBar";
import { TabActions } from "./NpcTabs.styles";

type NpcInstancePanelProps = {
  npc: EncounterNpcWithWounds;
  campaignId: string;
  sessionId: string;
};

export function NpcInstancePanel({
  npc,
  campaignId,
  sessionId,
}: NpcInstancePanelProps) {
  const [isWoundsOpen, setIsWoundsOpen] = useState(false);
  const [woundError, setWoundError] = useState<string | undefined>();
  // Optimistic so state toggles/removals update text and highlights instantly.
  // Explicit type args: `applyWoundListAction`'s own generic (`T extends
  // CriticalWound`) can't be inferred through useOptimistic's reducer slot.
  const [wounds, applyOptimistic] = useOptimistic<
    EncounterNpcWithWounds["wounds"],
    WoundListAction
  >(npc.wounds, applyWoundListAction);

  function runWoundAction(action: WoundListAction) {
    setWoundError(undefined);
    startTransition(async () => {
      applyOptimistic(action);
      const result =
        action.type === "remove"
          ? await removeCriticalWound(action.id, campaignId, sessionId)
          : await setCriticalWoundState(
              action.id,
              campaignId,
              sessionId,
              action.state,
            );
      if (result?.error) {
        setWoundError(result.error);
      }
    });
  }

  const [effectError, setEffectError] = useState<string | undefined>();
  const [effects, applyOptimisticEffect] = useOptimistic<
    ActiveEffect[],
    EffectListAction
  >(npc.effects, applyEffectListAction);

  function runEffectAction(action: EffectListAction) {
    setEffectError(undefined);
    startTransition(async () => {
      applyOptimisticEffect(action);
      const result =
        action.type === "activate"
          ? await activateEffect(npc.id, campaignId, sessionId, action.key)
          : action.type === "remove"
            ? await removeEffect(npc.id, campaignId, sessionId, action.key)
            : await setFireLocations(
                npc.id,
                campaignId,
                sessionId,
                action.locations,
              );
      if (result?.error) {
        setEffectError(result.error);
      }
    });
  }

  const details = parseNpcDetails(npc.details) ?? buildDefaultNpcDetails();

  const sheet: NpcSheet = {
    mode: "instance",
    name: npc.name,
    type: npc.type,
    details,
    forksOnSave: false,
    combat: {
      currentHp: npc.currentHp,
      currentStamina: npc.currentStamina,
    },
    modifiers: [...woundsToModifiers(wounds), ...effectsToModifiers(effects)],
    save: (patch) => updateEncounterNpc(npc.id, campaignId, sessionId, patch),
  };

  return (
    <>
      <TabActions>
        <Button type="button" onClick={() => setIsWoundsOpen(true)}>
          {wounds.length > 0
            ? `Critical Wounds (${wounds.length})`
            : "Critical Wounds"}
        </Button>
        <Button
          type="button"
          onClick={() => {
            startTransition(() => {
              removeNpcFromEncounter(npc.id, campaignId, sessionId);
            });
          }}
        >
          Remove from encounter
        </Button>
      </TabActions>
      <NpcSheetProvider sheet={sheet}>
        <NpcStatBlock
          afterCoreStatistics={
            <EffectsBar
              effects={effects}
              armor={details.armor ?? DEFAULT_ARMOR}
              error={effectError}
              onAction={runEffectAction}
            />
          }
        />
      </NpcSheetProvider>
      {isWoundsOpen && (
        <CriticalWoundsModal
          encounterNpcId={npc.id}
          campaignId={campaignId}
          sessionId={sessionId}
          wounds={wounds}
          error={woundError}
          onSetState={(id, state) =>
            runWoundAction({ type: "setState", id, state })
          }
          onRemove={(id) => runWoundAction({ type: "remove", id })}
          onClose={() => {
            setIsWoundsOpen(false);
            setWoundError(undefined);
          }}
        />
      )}
    </>
  );
}
