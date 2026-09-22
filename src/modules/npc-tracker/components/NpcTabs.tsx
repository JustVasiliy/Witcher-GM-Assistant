"use client";

import { startTransition, useState } from "react";
import { Button, Tabs } from "@/core/ui";
import { NpcStatBlock, type Creature } from "@/modules/bestiary/client";
import type { EncounterNpc } from "@/generated/prisma/client";
import { removeNpcFromEncounter } from "../actions";
import {
  EmptyState,
  MissingState,
  TabActions,
  TabPanel,
} from "./NpcTabs.styles";

type NpcTabsProps = {
  encounterNpcs: EncounterNpc[];
  creatureCatalog: Creature[];
  campaignId: string;
  sessionId: string;
};

export function NpcTabs({
  encounterNpcs,
  creatureCatalog,
  campaignId,
  sessionId,
}: NpcTabsProps) {
  const [activeId, setActiveId] = useState<string | null>(
    encounterNpcs[0]?.id ?? null,
  );

  if (encounterNpcs.length === 0) {
    return <EmptyState>No NPCs added to this encounter yet.</EmptyState>;
  }

  const activeEncounterNpc =
    encounterNpcs.find((npc) => npc.id === activeId) ?? encounterNpcs[0];
  const activeCreature = creatureCatalog.find(
    (creature) => creature.id === activeEncounterNpc.creatureId,
  );

  return (
    <div>
      <Tabs
        items={encounterNpcs.map((npc) => ({
          id: npc.id,
          label:
            creatureCatalog.find((creature) => creature.id === npc.creatureId)
              ?.name ?? "Unknown NPC",
        }))}
        activeId={activeEncounterNpc.id}
        onChange={setActiveId}
      />
      <TabPanel>
        <TabActions>
          <Button
            type="button"
            onClick={() => {
              startTransition(() => {
                removeNpcFromEncounter(
                  activeEncounterNpc.id,
                  campaignId,
                  sessionId,
                );
              });
            }}
          >
            Remove from encounter
          </Button>
        </TabActions>
        {activeCreature ? (
          <NpcStatBlock creature={activeCreature} />
        ) : (
          <MissingState>
            This NPC is no longer available in the bestiary.
          </MissingState>
        )}
      </TabPanel>
    </div>
  );
}
