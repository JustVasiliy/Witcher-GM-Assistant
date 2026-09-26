"use client";

import styled from "styled-components";
import { ReadValue } from "./SharedCardFields.styles";

export const HeaderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  column-gap: ${({ theme }) => theme.spacing.lg};
`;

export const NoWrapValue = styled(ReadValue)`
  white-space: nowrap;
`;

export const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.foreground};
`;
