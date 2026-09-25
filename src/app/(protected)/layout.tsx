import { redirect } from "next/navigation";
import { auth } from "@/core/auth/auth";
import { AppShell } from "@/core/ui";
import { LogoutButton } from "@/modules/auth";
import { RollHistorySidebar } from "@/modules/roll-history";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <AppShell
      user={session.user}
      headerActions={<LogoutButton />}
      rightPanel={<RollHistorySidebar userId={session.user.id} />}
    >
      {children}
    </AppShell>
  );
}
