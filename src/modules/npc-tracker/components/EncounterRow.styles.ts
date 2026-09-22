"use client";

import styled from "styled-components";

export const Row = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.md};
`;

export const SummaryBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const NameGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
  min-width: 0;
`;

export const NameButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  text-align: left;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const Meta = styled.span`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 0.75rem;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const ExpandedPanel = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const SectionHeading = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const NotesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const NoteItem = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};

  strong {
    display: block;
    color: ${({ theme }) => theme.colors.foreground};
  }

  p {
    margin: ${({ theme }) => theme.spacing.sm} 0 0 0;
    color: ${({ theme }) => theme.colors.mutedForeground};
    font-size: 0.875rem;
    white-space: pre-wrap;
  }
`;
