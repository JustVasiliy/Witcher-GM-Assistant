"use client";

import type { LoreExcerpt } from "../../schemas";
import { saveButtonLabel, useNpcSheet } from "../../sheet/NpcSheetContext";
import { LoreExcerptCard } from "./LoreExcerptCard";

export function CommonerSuperstitionCard() {
  const sheet = useNpcSheet();
  const { flavor } = sheet.details;

  return (
    <LoreExcerptCard
      title="Commoner Superstition"
      dcLabel="Education DC"
      excerpt={flavor?.commonerSuperstition}
      saveLabel={saveButtonLabel(sheet)}
      onSave={(data: LoreExcerpt) =>
        sheet.save({
          details: { flavor: { ...flavor, commonerSuperstition: data } },
        })
      }
    />
  );
}
