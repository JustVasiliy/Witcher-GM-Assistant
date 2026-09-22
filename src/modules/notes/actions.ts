"use server";

import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/core/auth/auth";
import { prisma } from "@/core/db";
import { NoteSchema } from "./schemas";
import { getNoteById } from "./queries";
import type { NoteFormState } from "./types";

function parseNoteFormData(formData: FormData) {
  return NoteSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });
}

export async function createNote(
  _prevState: NoteFormState,
  formData: FormData,
): Promise<NoteFormState> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const validatedFields = parseNoteFormData(formData);
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  await prisma.note.create({
    data: {
      title: validatedFields.data.title,
      content: validatedFields.data.content,
      userId: session.user.id,
    },
  });

  revalidatePath("/notes");
  redirect("/notes");
}

export async function updateNote(
  id: string,
  _prevState: NoteFormState,
  formData: FormData,
): Promise<NoteFormState> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const existing = await getNoteById(id, session.user.id);
  if (!existing) {
    notFound();
  }

  const validatedFields = parseNoteFormData(formData);
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  await prisma.note.update({
    where: { id },
    data: {
      title: validatedFields.data.title,
      content: validatedFields.data.content,
    },
  });

  revalidatePath("/notes");
  redirect("/notes");
}

export async function deleteNote(id: string) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  await prisma.note.deleteMany({ where: { id, userId: session.user.id } });

  revalidatePath("/notes");
  redirect("/notes");
}
