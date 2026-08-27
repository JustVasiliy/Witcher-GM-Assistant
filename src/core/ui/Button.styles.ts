"use client";

import styled from "styled-components";

export const StyledButton = styled.button<{ $fullWidth?: boolean }>`
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radii.sm};
  border: none;
  background-color: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
