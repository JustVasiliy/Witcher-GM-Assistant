"use client";

import type { Creature } from "../types";
import { CreatureRow } from "./CreatureRow";
import { EmptyText, List } from "./CreatureList.styles";

type CreatureListProps = {
  creatures: Creature[];
};

export function CreatureList({ creatures }: CreatureListProps) {
  if (creatures.length === 0) {
    return <EmptyText>No creatures found.</EmptyText>;
  }

  return (
    <List>
      {creatures.map((creature) => (
        <CreatureRow key={creature.id} creature={creature} />
      ))}
    </List>
  );
}
