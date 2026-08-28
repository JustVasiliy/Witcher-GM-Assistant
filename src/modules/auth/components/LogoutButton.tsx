"use client";

import { Button } from "@/core/ui";
import { logout } from "../actions";

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button type="submit">Log out</Button>
    </form>
  );
}
