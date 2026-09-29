"use client";

import type { ReactNode } from "react";
import { CardHeader, CardWrapper, Title } from "./EditableCard.styles";

type SheetCardProps = {
  title: string;
  children: ReactNode;
};

/** A stat-block card without edit mode, for content supplied by other modules. */
export function SheetCard({ title, children }: SheetCardProps) {
  return (
    <CardWrapper>
      <CardHeader>
        <Title>{title}</Title>
      </CardHeader>
      {children}
    </CardWrapper>
  );
}
