"use client";

import type { Creature } from "../types";
import { TYPE_LABELS } from "../types";
import { DeleteCustomNpcButton } from "./DeleteCustomNpcButton";
import {
  Actions,
  Avatar,
  Chevron,
  Info,
  Name,
  NameRow,
  Row,
  SourcePill,
  TypeLabel,
} from "./CreatureRow.styles";

type CreatureRowProps = {
  creature: Creature;
};

export function CreatureRow({ creature }: CreatureRowProps) {
  const isCustom = creature.source === "custom";

  return (
    <Row $custom={isCustom}>
      <Avatar aria-hidden="true">
        {creature.name.charAt(0).toUpperCase()}
      </Avatar>
      <Info>
        <NameRow>
          <Name>{creature.name}</Name>
          <SourcePill $custom={isCustom}>
            {isCustom ? "Custom NPC" : "Core Book"}
          </SourcePill>
        </NameRow>
        <TypeLabel>{TYPE_LABELS[creature.type]}</TypeLabel>
      </Info>
      <Actions>
        {isCustom && <DeleteCustomNpcButton id={creature.id} />}
        <Chevron aria-hidden="true">&rsaquo;</Chevron>
      </Actions>
    </Row>
  );
}
