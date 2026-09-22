"use client";

import { Button } from "@/core/ui";
import { deleteNote } from "../actions";

type DeleteNoteButtonProps = {
  id: string;
};

export function DeleteNoteButton({ id }: DeleteNoteButtonProps) {
  return (
    <form
      action={deleteNote.bind(null, id)}
      onSubmit={(event) => {
        if (!window.confirm("Delete this note? This cannot be undone.")) {
          event.preventDefault();
        }
      }}
    >
      <Button type="submit">Delete</Button>
    </form>
  );
}
