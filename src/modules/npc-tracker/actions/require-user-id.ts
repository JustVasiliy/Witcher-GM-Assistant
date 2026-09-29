import { redirect } from "next/navigation";
import { auth } from "@/core/auth/auth";

export async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session.user.id;
}
