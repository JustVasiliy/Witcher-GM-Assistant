import { z } from "zod";

// --- Core statistics -------------------------------------------------

export const STAT_KEYS = [
  "INT",
  "REF",
  "DEX",
  "BODY",
  "SPD",
  "EMP",
  "CRA",
  "WILL",
  "LUCK",
] as const;
export const StatKeySchema = z.enum(STAT_KEYS);
export type StatKey = z.infer<typeof StatKeySchema>;

const statValue = (label: string) =>
  z
    .number()
    .int(`${label} must be a whole number.`)
    .min(0, `${label} cannot be negative.`);

export const CoreStatsSchema = z.object({
  INT: statValue("INT"),
  REF: statValue("REF"),
  DEX: statValue("DEX"),
  BODY: statValue("BODY"),
  SPD: statValue("SPD"),
  EMP: statValue("EMP"),
  CRA: statValue("CRA"),
  WILL: statValue("WILL"),
  LUCK: statValue("LUCK"),
});
export type CoreStats = z.infer<typeof CoreStatsSchema>;

// --- Skills, grouped by owning stat (this grouping is the single
// source of truth for "which stat backs which skill") ------------------

export const INT_SKILLS = [
  "Awareness",
  "Business",
  "Deduction",
  "Education",
  "Language",
  "Monster Lore",
  "Social Etiquette",
  "Streetwise",
  "Tactics",
  "Teaching",
  "Wilderness Survival",
] as const;
export const REF_SKILLS = [
  "Brawling",
  "Dodge/Escape",
  "Melee",
  "Riding",
  "Sailing",
  "Small Blades",
  "Staff/Spear",
  "Swordsmanship",
] as const;
export const DEX_SKILLS = [
  "Archery",
  "Athletics",
  "Crossbow",
  "Sleight of Hand",
  "Stealth",
] as const;
export const BODY_SKILLS = ["Physique", "Endurance"] as const;
export const EMP_SKILLS = [
  "Charisma",
  "Deceit",
  "Fine Arts",
  "Gambling",
  "Grooming and Style",
  "Human Perception",
  "Leadership",
  "Persuasion",
  "Performance",
  "Seduction",
] as const;
export const CRA_SKILLS = [
  "Alchemy",
  "Crafting",
  "Disguise",
  "First Aid",
  "Forgery",
  "Pick Lock",
  "Trap Crafting",
] as const;
export const WILL_SKILLS = [
  "Courage",
  "Hex Weaving",
  "Intimidation",
  "Spell Casting",
  "Resist Magic",
  "Resist Coercion",
  "Ritual Crafting",
] as const;
// SPD and LUCK intentionally have no skills.

export const SKILL_NAMES = [
  ...INT_SKILLS,
  ...REF_SKILLS,
  ...DEX_SKILLS,
  ...BODY_SKILLS,
  ...EMP_SKILLS,
  ...CRA_SKILLS,
  ...WILL_SKILLS,
] as const;
export const SkillNameSchema = z.enum(SKILL_NAMES);
export type SkillName = z.infer<typeof SkillNameSchema>;

function mapSkillsToStat(
  skills: readonly SkillName[],
  stat: StatKey,
): Record<SkillName, StatKey> {
  return Object.fromEntries(skills.map((skill) => [skill, stat])) as Record<
    SkillName,
    StatKey
  >;
}

export const SKILL_TO_STAT: Record<SkillName, StatKey> = {
  ...mapSkillsToStat(INT_SKILLS, "INT"),
  ...mapSkillsToStat(REF_SKILLS, "REF"),
  ...mapSkillsToStat(DEX_SKILLS, "DEX"),
  ...mapSkillsToStat(BODY_SKILLS, "BODY"),
  ...mapSkillsToStat(EMP_SKILLS, "EMP"),
  ...mapSkillsToStat(CRA_SKILLS, "CRA"),
  ...mapSkillsToStat(WILL_SKILLS, "WILL"),
};

// Raw skill values may be NEGATIVE (proven by the Ghoul fixture's Stealth
// -3 and Resist Magic -1) — do not add .min(0) here.
export const SkillValueSchema = z
  .number()
  .int("Skill value must be a whole number.");

// Sparse on purpose: a real stat block lists only the skills that matter
// for that creature (Ghoul: 10 of ~50), not all of them at a default.
export const SkillValuesSchema = z.partialRecord(
  SkillNameSchema,
  SkillValueSchema,
);
export type SkillValues = z.infer<typeof SkillValuesSchema>;

// --- Vital / secondary stats (no formula given — must be stored) -----

const vitalValue = (label: string) =>
  z
    .number()
    .int(`${label} must be a whole number.`)
    .min(0, `${label} cannot be negative.`);

export const VitalStatsSchema = z.object({
  stun: vitalValue("Stun"),
  stamina: vitalValue("Stamina"),
  recovery: vitalValue("Recovery"),
  hp: vitalValue("HP"),
  vigor: vitalValue("Vigor"),
});
export type VitalStats = z.infer<typeof VitalStatsSchema>;
// Run/Leap/Encumbrance deliberately excluded — computed in utils.ts.

// --- Armor, per body part -------------------------------------------------------

const armorLocationValue = (label: string) =>
  z
    .number()
    .int(`${label} must be a whole number.`)
    .min(0, `${label} cannot be negative.`);

