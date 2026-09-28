"use client";

import { useState } from "react";
import { Tabs } from "@/core/ui";
import type { EncounterNpcWithWounds } from "../types";
import { NpcInstancePanel } from "./NpcInstancePanel";
import { EmptyState, TabPanel } from "./NpcTabs.styles";

type NpcTabsProps = {
  encounterNpcs: EncounterNpcWithWounds[];
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

  return (
    <div>
      <Tabs
        items={encounterNpcs.map((npc) => ({ id: npc.id, label: npc.name }))}
        activeId={active.id}
        onChange={setActiveId}
      />
      <TabPanel>
        {/* key: switching tabs resets card edit state and the wounds modal */}
        <NpcInstancePanel
          key={active.id}
          npc={active}
          campaignId={campaignId}
          sessionId={sessionId}
        />
      </TabPanel>
    </div>
  );
}
