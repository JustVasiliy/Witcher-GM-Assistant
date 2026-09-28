"use client";

import { startTransition, useState } from "react";
import { Button, Tabs } from "@/core/ui";
import {
  buildDefaultNpcDetails,
  NpcSheetProvider,
  NpcStatBlock,
  parseNpcDetails,
  type NpcSheet,
} from "@/modules/bestiary/client";
import type { EncounterNpc } from "@/generated/prisma/client";
import { removeNpcFromEncounter, updateEncounterNpc } from "../actions";
import { EmptyState, TabActions, TabPanel } from "./NpcTabs.styles";

type NpcTabsProps = {
  encounterNpcs: EncounterNpc[];
  campaignId: string;
  sessionId: string;
};

export function NpcTabs({
  encounterNpcs,
  campaignId,
  sessionId,
}: NpcTabsProps) {
  const [activeId, setActiveId] = useState<string | null>(
    encounterNpcs[0]?.id ?? null,
  );

  if (encounterNpcs.length === 0) {
    return <EmptyState>No NPCs added to this encounter yet.</EmptyState>;
  }

  const active =
    encounterNpcs.find((npc) => npc.id === activeId) ?? encounterNpcs[0];

  const sheet: NpcSheet = {
    mode: "instance",
    name: active.name,
    type: active.type,
    details: parseNpcDetails(active.details) ?? buildDefaultNpcDetails(),
    forksOnSave: false,
    combat: {
      currentHp: active.currentHp,
      currentStamina: active.currentStamina,
    },
    save: (patch) =>
      updateEncounterNpc(active.id, campaignId, sessionId, patch),
  };

  return (
    <div>
      <Tabs
        items={encounterNpcs.map((npc) => ({ id: npc.id, label: npc.name }))}
        activeId={active.id}
        onChange={setActiveId}
      />
      <TabPanel>
        <TabActions>
          <Button
            type="button"
            onClick={() => {
              startTransition(() => {
                removeNpcFromEncounter(active.id, campaignId, sessionId);
              });
            }}
          >
            Remove from encounter
          </Button>
        </TabActions>
        {/* key: switching tabs resets any open card edit state */}
        <NpcSheetProvider key={active.id} sheet={sheet}>
          <NpcStatBlock />
        </NpcSheetProvider>
      </TabPanel>
    </div>
  );
}
