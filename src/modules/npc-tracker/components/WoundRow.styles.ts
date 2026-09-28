"use client";

import styled from "styled-components";

export const Row = styled.li`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const RowHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const WoundName = styled.span`
  font-weight: 600;
`;

export const SeverityBadge = styled.span`
  padding: 0 ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 0.75rem;
`;

export const RemoveButton = styled.button`
  margin-left: auto;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.danger};
  }
`;

export const EffectText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 0.875rem;
`;

export const StateToggle = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StateButton = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.accent : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.accent : "transparent"};
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 0.8125rem;
  cursor: pointer;
`;
