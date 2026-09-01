"use client";

import type { Campaign } from "@/generated/prisma/client";
import { formatRelativeTime } from "../utils";
import {
  CampaignItem,
  CampaignMeta,
  CampaignName,
  EmptyText,
  List,
  NewCampaignTile,
  ViewAllLink,
} from "./CampaignList.styles";

type CampaignListProps = {
  campaigns: Campaign[];
  limit?: number;
};

export function CampaignList({ campaigns, limit }: CampaignListProps) {
  const visibleCampaigns =
    limit !== undefined ? campaigns.slice(0, limit) : campaigns;
  const hasMore = limit !== undefined && campaigns.length > limit;

  return (
    <List>
      {campaigns.length === 0 && <EmptyText>No campaigns yet.</EmptyText>}
      {visibleCampaigns.map((campaign) => (
        <CampaignItem key={campaign.id} href={`/campaigns/${campaign.id}`}>
          <CampaignName>{campaign.name}</CampaignName>
          <CampaignMeta suppressHydrationWarning>
            Updated {formatRelativeTime(campaign.updatedAt)}
          </CampaignMeta>
        </CampaignItem>
      ))}
      <NewCampaignTile href="/campaigns/new">+ New campaign</NewCampaignTile>
      {hasMore && (
        <ViewAllLink href="/campaigns">View all campaigns</ViewAllLink>
      )}
    </List>
  );
}
