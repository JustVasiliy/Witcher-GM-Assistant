import type { ArmorLocations } from "./schemas";

// Plain module (no "use client") so server code — e.g. the encounter round
// tick — can import these without pulling in a client component.
export const ARMOR_LABELS: Record<keyof ArmorLocations, string> = {
  head: "Head",
  torso: "Torso",
  rightHand: "Right Hand",
  leftHand: "Left Hand",
  rightLeg: "Right Leg",
  leftLeg: "Left Leg",
};

export const DEFAULT_ARMOR: ArmorLocations = {
  head: 0,
  torso: 0,
  rightHand: 0,
  leftHand: 0,
  rightLeg: 0,
  leftLeg: 0,
};
