"use client";

import styled from "styled-components";

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;

  h1 {
    margin: 0;
    color: ${({ theme }) => theme.colors.foreground};
    font-size: 1.75rem;
  }

  p {
    margin: ${({ theme }) => theme.spacing.sm} 0 0 0;
    color: ${({ theme }) => theme.colors.mutedForeground};
  }
`;

export const NotesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  > p {
    color: ${({ theme }) => theme.colors.mutedForeground};
  }
`;

export const NoteRow = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.surface};
`;

export const NoteTitle = styled.div`
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: 600;
`;

export const NoteContent = styled.p`
  margin: ${({ theme }) => theme.spacing.sm} 0 0 0;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 0.875rem;
  white-space: pre-wrap;
`;

export const NoteActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;
