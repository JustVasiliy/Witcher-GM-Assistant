"use client";

import { LinkButton } from "@/core/ui";
import type { Note } from "../types";
import { DeleteNoteButton } from "./DeleteNoteButton";
import {
  Header,
  NoteActions,
  NoteContent,
  NoteRow,
  NoteTitle,
  NotesGrid,
  Page,
} from "./NoteList.styles";

type NoteListProps = {
  notes: Note[];
};

export function NoteList({ notes }: NoteListProps) {
  return (
    <Page>
      <Header>
        <div>
          <h1>Notes</h1>
          <p>Freeform notes you can attach to session encounters.</p>
        </div>
        <LinkButton href="/notes/new">+ New Note</LinkButton>
      </Header>
      <NotesGrid>
        {notes.length === 0 && <p>No notes yet.</p>}
        {notes.map((note) => (
          <NoteRow key={note.id}>
            <NoteTitle>{note.title}</NoteTitle>
            <NoteContent>{note.content}</NoteContent>
            <NoteActions>
              <LinkButton href={`/notes/${note.id}/edit`}>Edit</LinkButton>
              <DeleteNoteButton id={note.id} />
            </NoteActions>
          </NoteRow>
        ))}
      </NotesGrid>
    </Page>
  );
}
