"use client";

import styled from "styled-components";

export const EffectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const EffectButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.accent : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.background : "transparent"};
  box-shadow: ${({ theme, $active }) =>
    $active ? `inset 0 0 0 1px ${theme.colors.accent}` : "none"};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.foreground : theme.colors.mutedForeground};
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
  font-size: 0.875rem;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  text-align: left;
  cursor: pointer;
  transition: opacity ${({ theme }) => theme.transitions.base};

  &:hover,
  &:focus-visible {
    opacity: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const EffectIcon = styled.span`
  font-size: 1.125rem;
`;
