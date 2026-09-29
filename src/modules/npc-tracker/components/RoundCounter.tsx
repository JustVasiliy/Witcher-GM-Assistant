"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Button } from "@/core/ui";
import { useRollHistoryStore } from "@/modules/roll-history";
import { advanceRound, decrementRound } from "../actions";
import { Count, ErrorText, Label, Wrapper } from "./RoundCounter.styles";

type RoundCounterProps = {
  encounterId: string;
  round: number;
  campaignId: string;
  sessionId: string;
};

export function RoundCounter({
  encounterId,
  round,
  campaignId,
  sessionId,
}: RoundCounterProps) {
  const addEvent = useRollHistoryStore((state) => state.addEvent);
  const [displayedRound, setDisplayedRound] = useOptimistic(round);
  // Pending blocks both buttons so a double click can't tick effects twice.
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();

  function next() {
    setError(undefined);
    startTransition(async () => {
      setDisplayedRound(round + 1);
      const result = await advanceRound(encounterId, campaignId, sessionId);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      // addEvent prepends, so walk the log backwards for a top-to-bottom
      // (first NPC first) reading in the newest-first sidebar.
      [...result.log].reverse().forEach(addEvent);
    });
  }

  function previous() {
    setError(undefined);
    startTransition(async () => {
      setDisplayedRound(Math.max(1, round - 1));
      const result = await decrementRound(encounterId, campaignId, sessionId);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <Wrapper>
      <Label>Round</Label>
      <Button
        type="button"
        aria-label="Previous round"
        disabled={isPending || displayedRound <= 1}
        onClick={previous}
      >
        −
      </Button>
      <Count>{displayedRound}</Count>
      <Button
        type="button"
        aria-label="Next round"
        title="Advance the round and apply effects to every NPC"
        disabled={isPending}
        onClick={next}
      >
        +
      </Button>
      {error && <ErrorText role="alert">{error}</ErrorText>}
    </Wrapper>
  );
}
