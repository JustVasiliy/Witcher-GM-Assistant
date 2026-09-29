"use client";

import styled from "styled-components";

export const FireTable = styled.table`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.md};
  border-collapse: collapse;
  font-size: 0.875rem;

  th,
  td {
    padding: ${({ theme }) => theme.spacing.sm};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    text-align: left;
  }

  th {
    color: ${({ theme }) => theme.colors.mutedForeground};
    font-weight: 600;
  }
`;

export const NumberCell = styled.td`
  font-variant-numeric: tabular-nums;
`;

export const BurningCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const Total = styled.p`
  margin: ${({ theme }) => theme.spacing.md} 0 0;
  color: ${({ theme }) => theme.colors.mutedForeground};

  strong {
    color: ${({ theme }) => theme.colors.foreground};
  }
`;
