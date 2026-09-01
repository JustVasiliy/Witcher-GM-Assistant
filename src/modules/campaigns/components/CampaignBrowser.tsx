"use client";

import { useMemo, useState } from "react";
import { Input, LinkButton } from "@/core/ui";
import type { CampaignWithSessionCount } from "../types";
import { formatRelativeTime } from "../utils";
import { CampaignActionsMenu } from "./CampaignActionsMenu";
import { CampaignThumbnail } from "./CampaignThumbnail";
import { DeleteCampaignButton } from "./DeleteCampaignButton";
import {
  Browser,
  EmptyText,
  Header,
  HeaderText,
  List,
  Row,
  RowActions,
  RowInfo,
  RowMeta,
  RowName,
  SearchInputWrapper,
  SearchRow,
  SortSelect,
} from "./CampaignBrowser.styles";

type CampaignBrowserProps = {
  campaigns: CampaignWithSessionCount[];
};

type SortOption = "lastPlayed" | "name";

export function CampaignBrowser({ campaigns }: CampaignBrowserProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("lastPlayed");

  const visibleCampaigns = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = normalizedQuery
      ? campaigns.filter((campaign) =>
          campaign.name.toLowerCase().includes(normalizedQuery),
        )
      : campaigns;

    return [...filtered].sort((a, b) => {
      if (sort === "name") {
        return a.name.localeCompare(b.name);
      }
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
  }, [campaigns, query, sort]);

  return (
    <Browser>
      <Header>
        <HeaderText>
          <h1>Campaigns</h1>
          <p>Create and manage your Witcher TTRPG campaigns.</p>
        </HeaderText>
        <LinkButton href="/campaigns/new">+ New Campaign</LinkButton>
      </Header>
      <SearchRow>
        <SearchInputWrapper>
          <Input
            type="search"
            placeholder="Search campaigns..."
            aria-label="Search campaigns"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </SearchInputWrapper>
        <label htmlFor="campaign-sort">
          Sort by:
          <SortSelect
            id="campaign-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
          >
            <option value="lastPlayed">Last played</option>
            <option value="name">Name</option>
          </SortSelect>
        </label>
      </SearchRow>
      <List>
        {visibleCampaigns.length === 0 && (
          <EmptyText>No campaigns found.</EmptyText>
        )}
        {visibleCampaigns.map((campaign) => (
          <Row key={campaign.id}>
            <CampaignThumbnail
              name={campaign.name}
              imageUrl={campaign.imageUrl}
            />
            <RowInfo>
              <RowName>{campaign.name}</RowName>
              <RowMeta suppressHydrationWarning>
                Last played {formatRelativeTime(campaign.updatedAt)}
              </RowMeta>
              <RowMeta>
                {campaign._count.sessions} sessions
                {campaign.playerCount !== null
                  ? ` • ${campaign.playerCount} players`
                  : ""}
              </RowMeta>
            </RowInfo>
            <RowActions>
              <LinkButton href={`/campaigns/${campaign.id}`}>
                Open Campaign
              </LinkButton>
              <CampaignActionsMenu
                editHref={`/campaigns/${campaign.id}/edit`}
                editLabel="Edit Campaign"
              >
                <DeleteCampaignButton id={campaign.id} />
              </CampaignActionsMenu>
            </RowActions>
          </Row>
        ))}
      </List>
    </Browser>
  );
}
