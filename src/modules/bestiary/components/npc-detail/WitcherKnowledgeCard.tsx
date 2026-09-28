"use client";

import type { LoreExcerpt } from "../../schemas";
import { saveButtonLabel, useNpcSheet } from "../../sheet/NpcSheetContext";
import { LoreExcerptCard } from "./LoreExcerptCard";

export function WitcherKnowledgeCard() {
  const sheet = useNpcSheet();
  const { flavor } = sheet.details;

  return (
    <LoreExcerptCard
      title="Witcher Knowledge"
      dcLabel="Witcher Training DC"
      excerpt={flavor?.witcherKnowledge}
      saveLabel={saveButtonLabel(sheet)}
      onSave={(data: LoreExcerpt) =>
        sheet.save({
          details: { flavor: { ...flavor, witcherKnowledge: data } },
        })
      }
    />
  );
}
