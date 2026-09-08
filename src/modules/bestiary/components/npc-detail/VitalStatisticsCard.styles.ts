"use client";

import styled from "styled-components";

export const DamageButton = styled.button`
  margin-left: ${({ theme }) => theme.spacing.sm};
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 0.75rem;
  line-height: 1;
  padding: 0.25rem 0.375rem;
  cursor: pointer;
`;
