"use client";

import styled from "styled-components";

export const Description = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: 0.875rem;
`;

export const SectionTitle = styled.h3`
  margin: ${({ theme }) => theme.spacing.md} 0
    ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

export const LineList = styled.ul`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing.md};
  font-size: 0.875rem;
`;

export const Text = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  font-size: 0.875rem;
`;

export const MutedText = styled(Text)`
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;
