"use client";

import { useId, type ReactNode } from "react";
import { Highlighted, Tooltip } from "./ModifiedValue.styles";

type ModifiedValueProps = {
  sources: string[];
  children: ReactNode;
};

/** Highlights a value affected by modifiers; hover/focus lists the sources. */
export function ModifiedValue({ sources, children }: ModifiedValueProps) {
  const tooltipId = useId();

  if (sources.length === 0) {
    return <>{children}</>;
  }

  return (
    <Highlighted tabIndex={0} aria-describedby={tooltipId}>
      {children}
      <Tooltip id={tooltipId} role="tooltip">
        {sources.map((source, index) => (
          // Two identical wounds produce identical lines, so index is part of the key.
          <li key={`${index}-${source}`}>{source}</li>
        ))}
      </Tooltip>
    </Highlighted>
  );
}
