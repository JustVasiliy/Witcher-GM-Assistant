"use client";

import styled from "styled-components";

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const EmptyText = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.lg} 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;
