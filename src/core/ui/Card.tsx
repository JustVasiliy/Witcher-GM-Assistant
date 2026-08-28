"use client";

import type { ComponentPropsWithoutRef } from "react";
import { StyledCard } from "./Card.styles";

type CardProps = ComponentPropsWithoutRef<"div">;

export function Card(props: CardProps) {
  return <StyledCard {...props} />;
}
