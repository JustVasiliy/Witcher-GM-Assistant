"use client";

import styled from "styled-components";

export const BackButton = styled.button`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 1.25rem;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.foreground};
  }
`;

export const PickerList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const PickerEntry = styled.button`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: none;
  color: ${({ theme }) => theme.colors.foreground};
  text-align: left;
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.transitions.base};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const EntryHeader = styled.span`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  font-weight: 600;
`;

export const EntryRoll = styled.span`
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const EntryDescription = styled.span`
  font-size: 0.875rem;
`;
