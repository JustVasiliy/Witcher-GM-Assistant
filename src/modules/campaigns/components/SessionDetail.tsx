"use client";

import type { ReactNode } from "react";
import { LinkButton } from "@/core/ui";
import type { CampaignSession } from "@/generated/prisma/client";
import { formatDateOnly } from "../utils";
import { DeleteSessionButton } from "./DeleteSessionButton";
import {
  BackLink,
  Content,
  Description,
  HeaderActions,
  HeaderRow,
  Meta,
  TitleBlock,
} from "./SessionDetail.styles";

type SessionDetailProps = {
  campaignId: string;
  session: CampaignSession;
  children: ReactNode;
};

export function SessionDetail({
  campaignId,
  session,
  children,
}: SessionDetailProps) {
  return (
    <div>
      <BackLink href={`/campaigns/${campaignId}`}>← Back to Campaign</BackLink>
      <HeaderRow>
        <TitleBlock>
          <h1>{session.title}</h1>
          <Meta>
            {formatDateOnly(session.date)}
            {session.playerCount !== null
              ? ` • ${session.playerCount} players`
              : ""}
          </Meta>
          {session.description && (
            <Description>{session.description}</Description>
          )}
        </TitleBlock>
        <HeaderActions>
          <LinkButton
            href={`/campaigns/${campaignId}/sessions/${session.id}/edit`}
          >
            Edit Session
          </LinkButton>
          <DeleteSessionButton campaignId={campaignId} sessionId={session.id} />
        </HeaderActions>
      </HeaderRow>
      <Content>{children}</Content>
    </div>
  );
}
