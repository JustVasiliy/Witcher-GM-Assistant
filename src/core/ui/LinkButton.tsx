"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { StyledLinkButton } from "./LinkButton.styles";

type LinkButtonProps = ComponentProps<typeof Link> & {
  fullWidth?: boolean;
};

export function LinkButton({ fullWidth, ...props }: LinkButtonProps) {
  return <StyledLinkButton $fullWidth={fullWidth} {...props} />;
}
