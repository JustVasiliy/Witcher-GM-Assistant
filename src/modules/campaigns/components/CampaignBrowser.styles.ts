"use client";

import styled from "styled-components";

export const Browser = styled.div`
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
`;

export const HeaderText = styled.div`
  h1 {
    margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
    color: ${({ theme }) => theme.colors.foreground};
    font-size: 1.75rem;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.mutedForeground};
  }
`;

export const SearchRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;

  label {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.mutedForeground};
    font-size: 0.875rem;
    white-space: nowrap;
  }
`;

export const SearchInputWrapper = styled.div`
  flex: 1;
  min-width: 16rem;
`;

export const SortSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.foreground};
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.surface};
`;

export const RowInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const RowName = styled.div`
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: 600;
  font-size: 1.125rem;
`;

export const RowMeta = styled.div`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 0.875rem;
`;

export const RowActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const EmptyText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;
