"use server";

import { AuthError } from "next-auth";
import { hashPassword } from "@/core/auth/password";
import { prisma } from "@/core/db";
import { signIn, signOut } from "@/core/auth/auth";
import { getUserByEmail } from "./queries";
import { LoginSchema, RegisterSchema } from "./schemas";
import type { LoginFormState, RegisterFormState } from "./types";

export async function register(
  _prevState: RegisterFormState,
  formData: FormData,
): Promise<RegisterFormState> {
  const validatedFields = RegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { name, email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { message: "An account with this email already exists." };
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.create({
    data: { name, email, password: passwordHash },
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: "Account created. Please log in." };
    }
    throw error;
  }

  return undefined;
}

export async function login(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  try {
    await signIn("credentials", {
      ...validatedFields.data,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { message: "Invalid email or password." };
      }
      return { message: "Something went wrong. Please try again." };
    }
    throw error;
  }

  return undefined;
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}
