"use client";

import styled from "styled-components";

export const LocationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const LocationButton = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.accent : theme.colors.border};
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.accent : theme.colors.surface};
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
`;

export const LocationSp = styled.span`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 0.75rem;
  font-weight: 400;
`;

export const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.foreground};
`;

export const PreviewBox = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const PreviewRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 0.8125rem;
`;

export const PreviewLabel = styled.span`
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: 600;
`;

export const PreviewFormula = styled.span`
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const TotalRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding-top: 0.25rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.875rem;
  font-weight: 600;
`;

export const TotalValue = styled.span`
  color: ${({ theme }) => theme.colors.accent};
`;
