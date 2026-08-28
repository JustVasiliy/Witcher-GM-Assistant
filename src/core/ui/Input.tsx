"use client";

import type { ComponentPropsWithRef } from "react";
import { StyledInput } from "./Input.styles";

type InputProps = ComponentPropsWithRef<"input">;

export function Input({ ref, ...props }: InputProps) {
  return <StyledInput ref={ref} {...props} />;
}
