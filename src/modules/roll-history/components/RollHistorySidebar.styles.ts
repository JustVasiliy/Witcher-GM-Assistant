"use client";

import styled from "styled-components";

export const Aside = styled.aside`
  display: flex;
  flex-shrink: 0;
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
`;

export const ToggleButton = styled.button`
  width: 2.5rem;
  align-self: flex-start;
  padding: ${({ theme }) => theme.spacing.sm};
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 1.25rem;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.foreground};
  }
`;

export const Panel = styled.div`
  width: 20rem;
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;
`;

export const PanelHeading = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const EmptyState = styled.p`
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const EntryList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const EntryItem = styled.li<{ $success: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ $success, theme }) =>
    $success ? theme.colors.foreground : theme.colors.danger};
  font-size: 0.875rem;
`;
