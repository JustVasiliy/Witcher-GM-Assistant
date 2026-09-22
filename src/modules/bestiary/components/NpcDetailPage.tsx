"use client";

import type { Creature } from "../types";
import { DeleteCustomNpcButton } from "./DeleteCustomNpcButton";
import { BackLink, PageHeader } from "./NpcDetailPage.styles";
import { HeaderCard } from "./npc-detail/HeaderCard";
import { NpcStatBlock } from "./NpcStatBlock";

type NpcDetailPageProps = {
  creature: Creature;
};

export function NpcDetailPage({ creature }: NpcDetailPageProps) {
  return (
    <div>
      <BackLink href="/bestiary">&larr; Back to Bestiary</BackLink>
      {creature.source === "custom" && (
        <PageHeader>
          <DeleteCustomNpcButton id={creature.id} />
        </PageHeader>
      )}
      <HeaderCard creature={creature} />
      <NpcStatBlock creature={creature} />
    </div>
  );
}
