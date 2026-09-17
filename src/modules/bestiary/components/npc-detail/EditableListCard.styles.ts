"use client";

import styled from "styled-components";

export const ListRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  padding: 0.25rem;

  &:hover {
    color: ${({ theme }) => theme.colors.danger};
  }
`;

export const EmptyText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 0.875rem;
`;
