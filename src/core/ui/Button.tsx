"use client";

import type { ComponentPropsWithoutRef } from "react";
import { StyledButton } from "./Button.styles";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  fullWidth?: boolean;
};

export function Button({ fullWidth, ...props }: ButtonProps) {
  return <StyledButton $fullWidth={fullWidth} {...props} />;
}
