"use client";

import { Button } from "@/core/ui";
import { deleteCustomNpc } from "../actions";

type DeleteCustomNpcButtonProps = {
  id: string;
};

export function DeleteCustomNpcButton({ id }: DeleteCustomNpcButtonProps) {
  return (
    <form
      action={deleteCustomNpc.bind(null, id)}
      onSubmit={(event) => {
        if (!window.confirm("Delete this custom NPC? This cannot be undone.")) {
          event.preventDefault();
        }
      }}
    >
      <Button type="submit" aria-label="Delete custom NPC">
        Delete
      </Button>
    </form>
  );
}
