"use client";

import styled from "styled-components";

export const LootRowGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
  color: ${({ theme }) => theme.colors.foreground};
`;
