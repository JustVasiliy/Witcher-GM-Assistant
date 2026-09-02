"use client";

import styled from "styled-components";

export const Row = styled.div<{ $custom: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-left: 3px solid
    ${({ theme, $custom }) => ($custom ? theme.colors.accent : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.surface};
`;

export const Avatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 3rem;
  height: 3rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-weight: 600;
  font-size: 1.25rem;
`;

export const Info = styled.div`
  flex: 1;
  min-width: 0;
`;

export const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const Name = styled.span`
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: 600;
  font-size: 1.125rem;
`;

export const SourcePill = styled.span<{ $custom: boolean }>`
  padding: 0.125rem 0.5rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid
    ${({ theme, $custom }) => ($custom ? theme.colors.accent : theme.colors.border)};
  color: ${({ theme, $custom }) =>
    $custom ? theme.colors.accent : theme.colors.mutedForeground};
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
`;

export const TypeLabel = styled.div`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 0.875rem;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const Chevron = styled.span`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 1.25rem;
  opacity: 0.5;
`;
