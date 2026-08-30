export type FieldErrors = Record<string, string[] | undefined>;

export type CampaignFormState =
  | {
      errors?: FieldErrors;
      message?: string;
    }
  | undefined;
