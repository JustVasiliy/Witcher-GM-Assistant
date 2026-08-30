import { z } from "zod";

export const CampaignSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(100, "Name must be 100 characters or fewer."),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be 2000 characters or fewer.")
    .optional(),
});

export type CampaignInput = z.infer<typeof CampaignSchema>;
