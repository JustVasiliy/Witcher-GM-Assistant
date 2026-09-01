"use client";

import styled, { css } from "styled-components";

const sizeStyles = {
  sm: css`
    width: 3rem;
    height: 3rem;
    font-size: 1.25rem;
  `,
  lg: css`
    width: 5rem;
    height: 5rem;
    font-size: 2rem;
  `,
};

export const ThumbnailWrapper = styled.div<{ $size: "sm" | "lg" }>`
  ${({ $size }) => sizeStyles[$size]}
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radii.sm};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ThumbnailImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ThumbnailFallback = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-weight: 600;
`;
