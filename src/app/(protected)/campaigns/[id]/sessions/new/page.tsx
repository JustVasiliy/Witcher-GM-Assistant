import { notFound } from "next/navigation";
import { auth } from "@/core/auth/auth";
import { getCampaignById, SessionForm } from "@/modules/campaigns";

export default async function NewSessionPage({
  params,
}: PageProps<"/campaigns/[id]/sessions/new">) {
  const { id } = await params;
  const session = await auth();
  const campaign = session?.user
    ? await getCampaignById(id, session.user.id)
    : null;

  if (!campaign) {
    notFound();
  }

  return <SessionForm campaignId={campaign.id} />;
}
