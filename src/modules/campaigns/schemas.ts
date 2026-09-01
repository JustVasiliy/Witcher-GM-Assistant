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
  imageUrl: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z
      .string()
      .trim()
      .max(2048, "Image URL must be 2048 characters or fewer.")
      .url("Enter a valid image URL.")
      .optional(),
  ),
  playerCount: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.coerce
      .number()
      .int("Player count must be a whole number.")
      .min(0, "Player count cannot be negative.")
      .max(99, "Player count must be 99 or fewer.")
      .optional(),
  ),
});

export type CampaignInput = z.infer<typeof CampaignSchema>;

export const CampaignSessionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(150, "Title must be 150 characters or fewer."),
  date: z
    .string()
    .trim()
    .min(1, "Date is required.")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date."),
  playerCount: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.coerce
      .number()
      .int("Player count must be a whole number.")
      .min(0, "Player count cannot be negative.")
      .max(99, "Player count must be 99 or fewer.")
      .optional(),
  ),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be 2000 characters or fewer.")
    .optional(),
});

export type CampaignSessionInput = z.infer<typeof CampaignSessionSchema>;
