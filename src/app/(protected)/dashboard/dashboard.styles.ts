"use client";

import Link from "next/link";
import styled from "styled-components";

export const PageTitle = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 1.75rem;
`;

export const PageSubtitle = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const CardTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const EmptyStateText = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const EmptyStateLink = styled(Link)`
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.875rem;
`;

export const QuickActionList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const QuickActionLink = styled(Link)`
  display: block;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.foreground};
`;
