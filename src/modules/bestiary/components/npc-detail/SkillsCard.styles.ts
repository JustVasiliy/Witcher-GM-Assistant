"use client";

import styled from "styled-components";

export const SearchInputWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const GroupHeading = styled.h3`
  margin: ${({ theme }) => theme.spacing.md} 0
    ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const DiceButton = styled.button`
  margin-left: ${({ theme }) => theme.spacing.sm};
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
`;
