"use client";

import type { Campaign } from "@/generated/prisma/client";
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

function formatRelativeTime(date: Date): string {
  const diffMs = date.getTime() - Date.now();
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const divisions: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
    { amount: 60, unit: "seconds" },
    { amount: 60, unit: "minutes" },
    { amount: 24, unit: "hours" },
    { amount: 7, unit: "days" },
    { amount: 4.34524, unit: "weeks" },
    { amount: 12, unit: "months" },
    { amount: Number.POSITIVE_INFINITY, unit: "years" },
  ];

  let duration = diffMs / 1000;
  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }
  return rtf.format(Math.round(duration), "years");
}
