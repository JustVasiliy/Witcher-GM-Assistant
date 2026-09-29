"use client";

import type { ReactNode } from "react";
import { Grid, MainColumn, SideColumn } from "./NpcDetailPage.styles";
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

type NpcStatBlockProps = {
  /** Rendered between Core Statistics and Skills (e.g. encounter effects). */
  afterCoreStatistics?: ReactNode;
};

/** Renders the sheet supplied by the nearest NpcSheetProvider. */
export function NpcStatBlock({ afterCoreStatistics }: NpcStatBlockProps) {
  return (
    <>
      <HeaderCard />
      <Grid>
        <MainColumn>
          <CoreStatisticsCard />
          {afterCoreStatistics}
          <SkillsCard />
          <AttacksCard />
          <AbilitiesCard />
        </MainColumn>
        <SideColumn>
          <VitalStatisticsCard />
          <ArmorCard />
          <WeaknessesCard />
          <LootCard />
          <BasicFlavorCard />
          <CommonerSuperstitionCard />
          <WitcherKnowledgeCard />
        </SideColumn>
      </Grid>
    </>
  );
}
