import { auth } from "@/core/auth/auth";
import { Card } from "@/core/ui";
import { CampaignList, listCampaignsForUser } from "@/modules/campaigns";

export default async function CampaignsPage() {
  const session = await auth();
  const campaigns = session?.user
    ? await listCampaignsForUser(session.user.id)
    : [];

  return (
    <div>
      <h1>My Campaigns</h1>
      <Card>
        <CampaignList campaigns={campaigns} />
      </Card>
    </div>
  );
}
