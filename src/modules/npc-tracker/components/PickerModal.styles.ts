"use client";

import styled from "styled-components";

export const SearchField = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const ResultList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  max-height: 20rem;
  overflow-y: auto;
`;

export const ResultRow = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.foreground};
  text-align: left;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

export const EmptyResult = styled.p`
  color: ${({ theme }) => theme.colors.mutedForeground};
`;
