"use client";

import type { ComponentPropsWithoutRef } from "react";
import { StyledFieldError } from "./FieldError.styles";

type FieldErrorProps = ComponentPropsWithoutRef<"p">;

export function FieldError(props: FieldErrorProps) {
  return <StyledFieldError {...props} />;
}
