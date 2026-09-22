"use client";

import styled from "styled-components";

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  h2 {
    margin: 0;
    color: ${({ theme }) => theme.colors.foreground};
    font-size: 1.125rem;
  }
`;

export const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  > p {
    color: ${({ theme }) => theme.colors.mutedForeground};
  }
`;
