"use client";

import { describeEffect } from "../effects/describe";
import type { EffectDefinition } from "../effects/types";
import {
  Description,
  LineList,
  MutedText,
  SectionTitle,
  Text,
} from "./EffectInfo.styles";

type EffectInfoProps = {
  definition: EffectDefinition;
};

/** Description, modifiers and removal prompt for one effect. */
export function EffectInfo({ definition }: EffectInfoProps) {
  const lines = describeEffect(definition);

  return (
    <>
      <Description>{definition.description}</Description>
      <SectionTitle>Modifiers</SectionTitle>
      {lines.length > 0 ? (
        <LineList>
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </LineList>
      ) : (
        <MutedText>No modifiers.</MutedText>
      )}
      <SectionTitle>Removal</SectionTitle>
      <Text>{definition.removal}</Text>
      {definition.reminder && <MutedText>{definition.reminder}</MutedText>}
    </>
  );
}
