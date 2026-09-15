"use client";

import styled from "styled-components";

export const AbilityRow = styled.div`
  flex: 1;

  strong {
    display: block;
    color: ${({ theme }) => theme.colors.foreground};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.mutedForeground};
    font-size: 0.875rem;
  }
`;

export const AbilityRowGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;

  textarea {
    padding: ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.radii.sm};
    border: 1px solid ${({ theme }) => theme.colors.border};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.foreground};
    font-family: inherit;
    min-height: 4rem;
  }
`;
