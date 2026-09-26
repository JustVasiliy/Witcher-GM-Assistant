"use client";

import styled from "styled-components";

export const SkillGroupsGrid = styled.div`
  container-type: inline-size;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const SkillGroupsList = styled.div`
  column-count: 3;
  column-gap: ${({ theme }) => theme.spacing.md};

  @container (max-width: 40rem) {
    column-count: 2;
  }

  @container (max-width: 22rem) {
    column-count: 1;
  }
`;

export const SkillGroupTile = styled.section`
  break-inside: avoid;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
`;

export const GroupHeading = styled.h3`
  margin: ${({ theme }) => theme.spacing.sm} 0;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const DiceButton = styled.button`
  margin-left: ${({ theme }) => theme.spacing.sm};
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
`;

export const SkillInputRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} 0;

  label {
    color: ${({ theme }) => theme.colors.mutedForeground};
    font-size: 0.8125rem;
  }
`;

export const SkillInputWrapper = styled.div`
  flex: 0 0 5.5rem;
`;
