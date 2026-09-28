"use client";

import styled from "styled-components";

export const EmptyState = styled.p`
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const TabPanel = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export const TabActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;