export const ArmorLocationsSchema = z.object({
  head: armorLocationValue("Head armor"),
  torso: armorLocationValue("Torso armor"),
  rightHand: armorLocationValue("Right hand armor"),
  leftHand: armorLocationValue("Left hand armor"),
  rightLeg: armorLocationValue("Right leg armor"),
  leftLeg: armorLocationValue("Left leg armor"),
});
export type ArmorLocations = z.infer<typeof ArmorLocationsSchema>;

// --- Attacks -------------------------------------------------------

export const AttackSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Attack name is required.")
    .max(60, "Attack name must be 60 characters or fewer."),
  skill: SkillNameSchema,
  damage: z
    .string()
    .trim()
    .min(1, "Damage is required.")
    .max(30, "Damage must be 30 characters or fewer."),
  effect: z
    .string()
    .trim()
    .max(300, "Effect must be 300 characters or fewer.")
    .optional(),
  rof: z
    .number()
    .int("ROF must be a whole number.")
    .min(1, "ROF must be at least 1."),
});
export type Attack = z.infer<typeof AttackSchema>;

// --- Abilities -------------------------------------------------------

export const AbilitySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Ability name is required.")
    .max(60, "Ability name must be 60 characters or fewer."),
  description: z
    .string()
    .trim()
    .min(1, "Ability description is required.")
    .max(1000, "Ability description must be 1000 characters or fewer."),
});
export type Ability = z.infer<typeof AbilitySchema>;

// --- Loot -------------------------------------------------------

export const LootItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Loot item name is required.")
    .max(60, "Loot item name must be 60 characters or fewer."),
  // Free text on purpose: quantities are often dice notation ("1d6/2"),
  // not always a plain integer.
  quantity: z
    .string()
    .trim()
    .min(1, "Quantity is required.")
    .max(20, "Quantity must be 20 characters or fewer."),
});
export type LootItem = z.infer<typeof LootItemSchema>;

// --- Threat rating & bounty -------------------------------------------------------

export const THREAT_DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;
export const THREAT_COMPLEXITIES = ["SIMPLE", "COMPLEX", "DIFFICULT"] as const;
export const ThreatDifficultySchema = z.enum(THREAT_DIFFICULTIES);
export const ThreatComplexitySchema = z.enum(THREAT_COMPLEXITIES);

export const ThreatRatingSchema = z.object({
  difficulty: ThreatDifficultySchema,
  complexity: ThreatComplexitySchema,
});
export type ThreatRating = z.infer<typeof ThreatRatingSchema>;

// --- Flavor / lore -------------------------------------------------------

export const LoreExcerptSchema = z.object({
  dc: z
    .number()
    .int("DC must be a whole number.")
    .min(1, "DC must be at least 1."),
  text: z
    .string()
    .trim()
    .min(1, "Lore text is required.")
    .max(1000, "Lore text must be 1000 characters or fewer."),
});
export type LoreExcerpt = z.infer<typeof LoreExcerptSchema>;

const flavorField = (label: string, max: number) =>
  z
    .string()
    .trim()
    .max(max, `${label} must be ${max} characters or fewer.`)
    .optional();

export const FlavorSchema = z.object({
  height: flavorField("Height", 40),
  weight: flavorField("Weight", 40),
  environment: flavorField("Environment", 200),
  // Not named "intelligence" — that word is the INT stat key.
  intelligenceDescription: flavorField("Intelligence description", 300),
  organization: flavorField("Organization", 200),
  commonerSuperstition: LoreExcerptSchema.optional(),
  witcherKnowledge: LoreExcerptSchema.optional(),
});
export type Flavor = z.infer<typeof FlavorSchema>;

// --- The single nested shape -------------------------------------------------------

export const NpcDetailsSchema = z.object({
  coreStats: CoreStatsSchema,
  skills: SkillValuesSchema.default({}),
  vitalStats: VitalStatsSchema,
  armor: ArmorLocationsSchema.optional(),
  attacks: z.array(AttackSchema).default([]),
  abilities: z.array(AbilitySchema).default([]),
  weaknesses: z
    .array(z.string().trim().min(1, "Weakness cannot be empty."))
    .default([]),
  loot: z.array(LootItemSchema).default([]),
  threatRating: ThreatRatingSchema.optional(),
  bounty: z
    .number()
    .int("Bounty must be a whole number.")
    .min(0, "Bounty cannot be negative.")
    .optional(),
  flavor: FlavorSchema.optional(),
});
export type NpcDetailsInput = z.infer<typeof NpcDetailsSchema>;

// --- Header (name + threat + bounty, edited together as one card) -----------------

export const HeaderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(100, "Name must be 100 characters or fewer."),
  threatRating: ThreatRatingSchema,
  bounty: z
    .number()
    .int("Bounty must be a whole number.")
    .min(0, "Bounty cannot be negative."),
});
export type HeaderInput = z.infer<typeof HeaderSchema>;

// --- Safe parsing of the Prisma Json column -------------------------------------------------------

/**
 * Parses a raw value read from `CustomNpc.details` (Prisma's `Json?`
 * column — effectively `unknown`) into the typed shape. Returns
 * undefined for null/missing/malformed data instead of throwing, so a
 * stale or hand-edited row degrades to "no stat data" rather than
 * crashing a read path.
 */
export function parseNpcDetails(value: unknown): NpcDetailsInput | undefined {
  if (value === null || value === undefined) return undefined;
  const result = NpcDetailsSchema.safeParse(value);
  return result.success ? result.data : undefined;
}
