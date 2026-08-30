"use client";

import { Button } from "@/core/ui";
import { deleteCampaign } from "../actions";

type DeleteCampaignButtonProps = {
  id: string;
};

export function DeleteCampaignButton({ id }: DeleteCampaignButtonProps) {
  return (
    <form
      action={deleteCampaign.bind(null, id)}
      onSubmit={(event) => {
        if (!window.confirm("Delete this campaign? This cannot be undone.")) {
          event.preventDefault();
        }
      }}
    >
      <Button type="submit">Delete campaign</Button>
    </form>
  );
}
