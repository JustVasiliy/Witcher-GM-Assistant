"use client";

import Link from "next/link";
import styled from "styled-components";

export const StyledLinkButton = styled(Link)<{ $fullWidth?: boolean }>`
  display: inline-block;
  box-sizing: border-box;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radii.sm};
  border: none;
  background-color: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
`;
