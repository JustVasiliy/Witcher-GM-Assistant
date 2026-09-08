"use client";

import type { LoreExcerpt } from "../../schemas";
import type { Creature } from "../../types";
import { LoreExcerptCard } from "./LoreExcerptCard";
import { saveNpcDetailsPatch } from "./saveNpcDetailsPatch";

type WitcherKnowledgeCardProps = {
  creature: Creature;
};

export function WitcherKnowledgeCard({ creature }: WitcherKnowledgeCardProps) {
  const flavor = creature.details?.flavor;

  return (
    <LoreExcerptCard
      title="Witcher Knowledge"
      dcLabel="Witcher Training DC"
      excerpt={flavor?.witcherKnowledge}
      saveLabel={creature.source === "core" ? "Save as New NPC" : "Save"}
      onSave={(data: LoreExcerpt) =>
        saveNpcDetailsPatch(creature, {
          flavor: { ...flavor, witcherKnowledge: data },
        })
      }
    />
  );
}
