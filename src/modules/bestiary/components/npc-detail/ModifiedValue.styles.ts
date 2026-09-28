"use client";

import styled from "styled-components";

export const Tooltip = styled.ul`
  display: none;
  position: absolute;
  right: 0;
  bottom: calc(100% + ${({ theme }) => theme.spacing.sm});
  z-index: 10;
  margin: 0;
  padding: ${({ theme }) => theme.spacing.sm};
  list-style: none;
  white-space: nowrap;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 0.8125rem;
  font-weight: 400;
`;

export const Highlighted = styled.span`
  position: relative;
  color: ${({ theme }) => theme.colors.modified};
  cursor: help;

  &:hover > ${Tooltip}, &:focus > ${Tooltip} {
    display: block;
  }

  &:focus-visible {
    outline: 1px solid ${({ theme }) => theme.colors.modified};
    outline-offset: 2px;
  }
`;
