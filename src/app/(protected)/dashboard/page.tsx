import { auth } from "@/core/auth/auth";
import { Card } from "@/core/ui";
import { CampaignList, listCampaignsForUser } from "@/modules/campaigns";
import {
  CardGrid,
  CardTitle,
  EmptyStateLink,
  EmptyStateText,
  PageSubtitle,
  PageTitle,
  QuickActionLink,
  QuickActionList,
} from "./dashboard.styles";

export default async function DashboardPage() {
  const session = await auth();
  const campaigns = session?.user
    ? await listCampaignsForUser(session.user.id)
    : [];

  return (
    <div>
      <PageTitle>Welcome, {session?.user?.name ?? "Game Master"}</PageTitle>
      <PageSubtitle>
        Your assistant for running unforgettable stories in the world of The
        Witcher.
      </PageSubtitle>
      <CardGrid>
        <Card>
          <CardTitle>Notes</CardTitle>
          <EmptyStateText>No notes yet.</EmptyStateText>
          <EmptyStateLink href="/notes">New note</EmptyStateLink>
        </Card>
        <Card>
          <CardTitle>Last Game Session</CardTitle>
          <EmptyStateText>No active encounter.</EmptyStateText>
        </Card>
        <Card>
          <CardTitle>My Campaigns</CardTitle>
          <CampaignList campaigns={campaigns} limit={3} />
        </Card>
        <Card>
          <CardTitle>Quick Actions</CardTitle>
          <QuickActionList>
            <li>
              <QuickActionLink href="/rules">Rules</QuickActionLink>
            </li>
            <li>
              <QuickActionLink href="/bestiary">Bestiary</QuickActionLink>
            </li>
            <li>
              <QuickActionLink href="/notes">Notes</QuickActionLink>
            </li>
          </QuickActionList>
        </Card>
      </CardGrid>
    </div>
  );
}
