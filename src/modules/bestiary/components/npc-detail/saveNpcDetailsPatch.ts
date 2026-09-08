import { forkCoreCreature, updateCustomNpcDetails } from "../../actions";
import type { NpcDetailsInput } from "../../schemas";
import type { Creature } from "../../types";

/**
 * Every card except HeaderCard saves through this one dispatch: fork a
 * new CustomNpc on the first save while viewing a core creature,
 * otherwise merge-patch the existing custom NPC's details in place.
 */
export function saveNpcDetailsPatch(
  creature: Creature,
  patch: Partial<NpcDetailsInput>,
): Promise<{ error?: string } | undefined> {
  if (creature.source === "core") {
    return forkCoreCreature(creature.id, patch);
  }
  return updateCustomNpcDetails(creature.id, patch);
}
