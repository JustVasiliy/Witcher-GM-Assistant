import { auth } from "@/core/auth/auth";
import { CampaignBrowser, listCampaignsForUser } from "@/modules/campaigns";

export default async function CampaignsPage() {
  const session = await auth();
  const campaigns = session?.user
    ? await listCampaignsForUser(session.user.id)
    : [];

  return <CampaignBrowser campaigns={campaigns} />;
}
