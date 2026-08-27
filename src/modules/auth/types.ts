export type FieldErrors = Record<string, string[] | undefined>;

export type RegisterFormState =
  | {
      errors?: FieldErrors;
      message?: string;
    }
  | undefined;

export type LoginFormState =
  | {
      errors?: FieldErrors;
      message?: string;
    }
  | undefined;
