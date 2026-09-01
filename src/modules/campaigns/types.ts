import type { Campaign, CampaignSession } from "@/generated/prisma/client";

export type FieldErrors = Record<string, string[] | undefined>;

export type CampaignFormState =
  | {
      errors?: FieldErrors;
      message?: string;
    }
  | undefined;

export type SessionFormState = CampaignFormState;

export type CampaignWithSessionCount = Campaign & {
  _count: { sessions: number };
};

export type CampaignWithSessions = Campaign & {
  sessions: CampaignSession[];
};
