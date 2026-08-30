"use client";

import Link from "next/link";
import styled from "styled-components";

export const Shell = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const SidebarNav = styled.nav`
  width: 14rem;
  flex-shrink: 0;
  padding: ${({ theme }) => theme.spacing.lg};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
`;

export const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const NavLink = styled(Link)<{ $active?: boolean }>`
  display: block;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.sm};
  border-left: 2px solid
    ${({ $active, theme }) => ($active ? theme.colors.accent : "transparent")};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.foreground : theme.colors.mutedForeground};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
`;

export const Main = styled.div`
  flex: 1;
  min-width: 0;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const AppTitle = styled.span`
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.foreground};
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const UserName = styled.span`
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const Content = styled.main`
  padding: ${({ theme }) => theme.spacing.lg};
`;
