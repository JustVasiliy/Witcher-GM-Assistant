"use client";

import styled from "styled-components";

export const EmptyText = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const WoundList = styled.ul`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  padding: 0;
  list-style: none;
`;

export const AddButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;
