"use client";

import { Button, LinkButton } from "@/core/ui";
import type { CampaignWithSessions } from "../types";
import { formatDate, formatDateOnly } from "../utils";
import { CampaignActionsMenu } from "./CampaignActionsMenu";
import { CampaignThumbnail } from "./CampaignThumbnail";
import { DeleteCampaignButton } from "./DeleteCampaignButton";
import { DeleteSessionButton } from "./DeleteSessionButton";
import {
  BackLink,
  Banner,
  DetailGrid,
  DetailsCard,
  DetailsLabel,
  DetailsRow,
  DetailsValue,
  HeaderActions,
  HeaderRow,
  MainColumn,
  SessionActions,
  SessionDescription,
  SessionInfo,
  SessionMeta,
  SessionNumber,
  SessionRow,
  SessionTitle,
  SessionsHeader,
  SessionsList,
  SidebarColumn,
  Stat,
  StatsRow,
  TitleBlock,
} from "./CampaignDetail.styles";

type CampaignDetailProps = {
  campaign: CampaignWithSessions;
};

export function CampaignDetail({ campaign }: CampaignDetailProps) {
  const orderedSessions = [...campaign.sessions].sort(
    (a, b) =>
      a.date.getTime() - b.date.getTime() ||
      a.createdAt.getTime() - b.createdAt.getTime(),
  );

  return (
    <div>
      <BackLink href="/campaigns">← Back to Campaigns</BackLink>
      <HeaderRow>
        <TitleBlock>
          <CampaignThumbnail
            name={campaign.name}
            imageUrl={campaign.imageUrl}
            size="lg"
          />
          <div>
            <h1>{campaign.name}</h1>
            {campaign.description && <p>{campaign.description}</p>}
          </div>
        </TitleBlock>
        <HeaderActions>
          <LinkButton href={`/campaigns/${campaign.id}/edit`}>
            Edit Campaign
          </LinkButton>
          <CampaignActionsMenu
            editHref={`/campaigns/${campaign.id}/edit`}
            editLabel="Edit Campaign"
          >
            <DeleteCampaignButton id={campaign.id} />
          </CampaignActionsMenu>
        </HeaderActions>
      </HeaderRow>
      {campaign.imageUrl && (
        <Banner src={campaign.imageUrl} alt={`${campaign.name} banner`} />
      )}
      <StatsRow>
        <Stat>
          <strong>{orderedSessions.length}</strong>
          <span>Sessions</span>
        </Stat>
        <Stat>
          <strong>{campaign.playerCount ?? "—"}</strong>
          <span>Players</span>
        </Stat>
        <Stat>
          <strong suppressHydrationWarning>
            {formatDate(campaign.createdAt)}
          </strong>
          <span>Created</span>
        </Stat>
        <Stat>
          <strong suppressHydrationWarning>
            {formatDate(campaign.updatedAt)}
          </strong>
          <span>Last updated</span>
        </Stat>
      </StatsRow>
      <DetailGrid>
        <MainColumn>
          <SessionsHeader>
            <h2>Sessions</h2>
            <LinkButton href={`/campaigns/${campaign.id}/sessions/new`}>
              + New Session
            </LinkButton>
          </SessionsHeader>
          <SessionsList>
            {orderedSessions.length === 0 && <p>No sessions yet.</p>}
            {orderedSessions.map((session, index) => (
              <SessionRow key={session.id}>
                <SessionNumber>{index + 1}</SessionNumber>
                <SessionInfo>
                  <SessionTitle>{session.title}</SessionTitle>
                  <SessionMeta>
                    {formatDateOnly(session.date)}
                    {session.playerCount !== null
                      ? ` • ${session.playerCount} players`
                      : ""}
                  </SessionMeta>
                  {session.description && (
                    <SessionDescription>
                      {session.description}
                    </SessionDescription>
                  )}
                </SessionInfo>
                <SessionActions>
                  <Button type="button" disabled>
                    Open Session
                  </Button>
                  <CampaignActionsMenu
                    editHref={`/campaigns/${campaign.id}/sessions/${session.id}/edit`}
                    editLabel="Edit Session"
                  >
                    <DeleteSessionButton
                      campaignId={campaign.id}
                      sessionId={session.id}
                    />
                  </CampaignActionsMenu>
                </SessionActions>
              </SessionRow>
            ))}
          </SessionsList>
        </MainColumn>
        <SidebarColumn>
          <DetailsCard>
            <h2>Campaign Details</h2>
            <DetailsRow>
              <DetailsLabel>Created</DetailsLabel>
              <DetailsValue suppressHydrationWarning>
                {formatDate(campaign.createdAt)}
              </DetailsValue>
            </DetailsRow>
            <DetailsRow>
              <DetailsLabel>Last updated</DetailsLabel>
              <DetailsValue suppressHydrationWarning>
                {formatDate(campaign.updatedAt)}
              </DetailsValue>
            </DetailsRow>
            <DetailsRow>
              <DetailsLabel>Sessions</DetailsLabel>
              <DetailsValue>{orderedSessions.length}</DetailsValue>
            </DetailsRow>
            <DetailsRow>
              <DetailsLabel>Players</DetailsLabel>
              <DetailsValue>{campaign.playerCount ?? "—"}</DetailsValue>
            </DetailsRow>
            {campaign.description && <p>{campaign.description}</p>}
            <LinkButton href={`/campaigns/${campaign.id}/edit`} fullWidth>
              Edit Description
            </LinkButton>
          </DetailsCard>
        </SidebarColumn>
      </DetailGrid>
    </div>
  );
}
