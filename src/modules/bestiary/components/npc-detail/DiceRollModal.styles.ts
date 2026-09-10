"use client";

import styled from "styled-components";

export const RollExpression = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-weight: 600;

  input {
    width: 5rem;
  }
`;

export const RollTotal = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.mutedForeground};

  strong {
    color: ${({ theme }) => theme.colors.foreground};
  }
`;
