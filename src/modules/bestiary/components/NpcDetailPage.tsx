"use client";

import type { Creature } from "../types";
import { DeleteCustomNpcButton } from "./DeleteCustomNpcButton";
import {
  BackLink,
  Grid,
  MainColumn,
  PageHeader,
  SideColumn,
} from "./NpcDetailPage.styles";
import { AbilitiesCard } from "./npc-detail/AbilitiesCard";
import { ArmorCard } from "./npc-detail/ArmorCard";
import { AttacksCard } from "./npc-detail/AttacksCard";
import { BasicFlavorCard } from "./npc-detail/BasicFlavorCard";
import { CommonerSuperstitionCard } from "./npc-detail/CommonerSuperstitionCard";
import { CoreStatisticsCard } from "./npc-detail/CoreStatisticsCard";
import { HeaderCard } from "./npc-detail/HeaderCard";
import { LootCard } from "./npc-detail/LootCard";
import { SkillsCard } from "./npc-detail/SkillsCard";
import { VitalStatisticsCard } from "./npc-detail/VitalStatisticsCard";
import { WeaknessesCard } from "./npc-detail/WeaknessesCard";
import { WitcherKnowledgeCard } from "./npc-detail/WitcherKnowledgeCard";

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
      <Grid>
        <MainColumn>
          <CoreStatisticsCard creature={creature} />
          <SkillsCard creature={creature} />
          <AttacksCard creature={creature} />
          <AbilitiesCard creature={creature} />
        </MainColumn>
        <SideColumn>
          <VitalStatisticsCard creature={creature} />
          <ArmorCard creature={creature} />
          <WeaknessesCard creature={creature} />
          <LootCard creature={creature} />
          <BasicFlavorCard creature={creature} />
          <CommonerSuperstitionCard creature={creature} />
          <WitcherKnowledgeCard creature={creature} />
        </SideColumn>
      </Grid>
    </div>
  );
}
