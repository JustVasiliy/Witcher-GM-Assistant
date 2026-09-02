import { auth } from "@/core/auth/auth";
import {
  BestiaryBrowser,
  CORE_CREATURES,
  listCustomNpcsForUser,
  type Creature,
} from "@/modules/bestiary";

export default async function BestiaryPage() {
  const session = await auth();
  const customNpcs = session?.user
    ? await listCustomNpcsForUser(session.user.id)
    : [];

  const creatures: Creature[] = [
    ...CORE_CREATURES.map((creature) => ({
      ...creature,
      source: "core" as const,
    })),
    ...customNpcs.map((npc) => ({
      id: npc.id,
      name: npc.name,
      type: npc.type,
      source: "custom" as const,
    })),
  ];

  return <BestiaryBrowser creatures={creatures} />;
}
