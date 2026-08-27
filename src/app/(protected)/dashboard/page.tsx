import { auth } from "@/core/auth/auth";
import { LogoutButton } from "@/modules/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div>
      <h1>Welcome, {session?.user?.name ?? "Game Master"}</h1>
      <LogoutButton />
    </div>
  );
}
