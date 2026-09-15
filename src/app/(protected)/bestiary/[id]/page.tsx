import { notFound } from "next/navigation";
import { auth } from "@/core/auth/auth";
import {
  CORE_CREATURES,
  NpcDetailPage,
  getCustomNpcById,
  parseNpcDetails,
  type Creature,
} from "@/modules/bestiary";

export default async function BestiaryDetailPage({
  params,
}: PageProps<"/bestiary/[id]">) {
  const { id } = await params;
  const session = await auth();

  const coreCreature = CORE_CREATURES.find((creature) => creature.id === id);
  if (coreCreature) {
    const creature: Creature = { ...coreCreature, source: "core" };
    return <NpcDetailPage creature={creature} />;
  }

  const customNpc = session?.user
    ? await getCustomNpcById(id, session.user.id)
    : null;

  if (!customNpc) {
    notFound();
  }

  const creature: Creature = {
    id: customNpc.id,
    name: customNpc.name,
    type: customNpc.type,
    source: "custom",
    details: parseNpcDetails(customNpc.details),
  };

  return <NpcDetailPage creature={creature} />;
}
