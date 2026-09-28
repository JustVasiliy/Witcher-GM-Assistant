"use client";

import { getWoundDefinition } from "../critical-wounds/catalog";
import {
  SEVERITY_LABELS,
  WOUND_STATE_LABELS,
  WOUND_STATES,
  type CriticalWound,
  type WoundState,
} from "../critical-wounds/types";
import {
  EffectText,
  RemoveButton,
  Row,
  RowHeader,
  SeverityBadge,
  StateButton,
  StateToggle,
  WoundName,
} from "./WoundRow.styles";

type WoundRowProps = {
  wound: CriticalWound;
  onSetState: (state: WoundState) => void;
  onRemove: () => void;
};

export function WoundRow({ wound, onSetState, onRemove }: WoundRowProps) {
  const definition = getWoundDefinition(wound.woundKey);
  const name = definition?.name ?? "Unknown wound";

  return (
    <Row>
      <RowHeader>
        <WoundName>{name}</WoundName>
        {definition && (
          <SeverityBadge>{SEVERITY_LABELS[definition.severity]}</SeverityBadge>
        )}
        <RemoveButton
          type="button"
          aria-label={`Remove ${name}`}
          onClick={onRemove}
        >
          &#10005;
        </RemoveButton>
      </RowHeader>
      {definition && (
        <EffectText>{definition.effects[wound.state].text}</EffectText>
      )}
      <StateToggle role="group" aria-label={`${name} state`}>
        {WOUND_STATES.map((state) => (
          <StateButton
            key={state}
            type="button"
            $active={state === wound.state}
            aria-pressed={state === wound.state}
            onClick={() => {
              if (state !== wound.state) onSetState(state);
            }}
          >
            {WOUND_STATE_LABELS[state]}
          </StateButton>
        ))}
      </StateToggle>
    </Row>
  );
}
