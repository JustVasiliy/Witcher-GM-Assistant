import { notFound } from "next/navigation";
import { auth } from "@/core/auth/auth";
import {
  CORE_CREATURES,
  listCustomNpcsForUser,
  parseNpcDetails,
  type Creature,
} from "@/modules/bestiary";
import { getSessionById, SessionDetail } from "@/modules/campaigns";
import { listNotesForUser } from "@/modules/notes";
import { EncounterList, listEncountersForSession } from "@/modules/npc-tracker";

export default async function SessionDetailPage({
  params,
}: PageProps<"/campaigns/[id]/sessions/[sessionId]">) {
  const { id: campaignId, sessionId } = await params;
  const session = await auth();
  if (!session?.user) {
    notFound();
  }

  const campaignSession = await getSessionById(
    campaignId,
    sessionId,
    session.user.id,
  );
  if (!campaignSession) {
    notFound();
  }

  const [encounters, customNpcs, availableNotes] = await Promise.all([
    listEncountersForSession(sessionId, session.user.id),
    listCustomNpcsForUser(session.user.id),
    listNotesForUser(session.user.id),
  ]);

  const creatureCatalog: Creature[] = [
    ...CORE_CREATURES.map((creature) => ({
      ...creature,
      source: "core" as const,
    })),
    ...customNpcs.map((npc) => ({
      id: npc.id,
      name: npc.name,
      type: npc.type,
      source: "custom" as const,
      details: parseNpcDetails(npc.details),
    })),
  ];

  return (
    <SessionDetail campaignId={campaignId} session={campaignSession}>
      <EncounterList
        campaignId={campaignId}
        sessionId={sessionId}
        encounters={encounters}
        creatureCatalog={creatureCatalog}
        availableNotes={availableNotes}
      />
    </SessionDetail>
  );
}
