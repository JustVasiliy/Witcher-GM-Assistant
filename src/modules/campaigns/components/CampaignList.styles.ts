"use client";

import Link from "next/link";
import styled from "styled-components";

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const CampaignItem = styled(Link)`
  display: block;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
`;

export const CampaignName = styled.div`
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: 600;
`;

export const CampaignMeta = styled.div`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 0.875rem;
`;

export const NewCampaignTile = styled(Link)`
  display: block;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  text-align: center;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

export const ViewAllLink = styled(Link)`
  text-align: center;
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.875rem;
`;

export const EmptyText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;
