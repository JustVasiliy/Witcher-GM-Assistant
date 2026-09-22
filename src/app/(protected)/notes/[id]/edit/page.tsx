import { notFound } from "next/navigation";
import { auth } from "@/core/auth/auth";
import { getNoteById, NoteForm } from "@/modules/notes";

export default async function EditNotePage({
  params,
}: PageProps<"/notes/[id]/edit">) {
  const { id } = await params;
  const session = await auth();
  const note = session?.user ? await getNoteById(id, session.user.id) : null;

  if (!note) {
    notFound();
  }

  return <NoteForm note={note} />;
}
