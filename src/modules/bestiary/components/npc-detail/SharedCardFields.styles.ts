"use client";

import styled from "styled-components";

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  label {
    color: ${({ theme }) => theme.colors.mutedForeground};
    font-size: 0.8125rem;
  }
`;

export const ReadRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

export const ReadLabel = styled.span`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 0.875rem;
`;

export const ReadValue = styled.span`
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: 600;
`;

export const ActionsRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;
