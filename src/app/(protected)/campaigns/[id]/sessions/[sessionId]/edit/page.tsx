import { notFound } from "next/navigation";
import { auth } from "@/core/auth/auth";
import { getSessionById, SessionForm } from "@/modules/campaigns";

export default async function EditSessionPage({
  params,
}: PageProps<"/campaigns/[id]/sessions/[sessionId]/edit">) {
  const { id, sessionId } = await params;
  const authSession = await auth();
  const campaignSession = authSession?.user
    ? await getSessionById(id, sessionId, authSession.user.id)
    : null;

  if (!campaignSession) {
    notFound();
  }

  return <SessionForm campaignId={id} session={campaignSession} />;
}
