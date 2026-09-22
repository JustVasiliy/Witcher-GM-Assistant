"use client";

import Link from "next/link";
import styled from "styled-components";

export const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 0.875rem;
  text-decoration: none;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const TitleBlock = styled.div`
  h1 {
    margin: 0;
    color: ${({ theme }) => theme.colors.foreground};
    font-size: 1.75rem;
  }
`;

export const Meta = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 0.875rem;
`;

export const Description = styled.p`
  margin: ${({ theme }) => theme.spacing.sm} 0 0 0;
  color: ${({ theme }) => theme.colors.foreground};
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const Content = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;
