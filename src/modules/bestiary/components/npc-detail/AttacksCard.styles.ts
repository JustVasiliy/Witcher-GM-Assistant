"use client";

import styled from "styled-components";

export const AttackRowGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr) auto;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: end;
  flex: 1;
`;
