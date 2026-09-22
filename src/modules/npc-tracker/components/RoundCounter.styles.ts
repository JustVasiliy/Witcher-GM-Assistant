"use client";

import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const Count = styled.span`
  min-width: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 1.25rem;
  font-weight: 700;
`;

export const Label = styled.span`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;
