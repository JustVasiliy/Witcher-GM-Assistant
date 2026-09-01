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
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const TitleBlock = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  h1 {
    margin: 0;
    color: ${({ theme }) => theme.colors.foreground};
    font-size: 1.75rem;
  }

  p {
    margin: ${({ theme }) => theme.spacing.sm} 0 0 0;
    color: ${({ theme }) => theme.colors.mutedForeground};
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const Banner = styled.img`
  display: block;
  width: 100%;
  max-height: 16rem;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const Stat = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.surface};
  text-align: center;

  strong {
    display: block;
    color: ${({ theme }) => theme.colors.foreground};
    font-size: 1.25rem;
  }

  span {
    color: ${({ theme }) => theme.colors.mutedForeground};
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 60rem) {
    grid-template-columns: 1fr;
  }
`;

export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const SessionsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    margin: 0;
    color: ${({ theme }) => theme.colors.foreground};
    font-size: 1.125rem;
  }
`;

export const SessionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  > p {
    color: ${({ theme }) => theme.colors.mutedForeground};
  }
`;

export const SessionRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.surface};
`;

export const SessionNumber = styled.div`
  min-width: 1.5rem;
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 700;
  font-size: 1.25rem;
`;

export const SessionInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const SessionTitle = styled.div`
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: 600;
`;

export const SessionMeta = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 0.875rem;
`;

export const SessionDescription = styled.p`
  margin: ${({ theme }) => theme.spacing.sm} 0 0 0;
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 0.875rem;
`;

export const SessionActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const SidebarColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const DetailsCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.surface};

  h2 {
    margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
    color: ${({ theme }) => theme.colors.foreground};
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.mutedForeground};
    font-size: 0.875rem;
  }
`;

export const DetailsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
`;

export const DetailsLabel = styled.span`
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const DetailsValue = styled.span`
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: 600;
`;
