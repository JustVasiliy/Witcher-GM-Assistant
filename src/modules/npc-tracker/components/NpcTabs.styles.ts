"use client";

import styled from "styled-components";

export const EmptyState = styled.p`
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const MissingState = styled.p`
  color: ${({ theme }) => theme.colors.danger};
`;

export const TabPanel = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export const TabActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;
