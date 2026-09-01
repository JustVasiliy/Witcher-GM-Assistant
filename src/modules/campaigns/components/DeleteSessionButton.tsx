"use client";

import { Button } from "@/core/ui";
import { deleteSession } from "../actions";

type DeleteSessionButtonProps = {
  campaignId: string;
  sessionId: string;
};

export function DeleteSessionButton({
  campaignId,
  sessionId,
}: DeleteSessionButtonProps) {
  return (
    <form
      action={deleteSession.bind(null, campaignId, sessionId)}
      onSubmit={(event) => {
        if (!window.confirm("Delete this session? This cannot be undone.")) {
          event.preventDefault();
        }
      }}
    >
      <Button type="submit">Delete session</Button>
    </form>
  );
}
