"use client";

import { useState } from "react";
import { Button } from "@/core/ui";
import { Count, Label, Wrapper } from "./RoundCounter.styles";

export function RoundCounter() {
  const [round, setRound] = useState(1);

  return (
    <Wrapper>
      <Label>Round</Label>
      <Button
        type="button"
        aria-label="Previous round"
        onClick={() => setRound((current) => Math.max(1, current - 1))}
      >
        −
      </Button>
      <Count>{round}</Count>
      <Button
        type="button"
        aria-label="Next round"
        onClick={() => setRound((current) => current + 1)}
      >
        +
      </Button>
    </Wrapper>
  );
}
