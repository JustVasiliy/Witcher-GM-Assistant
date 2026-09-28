"use client";

import { startTransition, useOptimistic, useState } from "react";
import { Button } from "@/core/ui";
import {
  buildDefaultNpcDetails,
  NpcSheetProvider,
  NpcStatBlock,
  parseNpcDetails,
  type NpcSheet,
} from "@/modules/bestiary/client";
import {
  removeCriticalWound,
  removeNpcFromEncounter,
  setCriticalWoundState,
  updateEncounterNpc,
} from "../actions";
import { woundsToModifiers } from "../critical-wounds/modifiers";
import {
  applyWoundListAction,
  type WoundListAction,
} from "../critical-wounds/wound-list";
import type { EncounterNpcWithWounds } from "../types";
import { CriticalWoundsModal } from "./CriticalWoundsModal";
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

  const sheet: NpcSheet = {
    mode: "instance",
    name: npc.name,
    type: npc.type,
    details: parseNpcDetails(npc.details) ?? buildDefaultNpcDetails(),
    forksOnSave: false,
    combat: {
      currentHp: npc.currentHp,
      currentStamina: npc.currentStamina,
    },
    modifiers: woundsToModifiers(wounds),
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
        <NpcStatBlock />
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
