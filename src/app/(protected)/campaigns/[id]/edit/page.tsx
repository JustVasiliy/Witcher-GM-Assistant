import { notFound } from "next/navigation";
import { auth } from "@/core/auth/auth";
import { CampaignForm, getCampaignById } from "@/modules/campaigns";

export default async function EditCampaignPage({
  params,
}: PageProps<"/campaigns/[id]/edit">) {
  const { id } = await params;
  const session = await auth();
  const campaign = session?.user
    ? await getCampaignById(id, session.user.id)
    : null;

  if (!campaign) {
    notFound();
  }

  return <CampaignForm campaign={campaign} />;
}
