import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/core/auth/auth";
import { Card } from "@/core/ui";
import { DeleteCampaignButton, getCampaignById } from "@/modules/campaigns";

export default async function CampaignDetailPage({
  params,
}: PageProps<"/campaigns/[id]">) {
  const { id } = await params;
  const session = await auth();
  const campaign = session?.user
    ? await getCampaignById(id, session.user.id)
    : null;

  if (!campaign) {
    notFound();
  }

  return (
    <Card>
      <h1>{campaign.name}</h1>
      {campaign.description && <p>{campaign.description}</p>}
      <Link href={`/campaigns/${campaign.id}/edit`}>Edit</Link>
      <DeleteCampaignButton id={campaign.id} />
    </Card>
  );
}
