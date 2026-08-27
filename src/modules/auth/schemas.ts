import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z
    .string()
    .trim()
    .pipe(z.email("Enter a valid email address.").toLowerCase()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character.",
    ),
});

export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .pipe(z.email("Enter a valid email address.").toLowerCase()),
  password: z.string().min(1, "Password is required."),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
