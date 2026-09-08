"use client";

import type { LoreExcerpt } from "../../schemas";
import type { Creature } from "../../types";
import { LoreExcerptCard } from "./LoreExcerptCard";
import { saveNpcDetailsPatch } from "./saveNpcDetailsPatch";

type CommonerSuperstitionCardProps = {
  creature: Creature;
};

export function CommonerSuperstitionCard({
  creature,
}: CommonerSuperstitionCardProps) {
  const flavor = creature.details?.flavor;

  return (
    <LoreExcerptCard
      title="Commoner Superstition"
      dcLabel="Education DC"
      excerpt={flavor?.commonerSuperstition}
      saveLabel={creature.source === "core" ? "Save as New NPC" : "Save"}
      onSave={(data: LoreExcerpt) =>
        saveNpcDetailsPatch(creature, {
          flavor: { ...flavor, commonerSuperstition: data },
        })
      }
    />
  );
}
