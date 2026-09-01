"use client";

import Link from "next/link";
import styled from "styled-components";

export const MenuWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export const MenuButton = styled.button`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
`;

export const MenuPanel = styled.div`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing.sm});
  right: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 10rem;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background-color: ${({ theme }) => theme.colors.surface};

  form {
    margin: 0;
  }

  form button {
    width: 100%;
    padding: ${({ theme }) => theme.spacing.sm};
    border: none;
    border-radius: ${({ theme }) => theme.radii.sm};
    background-color: transparent;
    color: ${({ theme }) => theme.colors.danger};
    font-weight: 600;
    text-align: left;
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) => theme.colors.background};
    }
  }
`;

export const MenuLink = styled(Link)`
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.foreground};
  text-decoration: none;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;
