import { auth } from "@/core/auth/auth";
import { listNotesForUser, NoteList } from "@/modules/notes";

export default async function NotesPage() {
  const session = await auth();
  const notes = session?.user ? await listNotesForUser(session.user.id) : [];

  return <NoteList notes={notes} />;
}
